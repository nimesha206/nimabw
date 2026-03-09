const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const statusEmojis = ['❤️', '😍', '🤩', '😘', '🥰', '🤭', '😊', '💕', '✨'];
const messageStore = new Map();
const TEMP_MEDIA_DIR = path.join(__dirname, './database/temp');

// 🎵 YouTube සියලු ක්‍රම - මිලිටරි/මුබිල් ක්ලයින්ට
const YOUTUBE_DOWNLOAD_METHODS = [
	// yt-dlp Desktop clients
	{ name: 'yt-dlp (web)', cmd: (url) => `yt-dlp -x --audio-format mp3 "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (best)', cmd: (url) => `yt-dlp -x --audio-format mp3 --audio-quality 0 "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// yt-dlp Mobile clients (විකල්ප player)
	{ name: 'yt-dlp (android)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=android" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (ios)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=ios" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// yt-dlp Web clients (විකල්ප player)
	{ name: 'yt-dlp (web_creator)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=web_creator" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (mweb)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=mweb" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// yt-dlp Embedded/TV clients
	{ name: 'yt-dlp (tv_embedded)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=tv_embedded" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (vr)', cmd: (url) => `yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=vr" "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// yt-dlp with different formats
	{ name: 'yt-dlp (m4a)', cmd: (url) => `yt-dlp -x --audio-format m4a "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (opus)', cmd: (url) => `yt-dlp -x --audio-format opus "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (vorbis)', cmd: (url) => `yt-dlp -x --audio-format vorbis "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// yt-dlp with special flags
	{ name: 'yt-dlp (no_warnings)', cmd: (url) => `yt-dlp -x --audio-format mp3 --no-warnings "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'yt-dlp (quiet)', cmd: (url) => `yt-dlp -x --audio-format mp3 -q "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// youtube-dl fallback
	{ name: 'youtube-dl (legacy)', cmd: (url) => `youtube-dl -x --audio-format mp3 "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	{ name: 'youtube-dl (best)', cmd: (url) => `youtube-dl -x --audio-format mp3 --audio-quality 0 "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// spotifydl සඳහා
	{ name: 'spotifydl', cmd: (url) => `spotifydl "${url}" -o "${TEMP_MEDIA_DIR}/%(title)s.%(ext)s"` },
	
	// ffmpeg stream extraction
	{ name: 'ffmpeg (direct)', cmd: (url) => `ffmpeg -i "${url}" -q:a 0 -map a "${TEMP_MEDIA_DIR}/song.mp3" -y 2>/dev/null` },
	
	// curl + ffmpeg
	{ name: 'curl+ffmpeg', cmd: (url) => `curl -L "${url}" | ffmpeg -i - -q:a 0 -map a "${TEMP_MEDIA_DIR}/song.mp3" -y 2>/dev/null` },
	
	// wget fallback
	{ name: 'wget', cmd: (url) => `wget -q "${url}" -O - | ffmpeg -i - -q:a 0 -map a "${TEMP_MEDIA_DIR}/song.mp3" -y 2>/dev/null` },
	
	// aria2c multi-thread
	{ name: 'aria2c', cmd: (url) => `aria2c -d "${TEMP_MEDIA_DIR}" "${url}" && ffmpeg -i "${TEMP_MEDIA_DIR}/*" -q:a 0 -map a "${TEMP_MEDIA_DIR}/song.mp3" -y 2>/dev/null` }
];

if (!fs.existsSync(TEMP_MEDIA_DIR)) {
	fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

const getRandomEmoji = () => statusEmojis[Math.floor(Math.random() * statusEmojis.length)];

const getFolderSizeInMB = (folderPath) => {
	try {
		const files = fs.readdirSync(folderPath);
		let totalSize = 0;
		for (const file of files) {
			const filePath = path.join(folderPath, file);
			if (fs.statSync(filePath).isFile()) {
				totalSize += fs.statSync(filePath).size;
			}
		}
		return totalSize / (1024 * 1024);
	} catch (err) {
		return 0;
	}
};

const cleanTempFolderIfLarge = () => {
	try {
		const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);
		if (sizeMB > 100) {
			const files = fs.readdirSync(TEMP_MEDIA_DIR);
			for (const file of files) {
				const filePath = path.join(TEMP_MEDIA_DIR, file);
				fs.unlinkSync(filePath);
			}
		}
	} catch (err) {
		console.error('Temp cleanup error:', err);
	}
};

setInterval(cleanTempFolderIfLarge, 60 * 1000);

async function storeMessage(message) {
	try {
		if (!message.key?.id) return;

		const messageId = message.key.id;
		let content = '';
		let mediaType = '';
		let mediaPath = '';
		const sender = message.key.participant || message.key.remoteJid;

		if (message.message?.conversation) {
			content = message.message.conversation;
		} else if (message.message?.extendedTextMessage?.text) {
			content = message.message.extendedTextMessage.text;
		} else if (message.message?.imageMessage) {
			mediaType = 'ඡායාරූපයක් (Image)';
			content = message.message.imageMessage.caption || '';
			try {
				const buffer = await downloadContentFromMessage(message.message.imageMessage, 'image');
				mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
				await writeFile(mediaPath, buffer);
			} catch (e) {
				mediaPath = '';
			}
		} else if (message.message?.videoMessage) {
			mediaType = 'වීඩියෝවක් (Video)';
			content = message.message.videoMessage.caption || '';
			try {
				const buffer = await downloadContentFromMessage(message.message.videoMessage, 'video');
				mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
				await writeFile(mediaPath, buffer);
			} catch (e) {
				mediaPath = '';
			}
		}

		messageStore.set(messageId, {
			content,
			mediaType,
			mediaPath,
			sender,
			group: message.key.remoteJid.endsWith('@g.us') ? message.key.remoteJid : null,
			timestamp: new Date().toISOString()
		});

	} catch (err) {
		console.error('storeMessage error:', err);
	}
}

module.exports = shasikala = async (nimesha, m, msg, store) => {
	try {
		const botNumber = nimesha.decodeJid(nimesha.user.id);
		const isOwner = [botNumber.split('@')[0], ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
		
		const set = global.db?.set?.[botNumber] || {};
		const botFooter = global.db?.set?.[botNumber]?.botname 
			? `> 🌸 *${global.db.set[botNumber].botname}* [BOT]✨`
			: global.mess?.footer || '> 🌸 *MISS SHASIKALA* [BOT]✨ | 👑 _CREATED BY *NIMESHA MADHUSHAN* _';
		
		// 🎵 SONG DOWNLOAD FEATURE - {prefix}song "song name/youtube url"
		if (m.command === 'song' && m.text) {
			try {
				const songInput = m.text.trim();
				
				// YouTube URL ද song නම ද හඳුනාගන්න
				const isYoutubeUrl = songInput.includes('youtube.com') || songInput.includes('youtu.be') || songInput.includes('ytsearch:');
				const searchQuery = isYoutubeUrl ? songInput : `ytsearch:${songInput}`;
				
				// 1️⃣ SEARCHING MESSAGE - සොයමින් (beautiful type)
				const searchingMsg = `🔍 𝑺𝑬𝑨𝑹𝑪𝑯𝑰𝑵𝑮...
━━━━━━━━━━━━━━━━━━━━━━
🎵 *ගීතය:* ${songInput}
⏳ *ඉතිරි:* සොයමින් පවතී...
━━━━━━━━━━━━━━━━━━━━━━
${botFooter}`;

				let statusMsg = await nimesha.sendMessage(m.chat, { text: searchingMsg }, { quoted: m });

				// 2️⃣ DOWNLOADING MESSAGE - බාගනිමින්
				const downloadingMsg = `⬇️ 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫𝑰𝑵𝑮...
━━━━━━━━━━━━━━━━━━━━━━
🎵 *ගීතය:* ${songInput}
⏳ *ඉතිරි:* බාගනිමින් පවතී...
━━━━━━━━━━━━━━━━━━━━━━
${botFooter}`;

				await nimesha.sendMessage(m.chat, { text: downloadingMsg }, { quoted: statusMsg }).then(msg => statusMsg = msg);

				// 🎵 YouTube සියලු methods උත්සාහ කරන්න
				const downloadAttempts = [];
				let downloadSuccess = false;
				let successMethod = '';

				// 20+ Methods try කරන්න
				for (let i = 0; i < YOUTUBE_DOWNLOAD_METHODS.length; i++) {
					if (downloadSuccess) break;
					
					const method = YOUTUBE_DOWNLOAD_METHODS[i];
					downloadAttempts.push(`${i + 1}. ${method.name} ⏳`);
					
					try {
						await new Promise((resolve, reject) => {
							const cmd = method.cmd(searchQuery);
							exec(cmd, { 
								maxBuffer: 1024 * 1024 * 500, 
								timeout: 120000,
								shell: '/bin/bash'
							}, (err, stdout, stderr) => {
								if (err) reject(new Error(stderr || err.message));
								else resolve(stdout);
							});
						});
						
						// Check if file downloaded
						const files = fs.readdirSync(TEMP_MEDIA_DIR);
						const audioFile = files.find(f => f.endsWith('.mp3') || f.endsWith('.m4a') || f.endsWith('.opus'));
						
						if (audioFile) {
							downloadSuccess = true;
							successMethod = method.name;
							downloadAttempts[downloadAttempts.length - 1] = `${i + 1}. ${method.name} ✅`;
						} else {
							downloadAttempts[downloadAttempts.length - 1] = `${i + 1}. ${method.name} ❌`;
						}
					} catch (e) {
						downloadAttempts[downloadAttempts.length - 1] = `${i + 1}. ${method.name} ❌`;
					}
				}

				// උත්සාහ ප්‍රතිඝාතන දැක්වීම
				const attemptsLog = downloadAttempts.slice(0, 15).join('\n'); // Show first 15
				const moreCount = downloadAttempts.length > 15 ? downloadAttempts.length - 15 : 0;

				if (!downloadSuccess) {
					// ❌ සියලුම methods fail උනු විට
					const failMsg = `❌ 𝑬𝑹𝑹𝑶𝑹
━━━━━━━━━━━━━━━━━━━━━━
*ගීතය:* ${songInput}

*උත්සාහ:*
${attemptsLog}
${moreCount > 0 ? `\n+ ${moreCount} more methods failed` : ''}

━━━━━━━━━━━━━━━━━━━━━━
${botFooter}`;

					await nimesha.sendMessage(m.chat, { text: failMsg }, { quoted: statusMsg });
					return;
				}

				// ✅ download සාර්ථකයි - file එක හඳුනාගනිමින්
				const files = fs.readdirSync(TEMP_MEDIA_DIR);
				const audioFile = files.find(f => f.endsWith('.mp3') || f.endsWith('.m4a') || f.endsWith('.opus'));

				if (!audioFile) throw new Error('Audio file not found');

				// 3️⃣ UPLOADING MESSAGE - ලබාදෙමින්
				const uploadingMsg = `⬆️ 𝑼𝑷𝑳𝑶𝑨𝑫𝑰𝑵𝑮...
━━━━━━━━━━━━━━━━━━━━━━
🎵 *ගීතය:* ${songInput}
⏳ *ඉතිරි:* ලබාදෙමින් පවතී...
━━━━━━━━━━━━━━━━━━━━━━
${botFooter}`;

				await nimesha.sendMessage(m.chat, { text: uploadingMsg }, { quoted: statusMsg }).then(msg => statusMsg = msg);

				// 🎵 audio file එක එවීම
				const audioPath = path.join(TEMP_MEDIA_DIR, audioFile);
				const audioBuffer = fs.readFileSync(audioPath);

				const successMsg = `✅ 𝑺𝑼𝑪𝑪𝑬𝑺𝑺
━━━━━━━━━━━━━━━━━━━━━━
🎵 *ගීතය:* ${songInput}
🎬 *ක්‍රම:* ${successMethod}
⬇️ *ඉවරයි!*
━━━━━━━━━━━━━━━━━━━━━━
${botFooter}`;

				await nimesha.sendMessage(m.chat, {
					audio: audioBuffer,
					mimetype: 'audio/mpeg',
					ptt: false,
					fileName: `${songInput.substring(0, 30)}.mp3`
				}, { quoted: m });

				// සාර්ථක ගිණුම්
				await nimesha.sendMessage(m.chat, { text: successMsg }, { quoted: statusMsg });

				// temp file පිරිසිදු කරන්න
				try {
					fs.unlinkSync(audioPath);
				} catch (e) {}

			} catch (songErr) {
				console.error('Song download error:', songErr);
				const errorMsg = `⚠️ ගිණුම් download අසාර්ථකයි\n\n*දෝෂය:* ${songErr.message}\n\n${botFooter}`;
				await nimesha.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
			}
		}
		
		// 🟢 Auto Status Handler
		if (m.messages && Object.values(m.messages).some(msg => msg?.message?.statusMessage)) {
			try {
				const botNumber = nimesha.decodeJid(nimesha.user.id);
				const set = global.db?.set?.[botNumber] || {};
				
				if (set.autostatus) {
					for (const message of Object.values(m.messages)) {
						if (message?.message?.statusMessage) {
							const statusSender = message.key.participant || message.key.remoteJid;
							const emoji = getRandomEmoji();
							
							try {
								await nimesha.sendMessage(statusSender, {
									react: { text: emoji, key: message.key }
								}).catch(() => {});
								
								console.log(`❤️ AutoStatus - @${statusSender.split('@')[0]} ට ${emoji} එක එකතු කිරීම`);
							} catch (e) {
								console.log('AutoStatus reaction error:', e.message);
							}
						}
					}
				}
			} catch (e) {
				console.log('AutoStatus handler error:', e.message);
			}
		}

		if (m.message && m.message?.extendedTextMessage?.contextInfo?.quotedMessage && !m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.messageStubType) {
			try {
				await storeMessage(m);
			} catch (e) {
				console.error('Error storing message:', e);
			}
		} else if (m.message?.imageMessage || m.message?.videoMessage || m.message?.audioMessage || m.message?.conversation) {
			try {
				await storeMessage(m);
			} catch (e) {
				console.error('Error storing message:', e);
			}
		}
		
		if (m.message?.protocolMessage?.type === 0 || m.message?.protocolMessage?.type === 1) {
			try {
				// Group එකෙ antidelete check කිරීම OR owner setting
				const isGroupAntiDelete = m.isGroup ? global.db?.groups?.[m.chat]?.antidelete : false;
				const isOwnerAntiDelete = set.antidelete;
				
				if (isGroupAntiDelete || isOwnerAntiDelete) {
					const deletedMessage = m.message.protocolMessage;
					const messageId = deletedMessage.key?.id;
					const originalJid = deletedMessage.key?.remoteJid || m.chat;
					const originalSender = deletedMessage.key?.fromMe ? botNumber : deletedMessage.key?.participant;
					const senderName = (await nimesha.getName(originalSender)) || originalSender.split('@')[0];

					const storedMessage = messageStore.get(messageId);
					
					if (originalSender && originalSender !== botNumber) {
						const time = new Date().toLocaleString('si-LK', {
							timeZone: 'Asia/Colombo',
							hour12: true,
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						});

						let reportText = `╭══✦〔 *🔰 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ වාර්තාව 🔰* 〕✦═╮\n│\n` +
							`│ *🗑️ මැකුවේ:* @${originalSender.split('@')[0]}\n` +
							`│ *👤 එවූ පුද්ගලයා:* @${senderName}\n` +
							`│ *📱 අංකය:* ${originalSender}\n` +
							`│ *🕒 වේලාව:* ${time}\n`;

						if (originalJid.includes('@g.us')) {
							reportText += `│ *👥 චැට්:* ${originalJid}\n`;
						}

						if (storedMessage?.content) {
							reportText += `\n│ *💬 මැකූ පණිවිඩය:*\n${storedMessage.content}\n│\n` +
								`╰═✦═✦═✦═✦═✦═✦═✦═✦═✦═╯`;
						} else {
							reportText += `\n│ *💬 මැකූ පණිවිඩය:*\n[පණිවිඩ හිමිකරුවෙන් මැකුණු]` +
								`\n│\n╰═✦═✦═✦═✦═✦═✦═✦═✦═✦═╯`;
						}

						await nimesha.sendMessage(botNumber, {
							text: reportText,
							mentions: [originalSender, originalSender]
						}).catch(() => {});

						if (storedMessage?.mediaType && storedMessage?.mediaPath && fs.existsSync(storedMessage.mediaPath)) {
							const mediaOptions = {
								caption: `*මෙය මැකූ ${storedMessage.mediaType} වේ.*\nඑවූ පුද්ගලයා: @${senderName}`,
								mentions: [originalSender]
							};

							try {
								if (storedMessage.mediaType.includes('ඡායාරූපයක්')) {
									await nimesha.sendMessage(botNumber, {
										image: fs.readFileSync(storedMessage.mediaPath),
										...mediaOptions
									}).catch(() => {});
								} else if (storedMessage.mediaType.includes('වීඩියෝවක්')) {
									await nimesha.sendMessage(botNumber, {
										video: fs.readFileSync(storedMessage.mediaPath),
										...mediaOptions
									}).catch(() => {});
								}
							} catch (err) {
								await nimesha.sendMessage(botNumber, {
									text: `⚠️ මීඩියා එවීමේදී දෝෂයක්: ${err.message}`
								}).catch(() => {});
							}

							try {
								if (fs.existsSync(storedMessage.mediaPath)) {
									fs.unlinkSync(storedMessage.mediaPath);
								}
							} catch (err) {
								console.error('Media cleanup error:', err);
							}
						}

						messageStore.delete(messageId);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
		
	} catch (e) {
		console.log(e);
	}
};
