const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

// ═══════════════════════════════════════════════════════════
// 🤖 සියලුම platform හරියනවා
// Termux, Ubuntu, VPS, Windows(WSL), macOS
// ═══════════════════════════════════════════════════════════

// Color functions
const log = {
    info: (msg) => console.log(`${chalk.cyan('ℹ')} ${msg}`),
    success: (msg) => console.log(`${chalk.green('✓')} ${msg}`),
    error: (msg) => console.log(`${chalk.red('✗')} ${msg}`),
    warn: (msg) => console.log(`${chalk.yellow('⚠')} ${msg}`),
    header: (msg) => console.log(`\n${chalk.bold.blue('═══════════════════════════════════')}\n${chalk.bold.cyan(msg)}\n${chalk.bold.blue('═══════════════════════════════════')}\n`)
};

// Detect OS Type
function detectOS() {
    const platform = os.platform();
    const release = os.release();
    
    // Check if Termux
    const isTermux = fs.existsSync('/system/build.prop') || fs.existsSync('/data/data/com.termux');
    
    if (isTermux) {
        return {
            type: 'termux',
            display: 'Termux (Android)',
            pm: 'pkg', // Updated to pkg
            pmAlternate: 'apt'
        };
    }
    
    // Check if Ubuntu/Debian
    if (platform === 'linux') {
        if (fs.existsSync('/etc/lsb-release') || fs.existsSync('/etc/debian_version')) {
            // Check if running in WSL
            const isWSL = release.toLowerCase().includes('microsoft') || fs.existsSync('/proc/version') && 
                         fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
            
            if (isWSL) {
                return {
                    type: 'wsl',
                    display: 'Windows WSL (Ubuntu)',
                    pm: 'apt',
                    pmAlternate: 'apt-get'
                };
            }
            
            return {
                type: 'ubuntu',
                display: 'Ubuntu/Debian/VPS',
                pm: 'apt',
                pmAlternate: 'apt-get'
            };
        }
    }
    
    // Check if macOS
    if (platform === 'darwin') {
        return {
            type: 'macos',
            display: 'macOS',
            pm: 'brew',
            pmAlternate: 'homebrew'
        };
    }
    
    // Default to Linux
    return {
        type: 'linux',
        display: 'Linux (Generic)',
        pm: 'apt',
        pmAlternate: 'apt-get'
    };
}

// Check if package installed
function checkPackageInstalled(packageName) {
    try {
        require.resolve(packageName);
        return true;
    } catch (e) {
        return false;
    }
}

