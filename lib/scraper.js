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

function getVideoId(url) {
	return url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&\n?#]+)/)?.[1] || null;
}

// ───────────────────────────────────────────
// API 1: cobalt.tools (free, no key, reliable)
// ───────────────────────────────────────────
async function api_cobalt(url, type = 'audio') {
	const body = type === 'audio'
		? { url, downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128' }
		: { url, downloadMode: 'auto', videoQuality: '720' };

	const res = await fetch('https://api.cobalt.tools/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'User-Agent': 'Mozilla/5.0'
		},
		body: JSON.stringify(body)
	});
	const data = await res.json();
	if (data?.status === 'redirect' || data?.status === 'tunnel') return data.url;
	if (data?.url) return data.url;
	throw new Error(`cobalt: ${data?.error?.code || 'no link'}`);
}

// ───────────────────────────────────────────
// API 2: y2mate (free)
// ───────────────────────────────────────────
async function api_y2mate(url, type = 'mp3') {
	const videoId = getVideoId(url);
	if (!videoId) throw new Error('y2mate: invalid url');

	const res1 = await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
		},
		body: new URLSearchParams({
			k_query: `https://www.youtube.com/watch?v=${videoId}`,
			k_page: 'home',
			hl: 'en',
			q_auto: '1'
		})
	});
	const d1 = await res1.json();
	if (!d1?.result) throw new Error('y2mate: analyze failed');

	const links = type === 'mp3' ? d1.result?.kc : d1.result?.kd;
	const quality = type === 'mp3'
		? Object.entries(links || {}).find(([k]) => k.includes('128') || k.includes('mp3'))
		: Object.entries(links || {}).find(([k]) => k.includes('720') || k.includes('360'));

	if (!quality) throw new Error('y2mate: no suitable quality');
	const [k, info] = quality;

	const res2 = await fetch('https://www.y2mate.com/mates/convertV2/index', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0'
		},
		body: new URLSearchParams({ vid: videoId, k: info.k || k })
	});
	const d2 = await res2.json();
	if (!d2?.dlink) throw new Error('y2mate: no download link');
	return d2.dlink;
}

// ───────────────────────────────────────────
// API 3: yt1s.com (free)
// ───────────────────────────────────────────
async function api_yt1s(url, type = 'mp3') {
	const videoId = getVideoId(url);
	if (!videoId) throw new Error('yt1s: invalid url');

	const res1 = await fetch('https://yt1s.com/api/ajaxSearch/index', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0'
		},
		body: new URLSearchParams({
			q: `https://www.youtube.com/watch?v=${videoId}`,
			vt: type === 'mp3' ? 'mp3' : 'mp4'
		})
	});
	const d1 = await res1.json();
	if (!d1?.result) throw new Error('yt1s: search failed');

	const qualities = type === 'mp3' ? d1.result?.mp3?.mp3 : d1.result?.mp4?.mp4;
	const keys = Object.keys(qualities || {});
	if (!keys.length) throw new Error('yt1s: no qualities');

	const res2 = await fetch('https://yt1s.com/api/ajaxConvert/convert', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0'
		},
		body: new URLSearchParams({ vid: videoId, k: keys[0] })
	});
	const d2 = await res2.json();
	if (!d2?.dlink) throw new Error('yt1s: no download link');
	return d2.dlink;
}

// ───────────────────────────────────────────
// API 4: loader.to (free, no key)
// ───────────────────────────────────────────
async function api_loader(url, format = 'mp3') {
	const res = await fetch(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=${format}`, {
		headers: { 'Accept': 'application/json' }
	});
	const data = await res.json();
	if (!data?.success) throw new Error('loader.to: failed');

	for (let i = 0; i < 20; i++) {
		await new Promise(r => setTimeout(r, 3000));
		const prog = await fetch(`https://p.oceansaver.in/ajax/progress.php?id=${data.id}`);
		const p = await prog.json();
		if (p?.download_url) return p.download_url;
	}
	throw new Error('loader.to: timeout');
}

// ───────────────────────────────────────────
// API 5: zylalabs RapidAPI
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
// API 6: yt-dlp with tv_embedded client (bypass bot check)
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
	// tv_embedded + web_creator bypass bot detection without cookies
	const flags = `--no-playlist --extractor-args "youtube:player_client=tv_embedded,web_creator" --no-warnings`;
	const format = type === 'audio'
		? `-f "bestaudio[ext=m4a]/bestaudio" --get-url`
		: `-f "best[height<=480]/best" --get-url`;

	const cmd = `yt-dlp ${flags} ${format} "${url}"`;
	const result = await run(cmd);
	if (!result) throw new Error('yt-dlp: no URL returned');
	return result.split('\n')[0];
}

// ───────────────────────────────────────────
// YouTube info
// ───────────────────────────────────────────
async function getYtInfo(url) {
	try {
		const videoId = getVideoId(url);
		if (!videoId) return {};
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
		{ name: 'cobalt.tools', fn: () => api_cobalt(url, 'audio') },
		{ name: 'yt-dlp (tv_embedded)', fn: () => api_ytdlp_url(url, 'audio') },
		{ name: 'y2mate', fn: () => api_y2mate(url, 'mp3') },
		{ name: 'yt1s', fn: () => api_yt1s(url, 'mp3') },
		{ name: 'loader.to', fn: () => api_loader(url, 'mp3') },
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
		{ name: 'cobalt.tools', fn: () => api_cobalt(url, 'video') },
		{ name: 'yt-dlp (tv_embedded)', fn: () => api_ytdlp_url(url, 'video') },
		{ name: 'y2mate', fn: () => api_y2mate(url, 'mp4') },
		{ name: 'yt1s', fn: () => api_yt1s(url, 'mp4') },
		{ name: 'loader.to', fn: () => api_loader(url, 'mp4') },
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
