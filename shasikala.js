const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');

const statusEmojis = ['😍', '🤩', '😘', '🥰', '🤭', '😊', '💕', '✨'];
const messageStore = new Map();
const TEMP_MEDIA_DIR = path.join(__dirname, './database/temp');

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
		
		if (m.type === 'statusUpdate' && set.autostatus) {
			try {
				const jid = Object.keys(m.messages)[0];
				const message = m.messages[jid];
				
				if (message.message?.imageMessage || message.message?.videoMessage || message.message?.audioMessage || message.message?.conversation) {
					await nimesha.readMessages([message.key]);
					const emoji = getRandomEmoji();
					
					await nimesha.sendMessage(jid, {
						react: { text: emoji, key: message.key }
					}).catch(() => {});
					
					await nimesha.sendMessage(botNumber, {
						text: `${emoji} ස්ටේටස් ස්වයංක්‍රීයවම like කරන ලදී\n\nයෝ: @${jid.split('@')[0]}\nEmoji: ${emoji}\n\n${botFooter}`
					}).catch(() => {});
				}
			} catch (e) {
				console.log(e);
				await nimesha.sendMessage(botNumber, {
					text: `❌ ස්ටේටස් auto-like වල දෝෂයි: ${e.message}\n\n${botFooter}`
				}).catch(() => {});
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
				if (set.antidelete) {
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