// Check if npm is installed
function checkNpmInstalled() {
    try {
        execSync('npm --version', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// Check if command exists
function commandExists(cmd) {
    try {
        execSync(`which ${cmd}`, { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// Try to install ffmpeg with multiple methods
async function installFFmpeg(osInfo) {
    const installCmds = getInstallCommands(osInfo, ['ffmpeg']);
    const allMethods = installCmds.methods || [];

    log.info(`\n${allMethods.length} ffmpeg ස්ථාපන ක්‍රම උත්සාහ කරමින්...\n`);

    for (let i = 0; i < allMethods.length; i++) {
        const method = allMethods[i];
        try {
            log.info(`\n[${i + 1}/${allMethods.length}] ${chalk.yellow(method.desc)} ක්‍රම:`);
            log.info(`Command: ${chalk.cyan(method.cmd)}`);
            execSync(method.cmd, { stdio: 'inherit' });
            
            // Verify installation
            if (commandExists('ffmpeg')) {
                log.success(`\n✓ ffmpeg සාර්ථකව ස්ථාපනය කරන ලදී! (${method.desc})\n`);
                return true;
            }
        } catch (e) {
            log.warn(`✗ ${method.desc} අසාර්ථකයි, ඉන්දැයි ඉදිරි ක්‍රම උත්සාහ කරමින්...`);
        }
    }
    
    return false;
}

// Get installation commands for OS with multiple fallback options
function getInstallCommands(osInfo, packages) {
    const pkg = packages[0]; // For ffmpeg specific handling
    
    const cmds = {
        termux: {
            methods: [
                { cmd: `pkg update -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg' },
                { cmd: `apt update -y && apt install -y ${packages.join(' ')}`, desc: 'apt' },
                { cmd: `pkg upgrade -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg upgrade' }
            ]
        },
        ubuntu: {
            methods: [
                { cmd: `sudo apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt' },
                { cmd: `sudo apt-get update && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get' },
                { cmd: `sudo apt update && sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade' },
                { cmd: `sudo snap install ${pkg}`, desc: 'snap' }
            ]
        },
        wsl: {
            methods: [
                { cmd: `sudo apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt' },
                { cmd: `sudo apt-get update && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get' },
                { cmd: `sudo apt update && sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade' },
                { cmd: `sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys && sudo apt install -y ${packages.join(' ')}`, desc: 'apt with key fix' },
                { cmd: `winget install -e --id Gyan.FFmpeg`, desc: 'winget' }
            ]
        },
        macos: {
            methods: [
                { cmd: `brew update && brew install ${packages.join(' ')}`, desc: 'brew' },
                { cmd: `brew upgrade && brew install ${packages.join(' ')}`, desc: 'brew upgrade' },
                { cmd: `sudo port selfupdate && sudo port install ${pkg}`, desc: 'macports' },
                { cmd: `curl https://evermeet.cx/ffmpeg/getrelease/zip -o ffmpeg.zip && unzip ffmpeg.zip && sudo mv ffmpeg /usr/local/bin/`, desc: 'official build' }
            ]
        },
        linux: {
            methods: [
                { cmd: `sudo apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt' },
                { cmd: `sudo apt-get update && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get' },
                { cmd: `sudo apt update && sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade' },
                { cmd: `sudo yum update -y && sudo yum install -y ${packages.join(' ')}`, desc: 'yum' },
                { cmd: `sudo pacman -Sy && sudo pacman -S --noconfirm ${packages.join(' ')}`, desc: 'pacman' },
                { cmd: `sudo dnf update -y && sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf' },
                { cmd: `sudo zypper refresh && sudo zypper install -y ${packages.join(' ')}`, desc: 'zypper' },
                { cmd: `sudo xbps-install -Su && sudo xbps-install -y ${packages.join(' ')}`, desc: 'xbps' }
            ]
        }
    };
    
    return cmds[osInfo.type] || cmds.linux;
}

// Auto install missing packages with retry logic
async function autoInstallDependencies() {
    const osInfo = detectOS();
    
    log.header(`🤖 🌸MISS SHASIKALA START කරමින්\n${chalk.yellow(`Platform: ${osInfo.display}`)}`);

    // Check npm
    if (!checkNpmInstalled()) {
        log.error('npm හමු නොවුණි!');
        log.info(`Node.js ස්ථාපනය කරමින්...\n`);
        
        const osInfo = detectOS();
        let npmInstalled = false;
        
        // Try to install Node.js with multiple methods
        const nodeMethods = {
            termux: [
                'pkg update -y && pkg install -y nodejs',
                'apt update -y && apt install -y nodejs'
            ],
            ubuntu: [
                'sudo apt update && sudo apt install -y nodejs npm',
                'sudo apt-get update && sudo apt-get install -y nodejs npm',
                'sudo snap install node --classic'
            ],
            wsl: [
                'sudo apt update && sudo apt install -y nodejs npm',
                'winget install OpenJS.NodeJS'
            ],
            macos: [
                'brew update && brew install node',
                'sudo port install nodejs20'
            ],
            linux: [
                'sudo apt update && sudo apt install -y nodejs npm',
                'sudo yum install -y nodejs npm',
                'sudo pacman -Sy nodejs npm',
                'sudo dnf install -y nodejs npm'
            ]
        };
        
        const methods = nodeMethods[osInfo.type] || nodeMethods.linux;
        
        for (const cmd of methods) {
            try {
                log.info(`උත්සාහ කරමින්: ${chalk.cyan(cmd)}`);
                execSync(cmd, { stdio: 'inherit' });
                if (checkNpmInstalled()) {
                    log.success('Node.js සාර්ථකව ස්ථාපනය කරන ලදී!');
                    npmInstalled = true;
                    break;
                }
            } catch (e) {
                log.warn('මෙම ක්‍රම අසාර්ථකයි, ඉන්දැයි නැවත උත්සාහ කරමින්...');
            }
        }
        
        if (!npmInstalled) {
            log.error('Node.js ස්ථාපනය කිරීමට අසාර්ථකයි!');
            process.exit(1);
        }
    }

    log.success('npm හමු විය!');

    // Check package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log.error(`package.json හමු නොවුණි! (${packageJsonPath})`);
        process.exit(1);
    }

    // Read package.json
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (e) {
        log.error('package.json ලබාගැනීම කිරීමට අසාර්ථකයි: ' + e.message);
        process.exit(1);
    }

    const dependencies = packageJson.dependencies || {};
    const dependencyNames = Object.keys(dependencies);

    log.info(`සියලුම npm පැකේජ ඉල්ලමින්: ${chalk.yellow(dependencyNames.length)}`);

    // Check each dependency
    let missingPackages = [];
    let installedCount = 0;

    console.log('\n📦 npm පැකේජ සොයමින්...\n');

    for (const pkg of dependencyNames) {
        if (checkPackageInstalled(pkg)) {
            console.log(`  ${chalk.green('✓')} ${pkg}`);
            installedCount++;
        } else {
            console.log(`  ${chalk.red('✗')} ${pkg}`);
            missingPackages.push(pkg);
        }
    }

    console.log(`\n${chalk.cyan('Installed:')} ${installedCount}/${dependencyNames.length}`);

    // If missing packages found, install them with multiple retry attempts
    if (missingPackages.length > 0) {
        log.warn(`${missingPackages.length} නැතිවූ NPM පැකේජ හමු උණි!`);
        console.log(`\nMissing:\n${missingPackages.map(p => `  • ${chalk.yellow(p)}`).join('\n')}\n`);

        log.info('ලබාගැනීම ආරම්භ කරයි...\n');

        let installSuccess = false;
        let attempts = 0;
        const maxAttempts = 5;
        
        const npmMethods = [
            'npm install --prefer-offline --no-audit --legacy-peer-deps --force',
            'npm install --legacy-peer-deps',
            'npm install --force',
            'npm ci --legacy-peer-deps',
            'rm -rf node_modules package-lock.json && npm install'
        ];

        while (!installSuccess && attempts < maxAttempts) {
            attempts++;
            try {
                log.header(`📥 npm install උත්සාහය ${attempts}/${maxAttempts}`);
                
                // Clean up before each attempt
                if (attempts > 1) {
                    try {
                        execSync('npm cache clean --force', {
                            stdio: 'pipe',
                            cwd: __dirname
                        });
                        log.info('npm කෑෂ් ඉවත් කරන ලදී');
                    } catch (e) {}
                }
                
                const method = npmMethods[attempts - 1] || npmMethods[npmMethods.length - 1];
                log.info(`ක්‍රම: ${chalk.cyan(method)}`);
                
                execSync(method, {
                    stdio: 'inherit',
                    cwd: __dirname
                });

                installSuccess = true;
                log.success('සියළුම NPM පැකේජ ලබාගන්නා ලදි!');
            } catch (e) {
                log.error(`උත්සාහය ${attempts} අසාර්ථකයි`);
                
                if (attempts < maxAttempts) {
                    log.info(`${maxAttempts - attempts} උත්සාහ ඉතිරි ඇත... නැවත උත්සාහ කරමින්...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    log.error('උපරිම ස්ථාපන උත්සාහ ඉවසා ගිහින්!');
                    log.error('npm packages install කිරීමට අසාර්ථකයි!');
                    process.exit(1);
                }
            }
        }
    } else {
        log.success('දැනටමත් සියලුම npm ලබාගෙන ඇත!');
    }

    // Check system dependencies and auto-install if missing
    log.header('🔧 system පරීක්ෂා කරමින්');
    
    const mandatorySysDeps = ['ffmpeg']; // ffmpeg is mandatory
    const optionalSysDeps = {
        'python3': 'python3 scripts',
        'curl': 'http requests',
        'git': 'version control'
    };

    let missingMandatory = [];
    let missingOptional = [];

    // Check mandatory dependencies
    for (const cmd of mandatorySysDeps) {
        if (commandExists(cmd)) {
            console.log(`  ${chalk.green('✓')} ${cmd.padEnd(12)} - අනිවාර්ය`);
        } else {
            console.log(`  ${chalk.red('✗')} ${cmd.padEnd(12)} - අනිවාර්ය`);
            missingMandatory.push(cmd);
        }
    }

    // Check optional dependencies
    for (const [cmd, desc] of Object.entries(optionalSysDeps)) {
        if (commandExists(cmd)) {
            console.log(`  ${chalk.green('✓')} ${cmd.padEnd(12)} - ${desc}`);
        } else {
            console.log(`  ${chalk.red('✗')} ${cmd.padEnd(12)} - ${desc}`);
            missingOptional.push(cmd);
        }
    }

    // Handle missing mandatory dependencies
    if (missingMandatory.length > 0) {
        log.error(`\n❌ අනිවාර්ය දෙයක් නැතිවුණි: ${missingMandatory.join(', ')}`);
        
        const installCmds = getInstallCommands(osInfo, missingMandatory);
        
        // Check if running as root in Termux
        const isRoot = process.getuid && process.getuid() === 0;
        
        if (osInfo.type === 'termux' && isRoot) {
            log.error('⚠️  Termux එකෙ root user එකින් pkg install කරන්න බැරි!');
            log.info('කරුණාකර regular user එකින් ධාවනය කරන්න:');
            console.log(`  ${chalk.cyan('pkg update -y && pkg install -y ' + missingMandatory.join(' '))}`);
            process.exit(1);
        } else {
            console.log(`\n${chalk.cyan(`${osInfo.display} - අනිවාර්ය dependencies ස්ථාපනය කරමින්:`)}`);
            console.log(`  ${chalk.yellow(installCmds.update)}`);
            console.log(`  ${chalk.yellow(installCmds.install)}\n`);
            
            let mandatoryInstallSuccess = false;
            
            // Try with ffmpeg specific installation function
            if (missingMandatory.includes('ffmpeg')) {
                log.header('📥 ffmpeg ස්ථාපනය - සියලුම ක්‍රම උත්සාහ කරමින්');
                mandatoryInstallSuccess = await installFFmpeg(osInfo);
            } else {
                // For other mandatory dependencies
                let mandAttempts = 0;
                const maxMandAttempts = 3;
                
                while (!mandatoryInstallSuccess && mandAttempts < maxMandAttempts) {
                    mandAttempts++;
                    try {
                        if (osInfo.type !== 'macos') {
                            try {
                                log.info(`උත්සාහය ${mandAttempts}: පැකේජ update කරමින්...`);
                                execSync(installCmds.update, { stdio: 'inherit' });
                            } catch (e) {
                                log.warn('පැකේජ සඳහා update අසාර්ථකයි, ස්ථාපනය උත්සාහ කරමින්...');
                            }
                        }
                        
                        log.info(`උත්සාහය ${mandAttempts}: ${missingMandatory.join(', ')} ස්ථාපනය කරමින්...`);
                        execSync(installCmds.install, { stdio: 'inherit' });
                        
                        mandatoryInstallSuccess = true;
                        log.success('අනිවාර්ය dependencies සාර්ථකව ස්ථාපනය කරන ලදී!');
                    } catch (e) {
                        if (mandAttempts < maxMandAttempts) {
                            log.warn(`උත්සාහය ${mandAttempts} අසාර්ථකයි, නැවත උත්සාහ කරමින්...`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                }
            }
            
            // If still failed, show all available methods
            if (!mandatoryInstallSuccess) {
                log.error('\n❌ ffmpeg ස්ථාපනය කිරීමට සම්පූර්ණ අසාර්ථකයි!');
                log.error('බොට් ඉදිරිපත් කිරීමට ffmpeg අවශ්‍යය!');
                
                log.info('\n📋 උපලබ්ධ ස්ථාපන ක්‍රම:');
                
                const methods = getInstallCommands(osInfo, ['ffmpeg']);
                console.log(`\n${chalk.yellow('Primary:')}`);
                console.log(`  ${chalk.cyan(methods.install)}`);
                
                if (methods.alternatives && methods.alternatives.length > 0) {
                    console.log(`\n${chalk.yellow('Alternatives:')}`);
                    methods.alternatives.forEach((cmd, idx) => {
                        console.log(`  ${idx + 1}. ${chalk.cyan(cmd)}`);
                    });
                }
                
                if (osInfo.type === 'termux') {
                    console.log(`\n${chalk.yellow('Termux specific:')}`);
                    console.log(`  ${chalk.cyan('pkg update -y && pkg install -y ffmpeg')}`);
                    console.log(`  ${chalk.cyan('apt update && apt install -y ffmpeg')}`);
                }
                
                log.error('\nකරුණාකර ඉහත කරන්සතින් එකක් manual ලෙස ධාවනය කරන්න!');
                process.exit(1);
            }
        }
    }

    // Handle missing optional dependencies (non-blocking)
    if (missingOptional.length > 0) {
        log.warn(`\nවිකල්ප dependencies නැතිවුණි: ${missingOptional.join(', ')}`);
        log.info('සම්පූර්ණ කිරීමට optional dependencies ස්ථාපනය කරන්න (අනිවාර්ය නොවේ).');
        
        const optionalCmds = getInstallCommands(osInfo, missingOptional);
        log.info('Optional install command:');
        console.log(`  ${chalk.yellow(optionalCmds.install)}`);
    }

    log.success('Setup verification complete!');
}

// Main process
async function start() {
    try {
        // Check and install dependencies
        await autoInstallDependencies();

        const osInfo = detectOS();
        log.header(`🚀 MISS SHASIKALA ආරම්භ වෙමින්\n${chalk.yellow(`Platform: ${osInfo.display}`)}`);

        // Start the main application
        let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];
        let p = spawn(process.argv[0], args, {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc']
        }).on('message', data => {
            if (data === 'reset') {
                console.log(chalk.yellow.bold('[BOT] නැවත පණ ගන්වමින් පවතී...'));
                p.kill();
                start();
            } else if (data === 'uptime') {
                p.send(process.uptime());
            }
        }).on('exit', code => {
            if (code !== 0) {
                console.error(chalk.red.bold(`[BOT] දෝෂ කේතය ${code} සමඟ ක්‍රියාවලිය නැවතුණි. නැවත ආරම්භ කරමින්...`));
                setTimeout(() => start(), 3000);
            } else {
                console.log(chalk.green.bold('[BOT] ක්‍රියාවලිය සාර්ථකව අවසන් විය. සමුගනිමු!'));
                process.exit(0);
            }
        });
    } catch (e) {
        log.error('ආරම්භ කිරීම අසාර්ථකයි: ' + e.message);
        console.error(e);
        process.exit(1);
    }
}

// Run
start();
