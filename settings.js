const fs = require('fs');
const chalk = require('chalk');

/*
	* Create By Nimesha Madhushan
	* Follow https://github.com/nimesha206
	* Whatsapp : https://whatsapp.com/channel/0029Vb68g1c3LdQLQDkbAQ3M
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ['94784134577']
global.ownerName = 'Nimesha Madhushan'  // Bot හිමිකරු - වෙනස් නොකරන්න
global.author = 'Nimesha Madhushan'
global.botname = 'Miss Shasikala'
global.packname = 'Miss Shasikala'
global.listprefix = ['+','!','.']

global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆']
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.pairing_code = true
global.number_bot = '94726800969' // Kalo pake panel bisa masukin nomer di sini, jika belum ambil session. Format : '628xx'

global.fake = {
	anonim: 'https://ibb.co/rKyYj3Rr',
	thumbnailUrl: 'https://ibb.co/rKyYj3Rr',
	thumbnail: fs.readFileSync('./src/media/nima.png'),
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	tt: 'https://www.tiktok.com/@sashi2006',
	gh: 'https://github.com/nimesha206',
	gc: 'https://whatsapp.com/channel/0029Vb68g1c3LdQLQDkbAQ3M',
	ch: '120363419075720962@newsletter',
}

global.limit = {
	free: 20,
	premium: 999,
	vip: 9999
}

global.money = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

global.mess = {
	key: 'ඔබගේ API යතුර කල් ඉකුත් වී ඇත. කරුණාකර https://nima.biz.id වෙත පිවිසෙන්න',
	owner: 'Nimesha Madhushan',
	admin: 'Nimesha Madhushan',
	botAdmin: 'Nimesha Madhushan',
	group: 'කණ්ඩායම් වල පමණක් භාවිතා කරන්න!',
	private: 'පුද්ගලික කතාබස් වල පමණක් භාවිතා කරන්න!',
	limit: 'ඔබගේ සීමාව අවසන් වී ඇත!',
	prem: 'වාරික පරිශීලකයින් සඳහා පමණි!',
	wait: 'පූරණය වෙමින් පවතී...',
	error: 'දෝෂයක්!',
	done: 'නිමයි'
}

global.APIs = {
	nima: 'https://api.nima.biz.id',
}
global.APIKeys = {
	'https://api.nima.biz.id': 'nz-8ce9753907',
}

// Lainnya

global.badWords = ['dongo'] // input kata-kata toxic yg lain. ex: ['dongo','dongonya']
global.chatLength = 500
global.geminiMemorySize = 50  // Gemini history memory - messages 50ක් දක්වා මතක තියාගනී
// Gemini Auto Reply API Key
// https://aistudio.google.com/app/apikey යන්න ගිහින් free API key එකක් ගන්න
global.geminiApiKey = 'AIzaSyARjH2TwsNEpQ3vPHzDecf5a7v7evmQmZc'

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)

});


