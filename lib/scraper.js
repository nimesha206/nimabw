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

function ytExec(cmd) {
	return new Promise((res, rej) => {
		exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
			if (error) return rej(new Error(stderr || error.message));
			res(stdout.trim());
		});
	});
}

const YT_FLAGS = `--no-playlist --no-check-certificates --extractor-args "youtube:player_client=ios,web" --user-agent "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"`;

async function ytMp4(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const outputPath = path.join('./database/temp', `output_${Date.now()}.mp4`);

			const infoJson = await ytExec(`yt-dlp --dump-json ${YT_FLAGS} "${url}"`);
			const info = JSON.parse(infoJson);

			await ytExec(`yt-dlp -f "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best[height<=480]" --merge-output-format mp4 ${YT_FLAGS} -o "${outputPath}" "${url}"`);

			const result = fs.readFileSync(outputPath);
			const size = await bytesToSize(result.length);
			await fs.promises.unlink(outputPath).catch(() => {});

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

async function ytMp3(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const outputPath = path.join('./database/temp', `audio_${Date.now()}.mp3`);

			const infoJson = await ytExec(`yt-dlp --dump-json ${YT_FLAGS} "${url}"`);
			const info = JSON.parse(infoJson);

			await ytExec(`yt-dlp -x --audio-format mp3 --audio-quality 0 ${YT_FLAGS} -o "${outputPath}" "${url}"`);

			const result = fs.readFileSync(outputPath);
			const size = await bytesToSize(result.length);
			await fs.promises.unlink(outputPath).catch(() => {});

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
