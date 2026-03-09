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

// Check if system command exists
function commandExists(cmd) {
    try {
        execSync(`which ${cmd}`, { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// Get installation commands for OS
function getInstallCommands(osInfo, packages) {
    const cmds = {
        termux: {
            update: 'pkg update -y',
            install: `pkg install -y ${packages.join(' ')}`
        },
        ubuntu: {
            update: 'apt update',
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        wsl: {
            update: 'apt update',
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        macos: {
            update: 'brew update',
            install: `brew install ${packages.join(' ')}`
        },
        linux: {
            update: 'apt update',
            install: `sudo apt install -y ${packages.join(' ')}`
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
        log.info(`කරුණාකර install Node.js ඉල්ලන්න.`);
        
        const commands = getInstallCommands(osInfo, ['nodejs', 'npm']);
        log.info(`\nස්ථාපන විධාන:\n  ${commands.update}\n  ${commands.install}`);
        
        process.exit(1);
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
        const maxAttempts = 3;

        while (!installSuccess && attempts < maxAttempts) {
            attempts++;
            try {
                log.header(`📥 කරමින්: npm install (උත්සාහය ${attempts}/${maxAttempts})`);
                
                // Clear npm cache before install
                if (attempts > 1) {
                    try {
                        execSync('npm cache clean --force', {
                            stdio: 'pipe',
                            cwd: __dirname
                        });
                        log.info('npm කෑෂ් ඉවත් කරන ලදී');
                        
                        // Remove lock file on retry
                        const lockPath = path.join(__dirname, 'package-lock.json');
                        if (fs.existsSync(lockPath)) {
                            fs.unlinkSync(lockPath);
                            log.info('package-lock.json ඉවත් කරන ලදී');
                        }
                    } catch (e) {
                        // Continue anyway
                    }
                }
                
                execSync('npm install --prefer-offline --no-audit --legacy-peer-deps --force', {
                    stdio: 'inherit',
                    cwd: __dirname
                });

                installSuccess = true;
                log.success('සියළුම NPM පැකේජ ලබාගන්නා ලදි!');
            } catch (e) {
                log.error(`npm ලබාගැනීම අසාර්ථකයි! (උත්සාහය ${attempts}/${maxAttempts})`);
                
                if (attempts < maxAttempts) {
                    log.info(`${3 - attempts} උත්සාහ ඉතිරි ඇත... 3 තත්පර කින්නෙ නැවත උත්සාහ කරමින්`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                } else {
                    log.error('උපරිම ස්ථාපන උත්සාහ ඉවසා ගිහින්!');
                    log.info('කරුණාකර manual ලෙස ස්ථාපනය උත්සාහ කරන්න:\n  npm install');
                    process.exit(1);
                }
            }
        }
    } else {
        log.success('දැනටමත් සියලුම npm ලබාගෙන ඇත!');
    }

    // Check system dependencies and auto-install if missing
    log.header('🔧 system පරීක්ෂා කරමින්');
    
    const systemDeps = {
        'ffmpeg': 'media processing',
        'python3': 'python3 scripts',
        'curl': 'http requests',
        'git': 'version control'
    };

    let missingSystemDeps = [];

    for (const [cmd, desc] of Object.entries(systemDeps)) {
        if (commandExists(cmd)) {
            console.log(`  ${chalk.green('✓')} ${cmd.padEnd(12)} - ${desc}`);
        } else {
            console.log(`  ${chalk.red('✗')} ${cmd.padEnd(12)} - ${desc}`);
            missingSystemDeps.push(cmd);
        }
    }

    // Auto-install missing system dependencies
    if (missingSystemDeps.length > 0) {
        log.warn(`Missing system dependencies: ${missingSystemDeps.join(', ')}`);
        
        const installCmds = getInstallCommands(osInfo, missingSystemDeps);
        
        console.log(`\n${chalk.cyan(`${osInfo.display} - ස්ථාපන උත්සාහ කරමින්:`)}`);
        console.log(`  ${chalk.yellow(installCmds.update)}`);
        console.log(`  ${chalk.yellow(installCmds.install)}\n`);
        
        let systemInstallSuccess = false;
        let sysAttempts = 0;
        const maxSysAttempts = 2;
        
        while (!systemInstallSuccess && sysAttempts < maxSysAttempts) {
            sysAttempts++;
            try {
                // Try to update and install
                if (osInfo.type !== 'macos') {
                    try {
                        execSync(installCmds.update, { stdio: 'inherit' });
                    } catch (e) {
                        log.warn('පැකේජ සඳහා update අසාර්ථකයි, ස්ථාපනය උත්සාහ කරමින්...');
                    }
                }
                
                execSync(installCmds.install, { stdio: 'inherit' });
                
                systemInstallSuccess = true;
                log.success('පද්ධති අවශ්‍යතා සාර්ථකව ස්ථාපනය කරන ලදී!');
            } catch (e) {
                if (sysAttempts < maxSysAttempts) {
                    log.warn(`පද්ධති ස්ථාපනය උත්සාහය ${sysAttempts} අසාර්ථකයි, නැවත උත්සාහ කරමින්...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    log.warn('⚠️  පද්ධති අවශ්‍යතා ස්ථාපනය අසාර්ථකයි!');
                    log.info('කරුණාකර මෙම විධාන manual ලෙස ධාවනය කරන්න:');
                    console.log(`  ${chalk.cyan(installCmds.update)}`);
                    console.log(`  ${chalk.cyan(installCmds.install)}`);
                    
                    if (osInfo.type === 'termux') {
                        log.info('\nTermux සඳහා විශේෂයි:');
                        console.log(`  ${chalk.cyan('pkg update -y')}`);
                        console.log(`  ${chalk.cyan(`pkg install -y ${missingSystemDeps.join(' ')}`)}`);
                        log.warn('\nTermux sudo නැති බැවින් නිවැරදි command භාවිතා කරන්න!');
                    }
                }
            }
        }
    } else {
        log.success('සියලුම පද්ධති අවශ්‍යතා හමු විය!');
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
