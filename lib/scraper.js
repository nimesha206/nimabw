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

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

// Video ID extract
function getVideoId(url) {
	return url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&\n?#]+)/)?.[1] || null;
}

// ───────────────────────────────────────────
// API 1: zylalabs / youtube-mp36 (RapidAPI free)
// ───────────────────────────────────────────
async function api_zyla(videoId, type = 'mp3') {
	const host = type === 'mp3' ? 'youtube-mp36.p.rapidapi.com' : 'youtube-mp3-downloader2.p.rapidapi.com';
	const url = type === 'mp3'
		? `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`
		: `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp4/?url=https://www.youtube.com/watch?v=${videoId}`;

	const res = await fetch(url, {
		headers: {
			'x-rapidapi-host': host,
			'x-rapidapi-key': '3bde5a3ca1msh6a3c2e0e02d1fdap142e7bjsn8f5a2e0e3c4a'
		}
	});
	const data = await res.json();
	if (!data.link && !data.url && !data.dl_url) throw new Error('zyla: no link');
	return data.link || data.url || data.dl_url;
}

// ───────────────────────────────────────────
// API 2: loader.to (free, no key)
// ───────────────────────────────────────────
async function api_loader(url, format = 'mp3') {
	const res = await fetch(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=${format}`, {
		headers: { 'Accept': 'application/json' }
	});
	const data = await res.json();
	if (!data?.success) throw new Error('loader.to: failed');

	// Poll for result
	for (let i = 0; i < 20; i++) {
		await new Promise(r => setTimeout(r, 3000));
		const prog = await fetch(`https://p.oceansaver.in/ajax/progress.php?id=${data.id}`);
		const p = await prog.json();
		if (p?.download_url) return p.download_url;
		if (p?.progress === 1000) return p.download_url;
	}
	throw new Error('loader.to: timeout');
}

// ───────────────────────────────────────────
// API 3: yt-download.org (free)
// ───────────────────────────────────────────
async function api_ytdownload(videoId, format = 'mp3') {
	const res = await fetch(`https://www.yt-download.org/api/button/${format}/${videoId}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			'Accept': 'application/json'
		}
	});
	const text = await res.text();
	const match = text.match(/href="(https:\/\/[^"]+\.mp[34][^"]*)"/);
	if (!match) throw new Error('yt-download: no link found');
	return match[1];
}

// ───────────────────────────────────────────
// API 4: n3r4zzurr0 / y2down (free)
// ───────────────────────────────────────────
async function api_y2down(url, type = 'audio') {
	const res = await fetch('https://ssyoutube.com/api/convert', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ url, type })
	});
	const data = await res.json();
	const link = data?.links?.find(l => l.q === '128kbps' || l.q === 'mp3' || l.extension === 'mp3');
	if (!link?.url) throw new Error('y2down: no audio link');
	return link.url;
}

// ───────────────────────────────────────────
// API 5: YT-dlp with cookies workaround
// ───────────────────────────────────────────
function run(cmd) {
	return new Promise((res, rej) => {
		exec(cmd, { maxBuffer: 1024 * 1024 * 200 }, (err, stdout, stderr) => {
			if (err) return rej(new Error(stderr || err.message));
			res(stdout.trim());
		});
	});
}

async function api_ytdlp_url(url, type = 'audio') {
	// Get direct URL without downloading (faster)
	const flags = `--no-playlist --extractor-args "youtube:player_client=web,mweb" --no-warnings`;
	const format = type === 'audio'
		? `-f "bestaudio[ext=m4a]/bestaudio" --get-url`
		: `-f "best[height<=480]/best" --get-url`;

	const cmd = `yt-dlp ${flags} ${format} "${url}"`;
	const result = await run(cmd);
	if (!result) throw new Error('yt-dlp: no URL returned');
	return result.split('\n')[0]; // first URL
}

// ───────────────────────────────────────────
// YouTube info (title, thumb, etc)
// ───────────────────────────────────────────
async function getYtInfo(url) {
	try {
		const videoId = getVideoId(url);
		if (!videoId) return {};
		// Use oEmbed API (free, no key)
		const res = await fetch(`https://www.youtube.com/oembed?url=https://youtu.be/${videoId}&format=json`);
		const data = await res.json();
		return {
			title: data.title || 'YouTube',
			channel: data.author_name || '',
			thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
			uploadDate: ''
		};
	} catch {
		return { title: 'YouTube', channel: '', thumb: '', uploadDate: '' };
	}
}

// ───────────────────────────────────────────
// MAIN: ytMp3
// ───────────────────────────────────────────
async function ytMp3(url) {
	const videoId = getVideoId(url);
	if (!videoId) throw new Error('Invalid YouTube URL');

	const info = await getYtInfo(url);
	let dlUrl = null;

	const methods = [
		{ name: 'yt-dlp (web client)', fn: () => api_ytdlp_url(url, 'audio') },
		{ name: 'loader.to', fn: () => api_loader(url, 'mp3') },
		{ name: 'yt-download.org', fn: () => api_ytdownload(videoId, 'mp3') },
		{ name: 'zyla rapidapi', fn: () => api_zyla(videoId, 'mp3') },
	];

	for (const method of methods) {
		try {
			console.log(`[ytMp3] Trying: ${method.name}`);
			dlUrl = await method.fn();
			if (dlUrl) { console.log(`[ytMp3] ✅ Success: ${method.name}`); break; }
		} catch (e) {
			console.log(`[ytMp3] ❌ ${method.name}: ${e.message}`);
		}
	}

	if (!dlUrl) throw new Error('සියලු download methods fail වුණා!');

	return {
		title: info.title || 'YouTube Audio',
		result: { url: dlUrl },
		size: 'Unknown',
		thumb: info.thumb || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
		views: 0, likes: 0, dislike: 0,
		channel: info.channel || '',
		uploadDate: info.uploadDate || '',
		desc: ''
	};
}

// ───────────────────────────────────────────
// MAIN: ytMp4
// ───────────────────────────────────────────
async function ytMp4(url) {
	const videoId = getVideoId(url);
	if (!videoId) throw new Error('Invalid YouTube URL');

	const info = await getYtInfo(url);
	let dlUrl = null;

	const methods = [
		{ name: 'yt-dlp (web client)', fn: () => api_ytdlp_url(url, 'video') },
		{ name: 'loader.to', fn: () => api_loader(url, 'mp4') },
		{ name: 'yt-download.org', fn: () => api_ytdownload(videoId, 'mp4') },
	];

	for (const method of methods) {
		try {
			console.log(`[ytMp4] Trying: ${method.name}`);
			dlUrl = await method.fn();
			if (dlUrl) { console.log(`[ytMp4] ✅ Success: ${method.name}`); break; }
		} catch (e) {
			console.log(`[ytMp4] ❌ ${method.name}: ${e.message}`);
		}
	}

	if (!dlUrl) throw new Error('සියලු download methods fail වුණා!');

	return {
		title: info.title || 'YouTube Video',
		result: { url: dlUrl },
		size: 'Unknown',
		thumb: info.thumb || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
		views: 0, likes: 0, dislike: 0,
		channel: info.channel || '',
		uploadDate: info.uploadDate || '',
		desc: ''
	};
}

module.exports = { ytMp4, ytMp3 };
