require('./settings');
const os = require('os');
const pino = require('pino');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const { toBuffer } = require('qrcode');
const { Boom } = require('@hapi/boom');
const NodeCache = require('node-cache');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const { parsePhoneNumber } = require('awesome-phonenumber');
const { default: WAConnection, useMultiFileAuthState, Browsers, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, jidNormalizedUser } = require('baileys');

const { dataBase } = require('./src/database');
const { app, server, PORT } = require('./src/server');
const { assertInstalled, unsafeAgent } = require('./lib/function');
const { GroupParticipantsUpdate, MessagesUpsert, Solving } = require('./src/message');

const print = (label, value) => console.log(`${chalk.green.bold('║')} ${chalk.cyan.bold(label.padEnd(16))}${chalk.yellow.bold(':')} ${value}`);
const pairingCode = process.argv.includes('--qr') ? false : process.argv.includes('--pairing-code') || global.pairing_code;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
let pairingStarted = false;
let phoneNumber;

const userInfoSyt = () => {
	try {
		return os.userInfo().userනාමය
	} catch (e) {
		return process.env.USER || process.env.USERNAME || 'unknown';
	}
}

global.fetchApi = async (path='/', data={}, options={}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const base = options.නාමය ? (options.නාමය in global.APIs ? global.APIs[options.නාමය] : options.නාමය) : global.APIs.nima
      const apikey = global.APIKeys[base]
      let method = (options.method || 'GET').toUpperCase()
      let url = base + path
      let payload = null
      let headers = options.headers || { 'user-agent': 'Mozilla/5.0 (Linux; Android 15)' }
      const isForm = options.form || data instanceof FormData || (data && typeof data.getHeaders === 'function')
      if (isForm) {
        payload = data
        method = 'POST'
        headers = { ...headers, ...data.getHeaders() }
      } else if (method !== 'GET') {
        payload = { ...data }
        headers['content-type'] = 'application/json'
      } else {
        url += '?' + new URLSearchParams({ ...data }).toString()
      }

      const res = await axios({
        method, url, data: payload,
        headers, httpsAgent: unsafeAgent,
        responseType: options.buffer ? 'arraybuffer'  : options.responseType || options.type || 'json'
      });
      resolve(options.buffer ? Buffer.from(res.data) : res.data);
    } catch (e) {
      reject(e)
    }
  })
}

const storeDB = dataBase(global.tempatStore);
const database = dataBase(global.tempatDB);
const msgRetryCounterCache = new NodeCache();

assertInstalled(process.platform === 'win32' ? 'where ffmpeg' : 'command -v ffmpeg', 'FFmpeg', 0);
console.log(chalk.greenBright('✅ පද්ධතියට අවශ්‍ය සියලුම බාහිර ගොනු (Dependencies) සක්‍රීයයි'));
console.log(chalk.green.bold(`╔═════[${`${chalk.cyan(userInfoSyt())}@${chalk.cyan(os.hostනාමය())}`}]═════`));
print('OS', `${os.platform()} ${os.release()} ${os.arch()}`);
print('Uptime', `${Math.floor(os.uptime() / 3600)} පැය ${Math.floor((os.uptime() % 3600) / 60)} විනාඩි`);
print('Shell', process.env.SHELL || process.env.COMSPEC || 'unknown');
print('CPU', os.cpus()[0]?.model.trim() || 'unknown');
print('Memory', `${(os.freemem()/1024/1024).toFixed(0)} MiB / ${(os.totalmem()/1024/1024).toFixed(0)} MiB`);
print('Script version', `v${require('./package.json').version}`);
print('Node.js', process.version);
print('Baileys', `v${require('./package.json').dependencies.baileys}`);
print('Date & Time', new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: false }));
console.log(chalk.green.bold('╚' + ('═'.repeat(30))));

server.listen(PORT, () => {
	console.log('App එක පෝට්', PORT, 'හරහා සක්‍රීය විය.');
});

