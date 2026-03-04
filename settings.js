const fs = require('fs');
const chalk = require('chalk');

/*
	* Create By nima
	* Follow https://github.com/nimadev
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ['94726800969'] //['628','628'] 2 owner atau lebih
global.author = 'NIMESHA'
global.botname = 'CHUTIYA'
global.packname = 'Miss Chuti'
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
	key: 'Apikey mu telah habis silahkan kunjungi\nhttps://nima.biz.id',
	owner: 'CREATED BY NIMESHA',
	admin: 'CREATED BY NIMESHA',
	botAdmin: 'NIMESHA MADHUSHAN',
	group: 'Gunakan Di Group!',
	private: 'Gunakan Di Privat Chat!',
	limit: 'Limit Anda Telah Habis!',
	prem: 'Khusus User Premium!',
	wait: 'Loading...',
	error: 'Error!',
	done: 'Done'
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

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)

});


