process.once('uncaughtException', console.error)
process.once('unhandledRejection', console.error)

/*
	* Create By Nimesha Madhushan
	* Follow https://github.com/nimesha206
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

require('./settings');
const fs = require('fs');
const os = require('os');
const util = require('util');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const yts = require('yt-search');
const cron = require('node-cron');
const fetch = require('node-fetch');
const FileType = require('file-type');
const { Chess } = require('chess.js');
const { Akinator } = require('aki-api');
const FormData = require('form-data');
const webp = require('node-webpmux');
const speed = require('performance-now');
const moment = require('moment-timezone');
const { performance } = require('perf_hooks');
const PhoneNum = require('awesome-phonenumber');
const { exec, spawn, execSync } = require('child_process');
const { generateWAMessageContent, getContentType } = require('baileys');

const { UguuSe } = require('./lib/uploader');
const TicTacToe = require('./lib/tictactoe');
const { antiSpam } = require('./src/antispam');
const { ytMp4, ytMp3 } = require('./lib/scraper');
const templateMenu = require('./lib/template_menu');
const { toAudio, toPTT, toVideo } = require('./lib/converter');
const { GroupUpdate, LoadDataBase } = require('./src/message');
const { JadiBot, StopJadiBot, ListJadiBot } = require('./src/jadibot');
const { cmdAdd, cmdDel, cmdAddHit, addExpired, getPosition, getExpired, getStatus, checkStatus, getAllExpired, checkExpired } = require('./src/database');
const { rdGame, iGame, tGame, gameSlot, gameCasinoSolo, gameSamgongSolo, gameMerampok, gameBegal, daily, buy, setLimit, addLimit, addMoney, setMoney, transfer, Blackjack, SnakeLadder } = require('./lib/game');
const { getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, formatDate, formatp, generateProfilePicture, errorCache, normalize, updateSettings, parseMention, fixBytes, similarity, pickRandom, tarBackup } = require('./lib/function');

const menfesTimeouts = new Map();
const settingsPath = path.join(__dirname, 'settings.js');
const cases = db.cases ? db.cases : (db.cases = [...fs.readFileSync('./nima.js', 'utf-8').matchAll(/case\s+['"]([^'"]+)['"]/g)].map(match => match[1]));

module.exports = nimesha = async (nimesha, m, msg, store) => {
	await LoadDataBase(nimesha, m);
	
	const botNumber = nimesha.decodeJid(nimesha.user.id);
	
	// Read Database
	const sewa = db.sewa
	const premium = db.premium
	const set = db.set[botNumber]
	
	// Database Game
	let suit = db.game.suit
	let chess = db.game.chess
	let chat_ai = db.game.chat_ai
	let menfes = db.game.menfes
	let tekateki = db.game.tekateki
	let akinator = db.game.akinator
	let tictactoe = db.game.tictactoe
	let tebaklirik = db.game.tebaklirik
	let kuismath = db.game.kuismath
	let blackjack = db.game.blackjack
	let tebaklagu = db.game.tebaklagu
	let tebakkata = db.game.tebakkata
	let family100 = db.game.family100
	let susunkata = db.game.susunkata
	let tebakbom = db.game.tebakbom
	let ulartangga = db.game.ulartangga
	let tebakkimia = db.game.tebakkimia
	let caklontong = db.game.caklontong
	let tebakangka = db.game.tebakangka
	let tebaknegara = db.game.tebaknegara
	let tebakgambar = db.game.tebakgambar
	let tebakbendera = db.game.tebakbendera
	
	const ownerNumber = set.owner = [...new Set([...owner, botNumber.split('@')[0], ...set?.owner || []])];
	
	try {
		await GroupUpdate(nimesha, m, store);
		
		const body = ((m.type === 'conversation') ? m.message.conversation :
		(m.type == 'imageMessage') ? m.message.imageMessage.caption :
		(m.type == 'videoMessage') ? m.message.videoMessage.caption :
		(m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text :
		(m.type == 'reactionMessage') ? m.message.reactionMessage.text :
		(m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
		(m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
		(m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
		(m.type == 'interactiveResponseMessage'  && m.quoted) ? (m.message.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') :
		(m.type == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || '') :
		(m.type == 'editedMessage') ? (m.message.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || '') :
		(m.type == 'protocolMessage') ? (m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.imageMessage?.caption || m.message.protocolMessage?.editedMessage?.videoMessage?.caption || '') : '') || '';
		
		const budy = (typeof m.text == 'string' ? m.text : '')
		const isCreator = isOwner = ownerNumber.filter(v => typeof v === 'string').map(v => v.replace(/[^0-9]/g, '')).includes(m.sender.split('@')[0])
		const prefix = isCreator ? (/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(body) ? body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : listprefix.find(a => body?.startsWith(a)) || '') : set.multiprefix ? (/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(body) ? body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : listprefix.find(a => body?.startsWith(a)) || '¿') : listprefix.find(a => body?.startsWith(a)) || '¿'
		const isCmd = body.startsWith(prefix)
		const args = body.trim().split(/ +/).slice(1)
		const quoted = m.quoted ? m.quoted : m
		const command = isCreator ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : ''
		const text = q = args.join(' ')
		const mime = (quoted.msg || quoted).mimetype || ''
		const qmsg = (quoted.msg || quoted)
		const author = set.author = global.author || 'Nimesha Madhushan';
		const packname = set.packname = global.packname || 'Shasikala';
		const botname = set.botname = global.botname || 'Nima Bot';
		const _dayMap = {
  'Sunday':'ඉරිදා','Monday':'සදුදා','Tuesday':'අඟහරුවාදා',
  'Wednesday':'බදාදා','Thursday':'බ්‍රහස්පතින්දා',
  'Friday':'සිකුරාදා','Saturday':'සෙනසුරාදා'
};
        const hari = _dayMap[moment.tz('Asia/Colombo').format('dddd')] || moment.tz('Asia/Colombo').format('dddd');
        const tanggal = moment.tz('Asia/Colombo').format('DD/MM/YYYY');
        const jam = moment.tz('Asia/Colombo').format('HH:mm:ss');
		const ucapanWaktu = jam < '05:00:00' ? 'සුභ අළුයමක් 🌉' : jam < '11:00:00' ? 'සුභ උදෑසනක් 🌄' : jam < '15:00:00' ? 'සුභ දහවලක් 🏙' : jam < '18:00:00' ? 'සුභ සන්ධ්‍යාවක් 🌅' : jam < '19:00:00' ? 'සුභ සන්ධ්‍යාවක් 🌃' : jam < '23:59:00' ? 'සුභ රාත්‍රියක් 🌌' : 'සුභ රාත්‍රියක් 🌌';
		const almost = 0.66
		const time = Date.now()
		const time_now = new Date()
		const time_end = 60000 - (time_now.getSeconds() * 1000 + time_now.getMilliseconds());
		const readmore = String.fromCharCode(8206).repeat(999)
		const setv = pickRandom(listv)
		
		const isVip = isCreator || (db.users[m.sender] ? db.users[m.sender].vip : false)
		const isBan = isCreator || (db.users[m.sender] ? db.users[m.sender].ban : false)
		const isLimit = isCreator || (db.users[m.sender] ? (db.users[m.sender].limit > 0) : false)
		const isPremium = isCreator || checkStatus(m.sender, premium) || false
		const isNsfw = m.isGroup ? db.groups[m.chat].nsfw : false
		
		// Fake
		const fkontak = {
			key: {
				remoteJid: '0@s.whatsapp.net',
				participant: '0@s.whatsapp.net',
				fromMe: false,
				id: 'Nimesha Madhushan'
			},
			message: {
				contactMessage: {
					displayName: (m.pushName || author),
					vcard: `BEGIN:VCARD\nVERSION:7.0\nN:XL;${m.pushName || author},;;;\nFN:${m.pushName || author}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
					sendEphemeral: true
				}
			}
		}
		
		// Reset Limit
		cron.schedule('00 00 * * *', async () => {
			cmdDel(db.hit);
			console.log('Reseted Limit Users')
			let user = Object.keys(db.users)
			for (let jid of user) {
				const limitUser = db.users[jid].vip ? limit.vip : checkStatus(jid, premium) ? limit.premium : limit.free
				if (db.users[jid].limit < limitUser) db.users[jid].limit = limitUser
			}
			if (set?.autobackup) {
				let datanya = './database/' + tempatDB;
				if (tempatDB.startsWith('mongodb')) {
					datanya = './database/backup_database.json';
					fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), 'utf-8');
				}
				let tglnya = new Date().toISOString().replace(/[:.]/g, '-');
				for (let o of ownerNumber) {
					try {
						await nimesha.sendMessage(o, { document: fs.readFileSync(datanya), mimetype: 'application/json', fileName: tglnya + '_database.json' })
						console.log(`[AUTO BACKUP] Backup berhasil dikirim ke ${o}`);
					} catch (e) {
						console.error(`[AUTO BACKUP] Gagal mengirim backup ke ${o}:`, error);
					}
				}
			}
		}, {
			scheduled: true,
			timezone: 'Asia/Colombo'
		});
		
		// Auto Set Bio
		if (set.autobio) {
			if (new Date() * 1 - set.status > 60000) {
				await nimesha.updateProfileStatus(`${nimesha.user.name} | 🎯 Runtime: ${runtime(process.uptime())}`).catch(e => {})
				set.status = new Date() * 1
			}
		}
		
		// Set Mode
		if (!isCreator) {
			if ((set.grouponly === set.privateonly)) {
				if (!nimesha.public && !m.key.fromMe) return
			} else if (set.grouponly) {
				if (!m.isGroup) return
			} else if (set.privateonly) {
				if (m.isGroup) return
			}
		}
		
		// Group Settings
		if (m.isGroup) {
			// Mute
			if (db.groups[m.chat].mute && !isCreator) {
				return
			}
			
			// Anti Hidetag
			if (!m.key.fromMe && m.mentionedJid?.length === m.metadata.participanis?.length && db.groups[m.chat].antihidetag && !isCreator && m.isBotAdmin && !m.isAdmin) {
				await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
				await m.reply('*Anti Hidetag සක්‍රීයයි❗*')
			}
			
			// Anti Tag Sw
			if (!m.key.fromMe && db.groups[m.chat].antitagsw && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (m.type === 'groupStatusMentionMessage' || m.message?.groupStatusMentionMessage || m.message?.protocolMessage?.type === 25 || Object.keys(m.message).length === 1 && Object.keys(m.message)[0] === 'messageContextInfo') {
					if (!db.groups[m.chat].tagsw[m.sender]) {
						db.groups[m.chat].tagsw[m.sender] = 1
						await m.reply(`මෙම සමූහය WhatsApp ස්ටේටස් හි ටැග් කර ඇත\n@${m.sender.split('@')[0]}, WhatsApp ස්ටේටස් හි සමූහය ටැග් නොකරන්න\nPeringatan ${db.groups[m.chat].tagsw[m.sender]}/5, akan dikick sewaktu waktu❗`)
					} else if (db.groups[m.chat].tagsw[m.sender] >= 5) {
						await nimesha.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch((err) => m.reply('අසාර්ථකයි!'))
						await m.reply(`@${m.sender.split("@")[0]} සමූහයෙන් ඉවත් කරන ලදි\nWhatsApp ස්ටේටස් හි 5 වාරයක් සමූහය ටැග් කළ නිසා`)
						delete db.groups[m.chat].tagsw[m.sender]
					} else {
						db.groups[m.chat].tagsw[m.sender] += 1
						await m.reply(`මෙම සමූහය WhatsApp ස්ටේටස් හි ටැග් කර ඇත\n@${m.sender.split('@')[0]}, WhatsApp ස්ටේටස් හි සමූහය ටැග් නොකරන්න\nPeringatan ${db.groups[m.chat].tagsw[m.sender]}/5, akan dikick sewaktu waktu❗`)
					}
				}
			}
			
			// Anti Toxic
			if (!m.key.fromMe && db.groups[m.chat].antitoxic && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.toLowerCase().split(/\s+/).some(word => badWords.includes(word))) {
					await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await nimesha.relayMessage(m.chat, { extendedTextMessage: { text: `හඳුනාගත් @${m.sender.split('@')[0]} Toxic ලෙස කතා කළා\nකරුණාකර ආචාරශීලී භාෂාවක් භාවිතා කරන්න.`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Toxic❗*'}, ...m.key }}}, {})
				}
			}
			
			// Anti Delete
			if (m.type === 'protocolMessage' && m.msg?.type === 0 && db.groups[m.chat].antidelete && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (store?.messages?.[m.chat]?.array) {
					const chats = store.messages[m.chat].array.find(a => a.key.id === m.msg.key.id);
					if (!chats?.message) return
					const msgType = Object.keys(chats.message)[0];
					const msgContent = chats.message[msgType];
					if (msgContent.fileSha256 && msgContent.mediaKey) {
						msgContent.mediaKey = fixBytes(msgContent.mediaKey);
						msgContent.fileSha256 = fixBytes(msgContent.fileSha256);
						msgContent.fileEncSha256 = fixBytes(msgContent.fileEncSha256);
					}
					msgContent.contextInfo = { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Delete❗*'}, ...chats.key }
					const pesan = msgType === 'conversation' ? { extendedTextMessage: { text: msgContent, contextInfo: { mentionedJid: [chats.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Delete❗*'}, ...chats.key }}} : { [msgType]: msgContent }
					await nimesha.relayMessage(m.chat, pesan, {})
				}
			}
			
			// Anti Link Group
			if (db.groups[m.chat].antilink && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.match('chat.whatsapp.com/')) {
					await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await nimesha.relayMessage(m.chat, { extendedTextMessage: { text: `හඳුනාගත් @${m.sender.split('@')[0]} සමූහ සබැඳියක් යැව්වා\nසමාවෙන්න, සබැඳිය මකාදැමිය යුතුය..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Link❗*'}, ...m.key }}}, {})
				}
			}
			
			// Anti Virtex Group
			if (db.groups[m.chat].antivirtex && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.length > 4500) {
					await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await nimesha.relayMessage(m.chat, { extendedTextMessage: { text: `හඳුනාගත් @${m.sender.split('@')[0]} Virtex යෑව්වා..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Virtex❗*'}, ...m.key }}}, {})
					await nimesha.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
				}
				if (m.msg?.nativeFlowMessage?.messageParamsJson?.length > 3500) {
					await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await nimesha.relayMessage(m.chat, { extendedTextMessage: { text: `හඳුනාගත් @${m.sender.split('@')[0]} Bug යෑව්වා..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Bug❗*'}, ...m.key }}}, {})
					await nimesha.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
				}
			}
			
		}
		
		// Auto Read
		if (m.message && m.key.remoteJid !== 'status@broadcast') {
			if ((set.autoread && nimesha.public) || isCreator) {
				nimesha.readMessages([m.key]);
				console.log(chalk.black(chalk.bgWhite('[ PESAN ]:'), chalk.bgGreen(new Date), chalk.bgHex('#00EAD3')(budy || m.type), chalk.bgHex('#AF26EB')(m.key.id) + '\n' + chalk.bgCyanBright('[ DARI ] :'), chalk.bgYellow(m.pushName || (isCreator ? 'Bot' : 'Anonim')), chalk.bgHex('#FF449F')(m.sender), chalk.bgHex('#FF5700')(m.isGroup ? m.metadata.subject : m.chat.endsWith('@newsletter') ? 'Newsletter' : 'Private Chat'), chalk.bgBlue('(' + m.chat + ')')));
			}
		}
		
		// Filter Bot & Ban
		if (m.isBot) return
		if (db.users[m.sender]?.ban && !isCreator) return
		
		// Filter Set Api Key
		if (cases.includes(command) && isCmd && (command !== 'setapikey') && global.APIKeys[global.APIs.nimesha] === 'nz-8ce9753907') {
			return m.reply('.setapikey nz-8ce9753907');
		}
		
		// Mengetik & Anti Spam & Hit
		if (nimesha.public && isCmd) {
			if (set.autotyping) {
				await nimesha.sendPresenceUpdate('composing', m.chat)
			}
			if (cases.includes(command)) {
				cmdAdd(db.hit);
				cmdAddHit(db.hit, command);
			}
			if (set.antispam && antiSpam.isFiltered(m.sender)) {
				console.log(chalk.bgRed('[ SPAM ] : '), chalk.black(chalk.bgHex('#1CFFF7')(`From -> ${m.sender}`), chalk.bgHex('#E015FF')(` In ${m.isGroup ? m.chat : 'Private Chat'}`)))
				return m.reply('「 ❗ 」Command එකක් අතර තරිතරයේ තත්පර 5ක් රැකගන්න')
			}
			
			if (command && set.didyoumean) {
				let _b = ''
				let _s = 0
				for (const c of cases) {
			        let sim = similarity(command.toLowerCase(), c.toLowerCase())
			        let lengthDiff = Math.abs(command.length - c.length)
			        if (sim > _s && lengthDiff <= 1) {
			            _s = sim
			            _b = c
			        }
			    }
			    let s_percentage = parseInt(_s * 100)
			    if (_s >= almost && command.toLowerCase() !== _b.toLowerCase()) {
			        return m.reply(`Command හොයාගත නොහැකි!\nඔබ අදහස් කළේ මෙය ද:\n- ${prefix + _b}\n- සමානතාවය: ${s_percentage}%`);
			    }
			}
		}
		
		if (isCmd && !isCreator) antiSpam.addFilter(m.sender)
		
		// Cmd Media
		let fileSha256;
		if (m.isMedia && m.msg.fileSha256 && db.cmd && (m.msg.fileSha256.toString('base64') in db.cmd)) {
			let hash = db.cmd[m.msg.fileSha256.toString('base64')]
			fileSha256 = hash.text
		}
		
		// Salam
		if (/^a(s|ss)alamu('|)alaikum(| )(wr|)( |)(wb|)$/.test(budy?.toLowerCase())) {
			const jwb_salam = ['Wa\'alaikumusalam','Wa\'alaikumusalam wr wb','Wa\'alaikumusalam Warohmatulahi Wabarokatuh']
			m.reply(pickRandom(jwb_salam))
		}
		
		// Waktu Sholat
		const jadwalSholat = {
			Subuh: '04:30',
			Dzuhur: '12:06',
			Ashar: '15:21',
			Maghrib: '18:08',
			Isya: '19:00'
		}
		if (!this.intervalSholat) this.intervalSholat = null;
		if (!this.waktusholat) this.waktusholat = {};
		if (this.intervalSholat) clearInterval(this.intervalSholat); 
		setTimeout(() => {
			this.intervalSholat = setInterval(async() => {
				const sekarang = moment.tz('Asia/Colombo');
				const jamSholat = sekarang.format('HH:mm');
				const hariIni = sekarang.format('YYYY-MM-DD');
				const seconds = sekarang.format('ss');
				if (seconds !== '00') return;
				for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
					if (jamSholat === waktu && this.waktusholat[sholat] !== hariIni) {
						this.waktusholat[sholat] = hariIni
						for (const [idnya, settings] of Object.entries(db.groups)) {
							if (settings.waktusholat) {
								await nimesha.sendMessage(idnya, { text: `*${sholat}* ශ්‍රිත කාලය ළඟා විය, නැමදුමට සූදානම් වන්න🙂.\n\n*${waktu.slice(0, 5)}*\n_ජකාර්තා සහ ආශ්‍රිත ප්‍රදේශ සඳහා._` }, { ephemeralExpiration: m.expiration || store?.messages[idnya]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 }).catch(e => {})
							}
						}
					}
				}
			}, 60000)
		}, time_end);
		
		// Cek Expired
		checkExpired(premium);
		checkExpired(sewa, nimesha);
		
		// TicTacToe
		let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
		if (room) {
			let now = Date.now();
			if (now - (room.lastMove || now) > 5 * 60 * 1000) {
				m.reply('Tic-Tac-Toe ක්‍රීඩාව විනාඩි 5ක් activity නොමැතිකම නිසා අවලංගු කෙරිණ.');
				delete tictactoe[room.id];
				return;
			}
			room.lastMove = now;
			let ok, isWin = false, isTie = false, isSurrender = false;
			if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
			isSurrender = !/^[1-9]$/.test(m.text)
			if (m.sender !== room.game.currentTurn) {
				if (!isSurrender) return true
			}
			if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
				m.reply({'-3': 'ක්‍රීඩාව අවසන් විය','-2': 'Invalid','-1': 'Position වලංගු නොවේ',0: 'Position වලංගු නොවේ'}[ok])
				return true
			}
			if (m.sender === room.game.winner) isWin = true
			else if (room.game.board === 511) isTie = true
			if (!(room.game instanceof TicTacToe)) {
				room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game)
			}
			let arr = room.game.render().map(v => ({X: '❌',O: '⭕',1: '1️⃣',2: '2️⃣',3: '3️⃣',4: '4️⃣',5: '5️⃣',6: '6️⃣',7: '7️⃣',8: '8️⃣',9: '9️⃣'}[v]))
			if (isSurrender) {
				room.game._currentTurn = m.sender === room.game.playerX
				isWin = true
			}
			let winner = isSurrender ? room.game.currentTurn : room.game.winner
			if (isWin) {
				db.users[m.sender].limit += 3
				db.users[m.sender].money += 3000
			}
			let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\n${isWin ? `@${winner.split('@')[0]} ජය!` : isTie ? `ක්‍රීඩාව අවසන් විය` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\n\n*nyerah* ටයිප් කර ගිවිසීම ප්‍රකාශ කරන්න`
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
			if (room.x !== room.o) await nimesha.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m })
			await nimesha.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
			if (isTie || isWin) delete tictactoe[room.id]
		}
		
		// Suit PvP
		let roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender))
		if (roof) {
			let now = Date.now();
			let win = '', tie = false;
			if (now - (roof.lastMove || now) > 3 * 60 * 1000) {
				m.reply('Suit ක්‍රීඩාව විනාඩි 3ක් activity නොමැතිකම නිසා අවලංගු කෙරිණ.');
				delete suit[roof.id];
				return;
			}
			roof.lastMove = now;
			if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == 'wait') {
				if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
					m.reply(`@${roof.p2.split('@')[0]} menolak suit,\nsuit dibatalkan`)
					delete suit[roof.id]
					return !0
				}
				roof.status = 'play';
				roof.asal = m.chat;
				m.reply(`Suit chat වෙත යැව්වා\n\n@${roof.p.split('@')[0]} dan @${roof.p2.split('@')[0]}\n\nSilahkan තෝරන්න suit di chat masing-masing klik https://wa.me/${botNumber.split('@')[0]}`)
				if (!roof.තෝරන්න) nimesha.sendMessage(roof.p, { text: `Silahkan තෝරන්න \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
				if (!roof.තෝරන්න2) nimesha.sendMessage(roof.p2, { text: `Silahkan තෝරන්න \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
			}
			let jwb = m.sender == roof.p, jwb2 = m.sender == roof.p2;
			let g = /gunting/i, b = /batu/i, k = /kertas/i, reg = /^(gunting|batu|kertas)/i;
			
			if (jwb && reg.test(m.text) && !roof.තෝරන්න && !m.isGroup) {
				roof.තෝරන්න = reg.exec(m.text.toLowerCase())[0];
				roof.text = m.text;
				m.reply(`ඔබ තෝරාගත්තේ ${m.text} ${!roof.තෝරන්න2 ? `\n\nලංඟ ක්‍රීඩකයාගේ තේරීම බලා සිටිනු` : ''}`);
				if (!roof.තෝරන්න2) nimesha.sendMessage(roof.p2, { text: '_ලංඟ ක්‍රීඩකයා තෝරාගත්තා_\nදැන් ඔබේ වාරය' })
			}
			if (jwb2 && reg.test(m.text) && !roof.තෝරන්න2 && !m.isGroup) {
				roof.තෝරන්න2 = reg.exec(m.text.toLowerCase())[0]
				roof.text2 = m.text
				m.reply(`ඔබ තෝරාගත්තේ ${m.text} ${!roof.තෝරන්න ? `\n\nලංඟ ක්‍රීඩකයාගේ තේරීම බලා සිටිනු` : ''}`)
				if (!roof.තෝරන්න) nimesha.sendMessage(roof.p, { text: '_ලංඟ ක්‍රීඩකයා තෝරාගත්තා_\nදැන් ඔබේ වාරය' })
			}
			let stage = roof.තෝරන්න
			let stage2 = roof.තෝරන්න2
			if (roof.තෝරන්න && roof.තෝරන්න2) {
				if (b.test(stage) && g.test(stage2)) win = roof.p
				else if (b.test(stage) && k.test(stage2)) win = roof.p2
				else if (g.test(stage) && k.test(stage2)) win = roof.p
				else if (g.test(stage) && b.test(stage2)) win = roof.p2
				else if (k.test(stage) && b.test(stage2)) win = roof.p
				else if (k.test(stage) && g.test(stage2)) win = roof.p2
				else if (stage == stage2) tie = true
				db.users[roof.p == win ? roof.p : roof.p2].limit += tie ? 0 : 3
				db.users[roof.p == win ? roof.p : roof.p2].money += tie ? 0 : 3000
				nimesha.sendMessage(roof.asal, { text: `_*Suit ප්‍රතිඵල*_${tie ? '\nශේෂය' : ''}\n\n@${roof.p.split('@')[0]} (${roof.text}) ${tie ? '' : roof.p == win ? ` ජය \n` : ` පරාජය \n`}\n@${roof.p2.split('@')[0]} (${roof.text2}) ${tie ? '' : roof.p2 == win ? ` ජය \n` : ` පරාජය \n`}\n\nජයග්‍රාහකයා ලබා ගනී\n*තෑගිය:* Money(3000) & Limit(3)`.trim(), mentions: [roof.p, roof.p2] }, { quoted: m })
				delete suit[roof.id]
			}
		}
		
		// Tebak Bomb
		let තෝරන්න = '🌀', bomb = '💣';
		if (m.sender in tebakbom) {
			if (!/^[1-9]|10$/i.test(body) && !isCmd && !isCreator) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 1) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 2) {
				tebakbom[m.sender].board[parseInt(body) - 1] = bomb;
				tebakbom[m.sender].pick++;
				m.react('❌')
				tebakbom[m.sender].bomb--;
				tebakbom[m.sender].nyawa.pop();
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].nyawa.length < 1) {
					await m.reply(`*ක්‍රීඩාව අවසන් විය*\nඔබ bomb වල හසු වූවා\n\n ${brd.join('')}\n\n*Terතෝරන්න :* ${tebakbom[m.sender].pick}\n_Pengurangan Limit: 1_`);
					m.react('😂')
					delete tebakbom[m.sender];
				} else m.reply(`*අංකය තෝරන්න*\n\nඔබ bomb වල හසු වූවා\n ${brd.join('')}\n\nTerතෝරන්න: ${tebakbom[m.sender].pick}\nSisa nyawa: ${tebakbom[m.sender].nyawa}`);
				return !0;
			}
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 0) {
				tebakbom[m.sender].petak[parseInt(body) - 1] = 1;
				tebakbom[m.sender].board[parseInt(body) - 1] = තෝරන්න;
				tebakbom[m.sender].pick++;
				tebakbom[m.sender].lolos--;
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].lolos < 1) {
					db.users[m.sender].money += 6000
					await m.reply(`*KAMU HEBAT ಠ⁠ᴥ⁠ಠ*\n\n${brd.join('')}\n\n*Terතෝරන්න :* ${tebakbom[m.sender].pick}\n*ජීවිත ඉතිරිය:* ${tebakbom[m.sender].nyawa}\n*Bomb:* ${tebakbom[m.sender].bomb}\nBonus Money 💰 *+6000*`);
					delete tebakbom[m.sender];
				} else m.reply(`*අංකය තෝරන්න*\n\n${brd.join('')}\n\nTerතෝරන්න : ${tebakbom[m.sender].pick}\nජීවිත ඉතිරිය: ${tebakbom[m.sender].nyawa}\nBomb: ${tebakbom[m.sender].bomb}`)
			}
		}
		
		// Akinator
		if (m.sender in akinator) {
			if (m.quoted && akinator[m.sender].key == m.quoted.id) {
				if (budy == '5') {
					if (akinator[m.sender]?.progress?.toFixed(0) == 0) {
						delete akinator[m.sender]
						return m.reply(`🎮 Akinator Game End!\nWith *0* Progress`)
					}
					akinator[m.sender].isWin = false
					await akinator[m.sender].cancelAnswer()
					let { key } = await m.reply(`🎮 Akinator Game Back :\n\n@${m.sender.split('@')[0]} (${akinator[m.sender].progress.toFixed(2)}) %\n${akinator[m.sender].question}\n\n- 0 - ඔව්\n- 1 - නැහැ\n- 2 - නැහැ Tau\n- 3 - Mungkin\n- 4 - Mungkin නැහැ\n- 5 - ${akinator[m.sender]?.progress?.toFixed(0) == 0 ? 'End' : 'Back'}`)
					akinator[m.sender].key = key.id
				} else if (akinator[m.sender].isWin && ['benar', 'ya'].includes(budy.toLowerCase())) {
					m.react('🎊')
					delete akinator[m.sender]
				} else {
					if (!isNaN(budy) && budy.match(/^[0-4]$/) && budy) {
						if (akinator[m.sender].isWin) {
							let { key } = await m.reply({ image: { url: akinator[m.sender].sugestion_photo }, caption: `🎮 Akinator Answer :\n\n@${m.sender.split('@')[0]}\nDia ලෙස *${akinator[m.sender].sugestion_name}*\n_${akinator[m.sender].sugestion_desc}_\n\n- 5 - Back\n- *ඔව්* (Session ඉවත් වීමට)`, contextInfo: { mentionedJid: [m.sender] }});
							akinator[m.sender].key = key.id
						} else {
							await akinator[m.sender].answer(budy)
							if (akinator[m.sender].isWin) {
								let { key } = await m.reply({ image: { url: akinator[m.sender].sugestion_photo }, caption: `🎮 Akinator Answer :\n\n@${m.sender.split('@')[0]}\nDia ලෙස *${akinator[m.sender].sugestion_name}*\n_${akinator[m.sender].sugestion_desc}_\n\n- 5 - Back\n- *ඔව්* (Session ඉවත් වීමට)`, contextInfo: { mentionedJid: [m.sender] }});
								akinator[m.sender].key = key.id
							} else {
								let { key } = await m.reply(`🎮 Akinator Game :\n\n@${m.sender.split('@')[0]} (${akinator[m.sender].progress.toFixed(2)}) %\n${akinator[m.sender].question}\n\n- 0 - ඔව්\n- 1 - නැහැ\n- 2 - නැහැ Tau\n- 3 - Mungkin\n- 4 - Mungkin නැහැ\n- 5 - Back`)
								akinator[m.sender].key = key.id
							}
						}
					}
				}
			}
		}
		
		// Game
		const games = { tebaklirik, tekateki, tebaklagu, tebakkata, kuismath, susunkata, tebakkimia, caklontong, tebakangka, tebaknegara, tebakgambar, tebakbendera }
		for (let gameName in games) {
			let game = games[gameName];
			let id = iGame(game, m.chat);
			if ((!isCmd || isCreator) && m.quoted && id == m.quoted.id) {
				if (game[m.chat + id]?.jawaban) {
					if (gameName == 'kuismath') {
						jawaban = game[m.chat + id].jawaban
						const difficultyMap = { 'noob': 1, 'easy': 1.5, 'medium': 2.5, 'hard': 4, 'extreme': 5, 'impossible': 6, 'impossible2': 7 };
						let randMoney = difficultyMap[kuismath[m.chat + id].mode]
						if (!isNaN(budy)) {
							if (budy.toLowerCase() == jawaban) {
								db.users[m.sender].money += randMoney * 1000
								await m.reply(`නිවැරදි පිළිතුර 🎉\nBonus Money 💰 *+${randMoney * 1000}*`)
								delete kuismath[m.chat + id]
							} else m.reply('*වැරදි පිළිතුර!*')
						}
					} else {
						jawaban = game[m.chat + id].jawaban
						let jawabBenar = /tekateki|tebaklirik|tebaklagu|tebakkata|tebaknegara|tebakbendera/.test(gameName) ? (similarity(budy.toLowerCase(), jawaban) >= almost) : (budy.toLowerCase() == jawaban)
						let bonus = gameName == 'caklontong' ? 9999 : gameName == 'tebaklirik' ? 4299 : gameName == 'susunkata' ? 2989 : 3499
						if (jawabBenar) {
							db.users[m.sender].money += bonus * 1
							await m.reply(`නිවැරදි පිළිතුර 🎉\nBonus Money 💰 *+${bonus}*`)
							delete game[m.chat + id]
						} else m.reply('*වැරදි පිළිතුර!*')
					}
				}
			}
		}
		
		// Family 100
		if (m.chat in family100) {
			if (m.quoted && m.quoted.id == family100[m.chat].id && !isCmd) {
				let room = family100[m.chat]
				let teks = budy.toLowerCase().replace(/[^\w\s\-]+/, '')
				let isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks)
				if (!isSurender) {
					let index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks)
					if (room.terjawab[index]) return !0
					room.terjawab[index] = m.sender
				}
				let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
				let caption = `පහත ප්‍රශ්නයට පිළිතුරු දෙන්න:\n${room.soal}\n\n\nඇත ${room.jawaban.length} පිළිතුරු ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa පිළිතුරු ඇත Spasi)` : ''}\n${isWin ? `Semua පිළිතුරු Terjawab` : isSurender ? 'ගිවිසෙයි!' : ''}\n${Array.from(room.jawaban, (jawaban, index) => { return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false }).filter(v => v).join('\n')}\n${isSurender ? '' : `Perfect Player`}`.trim()
				m.reply(caption)
				if (isWin || isSurender) delete family100[m.chat]
			}
		}
		
		// Chess
		if ((!isCmd || isCreator) && (m.sender in chess)) {
			const game = chess[m.sender];
			if (m.quoted && game.id == m.quoted.id && game.turn == m.sender && game.botMode) {
				if (!(game instanceof Chess)) {
					chess[m.sender] = Object.assign(new Chess(game.fen), game);
				}
				if (game.isCheckmate() || game.isDraw() || game.isGameOver()) {
					const status = game.isCheckmate() ? 'Checkmate' : game.isDraw() ? 'Draw' : 'Game Over';
					delete chess[m.sender];
					return m.reply(`♟Game ${status}\nPermainan dihentikan`);
				}
				const [from, to] = budy.toLowerCase().split(' ');
				if (!from || !to || from.length !== 2 || to.length !== 2) return m.reply('Format salah! භාවිතා කරන්න: e2 e4');
				try {
					game.move({ from, to });
				} catch (e) {
					return m.reply('Languagekah නැහැ Valid!')
				}
				
				if (game.isGameOver()) {
					delete chess[m.sender];
					return m.reply(`♟Permainan Selesai\nPemenang: @${m.sender.split('@')[0]}`);
				}
				const moves = game.moves({ verbose: true });
				const botMove = moves[Math.floor(Math.random() * moves.length)];
				game.move(botMove);
				game._fen = game.fen();
				game.time = Date.now();
				
				if (game.isGameOver()) {
					delete chess[m.sender];
					return m.reply(`♟Permainan Selesai\nPemenang: BOT`);
				}
				const encodedFen = encodeURI(game._fen);
				const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`,`https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`,`https://chessboardimage.com/${encodedFen}.png`,`https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765`,`https://fen2image.chessvision.ai/${encodedFen}/`];
				for (let url of boardUrls) {
					try {
						const { data } = await axios.get(url, { responseType: 'arraybuffer' });
						let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME (vs BOT)\n\nLanguagekahmu: ${from} → ${to}\nLanguagekah bot: ${botMove.from} → ${botMove.to}\n\nඊළඟ ඔබේ වාරය!\nඋදාහරණ: e2 e4`, mentions: [m.sender] });
						game.id = key.id;
						break;
					} catch (e) {}
				}
			} else if (game.time && (Date.now() - game.time >= 3600000)) {
				delete chess[m.sender];
				return m.reply(`♟Waktu Habis!\nPermainan dihentikan`);
			}
		}
		if (m.isGroup && (!isCmd || isCreator) && (m.chat in chess)) {
			if (m.quoted && chess[m.chat].id == m.quoted.id && [chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) {
				if (!(chess[m.chat] instanceof Chess)) {
					chess[m.chat] = Object.assign(new Chess(chess[m.chat].fen), chess[m.chat]);
				}
				if (chess[m.chat].isCheckmate() || chess[m.chat].isDraw() || chess[m.chat].isGameOver()) {
					const status = chess[m.chat].isCheckmate() ? 'Checkmate' : chess[m.chat].isDraw() ? 'Draw' : 'Game Over';
					delete chess[m.chat];
					return m.reply(`♟Game ${status}\nPermainan dihentikan`);
				}
				const [from, to] = budy.toLowerCase().split(' ');
				if (!from || !to || from.length !== 2 || to.length !== 2) return m.reply('Format salah! භාවිතා කරන්න format seperti: e2 e4');
				if ([chess[m.chat].player1, chess[m.chat].player2].includes(m.sender) && chess[m.chat].turn === m.sender) {
					try {
						chess[m.chat].move({ from, to });
					} catch (e) {
						return m.reply('Languagekah නැහැ Valid!')
					}
					chess[m.chat].time = Date.now();
					chess[m.chat]._fen = chess[m.chat].fen();
					const isPlayer2 = chess[m.chat].player2 === m.sender
					const nextPlayer = isPlayer2 ? chess[m.chat].player1 : chess[m.chat].player2;
					const encodedFen = encodeURI(chess[m.chat]._fen);
					const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`,`https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`,`https://chessboardimage.com/${encodedFen}${!isPlayer2 ? '-flip' : ''}.png`,`https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765${!isPlayer2 ? '&orientation=black' : ''}`,`https://fen2image.chessvision.ai/${encodedFen}/${!isPlayer2 ? '?pov=black' : ''}`];
					for (let url of boardUrls) {
						try {
							const { data } = await axios.get(url, { responseType: 'arraybuffer' });
							let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nවාරය: @${nextPlayer.split('@')[0]}\n\nක්‍රීඩා කිරීම සඳහා Reply කරන්න!\nඋදාහරණ: from to -> b1 c3`, mentions: [nextPlayer] });
							chess[m.chat].turn = nextPlayer
							chess[m.chat].id = key.id;
							break;
						} catch (e) {}
					}
				}
			} else if (chess[m.chat].time && (Date.now() - chess[m.chat].time >= 3600000)) {
				delete chess[m.chat]
				return m.reply(`♟Waktu Habis!\nPermainan dihentikan`)
			}
		}
		
		// Ular Tangga
		if (m.isGroup && (!isCmd || isCreator) && (m.chat in ulartangga)) {
			if (m.quoted && ulartangga[m.chat].id == m.quoted.id) {
				if (!(ulartangga[m.chat] instanceof SnakeLadder)) {
					ulartangga[m.chat] = Object.assign(new SnakeLadder(ulartangga[m.chat]), ulartangga[m.chat]);
				}
				if (/^(roll|kocok)/i.test(budy.toLowerCase())) {
					const player = ulartangga[m.chat].players.findIndex(a => a.id == m.sender)
					if (ulartangga[m.chat].turn !== player) return m.reply('ඔබේ වාරය නොවේ!')
					const roll = ulartangga[m.chat].rollDice();
					await m.reply(`https://raw.githubusercontent.com/nima/database/master/games/images/dice/roll-${roll}.webp`);
					ulartangga[m.chat].nextTurn();
					ulartangga[m.chat].players[player].move += roll
					if (ulartangga[m.chat].players[player].move > 100) ulartangga[m.chat].players[player].move = 100 - (ulartangga[m.chat].players[player].move - 100);
					let teks = `🐍🪜වර්ණය: ${['Merah','Biru Muda','Kuning','Hijau','Ungu','Jingga','Biru Tua','Putih'][player]} -> ${ulartangga[m.chat].players[player].move}\n`;
					if(Object.keys(ulartangga[m.chat].map.move).includes(ulartangga[m.chat].players[player].move.toString())) {
						teks += ulartangga[m.chat].players[player].move > ulartangga[m.chat].map.move[ulartangga[m.chat].players[player].move] ? 'ඔබ Snake ළඟට!\n' : 'ඔබ Ladder ඉහළ!\n'
						ulartangga[m.chat].players[player].move = ulartangga[m.chat].map.move[ulartangga[m.chat].players[player].move];
					}
					const newMap = await ulartangga[m.chat].drawBoard(ulartangga[m.chat].map.url, ulartangga[m.chat].players);
					if (ulartangga[m.chat].players[player].move === 100) {
						teks += `@${m.sender.split('@')[0]} ජය\nHadiah:\n- Limit + 50\n- Money + 100.000`;
						addLimit(50, m.sender, db);
						addMoney(100000, m.sender, db);
						delete ulartangga[m.chat];
						return m.reply({ image: newMap, caption: teks, mentions: [m.sender] });
					}
					let { key } = await m.reply({ image: newMap, caption: teks + `වාරය: @${ulartangga[m.chat].players[ulartangga[m.chat].turn].id.split('@')[0]}`, mentions: [m.sender, ulartangga[m.chat].players[ulartangga[m.chat].turn].id] });
					ulartangga[m.chat].id = key.id;
				} else m.reply('උදාහරණ: Roll/Kocok ටයිප් කරන්න')
			} else if (ulartangga[m.chat].time && (Date.now() - ulartangga[m.chat].time >= 7200000)) {
				delete ulartangga[m.chat]
				return m.reply(`🐍🪜Waktu Habis!\nPermainan dihentikan`)
			}
		}
		
		// Menfes & Room Ai
		if (!m.isGroup && (!isCmd || isCreator)) {
			if (menfes[m.sender] && m.key.remoteJid !== 'status@broadcast' && m.msg) {
				m.react('✈');
				m.msg.contextInfo = { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*පණිවිඩ Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : 'Seseorang'}*`}, key: { remoteJid: '0@s.whatsapp.net', fromMe: false, participant: '0@s.whatsapp.net' }}
				const pesan = m.type === 'conversation' ? { extendedTextMessage: { text: m.msg, contextInfo: { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*පණිවිඩ Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : 'Seseorang'}*`}, key: { remoteJid: '0@s.whatsapp.net', fromMe: false, participant: '0@s.whatsapp.net' }}}} : { [m.type]: m.msg }
				await nimesha.relayMessage(menfes[m.sender].tujuan, pesan, {});
			}
			if (chat_ai[m.sender] && m.key.remoteJid !== 'status@broadcast') {
				if (!/^(del((room|c|hat)ai)|>|<$)$/i.test(command) && budy) {
					chat_ai[m.sender].push({ role: 'user', content: budy });
					if (chat_ai[m.sender].length > 20) chat_ai[m.sender].shift();
					let hasil;
					try {
						hasil = await fetchApi('/ai/chat4', {
							messages: chat_ai[m.sender],
							prompt: budy
						}, { method: 'POST' });
					} catch (e) {
						hasil = 'Response ලබා ගැනීම අසාර්ථකයි, Website ගැටලුවකට ලක් ව ඇත'
					}
					const response = hasil?.result?.message || 'සමාවෙන්න, මට තේරෙන්නෙ නෑ.';
					chat_ai[m.sender].push({ role: 'assistant', content: response });
					if (chat_ai[m.sender].length > 20) chat_ai[m.sender].shift();
					await m.reply(response)
				}
			}
		}
		
		// Afk
		let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
		for (let jid of mentionUser) {
			let user = db.users[jid]
			if (!user) continue
			let afkTime = user.afkTime
			if (!afkTime || afkTime < 0) continue
			let reason = user.afkReason || ''
			m.reply(`ඔවුන් tag නොකරන්න!\nඔවුන් AFK ${reason ? 'නිසා ' + reason : 'හේතුවකින් තොරව'}\nකාලය: ${clockString(new Date - afkTime)}`.trim())
		}
		if (db.users[m.sender].afkTime > -1) {
			let user = db.users[m.sender]
			m.reply(`@${m.sender.split('@')[0]} AFK නිමා කළා${user.afkReason ? ' නිසා ' + user.afkReason : ''}\nකාලය: ${clockString(new Date - user.afkTime)}`)
			user.afkTime = -1
			user.afkReason = ''
		}
		
		switch(fileSha256 || command) {
			// Tempat Add Case
			case '19rujxl1e': {
				console.log('.')
			}
			break
			
			// Owner Menu
			case 'shutdown': case 'off': {
				if (!isCreator) return m.reply(mess.owner)
				m.reply(`*[BOT] Shutdown වෙමින්...*`).then(() => {
					process.exit(0)
				})
			}
			break
			case 'byq': {
				if (!isCreator) return m.reply(mess.owner)
				if (!m.quoted) return m.reply('Reply කරන්න')
				delete m.quoted.chat
				let anya = Object.values(m.quoted.fakeObj())[1]
				m.reply(`const byt = ${JSON.stringify(anya.message, null, 2)}\nnimesha.relayMessage(m.chat, byt, {})`)
			}
			break
			case 'setbio': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply('Text එක කොහේද?')
				nimesha.setStatus(q)
				m.reply(`*Bio telah di ganti ලෙස ${q}*`)
			}
			break
			case 'setppbot': {
				if (!isCreator) return m.reply(mess.owner)
				if (!/image/.test(quoted.type)) return m.reply(`Caption සමග Image Reply කරන්න ${prefix + command}`)
				let media = await quoted.download();
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512)
				await nimesha.query({
					tag: 'iq',
					attrs: {
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply('සාර්ථකයි')
			}
			break
			case 'delppbot': {
				if (!isCreator) return m.reply(mess.owner)
				await nimesha.removeProfilePicture(nimesha.user.id)
				m.reply('සාර්ථකයි')
			}
			break
			case 'join': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply('සමූහ සබැඳිය ඇතුළත් කරන්න!')
				if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('සබැඳිය වලංගු නැත!')
				const result = args[0].match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)
				if (!result) return m.reply('Link Invalid❗')
				m.reply(mess.wait)
				await nimesha.groupAcceptInvite(result[1]).catch((res) => {
					if (res.data == 400) return m.reply('සමූහය හොයාගත නොහැකිය❗');
					if (res.data == 401) return m.reply('Bot සමූහයෙන් kick කෙරිණ❗');
					if (res.data == 409) return m.reply('බොට් දැනටමත් එම සමූහයට සම්බන්ධ වී ඇත❗');
					if (res.data == 410) return m.reply('සමූහ URL නැවත සකස් කෙරිණ❗');
					if (res.data == 500) return m.reply('සමූහය පිරී ඇත❗');
				})
			}
			break
			case 'leave': {
				if (!isCreator) return m.reply(mess.owner)
				await nimesha.groupLeave(m.chat).then(() => nimesha.sendFromOwner(ownerNumber, 'සමූහයෙන් සාර්ථකව ඉවත් විය', m, { contextInfo: { isForwarded: true }})).catch(e => {});
			}
			break
			case 'clearchat': {
				if (!isCreator) return m.reply(mess.owner)
				await nimesha.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] }, m.chat).catch((e) => m.reply('Chat මකාදැමීම අසාර්ථකයි!'))
				m.reply('පණිවිඩ සාර්ථකව ඉවත් කෙරිණ')
			}
			break
			case 'getmsgstore': case 'storemsg': {
				if (!isCreator) return m.reply(mess.owner)
				let [teks1, teks2] = text.split`|`
				if (teks1 && teks2) {
					const msgnya = await global.loadMessage(teks1, teks2)
					if (msgnya?.message) await nimesha.relayMessage(m.chat, msgnya.message, {})
					else m.reply('පණිවිඩය හොයාගත නොහැකිය!')
				} else m.reply(`Contoh: ${prefix + command} 123xxx@g.us|3EB0xxx`)
			}
			break
			case 'blokir': case 'block': {
				if (!isCreator) return m.reply(mess.owner)
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await nimesha.updateBlockStatus(numbersOnly, 'block').then((a) => m.reply(mess.done)).catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'listblock': {
				let anu = await nimesha.fetchBlocklist()
				m.reply(`Block සංඛ්‍යාව: ${anu.length}\n` + anu.map(v => '• ' + v.replace(/@.+/, '')).join`\n`)
			}
			break
			case 'openblokir': case 'unblokir': case 'openblock': case 'unblock': {
				if (!isCreator) return m.reply(mess.owner)
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await nimesha.updateBlockStatus(numbersOnly, 'unblock').then((a) => m.reply(mess.done)).catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'ban': case 'banned': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx`)
				const findJid = nimesha.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				if (db.users[nmrnya] && !db.users[nmrnya].ban) {
					db.users[nmrnya].ban = true
					m.reply('User ban කෙරිණ!')
				} else m.reply('User database හි ලියාපදිංචි නැත!')
			}
			break
			case 'unban': case 'unbanned': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx`)
				const findJid = nimesha.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				if (db.users[nmrnya] && db.users[nmrnya].ban) {
					db.users[nmrnya].ban = false
					m.reply('User unban කෙරිණ!')
				} else m.reply('User database හි ලියාපදිංචි නැත!')
			}
			break
			case 'mute': case 'unmute': {
				if (!isCreator) return m.reply(mess.owner)
				if (!m.isGroup) return m.reply(mess.group)
				if (command == 'mute') {
					db.groups[m.chat].mute = true
					m.reply('බොට් මෙම සමූහයේ mute කෙරිණ!')
				} else if (command == 'unmute') {
					db.groups[m.chat].mute = false
					m.reply('Unmute සාර්ථකව සිදු විය')
				}
			}
			break
			case 'addowner': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text || isNaN(text)) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx`)
				const findJid = nimesha.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				if (set?.owner) {
					if (set.owner.find(a => a === nmrnya)) return m.reply('ඒ අංකය දැනටමත් Owner ලැයිස්තුවේ ඇත!')
					set.owner.push(nmrnya);
				}
				m.reply('Owner සාර්ථකව එකතු කෙරිණ')
			}
			break
			case 'delowner': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text || isNaN(text)) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx`)
				const findJid = nimesha.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				let list = set.owner
				const index = list.findIndex(o => o === nmrnya);
				if (index === -1) return m.reply('Owner ලැයිස්තුවේ හොයාගත නොහැකිය!')
				list.splice(index, 1)
				m.reply('Owner සාර්ථකව ඉවත් කෙරිණ')
			}
			break
			case 'adduang': case 'addmoney': {
				if (!isCreator) return m.reply(mess.owner)
				if (!args[0] || !args[1] || isNaN(args[1])) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx 1000`)
				if (args[1].length > 15) return m.reply('මුදල් ප්‍රමාණය දිජිත 15 ක් දක්වා!')
				const findJid = nimesha.findJidByLid(args[0].replace(/[^0-9]/g, '') + '@lid', store);
				const klss = args[0].replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				if (db.users[nmrnya] && db.users[nmrnya].money >= 0) {
					addMoney(args[1], nmrnya, db)
					m.reply('මුදල් සාර්ථකව එකතු කෙරිණ')
				} else m.reply('User database හි ලියාපදිංචි නැත!')
			}
			break
			case 'addlimit': {
				if (!isCreator) return m.reply(mess.owner)
				if (!args[0] || !args[1] || isNaN(args[1])) return m.reply(`Kirim/tag අංකය!\nඋදාහරණ:\n${prefix + command} 94xxx 10`)
				if (args[1].length > 10) return m.reply('Limit ප්‍රමාණය දිජිත 10 ක් දක්වා!')
				const findJid = nimesha.findJidByLid(args[0].replace(/[^0-9]/g, '') + '@lid', store);
				const klss = args[0].replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
					addLimit(args[1], nmrnya, db)
					m.reply('Limit සාර්ථකව එකතු කෙරිණ')
				} else m.reply('User database හි ලියාපදිංචි නැත!')
			}
			break
			case 'listpc': {
				if (!isCreator) return m.reply(mess.owner)
				let anu = Object.keys(store.messages).filter(a => a.endsWith('.net') || a.endsWith('lid'));
				let teks = `● *පෞද්ගලික Chat ලැයිස්තුව*\n\nChat ගණන: ${anu.length} Chat\n\n`
				if (anu.length === 0) return m.reply(teks)
				for (let i of anu) {
					if (store.messages?.[i]?.array?.length) {
						let nama = nimesha.getName(m.sender)
						teks += `${setv} *නම:* ${nama}\n${setv} *User:* @${i.split('@')[0]}\n${setv} *Chat:* https://wa.me/${i.split('@')[0]}\n\n=====================\n\n`
					}
				}
				await m.reply(teks)
			}
			break
			case 'listgc': {
				if (!isCreator) return m.reply(mess.owner)
				let anu = Object.keys(store.messages).filter(a => a.endsWith('@g.us'));
				let teks = `● *සමූහ Chat ලැයිස්තුව*\n\nGroup ගණන: ${anu.length} Group\n\n`
				if (anu.length === 0) return m.reply(teks)
				for (let i of anu) {
					let metadata;
					try {
						metadata = store.groupMetadata[i]
					} catch (e) {
						metadata = (store.groupMetadata[i] = await nimesha.groupMetadata(i).catch(e => ({})))
					}
					teks += metadata?.subject ? `${setv} *නම:* ${metadata.subject}\n${setv} *Admin:* ${metadata.owner ? `@${metadata.owner.split('@')[0]}` : '-' }\n${setv} *ID:* ${metadata.id}\n${setv} *සෑදිණ:* ${moment(metadata.creation * 1000).tz('Asia/Colombo').format('DD/MM/YYYY HH:mm:ss')}\n${setv} *සාමාජිකයින්:* ${metadata.participants.length}\n\n=====================\n\n` : ''
				}
				await m.reply(teks)
			}
			break
			case 'creategc': case 'buatgc': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`උදාහරණ:\n${prefix + command} *Nama Gc*`)
				let group = await nimesha.groupCreate(q, [m.sender])
				let res = await nimesha.groupInviteCode(group.id)
				await m.reply(`*Link Group :* *https://chat.whatsapp.com/${res}*\n\n*Nama Group :* *${group.subject}*\nSegera Masuk dalam 30 seconds\nAgar ලෙස Admin`, { detectLink: true })
				await sleep(30000)
				await nimesha.groupParticipantsUpdate(group.id, [m.sender], 'promote').catch(e => {});
				await nimesha.sendMessage(group.id, { text: 'නිවැරදියි' })
			}
			break
			case 'addsewa': case 'sewa': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`උදාහරණ:\n${prefix + command} https://chat.whatsapp.com/xxx | waktu\n${prefix + command} https://chat.whatsapp.com/xxx | 30 hari`)
				let [teks1, teks2] = text.split('|')?.map(x => x.trim()) || [];
				if (!isUrl(teks1) && !teks1.includes('chat.whatsapp.com/')) return m.reply('සබැඳිය වලංගු නැත!')
				const urlny = teks1.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)
				if (!urlny) return m.reply('Link Invalid❗')
				try {
					await nimesha.groupAcceptInvite(urlny[1])
				} catch (e) {
					if (e.data == 400) return m.reply('සමූහය හොයාගත නොහැකිය❗');
					if (e.data == 401) return m.reply('Bot සමූහයෙන් kick කෙරිණ❗');
					if (e.data == 410) return m.reply('සමූහ URL නැවත සකස් කෙරිණ❗');
					if (e.data == 500) return m.reply('සමූහය පිරී ඇත❗');
				}
				await nimesha.groupGetInviteInfo(urlny[1]).then(a => {
					addExpired({ url: urlny[1], expired: (teks2?.replace(/[^0-9]/g, '') || 30) + 'd', id: a.id }, sewa)
					m.reply('සාර්ථකයි Menambahkan Sewa කාලය: ' + (teks2?.replace(/[^0-9]/g, '') || 30) + ' hari\nOtomatis Keluar Saat Waktu Habis!')
				}).catch(e => m.reply('Sewa එකතු කිරීම අසාර්ථකයි!'))
			}
			break
			case 'delsewa': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`උදාහරණ:\n${prefix + command} https://chat.whatsapp.com/xxxx\n Or \n${prefix + command} id_group@g.us`)
				let urlny;
				if (text.includes('chat.whatsapp.com/')) {
					urlny = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)[1]
				} else if (/@g\.us$/.test(text)) {
					urlny = text.trim()
				} else {
					return m.reply('Format වලංගු නොවේ❗')
				}
				if (checkStatus(urlny, sewa)) {
					await m.reply('සාර්ථකයි Menghapus Sewa')
					await nimesha.groupLeave(getStatus(urlny, sewa).id).catch(e => {});
					sewa.splice(getPosition(urlny, sewa), 1);
				} else m.reply(`${text} Database හි ලියාපදිංචි නැත\nඋදාහරණ:\n${prefix + command} https://chat.whatsapp.com/xxxx\n Or \n${prefix + command} id_group@g.us`)
			}
			break
			case 'listsewa': {
				if (!isCreator) return m.reply(mess.owner)
				let txt = `*------「 Sewa ලැයිස්තුව 」------*\n\n`
				for (let s of sewa) {
					txt += `➸ *ID:* ${s.id}\n➸ *URL:* https://chat.whatsapp.com/${s.url}\n➸ *Expired:* ${formatDate(s.expired)}\n\n`
				}
				m.reply(txt)
			}
			break
			case 'addpr': case 'addprem': case 'addpremium': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`උදාහරණ:\n${prefix + command} @tag|waktu\n${prefix + command} @${m.sender.split('@')[0]}|30 hari`)
				let [teks1, teks2] = text.split('|').map(x => x.trim());
				const findJid = nimesha.findJidByLid(teks1.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = teks1.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				if (teks2) {
					if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
						addExpired({ id: nmrnya, expired: teks2.replace(/[^0-9]/g, '') + 'd' }, premium);
						m.reply(`සාර්ථකයි ${command} @${nmrnya.split('@')[0]} කාලය: ${teks2}`)
						db.users[nmrnya].limit += db.users[nmrnya].vip ? limit.vip : limit.premium
						db.users[nmrnya].money += db.users[nmrnya].vip ? money.vip : money.premium
					} else m.reply('අංකය BOT හි ලියාපදිංචි නෑ!\nPastikan Nomer Pernah Menggunakan BOT!')
				} else m.reply(`කාලය ඇතුළත් කරන්න!\උදාහරණ:\n${prefix + command} @tag|waktu\n${prefix + command} @${m.sender.split('@')[0]}|30d\n_d = day_`)
			}
			break
			case 'delpr': case 'delprem': case 'delpremium': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply(`උදාහරණ:\n${prefix + command} @tag`)
				const findJid = nimesha.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
				const nmrnya = nimesha.findJidByLid(klss, store, true)
				if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
					if (checkStatus(nmrnya, premium)) {
						premium.splice(getPosition(nmrnya, premium), 1);
						m.reply(`සාර්ථකයි ${command} @${nmrnya.split('@')[0]}`)
						db.users[nmrnya].limit += db.users[nmrnya].vip ? limit.vip : limit.free
						db.users[nmrnya].money += db.users[nmrnya].vip ? money.vip : money.free
					} else m.reply(`User @${nmrnya.split('@')[0]} Premium නොවේ❗`)
				} else m.reply('අංකය BOT හි ලියාපදිංචි නෑ!')
			}
			break
			case 'listpr': case 'listprem': case 'listpremium': {
				if (!isCreator) return m.reply(mess.owner)
				let txt = `*------「 Premium ලැයිස්තුව 」------*\n\n`
				for (let userprem of premium) {
					txt += `➸ *අංකය:* @${userprem.id.split('@')[0]}\n➸ *Limit:* ${db.users[userprem.id].limit}\n➸ *Money:* ${db.users[userprem.id].money.toLocaleString('id-ID')}\n➸ *Expired:* ${formatDate(userprem.expired)}\n\n`
				}
				m.reply(txt)
			}
			break
			case 'upsw': {
				if (!isCreator) return m.reply(mess.owner)
				const statusJidList = Object.keys(db.users)
				const backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
				try {
					if (quoted.isMedia) {
						if (/image|video/.test(quoted.mime)) {
							await nimesha.sendMessage('status@broadcast', {
								[`${quoted.mime.split('/')[0]}`]: await quoted.download(),
								caption: text || m.quoted?.body || ''
							}, { statusJidList, broadcast: true })
							m.react('✅')
						} else if (/audio/.test(quoted.mime)) {
							await nimesha.sendMessage('status@broadcast', {
								audio: await quoted.download(),
								mimetype: 'audio/mp4',
								ptt: true
							}, { backgroundColor, statusJidList, broadcast: true })
							m.react('✅')
						} else m.reply('Video/Audio/Image/Text පමණ සහාය දෙයි')
					} else if (quoted.text) {
						await nimesha.sendMessage('status@broadcast', { text: text || m.quoted?.body || '' }, {
							textArgb: 0xffffffff,
							font: Math.floor(Math.random() * 9),
							backgroundColor, statusJidList,
							broadcast: true
						})
						m.react('✅')
					} else m.reply('Video/Audio/Image/Text පමණ සහාය දෙයි')
				} catch (e) {
					m.reply('WhatsApp Status Upload අසාර්ථකයි!')
				}
			}
			break
			case 'addcase': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text && !text.startsWith('case')) return m.reply('Case ඇතුළත් කරන්න!')
				fs.readFile('nima.js', 'utf8', (err, data) => {
					if (err) {
						console.error('File කියවීමේ දෝෂයක්:', err);
						return;
					}
					const posisi = data.indexOf("case '19rujxl1e':");
					if (posisi !== -1) {
						const codeBaru = data.slice(0, posisi) + '\n' + `${text}` + '\n' + data.slice(posisi);
						fs.writeFile('nima.js', codeBaru, 'utf8', (err) => {
							if (err) {
								m.reply('File ලිවීමේ දෝෂයක්: ', err);
							} else m.reply('Case සාර්ථකව එකතු කෙරිණ');
						});
					} else m.reply('Case එකතු කිරීම අසාර්ථකයි!');
				});
			}
			break
			case 'getcase': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply('Case නම ඇතුළත් කරන්න!')
				try {
					const getCase = (cases) => {
						return "case"+`'${cases}'`+fs.readFileSync("nima.js").toString().split('case \''+cases+'\'')[1].split("break")[0]+"break"
					}
					m.reply(`${getCase(text)}`)
				} catch (e) {
					m.reply(`case ${text} හොයාගත නොහැකිය!`)
				}
			}
			break
			case 'delcase': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply('Case නම ඇතුළත් කරන්න!')
				fs.readFile('nima.js', 'utf8', (err, data) => {
					if (err) {
						console.error('File කියවීමේ දෝෂයක්:', err);
						return;
					}
					const regex = new RegExp(`case\\s+'${text.toLowerCase()}':[\\s\\S]*?break`, 'g');
					const modifiedData = data.replace(regex, '');
					fs.writeFile('nima.js', modifiedData, 'utf8', (err) => {
						if (err) {
							m.reply('File ලිවීමේ දෝෂයක්: ', err);
						} else m.reply('File වෙතින් Case සාර්ថකව ඉවත් කෙරිණ');
					});
				});
			}
			break
			case 'backup': {
				if (!isCreator) return m.reply(mess.owner)
				switch (args[0]) {
					case 'all':
					let bekup = './database/backup_all.tar.gz';
					tarBackup('./', bekup).then(() => {
						return m.reply({
							document: fs.readFileSync(bekup),
							mimetype: 'application/gzip',
							fileName: 'backup_all.tar.gz'
						})
					}).catch(e => m.reply('Backup අසාර්ථකයි: ', + e))
					break
					case 'auto':
					if (set.autobackup) return m.reply('මීට පෙර සක්‍රිය කර ඇත!')
					set.autobackup = true
					m.reply('ස්වයංක්‍රීය උපස්ථ කිරීම සාර්ථකව සක්‍රීය කරන ලදි')
					break
					case 'session':
					await m.reply({
						document: fs.readFileSync('./nima/creds.json'),
						mimetype: 'application/json',
						fileName: 'creds.json'
					});
					break
					case 'database':
					let tglnya = new Date().toISOString().replace(/[:.]/g, '-');
					let datanya = './database/' + tempatDB;
					if (tempatDB.startsWith('mongodb')) {
						datanya = './database/backup_database.json';
						fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), 'utf-8');
					}
					await m.reply({
						document: fs.readFileSync(datanya),
						mimetype: 'application/json',
						fileName: tglnya + '_database.json'
					})
					break
					default:
					m.reply('භාවිතා කරන්න perintah:\n- backup all\n- backup auto\n- backup session\n- backup database');
				}
			}
			break
			case 'getsession': {
				if (!isCreator) return m.reply(mess.owner)
				await m.reply({
					document: fs.readFileSync('./nima/creds.json'),
					mimetype: 'application/json',
					fileName: 'creds.json'
				});
			}
			break
			case 'deletesession': case 'delsession': {
				if (!isCreator) return m.reply(mess.owner)
				fs.readdir('./nima', async function (err, files) {
					if (err) {
						console.error('Directory scan කළ නොහැකිය: ' + err);
						return m.reply('Directory scan කළ නොහැකිය: ' + err);
					}
					let filteredArray = await files.filter(item => ['session-', 'pre-key', 'sender-key', 'app-state'].some(ext => item.startsWith(ext)));					
					let teks = `හඳුනාගත් ${filteredArray.length} Session file\n\n`
					if(filteredArray.length == 0) return m.reply(teks);
					filteredArray.map(function(e, i) {
						teks += (i+1)+`. ${e}\n`
					})
					if (text && text == 'true') {
						let { key } = await m.reply('Session File මකා දමිනු...')
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./nima/' + file)
						});
						sleep(2000)
						m.reply('Session Garbage සාර්ථකව මකා දැමිණ', { edit: key })
					} else m.reply(teks + `\nKetik _${prefix + command} true_\nමැකීමට`)
				});
			}
			break
			case 'deletesampah': case 'delsampah': {
				if (!isCreator) return m.reply(mess.owner)
				fs.readdir('./database/sampah', async function (err, files) {
					if (err) {
						console.error('Directory scan කළ නොහැකිය: ' + err);
						return m.reply('Directory scan කළ නොහැකිය: ' + err);
					}
					let filteredArray = await files.filter(item => ['gif', 'png', 'bin','mp3', 'mp4', 'jpg', 'webp', 'webm', 'opus', 'jpeg'].some(ext => item.endsWith(ext)));
					let teks = `හඳුනාගත් ${filteredArray.length} Garbage file\n\n`
					if(filteredArray.length == 0) return m.reply(teks);
					filteredArray.map(function(e, i) {
						teks += (i+1)+`. ${e}\n`
					})
					if (text && text == 'true') {
						let { key } = await m.reply('Garbage File මකා දමිනු...')
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./database/temp/' + file)
						});
						sleep(2000)
						m.reply('Garbage සාර්ථකව මකා දැමිණ', { edit: key })
					} else m.reply(teks + `\nKetik _${prefix + command} true_\nමැකීමට`)
				});
			}
			break
			case 'setnamebot': case 'setbotname': {
				if (!isCreator) return m.reply(mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						botname: teksnya.trim()
					});
					m.reply('සාර්ථකයි')
				} else m.reply(`Contoh: ${prefix + command} textnya`)
			}
			break
			case 'setpacknamebot': case 'setbotpackname': {
				if (!isCreator) return m.reply(mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						packname: teksnya.trim()
					});
					m.reply('සාර්ථකයි')
				} else m.reply(`Contoh: ${prefix + command} textnya`)
			}
			break
			case 'setauthorbot': case 'setbotauthor': {
				if (!isCreator) return m.reply(mess.owner)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await updateSettings({
						filePath: settingsPath,
						author: teksnya.trim()
					});
					m.reply('සාර්ථකයි')
				} else m.reply(`Contoh: ${prefix + command} textnya`)
			}
			break
			case 'setapikey': {
				if (!isCreator) return m.reply(mess.owner)
				if (!text) return m.reply('API key කොහේද?')
				if (!text.startsWith('nz-')) return m.reply('Apikey නැහැ Valid!\nAmbil Apikey di : https://nima.biz.id/profile');
				let old_key = global.APIKeys[global.APIs.nimesha];
				await updateSettings({
					filePath: settingsPath,
					apikey: text.trim()
				});
				m.reply(`*Apikey වෙනස් කෙරිණ ${old_key} ලෙස ${q}*`)
			}
			break
			case 'sc': case 'script': {
				await m.reply(`https://github.com/nimesha206/nimabw\n⬆️ මෙය Script එකයි`, {
					contextInfo: {
						forwardingScore: 10,
						isForwarded: true,
						forwardedNewsletterMessageInfo: {
							newsletterJid: my.ch,
							serverMessageId: null,
							newsletterName: 'Miss Shasikala'
						},
						externalAdReply: {
							title: author,
							body: 'Subscribe My YouTube',
							thumbnail: fake.thumbnail,
							mediaType: 2,
							mediaUrl: my.yt,
							sourceUrl: my.yt,
						}
					}
				})
			}
			break
			case 'donasi': case 'donate': {
				m.reply('ආධාර කළ හැක්කේ මෙම URL හරහාය:\nhttps://saweria.co/nimesha206')
			}
			break
			
			// Group Menu
			case 'add': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					try {
						await nimesha.groupParticipantsUpdate(m.chat, [nmrnya], 'add').then(async (res) => {
							for (let i of res) {
								let invv = await nimesha.groupInviteCode(m.chat)
								const statusMessages = {
									200: `සාර්ථකව @${nmrnya.split('@')[0]} සමූහයට එකතු කෙරිණ!`,
									401: 'ඔහු/ඇය Bot block කර ඇත!',
									409: 'ඔහු/ඇය දැනටමත් සම්බන්ධ වී ඇත!',
									500: 'Grup Penuh!'
								};
								if (statusMessages[i.status]) {
									return m.reply(statusMessages[i.status]);
								} else if (i.status == 408) {
									await m.reply(`@${nmrnya.split('@')[0]} මෑතකදී මෙම සමූහයෙන් ඉවත් වී ඇත!\n\nඉලක්කය Private නිසා\n\nආරාධනය යවනු ලබේ\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nපෞද්ගලික ලෙස`)
									await m.reply(`${'https://chat.whatsapp.com/' + invv}\n------------------------------------------------------\n\nAdmin: @${m.sender.split('@')[0]}\nඔබව මෙම සමූහයට ආරාධනා කරයි\nකැමති නම් සම්බන්ධ වන්න🙇`, { detectLink: true, chat: nmrnya, quoted: fkontak }).catch((err) => m.reply('Gagal Mengirim Undangan!'))
								} else if (i.status == 403) {
									let a = i.content.content[0].attrs
									await nimesha.sendGroupInviteV4(m.chat, nmrnya, a.code, a.expiration, m.metadata.subject, `Admin: @${m.sender.split('@')[0]}\nඔබව මෙම සමූහයට ආරාධනා කරයි\nකැමති නම් සම්බන්ධ වන්න🙇`, null, { mentions: [m.sender] })
									await m.reply(`@${nmrnya.split('@')[0]} එකතු කළ නොහැකිය\n\nඉලක්කය Private නිසා\n\nආරාධනය යවනු ලබේ\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nපෞද්ගලික ලෙස`)
								} else m.reply('User එකතු කිරීම අසාර්ථකයි\nStatus: ' + i.status)
							}
						})
					} catch (e) {
						m.reply('දෝෂයක් ඇති! User එකතු කිරීම අසාර්ථකයි')
					}
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'kick': case 'dor': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					await nimesha.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'promote': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					await nimesha.groupParticipantsUpdate(m.chat, [nmrnya], 'promote').catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'demote': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					await nimesha.groupParticipantsUpdate(m.chat, [nmrnya], 'demote').catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'warn': case 'warning': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					if (!db.groups[m.chat].warn[nmrnya]) {
						db.groups[m.chat].warn[nmrnya] = 1
						m.reply('අවවාදය 1/4, ඕනෑම වේලාවක kick කෙරේ❗')
					} else if (db.groups[m.chat].warn[nmrnya] >= 3) {
						await nimesha.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply('අසාර්ථකයි!'))
						delete db.groups[m.chat].warn[nmrnya]
					} else {
						db.groups[m.chat].warn[nmrnya] += 1
						m.reply(`Peringatan ${db.groups[m.chat].warn[nmrnya]}/4, akan dikick sewaktu waktu❗`)
					}
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'unwarn': case 'delwarn': case 'unwarning': case 'delwarning': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender
					const findJid = nimesha.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net')
					const nmrnya = nimesha.findJidByLid(klss, store, true)
					if (db.groups[m.chat]?.warn?.[nmrnya]) {
						delete db.groups[m.chat].warn[nmrnya]
						m.reply('Warning සාර්ථකව ඉවත් කෙරිණ')
					}
				} else m.reply(`Contoh: ${prefix + command} 94xxx`)
			}
			break
			case 'setname': case 'setnamegc': case 'setsubject': case 'setsubjectgc': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await nimesha.groupUpdateSubject(m.chat, teksnya).catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} textnya`)
			}
			break
			case 'setdesc': case 'setdescgc': case 'setdesk': case 'setdeskgc': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text
					await nimesha.groupUpdateDescription(m.chat, teksnya).catch((err) => m.reply('අසාර්ථකයි!'))
				} else m.reply(`Contoh: ${prefix + command} textnya`)
			}
			break
			case 'setppgroups': case 'setppgrup': case 'setppgc': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (!m.quoted) return m.reply('Bot Profile ඡායාරූපයට Reply කරන්න')
				if (!/image/.test(quoted.type)) return m.reply(`Caption සමග Image Reply කරන්න ${prefix + command}`)
				let media = await quoted.download();
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512)
				await nimesha.query({
					tag: 'iq',
					attrs: {
						target: m.chat,
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply('සාර්ථකයි')
			}
			break
			case 'delete': case 'del': case 'd': {
				if (!m.quoted) return m.reply('Delete කිරීමට Reply කරන්න')
				await nimesha.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: m.isBotAdmin ? false : true, id: m.quoted.id, participant: m.quoted.sender }})
			}
			break
			case 'pin': case 'unpin': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				await nimesha.sendMessage(m.chat, { pin: { type: command == 'pin' ? 1 : 0, time: 2592000, key: m.quoted ? m.quoted.key : m.key }})
			}
			break
			case 'linkgroup': case 'linkgrup': case 'linkgc': case 'urlgroup': case 'urlgrup': case 'urlgc': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				let response = await nimesha.groupInviteCode(m.chat)
				await m.reply(`https://chat.whatsapp.com/${response}\n\nLink Group : ${(store.groupMetadata[m.chat] ? store.groupMetadata[m.chat] : (store.groupMetadata[m.chat] = await nimesha.groupMetadata(m.chat))).subject}`, { detectLink: true })
			}
			break
			case 'revoke': case 'newlink': case 'newurl': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				await nimesha.groupRevokeInvite(m.chat).then((a) => {
					m.reply(`සාර්ථකයි Menyetel Ulang, Tautan Undangan Grup ${m.metadata.subject}`)
				}).catch((err) => m.reply('අසාර්ථකයි!'))
			}
			break
			case 'group': case 'grup': case 'gc': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				let set = db.groups[m.chat]
				switch (args[0]?.toLowerCase()) {
					case 'close': case 'open':
					await nimesha.groupSettingUpdate(m.chat, args[0] == 'close' ? 'announcement' : 'not_announcement').then(a => m.reply(`*සාර්ථකයි ${args[0] == 'open' ? 'Membuka' : 'Menutup'} Group*`))
					break
					case 'join':
					const _list = await nimesha.groupRequestParticipantsList(m.chat).then(a => a.map(b => b.jid))
					if (/(a(p|pp|cc)|(ept|rove))|true|ok/i.test(args[1]) && _list.length > 0) {
						await nimesha.groupRequestParticipantsUpdate(m.chat, _list, 'approve').catch(e => m.react('❌'))
					} else if (/reject|false|no/i.test(args[1]) && _list.length > 0) {
						await nimesha.groupRequestParticipantsUpdate(m.chat, _list, 'reject').catch(e => m.react('❌'))
					} else m.reply(`List Request Join :\n${_list.length > 0 ? '- @' + _list.join('\n- @').split('@')[0] : '*Nothing*'}\nඋදාහරණ : ${prefix + command} join acc/reject`)
					break
					case 'pesansementara': case 'disappearing':
					if (/90|7|1|24|on/i.test(args[1])) {
						nimesha.sendMessage(m.chat, { disappearingMessagesInChat: /90/i.test(args[1]) ? 7776000 : /7/i.test(args[1]) ? 604800 : 86400 })
					} else if (/0|off|false/i.test(args[1])) {
						nimesha.sendMessage(m.chat, { disappearingMessagesInChat: 0 })
					} else m.reply('කරුණාකර තෝරන්න:\nදිනා 90, දිනා 7, දිනා 1, off')
					break
					case 'antilink': case 'antivirtex': case 'antidelete': case 'welcome': case 'antitoxic': case 'waktusholat': case 'nsfw': case 'antihidetag': case 'setinfo': case 'antitagsw': case 'leave': case 'promote': case 'demote':
					if (/on|true/i.test(args[1])) {
						if (set[args[0]]) return m.reply('*මීට පෙර සක්‍රිය කර ඇත*')
						set[args[0]] = true
						m.reply('*සාර්ථකයි Change To On*')
					} else if (/off|false/i.test(args[1])) {
						set[args[0]] = false
						m.reply('*සාර්ථකයි Change To Off*')
					} else m.reply(`❗${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`)
					break
					case 'setwelcome': case 'setleave': case 'setpromote': case 'setdemote':
					if (args[1]) {
						set.text[args[0]] = args.slice(1).join(' ');
						m.reply(`සාර්ථකයි Mengubah ${args[0].split('set')[1]} ලෙස:\n${set.text[args[0]]}`)
					} else m.reply(`උදාහරණ:\n${prefix + command} ${args[0]} Isi පණිවිඩnya\n\nMisal Dengan tag:\n${prefix + command} ${args[0]} Kepada @\nMaka akan ලෙස:\nKepada @0\n\nMisal dengan Tag admin:\n${prefix + command} ${args[0]} Dari @admin untuk @\nMaka akan ලෙස:\nDari @${m.sender.split('@')[0]} untuk @0\n\nMisal dengan Nama grup:\n${prefix + command} ${args[0]} Dari @admin untuk @ di @subject\nMaka akan ලෙස:\nDari @${m.sender.split('@')[0]} untuk @0 di ${m.metadata.subject}`)
					break
					default:
					m.reply(`සමූහ සැකසුම් ${m.metadata.subject}\n- open\n- close\n- join acc/reject\n- disappearing 90/7/1/off\n- antilink on/off ${set.antilink ? '🟢' : '🔴'}\n- antivirtex on/off ${set.antivirtex ? '🟢' : '🔴'}\n- antidelete on/off ${set.antidelete ? '🟢' : '🔴'}\n- welcome on/off ${set.welcome ? '🟢' : '🔴'}\n- leave on/off ${set.leave ? '🟢' : '🔴'}\n- promote on/off ${set.promote ? '🟢' : '🔴'}\n- demote on/off ${set.demote ? '🟢' : '🔴'}\n- setinfo on/off ${set.setinfo ? '🟢' : '🔴'}\n- nsfw on/off ${set.nsfw ? '🟢' : '🔴'}\n- waktusholat on/off ${set.waktusholat ? '🟢' : '🔴'}\n- antihidetag on/off ${set.antihidetag ? '🟢' : '🔴'}\n- antitagsw on/off ${set.antitagsw ? '🟢' : '🔴'}\n\n- setwelcome _textnya_\n- setleave _textnya_\n- setpromote _textnya_\n- setdemote _textnya_\n\nඋදාහරණ:\n${prefix + command} antilink off`)
				}
			}
			break
			case 'tagall': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				let setv = pickRandom(listv)
				let teks = `*සියල්ලන් ටැග්*\n\n*පණිවිඩය:* ${q ? q : ''}\n\n`
				for (let mem of m.metadata.participants) {
					teks += `${setv} @${mem.id.split('@')[0]}\n`
				}
				await m.reply(teks, { mentions: m.metadata.participants.map(a => a.id) })
			}
			break
			case 'hidetag': case 'h': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				await m.reply(q ? q : '', { mentions: m.metadata.participants.map(a => a.id) })
			}
			break
			case 'totag': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!m.isAdmin) return m.reply(mess.admin)
				if (!m.isBotAdmin) return m.reply(mess.botAdmin)
				if (!m.quoted) return m.reply(`Reply pesan dengan caption ${prefix + command}`)
				delete m.quoted.chat
				await nimesha.sendMessage(m.chat, { forward: m.quoted.fakeObj(), mentions: m.metadata.participants.map(a => a.id) })
			}
			break
			case 'listonline': case 'liston': {
				if (!m.isGroup) return m.reply(mess.group)
				let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
				if (!store.presences || !store.presences[id]) return m.reply('දැනට කිසිවෙකු Online නැත!')
				let online = [...Object.keys(store.presences[id]), botNumber]
				await m.reply('Online ලැයිස්තුව:\n\n' + online.map(v => setv + ' @' + v.replace(/@.+/, '')).join`\n`, { mentions: online }).catch((e) => m.reply('දැනට Online කිසිවෙකු නැත..'))
			}
			break
			
			// Bot Menu
			case 'owner': case 'listowner': {
				await nimesha.sendContact(m.chat, ownerNumber, m);
			}
			break
			case 'profile': case 'cek': {
				const user = Object.keys(db.users)
				const infoUser = db.users[m.sender]
				await m.reply(`*👤Profile @${m.sender.split('@')[0]}* :\n🐋Bot User: ${user.includes(m.sender) ? 'True' : 'False'}\n🔥User: ${isVip ? 'VIP' : isPremium ? 'PREMIUM' : 'FREE'}${isPremium ? `\n⏳Expired : ${checkStatus(m.sender, premium) ? formatDate(getExpired(m.sender, db.premium)) : '-'}` : ''}\n🎫Limit: ${infoUser.limit}\n💰මුදල්: ${infoUser ? infoUser.money.toLocaleString('id-ID') : '0'}`)
			}
			break
			case 'leaderboard': {
				const entries = Object.entries(db.users).sort((a, b) => b[1].money - a[1].money).slice(0, 10).map(entry => entry[0]);
				let teksnya = '╭──❍「 *LEADERBOARD* 」❍\n'
				for (let i = 0; i < entries.length; i++) {
					teksnya += `│• ${i + 1}. @${entries[i].split('@')[0]}\n│• Balance: ${db.users[entries[i]].money.toLocaleString('id-ID')}\n│\n`
				}
				m.reply(teksnya + '╰──────❍');
			}
			break
			case 'totalpesan': {
				let messageCount = {};
				let messages = store?.messages[m.chat]?.array || [];
				let participants = m?.metadata?.participants?.map(p => p.id) || store?.messages[m.chat]?.array?.map(p => p.key.participant) || [];
				messages.forEach(mes => {
					if (mes.key?.participant && mes.message) {
						messageCount[mes.key.participant] = (messageCount[mes.key.participant] || 0) + 1;
					}
				});
				let totalMessages = Object.values(messageCount).reduce((a, b) => a + b, 0);
				let date = new Date().toLocaleDateString('id-ID');
				let zeroMessageUsers = participants.filter(user => !messageCount[user]).map(user => `- @${user.replace(/[^0-9]/g, '')}`);
				let messageList = Object.entries(messageCount).map(([sender, count], index) => `${index + 1}. @${sender.replace(/[^0-9]/g, '')}: ${count} පණිවිඩ`);
				let result = `මුළු පණිවිඩ ${totalMessages} සිට ${participants.length} සාමාජිකයින්\nදිනට ${date}:\n${messageList.join('\n')}\n\nසටහන: ${text.length > 0 ? `\n${zeroMessageUsers.length > 0 ? `පණිවිඩ නොයැවූ සාමාජිකයින් (Sider):\n${zeroMessageUsers.join('\n')}` : 'Semua සාමාජිකයින් sudah mengirim pesan!'}` : `\nSider පරීක්ෂා? ${prefix + command} --sider`}`;
				m.reply(result)
			}
			break
			case 'req': case 'request': {
				if (!text) return m.reply('Owner ට ඉල්ලීමක් කරන්නේ?')
				await m.reply(`*Request Telah Terkirim Ke Owner*\n_Terima Kasih🙏_`)
				await nimesha.sendFromOwner(ownerNumber, `පණිවිඩය: @${m.sender.split('@')[0]}\nUntuk Owner\n\nRequest ${text}`, m, { contextInfo: { mentionedJid: [m.sender], isForwarded: true }})
			}
			break
			case 'totalfitur': {
				const total = ((fs.readFileSync('./nima.js').toString()).match(/case '/g) || []).length
				m.reply(`Total Fitur : ${total}`);
			}
			break
			case 'daily': case 'claim': {
				daily(m, db)
			}
			break
			case 'transfer': case 'tf': {
				transfer(m, args, db)
			}
			break
			case 'buy': {
				buy(m, args, db)
			}
			break
			case 'react': {
				nimesha.sendMessage(m.chat, { react: { text: args[0], key: m.quoted ? m.quoted.key : m.key }})
			}
			break
			case 'tagme': {
				m.reply(`@${m.sender.split('@')[0]}`, { mentions: [m.sender] })
			}
			break
			case 'runtime': case 'tes': case 'bot': {
				switch(args[0]) {
					case 'mode': case 'public': case 'self':
					if (!isCreator) return m.reply(mess.owner)
					if (args[1] == 'public' || args[1] == 'all') {
						if (nimesha.public && set.grouponly && set.privateonly) return m.reply('*මීට පෙර සක්‍රිය කර ඇත*')
						nimesha.public = set.public = true
						set.grouponly = true
						set.privateonly = true
						m.reply('*Public ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else if (args[1] == 'self') {
						set.grouponly = false
						set.privateonly = false
						nimesha.public = set.public = false
						m.reply('*Self ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else if (args[1] == 'group') {
						set.grouponly = true
						set.privateonly = false
						m.reply('*Group Only ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else if (args[1] == 'private') {
						set.grouponly = false
						set.privateonly = true
						m.reply('*Private Only ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else m.reply('Mode: self/public/group/private/all')
					break
					case 'anticall': case 'autobio': case 'autoread': case 'autotyping': case 'readsw': case 'multiprefix': case 'antispam': case 'didyoumean':
					if (!isCreator) return m.reply(mess.owner)
					if (args[1] == 'on') {
						if (set[args[0]]) return m.reply('*මීට පෙර සක්‍රිය කර ඇත*')
						set[args[0]] = true
						m.reply('*On ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else if (args[1] == 'off') {
						set[args[0]] = false
						m.reply('*Off ලෙස සාර්ථකව වෙනස් කෙරිණ*')
					} else m.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`)
					break
					case 'set': case 'settings':
					let settingsBot = Object.entries(set).map(([key, value]) => {
						let list = key == 'status' ? new Date(value).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : (typeof value === 'boolean') ? (value ? 'on🟢' : 'off🔴') : (typeof value === 'object') ? `\n${value.map(a => '- ' + a).join('\n')}` : value;
						return `- ${key.charAt(0).toUpperCase() + key.slice(1)} : ${list}`;
					}).join('\n');
					m.reply(`Settings Bot @${botNumber.split('@')[0]}\n${settingsBot}\n\nඋදාහරණ: ${prefix + command} mode`);
					break
					default:
					if (args[0] || args[1]) m.reply(`*කරුණාකර Settings තෝරන්න:*\n- Mode : *${prefix + command} mode self/public*\n- Anti Call : *${prefix + command} anticall on/off*\n- Auto Bio : *${prefix + command} autobio on/off*\n- Auto Read : *${prefix + command} autoread on/off*\n- Auto Typing : *${prefix + command} autotyping on/off*\n- Read Sw : *${prefix + command} readsw on/off*\n- Multi Prefix : *${prefix + command} multiprefix on/off*`)
				}
				if (!args[0] && !args[1]) return m.reply(`*Bot ක්‍රියාත්මකව ඇත්තේ*\n*${runtime(process.uptime())}*`)
			}
			break
			case 'ping': case 'botstatus': case 'statusbot': {
				const used = process.memoryUsage()
				const cpus = os.cpus().map(cpu => {
					cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
					return cpu
				})
				const cpu = cpus.reduce((last, cpu, _, { length }) => {
					last.total += cpu.total
					last.speed += cpu.speed / length
					last.times.user += cpu.times.user
					last.times.nice += cpu.times.nice
					last.times.sys += cpu.times.sys
					last.times.idle += cpu.times.idle
					last.times.irq += cpu.times.irq
					return last
				}, {
					speed: 0,
					total: 0,
					times: {
						user: 0,
						nice: 0,
						sys: 0,
						idle: 0,
						irq: 0
					}
				})
				let timestamp = speed()
				let latensi = speed() - timestamp
				neww = performance.now()
				oldd = performance.now()
				respon = `Response වේගය ${latensi.toFixed(4)} _Seconds_ \n ${oldd - neww} _milliseconds_\n\nRuntime: ${runtime(process.uptime())}\n\n💻 Server Info\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\n\n_NodeJS Memory Usage_\n${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}\n\n${cpus[0] ? `_CPU Usage_\n${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}\n_CPU Core(s) Usage (${cpus.length} Core CPU)_\n${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim()
				m.reply(respon)
			}
			break
			case 'speedtest': case 'speed': {
				m.reply('Speed පරීක්ෂා කරමින්...')
				let cp = require('child_process')
				let { promisify } = require('util')
				let exec = promisify(cp.exec).bind(cp)
				let o
				try {
					o = await exec('python3 speed.py --share')
				} catch (e) {
					o = e
				} finally {
					let { stdout, stderr } = o
					if (stdout.trim()) m.reply(stdout)
					if (stderr.trim()) m.reply(stderr)
				}
			}
			break
			case 'afk': {
				let user = db.users[m.sender]
				user.afkTime = + new Date
				user.afkReason = text
				m.reply(`@${m.sender.split('@')[0]} AFK ලෙස${text ? ': ' + text : ''}`)
			}
			break
			case 'readviewonce': case 'readviewone': case 'rvo': {
				if (!m.quoted) return m.reply(`Reply view once message\nඋදාහරණ: ${prefix + command}`)
				try {
					if (m.quoted.msg.viewOnce) {
						delete m.quoted.chat
						m.quoted.msg.viewOnce = false
						await m.reply({ forward: m.quoted })
					} else m.reply(`Reply view once message\nඋදාහරණ: ${prefix + command}`)
				} catch (e) {
					m.reply('Media නැහැ Valid!')
				}
			}
			break
			case 'inspect': {
				if (!text) return m.reply('සමූහ හෝ Channel සබැඳිය ඇතුළත් කරන්න!')
				let _grup = /chat.whatsapp.com\/([\w\d]*)/;
				let _saluran = /whatsapp\.com\/channel\/([\w\d]*)/;
				if (_grup.test(text)) {
					await nimesha.groupGetInviteInfo(text.match(_grup)[1]).then((_g) => {
						let teks = `*[ INFORMATION GROUP ]*\n\nName Group: ${_g.subject}\nGroup ID: ${_g.id}\nCreate At: ${new Date(_g.creation * 1000).toLocaleString()}${_g.owner ? ('\nCreate By: ' + _g.owner) : '' }\nLinked Parent: ${_g.linkedParent}\nRestrict: ${_g.restrict}\nAnnounce: ${_g.announce}\nIs Community: ${_g.isCommunity}\nCommunity Announce:${_g.isCommunityAnnounce}\nJoin Approval: ${_g.joinApprovalMode}\nMember Add Mode: ${_g.memberAddMode}\nDescription ID: ${'`' + _g.descId + '`'}\nDescription: ${_g.desc}\nParticipants:\n`
						_g.participants.forEach((a) => {
							teks += a.admin ? `- Admin: @${a.id.split('@')[0]} [${a.admin}]\n` : ''
						})
						m.reply(teks)
					}).catch((e) => {
						if ([400, 406].includes(e.data)) return m.reply('සමූහය හොයාගත නොහැකිය❗');
						if (e.data == 401) return m.reply('Bot සමූහයෙන් kick කෙරිණ❗');
						if (e.data == 410) return m.reply('සමූහ URL නැවත සකස් කෙරිණ❗');
					});
				} else if (_saluran.test(text) || text.endsWith('@newsletter') || !isNaN(text)) {
					await nimesha.newsletterMsg(text.match(_saluran)[1]).then((n) => {
						m.reply(`*[ INFORMATION CHANNEL ]*\n\nID: ${n.id}\nState: ${n.state.type}\nName: ${n.thread_metadata.name.text}\nCreate At: ${new Date(n.thread_metadata.creation_time * 1000).toLocaleString()}\nSubscriber: ${n.thread_metadata.subscribers_count}\nVerification: ${n.thread_metadata.verification}\nDescription: ${n.thread_metadata.description.text}\n`)
					}).catch((e) => m.reply('Channel හොයාගත නොහැකිය❗'))
				} else m.reply('සමූහ හෝ Channel URL පමණ සහාය දෙයි!')
			}
			break
			case 'addmsg': {
				if (!m.quoted) return m.reply('Database හි Save කිරීමට Reply කරන්න')
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} file name`)
				let msgs = db.database
				if (text.toLowerCase() in msgs) return m.reply(`'${text}' පණිවිඩ ලැයිස්තුවේ ලියාපදිංචිය`)
				msgs[text.toLowerCase()] = m.quoted
				delete msgs[text.toLowerCase()].chat
				m.reply(`සාර්ථකව ලැයිස්තුවට පණිවිඩය  '${text}'\nලෙස ලබා ගන්නෙ ${prefix}getmsg ${text}\nලැයිස්තුව බලන්නෙ ${prefix}listmsg`)
			}
			break
			case 'delmsg': case 'deletemsg': {
				if (!text) return m.reply('Delete කිරීමට msg නම?')
				let msgs = db.database
				if (text == 'allmsg') {
					db.database = {}
					m.reply('ලැයිස්තුවෙන් msg සියල්ල සාර්ථකව ඉවත් කෙරිණ')
				} else {
					if (!(text.toLowerCase() in msgs)) return m.reply(`'${text}' පණිවිඩ ලැයිස්තුවේ ලියාපදිංචි නැත`)
					delete msgs[text.toLowerCase()]
					m.reply(`සාර්ථකව ඉවත් කෙරිණ '${text}' ලැයිස්තුවෙන්`)
				}
			}
			break
			case 'getmsg': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} file name\n\nලැයිස්තුව බලන්නෙ ${prefix}listmsg`)
				let msgs = db.database
				if (!(text.toLowerCase() in msgs)) return m.reply(`'${text}' ලැයිස්තුවේ ලියාපදිංචි නැත`)
				await nimesha.relayMessage(m.chat, msgs[text.toLowerCase()], {})
			}
			break
			case 'listmsg': {
				let seplit = Object.entries(db.database).map(([nama, isi]) => { return { nama, message: getContentType(isi) }})
				let teks = '「 DATABASE ලැයිස්තුව 」\n\n'
				for (let i of seplit) {
					teks += `${setv} *නම:* ${i.nama}\n${setv} *වර්ගය:* ${i.message?.replace(/Message/i, '')}\n───────────────\n`
				}
				m.reply(teks)
			}
			break
			case 'setcmd': case 'addcmd': {
				if (!m.quoted) return m.reply('රිප්ලයි එකක් ලෙස එවන්න!')
				if (!m.quoted.fileSha256) return m.reply('nima base hash කේතය නැතිවී ඇත. සමාවන්න!')
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} CMD Name`)
				let hash = m.quoted.fileSha256.toString('base64')
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('ස්ටිකර් command වෙනස් කිරීමට ඔබට අවසර නැත')
				global.db.cmd[hash] = {
					creator: m.sender,
					locked: false,
					at: + new Date,
					text
				}
				m.reply('සාර්ථකයි!')
			}
			break
			case 'delcmd': {
				if (!m.quoted) return m.reply('රිප්ලයි එකක් ලෙස එවන්න!')
				if (!m.quoted.fileSha256) return m.reply('nima base hash කේතය නැතිවී ඇත. සමාවන්න!')
				let hash = m.quoted.fileSha256.toString('base64')
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('ස්ටිකර් command වෙනස් කිරීමට ඔබට අවසර නැත')
				delete global.db.cmd[hash];
				m.reply('නිවැරදියි')
			}
			break
			case 'listcmd': {
				let teks = `*Hash ලැයිස්තුව*\nInfo: *bold* hash Lock කෙරිණ\n${Object.entries(global.db.cmd).map(([key, value], index) => `${index + 1}. ${value.locked ? `*${key}*` : key} : ${value.text}`).join('\n')}`.trim()
				nimesha.sendText(m.chat, teks, m);
			}
			break
			case 'lockcmd': case 'unlockcmd': {
				if (!isCreator) return m.reply(mess.owner)
				if (!m.quoted) return m.reply('රිප්ලයි එකක් ලෙස එවන්න!')
				if (!m.quoted.fileSha256) return m.reply('nima base hash කේතය නැතිවී ඇත. සමාවන්න!')
				let hash = m.quoted.fileSha256.toString('base64')
				if (!(hash in global.db.cmd)) return m.reply('ස්ටිකර් command වෙනස් කිරීමට ඔබට අවසර නැත')
				global.db.cmd[hash].locked = !/^un/i.test(command)
			}
			break
			case 'q': case 'quoted': {
				if (!m.quoted) return m.reply('රිප්ලයි එකක් ලෙස එවන්න!')
				if (text) {
					delete m.quoted.chat
					await m.reply({ forward: m.quoted })
				} else {
					try {
						const anu = await m.getQuotedObj()
						if (!anu) return m.reply('Format ලබා ගත නොහැකිය!')
						if (!anu.quoted) return m.reply('ඔබ Reply කළ පණිවිඩය Reply නැත')
						await nimesha.relayMessage(m.chat, { [anu.quoted.type]: anu.quoted.msg }, {})
					} catch (e) {
						return m.reply('Format ලබා ගත නොහැකිය!')
					}
				}
			}
			break
			case 'confes': case 'confess': case 'menfes': case 'menfess': {
				if (!isLimit) return m.reply(mess.limit)
				if (m.isGroup) return m.reply(mess.private)
				if (menfes[m.sender]) return m.reply(`ඔබ Session හි ${command}!`)
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} 94xxxx|Nama Samaran`)
				let [teks1, teks2] = text.split`|`
				if (teks1) {
					const tujuan = teks1.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
					const onWa = await nimesha.onWhatsApp(tujuan)
					if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
					menfes[m.sender] = {
						tujuan: tujuan,
						nama: teks2 ? teks2 : 'Orang'
					};
					menfes[tujuan] = {
						tujuan: m.sender,
						nama: 'Penerima',
					};
					const timeout = setTimeout(() => {
						if (menfes[m.sender]) {
							m.reply(`_Session කාලය ඉකිවිය_`);
							delete menfes[m.sender];
						}
						if (menfes[tujuan]) {
							nimesha.sendMessage(tujuan, { text: `_Session කාලය ඉකිවිය_` });
							delete menfes[tujuan];
						}
						menfesTimeouts.delete(m.sender);
						menfesTimeouts.delete(tujuan);
					}, 600000);
					menfesTimeouts.set(m.sender, timeout);
					menfesTimeouts.set(tujuan, timeout);
					nimesha.sendMessage(tujuan, { text: `_${command} සම්බන්ධ වී ඇත_\n*සටහන:* අවසන් කිරීමට ටයිප් කරන්න _*${prefix}del${command}*_` });
					m.reply(`_ආරම්භ කරමින්... ${command}..._\n*පණිවිඩ/media යැවීම ආරම්භ කරන්න*\n*කාලසීමාව ${command} විනාඩි 10 ක් පමණි*\n*සටහන:* අවසන් කිරීමට ටයිප් කරන්න _*${prefix}del${command}*_`)
					setLimit(m, db)
				} else m.reply(`Masukkan අංකය!\nඋදාහරණ : ${prefix + command} 94xxxx|Nama Samaran`)
			}
			break
			case 'delconfes': case 'delconfess': case 'delmenfes': case 'delmenfess': {
				if (!menfes[m.sender]) return m.reply(`ඔබ Session එකේ නෑ ${command.split('del')[1]}!`)
				let anu = menfes[m.sender]
				if (menfesTimeouts.has(m.sender)) {
					clearTimeout(menfesTimeouts.get(m.sender));
					menfesTimeouts.delete(m.sender);
				}
				if (menfesTimeouts.has(anu.tujuan)) {
					clearTimeout(menfesTimeouts.get(anu.tujuan));
					menfesTimeouts.delete(anu.tujuan);
				}
				nimesha.sendMessage(anu.tujuan, { text: `Chat අවසන් කළේ ${anu.nama ? anu.nama : 'Seseorang'}` })
				m.reply(`සාර්ථකයි Mengakhiri Sesi ${command.split('del')[1]}!`)
				delete menfes[anu.tujuan];
				delete menfes[m.sender];
			}
			break
			case 'cai': case 'roomai': case 'chatai': case 'autoai': {
				if (m.isGroup) return m.reply(mess.private)
				if (chat_ai[m.sender]) return m.reply(`ඔබ Session හි ${command}!`)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} හලො ngab\nWith Prompt: ${prefix + command} හලො ngab|Kamu adalah assisten yang siap membantu dalam hal apapun yang ku minta.\n\nමැකීමට room: ${prefix + 'del' + command}`)
				let [teks1, teks2] = text.split`|`
				chat_ai[m.sender] = [{ role: 'system', content: teks2 || '' }, { role: 'user', content: text.split`|` ? teks1 : text || '' }]
				let hasil = await fetchApi('/ai/chat4', {
					messages: chat_ai[m.sender],
					prompt: budy
				}, { method: 'POST' });
				const response = hasil?.result?.message || 'සමාවෙන්න, මට තේරෙන්නෙ නෑ.';
				chat_ai[m.sender].push({ role: 'assistant', content: response });
				await m.reply(response)
			}
			break
			case 'delcai': case 'delroomai': case 'delchatai': case 'delautoai': {
				if (!chat_ai[m.sender]) return m.reply(`ඔබ Session එකේ නෑ ${command.split('del')[1]}!`)
				m.reply(`සාර්ථකයි Mengakhiri Sesi ${command.split('del')[1]}!`)
				delete chat_ai[m.sender];
			}
			break
			case 'jadibot': {
				if (!isPremium) return m.reply(mess.prem)
				if (!isLimit) return m.reply(mess.limit)
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				await JadiBot(nimesha, nmrnya, m, store)
				m.reply(`භාවිතා කරන්න ${prefix}stopjadibot\nනැවැත්වීමට`)
				setLimit(m, db)
			}
			break
			case 'stopjadibot': case 'deljadibot': {
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
				const onWa = await nimesha.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return m.reply('ඒ අංකය WhatsApp හි ලියාපදිංචි නැත!')
				await StopJadiBot(nimesha, nmrnya, m)
			}
			break
			case 'listjadibot': {
				ListJadiBot(nimesha, m)
			}
			break
			
			// Tools Menu
			case 'fetch': case 'get': {
				if (!isPremium) return m.reply(mess.prem)
				if (!isLimit) return m.reply(mess.limit)
				if (!/^https?:\/\//.test(text)) return m.reply('http:// හෝ https:// ලෙස ආරම්භ කරන්න');
				try {
					const res = await axios.get(isUrl(text) ? isUrl(text)[0] : text)
					if (!/text|json|html|plain/.test(res.headers['content-type'])) {
						await m.reply(text)
					} else m.reply(util.format(res.data))
					setLimit(m, db)
				} catch (e) {
					m.reply(String(e))
				}
			}
			break
			case 'toaud': case 'toaudio': {
				if (!/video|audio/.test(mime)) return m.reply(`Audio ලෙස හරවන Video/Audio Reply/Send කරන්න Caption සමග ${prefix + command}`)
				m.reply(mess.wait)
				let media = await quoted.download()
				let audio = await toAudio(media, 'mp4')
				await m.reply({ audio: audio, mimetype: 'audio/mpeg'})
			}
			break
			case 'tomp3': {
				if (!/video|audio/.test(mime)) return m.reply(`Audio ලෙස හරවන Video/Audio Reply/Send කරන්න Caption සමග ${prefix + command}`)
				m.reply(mess.wait)
				let media = await quoted.download()
				let audio = await toAudio(media, 'mp4')
				await m.reply({ document: audio, mimetype: 'audio/mpeg', fileName: `Convert By Nima Bot.mp3`})
			}
			break
			case 'tovn': case 'toptt': case 'tovoice': {
				if (!/video|audio/.test(mime)) return m.reply(`Audio ලෙස හරවන Video/Audio Reply/Send කරන්න Caption සමග ${prefix + command}`)
				m.reply(mess.wait)
				let media = await quoted.download()
				let audio = await toPTT(media, 'mp4')
				await m.reply({ audio: audio, mimetype: 'audio/ogg; codecs=opus', ptt: true })
			}
			break
			case 'togif': {
				if (!/webp|video/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`)
				m.reply(mess.wait)
				let media = await nimesha.downloadAndSaveMediaMessage(qmsg)
				let ran = `./database/temp/${getRandom('.gif')}`;
				exec(`convert ${media} ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return m.reply('අසාර්ථකයි❗')
					let buffer = fs.readFileSync(ran)
					m.reply({ video: buffer, gifPlayback: true })
					fs.unlinkSync(ran)
				})
			}
			break
			case 'toimage': case 'toimg': {
				if (!/webp|video|image/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`)
				m.reply(mess.wait)
				let media = await nimesha.downloadAndSaveMediaMessage(qmsg)
				let ran = `./database/temp/${getRandom('.png')}`;
				exec(`convert ${media}[0] ${ran}`, (err) => {
					fs.unlinkSync(media)
					if (err) return m.reply('අසාර්ථකයි❗')
					let buffer = fs.readFileSync(ran)
					m.reply({ image: buffer })
					fs.unlinkSync(ran)
				})
			}
			break
			case 'toptv': {
				if (!/video/.test(mime)) return m.reply(`Kirim/Reply Video ඔව්ng Ingin Dijadikan PTV Message Dengan Caption ${prefix + command}`)
				if ((m.quoted ? m.quoted.type : m.type) === 'videoMessage') {
					const anu = await quoted.download()
					const message = await generateWAMessageContent({ video: anu }, { upload: nimesha.waUploadToServer })
					await nimesha.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {})
				} else m.reply('PTV ලෙස හරවන Video Reply කරන්න!')
			}
			break
			case 'tourl': {
				try {
					if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime)) {
						m.reply(mess.wait)
						let media = await quoted.download()
						let anu = await UguuSe(media)
						m.reply('URL: ' + anu.url)
					} else m.reply('Upload කිරීමට Media යවන්න!')
				} catch (e) {
					m.reply('Upload Server offline!')
				}
			}
			break
			case 'texttospech': case 'tts': case 'tospech': {
				if (!text) return m.reply('Mana text yg mau diubah ලෙස audio?')
				let anu = await fetchApi('/tools/tts', { text }, { buffer: true });
				m.reply({ audio: anu, ptt: true, mimetype: 'audio/mpeg' })
			}
			break
			case 'translate': case 'tr': {
				if (text && text == 'list') {
					let list_tr = `╭──❍「 *Language Code* 」❍\n│• af : Afrikaans\n│• ar : Arab\n│• zh : Chinese\n│• en : English\n│• en-us : English (United States)\n│• fr : French\n│• de : German\n│• hi : Hindi\n│• hu : Hungarian\n│• is : Icelandic\n│• id : Indonesian\n│• it : Italian\n│• ja : Japanese\n│• ko : Korean\n│• la : Latin\n│• no : Norwegian\n│• pt : Portuguese\n│• pt : Portuguese\n│• pt-br : Portuguese (Brazil)\n│• ro : Romanian\n│• ru : Russian\n│• sr : Serbian\n│• es : Spanish\n│• sv : Swedish\n│• ta : Tamil\n│• th : Thai\n│• tr : Turkish\n│• vi : Vietnamese\n╰──────❍`;
					m.reply(list_tr)
				} else {
					if (!m.quoted && (!text|| !args[1])) return m.reply(`Caption සමග Text Reply/Send කරන්න ${prefix + command}`)
					let lang = args[0] ? args[0] : 'id'
					let teks = args[1] ? args.slice(1).join(' ') : m.quoted.text
					try {
						let hasil = await fetchApi('/tools/translate', { text: teks, lang });
						m.reply(`Target: ${lang}\n${hasil.result.translate}`)
					} catch (e) {
						m.reply(`Language *${lang}* හොයාගත නොහැකිය!\nලැයිස්තුව බලන්න, ${prefix + command} list`)
					}
				}
			}
			break
			case 'toqr': case 'qr': {
				if (!text) return m.reply(`QR බවට හරවන Text *${prefix + command}* textnya`)
				m.reply(mess.wait)
				let anu = await fetchApi('/tools/to-qr', { data: text }, { buffer: true });
				await m.reply({ image: anu, caption: 'ගනින්' })
			}
			break
			case 'tohd': case 'remini': case 'hd': {
				if (!isLimit) return m.reply(mess.limit)
				if (/image/.test(mime)) {
					try {
						let media = await quoted.download();
						const form = new FormData();
					    form.append('buffer', media, {
					        filename: 'image.jpg',
					        contentType: 'image/jpeg'
					    });
						let hasil = await fetchApi('/tools/remini', form, { buffer: true });
						m.reply({ image: hasil, caption: 'නිවැරදියි' })
						setLimit(m, db)
					} catch (e) {
						let media = await nimesha.downloadAndSaveMediaMessage(qmsg)
						let ran = `./database/temp/${getRandom('.jpg')}`;
						const scaleFactor = isNaN(parseInt(text)) ? 4 : parseInt(text) < 10 ? parseInt(text) : 4;
						exec(`ffmpeg -i "${media}" -vf "scale=iw*${scaleFactor}:ih*${scaleFactor}:flags=lanczos" -q:v 1 "${ran}"`, async (err, stderr, stdout) => {
							fs.unlinkSync(media)
							if (err) return m.reply(String(err))
							let buff = fs.readFileSync(ran)
							await nimesha.sendMedia(m.chat, buff, '', 'නිවැරදියි', m);
							fs.unlinkSync(ran)
							setLimit(m, db)
						});
					}
				} else m.reply(`Kirim/Reply Gambar dengan format\nඋදාහරණ: ${prefix + command}`)
			}
			break
			case 'dehaze': case 'colorize': case 'colorfull': {
				if (!isLimit) return m.reply(mess.limit)
				if (/image/.test(mime)) {
					let media = await quoted.download()
					const form = new FormData();
				    form.append('buffer', media, {
				        filename: 'image.jpg',
				        contentType: 'image/jpeg'
				    });
					let hasil = await fetchApi('/tools/recolor', form, { buffer: true });
					m.reply({ image: hasil, caption: 'නිවැරදියි' });
					setLimit(m, db)
				} else m.reply(`Kirim/Reply Gambar dengan format\nඋදාහරණ: ${prefix + command}`)
			}
			break
			case 'hitamkan': case 'toblack': {
				if (!isLimit) return m.reply(mess.limit)
				if (/image/.test(mime)) {
					let media = await quoted.download()
					const form = new FormData();
					form.append('style', 'summer');
				    form.append('buffer', media, {
				        filename: 'image.jpg',
				        contentType: 'image/jpeg'
				    });
					let hasil = await fetchApi('/create/skin-tone', form, { buffer: true });
					m.reply({ image: hasil, caption: 'නිවැරදියි' });
					setLimit(m, db)
				} else m.reply(`Kirim/Reply Gambar dengan format\nඋදාහරණ: ${prefix + command}`)
			}
			break
			case 'ssweb': {
				if (!isPremium) return m.reply(mess.prem)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} https://github.com/nimesha206/nimabw`)
				try {
					let anu = 'https://' + text.replace(/^https?:\/\//, '')
					let hasil = await fetchApi('/tools/ss', { url: anu }, { buffer: true });
					await m.reply({ image: hasil, caption: 'නිවැරදියි' });
					setLimit(m, db)
				} catch (e) {
					m.reply('SS Web Server offline!')
				}
			}
			break
			case 'readmore': {
				let teks1 = text.split`|`[0] ? text.split`|`[0] : ''
				let teks2 = text.split`|`[1] ? text.split`|`[1] : ''
				m.reply(teks1 + readmore + teks2)
			}
			break
			case 'getexif': {
				if (!m.quoted) return m.reply(`Sticker Reply කරන්න\nCaption සමග ${prefix + command}`)
				if (!/sticker|webp/.test(quoted.type)) return m.reply(`Sticker Reply කරන්න\nCaption සමග ${prefix + command}`)
				const img = new webp.Image()
				await img.load(await m.quoted.download())
				if (!img.exif) return m.reply('මෙම Sticker හි metadata/EXIF නොමැත.');
				try {
					const exifData = JSON.parse(img.exif.slice(22).toString());
					m.reply(util.format(exifData))
				} catch (e) {
					m.reply(`Sticker හි EXIF ඇත, නමුත් format JSON නොවේ:\n\n${img.exif.toString()}`);
				}
			}
			break
			case 'cuaca': case 'weather': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} jakarta`)
				try {
					let { result: data } = await fetchApi('/tools/cuaca', { city: text });
					m.reply(`*🏙 නගර කාලගුණය ${data.name}*\n\n*🌤️ කාලගුණය:* ${data.weather[0].main}\n*📝 විස්තරය:* ${data.weather[0].description}\n*🌡️ සාමාන්‍ය උෂ්ණත්වය:* ${data.main.temp} °C\n*🤔 දැනෙන ලෙස:* ${data.main.feels_like} °C\n*🌬️ පීඩනය:* ${data.main.pressure} hPa\n*💧 ආර්ද්‍රතාවය:* ${data.main.humidity}%\n*🌪️ සුළං වේගය:* ${data.wind.speed} Km/h\n*📍 ස්ථානය:*\n- *Bujur :* ${data.coord.lat}\n- *Lintang :* ${data.coord.lon}\n*🌏 රට:* ${data.sys.country}`)
				} catch (e) {
					m.reply('නගරය හොයාගත නොහැකිය!')
				}
			}
			break
			case 'sticker': case 'stiker': case 's': case 'stickergif': case 'stikergif': case 'sgif': case 'stickerwm': case 'swm': case 'curi': case 'colong': case 'take': case 'stickergifwm': case 'sgifwm': {
				if (!/image|video|sticker/.test(quoted.type)) return m.reply(`Caption සමග Image/Video/GIF Reply/Send කරන්න ${prefix + command}\nකාලසීමාව Image/Video/Gif 1-9 Detik`)
				let media = await quoted.download()
				let teks1 = text.split`|`[0] ? text.split`|`[0] : packname
				let teks2 = text.split`|`[1] ? text.split`|`[1] : author
				if (/image|webp/.test(mime)) {
					m.reply(mess.wait)
					await nimesha.sendAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
				} else if (/video/.test(mime)) {
					if ((qmsg).seconds > 11) return m.reply('උපරිම 10 seconds!')
					m.reply(mess.wait)
					await nimesha.sendAsSticker(m.chat, media, m, { packname: teks1, author: teks2 })
				} else m.reply(`Caption සමග Image/Video/GIF Reply/Send කරන්න ${prefix + command}\nකාලසීමාව Video/Gif 1-9 Detik`)
			}
			break
			case 'smeme': case 'stickmeme': case 'stikmeme': case 'stickermeme': case 'stikermeme': {
				try {
					//if (!isPremium) return m.reply(mess.prem)
					if (!isLimit) return m.reply(mess.limit)
					if (!/image|webp/.test(mime)) return m.reply(`Image/Sticker Reply/Send කරන්න\nCaption සමග ${prefix + command} ඉහළ|පහළ`)
					if (!text) return m.reply(`Image/Sticker Reply/Send කරන්න dengan caption ${prefix + command} ඉහළ|පහළ`)
					m.reply(mess.wait)
					let atas = text.split`|`[0] ? text.split`|`[0] : '-'
					let bawah = text.split`|`[1] ? text.split`|`[1] : '-'
					let media = await quoted.download()
					let mem = await UguuSe(media);
					let smeme = await fetchApi('/create/meme2', { url: mem.url, text: atas, text2: bawah }, { buffer: true });
					await nimesha.sendAsSticker(m.chat, smeme, m, { packname, author })
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('Meme Server offline!')
				}
			}
			break
			case 'emojimix': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} 😅+🤔`)
				let [emoji1, emoji2] = text.split`+`
				if (!emoji1 && !emoji2) return m.reply(`උදාහරණ: ${prefix + command} 😅+🤔`)
				try {
					let { result } = await fetchApi('/tools/emojimix', { emoji1, emoji2 });
					if (result.length < 1) return m.reply(`Emoji Mix ${text} හොයාගත නොහැකිය!`)
					for (let res of result) {
						await nimesha.sendAsSticker(m.chat, res.url, m, { packname, author })
					}
					setLimit(m, db)
				} catch (e) {
					m.reply('Emoji Mix අසාර්ථකයි!')
				}
			}
			break
			case 'hack': case 'hacker': case 'hackwifi': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} +94xxxxxxxx\nඋදාහරණ: ${prefix + command} @mention`)
				const target = text.replace(/[^0-9+]/g, '') || text
				const displayTarget = text
				const steps = [
					`⚠️ *[ HACK SYSTEM INITIATED ]*`,
					`🔍 *Target Detected:* \`${displayTarget}\``,
					`📡 *Scanning IP Address...*\n\`192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}\``,
					`🌐 *Locating Device...*\n\`${['Samsung Galaxy', 'iPhone 15', 'Xiaomi Redmi', 'Huawei P40'][Math.floor(Math.random()*4)]}\``,
					`🔓 *Bypassing WhatsApp Encryption...*\n\`SHA-256 ▓▓▓▓▓▓░░░░ 60%\``,
					`💀 *Breaking Security Layers...*\n\`Layer 1 ✅ | Layer 2 ✅ | Layer 3 🔄\``,
					`📲 *Accessing Device Camera...*\n\`[GRANTED]\``,
					`📂 *Extracting Files...*\n\`Contacts ✅ | Messages ✅ | Gallery ✅\``,
					`🔐 *WhatsApp Session Hijacked!*\n\`Token: 7f4a2b9c1e6d3f8a\``,
					`✅ *HACK COMPLETE!*\n\`${displayTarget}\`ගේ WhatsApp සම්පූර්ණයෙන් HACKED! 💀`
				]
				try {
					let msg = await m.reply(steps[0])
					await sleep(1500)
					for (let i = 1; i < steps.length; i++) {
						await nimesha.sendMessage(m.chat, { text: steps[i], edit: msg.key })
						await sleep(1500)
					}
					setLimit(m, db)
				} catch(e) {
					m.reply(steps.join('\n\n'))
				}
			}
			break
			case 'attp': case 'attp2': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} ඔබේ text`)
				m.reply(mess.wait)
				try {
					const style = command === 'attp2' ? Math.floor(Math.random() * 10) + 10 : Math.floor(Math.random() * 10) + 1
					const hasil = await fetchApi('/create/attp', { text, style }, { buffer: true })
					await nimesha.sendAsSticker(m.chat, hasil, m, { packname, author })
					setLimit(m, db)
				} catch(e) {
					try {
						const hasil2 = await fetchApi('/tools/attp', { text }, { buffer: true })
						await nimesha.sendAsSticker(m.chat, hasil2, m, { packname, author })
						setLimit(m, db)
					} catch(e2) {
						m.reply('ATTP Server offline!')
					}
				}
			}
			break
			case 'qc':
			case 'quote':
			case 'fakechat': {
			  if (!isLimit) return m.reply(mess.limit)
			  if (!text && !m.quoted) return m.reply(`Reply/Send කරන්න *${prefix + command}*`)
			
			  try {
			    let mediaBuffer
			    let quotedMediaBuffer
			    let ppUrl = await nimesha.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg')
				let bufferPp = await getBuffer(ppUrl);
			    if (m.isMedia) {
			      mediaBuffer = await m.download()
			    }
			    if (m.quoted && m.quoted.isMedia) {
			      quotedMediaBuffer = await m.quoted.download()
			    }
			    const senderName = m.pushName || store.contacts?.[m.sender]?.name || '+' + m.sender.split('@')[0]
			    const quotedName = store.contacts?.[m.quoted?.sender]?.name || '+' + (m.quoted?.sender || '').split('@')[0]
			    const params = {
			      type: 'quote',
			      backgroundColor: '#1b2226',
			      width: 512,
			      scale: 2,
				  text,
			      messages: [
			        {
			          avatar: true,
			          from: {
			            id: 1,
			            name: senderName,
			            number: '+' + m.sender.split('@')[0],
			            time: new Date().toLocaleTimeString('id-ID', {
			              hour: '2-digit',
			              minute: '2-digit'
			            }),
			            photo: { buffer: bufferPp.toString('base64') }
			          },
			          text: m.text || m.body || '',
			          ...(mediaBuffer ? { media: { buffer: mediaBuffer.toString('base64') } } : {}),
			          ...(m.quoted ? {
			                replyMessage: {
			                  chatId: Math.floor(Math.random() * 9999999),
			                  name: quotedName,
			                  text: m?.quoted?.text || '',
			                  number: '+' + m.quoted.sender.split('@')[0],
			                  ...(quotedMediaBuffer ? { media: { buffer: quotedMediaBuffer.toString('base64') } } : {})
			                }
			              }  : {})
			        }
			      ]
			    };
				let res = await fetchApi('/create/qc', params, { method: 'POST', buffer: true });
				await nimesha.sendAsSticker(m.chat, Buffer.from(res, 'base64'), m, { packname, author })
			    setLimit(m, db)
			  } catch (e) {
			    console.error(e)
			    m.reply('Fake chat සෑදීම අසාර්ථකයි.')
			  }
			}
			break
			case 'brat': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Text එක`)
				try {
					let res = await fetchApi('/create/brat', { text }, { buffer: true });
					await nimesha.sendAsSticker(m.chat, res, m)
					setLimit(m, db)
				} catch (e) {
					m.reply('Brat Server offline!')
				}
			}
			break
			case 'bratvid': case 'bratvideo': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Text එක`)
				const teks = (m.quoted ? m.quoted.text : text).split(' ');
				const tempDir = path.join(process.cwd(), 'database/temp');
				try {
					const framePaths = [];
					for (let i = 0; i < teks.length; i++) {
						const currentText = teks.slice(0, i + 1).join(' ');
						let res = await fetchApi('/create/brat2', { text: currentText }, { buffer: true });
						const framePath = path.join(tempDir, `${time + '-' + m.sender + i}.mp4`);
						fs.writeFileSync(framePath, res);
						framePaths.push(framePath);
					}
					const fileListPath = path.join(tempDir, `${time + '-' + m.sender}.txt`);
					let fileListContent = '';
					for (let i = 0; i < framePaths.length; i++) {
						fileListContent += `file '${framePaths[i]}'\n`;
						fileListContent += `duration 0.5\n`;
					}
					fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
					fileListContent += `duration 3\n`;
					fs.writeFileSync(fileListPath, fileListContent);
					const outputVideoPath = path.join(tempDir, `${time + '-' + m.sender}-output.mp4`);
					execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf 'fps=30' -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${outputVideoPath}`);
					nimesha.sendAsSticker(m.chat, outputVideoPath, m, { packname, author })
					framePaths.forEach((filePath) => fs.unlinkSync(filePath));
					fs.unlinkSync(fileListPath);
					fs.unlinkSync(outputVideoPath);
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('ඉල්ලීම process කිරීමේ දෝෂයක්!')
				}
			}
			break
			case 'wasted': {
				if (!isLimit) return m.reply(mess.limit)
				try {
					if (/jpg|jpeg|png/.test(mime)) {
						m.reply(mess.wait)
						let media = await quoted.download()
						const form = new FormData();
					    form.append('buffer', media, {
					        filename: 'image.jpg',
					        contentType: 'image/jpeg'
					    });
						let hasil = await fetchApi('/create/wasted', form, { buffer: true });
						await nimesha.sendMedia(m.chat, hasil, '', 'ගනින්', m);
						setLimit(m, db)
					} else m.reply('Upload කිරීමට Media යවන්න!')
				} catch (e) {
					m.reply('Canvas Server offline!')
				}
			}
			break
			case 'trigger': case 'triggered': {
				if (!isLimit) return m.reply(mess.limit)
				try {
					if (/jpg|jpeg|png/.test(mime)) {
						m.reply(mess.wait)
						let media = await quoted.download()
						let anu = await UguuSe(media)
						let hasil = await fetchApi('/create/triggered', form, { buffer: true });
						await nimesha.sendMedia(m.chat, hasil, '', 'ගනින්', m);
						setLimit(m, db)
					} else m.reply('Upload කිරීමට Media යවන්න!')
				} catch (e) {
					m.reply('Canvas Server offline!')
				}
			}
			break
			case 'nulis': {
				m.reply(`*උදාහරණ*\n${prefix}nuliskiri\n${prefix}nuliskanan\n${prefix}foliokiri\n${prefix}foliokanan`)
			}
			break
			case 'nuliskanan': case 'nuliskiri': case 'foliokanan': case 'foliokiri': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`Command Send කරන්න *${prefix + command}* Text එක`)
				m.reply(mess.wait)
				const splitText = text.replace(/(\S+\s*){1,9}/g, '$&\n')
				const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
				let hasil = await fetchApi('/create/nulis/' + command, { text: fixHeight }, { buffer: true });
				await m.reply({ image: hasil, caption: 'කම්මැලි නොවන්න. දක්ෂ සිසුවෙකු වන්න ರ_ರ' });
				setLimit(m, db)
			}
			break
			case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai': {
				try {
					let set;
					if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20'
					if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
					if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
					if (/earrape/.test(command)) set = '-af volume=12'
					if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
					if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
					if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
					if (/reverse/.test(command)) set = '-filter_complex "areverse"'
					if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
					if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
					if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
					if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
					if (/audio/.test(mime)) {
						m.reply(mess.wait)
						let media = await nimesha.downloadAndSaveMediaMessage(qmsg)
						let ran = `./database/temp/${getRandom('.mp3')}`;
						exec(`ffmpeg -i ${media} ${set} ${ran}`, (err, stderr, stdout) => {
							fs.unlinkSync(media)
							if (err) return m.reply(err)
							let buff = fs.readFileSync(ran)
							m.reply({ audio: buff, mimetype: 'audio/mpeg' })
							fs.unlinkSync(ran)
						});
					} else m.reply(`Caption සමග Audio Reply/Send කරන්න *${prefix + command}*`)
				} catch (e) {
					m.reply('අසාර්ථකයි!')
				}
			}
			break
			case 'tinyurl': case 'shorturl': case 'shortlink': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text || !isUrl(text)) return m.reply(`උදාහරණ: ${prefix + command} https://github.com/nimesha206/nimabw`)
				try {
					let hasil = await fetchApi('/other/tinyurl', { url: text });
					m.reply('URL: ' + hasil.result)
					setLimit(m, db)
				} catch (e) {
					m.reply('අසාර්ථකයි!')
				}
			}
			break
			case 'git': case 'gitclone': {
				if (!isLimit) return m.reply(mess.limit)
				if (!args[0]) return m.reply(`උදාහරණ: ${prefix + command} https://github.com/nimesha206/nimabw`)
				if (!isUrl(args[0]) && !args[0].includes('github.com')) return m.reply('භාවිතා කරන්න Url Github!')
				let [, user, repo] = args[0].match(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i) || []
				try {
					m.reply({ document: { url: `https://api.github.com/repos/${user}/${repo}/zipball` }, fileName: repo + '.zip', mimetype: 'application/zip' }).catch((e) => m.reply(mess.error))
					setLimit(m, db)
				} catch (e) {
					m.reply('අසාර්ථකයි!')
				}
			}
			break
			
			// Ai Menu
			case 'ai': case 'google': case 'bard': case 'gemini': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} query`)
				try {
					let hasil = await fetchApi('/ai/gemini-flash-lite', { query: text });
					m.reply(hasil.result.text)
				} catch (e) {
					m.reply(pickRandom(['AI Feature ගැටලුවකට ලක් ව ඇත!','AI සම්බන්ධ කිරීමට නොහැකිය!','AI System දැනට කාර්යබහුලයි!','Feature දැනට භාවිතා කළ නොහැකිය!']))
				}
			}
			break
			
			// Search Menu
			case 'gimage': case 'bingimg': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} query`)
				try {
					let anu = await fetchApi('/search/google', { query: text });
					let una = pickRandom(anu.result)
					await m.reply({ image: { url: una.pagemap?.cse_thumbnail?.[0]?.src || una.pagemap?.cse_image?.[0].src || una.pagemap?.metatags?.[0]?.["og:image"] }, caption: 'සෙවීමේ ප්‍රතිඵල ' + text + '\nTitle: ' + una.title + '\nSnippet: ' + una.snippet + '\nSource: ' + una.link || una.formattedUrl })
					setLimit(m, db)
				} catch (e) {
					m.reply('Pencarian හොයාගත නොහැකිය!')
				}
			}
			break
			case 'play': case 'ytplay': case 'yts': case 'ytsearch': case 'youtubesearch': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} dj komang`)
				m.reply(mess.wait)
				try {
					const res = await yts.search(text);
					const hasil = pickRandom(res.all)
					const teksnya = `*📍Title:* ${hasil.title || 'නැහැ tersedia'}\n*✏Description:* ${hasil.description || 'නැහැ tersedia'}\n*🌟Channel:* ${hasil.author?.name || 'නැහැ tersedia'}\n*⏳Duration:* ${hasil.seconds || 'නැහැ tersedia'} second (${hasil.timestamp || 'නැහැ tersedia'})\n*🔎Source:* ${hasil.url || 'නැහැ tersedia'}\n\n_සටහන: Download කිරීමට_\n_තෝරන්න ${prefix}ytmp3 url_video හෝ ${prefix}ytmp4 url_video_`;
					await m.reply({ image: { url: hasil.thumbnail }, caption: teksnya })
				} catch (e) {
					try {
						const res = await fetchApi('/search/youtube', { query: text });
						const hasil = pickRandom(res.result.items)
						const teksnya = `*📍Title:* ${hasil.snippet.title || 'නැහැ tersedia'}\n*✏Description:* ${hasil.snippet.description || 'නැහැ tersedia'}\n*🌟Channel:* ${hasil.snippet.channelTitle || 'නැහැ tersedia'}\n*⏳Duration:* ${hasil.duration || 'නැහැ tersedia'}\n*🔎Source:* https://youtu.be/${hasil.id.videoId || 'නැහැ tersedia'}\n\n_සටහන: Download කිරීමට_\n_තෝරන්න ${prefix}ytmp3 url_video හෝ ${prefix}ytmp4 url_video_`;
						await m.reply({ image: { url: hasil.snippet.thumbnails.medium.url }, caption: teksnya })
					} catch (e) {
						m.reply('Post ලබා ගත නොහැකිය!')
					}
				}
			}
			break
			case 'pixiv': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} hu tao`)
				try {
					m.reply(mess.wait)
					const res = await fetchApi('/search/pixiv', { query: text });
					let hasil = pickRandom(res.result.body.illusts);
					const response = await fetch(hasil.url, { headers: { 'referer': 'https://www.pixiv.net' }});
					const image = await response.buffer();
					m.reply({ image, caption: `Title: ${hasil.title}\nDescription: ${hasil.alt}\nTags:\n${hasil.tags.map(a => '- ' + a).join('\n')}` });
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('Post ලබා ගත නොහැකිය!')
				}
			}
			break
			case 'pinterest': case 'pint': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} hu tao`)
				try {
					const res = await fetchApi('/search/pinterest', { query: text });
					const hasil = pickRandom(res.result)
					const image = await getBuffer(hasil);
					await m.reply({ image, caption: 'Hasil සිට: ' + text })
					setLimit(m, db)
				} catch (e) {
					m.reply('Pencarian හොයාගත නොහැකිය!');
				}
			}
			break
			case 'wallpaper': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} hu tao`)
				try {
					let anu = await fetchApi('/search/pinterest', { query: text });
					if (anu.length < 1) {
						m.reply('Post ලබා ගත නොහැකිය!');
					} else {
						let result = pickRandom(anu.result)
						await m.reply({ image: { url: result.urls.original }, caption: `*Media Url :* ${result.pin}${result.description ? '\n*Description :* ' + result.description : ''}` })
						setLimit(m, db)
					}
				} catch (e) {
					m.reply('Wallpaper Server offline!')
				}
			}
			break
			case 'ringtone': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} black rover`)
				try {
					let anu = await fetchApi('/search/meloboom', { query: text });
					let result = pickRandom(anu.result.data)
					await m.reply({ audio: { url: anu.result.populated.media[result.media.audio[0]].url }, fileName: result.slug + '.mp3', mimetype: 'audio/mpeg' })
					setLimit(m, db)
				} catch (e) {
					m.reply('Audio හොයාගත නොහැකිය!')
				}
			}
			break
			case 'npm': case 'npmjs': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} axios`)
				try {
					let anu = await fetchApi('/search/npm', { query: text });
					if (anu.result.objects.length > 1) return m.reply('සෙවීමේ ප්‍රතිඵල හොයාගත නොහැකිය')
					let txt = anu.result.objects.map(({ package: pkg }) => {
						return `*${pkg.name}* (v${pkg.version})\n_${pkg.links.npm}_\n_${pkg.description}_`
					}).join`\n\n`
					m.reply(txt)
				} catch (e) {
					m.reply('සෙවීමේ ප්‍රතිඵල හොයාගත නොහැකිය')
				}
			}
			break
			case 'style': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} Nima`)
				let anu = await fetchApi('/search/styletext', { text });
				let txt = anu.result.map(a => `*${a.name}*\n${a.result}`).join`\n\n`
				m.reply(txt)
			}
			break
			case 'spotify': case 'spotifysearch': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} alan walker alone`)
				try {
					let hasil = await fetchApi('/search/spotify', { query: text });
					let txt = hasil.result.map(a => {
						return `*Title : ${a.title}*\n- Artist : ${a.artist}\n- Url : ${a.url}`
					}).join`\n\n`
					m.reply(txt)
				} catch (e) {
					m.reply('Search Server offline!')
				}
			}
			break
			case 'tenor': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} alone`)
				try {
					const anu = await fetchApi('/search/tenor', { query: text });
					const hasil = pickRandom(anu.result)
					await m.reply({ video: { url: hasil.media[0].mp4.url }, caption: `👀 *Media:* ${hasil.url}\n📋 *Description:* ${hasil.content_description}\n🔛 *Url:* ${hasil.itemurl}`, gifPlayback: true, gifAttribution: 2 })
				} catch (e) {
					m.reply('Hasil හොයාගත නොහැකිය!')
				}
			}
			break
			case 'urban': {
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} alone`)
				try {
					const anu = await fetchJson('https://api.urbandictionary.com/v0/define?term=' + text)
					const hasil = pickRandom(anu.list)
					await m.reply(`${hasil.definition}\n\nSumber: ${hasil.permalink}`)
				} catch (e) {
					m.reply('Hasil හොයාගත නොහැකිය!')
				}
			}
			break
			
			// Stalker Menu
			case 'wastalk': case 'whatsappstalk': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} @tag / 94xxx`)
				try {
					let num = m.quoted?.sender || m.mentionedJid?.[0] || text
					if (!num) return m.reply(`උදාහරණ : ${prefix + command} @tag / 94xxx`)
					num = num.replace(/\D/g, '') + '@s.whatsapp.net'
					if (!(await nimesha.onWhatsApp(num))[0]?.exists) return m.reply('WhatsApp හි අංකය ලියාপදිංචි නෑ!')
					let img = await nimesha.profilePictureUrl(num, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60')
					let bio = await nimesha.fetchStatus(num).catch(_ => { })
					let name = await nimesha.getName(num)
					let business = await nimesha.getBusinessProfile(num)
					let format = PhoneNum(`+${num.split('@')[0]}`)
					let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
					let country = regionNames.of(format.getRegionCode('international'));
					let wea = `WhatsApp තොරතුරු\n\n*° රට:* ${country.toUpperCase()}\n*° නම:* ${name ? name : '-'}\n*° Format අංකය:* ${format.getNumber('international')}\n*° URL:* wa.me/${num.split('@')[0]}\n*° Mentions:* @${num.split('@')[0]}\n*° Status:* ${bio?.status || '-'}\n*° Status දිනය:* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('id').format('LL') : '-'}\n\n${business ? `*WhatsApp Business තොරතුරු*\n\n*° Business ID:* ${business.wid}\n*° Website:* ${business.website ? business.website : '-'}\n*° Email:* ${business.email ? business.email : '-'}\n*° Category:* ${business.category}\n*° Address:* ${business.address ? business.address : '-'}\n*° Timezone:* ${business.business_hours.timezone ? business.business_hours.timezone : '-'}\n*° විස්තරය:* ${business.description ? business.description : '-'}` : '*සාමාන්‍ය WhatsApp ගිණුම*'}`
					img ? await nimesha.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m }) : m.reply(wea)
				} catch (e) {
					m.reply('Nomer නැහැ ditemukan!')
				}
			}
			break
			case 'ghstalk': case 'githubstalk': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} usernamenya`)
				try {
					const res = await fetchJson('https://api.github.com/users/' + text)
					m.reply({ image: { url: res.avatar_url }, caption: `*Username :* ${res.login}\n*Nickname :* ${res.name || 'නැත'}\n*Bio :* ${res.bio || 'නැත'}\n*ID:* ${res.id}\n*Node ID :* ${res.node_id}\n*වර්ගය:* ${res.type}\n*Admin:* ${res.admin ? 'ඔව්' : 'නැහැ'}\n*Company :* ${res.company || 'නැත'}\n*Blog :* ${res.blog || 'නැත'}\n*Location :* ${res.location || 'නැත'}\n*Email :* ${res.email || 'නැත'}\n*Public Repo :* ${res.public_repos}\n*Public Gists :* ${res.public_gists}\n*Followers :* ${res.followers}\n*Following :* ${res.following}\n*Created At :* ${res.created_at} *Updated At :* ${res.updated_at}` })
				} catch (e) {
					m.reply('Username නැහැ ditemukan!')
				}
			}
			break
			
			// Downloader Menu
			case 'ytmp3': case 'ytaudio': case 'ytplayaudio': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_youtube`)
				if (!text.includes('youtu')) return m.reply('URL YouTube ප්‍රතිඵලය ඇතුළත් නෑ!')
				m.reply(mess.wait)
				try {
					const hasil = await ytMp3(text);
					await m.reply({
						audio: hasil.result,
						mimetype: 'audio/mpeg',
						contextInfo: {
							externalAdReply: {
								title: hasil.title,
								body: hasil.channel,
								previewType: 'PHOTO',
								thumbnailUrl: hasil.thumb,
								mediaType: 1,
								renderLargerThumbnail: true,
								sourceUrl: text
							}
						}
					})
					setLimit(m, db)
				} catch (e) {
					try {
						const { result: hasil } = await fetchApi('/download/youtube', { url: text });
						await m.reply({
							audio: { url: hasil.download },
							mimetype: 'audio/mpeg',
							contextInfo: {
								externalAdReply: {
									title: hasil.title,
									body: hasil.quality,
									previewType: 'PHOTO',
									thumbnailUrl: hasil.thumbnail,
									mediaType: 1,
									renderLargerThumbnail: true,
									sourceUrl: text
								}
							}
						})
						setLimit(m, db)
					} catch (e) {
						m.reply('Audio Download අසාර්ථකයි!');
					}
				}
			}
			break
			case 'ytmp4': case 'ytvideo': case 'ytplayvideo': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_youtube`)
				if (!text.includes('youtu')) return m.reply('URL YouTube ප්‍රතිඵලය ඇතුළත් නෑ!')
				m.reply(mess.wait)
				try {
					const hasil = await ytMp4(text);
					await m.reply({ video: hasil.result, caption: `*📍Title:* ${hasil.title}\n*✏Description:* ${hasil.desc ? hasil.desc : ''}\n*🚀Channel:* ${hasil.channel}\n*🗓Upload at:* ${hasil.uploadDate}` })
					setLimit(m, db)
				} catch (e) {
					try {
						const { result: hasil } = await fetchApi('/download/youtube', { url: text, format: '360' });
						await m.reply({ video: { url: hasil.download }, caption: `*📍Title:* ${hasil.title}\n*✏Quality:* ${hasil.quality ? hasil.quality : ''}\n*⏳Duration:* ${hasil.duration}` })
						setLimit(m, db)
					} catch (e) {
						m.reply('Video Download අසාර්ථකයි!');
					}
				}
			}
			break
			case 'ig': case 'instagram': case 'instadl': case 'igdown': case 'igdl': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_instagram`)
				if (!text.includes('instagram.com')) return m.reply('URL Instagram ප්‍රතිඵලය ඇතුළත් නෑ!')
				m.reply(mess.wait)
				try {
					let hasil = await fetchApi('/download/instagram', { url: text })
					if(hasil.result.urls.length > 1) {
						await nimesha.sendAlbumMessage(m.chat, {
							album: hasil.result.urls.map(a => (a.is_video ? { video: { url: a.url }} : { image: { url: a.url }})),
							caption: hasil.result.caption
						}, { quoted: m });
					} else if(hasil.result.urls.length == 1) {
						m.reply({ image: { url: hasil.result.urls[0].url }, caption: hasil.result.caption });
					} else m.reply('Post ලබා ගත නොහැකිය හෝ Private!')
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('Post ලබා ගත නොහැකිය හෝ Private!')
				}
			}
			break
			case 'tiktok': case 'tiktokdown': case 'ttdown': case 'ttdl': case 'tt': case 'ttmp4': case 'ttvideo': case 'tiktokmp4': case 'tiktokvideo': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_tiktok`)
				if (!text.includes('tiktok.com')) return m.reply('URL TikTok ප්‍රතිඵලය ඇතුළත් නෑ!')
				try {
					const hasil = await fetchApi('/download/tiktok', { url: text })
					m.reply(mess.wait)
					if (hasil.result.download.type == "video") {
						await m.reply({ video: { url: hasil.result.download?.video?.nowm_hd || hasil.result.download?.video?.nowm }, caption: `*📍Title:* ${hasil.result.desc || '-'}\n*🕓Create At:* ${hasil.result.create_time}\n*🎃Author:* ${hasil.result.author.nickname} (@${hasil.result.author.unique_id})` });
					} else if (hasil.result.download.type == "images") {
						await nimesha.sendAlbumMessage(m.chat, {
							album: hasil.result.download.images.map(a => ({ image: { url: a.url }})),
							caption: `*📍Title:* ${hasil.result.desc || '-'}\n*🕓Create At:* ${hasil.result.create_time}\n*🎃Author:* ${hasil.result.author.nickname} (@${hasil.result.author.unique_id})`
						}, { quoted: m });
					} else {
						return m.reply('Url නැහැ Valid!')
					}
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('අසාර්ථකයි/URL වලංගු නොවේ!')
				}
			}
			break
			case 'ttmp3': case 'tiktokmp3': case 'ttaudio': case 'tiktokaudio': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_tiktok`)
				if (!text.includes('tiktok.com')) return m.reply('URL TikTok ප්‍රතිඵලය ඇතුළත් නෑ!')
				try {
					const hasil = await fetchApi('/download/tiktok', { url: text });
					m.reply(mess.wait)
					await m.reply({
						audio: { url: hasil.result.download.music },
						mimetype: 'audio/mpeg',
						contextInfo: {
							externalAdReply: {
								title: 'TikTok • ' + hasil.result.author.nickname,
								body: hasil.result.statistics.like + ' suka, ' + hasil.result.statistics.command + ' komentar. ' + hasil.result.desc,
								previewType: 'PHOTO',
								thumbnailUrl: hasil.result.download?.music_info?.cover_hd || hasil.result.download.music_info.cover_medium,
								mediaType: 1,
								renderLargerThumbnail: true,
								sourceUrl: text
							}
						}
					})
					setLimit(m, db)
				} catch (e) {
					m.reply('අසාර්ථකයි/URL වලංගු නොවේ!')
				}
			}
			break
			case 'fb': case 'fbdl': case 'fbdown': case 'facebook': case 'facebookdl': case 'facebookdown': case 'fbdownload': case 'fbmp4': case 'fbvideo': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} url_facebook`)
				if (!text.includes('facebook.com')) return m.reply('URL Facebook ප්‍රතිඵලය ඇතුළත් නෑ!')
				try {
					const hasil = await fetchApi('/download/facebook', { url: text });
					if (!hasil.result.hd && !hasil.result.sd) {
						m.reply('Video හොයාගත නොහැකිය!')
					} else {
						m.reply(mess.wait)
						await nimesha.sendFileUrl(m.chat, hasil.result.hd || hasil.result.sd, `*🎐Title:* ${hasil.result.title}`, m);
					}
					setLimit(m, db)
				} catch (e) {
					m.reply('Facebook Downloader Server offline!')
				}
			}
			break
			case 'mediafire': case 'mf': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} https://www.mediafire.com/file/xxxxxxxxx/xxxxx.zip/file`)
				if (!isUrl(args[0]) && !args[0].includes('mediafire.com')) return m.reply('URL වලංගු නොවේ!')
				try {
					let { result: res } = await fetchApi('/download/mediafire', { url: text })
					await nimesha.sendMedia(m.chat, res.link, res.filename, `*MEDIAFIRE DOWNLOADER*\n\n*${setv} Name* : ${res.filename}\n*${setv} Size* : ${res.size}`, m)
					setLimit(m, db)
				} catch (e) {
					m.reply('Download Server offline!')
				}
			}
			break
			case 'spotifydl': {
				if (!isLimit) return m.reply(mess.limit)
				if (!text) return m.reply(`උදාහරණ: ${prefix + command} https://open.spotify.com/track/0JiVRyTJcJnmlwCZ854K4p`)
				if (!isUrl(args[0]) && !args[0].includes('open.spotify.com/track')) return m.reply('URL වලංගු නොවේ!')
				try {
					const { result: hasil } = await fetchApi('/download/spotify', { url: text })
					const buffer = await fetchApi('/download/spotify/audio', { url: text }, { buffer: true })
					m.reply(mess.wait)
					await m.reply({
						audio: buffer,
						mimetype: 'audio/mpeg',
						contextInfo: {
							externalAdReply: {
								title: hasil.artist + ' • ' + hasil.title,
								body: hasil.duration,
								previewType: 'PHOTO',
								thumbnailUrl: hasil.cover,
								mediaType: 1,
								renderLargerThumbnail: true,
								sourceUrl: text
							}
						}
					})
					setLimit(m, db)
				} catch (e) {
					console.log(e)
					m.reply('Download Server offline!')
				}
			}
			break
			
			// Quotes Menu
			case 'motivasi': {
				const hasil = await fetchApi('/random/motivasi');
				m.reply(hasil.result)
			}
			break
			case 'bijak': {
				const hasil = await fetchApi('/random/bijak');
				m.reply(hasil.result)
			}
			break
			case 'dare': {
				const hasil = await fetchApi('/random/dare');
				m.reply(hasil.result)
			}
			break
			case 'quotes': {
				const { result: hasil } = await fetchApi('/random/quotes');
				m.reply(`_${hasil.quotes}_\n\n*- ${hasil.author}*`)
			}
			break
			case 'truth': {
				const hasil = await fetchApi('/random/truth');
				m.reply(`_${pickRandom(hasil.result)}_`)
			}
			break
			case 'renungan': {
				const hasil = await fetchApi('/random/renungan');
				m.reply('', {
					contextInfo: {
						forwardingScore: 10,
						isForwarded: true,
						externalAdReply: {
							title: (m.pushName || 'Anonim'),
							thumbnailUrl: hasil.result,
							mediaType: 1,
							previewType: 'PHOTO',
							renderLargerThumbnail: true,
						}
					}
				});
			}
			break
			case 'bucin': {
				const hasil = await fetchApi('/random/bucin');
				m.reply(hasil.result)
			}
			break
			
			// Random Menu
			case 'coffe': case 'kopi': {
				try {
					await nimesha.sendFileUrl(m.chat, 'https://coffee.alexflipnote.dev/random', '☕ Random Coffe', m)
				} catch (e) {
					try {
						const anu = await fetchJson('https://api.sampleapis.com/coffee/hot')
						await nimesha.sendFileUrl(m.chat, pickRandom(anu).image, '☕ Random Coffe', m)
					} catch (e) {
						m.reply('Server offline!')
					}
				}
			}
			break
			
			// Anime Menu
			case 'waifu': case 'neko': {
				try {
					if (!isNsfw && text === 'nsfw') return m.reply('NSFW Filter සක්‍රීයයි!')
					const res = await fetchJson('https://api.waifu.pics/' + (text === 'nsfw' ? 'nsfw' : 'sfw') + '/' + command)
					await nimesha.sendFileUrl(m.chat, res.url, 'Random Waifu', m)
					setLimit(m, db)
				} catch (e) {
					m.reply('Server offline!')
				}
			}
			break
			
			// Fun Menu
			case 'dadu': {
				let ddsa = [{ url: 'https://telegra.ph/file/9f60e4cdbeb79fc6aff7a.png', no: 1 },{ url: 'https://telegra.ph/file/797f86e444755282374ef.png', no: 2 },{ url: 'https://telegra.ph/file/970d2a7656ada7c579b69.png', no: 3 },{ url: 'https://telegra.ph/file/0470d295e00ebe789fb4d.png', no: 4 },{ url: 'https://telegra.ph/file/a9d7332e7ba1d1d26a2be.png', no: 5 },{ url: 'https://telegra.ph/file/99dcd999991a79f9ba0c0.png', no: 6 }]
				let media = pickRandom(ddsa)
				try {
					await nimesha.sendAsSticker(m.chat, media.url, m, { packname, author, isAvatar: 1 })
				} catch (e) {
					let anu = await fetch(media.url)
					let una = await anu.buffer()
					await nimesha.sendAsSticker(m.chat, una, m, { packname, author, isAvatar: 1 })
				}
			}
			break
			case 'halah': case 'hilih': case 'huluh': case 'heleh': case 'holoh': {
				if (!m.quoted && !text) return m.reply(`Caption සමග Text Reply/Send කරන්න ${prefix + command}`)
				ter = command[1].toLowerCase()
				tex = m.quoted ? m.quoted.text ? m.quoted.text : q ? q : m.text : q ? q : m.text
				m.reply(tex.replace(/[aiueo]/g, ter).replace(/[AIUEO]/g, ter.toUpperCase()))
			}
			break
			case 'bisakah': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} saya menang?`)
				let bisa = ['Bisa','Coba Saja','Pasti Bisa','Mungkin Saja','නැහැ Bisa','නැහැ Mungkin','Coba Ulangi','Ngimpi kah?','yakin bisa?']
				let keh = bisa[Math.floor(Math.random() * bisa.length)]
				m.reply(`*Bisakah ${text}*\nපිළිතුර: ${keh}`)
			}
			break
			case 'apakah': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} saya bisa menang?`)
				let apa = ['Iya','නැහැ','Bisa Jadi','Coba Ulangi','Mungkin Saja','Mungkin නැහැ','Mungkin Iya','Ntahlah']
				let kah = apa[Math.floor(Math.random() * apa.length)]
				m.reply(`*${command} ${text}*\nපිළිතුර: ${kah}`)
			}
			break
			case 'kapan': case 'kapankah': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} saya menang?`)
				let kapan = ['Besok','Lusa','Nanti','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi','Bulan Depan','Ntahlah','නැහැ Akan Pernah']
				let koh = kapan[Math.floor(Math.random() * kapan.length)]
				m.reply(`*${command} ${text}*\nපිළිතුර: ${koh}`)
			}
			break
			case 'siapa': case 'siapakah': {
				if (!m.isGroup) return m.reply(mess.group)
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} jawa?`)
				let member = (store.groupMetadata[m.chat] ? store.groupMetadata[m.chat].participants : m.metadata.participants).map(a => a.id)
				let siapakh = pickRandom(member)
				m.reply(`@${siapakh.split('@')[0]}`);
			}
			break
			case 'tanyakerang': case 'kerangajaib': case 'kerang': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} boleh pinjam 100?`)
				let krng = ['Mungkin suatu hari', 'නැහැ juga', 'නැහැ keduanya', 'Kurasa tidak', 'ඔව්', 'නැහැ', 'Coba tanya lagi', 'නැත']
				let jwb = pickRandom(krng)
				m.reply(`*ප්‍රශ්නය: ${text}*\n*පිළිතුර: ${jwb}*`)
			}
			break
			case 'cekmati': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} name`)
				let teksnya = text.replace(/@|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').replace(/\d/g, '');
				let data = await axios.get(`https://api.agify.io/?name=${teksnya ? teksnya : 'bot'}`).then(res => res.data).catch(e => ({ age: Math.floor(Math.random() * 90) + 20 }));
				m.reply(`නම: ${text}\n*මරණය වයසෙදී:* ${data.age == null ? (Math.floor(Math.random() * 90) + 20) : data.age} Tahun.\n\n_කෙළිනු, ජීවිතය කෙළිනු_\n_මරණය කිසිවෙකු නොදනී_`)
			}
			break
			case 'ceksifat': {
				let sifat_a = ['Bijak','Sabar','Kreatif','Humoris','Mudah bergaul','Mandiri','Setia','Jujur','Dermawan','Idealis','Adil','Sopan','Tekun','Rajin','Pemaaf','Murah hati','Ceria','Percaya diri','Penyayang','Disiplin','Optimis','Berani','Bersyukur','Bertanggung jawab','Bisa diandalkan','Tenang','Kalem','Logis']
				let sifat_b = ['Sombong','Minder','Pendendam','Sensitif','Perfeksionis','Caper','Pelit','Egois','Pesimis','Penyendiri','Manipulatif','Labil','Penakut','Vulgar','නැහැ setia','Pemalas','Kasar','Rumit','Boros','Keras kepala','නැහැ bijak','Pembelot','Serakah','Tamak','Penggosip','Rasis','Ceroboh','Intoleran']
				let teks = `╭──❍「 *Cek ගතිගුණ* 」❍\n│• ගතිගුණ ${text && m.mentionedJid ? text : '@' + m.sender.split('@')[0]}${(text && m.mentionedJid ? '' : (`\n│• නම: *${text ? text : m.pushName}*` || '\n│• නම: *Tanpa Nama*'))}\n│• ඔවුන්: *${pickRandom(sifat_a)}*\n│• දෝෂ: *${pickRandom(sifat_b)}*\n│• ධෛර්යය: *${Math.floor(Math.random() * 100)}%*\n│• සැලකිල්ල: *${Math.floor(Math.random() * 100)}%*\n│• කාංසාව: *${Math.floor(Math.random() * 100)}%*\n│• බිය: *${Math.floor(Math.random() * 100)}%*\n│• හොඳ ගතිගුණ: *${Math.floor(Math.random() * 100)}%*\n│• නරක ගතිගුණ: *${Math.floor(Math.random() * 100)}%*\n╰──────❍`
				m.reply(teks)
			}
			break
			case 'cekkhodam': {
				if (!text) return m.reply(`උදාහරණ : ${prefix + command} name`)
				try {
					const { result: hasil } = await fetchApi('/primbon/cekkhodam');
					m.reply(`Khodam සිට *${text}* ලෙස *${hasil.nama}*\n_${hasil.deskripsi}_`)
				} catch (e) {
					m.reply(pickRandom(['Dokter Indosiar','Sigit Rendang','Ustadz Sinetron','Bocil epep']))
				}
			}
			break
			case 'rate': case 'nilai': {
				m.reply(`Bot Rate: *${Math.floor(Math.random() * 100)}%*`)
			}
			break
			case 'jodohku': {
				if (!m.isGroup) return m.reply(mess.group)
				let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.id)
				let jodoh = pickRandom(member)
				m.reply(`👫 ඔබේ සොයුරිය/සොයුරා\n@${m.sender.split('@')[0]} ❤ @${jodoh ? jodoh.split('@')[0] : '0'}`);
			}
			break
			case 'jadian': {
				if (!m.isGroup) return m.reply(mess.group)
				let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.id)
				let jadian1 = pickRandom(member)
				let jadian2 = pickRandom(member)
				m.reply(`ආදරවන්ත ක්‍රීඩාව💖 ආධාර කිරීමට අමතක නොකරන්න🗿\n@${jadian1.split('@')[0]} ❤ @${jadian2.split('@')[0]}`);
			}
			break
			case 'fitnah': {
				let [teks1, teks2, teks3] = text.split`|`
				if (!teks1 || !teks2 || !teks3) return m.reply(`උදාහරණ : ${prefix + command} pesan target|pesan mu|nomer/tag target`)
				let ftelo = { key: { fromMe: false, participant: teks3.replace(/[^0-9]/g, '') + '@s.whatsapp.net', ...(m.isGroup ? { remoteJid: m.chat } : { remoteJid: teks3.replace(/[^0-9]/g, '') + '@s.whatsapp.net'})}, message: { conversation: teks1 }}
				nimesha.sendMessage(m.chat, { text: teks2 }, { quoted: ftelo });
			}
			break
			case 'coba': {
				let anu = ['Aku Monyet','Aku Kera','Aku Tolol','Aku Kaya','Aku Dewa','Aku Anjing','Aku Dongo','Aku Raja','Aku Sultan','Aku Baik','Aku Hitam','Aku Suki']
				await nimesha.sendButtonMsg(m.chat, {
					text: 'සුభ ව🙂',
					buttons: [{
						buttonId: 'teshoki',
						buttonText: { displayText: '\n' + pickRandom(anu)},
						type: 1
					},{
						buttonId: 'cobacoba',
						buttonText: { displayText: '\n' + pickRandom(anu)},
						type: 1
					}]
				})
			}
			break
			
			// Game Menu
			case 'slot': {
				await gameSlot(nimesha, m, db)
			}
			break
			case 'casino': {
				await gameCasinoSolo(nimesha, m, prefix, db)
			}
			break
			case 'samgong': case 'kartu': {
				await gameSamgongSolo(nimesha, m, db)
			}
			break
			case 'rampok': case 'merampok': {
				await gameMerampok(m, db)
			}
			break
			case 'begal': {
				await gameBegal(nimesha, m, db)
			}
			break
			case 'suitpvp': case 'suit': {
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))) return m.reply(`ඔබේ පෙර Suit Session නිම කරන්න`)
				if (m.mentionedJid[0] === m.sender) return m.reply(`ඔබ සමග ඔබම ක්‍රීඩා කළ නොහැකිය!`)
				if (!m.mentionedJid[0]) return m.reply(`_ඔබ challenge කිරීමට කාද?_\nඔවුන් Tag කරන්න..\n\nContoh : ${prefix}suit @${ownerNumber[0]}`, m.chat, { mentions: [ownerNumber[0] + '@s.whatsapp.net'] })
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return m.reply(`ඔබ challenge කළ කෙනා දැනට Suit ක්‍රීඩා කරනවා :(`)
				let caption = `_*SUIT PvP*_\n\n@${m.sender.split('@')[0]} challenge @${m.mentionedJid[0].split('@')[0]} Suit ක්‍රීඩා කිරීමට\n\nකරුණාකර @${m.mentionedJid[0].split('@')[0]} terima/tolak ටයිප් කිරීමට`
				let id = 'suit_' + Date.now();
				suit[id] = {
					chat: caption,
					id: id,
					p: m.sender,
					p2: m.mentionedJid[0],
					status: 'wait',
					poin: 10,
					poin_lose: 10,
					timeout: 3 * 60 * 1000
				}
				m.reply(caption)
				await sleep(3 * 60 * 1000)
				if (suit[id]) {
					m.reply(`_Suit කාලය ඉකිවිය_`)
					delete suit[id]
				}
			}
			break
			case 'delsuit': case 'deletesuit': {
				let roomnya = Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))
				if (!roomnya) return m.reply(`ඔබ Suit Room හි නෑ!`)
				delete suit[roomnya.id]
				m.reply(`Suit Room Session සාර්ථකව ඉවත් කෙරිණ!`)
			}
			break
			case 'ttc': case 'ttt': case 'tictactoe': {
				if (Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply(`Kamu masih didalam game!\nKetik *${prefix}del${command}* Jika Ingin Mengakhiri sesi`);
				let room = Object.values(tictactoe).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
				if (room) {
					m.reply('Partner හොයාගත්!')
					room.o = m.chat
					room.game.playerO = m.sender
					room.state = 'PLAYING'
					if (!(room.game instanceof TicTacToe)) {
						room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game)
					}
					let arr = room.game.render().map(v => {
						return {X: '❌',O: '⭕',1: '1️⃣',2: '2️⃣',3: '3️⃣',4: '4️⃣',5: '5️⃣',6: '6️⃣',7: '7️⃣',8: '8️⃣',9: '9️⃣'}[v]
					})
					let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\nබලා සිටිනු @${room.game.currentTurn.split('@')[0]}\n\n*nyerah* ටයිප් කර ගිවිසීම ප්‍රකාශ කරන්න`
					if (room.x !== room.o) await nimesha.sendMessage(room.x, { texr: str, mentions: parseMention(str) }, { quoted: m })
					await nimesha.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
				} else {
					room = {
						id: 'tictactoe-' + (+new Date),
						x: m.chat,
						o: '',
						game: new TicTacToe(m.sender, 'o'),
						state: 'WAITING',
					}
					if (text) room.name = text
					nimesha.sendMessage(m.chat, { text: 'Partner බලා සිටිනු' + (text ? ` command ටයිප් කරන්න ${prefix}${command} ${text}` : ''), mentions: m.mentionedJid }, { quoted: m })
					tictactoe[room.id] = room
					await sleep(300000)
					if (tictactoe[room.id]) {
						m.reply(`_Session කාලය ඉකිවිය_`)
						delete tictactoe[room.id]
					}
				}
			}
			break
			case 'delttc': case 'delttt': {
				let roomnya = Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))
				if (!roomnya) return m.reply(`ඔබ TicTacToe Room හි නෑ!`)
				delete tictactoe[roomnya.id]
				m.reply(`TicTacToe Room Session සාර්ථකව ඉවත් කෙරිණ!`)
			}
			break
			case 'akinator': {
				if (text == 'start') {
					if (akinator[m.sender]) return m.reply('නිම නොකළ Session දැනට ඇත!')
					akinator[m.sender] = new Akinator({ region: 'id', childMode: false });
					try {
						await akinator[m.sender].start()
					} catch (e) {
						delete akinator[m.sender];
						return m.reply('Akinator Server ගැටලුවකට ලක් ව ඇත\nනැවත උත්සාහ කරන්න!')
					}
					let { key } = await m.reply(`🎮 Akinator Game :\n\n@${m.sender.split('@')[0]}\n${akinator[m.sender].question}\n\n- 0 - ඔව්\n- 1 - නැහැ\n- 2 - නැහැ Tau\n- 3 - Mungkin\n- 4 - Mungkin නැහැ\n\n${prefix + command} end (Untuk Keluar සිට sesi)`)
					akinator[m.sender].key = key.id
					await sleep(3600000)
					if (akinator[m.sender]) {
						m.reply(`_Session කාලය ඉකිවිය_`)
						delete akinator[m.sender];
					}
				} else if (text == 'end') {
					if (!akinator[m.sender]) return m.reply('ඔබ Akinator ක්‍රීඩා කරන්නේ නෑ!')
					delete akinator[m.sender];
					m.reply('සාර්ථකයි Mengakhiri sessi Akinator')
				} else m.reply(`උදාහරණ : ${prefix + command} start/end`)
			}
			break
			case 'tebakbom': {
				if (tebakbom[m.sender]) return m.reply('නිම නොකළ Session දැනට ඇත!')
				tebakbom[m.sender] = {
					petak: [0, 0, 0, 2, 0, 2, 0, 2, 0, 0].sort(() => Math.random() - 0.5),
					board: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
					bomb: 3,
					lolos: 7,
					pick: 0,
					nyawa: ['❤️', '❤️', '❤️'],
				}
				await m.reply(`*Bomb ක්‍රීඩාව*\n\n${tebakbom[m.sender].board.join("")}\n\nසංඛ්‍යාව තෝරන්න! Bomb ලගා නොකරන්න!\nBomb: ${tebakbom[m.sender].bomb}\nNyawa : ${tebakbom[m.sender].nyawa.join("")}`);
				await sleep(120000)
				if (tebakbom[m.sender]) {
					m.reply(`_Session කාලය ඉකිවිය_`)
					delete tebakbom[m.sender];
				}
			}
			break
			case 'tekateki': {
				if (iGame(tekateki, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tekateki');
				let { key } = await m.reply(`🎮 ඊළඟ Riddle:\n\n${hasil.soal}\n\nකාලය: 60s\nතෑගිය *+3499*`)
				tekateki[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tekateki, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tekateki[m.chat + key.id].jawaban)
					delete tekateki[m.chat + key.id]
				}
			}
			break
			case 'tebaklirik': {
				if (iGame(tebaklirik, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebaklirik');
				let { key } = await m.reply(`🎮 ඊළඟ Lyric හොයාගන්න:\n\n${hasil.soal}\n\nකාලය: 90s\nතෑගිය *+4299*`)
				tebaklirik[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(90000)
				if (rdGame(tebaklirik, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebaklirik[m.chat + key.id].jawaban)
					delete tebaklirik[m.chat + key.id]
				}
			}
			break
			case 'tebakkata': {
				if (iGame(tebakkata, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebakkata');
				let { key } = await m.reply(`🎮 ඊළඟ Word හොයාගන්න:\n\n${hasil.soal}\n\nකාලය: 60s\nතෑගිය *+3499*`)
				tebakkata[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebakkata, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebakkata[m.chat + key.id].jawaban)
					delete tebakkata[m.chat + key.id]
				}
			}
			break
			case 'family100': {
				if (family100.hasOwnProperty(m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/family100');
				let { key } = await m.reply(`🎮 ඊළඟ Word හොයාගන්න:\n\n${hasil.soal}\n\nකාලය: 5m\nතෑගිය *+3499*`)
				family100[m.chat] = {
					soal: hasil.soal,
					jawaban: hasil.jawaban,
					terjawab: Array.from(hasil.jawaban, () => false),
					id: key.id
				}
				await sleep(300000)
				if (family100.hasOwnProperty(m.chat)) {
					m.reply('Waktu Habis\nපිළිතුරු:\n- ' + family100[m.chat].jawaban.join('\n- '))
					delete family100[m.chat]
				}
			}
			break
			case 'susunkata': {
				if (iGame(susunkata, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/susunkata');
				let { key } = await m.reply(`🎮 ඊළඟ Word සකසන්න:\n\n${hasil.soal}\nType: ${hasil.tipe}\n\nකාලය: 60s\nතෑගිය *+2989*`)
				susunkata[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(susunkata, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + susunkata[m.chat + key.id].jawaban)
					delete susunkata[m.chat + key.id]
				}
			}
			break
			case 'tebakkimia': {
				if (iGame(tebakkimia, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebakkimia');
				let { key } = await m.reply(`🎮 ඊළඟ Chemistry හොයාගන්න:\n\n${hasil.unsur}\n\nකාලය: 60s\nතෑගිය *+3499*`)
				tebakkimia[m.chat + key.id] = {
					jawaban: hasil.lambang.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebakkimia, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebakkimia[m.chat + key.id].jawaban)
					delete tebakkimia[m.chat + key.id]
				}
			}
			break
			case 'caklontong': {
				if (iGame(caklontong, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/caklontong');
				let { key } = await m.reply(`🎮 ඊළඟ ප්‍රශ්නයට පිළිතුරු දෙන්න:\n\n${hasil.soal}\n\nකාලය: 60s\nතෑගිය *+9999*`)
				caklontong[m.chat + key.id] = {
					...hasil,
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(caklontong, m.chat, key.id)) {
					m.reply(`Waktu Habis\nපිළිතුරු: ${caklontong[m.chat + key.id].jawaban}\n"${caklontong[m.chat + key.id].deskripsi}"`)
					delete caklontong[m.chat + key.id]
				}
			}
			break
			case 'tebaknegara': {
				if (iGame(tebaknegara, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebaknegara');
				let { key } = await m.reply(`🎮 ස්ථානයෙන් රට හොයාගන්න:\n\n*ස්ථානය: ${hasil.tempat}*\n\nකාලය: 60s\nතෑගිය *+3499*`)
				tebaknegara[m.chat + key.id] = {
					jawaban: hasil.negara.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebaknegara, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebaknegara[m.chat + key.id].jawaban)
					delete tebaknegara[m.chat + key.id]
				}
			}
			break
			case 'tebakgambar': {
				if (iGame(tebakgambar, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebakgambar');
				let { key } = await nimesha.sendFileUrl(m.chat, hasil.img, `🎮 ඊළඟ Image හොයාගන්න:\n\n${hasil.deskripsi}\n\nකාලය: 60s\nතෑගිය *+3499*`, m)
				tebakgambar[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebakgambar, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebakgambar[m.chat + key.id].jawaban)
					delete tebakgambar[m.chat + key.id]
				}
			}
			break
			case 'tebakbendera': {
				if (iGame(tebakbendera, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const { result: hasil } = await fetchApi('/games/tebakbendera');
				let { key } = await m.reply(`🎮 ඊළඟ Flag හොයාගන්න:\n\n*Flag: ${hasil.bendera}*\n\nකාලය: 60s\nතෑගිය *+3499*`)
				tebakbendera[m.chat + key.id] = {
					jawaban: hasil.negara.toLowerCase(),
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebakbendera, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebakbendera[m.chat + key.id].jawaban)
					delete tebakbendera[m.chat + key.id]
				}
			}
			break
			case 'tebakangka': case 'butawarna': case 'colorblind': {
				if (iGame(tebakangka, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				const soal = await fetchJson('https://raw.githubusercontent.com/nima/database/refs/heads/master/random/color_blind.json');
				const hasil = pickRandom(soal);
				let { key } = await m.reply({
					text: `Pilih පිළිතුරු ඔව්ng Benar!\nවිකල්ප: ${[hasil.number, ...hasil.similar].sort(() => Math.random() - 0.5).join(', ')}`,
					contextInfo: {
						externalAdReply: {
							renderLargerThumbnail: true,
							thumbnailUrl: hasil.color_blind[0],
							body: `Level: ${hasil.lv}`,
							previewType: 0,
							mediaType: 1,
						}
					}
				});
				tebakangka[m.chat + key.id] = {
					jawaban: hasil.number,
					id: key.id
				}
				await sleep(60000)
				if (rdGame(tebakangka, m.chat, key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + tebakangka[m.chat + key.id].jawaban)
					delete tebakangka[m.chat + key.id]
				}
			}
			break
			case 'kuismath': case 'math': {
				const { genMath, modes } = require('./lib/math');
				const inputMode = ['noob', 'easy', 'medium', 'hard','extreme','impossible','impossible2'];
				if (iGame(kuismath, m.chat)) return m.reply('නිම නොකළ Session දැනට ඇත!')
				if (!text) return m.reply(`Mode: ${Object.keys(modes).join(' | ')}\nභාවිතා කිරීමේ උදාහරණ: ${prefix}math medium`)
				if (!inputMode.includes(text.toLowerCase())) return m.reply('Mode හොයාගත නොහැකිය!')
				let result = await genMath(text.toLowerCase())
				let { key } = await m.reply(`*ප්‍රතිඵලය කොතරම්: ${result.soal.toLowerCase()}*?\n\nකාලය: ${(result.waktu / 1000).toFixed(2)} seconds`)
				kuismath[m.chat + key.id] = {
					jawaban: result.jawaban,
					mode: text.toLowerCase(),
					id: key.id
				}
				await sleep(kuismath, result.waktu)
				if (rdGame(m.chat + key.id)) {
					m.reply('Waktu Habis\nපිළිතුරු: ' + kuismath[m.chat + key.id].jawaban)
					delete kuismath[m.chat + key.id]
				}
			}
			break
			case 'ulartangga': case 'snakeladder': case 'ut': {
				if (!m.isGroup) return m.reply(mess.group)
				if (ulartangga[m.chat] && !(ulartangga[m.chat] instanceof SnakeLadder)) {
					ulartangga[m.chat] = Object.assign(new SnakeLadder(ulartangga[m.chat]), ulartangga[m.chat]);
				}
				switch(args[0]) {
					case 'create': case 'join':
					if (ulartangga[m.chat]) {
						if (Object.keys(ulartangga[m.chat].players).length > 8) return m.reply(`Jumlah Pemain Sudah Maksimal\nSilahkan ආරම්භ කරමින්... Permainan\n${prefix + command} start`);
						if (ulartangga[m.chat].players.some(a => a.id == m.sender)) return m.reply('ඔබ දැනටමත් සම්බන්ධ වී ඇත!')
						ulartangga[m.chat].players.push({ id: m.sender, move: 0 });
						m.reply('සාර්ථකයි Join Sesi Game')
					} else {
						ulartangga[m.chat] = new SnakeLadder({ id: m.chat, host: m.sender });
						ulartangga[m.chat].players.push({ id: m.sender, move: 0 });
						ulartangga[m.chat].time = Date.now();
						m.reply('සාර්ථකයි Membuat Sesi Game')
					}
					break
					case 'start':
					if (!ulartangga[m.chat]) return m.reply('දැනට ක්‍රීඩා Session නැත!')
					if (ulartangga[m.chat].players.length < 2) return m.reply('ක්‍රීඩකයන් ප්‍රමාණය අඩු!\nඅවම 2 දෙනෙකු!')
					if (ulartangga[m.chat].start) return m.reply('Session දැනටමත් ආරම්භ කෙරිණ!')
					if (ulartangga[m.chat].host !== m.sender) return m.reply(`Room සෑදූ @${ulartangga[m.chat].host.split('@')[0]} yang bisa ආරම්භ කරමින්... Sessi!`)
					let { key } = await m.reply({ image: { url: ulartangga[m.chat].map.url }, caption: `🐍🪜SNAKE LADDER ක්‍රීඩාව\n\n${ulartangga[m.chat].players.map((p, i) => `- @${p.id.split('@')[0]} (Pion ${['Merah', 'Biru Muda', 'Kuning', 'Hijau', 'Ungu', 'Jingga', 'Biru Tua', 'Putih'][i]})`).join('\n')}\n\nවාරය: @${m.sender.split('@')[0]}\n\nක්‍රීඩා කිරීම සඳහා Reply කරන්න!\nඋදාහරණ: Roll/Kocok ටයිප් කරන්න`, mentions: ulartangga[m.chat].players.map(p => p.id)});
					ulartangga[m.chat].id = key.id
					ulartangga[m.chat].start = true
					break
					case 'leave':
					if (!ulartangga[m.chat]) return m.reply('දැනට ක්‍රීඩා Session නැත!')
					if (!ulartangga[m.chat].players.some(a => a.id == m.sender)) return m.reply('ඔබ ක්‍රීඩකයෙකු නොවේ!')
					const player = ulartangga[m.chat].players.findIndex(a => a.id == m.sender)
					if (ulartangga[m.chat].start) return m.reply('Game Sudah dimulai!\nනැහැ Bisa Keluar Sekarang')
					if (ulartangga[m.chat].players.length < 1 || ulartangga[m.chat].host === m.sender) {
						m.reply(ulartangga[m.chat].host === m.sender ? 'Host Meninggalkan Permainan\nPermainan dihentikan!' : 'ක්‍රීඩකයන් 1ට වඩා අඩු, ක්‍රීඩාව නතර කෙරිණ!');
						delete ulartangga[m.chat];
						break;
					}
					ulartangga[m.chat].players.splice(player, 1);
					m.reply('සාර්ථකයි Meninggalkan Permainan');
					break
					case 'end':
					if (!ulartangga[m.chat]) return m.reply('දැනට ක්‍රීඩා Session නැත!')
					if (ulartangga[m.chat]?.host !== m.sender) return m.reply(`Room සෑදූ @${ulartangga[m.chat].host.split('@')[0]} Session ඉවත් කළ හැකිය!`)
					delete ulartangga[m.chat]
					m.reply('ක්‍රීඩා Session සාර්ථකව ඉවත් කෙරිණ')
					break
					default:
					m.reply(`🐍🪜SNAKE LADDER ක්‍රීඩාව\nCommand: ${prefix + command} <command>\n- create\n- join\n- start\n- leave\n- end`)
				}
			}
			break
			case 'chess': case 'catur': case 'ct': {
				const { DEFAUT_POSITION } = require('chess.js');
				if (!m.isGroup) return m.reply(mess.group)
				if (chess[m.chat] && !(chess[m.chat] instanceof Chess)) {
					chess[m.chat] = Object.assign(new Chess(chess[m.chat].fen), chess[m.chat]);
				}
				switch(args[0]) {
					case 'start':
					if (!chess[m.chat]) return m.reply('දැනට ක්‍රීඩා Session නැත!')
					if (!chess[m.chat].acc) return m.reply('ක්‍රීඩකයන් සම්පූර්ණ නැත!')
					if (chess[m.chat].player1 !== m.sender) return m.reply('Hanya Pemain Utama ඔව්ng bisa ආරම්භ කරමින්...!')
					if (chess[m.chat].turn !== m.sender && !chess[m.chat].start) {
						const encodedFen = encodeURI(chess[m.chat]._fen);
						let boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`,`https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`,`https://chessboardimage.com/${encodedFen}.png`,`https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}`,`https://fen2image.chessvision.ai/${encodedFen}`];
						for (let url of boardUrls) {
							try {
								const { data } = await axios.get(url, { responseType: 'arraybuffer' });
								let { key } = await m.reply({ image: data, caption: `♟️${command.toUpperCase()} GAME\n\nවාරය: @${m.sender.split('@')[0]}\n\nක්‍රීඩා කිරීම සඳහා Reply කරන්න!\nඋදාහරණ: from to -> b1 c3`, mentions: [m.sender] });
								chess[m.chat].start = true
								chess[m.chat].turn = m.sender
								chess[m.chat].id = key.id;
								return;
							} catch (e) {}
						}
						if (!chess[m.chat].key) {
							m.reply(`Gagal ආරම්භ කරමින්... Permainan!\nGagal Mengirim Papan Permainan!`)
						}
					} else if ([chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) {
						const isPlayer2 = chess[m.chat].player2 === m.sender
						const nextPlayer = isPlayer2 ? chess[m.chat].player1 : chess[m.chat].player2;
						const encodedFen = encodeURI(chess[m.chat]._fen);
						const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`,`https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`,`https://chessboardimage.com/${encodedFen}${!isPlayer2 ? '-flip' : ''}.png`,`https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765${!isPlayer2 ? '&orientation=black' : ''}`,`https://fen2image.chessvision.ai/${encodedFen}/${!isPlayer2 ? '?pov=black' : ''}`];
						for (let url of boardUrls) {
							try {
								chess[m.chat].turn = chess[m.chat].turn === m.sender ? m.sender : nextPlayer;
								const { data } = await axios.get(url, { responseType: 'arraybuffer' });
								let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nවාරය: @${chess[m.chat].turn.split('@')[0]}\n\nක්‍රීඩා කිරීම සඳහා Reply කරන්න!\nඋදාහරණ: from to -> b1 c3`, mentions: [chess[m.chat].turn] });
								chess[m.chat].id = key.id;
								break;
							} catch (e) {}
						}
					}
					break
					case 'join':
					if (chess[m.chat]) {
						if (chess[m.chat].player1 !== m.sender) {
							if (chess[m.chat].acc) return m.reply(`Pemain Sudah Terisi\nSilahkan Coba Lagi Nanti`)
							let teks = chess[m.chat].player2 === m.sender ? 'සම්බන්ධ වීමට ස්තූතියි' : `නිසා @${chess[m.chat].player2.split('@')[0]} නැහැ Merespon\nAkan digantikan Oleh @${m.sender.split('@')[0]}`
							chess[m.chat].player2 = m.sender
							chess[m.chat].acc = true
							m.reply(`${teks}\nකරුණාකර @${chess[m.chat].player1.split('@')[0]} Untuk ආරම්භ කරමින්... Game (${prefix + command} start)`)
						} else m.reply(`Kamu Sudah Bergabung\nBiarkan Orang Lain Menjadi Lawanmu!`)
					} else m.reply('දැනට ක්‍රීඩා Session නැත!')
					break
					case 'end': case 'leave':
					if (chess[m.chat]) {
						if (![chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) return m.reply('ක්‍රීඩකයන්ට පමණ ක්‍රීඩාව නැවැත්විය හැකිය!')
						delete chess[m.chat]
						m.reply('සාර්ථකයි Menghapus Sesi Game')
					} else m.reply('දැනට ක්‍රීඩා Session නැත!')
					break
					case 'bot': case 'computer':
					if (chess[m.sender]) {
						delete chess[m.sender];
						return m.reply('සාර්ථකයි Menghapus Sesi vs BOT')
					} else {
						chess[m.sender] = new Chess(DEFAUT_POSITION);
						chess[m.sender]._fen = chess[m.sender].fen();
						chess[m.sender].turn = m.sender;
						chess[m.sender].botMode = true;
						chess[m.sender].time = Date.now();
						const encodedFen = encodeURI(chess[m.sender]._fen);
						const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`,`https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`,`https://chessboardimage.com/${encodedFen}.png`,`https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765`,`https://fen2image.chessvision.ai/${encodedFen}/`];
						for (let url of boardUrls) {
							try {
								const { data } = await axios.get(url, { responseType: 'arraybuffer' });
								let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nවාරය: @${chess[m.sender].turn.split('@')[0]}\n\nක්‍රීඩා කිරීම සඳහා Reply කරන්න!\nඋදාහරණ: from to -> b1 c3`, mentions: [chess[m.sender].turn] });
								chess[m.sender].id = key.id;
								break;
							} catch (e) {}
						}
					}
					break
					default:
					if (/^@?\d+$/.test(args[0])) {
						if (chess[m.chat]) return m.reply('නිම නොකළ Session දැනට ඇත!')
						if (m.mentionedJid.length < 1) return m.reply('ක්‍රීඩා කිරීමට ඔවුන් Tag කරන්න!')
						chess[m.chat] = new Chess(DEFAUT_POSITION);
						chess[m.chat]._fen = chess[m.chat].fen();
						chess[m.chat].player1 = m.sender
						chess[m.chat].player2 = m.mentionedJid ? m.mentionedJid[0] : null
						chess[m.chat].time = Date.now();
						chess[m.chat].turn = null
						chess[m.chat].acc = false
						m.reply(`♟️${command.toUpperCase()} GAME\n\n@${m.sender.split('@')[0]} Challenge කරයි @${m.mentionedJid[0].split('@')[0]}\nසම්බන්ධ වීමට ${prefix + command} join`)
					} else {
						m.reply(`♟️${command.toUpperCase()} GAME\n\nඋදාහරණ: ${prefix + command} @tag/number\n- start\n- leave\n- join\n- computer\n- end`)
					}
				}
				
			}
			break
			case 'blackjack': case 'bj': {
				let session = null;
				for (let id in blackjack) {
					if (blackjack[id].players.find(p => p.id === m.sender)) {
						session = blackjack[id];
						break;
					}
				}
				if (session && !(session instanceof Blackjack)) {
					session = Object.assign(new Blackjack(session), session)
				}
				if (blackjack[m.chat] && !(blackjack[m.chat] instanceof Blackjack)) {
					blackjack[m.chat] = Object.assign(new Blackjack(blackjack[m.chat]), blackjack[m.chat])
				}
				switch(args[0]) {
					case 'create': case 'join':
					if (!m.isGroup) return m.reply(mess.group)
					if (blackjack[m.chat] || session) {
						if (blackjack[m.chat]?.players?.some(a => a.id === m.sender)) return m.reply('ඔබ දැනටමත් සම්බන්ධ වී ඇත!')
						if (session) return m.reply('ඔබ වෙනත් Group Session හි ඇත! නව Session හි සම්බන්ධ වීමට පෙර ඉවත් වන්න.');
						if (blackjack[m.chat].players.length > 10) return m.reply(`Jumlah Pemain Sudah Maksimal\nSilahkan ආරම්භ කරමින්... Permainan\n${prefix + command} start`);
						blackjack[m.chat].players.push({ id: m.sender, cards: [] });
						m.reply('සාර්ථකයි Join Game Blackjack')
					} else {
						blackjack[m.chat] = new Blackjack({ id: m.chat, host: m.sender });
						blackjack[m.chat].players.push({ id: m.sender, cards: [] });
						m.reply('සාර්ථකයි Create Game Blackjack')
					}
					break
					case 'start':
					if (!m.isGroup) return m.reply(mess.group)
					if (!blackjack[m.chat]) return m.reply('දැනට Blackjack ක්‍රීඩා Session නැත!')
					if (blackjack[m.chat]?.host !== m.sender) return m.reply(`Room සෑදූ @${blackjack[m.chat].host.split('@')[0]} yang bisa ආරම්භ කරමින්... Sessi!`)
					if (blackjack[m.chat].players.length < 2) return m.reply('Minimal 2 Pemain Untuk ආරම්භ කරමින්... Permainan!');
					if (blackjack[m.chat].started) return m.reply('ක්‍රීඩාව දැනටමත් ආරම්භ කෙරිණ!')
					blackjack[m.chat].distributeCards();
					m.reply(`🃏GAME BLACKJACK♦️\nආරම්භ Card: ${blackjack[m.chat].startCard.rank + blackjack[m.chat].startCard.suit}\nDeck Count: ${blackjack[m.chat].deck.length}\n${blackjack[m.chat].players.map(a => `- @${a.id.split('@')[0]} : (${a.cards.length} kartu)`).join('\n')}\n\nPrivate Chat පරීක්ෂා කරන්න\nwa.me/${botNumber.split('@')[0]}`);
					for (let p of blackjack[m.chat].players) {
						const startCard = blackjack[m.chat].startCard;
						let buttons = p.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` })}));
						if (!blackjack[m.chat].hasMatching(p.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
						await nimesha.sendListMsg(p.id, { text: `ආරම්භ Card: ${startCard.rank + startCard.suit}`, footer: `${p.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
					}
					break
					case 'hit': case 'minum': {
						if (!session) return m.reply('දැනට Blackjack ක්‍රීඩා Session නැත!')
						if (!session.started) return m.reply('ක්‍රීඩාව ආරම්භ කර නොමැත!')
						if (session.players.length < 2) return m.reply('Minimal 2 Pemain Untuk ආරම්භ කරමින්... Permainan!');
						if (!session.players?.some(a => a.id === m.sender)) return m.reply('ඔබ සම්බන්ධ නොවී ඇත!');
						if (!args[0]) return m.reply(`භාවිතා කරන්න format:\n${prefix + command} play <kartu>\nContoh: ${prefix + command} hit`);
						const player = session.players.find(p => p.id === m.sender);
						const hitIndex = player.cards.findIndex(c => (c.rank + c.suit) === (session.startCard.rank + session.startCard.suit));
						if (session.submitCard.some(s => s.id === m.sender) || session.skip.includes(m.sender)) {
							return m.reply('ඔබ මෙම Round හි ක්‍රීඩා කළා!');
						}
						if (!session.hasMatching(m.sender)) {
							if (session.deck.length) {
								const newCard = session.deck.shift();
								player.cards.push(newCard);
								await sleep(1000);
								let buttons = player.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` })}));
								if (!session.hasMatching(player.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
								await nimesha.sendListMsg(player.id, { text: `ආරම්භ Card: ${session.startCard.rank + session.startCard.suit}`, footer: `${player.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
							} else {
								let reuse = session.reuseSubmitCardsForDrinking()
								await m.reply(reuse.msg)
								if (!session.skip.find(a => a.id === player.id)) session.skip.push({ id: player.id });
								await m.reply('Deck ඉවර, ඔබට Card ගත නොහැකිය. Skip.');
								await nimesha.sendText(session.id, `@${m.sender.split('@')[0]} Deck ඉවර නිසා Skip.`, m);
								if ((session.submitCard.length + session.skip.length) === session.players.length) {
									const result = session.resolveRound();
									if (result) {
										await nimesha.sendText(session.id, result, m);
										if (session.players.length === 1) {
											await nimesha.sendText(session.id, `ඉතිරි ක්‍රීඩකයා 1 (@${session.players[0].id.split('@')[0]}), Blackjack Session නිම විය.`, m);
											delete blackjack[session.id];
											return;
										}
										const leaderCards = session.players.find(a => a.id === session.leader);
										let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` })}));
										await nimesha.sendListMsg(session.leader, { text: 'නව Round ආරම්භ කිරීමට Card තෝරන්න', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
									}
								}
							}
						} else m.reply(`ඔබ සතු suit Card ඇත ${session.startCard.suit}, Drink කිරීමට පෙර ක්‍රීඩා කරන්න!`);
						if ((session.submitCard.length + session.skip.length) === session.players.length) {
							const result = session.resolveRound();
							if (result) {
								await nimesha.sendText(session.id, result, m);
								if (session.players.length === 1) {
									await nimesha.sendText(session.id, `ඉතිරි ක්‍රීඩකයා 1 (@${session.players[0].id.split('@')[0]}), Blackjack Session නිම විය.`, m);
									delete blackjack[session.id];
									return;
								}
								const leaderCards = session.players.find(a => a.id === session.leader);
								let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` })}));
								await nimesha.sendListMsg(session.leader, { text: 'නව Round ආරම්භ කිරීමට Card තෝරන්න', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
							}
						}
					}
					break
					case 'play': {
						if (!session) return m.reply('දැනට Blackjack ක්‍රීඩා Session නැත!')
						if (!session.started) return m.reply('ක්‍රීඩාව ආරම්භ කර නොමැත!')
						if (session.players.length < 2) return m.reply('Minimal 2 Pemain Untuk ආරම්භ කරමින්... Permainan!');
						if (!session.players?.some(a => a.id === m.sender)) return m.reply('ඔබ සම්බන්ධ නොවී ඇත!');
						if (!args[1]) return m.reply(`භාවිතා කරන්න format:\n${prefix + command} play <kartu>\nContoh: ${prefix + command} play 3♥️`);
						const player = session.players.find(p => p.id === m.sender);
						const idx = player.cards.findIndex(c => normalize(c.rank + c.suit) === normalize(args[1]));
						if (idx === -1) return m.reply('Card වලංගු නොවේ!');
						if (session.submitCard.some(s => s.id === m.sender) || session.skip.includes(m.sender)) return m.reply('ඔබ මෙම Round හි ක්‍රීඩා කළා!');
						const card = player.cards[idx];
						if (Object.keys(session.startCard).length) {
							if (card.suit !== session.startCard.suit) return m.reply(`Card ගැලපෙන්නේ නෑ! Suit ${session.startCard.suit}`);
						} else if (m.sender !== session.leader) return m.reply('Round Leader ට පමණ ආරම්භ කළ හැකිය!');
						player.cards.splice(idx, 1);
						session.secondDeck.push(card);
						session.submitCard.push({ id: m.sender, card: card });
						await sleep(1000);
						if (player.cards.length === 0) {
							session.winner.push({ id: player.id });
							session.leader = '';
							session.submitCard = [];
							session.players = session.players.filter(p => p.id !== player.id);
							await nimesha.sendText(session.id, `@${m.sender.split('@')[0]} memenangkan permainan!\nSisa Kartu: 0`, m);
							if (session.players.length === 1) {
								await nimesha.sendText(session.id, `ඉතිරි ක්‍රීඩකයා 1 (@${session.players[0].id.split('@')[0]}), Blackjack Session නිම විය.`, m);
								delete blackjack[session.id];
								return;
							}
						}
						if (Object.keys(session.startCard).length === 0) {
							session.startCard = card;
							await nimesha.sendText(session.id, `@${m.sender.split('@')[0]} Round ආරම්භ කෙරිණ ${card.rank}${card.suit}`, m);
							for (let s of session.players) {
								if (s.id === session.leader) continue;
								const startCard = session.startCard;
								let buttons = s.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` })}));
								if (!session.hasMatching(s.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
								await nimesha.sendListMsg(s.id, { text: `ආරම්භ Card: ${startCard.rank + startCard.suit}`, footer: `${s.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
							}
							return;
						}
						if ((session.submitCard.length + session.skip.length) === session.players.length) {
							const result = session.resolveRound();
							if (result) {
								await nimesha.sendText(session.id, result, m);
								if (session.players.length === 1) {
									await nimesha.sendText(session.id, `ඉතිරි ක්‍රීඩකයා 1 (@${session.players[0].id.split('@')[0]}), Blackjack Session නිම විය.`, m);
									delete blackjack[session.id];
									return;
								}
								const leaderCards = session.players.find(a => a.id === session.leader);
								let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` })}));
								await nimesha.sendListMsg(session.leader, { text: 'නව Round ආරම්භ කිරීමට Card තෝරන්න', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
							}
						}
						await m.reply(`Kamu ක්‍රීඩා කළා ${card.rank}${card.suit}`);
						await nimesha.sendText(session.id, `@${m.sender.split('@')[0]} ක්‍රීඩා කළා ${card.rank}${card.suit}`, m);
					}
					break
					case 'info':
					if (!session) return m.reply('දැනට Blackjack ක්‍රීඩා Session නැත!')
					if (!session.players?.some(a => a.id === m.sender)) return m.reply('ඔබ සම්බන්ධ නොවී ඇත!');
					const players = session.players.map((p, i) => `${i + 1}. @${p.id.split('@')[0]} ${p.id === session.host ? '(HOST) ' : p.id === session.leader ? '(Leader)' : ''}`).join('\n');
					if (m.isGroup) {
						m.reply(`🃏INFO GAME BLACKJACK ♦️\n*ක්‍රීඩකයන් ගණන:* ${session.players.length}\n*Host:* @${session.host.split('@')[0]}\n*Status:* ${session.started ? 'ආරම්භ' : 'ආරම්භ නොවෙ'}${Object.keys(session.startCard).length > 1 ? `\n*ආරම්භ Card:* ${session.startCard.rank + session.startCard.suit}` : ''}\n*Deck Card ඉතිරිය:* ${session.deck.length}\n\n*ක්‍රීඩකයන් ලැයිස්තුව:*\n${players}${session.secondDeck.length ? `\n\n*Card ඉතිහාසය:* ${session.secondDeck.map(c => `${c.rank}${c.suit}`).join(', ')}` : ''}`)
					} else {
						const player = session.players.find(p => p.id === m.sender);
						const cards = player.cards?.map(c => `${c.rank}${c.suit}`).join(', ') || 'Belum ada kartu';
						m.reply(`🃏INFO GAME BLACKJACK ♦️\n*ක්‍රීඩකයන් ගණන:* ${session.players.length}\n*Host:* @${session.host.split('@')[0]}\n*Status:* ${session.started ? 'ආරම්භ' : 'ආරම්භ නොවෙ'}${Object.keys(session.startCard).length > 1 ? `\n*ආරම්භ Card:* ${session.startCard.rank + session.startCard.suit}` : ''}\n*Deck Card ඉතිරිය:* ${session.deck.length}\n\n*ක්‍රීඩකයන් ලැයිස්තුව:*\n${players}\n\n*ඔබේ Card:*\n${cards}${session.secondDeck.length ? `\n\n*Card ඉතිහාසය:* ${session.secondDeck.map(c => `${c.rank}${c.suit}`).join(', ')}` : ''}`)
					}
					break
					case 'end':
					if (!m.isGroup) return m.reply(mess.group)
					if (!blackjack[m.chat]) return m.reply('දැනට Blackjack ක්‍රීඩා Session නැත!')
					if (blackjack[m.chat]?.host !== m.sender) return m.reply(`Room සෑදූ @${blackjack[m.chat].host.split('@')[0]} Session ඉවත් කළ හැකිය!`)
					delete blackjack[m.chat]
					m.reply('ක්‍රීඩා Session සාර්ථකව ඉවත් කෙරිණ Blackjack')
					break
					default:
					m.reply(`🃏GAME BLACKJACK♦️\nCommand: ${prefix + command} <command>\n- create\n- join\n- start\n- info\n- hit\n- deck\n- end`)
				}
			}
			break
			
			// Menu
			case 'menu': {
				if (args[0] == 'set') {
					if (['1','2','3'].includes(args[1])) {
						set.template = parseInt(Number(args[1]))
						m.reply('සාර්ථකයි Mengubah Template Menu')
					} else m.reply(`Template තෝරන්න:\n- 1 (Button Menu)\n- 2 (List Menu)\n- 3 (Document Menu)`)
				} else await templateMenu(nimesha, set.template, m, prefix, setv, db, { botNumber, author, packname, isVip, isPremium, my })
			}
			break
			case 'allmenu': {
				let profile
				try {
					profile = await nimesha.profilePictureUrl(m.sender, 'image');
				} catch (e) {
					profile = fake.anonim
				}
				const menunya = `
╭──❍「 *පරිශීලක තොරතුරු* 」❍
├ *නම* : ${m.pushName ? m.pushName : 'Nimesha Madhushan'}
├ *අංකය* : @${m.sender.split('@')[0]}
├ *පරිශීලක* : ${isVip ? 'VIP' : isPremium ? 'PREMIUM' : 'FREE'}
├ *සීමාව* : ${isVip ? 'VIP' : db.users[m.sender].limit }
├ *මුදල්* : ${db.users[m.sender] ? db.users[m.sender].money.toLocaleString('id-ID') : '0'}
╰─┬────❍
╭─┴─❍「 *බොට් තොරතුරු* 」❍
├ *බොට්ගෙ නම* : ${set?.botname || 'Miss Shasikala'}
├ *බලගැන්වීම* : @${'0@s.whatsapp.net'.split('@')[0]}
├ *අයිතිකරු* : @${ownerNumber[0].split('@')[0]}
├ *ප්‍රකාරය* : ${nimesha.public ? 'පොදු' : 'පෞද්ගලික'}
├ *පූර්ව ප්‍රත්‍යය* :${set.multiprefix ? '「 MULTI-PREFIX 」' : ' *'+prefix+'*' }
├ *ප්‍රිමියම් විශේෂාන්ග* : 🔸️
╰─┬────❍
╭─┴─❍「 *විස්තර* 」❍
├ *දිනය* : ${tanggal}
├ *දවස* : ${hari}
├ *වෙලාව* : ${jam} WIB
╰──────❍
╭──❍「 *බොට් ( BOT )* 」❍
│${setv} ${prefix}profile (ගිණුම් විස්තර)
│${setv} ${prefix}claim (ත්‍යාග ලබා ගැනීම)
│${setv} ${prefix}buy (භාණ්ඩ මිලදී ගැනීම)
│${setv} ${prefix}transfer (මුදල් යැවීම)
│${setv} ${prefix}leaderboard (ප්‍රමුඛ පුවරුව)
│${setv} ${prefix}request (ඉල්ලීම් කිරීම)
│${setv} ${prefix}react (ප්‍රතිචාර දැක්වීම)
│${setv} ${prefix}tagme (මාව ටැග් කරන්න)
│${setv} ${prefix}runtime (ක්‍රියාත්මක වන කාලය)
│${setv} ${prefix}totalfitur (මුළු විශේෂාංග ගණන)
│${setv} ${prefix}speed (වේගය පරීක්ෂාව)
│${setv} ${prefix}ping (ප්‍රතිචාර කාලය)
│${setv} ${prefix}afk (බැහැරව සිටින බව දැන්වීම)
│${setv} ${prefix}rvo (වරක් පමණක් බැලිය හැකි පණිවිඩ බැලීම)
│${setv} ${prefix}inspect (සමූහයක විස්තර බැලීම)
│${setv} ${prefix}addmsg (පණිවිඩ එකතු කිරීම)
│${setv} ${prefix}delmsg (පණිවිඩ මැකීම)
│${setv} ${prefix}getmsg (පණිවිඩ ලබා ගැනීම)
│${setv} ${prefix}listmsg (පණිවිඩ ලැයිස්තුව)
│${setv} ${prefix}setcmd (විධාන සැකසීම)
│${setv} ${prefix}delcmd (විධාන මැකීම)
│${setv} ${prefix}listcmd (විධාන ලැයිස්තුව)
│${setv} ${prefix}lockcmd (විධාන අගුළු දැමීම)
│${setv} ${prefix}q (පණිවිඩයකට පිළිතුරු දීම)
│${setv} ${prefix}menfes (රහසිගත පණිවිඩ)
│${setv} ${prefix}confes (පාපොච්චාරණය)
│${setv} ${prefix}roomai (AI කාමරය)
│${setv} ${prefix}jadibot (තවත් බොට් කෙනෙකු වීම) 🔸️
│${setv} ${prefix}stopjadibot (නැවැත්වීම)
│${setv} ${prefix}listjadibot (ලැයිස්තුව බැලීම)
│${setv} ${prefix}donasi (ආධාර කිරීම)
│${setv} ${prefix}addsewa (කුලී කාලය එකතු කිරීම)
│${setv} ${prefix}delsewa (කුලී කාලය ඉවත් කිරීම)
│${setv} ${prefix}listsewa (කුලී ලැයිස්තුව)
╰─┬────❍
╭─┴❍「 *සමූහ (GROUP)* 」❍
│${setv} ${prefix}add (සාමාජිකයින් එක් කිරීම)
│${setv} ${prefix}kick (සාමාජිකයින් ඉවත් කිරීම)
│${setv} ${prefix}promote (පාලක තනතුරු දීම)
│${setv} ${prefix}demote (පාලක තනතුරු ඉවත් කිරීම)
│${setv} ${prefix}warn (අවවාද කිරීම)
│${setv} ${prefix}unwarn (අවවාද ඉවත් කිරීම)
│${setv} ${prefix}setname (සමූහයේ නම වෙනස් කිරීම)
│${setv} ${prefix}setdesc (විස්තරය වෙනස් කිරීම)
│${setv} ${prefix}setppgc (සමූහ ඡායාරූපය සැකසීම)
│${setv} ${prefix}delete (පණිවිඩ මැකීම)
│${setv} ${prefix}linkgrup (සමූහ සබැඳිය)
│${setv} ${prefix}revoke (සබැඳිය අලුත් කිරීම)
│${setv} ${prefix}tagall (සියල්ලන් ටැග් කිරීම)
│${setv} ${prefix}pin (පණිවිඩය රඳවා තැබීම)
│${setv} ${prefix}unpin (රඳවා තැබීම ඉවත් කිරීම)
│${setv} ${prefix}hidetag (නොපෙනෙන සේ ටැග් කිරීම)
│${setv} ${prefix}totag (පණිවිඩයක් ටැග් කිරීම)
│${setv} ${prefix}listonline (සක්‍රීය අය බැලීම)
│${setv} ${prefix}group set (සමූහ සැකසුම්)
│${setv} ${prefix}group (පාලකයන්ට පමණි)
╰─┬────❍
╭─┴❍「 *සෙවුම් (SEARCH)* 」❍
│${setv} ${prefix}ytsearch (YouTube සෙවීම්)
│${setv} ${prefix}spotify (සංගීත සෙවීම්)
│${setv} ${prefix}pixiv (චිත්‍ර සෙවීම්)
│${setv} ${prefix}pinterest (පින්තූර සෙවීම්)
│${setv} ${prefix}wallpaper (පසුතල පින්තූර)
│${setv} ${prefix}ringtone (රිංග්ටෝන්)
│${setv} ${prefix}google (ගූගල් සෙවීම්)
│${setv} ${prefix}gimage (ගූගල් පින්තූර)
│${setv} ${prefix}npm (NPM සෙවීම්)
│${setv} ${prefix}style (අකුරු හැඩතල)
│${setv} ${prefix}cuaca (කාලගුණය)
│${setv} ${prefix}tenor (GIF සෙවීම්)
│${setv} ${prefix}urban (වචන අර්ථ සෙවීම්)
╰─┬────❍
╭─┴❍「 *බාගත කිරීම් (DOWNLOAD)* 」❍
│${setv} ${prefix}ytmp3 (YouTube ගීත)
│${setv} ${prefix}ytmp4 (YouTube වීඩියෝ)
│${setv} ${prefix}instagram (ඉන්ස්ටග්‍රෑම් වීඩියෝ)
│${setv} ${prefix}tiktok (ටික්ටොක් වීඩියෝ)
│${setv} ${prefix}tiktokmp3 (ටික්ටොක් ශබ්ද)
│${setv} ${prefix}facebook (ෆේස්බුක් වීඩියෝ)
│${setv} ${prefix}spotifydl (ස්පොටිෆයි ගීත)
│${setv} ${prefix}mediafire (මීඩියාෆයර් ගොනු)
╰─┬────❍
╭─┴❍「 *උපුටා දැක්වීම් (QUOTES)* 」❍
│${setv} ${prefix}motivasi (අභිප්‍රේරණය)
│${setv} ${prefix}quotes (උපුටා දැක්වීම්)
│${setv} ${prefix}truth (ඇත්ත පැවසීම)
│${setv} ${prefix}bijak (නැණවත් කියමන්)
│${setv} ${prefix}dare (අභියෝග)
│${setv} ${prefix}bucin (ආදරණීය කියමන්)
│${setv} ${prefix}renungan (සිතන්නට යමක්)
╰─┬────❍
╭─┴❍「 *මෙවලම් (TOOLS)* 」❍
│${setv} ${prefix}get (දත්ත ලබා ගැනීම) 🔸️
│${setv} ${prefix}hd (පැහැදිලි බව වැඩි කිරීම)
│${setv} ${prefix}toaudio (හඬ බවට හැරවීම)
│${setv} ${prefix}tomp3 (MP3 බවට හැරවීම)
│${setv} ${prefix}tovn (හඬ පටයක් බවට හැරවීම)
│${setv} ${prefix}toimage (පින්තූරයක් බවට හැරවීම)
│${setv} ${prefix}toptv (වීඩියෝවක් බවට හැරවීම)
│${setv} ${prefix}tourl (සබැඳියක් බවට හැරවීම)
│${setv} ${prefix}tts (අකුරු හඬ බවට හැරවීම)
│${setv} ${prefix}toqr (QR කේතයක් සෑදීම)
│${setv} ${prefix}brat (විශේෂ ස්ටිකර්)
│${setv} ${prefix}bratvid (වීඩියෝ ස්ටිකර්)
│${setv} ${prefix}ssweb (වෙබ් පිටු ඡායාරූප) 🔸️
│${setv} ${prefix}sticker (ස්ටිකර් සෑදීම)
│${setv} ${prefix}attp (ඇනිමේෂන් ස්ටිකර්)
│${setv} ${prefix}colong (ස්ටිකර් ගැනීම)
│${setv} ${prefix}smeme (මීම්ස් සෑදීම)
│${setv} ${prefix}dehaze (පැහැදිලි කිරීම)
│${setv} ${prefix}colorize (වර්ණ ගැන්වීම)
│${setv} ${prefix}hitamkan (කළු සුදු කිරීම)
│${setv} ${prefix}emojimix (ඉමෝජි මිශ්‍ර කිරීම)
│${setv} ${prefix}hack (WhatsApp Hack 💀)
│${setv} ${prefix}nulis (ලිවීම)
│${setv} ${prefix}readmore (වැඩිපුර කියවීමට)
│${setv} ${prefix}qc (චැට් බබල් සෑදීම)
│${setv} ${prefix}translate (පරිවර්තනය)
│${setv} ${prefix}wasted (වෙස්ටඩ් ඉෆෙක්ට්)
│${setv} ${prefix}triggered (ට්‍රිගර් ඉෆෙක්ට්)
│${setv} ${prefix}shorturl (සබැඳි කෙටි කිරීම)
│${setv} ${prefix}gitclone (ගිට්හබ් ගොනු ගැනීම)
│${setv} ${prefix}fat (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}fast (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}bass (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}slow (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}tupai (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}deep (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}robot (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}blown (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}reverse (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}smooth (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}earrape (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}nightcore (හඬ වෙනස් කිරීම්)
│${setv} ${prefix}getexif (ස්ටිකර් විස්තර බැලීම)
╰─┬────❍
╭─┴❍「 *කෘතිම බුද්ධිය (AI)* 」❍
│${setv} ${prefix}ai (ප්‍රශ්න ඇසීම)
│${setv} ${prefix}gemini (ගෙමිනි AI)
│${setv} ${prefix}txt2img (අකුරුවලින් පින්තූර සෑදීම)
╰─┬────❍
╭─┴❍「 *ඇනිමේ (ANIME)* 」❍
│${setv} ${prefix}waifu (ඇනිමේ රූප)
│${setv} ${prefix}neko (නෙකෝ රූප)
╰─┬────❍
╭─┴❍「 *ක්‍රීඩා (GAME)* 」❍
│${setv} ${prefix}tictactoe (තිතයි කතුරයි)
│${setv} ${prefix}akinator (සිතුවිලි කියවීම)
│${setv} ${prefix}suit (ගල, කතුර, කොළය)
│${setv} ${prefix}slot (ස්ලොට් මැෂින්)
│${setv} ${prefix}math (ගණිත ගැටලු)
│${setv} ${prefix}begal (කොල්ලකෑම)
│${setv} ${prefix}ulartangga (ලුඩෝ/පහේ ක්‍රීඩාව)
│${setv} ${prefix}blackjack (කාඩ් ක්‍රීඩාව)
│${setv} ${prefix}catur (චෙස්)
│${setv} ${prefix}casino (කැසිනෝ)
│${setv} ${prefix}samgong (කාඩ් ක්‍රීඩාව)
│${setv} ${prefix}rampok (සොරකම් කිරීම)
│${setv} ${prefix}tekateki (ප්‍රහේලිකා)
│${setv} ${prefix}tebaklirik (ගීත පද අනුමානය)
│${setv} ${prefix}tebakkata (වචන අනුමානය)
│${setv} ${prefix}tebakbom (බෝම්බ අනුමානය)
│${setv} ${prefix}susunkata (වචන පෙළගැස්ම)
│${setv} ${prefix}colorblind (වර්ණ පරීක්ෂාව)
│${setv} ${prefix}tebakkimia (රසායන විද්‍යා අනුමානය)
│${setv} ${prefix}caklontong (විහිළු ප්‍රහේලිකා)
│${setv} ${prefix}tebakangka (අංක අනුමානය)
│${setv} ${prefix}tebaknegara (රටවල් අනුමානය)
│${setv} ${prefix}tebakgambar (රූප අනුමානය)
│${setv} ${prefix}tebakbendera (කොඩි අනුමානය)
╰─┬────❍
╭─┴❍「 *විනෝදය (FUN)* 」❍
│${setv} ${prefix}coba (උත්සාහ කරන්න)
│${setv} ${prefix}dadu (දාදු කැටය)
│${setv} ${prefix}bisakah (හැකියාවක් ඇසීම)
│${setv} ${prefix}apakah (ප්‍රශ්න ඇසීම)
│${setv} ${prefix}kapan (කවදාදැයි ඇසීම)
│${setv} ${prefix}siapa (කවුදැයි ඇසීම)
│${setv} ${prefix}kerangajaib (විස්මිත බෙල්ලා)
│${setv} ${prefix}cekmati (මරණය ගැන විහිළුවට ඇසීම)
│${setv} ${prefix}ceksifat (ගතිගුණ බැලීම)
│${setv} ${prefix}cekkhodam (ආත්මය බැලීම)
│${setv} ${prefix}rate (අගය කිරීම)
│${setv} ${prefix}jodohku (සහකරු සෙවීම)
│${setv} ${prefix}jadian (සම්බන්ධතාවයක් ඇති කිරීම)
│${setv} ${prefix}fitnah (ව්‍යාජ පණිවිඩ සෑදීම)
│${setv} ${prefix}halah (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}hilih (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}huluh (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}heleh (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}holoh (අකුරු වෙනස් කිරීම)
╰─┬────❍
╭─┴❍「 *වෙනත් (RANDOM)* 」❍
│${setv} ${prefix}coffe (කෝපි පින්තූර)
╰─┬────❍
╭─┴❍「 *තොරතුරු සෙවීම (STALKER)* 」❍
│${setv} ${prefix}wastalk (WhatsApp තොරතුරු)
│${setv} ${prefix}githubstalk (GitHub තොරතුරු)
╰─┬────❍
╭─┴❍「 *හිමිකරු (OWNER)* 」❍
│${setv} ${prefix}bot [set] (බොට් සැකසුම්)
│${setv} ${prefix}setbio (මතකය සැකසීම)
│${setv} ${prefix}setppbot (බොට් පින්තූරය සැකසීම)
│${setv} ${prefix}join (සමූහයකට එක්වීම)
│${setv} ${prefix}leave (සමූහයෙන් ඉවත් වීම)
│${setv} ${prefix}block (අවහිර කිරීම)
│${setv} ${prefix}listblock (අවහිර කළ ලැයිස්තුව)
│${setv} ${prefix}openblock (අවහිරය ඉවත් කිරීම)
│${setv} ${prefix}listpc (පෞද්ගලික චැට් ලැයිස්තුව)
│${setv} ${prefix}listgc (සමූහ ලැයිස්තුව)
│${setv} ${prefix}ban (තහනම් කිරීම)
│${setv} ${prefix}unban (තහනම ඉවත් කිරීම)
│${setv} ${prefix}mute (නිහඬ කිරීම)
│${setv} ${prefix}unmute (නිහඬ බව ඉවත් කිරීම)
│${setv} ${prefix}creategc (සමූහයක් සෑදීම)
│${setv} ${prefix}clearchat (චැට් මැකීම)
│${setv} ${prefix}addprem (ප්‍රීමියම් එක් කිරීම)
│${setv} ${prefix}delprem (ප්‍රීමියම් ඉවත් කිරීම)
│${setv} ${prefix}listprem (ප්‍රීමියම් ලැයිස්තුව)
│${setv} ${prefix}addlimit (සීමාව වැඩි කිරීම)
│${setv} ${prefix}adduang (මුදල් එක් කිරීම)
│${setv} ${prefix}setbotauthor (නිර්මාණකරු නම)
│${setv} ${prefix}setbotname (බොට්ගේ නම)
│${setv} ${prefix}setbotpackname (පැකේජ නම)
│${setv} ${prefix}setapikey (API කේතය සැකසීම)
│${setv} ${prefix}addowner (හිමිකරුවෙකු එක් කිරීම)
│${setv} ${prefix}delowner (හිමිකරුවෙකු ඉවත් කිරීම)
│${setv} ${prefix}getmsgstore (දත්ත ගබඩාව ලබා ගැනීම)
│${setv} ${prefix}bot --settings (බොට් සැකසුම්)
│${setv} ${prefix}bot settings (බොට් සැකසුම්)
│${setv} ${prefix}getsession (සෙශන් එක ලබා ගැනීම)
│${setv} ${prefix}delsession (සෙශන් එක මැකීම)
│${setv} ${prefix}delsampah (වැඩකට නැති දත්ත මැකීම)
│${setv} ${prefix}upsw (ස්ටේටස් දැමීම)
│${setv} ${prefix}backup (දත්ත සුරැකීම)
│${setv} $ (කේත ක්‍රියාත්මක කිරීම)
│${setv} > (කේත ක්‍රියාත්මක කිරීම)
│${setv} < (කේත ක්‍රියාත්මක කිරීම)
╰──────❍`
				await m.reply({
					document: fake.docs,
					fileName: ucapanWaktu,
					mimetype: pickRandom(fake.listfakedocs),
					fileLength: '100000000000000',
					pageCount: '999',
					caption: menunya,
					contextInfo: {
						mentionedJid: [m.sender, '0@s.whatsapp.net', ownerNumber[0] + '@s.whatsapp.net'],
						forwardingScore: 10,
						isForwarded: true,
						forwardedNewsletterMessageInfo: {
							newsletterJid: my.ch,
							serverMessageId: null,
							newsletterName: 'Miss Shasikala'
						},
						externalAdReply: {
							title: author,
							body: packname,
							showAdAttribution: false,
							thumbnailUrl: profile,
							mediaType: 1,
							previewType: 0,
							renderLargerThumbnail: true,
							mediaUrl: my.gh,
							sourceUrl: my.gh,
						}
					}
				})
			}
			break
			case 'botmenu': {
				m.reply(`
╭──❍「 *බොට් (BOT)* 」❍
│${setv} ${prefix}profile (ගිණුම් විස්තර)
│${setv} ${prefix}claim (දිනපතා ත්‍යාග)
│${setv} ${prefix}buy [භාණ්ඩය] (ප්‍රමාණය)
│${setv} ${prefix}transfer (මුදල් යැවීම)
│${setv} ${prefix}leaderboard (ප්‍රමුඛ පුවරුව)
│${setv} ${prefix}request (ඉල්ලීම් පණිවිඩ)
│${setv} ${prefix}react (ප්‍රතිචාර ඉමෝජි)
│${setv} ${prefix}tagme (මාව ටැග් කරන්න)
│${setv} ${prefix}runtime (ක්‍රියාත්මක වන කාලය)
│${setv} ${prefix}totalfitur (මුළු විශේෂාංග)
│${setv} ${prefix}speed (වේගය පරීක්ෂාව)
│${setv} ${prefix}ping (ප්‍රතිචාර කාලය)
│${setv} ${prefix}afk (බැහැරව සිටින බව දැන්වීම)
│${setv} ${prefix}rvo (වරක් පමණක් බැලිය හැකි පණිවිඩ බැලීම)
│${setv} ${prefix}inspect (සමූහයක විස්තර බැලීම)
│${setv} ${prefix}addmsg (පණිවිඩ එකතු කිරීම)
│${setv} ${prefix}delmsg (පණිවිඩ මැකීම)
│${setv} ${prefix}getmsg (පණිවිඩ ලබා ගැනීම)
│${setv} ${prefix}listmsg (පණිවිඩ ලැයිස්තුව)
│${setv} ${prefix}setcmd (විධාන සැකසීම)
│${setv} ${prefix}delcmd (විධාන මැකීම)
│${setv} ${prefix}listcmd (විධාන ලැයිස්තුව)
│${setv} ${prefix}lockcmd (විධාන අගුළු දැමීම)
│${setv} ${prefix}q (පණිවිඩයකට පිළිතුරු දීම)
│${setv} ${prefix}menfes (රහසිගත පණිවිඩ)
│${setv} ${prefix}confes (පාපොච්චාරණය)
│${setv} ${prefix}roomai (AI කාමරය)
│${setv} ${prefix}jadibot (තවත් බොට් කෙනෙකු වීම) 🔸️
│${setv} ${prefix}stopjadibot (නැවැත්වීම)
│${setv} ${prefix}listjadibot (ලැයිස්තුව බැලීම)
│${setv} ${prefix}donasi (ආධාර කිරීම)
│${setv} ${prefix}addsewa (කුලී කාලය එකතු කිරීම)
│${setv} ${prefix}delsewa (කුලී කාලය ඉවත් කිරීම)
│${setv} ${prefix}listsewa (කුලී ලැයිස්තුව)
╰──────❍`)
			}
			break
			case 'groupmenu': {
				m.reply(`
╭──❍「 *සමූහ (GROUP)* 」❍
│${setv} ${prefix}add (සාමාජිකයින් එක් කිරීම)
│${setv} ${prefix}kick (සාමාජිකයින් ඉවත් කිරීම)
│${setv} ${prefix}promote (පාලක තනතුරු දීම)
│${setv} ${prefix}demote (පාලක තනතුරු ඉවත් කිරීම)
│${setv} ${prefix}warn (අවවාද කිරීම)
│${setv} ${prefix}unwarn (අවවාද ඉවත් කිරීම)
│${setv} ${prefix}setname (සමූහයේ නම වෙනස් කිරීම)
│${setv} ${prefix}setdesc (විස්තරය වෙනස් කිරීම)
│${setv} ${prefix}setppgc (සමූහ ඡායාරූපය සැකසීම)
│${setv} ${prefix}delete (පණිවිඩ මැකීම)
│${setv} ${prefix}linkgrup (සමූහ සබැඳිය)
│${setv} ${prefix}revoke (සබැඳිය අලුත් කිරීම)
│${setv} ${prefix}tagall (සියල්ලන් ටැග් කිරීම)
│${setv} ${prefix}pin (පණිවිඩය රඳවා තැබීම)
│${setv} ${prefix}unpin (රඳවා තැබීම ඉවත් කිරීම)
│${setv} ${prefix}hidetag (නොපෙනෙන සේ ටැග් කිරීම)
│${setv} ${prefix}totag (පණිවිඩයක් ටැග් කිරීම)
│${setv} ${prefix}listonline (සක්‍රීය අය බැලීම)
│${setv} ${prefix}group set (සමූහ සැකසුම්)
│${setv} ${prefix}group (පාලකයන්ට පමණි)
╰──────❍`)
			}
			break
			case 'searchmenu': {
				m.reply(`
╭──❍「 *සෙවුම් (SEARCH)* 」❍
│${setv} ${prefix}ytsearch (YouTube සෙවීම්)
│${setv} ${prefix}spotify (සංගීත සෙවීම්)
│${setv} ${prefix}pixiv (Pixiv චිත්‍ර සෙවීම්)
│${setv} ${prefix}pinterest (Pinterest පින්තූර සෙවීම්)
│${setv} ${prefix}wallpaper (පසුතල පින්තූර)
│${setv} ${prefix}ringtone (රිංග්ටෝන් සෙවීම්)
│${setv} ${prefix}google (Google සෙවීම්)
│${setv} ${prefix}gimage (Google පින්තූර)
│${setv} ${prefix}npm (NPM පැකේජ සෙවීම්)
│${setv} ${prefix}style (අකුරු හැඩතල)
│${setv} ${prefix}cuaca (කාලගුණය - නගරය)
│${setv} ${prefix}tenor (Tenor GIF සෙවීම්)
│${setv} ${prefix}urban (Urban Dictionary අර්ථ)
╰──────❍`)
			}
			break
			case 'downloadmenu': {
				m.reply(`
╭──❍「 *බාගත කිරීම් (DOWNLOAD)* 」❍
│${setv} ${prefix}ytmp3 (YouTube ගීත)
│${setv} ${prefix}ytmp4 (YouTube වීඩියෝ)
│${setv} ${prefix}instagram (Instagram වීඩියෝ)
│${setv} ${prefix}tiktok (TikTok වීඩියෝ)
│${setv} ${prefix}tiktokmp3 (TikTok ශබ්ද)
│${setv} ${prefix}facebook (Facebook වීඩියෝ)
│${setv} ${prefix}spotifydl (Spotify ගීත)
│${setv} ${prefix}mediafire (Mediafire ගොනු)
╰──────❍`)
			}
			break
			case 'quotesmenu': {
				m.reply(`
╭──❍「 *උපුටා දැක්වීම් (QUOTES)* 」❍
│${setv} ${prefix}motivasi (අභිප්‍රේරණය)
│${setv} ${prefix}quotes (උපුටා දැක්වීම්)
│${setv} ${prefix}truth (සත්‍යය පැවසීම)
│${setv} ${prefix}bijak (නැණවත් කියමන්)
│${setv} ${prefix}dare (අභියෝග)
│${setv} ${prefix}bucin (ආදරණීය කියමන්)
│${setv} ${prefix}renungan (සිතන්නට යමක්)
╰──────❍`)
			}
			break
			case 'toolsmenu': {
				m.reply(`
╭──❍「 *මෙවලම් (TOOLS)* 」❍
│${setv} ${prefix}get (දත්ත ලබා ගැනීම) 🔸️
│${setv} ${prefix}hd (පැහැදිලි බව වැඩි කිරීම)
│${setv} ${prefix}toaudio (හඬ බවට හැරවීම)
│${setv} ${prefix}tomp3 (MP3 බවට හැරවීම)
│${setv} ${prefix}tovn (හඬ පටයක් බවට හැරවීම)
│${setv} ${prefix}toimage (ඡායාරූපයක් බවට හැරවීම)
│${setv} ${prefix}toptv (වීඩියෝවක් බවට හැරවීම)
│${setv} ${prefix}tourl (සබැඳියක් බවට හැරවීම)
│${setv} ${prefix}tts (අකුරු හඬ බවට හැරවීම)
│${setv} ${prefix}toqr (QR කේතයක් සෑදීම)
│${setv} ${prefix}brat (බ්‍රැට් ස්ටිකර්)
│${setv} ${prefix}bratvid (වීඩියෝ බ්‍රැට් ස්ටිකර්)
│${setv} ${prefix}ssweb (වෙබ් පිටු ඡායාරූප) 🔸️
│${setv} ${prefix}sticker (ස්ටිකර් සෑදීම)
│${setv} ${prefix}attp (ඇනිමේෂන් ස්ටිකර්)
│${setv} ${prefix}colong (ස්ටිකර් ලබා ගැනීම)
│${setv} ${prefix}smeme (මීම්ස් සෑදීම)
│${setv} ${prefix}dehaze (පැහැදිලි කිරීම)
│${setv} ${prefix}colorize (වර්ණ ගැන්වීම)
│${setv} ${prefix}hitamkan (කළු සුදු කිරීම)
│${setv} ${prefix}emojimix (ඉමෝජි මිශ්‍ර කිරීම)
│${setv} ${prefix}hack ( වට්සැප් හැක් කිරීම 💀)
│${setv} ${prefix}nulis (ලිවීම)
│${setv} ${prefix}readmore (වැඩිපුර කියවීමට)
│${setv} ${prefix}qc (චැට් බබල් සෑදීම)
│${setv} ${prefix}translate (පරිවර්තනය)
│${setv} ${prefix}wasted (වෙස්ටඩ් ඉෆෙක්ට්)
│${setv} ${prefix}triggered (ට්‍රිගර් ඉෆෙක්ට්)
│${setv} ${prefix}shorturl (සබැඳි කෙටි කිරීම)
│${setv} ${prefix}gitclone (ගිට්හබ් ගොනු ගැනීම)
│${setv} ${prefix}fat (මහත හඬ)
│${setv} ${prefix}fast (වේගවත් හඬ)
│${setv} ${prefix}bass (බේස් වැඩි හඬ)
│${setv} ${prefix}slow (සෙමින් ඇසෙන හඬ)
│${setv} ${prefix}tupai (ලේනෙකුගේ හඬ)
│${setv} ${prefix}deep (ගැඹුරු හඬ)
│${setv} ${prefix}robot (රොබෝ හඬ)
│${setv} ${prefix}blown (බ්ලෝන් ඉෆෙක්ට්)
│${setv} ${prefix}reverse (පසුපසට ඇසෙන හඬ)
│${setv} ${prefix}smooth (සිනිඳු හඬ)
│${setv} ${prefix}earrape (ඉයර්රේප් ඉෆෙක්ට්)
│${setv} ${prefix}nightcore (නයිට්කෝර් ඉෆෙක්ට්)
│${setv} ${prefix}getexif (ස්ටිකර් විස්තර බැලීම)
╰──────❍`)
			}
			break
			case 'aimenu': {
				m.reply(`
╭──❍「 *කෘතිම බුද්ධිය (AI)* 」❍
│${setv} ${prefix}ai (ප්‍රශ්න ඇසීම)
│${setv} ${prefix}gemini (ගෙමිනි AI)
│${setv} ${prefix}txt2img (අකුරුවලින් පින්තූර සෑදීම)
╰──────❍`)
			}
			break
			case 'randommenu': {
				m.reply(`
╭──❍「 *වෙනත් (RANDOM)* 」❍
│${setv} ${prefix}coffe (කෝපි පින්තූර)
╰──────❍`)
			}
			break
			case 'stalkermenu': {
				m.reply(`
╭──❍「 *තොරතුරු සෙවීම (STALKER)* 」❍
│${setv} ${prefix}wastalk (WhatsApp තොරතුරු)
│${setv} ${prefix}githubstalk (GitHub තොරතුරු)
╰──────❍`)
			}
			break
			case 'animemenu': {
				m.reply(`
╭──❍「 *ඇනිමේ (ANIME)* 」❍
│${setv} ${prefix}waifu (ඇනිමේ රූප)
│${setv} ${prefix}neko (නෙකෝ රූප)
╰──────❍`)
			}
			break
			case 'gamemenu': {
				m.reply(`
╭──❍「 *ක්‍රීඩා (GAME)* 」❍
│${setv} ${prefix}tictactoe (තිතයි කතුරයි)
│${setv} ${prefix}akinator (සිතුවිලි කියවීම)
│${setv} ${prefix}suit (ගල, කතුර, කොළය)
│${setv} ${prefix}slot (ස්ලොට් මැෂින්)
│${setv} ${prefix}math (ගණිත ගැටලු)
│${setv} ${prefix}begal (කොල්ලකෑම)
│${setv} ${prefix}ulartangga (ලුඩෝ/පහේ ක්‍රීඩාව)
│${setv} ${prefix}blackjack (කාඩ් ක්‍රීඩාව)
│${setv} ${prefix}catur (චෙස්)
│${setv} ${prefix}casino (කැසිනෝ)
│${setv} ${prefix}samgong (කාඩ් ක්‍රීඩාව)
│${setv} ${prefix}rampok (සොරකම් කිරීම)
│${setv} ${prefix}tekateki (ප්‍රහේලිකා)
│${setv} ${prefix}tebaklirik (ගීත පද අනුමානය)
│${setv} ${prefix}tebakkata (වචන අනුමානය)
│${setv} ${prefix}tebakbom (බෝම්බ අනුමානය)
│${setv} ${prefix}susunkata (වචන පෙළගැස්ම)
│${setv} ${prefix}colorblind (වර්ණ පරීක්ෂාව)
│${setv} ${prefix}tebakkimia (රසායන විද්‍යා අනුමානය)
│${setv} ${prefix}caklontong (විහිළු ප්‍රහේලිකා)
│${setv} ${prefix}tebakangka (අංක අනුමානය)
│${setv} ${prefix}tebaknegara (රටවල් අනුමානය)
│${setv} ${prefix}tebakgambar (රූප අනුමානය)
│${setv} ${prefix}tebakbendera (කොඩි අනුමානය)
╰──────❍`)
			}
			break
			case 'funmenu': {
				m.reply(`
╭──❍「 *විනෝදය (FUN)* 」❍
│${setv} ${prefix}coba (උත්සාහ කරන්න)
│${setv} ${prefix}dadu (දාදු කැටය)
│${setv} ${prefix}bisakah (හැකියාවක් ඇසීම)
│${setv} ${prefix}apakah (ප්‍රශ්න ඇසීම)
│${setv} ${prefix}kapan (කවදාදැයි ඇසීම)
│${setv} ${prefix}siapa (කවුදැයි ඇසීම)
│${setv} ${prefix}kerangajaib (විස්මිත බෙල්ලා)
│${setv} ${prefix}cekmati (මරණය ගැන විහිළුවට ඇසීම)
│${setv} ${prefix}ceksifat (ගතිගුණ බැලීම)
│${setv} ${prefix}cekkhodam (ආත්මය බැලීම)
│${setv} ${prefix}rate (අගය කිරීම)
│${setv} ${prefix}jodohku (සහකරු සෙවීම)
│${setv} ${prefix}jadian (සම්බන්ධතාවයක් ඇති කිරීම)
│${setv} ${prefix}fitnah (ව්‍යාජ පණිවිඩ සෑදීම)
│${setv} ${prefix}halah (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}hilih (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}huluh (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}heleh (අකුරු වෙනස් කිරීම)
│${setv} ${prefix}holoh (අකුරු වෙනස් කිරීම)
╰──────❍`)
			}
			break
			case 'ownermenu': {
				m.reply(`
╭──❍「 *හිමිකරු (OWNER)* 」❍
│${setv} ${prefix}bot [set] (බොට් සැකසුම්)
│${setv} ${prefix}setbio (මතකය සැකසීම)
│${setv} ${prefix}setppbot (බොට් පින්තූරය සැකසීම)
│${setv} ${prefix}join (සමූහයකට එක්වීම)
│${setv} ${prefix}leave (සමූහයෙන් ඉවත් වීම)
│${setv} ${prefix}block (අවහිර කිරීම)
│${setv} ${prefix}listblock (අවහිර කළ ලැයිස්තුව)
│${setv} ${prefix}openblock (අවහිරය ඉවත් කිරීම)
│${setv} ${prefix}listpc (පෞද්ගලික චැට් ලැයිස්තුව)
│${setv} ${prefix}listgc (සමූහ ලැයිස්තුව)
│${setv} ${prefix}ban (තහනම් කිරීම)
│${setv} ${prefix}unban (තහනම ඉවත් කිරීම)
│${setv} ${prefix}mute (නිහඬ කිරීම)
│${setv} ${prefix}unmute (නිහඬ බව ඉවත් කිරීම)
│${setv} ${prefix}creategc (සමූහයක් සෑදීම)
│${setv} ${prefix}clearchat (චැට් මැකීම)
│${setv} ${prefix}addprem (ප්‍රීමියම් එක් කිරීම)
│${setv} ${prefix}delprem (ප්‍රීමියම් ඉවත් කිරීම)
│${setv} ${prefix}listprem (ප්‍රීමියම් ලැයිස්තුව)
│${setv} ${prefix}addlimit (සීමාව වැඩි කිරීම)
│${setv} ${prefix}adduang (මුදල් එක් කිරීම)
│${setv} ${prefix}setbotauthor (නිර්මාණකරු නම)
│${setv} ${prefix}setbotname (බොට්ගේ නම)
│${setv} ${prefix}setbotpackname (පැකේජ නම)
│${setv} ${prefix}setapikey (API කේතය සැකසීම)
│${setv} ${prefix}addowner (හිමිකරුවෙකු එක් කිරීම)
│${setv} ${prefix}delowner (හිමිකරුවෙකු ඉවත් කිරීම)
│${setv} ${prefix}getmsgstore (දත්ත ගබඩාව ලබා ගැනීම)
│${setv} ${prefix}bot --settings (බොට් සැකසුම්)
│${setv} ${prefix}bot settings (බොට් සැකසුම්)
│${setv} ${prefix}getsession (සෙශන් එක ලබා ගැනීම)
│${setv} ${prefix}delsession (සෙශන් එක මැකීම)
│${setv} ${prefix}delsampah (වැඩකට නැති දත්ත මැකීම)
│${setv} ${prefix}upsw (ස්ටේටස් දැමීම)
│${setv} ${prefix}backup (දත්ත සුරැකීම)
│${setv} $ (කේත ක්‍රියාත්මක කිරීම)
│${setv} > (කේත ක්‍රියාත්මක කිරීම)
│${setv} < (කේත ක්‍රියාත්මක කිරීම)
╰──────❍`)
			}
			break

			default:
			if (budy.startsWith('>')) {
				if (!isCreator) return
				try {
					let evaled = await eval(budy.slice(2))
					if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
					await m.reply(evaled)
				} catch (err) {
					await m.reply(String(err))
				}
			}
			if (budy.startsWith('<')) {
				if (!isCreator) return
				try {
					let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
					if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
					await m.reply(evaled)
				} catch (err) {
					await m.reply(String(err))
				}
			}
			if (budy.startsWith('$')) {
				if (!isCreator) return
				if (!text) return
				exec(budy.slice(2), (err, stdout) => {
					if (err) return m.reply(`${err}`)
					if (stdout) return m.reply(stdout)
				})
			}
			if ((!isCmd || isCreator) && budy.toLowerCase() != undefined) {
				if (m.chat.endsWith('broadcast')) return
				if (!(budy.toLowerCase() in db.database)) return
				await nimesha.relayMessage(m.chat, db.database[budy.toLowerCase()], {})
			}
		}
	} catch (e) {
		console.log(e);
		if (e?.message?.includes('No sessions')) return;
		const errorKey = e?.code || e?.name || e?.message?.slice(0, 100) || 'unknown_error';
		const now = Date.now();
		if (!errorCache[errorKey]) errorCache[errorKey] = [];
		errorCache[errorKey] = errorCache[errorKey].filter(ts => now - ts < 600000);
		if (errorCache[errorKey].length >= 3) return;
		errorCache[errorKey].push(now);
		m.reply('Error: ' + (e?.name || e?.code || e?.output?.statusCode || e?.status || 'නොදනී') + '\nError log හිමිකරුට යැව්වා\n\n')
		return nimesha.sendFromOwner(ownerNumber, `සුභ දවසක්, error එකක් ඇති, නිවැරදි කිරීමට අමතක නොකරන්න\n\nVersion : *${require('./package.json').version}*\n\n*Log error:*\n\n` + util.format(e), m, { contextInfo: { isForwarded: true }})
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)

});
