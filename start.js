const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

function start() {
	let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)]
	let p = spawn(process.argv[0], args, {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc']
	}).on('message', data => {
		if (data === 'reset') {
			console.log(chalk.yellow.bold('[BOT] නැවත පණ ගන්වමින් පවතී...'))
			p.kill()
			start()
		} else if (data === 'uptime') {
			p.send(process.uptime())
		}
	}).on('exit', code => {
		if (code !== 0) {
			console.error(chalk.red.bold(`[BOT] දෝෂ කේතය ${code} සමඟ ක්‍රියාවලිය නැවතුණි. නැවත ආරම්භ කරමින්...`))
			start()
		} else {
			console.log(chalk.green.bold('[BOT] ක්‍රියාවලිය සාර්ථකව අවසන් විය. සමුගනිමු!'))
			process.exit(0)
		}
	})
}
start()
