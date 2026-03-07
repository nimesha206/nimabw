const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function bytesToSize(bytes) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "n/a";
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
	if (i === 0) return `${bytes} ${sizes[i]}`;
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

function run(cmd) {
	return new Promise((res, rej) => {
		exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (err, stdout, stderr) => {
			if (err) return rej(new Error(stderr || err.message));
			res(stdout.trim());
		});
	});
}

async function ytMp3(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const outPath = path.join('./database/temp', `audio_${Date.now()}`);

			// Get info
			const infoRaw = await run(`yt-dlp --dump-json --no-playlist "${url}"`);
			const info = JSON.parse(infoRaw);

			// Download audio
			await run(`yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${outPath}.%(ext)s" "${url}"`);

			// Find downloaded file
			const files = fs.readdirSync('./database/temp').filter(f => f.startsWith(path.basename(outPath)));
			if (!files.length) return reject(new Error('File not found after download'));

			const filePath = path.join('./database/temp', files[0]);
			const result = fs.readFileSync(filePath);
			const size = await bytesToSize(result.length);
			fs.unlinkSync(filePath);

			resolve({
				title: info.title || 'Unknown',
				result,
				size,
				thumb: info.thumbnail || '',
				views: info.view_count || 0,
				likes: info.like_count || 0,
				dislike: 0,
				channel: info.uploader || info.channel || 'Unknown',
				uploadDate: info.upload_date || '',
				desc: info.description || ''
			});
		} catch (e) {
			reject(e);
		}
	});
}

async function ytMp4(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const outPath = path.join('./database/temp', `video_${Date.now()}`);

			const infoRaw = await run(`yt-dlp --dump-json --no-playlist "${url}"`);
			const info = JSON.parse(infoRaw);

			await run(`yt-dlp -f "best[height<=480]/best" --no-playlist -o "${outPath}.%(ext)s" "${url}"`);

			const files = fs.readdirSync('./database/temp').filter(f => f.startsWith(path.basename(outPath)));
			if (!files.length) return reject(new Error('File not found after download'));

			const filePath = path.join('./database/temp', files[0]);
			const result = fs.readFileSync(filePath);
			const size = await bytesToSize(result.length);
			fs.unlinkSync(filePath);

			resolve({
				title: info.title || 'Unknown',
				result,
				size,
				thumb: info.thumbnail || '',
				views: info.view_count || 0,
				likes: info.like_count || 0,
				dislike: 0,
				channel: info.uploader || info.channel || 'Unknown',
				uploadDate: info.upload_date || '',
				desc: info.description || ''
			});
		} catch (e) {
			reject(e);
		}
	});
}

module.exports = { ytMp4, ytMp3 }

// TEST
if (require.main === module) {
	console.log('Testing ytMp3...');
	ytMp3('https://www.youtube.com/watch?v=VfbPrCB6S90')
		.then(r => console.log('SUCCESS:', r.title, '|', r.size))
		.catch(e => console.error('ERROR:', e.message));
}
