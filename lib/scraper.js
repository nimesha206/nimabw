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

async function ytMp4(url, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const outputPath = path.join('./database/temp', `output_${Date.now()}.mp4`);

            // Get video info
            const infoJson = await new Promise((res, rej) => {
                exec(`yt-dlp --dump-json --no-playlist "${url}"`, (error, stdout, stderr) => {
                    if (error) return rej(new Error(stderr || error.message));
                    res(stdout.trim());
                });
            });

            const info = JSON.parse(infoJson);
            const title = info.title || 'Unknown';
            const channel = info.uploader || info.channel || 'Unknown';
            const uploadDate = info.upload_date || '';
            const views = info.view_count || 0;
            const likes = info.like_count || 0;
            const thumb = info.thumbnail || '';
            const desc = info.description || '';

            // Download video + audio merged (best quality, max 480p to avoid size issues)
            await new Promise((res, rej) => {
                exec(`yt-dlp -f "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best[height<=480]" --merge-output-format mp4 --no-playlist -o "${outputPath}" "${url}"`, (error, stdout, stderr) => {
                    if (error) return rej(new Error(stderr || error.message));
                    res();
                });
            });

            const result = fs.readFileSync(outputPath);
            const size = await bytesToSize(result.length);
            await fs.promises.unlink(outputPath).catch(() => {});

            resolve({
                title,
                result,
                size,
                thumb,
                views,
                likes,
                dislike: 0,
                channel,
                uploadDate,
                desc,
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function ytMp3(url, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const outputPath = path.join('./database/temp', `audio_${Date.now()}.mp3`);

            // Get video info
            const infoJson = await new Promise((res, rej) => {
                exec(`yt-dlp --dump-json --no-playlist "${url}"`, (error, stdout, stderr) => {
                    if (error) return rej(new Error(stderr || error.message));
                    res(stdout.trim());
                });
            });

            const info = JSON.parse(infoJson);
            const title = info.title || 'Unknown';
            const channel = info.uploader || info.channel || 'Unknown';
            const uploadDate = info.upload_date || '';
            const views = info.view_count || 0;
            const likes = info.like_count || 0;
            const thumb = info.thumbnail || '';
            const desc = info.description || '';

            // Download audio as mp3
            await new Promise((res, rej) => {
                exec(`yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${outputPath}" "${url}"`, (error, stdout, stderr) => {
                    if (error) return rej(new Error(stderr || error.message));
                    res();
                });
            });

            const result = fs.readFileSync(outputPath);
            const size = await bytesToSize(result.length);
            await fs.promises.unlink(outputPath).catch(() => {});

            resolve({ title, result, size, thumb, views, likes, dislike: 0, channel, uploadDate, desc });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
	ytMp4,
	ytMp3
}
