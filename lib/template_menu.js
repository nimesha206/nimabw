const fs = require('fs')
const chalk = require('chalk');
const moment = require('moment-timezone ');
const { pickRandom } = require('./function');

async function setTemplateMenu(naze, type, m, prefix, setv, db, options = {}) {
	const hari = moment.tz('Asia/Colombo').locale('id').format('dddd');
	const tanggal = moment.tz('Asia/Colombo').locale('id').format('DD/MM/YYYY ');
	const jam = moment.tz('Asia/Colombo').locale('id').format('HH:mm:ss ');
	const ucapanWaktu = jam < '05:00:00' ? 'සුභ උදෑසනක් 🌉 ' : jam < '11:00:00' ? 'සුභ උදෑසනක් 🌄 ' : jam < '15:00:00' ? 'සුබ සන්ධ්‍යාවක් 🏙 ' : jam < '18:00:00' ? 'සුබ සන්ධ්‍යාවක් 🌅 ' : jam < '19:00:00' ? 'සුබ සන්ධ්‍යාවක් 🌃 ' : jam < '23:59:00' ? 'සුබ රාත්‍රියක් 🌌 ' : 'සුබ රාත්‍රියක් 🌌 ';
	
	let total = Object.entries(db.hit).sort((a, b) => b[1] - a[1]).slice(0, Math.min(7, Object.keys(db.hit).length)).filter(([command]) => command !== 'totalcmd' && command !== 'todaycmd').slice(0, 5);
	
	let text = `╭──❍「 *ඉහළම මෙනුව* 」❍\n `
	
	if (total && total.length >= 5) {
		total.forEach(([command, hit], index) => {
			text += `│${setv} ${prefix}${command}: ${hit} හිට්ස්\n `
		})
		text += '╰──────❍ '
	} else text += `│${setv} ${prefix}ai
│${setv} ${prefix}brat
│${setv} ${prefix}tiktok
│${setv} ${prefix}cekmati
│${setv} ${prefix}susunkata
╰──────❍  `

	if (type == 1 || type == 'buttonMessage') {
		await naze.sendButtonMsg(m.chat, {
			text: `හලො @${m.sender.split('@')[0]}\n ` + text,
			footer: ucapanWaktu,
			mentions: [m.sender],
			contextInfo: {
				forwardingScore: 10,
				isForwarded: true,
			},
			buttons: [{
				buttonId: `${prefix}allmenu `,
				buttonText: { displayText: 'allmenu' },
				type: 1
			},{
				buttonId: `${prefix}sc `,
				buttonText: { displayText: 'SC' },
				type: 1
			}]
		}, { quoted: m })
	} else if (type == 2 || type == 'listMessage') {
		await naze.sendButtonMsg(m.chat, {
			text: `Halo @${m.sender.split('@')[0]}\n ` + text,
			footer: ucapanWaktu,
			mentions: [m.sender],
			contextInfo: {
				forwardingScore: 10,
				isForwarded: true,
			},
			buttons: [{
				buttonId: `${prefix}allmenu `,
				buttonText: { displayText: 'allmenu' },
				type: 1
			},{
				buttonId: `${prefix}sc `,
				buttonText: { displayText: 'SC' },
				type: 1
			}, {
				buttonId: 'list_button',
				buttonText: { displayText: 'list' },
				nativeFlowInfo: {
					name: 'single_select',
					paramsJson: JSON.stringify({
						title: 'listmenu',
						sections: [{
							title: 'listmenu',
							rows: [{
								title: 'සියළ්උම මෙනුව',
								id: `${prefix}allmenu `
							},{
								title: 'බොට් මෙනුව ',
								id: `${prefix}botmenu `
							},{
								title: 'කණ්ඩායම් මෙනුව ',
								id: `${prefix}groupmenu `
							},{
								title: 'සෙවුම් මෙනුව ',
								id: `${prefix}සෙවුම් මෙනුව `
							},{
								title: 'මෙනුව බාගන්න ',
								id: `${prefix}බාගැනීම් මෙනුව `
							},{
								title: 'උපුටා දැක්වීම් මෙනුව ',
								id: `${prefix}quotesmenu `
							},{
								title: 'මෙවලම් මෙනුව ',
								id: `${prefix}toolsmenu `
							},{
								title: 'Ai Menu ',
								id: `${prefix}aimenu `
							},{
								title: 'ස්ටාකර් මෙනුව ',
								id: `${prefix}stalkermenu `
							},{
								title: 'අහඹු මෙනුව ',
								id: `${prefix}randommenu `
							},{
								title: 'සජීවිකරණ මෙනුව ',
								id: `${prefix}animemenu `
							},{
								title: 'ක්‍රීඩා මෙනුව ',
								id: `${prefix}gamemenu `
							},{
								title: 'විනෝද මෙනුව ',
								id: `${prefix}funmenu `
							},{
								title: 'හිමිකරු මෙනුව ',
								id: `${prefix}ownermenu `
							}]
						}]
					})
				},
				type: 2
			}]
		}, { quoted: m })
	} else if (type == 3 || type == 'documentMessage') {
		let profile
		try {
			profile = await naze.profilePictureUrl(m.sender, 'image');
		} catch (e) {
			profile = fake.anonim
		}
		const menunya = `╭──❍「 *පරිශීලක තොරතුරු* 」❍
├ *නම* : ${m.pushName ?m.pushName : 'තන්ප නම'}
├ *Id* : @${m.sender.split('@')[0]}
├ *පරිශීලක* : ${options.isVip ?'VIP': options.isPremium ?'ප්‍රිමියම්' : 'නොමිලේ'}
├ *සීමාව* : ${options.isVip ?'VIP' : db.users[m.sender].limit }
├ *Uang* : ${db.users[m.sender] ?db.users[m.sender].money.toLocaleString('id-ID') : '0'}
╰─┬────❍
╭─┴─❍「 *BOT තොරතුරු* 」❍
├ *නාම බොට්* : ${db?.set?.[options.botNumber]?.botname ||'Naz Bot'}
├ *බලගැන්වූ* : @${'0@s.whatsapp.net  '.split('@')[0]}
├ *හිමිකරු* : @${owner[0].split('@')[0]}
├ *ප්‍රකාරය* : ${naze.public ?'පොදු' : 'ස්වයං'}
├ *උපසර්ගය* :${db.set[options.botNumber].multiprefix ?'「 බහු-උපසර්ගය 」' : ' *'+උපසර්ගය+'*'}
╰─┬────❍
╭─┴─❍「 *ගැන* 」❍
├ *Tanggal* : ${tanggal}
├ *හරි* : ${hari}
├ *ජෑම්* : ${jam} WIB
╰──────❍ \n `
		await m.reply({
			document: fake.docs,
			fileName: ucapanWaktu,
			mimetype: pickRandom(fake.listfakedocs),
			fileLength: '100000000000000',
			pageCount: '999',
			caption: menunya + text,
			contextInfo: {
				mentionedJid: [m.sender, '0@s.whatsapp.net  ', owner[0] + '@s.whatsapp.net '],
				forwardingScore: 10,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterJid: my.ch,
					serverMessageId: null,
					newsletterName: 'වැඩි විස්තර සඳහා එක්වන්න '
				},
				externalAdReply: {
					title: options.author,
					body: options.packname,
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
	} else if (type == 4 || type == 'videoMessage') {
		//tambahin sendiri :v
	} else {
		m.reply(`${speechTime} @${m.sender.split('@')[0]}\nසියලු මෙනු  බැලීමට ${prefix}allmenu \n භාවිතා කරන්න`)
	}
}

module.exports = setTemplateMenu;

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`${__filename}  යාවත්කාලීන කරන්න`))
	delete require.cache[file]
	require(file)
});
