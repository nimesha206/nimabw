const fs = require('fs');
const path = require('path');
const playdl = require('play-dl');

async function bytesToSize(bytes) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "n/a";
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	if (i === 0) return `${bytes} ${sizes[i]}`;
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

async function ytMp3(url) {
	return new Promise(async (resolve, reject) => {
		try {
			// Get video info
			const info = await playdl.video_info(url);
			const details = info.video_details;

			const title = details.title || 'Unknown';
			const thumb = details.thumbnails?.slice(-1)[0]?.url || '';
			const channel = details.channel?.name || 'Unknown';
			const views = details.views || 0;
			const uploadDate = details.uploadedAt || '';
			const desc = details.description || '';

			// Stream best audio
			const stream = await playdl.stream(url, { quality: 0 });

			const chunks = [];
			stream.stream.on('data', chunk => chunks.push(chunk));
			stream.stream.on('end', async () => {
				const result = Buffer.concat(chunks);
				const size = await bytesToSize(result.length);
				resolve({ title, result, size, thumb, views, likes: 0, dislike: 0, channel, uploadDate, desc });
			});
			stream.stream.on('error', reject);
		} catch (e) {
			reject(e);
		}
	});
}

async function ytMp4(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const outputPath = path.join('./database/temp', `output_${Date.now()}.mp4`);

			const info = await playdl.video_info(url);
			const details = info.video_details;

			const title = details.title || 'Unknown';
			const thumb = details.thumbnails?.slice(-1)[0]?.url || '';
			const channel = details.channel?.name || 'Unknown';
			const views = details.views || 0;
			const uploadDate = details.uploadedAt || '';
			const desc = details.description || '';

			// Stream video (lowest quality to keep size small)
			const stream = await playdl.stream(url, { quality: 2 });

			const chunks = [];
			stream.stream.on('data', chunk => chunks.push(chunk));
			stream.stream.on('end', async () => {
				const result = Buffer.concat(chunks);
				const size = await bytesToSize(result.length);
				resolve({ title, result, size, thumb, views, likes: 0, dislike: 0, channel, uploadDate, desc });
			});
			stream.stream.on('error', reject);
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = { ytMp4, ytMp3 }

// TEST - node lib/scraper.js gahala balanna
if (require.main === module) {
	console.log('Testing ytMp3...');
	ytMp3('https://www.youtube.com/watch?v=VfbPrCB6S90')
		.then(r => console.log('SUCCESS:', r.title, '|', r.size))
		.catch(e => console.error('ERROR:', e.message));
}
