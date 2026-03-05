const fs = require('fs')
const chalk = require('chalk');
const moment = require('moment-timezone');
const { pickRandom } = require('./function');

async function setTemplateMenu(naze, type, m, prefix, setv, db, options = {}) {
	// කාල කලාපය ලංකාවට (Asia/Colombo) සකස් කර ඇත
	const hari = moment.tz('Asia/Colombo').locale('id').format('dddd');
	const tanggal = moment.tz('Asia/Colombo').locale('id').format('DD/MM/YYYY');
	const jam = moment.tz('Asia/Colombo').locale('id').format('HH:mm:ss');

	// වේලාව අනුව සුබපැතුම් සිංහලට
	const ucapanWaktu = jam < '05:00:00' ? 'සුබ අලුයමක් 🌉' : jam < '11:00:00' ? 'සුබ උදෑසනක් 🌄' : jam < '15:00:00' ? 'සුබ මධ්‍යහ්නයක් 🏙' : jam < '18:00:00' ? 'සුබ සන්ධ්‍යාවක් 🌅' : jam < '19:00:00' ? 'සුබ සන්ධ්‍යාවක් 🌃' : jam < '23:59:00' ? 'සුබ රාත්‍රියක් 🌌' : 'සුබ රාත්‍රියක් 🌌';
	
	let total = Object.entries(db.hit).sort((a, b) => b[1] - a[1]).slice(0, Math.min(7, Object.keys(db.hit).length)).filter(([command]) => command !== 'totalcmd' && command !== 'todaycmd').slice(0, 5);
	
	let text = `╭──❍「 *ප්‍රධාන මෙනුව* 」❍\n`
	
	if (total && total.length >= 5) {
		total.forEach(([command, hit], index) => {
			text += `│${setv} ${prefix}${command}: භාවිතා වාර ${hit}\n`
		})
		text += '╰──────❍'
	} else text += `│${setv} ${prefix}ai
│${setv} ${prefix}brat
│${setv} ${prefix}tiktok
│${setv} ${prefix}cekmati
│${setv} ${prefix}susunkata
╰──────❍`

	if (type == 1 || type == 'buttonMessage') {
		await naze.sendButtonMsg(m.chat, {
			text: `හලෝ @${m.sender.split('@')[0]}\n` + text,
			footer: ucapanWaktu,
			mentions: [m.sender],
			contextInfo: {
				forwardingScore: 10,
				isForwarded: true,
			},
			buttons: [{
				buttonId: `${prefix}allmenu`,
				buttonText: { displayText: 'සියලුම මෙනු' },
				type: 1
			},{
				buttonId: `${prefix}sc`,
				buttonText: { displayText: 'මූලාශ්‍ර කේත (SC)' },
				type: 1
			}]
		}, { quoted: m })
	} else if (type == 2 || type == 'listMessage') {
		await naze.sendButtonMsg(m.chat, {
			text: `හලෝ @${m.sender.split('@')[0]}\n` + text,
			footer: ucapanWaktu,
			mentions: [m.sender],
			contextInfo: {
				forwardingScore: 10,
				isForwarded: true,
			},
			buttons: [{
				buttonId: `${prefix}allmenu`,
				buttonText: { displayText: 'සියලුම මෙනු' },
				type: 1
			},{
				buttonId: `${prefix}sc`,
				buttonText: { displayText: 'මූලාශ්‍ර කේත (SC)' },
				type: 1
			}, {
				buttonId: 'list_button',
				buttonText: { displayText: 'ලැයිස්තුව (List)' },
				nativeFlowInfo: {
					name: 'single_select',
					paramsJson: JSON.stringify({
						title: 'මෙනු තෝරන්න',
						sections: [{
							title: 'ප්‍රධාන ලැයිස්තුව',
							rows: [
								{ title: 'සියලුම මෙනු', id: `${prefix}allmenu` },
								{ title: 'බොට් මෙනු', id: `${prefix}botmenu` },
								{ title: 'ගෲප් මෙනු', id: `${prefix}groupmenu` },
								{ title: 'සෙවුම් මෙනු', id: `${prefix}searchmenu` },
								{ title: 'ඩවුන්ලෝඩ් මෙනු', id: `${prefix}downloadmenu` },
								{ title: 'උපුටා ගැනීම්', id: `${prefix}quotesmenu` },
								{ title: 'මෙවලම් මෙනු', id: `${prefix}toolsmenu` },
								{ title: 'AI මෙනු', id: `${prefix}aimenu` },
								{ title: 'ස්ටෝකර් මෙනු', id: `${prefix}stalkermenu` },
								{ title: 'සසම්භාවී මෙනු', id: `${prefix}randommenu` },
								{ title: 'ඇනිමෙ මෙනු', id: `${prefix}animemenu` },
								{ title: 'ක්‍රීඩා මෙනු', id: `${prefix}gamemenu` },
								{ title: 'විනෝද මෙනු', id: `${prefix}funmenu` },
								{ title: 'අයිතිකරු මෙනු', id: `${prefix}ownermenu` }
							]
						}]
					})
				},
				type: 2
			}]
		}, { quoted: m })
	} else if (type == 3 || type == 'documentMessage') {
		let profile
		const { owner, my, fake } = options;
		try {
			profile = await naze.profilePictureUrl(m.sender, 'image');
		} catch (e) {
			profile = 'https://qu.ax/SQuX.jpg'
		}
		const menunya = `
╭──❍「 *පරිශීලක තොරතුරු* 」❍
├ *නම* : ${m.pushName ? m.pushName : 'නමක් නැත'}
├ *ID* : @${m.sender.split('@')[0]}
├ *තත්ත්වය* : ${options.isVip ? 'VIP' : options.isPremium ? 'ප්‍රීමියම්' : 'නොමිලේ'}
├ *ලිමිට්* : ${options.isVip ? 'අසීමිත' : db.users[m.sender].limit }
├ *මුදල්* : ${db.users[m.sender] ? db.users[m.sender].money.toLocaleString('en-US') : '0'}
╰─┬────❍
╭─┴─❍「 *බොට් තොරතුරු* 」❍
├ *බොට් නම* : ${db?.set?.[options.botNumber]?.botname || 'Naze Bot'}
├ *බලය ගැන්වීම* : @${'0@s.whatsapp.net'.split('@')[0]}
├ *අයිතිකරු* : @${owner[0].split('@')[0]}
├ *මාදිලිය* : ${naze.public ? 'පොදු (Public)' : 'පෞද්ගලික (Self)'}
├ *ප්‍රීෆික්ස්* :${db.set[options.botNumber].multiprefix ? '「 MULTI-PREFIX 」' : ' *'+prefix+'*' }
╰─┬────❍
╭─┴─❍「 *වෙනත් තොරතුරු* 」❍
├ *දිනය* : ${tanggal}
├ *දිනය (නම)* : ${hari}
├ *වේලාව* : ${jam}
╰──────❍\n`
		await m.reply({
			document: fake.docs,
			fileName: ucapanWaktu,
			mimetype: pickRandom(fake.listfakedocs),
			fileLength: '100000000000000',
			pageCount: '999',
			caption: menunya + text,
			contextInfo: {
				mentionedJid: [m.sender, '0@s.whatsapp.net', owner[0] + '@s.whatsapp.net'],
				forwardingScore: 10,
				isForwarded: true,
				forwardedNewsletterMessageInfo: {
					newsletterJid: my.ch,
					serverMessageId: null,
					newsletterName: 'වැඩි විස්තර සඳහා එක්වන්න'
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
		// වීඩියෝ මෙනු මෙතැනට එක් කළ හැක
	} else {
		m.reply(`${ucapanWaktu} @${m.sender.split('@')[0]}\nකරුණාකර ${prefix}allmenu භාවිතා කර\nසියලුම මෙනු පරීක්ෂා කරන්න.`)
	}
}

module.exports = setTemplateMenu;

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});