async function startnimaBot() {
	try {
		const loadData = await database.read()
		const storeLoadData = await storeDB.read()
		if (!loadData || Object.keys(loadData).length === 0) {
			global.db = {
				hit: {},
				set: {},
				cmd: {},
				store: {},
				users: {},
				game: {},
				groups: {},
				database: {},
				premium: [],
				sewa: [],
				...(loadData || {}),
			}
			await database.write(global.db)
		} else {
			global.db = loadData
		}
		if (!storeLoadData || Object.keys(storeLoadData).length === 0) {
			global.store = {
				contacts: {},
				presences: {},
				messages: {},
				groupMetadata: {},
				...(storeLoadData || {}),
			}
			await storeDB.write(global.store)
		} else {
			global.store = storeLoadData
		}
		
		global.loadMessage = function (remoteJid, id) {
			const messages = store.messages?.[remoteJid]?.array;
			if (!messages) return null;
			return messages.find(msg => msg?.key?.id === id) || null;
		}
		
		if (!global._dbInterval) {
			global._dbInterval = setInterval(async () => {
				if (global.db) await database.write(global.db)
				if (global.store) await storeDB.write(global.store)
			}, 30 * 1000)
		}
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
	
	const level = pino({ level: 'silent' });
	const { version } = await fetchLatestWaWebVersion();
	const { state, saveCreds } = await useMultiFileAuthState('nimadev');
	const getMessage = async (key) => {
		if (global.store) {
			const msg = await global.loadMessage(key.remoteJid, key.id);
			return msg?.message || ''
		}
		return {
			conversation: 'Halo Saya nima Bot'
		}
	}
	
	const nima = WAConnection({
		version,
		logger: level,
		getMessage,
		syncFullHistory: false,
		maxMsgRetryCount: 15,
		msgRetryCounterCache,
		retryRequestDelayMs: 10,
		defaultQueryTimeoutMs: 0,
		connectTimeoutMs: 60000,
		keepAliveIntervalMs: 30000,
		// මෙන්න මෙතැනින් තමයි ඔබ ඉල්ලූ නම වෙනස් කළේ
		GenerateHighQualityLinkPreview: false,
		transactionOpts: {
			maxCommitRetries: 10,
			delayBetweenTriesMs: 10,
		},
		appStateMacVerification: {
			patch: true,
			snapshot: true,
		},
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, level),
		},
	})
	
	if (pairingCode && !phoneNumber && !nima.authState.creds.registered) {
		async function getPhoneNumber() {
			phoneNumber = global.number_bot ? global.number_bot : process.env.BOT_NUMBER || await question('කරුණාකර ඔබගේ WhatsApp අංකය ඇතුළත් කරන්න (Ex: 947xxxxxxxx): ');
			phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
			
			if (!parsePhoneNumber('+' + phoneNumber).valid && phoneNumber.length < 6) {
				console.log(chalk.bgBlack(chalk.redBright('ඔබේ රටේ කේතය (Country Code) සමඟ අංකය ආරම්භ කරන්න.') + chalk.whiteBright(',') + chalk.greenBright(' උදාහරණ : 947xxxxxxxx')));
				await getPhoneNumber()
			}
		}
		(async () => {
			await getPhoneNumber();
			exec('rm -rf ./nimadev/*');
			console.log('දුරකථන අංකය ලබා ගත්තා. සම්බන්ධ වන තෙක් රැඳී සිටින්න...\n' + chalk.blueBright('ඇස්තමේන්තුගත කාලය: මිනිත්තු 2 ~ 5 පමණ'))
		})()
	}
	
	await Solving(nima, global.store)
	
	nima.ev.on('creds.update', saveCreds)
	
	nima.ev.on('connection.update', async (update) => {
		const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update;
		if ((connection === 'connecting' || !!qr) && pairingCode && phoneNumber && !nima.authState.creds.registered && !pairingStarted) {
			setTimeout(async () => {
				pairingStarted = true;
				console.log('🔑 Pairing Code ලබා ගනිමින්...')
				let code = await nima.requestPairingCode(phoneNumber);
				console.log(chalk.blue('🔑 *Pairing Code:*'), chalk.green(code), '\n', chalk.yellow('⏰ _තත්පර 15කින් expire වේ_'));
			}, 3000)
		}
		if (connection === 'close') {
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.connectionLost) {
				console.log('🔄 Server connection lost, reconnect...');
				startnimaBot()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log('🔄 Connection closed, reconnect...');
				startnimaBot()
			} else if (reason === DisconnectReason.restartRequired) {
				console.log('🔄 Restart required, reconnect...');
				startnimaBot()
			} else if (reason === DisconnectReason.timedOut) {
				console.log('⏰ Connection timeout, reconnect...');
				startnimaBot()
			} else if (reason === DisconnectReason.badSession) {
				console.log('❌ Bad session! Session delete කර නැවත scan කරන්න.');
				startnimaBot()
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log('⚠️ වෙනත් device එකකින් login! Current session close කරන්න.');
			} else if (reason === DisconnectReason.loggedOut) {
				console.log('🚪 Logged Out! නැවත scan කර run කරන්න.');
				exec('rm -rf ./nimadev/*')
				process.exit(1)
			} else if (reason === DisconnectReason.forbidden) {
				console.log('❌ Connection failed! නැවත scan කරන්න.');
				exec('rm -rf ./nimadev/*')
				process.exit(1)
			} else if (reason === DisconnectReason.multideviceMismatch) {
				console.log('⚠️ Multi-device error! නැවත scan කරන්න.');
				exec('rm -rf ./nimadev/*')
				process.exit(0)
			} else {
				nima.end(`හඳුනා නොගත් බිඳ වැටීමක්: ${reason}|${connection}`)
			}
		}
		if (connection == 'open') {
			console.log('✅ සාර්ථකව connected: ' + JSON.stringify(nima.user, null, 2));
			let botNumber = await nima.decodeJid(nima.user.id);
			if (global.db?.set[botNumber] && !global.db?.set[botNumber]?.join) {
				if (my.ch.length > 0 && my.ch.includes('@newsletter')) {
					if (my.ch) await nima.newsletterMsg(my.ch, { type: 'follow' }).catch(e => {})
					db.set[botNumber].join = true
				}
			}
			// Auto connect message to owner
			const ownerJid = global.owner[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
			const now = new Date();
			const timeStr = now.toLocaleTimeString('si-LK', { hour: '2-digit', minute: '2-digit', hour12: true });
			const dateStr = now.toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' });
			const connectMsg = `╔══════════════════╗
║   🌸 *Miss Shasikala* 🌸   
╠══════════════════╣
║ ✅ *සාර්ථකව සම්බන්ධ විය!*
║
║ 🤖 *Bot:* ${global.botනාමය || 'Miss Shasikala'}
║ 📱 *අංකය:* +${botNumber.replace('@s.whatsapp.net', '')}
║ 🕐 *වේලාව:* ${timeStr}
║ 📅 *දිනය:* ${dateStr}
║
║ 💫 _සියලු commands සූදානම්_
║ 💫 _භාවිතයට සුදානම් වෙලා ඉන්නවා_
╠══════════════════╣
║ 🌸 *${global.botනාමය || 'Miss Shasikala'}*
║ 👑 *By ${global.ownerName || global.author || 'Nimesha Madhushan'}*
╚══════════════════╝`;
			setTimeout(async () => {
				await nima.sendMessage(ownerJid, { text: connectMsg }).catch(e => {});
			}, 3000);
		}
		if (qr) {
			if (!pairingCode) qrcode.generate(qr, { small: true })
			app.use('/qr', async (req, res) => {
				res.setHeader('content-type', 'image/png')
				res.end(await toBuffer(qr))
			});
		}
		if (isNewLogin) console.log(chalk.green('📱 නව device login හඳුනා ගන්නා ලදී!'))
		if (receivedPendingNotifications == 'true') {
			console.log('⏳ විනාඩියක් රැඳෙන්න...')
			nima.ev.flush()
		}
	});
	
	nima.ev.on('contacts.update', (update) => {
		for (let contact of update) {
			if (!contact.id) continue;
			let trueJid;
			if (contact.id.endsWith('@lid')) {
				trueJid = nima.findJidByLid(jidNormalizedUser(contact.id), store);
			} else {
				trueJid = jidNormalizedUser(contact.id);
			}
			if (!trueJid) continue;
			global.store.contacts[trueJid] = {
				...global.store.contacts[trueJid],
				id: trueJid,
				නාමය: contact.notify
			}
			if (contact.id.endsWith('@lid')) {
				global.store.contacts[trueJid].lid = jidNormalizedUser(contact.id);
			}
		}
	});
	
	nima.ev.on('call', async (call) => {
		let botNumber = await nima.decodeJid(nima.user.id);
		if (global.db?.set[botNumber]?.anticall) {
			for (let id of call) {
				if (id.status === 'offer') {
					let msg = await nima.sendMessage(id.from, { text: `ස්වයංක්‍රීය පණිවිඩයකි: දැනට අපට ${id.isVideo ? 'වීඩියෝ' : 'කටහඬ'} ඇමතුම් ලබා ගත නොහැක.\n@${id.from.split('@')[0]} ඔබට උදව් අවශ්‍ය නම්, කරුණාකර හිමිකරු (Owner) සම්බන්ධ කර ගන්න.`, mentions: [id.from]});
					await nima.sendContact(id.from, global.owner, msg);
					await nima.rejectCall(id.id, id.from)
				}
			}
		}
	});
	
	nima.ev.on('messages.upsert', async (message) => {
		await MessagesUpsert(nima, message, global.store);
	});
	
	nima.ev.on('group-participants.update', async (update) => {
		await GroupParticipantsUpdate(nima, update, global.store);
	});
	
	nima.ev.on('groups.update', (update) => {
		for (const n of update) {
			if (global.store.groupMetadata[n.id]) {
				Object.assign(global.store.groupMetadata[n.id], n);
			} else global.store.groupMetadata[n.id] = n;
		}
	});
	
	nima.ev.on('presence.update', ({ id, presences: update }) => {
		store.presences[id] = global.store.presences?.[id] || {};
		Object.assign(global.store.presences[id], update);
	});
	
	if (!global._dbPresence) {
		global._dbPresence = setInterval(async () => {
			if (nima?.user?.id) await nima.sendPresenceUpdate('available', nima.decodeJid(nima.user.id)).catch(e => {})
		}, 10 * 60 * 1000);
	}

	return nima
}

startnimaBot()

// පද්ධතියෙන් ඉවත් වීම පාලනය (Process Exit)
const cleanup = async (signal) => {
	console.log(`${signal} ලැබුණි. 💾 Database save කරමින්...`)
	if (global.db) await database.write(global.db)
	if (global.store) await storeDB.write(global.store)
	server.close(() => {
		console.log('✅ Server closed. Exiting...')
		process.exit(0)
	})
}

process.on('SIGINT', () => cleanup('SIGINT'))
process.on('SIGTERM', () => cleanup('SIGTERM'))
process.on('exit', () => cleanup('exit'))

server.on('error', (error) => {
	if (error.code === 'EADDRINUSE') {
		console.log(`❌ Port ${PORT} දැනටමත් use කරයි! පසුව try කරන්න.`);
		server.close();
	} else console.error('Server error:', error);
});

setInterval(() => {}, 1000 * 60 * 10);
