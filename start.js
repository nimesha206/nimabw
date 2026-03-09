const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

// ═══════════════════════════════════════════════════════════
// 🎵 YouTube Complete Download Methods Auto Installer
// Termux, Ubuntu, VPS, Windows(WSL), macOS
// ═══════════════════════════════════════════════════════════

// වර්ණ ශ්‍රිතයන්
const log = {
    info: (msg) => console.log(`${chalk.cyan('ℹ')} ${msg}`),
    success: (msg) => console.log(`${chalk.green('✓')} ${msg}`),
    error: (msg) => console.log(`${chalk.red('✗')} ${msg}`),
    warn: (msg) => console.log(`${chalk.yellow('⚠')} ${msg}`),
    header: (msg) => console.log(`\n${chalk.bold.blue('═══════════════════════════════════')}\n${chalk.bold.cyan(msg)}\n${chalk.bold.blue('═══════════════════════════════════')}\n`)
};

// 🎵 YouTube Download Methods Package Matrix
const YOUTUBE_METHODS = {
    'yt-dlp': {
        packages: ['yt-dlp', 'python3'],
        methods: [
            'Default (best)',
            'Android Client',
            'WEB Mobile (mweb)',
            'WEB Creator',
            'TV Embedded',
            'iOS Client',
            'VR Client',
            'Studio Client'
        ]
    },
    'youtube-dl': {
        packages: ['youtube-dl', 'python3'],
        methods: ['Python executable', 'Direct URL']
    },
    'ffmpeg': {
        packages: ['ffmpeg'],
        methods: ['Direct stream extraction']
    },
    'spotifydl': {
        packages: ['spotifydl'],
        methods: ['Spotify streaming']
    },
    'curl': {
        packages: ['curl'],
        methods: ['HTTP streaming']
    },
    'wget': {
        packages: ['wget'],
        methods: ['Direct download']
    },
    'aria2c': {
        packages: ['aria2'],
        methods: ['Multi-thread download']
    }
};

// OS වර්ගය හඳුනාගනිමින්
function detectOS() {
    const platform = os.platform();
    const release = os.release();
    
    // Termux නම් පරීක්ෂා කරමින්
    const isTermux = fs.existsSync('/system/build.prop') || fs.existsSync('/data/data/com.termux');
    
    if (isTermux) {
        return {
            type: 'termux',
            display: 'Termux (Android)',
            pm: 'pkg',
            pmAlternate: 'apt'
        };
    }
    
    // Ubuntu/Debian නම් පරීක්ෂා කරමින්
    if (platform === 'linux') {
        if (fs.existsSync('/etc/lsb-release') || fs.existsSync('/etc/debian_version')) {
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
    
    // macOS නම් පරීක්ෂා කරමින්
    if (platform === 'darwin') {
        return {
            type: 'macos',
            display: 'macOS',
            pm: 'brew',
            pmAlternate: 'homebrew'
        };
    }
    
    // Default Linux ලෙස සැලකීම
    return {
        type: 'linux',
        display: 'Linux (Generic)',
        pm: 'apt',
        pmAlternate: 'apt-get'
    };
}

// පැකේජ ස්ථාපනය වුණ නම් පරීක්ෂා කරමින්
function checkPackageInstalled(packageName) {
    try {
        require.resolve(packageName);
        return true;
    } catch (e) {
        return false;
    }
}

// npm ස්ථාපනය වුණ නම් පරීක්ෂා කරමින්
function checkNpmInstalled() {
    try {
        execSync('npm --version', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// විධානය සිටින්නේ නම් පරීක්ෂා කරමින්
function commandExists(cmd) {
    try {
        execSync(`which ${cmd}`, { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════
// 🔧 NODEJS සහ PYTHON AUTO-INSTALL/UPGRADE
// ═══════════════════════════════════════════════════════════

async function autoInstallNodeJS(osInfo) {
    const methods = {
        termux: [
            'pkg update -y && pkg install -y nodejs',
            'apt update -y && apt install -y nodejs',
            'pkg install -y nodejs npm',
            'apt install -y nodejs npm',
        ],
        ubuntu: [
            'sudo apt update && sudo apt install -y nodejs npm',
            'sudo apt-get update && sudo apt-get install -y nodejs npm',
            'sudo snap install node --classic',
            'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs',
        ],
        wsl: [
            'sudo apt update && sudo apt install -y nodejs npm',
            'sudo apt-get update && sudo apt-get install -y nodejs npm',
            'winget install OpenJS.NodeJS',
        ],
        macos: [
            'brew update && brew install node',
            'brew upgrade node',
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash',
        ],
        linux: [
            'sudo apt update && sudo apt install -y nodejs npm',
            'sudo yum install -y nodejs npm',
            'sudo dnf install -y nodejs npm',
            'sudo pacman -S --noconfirm nodejs npm',
        ]
    };

    const cmdList = methods[osInfo.type] || methods.linux;
    
    for (let i = 0; i < cmdList.length; i++) {
        try {
            log.info(`[${i + 1}/${cmdList.length}] Node.js ස්ථාපනය උත්සාහ කරමින්: ${cmdList[i].substring(0, 60)}...`);
            execSync(cmdList[i], { stdio: 'inherit', timeout: 180000 });
            
            if (checkNpmInstalled()) {
                log.success('Node.js සාර්ථකව ස්ථාපනය වුණි!');
                return true;
            }
        } catch (e) {
            log.warn(`උත්සාහය ${i + 1} අසාර්ථකයි...`);
        }
    }
    return false;
}

async function autoInstallPython(osInfo) {
    const methods = {
        termux: [
            'pkg update -y && pkg install -y python',
            'pkg install -y python3',
            'apt update -y && apt install -y python3',
            'apt install -y python3-pip',
        ],
        ubuntu: [
            'sudo apt update && sudo apt install -y python3',
            'sudo apt-get update && sudo apt-get install -y python3',
            'sudo apt install -y python3-pip',
            'sudo apt-get install -y python3-pip',
        ],
        wsl: [
            'sudo apt update && sudo apt install -y python3',
            'winget install Python.Python.3.11',
        ],
        macos: [
            'brew update && brew install python3',
            'brew upgrade python3',
        ],
        linux: [
            'sudo apt update && sudo apt install -y python3',
            'sudo yum install -y python3',
            'sudo dnf install -y python3',
            'sudo pacman -S --noconfirm python',
        ]
    };

    const cmdList = methods[osInfo.type] || methods.linux;
    
    for (let i = 0; i < cmdList.length; i++) {
        try {
            log.info(`[${i + 1}/${cmdList.length}] Python3 ස්ථාපනය උත්සාහ කරමින්: ${cmdList[i].substring(0, 60)}...`);
            execSync(cmdList[i], { stdio: 'inherit', timeout: 180000 });
            
            if (commandExists('python3')) {
                log.success('Python3 සාර්ථකව ස්ථාපනය වුණි!');
                return true;
            }
        } catch (e) {
            log.warn(`උත්සාහය ${i + 1} අසාර්ථකයි...`);
        }
    }
    return false;
}

async function autoUpgradeSystemPackages(osInfo) {
    log.header('📦 System පැකේජ upgrade කරමින්');
    
    const upgradeMethods = {
        termux: [
            'pkg update -y && pkg upgrade -y',
            'apt update -y && apt upgrade -y',
            'apt update && apt full-upgrade -y',
        ],
        ubuntu: [
            'sudo apt update && sudo apt upgrade -y',
            'sudo apt-get update && sudo apt-get upgrade -y',
            'sudo apt update && sudo apt full-upgrade -y',
        ],
        wsl: [
            'sudo apt update && sudo apt upgrade -y',
            'sudo apt-get update && sudo apt-get upgrade -y',
        ],
        macos: [
            'brew update && brew upgrade',
            'softwareupdate -i -a',
        ],
        linux: [
            'sudo apt update && sudo apt upgrade -y',
            'sudo yum update -y',
            'sudo dnf upgrade -y',
            'sudo pacman -Syu --noconfirm',
        ]
    };

    const cmdList = upgradeMethods[osInfo.type] || upgradeMethods.linux;
    
    for (let i = 0; i < cmdList.length; i++) {
        try {
            log.info(`[${i + 1}/${cmdList.length}] System upgrade උත්සාහය...`);
            execSync(cmdList[i], { stdio: 'inherit', timeout: 300000 });
            log.success('System පැකේජ upgrade සාර්ථකයි!');
            return true;
        } catch (e) {
            log.warn(`උත්සාහය ${i + 1} අසාර්ථකයි...`);
        }
    }
    return false;
}

// ═══════════════════════════════════════════════════════════
// 🎵 PACKAGE INSTALL WITH 10 ATTEMPTS FALLBACK
// ═══════════════════════════════════════════════════════════

async function installPackageWithFallback(osInfo, packageName, maxAttempts = 10) {
    const installMethods = {
        termux: [
            () => `pkg update -y && pkg install -y ${packageName}`,
            () => `apt update -y && apt install -y ${packageName}`,
            () => `pip3 install ${packageName}`,
            () => `pip install ${packageName}`,
            () => `apt install -y ${packageName}`,
            () => `pkg install -y ${packageName}`,
            () => `apt upgrade -y && apt install -y ${packageName}`,
            () => `pkg upgrade -y && pkg install -y ${packageName}`,
            () => `apt full-upgrade -y && apt install -y ${packageName}`,
            () => `pip3 install --upgrade ${packageName}`,
        ],
        ubuntu: [
            () => `sudo apt update && sudo apt install -y ${packageName}`,
            () => `sudo apt-get update && sudo apt-get install -y ${packageName}`,
            () => `sudo apt upgrade -y && sudo apt install -y ${packageName}`,
            () => `sudo apt-get upgrade -y && sudo apt-get install -y ${packageName}`,
            () => `pip3 install ${packageName}`,
            () => `sudo pip3 install ${packageName}`,
            () => `pip install ${packageName}`,
            () => `sudo snap install ${packageName}`,
            () => `sudo apt full-upgrade -y && sudo apt install -y ${packageName}`,
            () => `pip3 install --upgrade ${packageName}`,
        ],
        wsl: [
            () => `sudo apt update && sudo apt install -y ${packageName}`,
            () => `sudo apt-get update && sudo apt-get install -y ${packageName}`,
            () => `sudo apt upgrade -y && sudo apt install -y ${packageName}`,
            () => `pip3 install ${packageName}`,
            () => `sudo pip3 install ${packageName}`,
            () => `winget install -e --id ${packageName}`,
            () => `sudo apt full-upgrade -y && sudo apt install -y ${packageName}`,
            () => `pip install ${packageName}`,
            () => `pip3 install --upgrade ${packageName}`,
            () => `sudo dpkg --configure -a && sudo apt install -y ${packageName}`,
        ],
        macos: [
            () => `brew update && brew install ${packageName}`,
            () => `brew upgrade && brew install ${packageName}`,
            () => `brew tap-new local/tools && brew install ${packageName}`,
            () => `pip3 install ${packageName}`,
            () => `pip install ${packageName}`,
            () => `sudo pip3 install ${packageName}`,
            () => `brew update && brew upgrade ${packageName}`,
            () => `pip3 install --upgrade ${packageName}`,
            () => `sudo port install ${packageName}`,
            () => `curl -L https://package.manager | install ${packageName}`,
        ],
        linux: [
            () => `sudo apt update && sudo apt install -y ${packageName}`,
            () => `sudo yum install -y ${packageName}`,
            () => `sudo dnf install -y ${packageName}`,
            () => `sudo pacman -S --noconfirm ${packageName}`,
            () => `pip3 install ${packageName}`,
            () => `sudo apt upgrade -y && sudo apt install -y ${packageName}`,
            () => `sudo yum upgrade -y && sudo yum install -y ${packageName}`,
            () => `sudo dnf upgrade -y && sudo dnf install -y ${packageName}`,
            () => `pip3 install --upgrade ${packageName}`,
            () => `sudo -E pip3 install ${packageName}`,
        ]
    };

    const methods = installMethods[osInfo.type] || installMethods.linux;
    const attemptLimit = Math.min(maxAttempts, methods.length);

    for (let attempt = 1; attempt <= attemptLimit; attempt++) {
        try {
            const cmd = methods[attempt - 1]();
            log.info(`[${attempt}/${attemptLimit}] ${packageName} ස්ථාපනය උත්සාහය: ${cmd.substring(0, 70)}...`);
            execSync(cmd, { stdio: 'inherit', timeout: 180000 });
            log.success(`${packageName} සාර්ථකව ස්ථාපනය වුණි!`);
            return true;
        } catch (e) {
            log.warn(`උත්සාහය ${attempt}/${attemptLimit} අසාර්ථකයි, ඉපිසිරුවමින්...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    log.error(`${packageName} සියලුම ස්ථාපන උත්සාහ අසාර්ථකයි!`);
    return false;
}

// ═══════════════════════════════════════════════════════════
// 🎯 CRITICAL PACKAGES AUTO-INSTALL/UPGRADE
// ═══════════════════════════════════════════════════════════

async function installCriticalPackages(osInfo, packages) {
    log.header('🔧 Critical Package Installation (10 Attempts each)');
    
    let allSuccess = true;
    
    for (const pkg of packages) {
        const success = await installPackageWithFallback(osInfo, pkg, 10);
        if (!success) {
            allSuccess = false;
            log.error(`${pkg} ස්ථාපනය අසාර්ථකයි - ශ්‍රිතයන් සීමිතයි!`);
        }
    }

    return allSuccess;
}

// 🎵 සිතුවම් tools සඳහා install commands
function getMusicToolsInstallCommands(osInfo, packages) {
    const cmds = {
        termux: {
            methods: [
                { cmd: `apt update -y && apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `pkg update -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg update + install' },
                { cmd: `apt upgrade -y && apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' }
            ],
            update: `apt update -y`,
            install: `apt install -y ${packages.join(' ')}`
        },
        ubuntu: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo apt-get update -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        wsl: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        macos: {
            methods: [
                { cmd: `brew update && brew install ${packages.join(' ')}`, desc: 'brew update + install' },
                { cmd: `brew upgrade && brew install ${packages.join(' ')}`, desc: 'brew upgrade + install' },
                { cmd: `pip3 install ${packages.join(' ')}`, desc: 'pip3 install' }
            ],
            update: `brew update`,
            install: `brew install ${packages.join(' ')}`
        },
        linux: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo yum install -y ${packages.join(' ')}`, desc: 'yum install' },
                { cmd: `sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        }
    };
    
    return cmds[osInfo.type] || cmds.linux;
}

// 🎵 YouTube methods සඳහා install commands
async function installYouTubePackages(osInfo) {
    log.header('📥 YouTube Download Packages Installing');
    
    const allPackages = [];
    Object.values(YOUTUBE_METHODS).forEach(method => {
        allPackages.push(...method.packages);
    });
    
    const uniquePackages = [...new Set(allPackages)];
    log.info(`📦 සියලු YouTube packages: ${uniquePackages.join(', ')}\n`);
    
    const installCmds = getInstallCommands(osInfo, uniquePackages);
    
    let attempts = 0;
    const maxAttempts = 3;
    let installSuccess = false;
    
    while (!installSuccess && attempts < maxAttempts) {
        attempts++;
        try {
            log.header(`📥 YouTube Packages Install උත්සාහය ${attempts}/${maxAttempts}`);
            
            if (osInfo.type !== 'macos') {
                try {
                    log.info('Repository update කරමින්...');
                    execSync(installCmds.update, { stdio: 'inherit', timeout: 60000 });
                } catch (e) {
                    log.warn('Update අසාර්ථකයි, ස්ථාපනය උත්සාහ කරමින්...');
                }
            }
            
            log.info(`${uniquePackages.join(', ')} ස්ථාපනය කරමින්...\n`);
            execSync(installCmds.install, { stdio: 'inherit', timeout: 180000 });
            
            installSuccess = true;
            log.success('✅ YouTube Packages සාර්ථකව ස්ථාපනය කරන ලදි!');
        } catch (e) {
            log.warn(`උත්සාහය ${attempts} අසාර්ථකයි`);
            
            if (attempts < maxAttempts) {
                log.info(`${maxAttempts - attempts} උත්සාහ ඉතිරි ඇත... නැවත උත්සාහ කරමින්...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    if (!installSuccess) {
        log.warn('YouTube packages manual install කිරීමට උත්සාහ කරන්න:');
        console.log(`  ${chalk.yellow(installCmds.install)}\n`);
    }
    
    return installSuccess;
}

// ffmpeg බහු ක්‍රම ස්ථාපනයට උත්සාහ කරමින්
async function installFFmpeg(osInfo) {
    log.header(`📥 ffmpeg අනිවාර්ය - සියල්ලම platform උත්සාහ කරමින්`);

    const hasRoot = process.getuid ? process.getuid() === 0 : true;
    if (!hasRoot) {
        log.info('🔐 Root access attempting...');
        try {
            execSync('sudo -v -p "" 2>/dev/null || true', { stdio: 'pipe', timeout: 5000 });
        } catch (e) {}
    }

    // Platform අනුව repository නිෂ්පාදන ක්‍රම
    const repoFixCommands = {
        termux: [
            'sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list 2>/dev/null || true',
            'apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2>/dev/null || true',
            'apt clean && apt update -y 2>/dev/null || true'
        ],
        ubuntu: [
            'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2>/dev/null || true',
            'sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y 2>/dev/null || true',
            'sudo sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list 2>/dev/null || true',
            'sudo apt clean && sudo apt update -y 2>/dev/null || true',
            'sudo dpkg --configure -a 2>/dev/null || true'
        ],
        wsl: [
            'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2>/dev/null || true',
            'sudo sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list 2>/dev/null || true',
            'sudo apt clean && sudo apt update -y 2>/dev/null || true',
            'sudo dpkg --configure -a 2>/dev/null || true'
        ],
        macos: [
            'sudo chown -R $(whoami) /usr/local/bin 2>/dev/null || true',
            'sudo mkdir -p /usr/local/bin 2>/dev/null || true'
        ],
        linux: [
            'sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2>/dev/null || true',
            'sudo sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list 2>/dev/null || true',
            'sudo apt clean && sudo apt update -y 2>/dev/null || true',
            'sudo dpkg --configure -a 2>/dev/null || true',
            'sudo yum clean all 2>/dev/null || true',
            'sudo pacman -Sc --noconfirm 2>/dev/null || true'
        ]
    };

    const repoFixes = repoFixCommands[osInfo.type] || [];
    log.info('\n🔧 Repo fixes applying...');
    for (const cmd of repoFixes) {
        try {
            execSync(cmd, { stdio: 'pipe', shell: '/bin/bash', timeout: 30000 });
            log.info(`✓ ${cmd.substring(0, 60)}`);
        } catch (e) {}
    }

    const termuxMethods = getInstallCommands({type: 'termux', display: 'Termux'}, ['ffmpeg']).methods;
    const ubuntuMethods = getInstallCommands({type: 'ubuntu', display: 'Ubuntu'}, ['ffmpeg']).methods;
    const wslMethods = getInstallCommands({type: 'wsl', display: 'WSL'}, ['ffmpeg']).methods;
    const macosMethods = getInstallCommands({type: 'macos', display: 'macOS'}, ['ffmpeg']).methods;
    const linuxMethods = getInstallCommands({type: 'linux', display: 'Linux'}, ['ffmpeg']).methods;

    const allPlatforms = [
        { name: 'Termux', methods: termuxMethods },
        { name: 'Ubuntu/Debian', methods: ubuntuMethods },
        { name: 'WSL/Windows', methods: wslMethods },
        { name: 'macOS', methods: macosMethods },
        { name: 'Linux (Generic)', methods: linuxMethods }
    ];

    let totalAttempts = 0;

    for (const platform of allPlatforms) {
        log.info(`\n${chalk.bold.cyan(`━━━ ${platform.name} ━━━`)}`);
        for (const method of platform.methods) {
            totalAttempts++;
            try {
                log.info(`[${totalAttempts}] ${chalk.yellow(method.desc.substring(0, 50))}`);
                
                let cmd = method.cmd;
                if (!hasRoot && !cmd.includes('sudo') && !cmd.includes('brew') && osInfo.type !== 'termux') {
                    cmd = `sudo -E bash -c "${cmd.replace(/"/g, '\\"')}"`;
                }
                
                execSync(cmd, { stdio: 'inherit', timeout: 120000, shell: '/bin/bash' });
                await new Promise(r => setTimeout(r, 500));
                
                try {
                    const v = execSync('ffmpeg -version 2>&1 | head -n1', { encoding: 'utf8', timeout: 5000 });
                    if (v.includes('ffmpeg')) {
                        log.success(`\n✅ ffmpeg OK! (උත්සාහය ${totalAttempts})\n`);
                        return true;
                    }
                } catch (e) {}
                
                if (commandExists('ffmpeg')) {
                    log.success(`\n✅ ffmpeg ස්ථාපිතයි! (උත්සාහය ${totalAttempts})\n`);
                    return true;
                }
            } catch (e) {
                log.warn(`✗`);
            }
        }
    }

    log.error(`\n❌ ffmpeg install failed!`);
    return false;
}

// සියල්ලම platform සඳහා සම්පූර්ණ ස්වයංක්‍රිය ධාවනය ක්‍රම
function getInstallCommands(osInfo, packages) {
    const pkg = packages[0];
    
    const cmds = {
        termux: {
            methods: [
                { cmd: `pkg update -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg update + install' },
                { cmd: `pkg upgrade -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg upgrade + install' },
                { cmd: `apt update -y && apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `apt upgrade -y && apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `apt-get update -y && apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `apt-get upgrade -y && apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' }
            ],
            update: `pkg update -y`,
            install: `pkg install -y ${packages.join(' ')}`
        },
        ubuntu: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo apt-get update -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `sudo apt-get upgrade -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' },
                { cmd: `sudo DEBIAN_FRONTEND=noninteractive apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt with DEBIAN_FRONTEND' },
                { cmd: `sudo snap install ${pkg}`, desc: 'snap install' },
                { cmd: `sudo apt autoremove -y && sudo apt clean -y && sudo apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt clean + update + install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        wsl: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo apt-get update -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `sudo apt-get upgrade -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' },
                { cmd: `sudo DEBIAN_FRONTEND=noninteractive apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt with DEBIAN_FRONTEND' },
                { cmd: `sudo apt autoremove -y && sudo apt clean -y && sudo apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt clean + install' },
                { cmd: `winget install -e --id Gyan.FFmpeg -h --accept-source-agreements`, desc: 'winget install' },
                { cmd: `choco install ffmpeg -y`, desc: 'chocolatey install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        },
        macos: {
            methods: [
                { cmd: `brew update && brew install ${packages.join(' ')}`, desc: 'brew update + install' },
                { cmd: `brew upgrade && brew install ${packages.join(' ')}`, desc: 'brew upgrade + install' },
                { cmd: `brew update && brew upgrade && brew install ${packages.join(' ')}`, desc: 'brew update + upgrade + install' },
                { cmd: `sudo port selfupdate && sudo port install ${pkg}`, desc: 'macports selfupdate + install' },
                { cmd: `sudo port upgrade outdated && sudo port install ${pkg}`, desc: 'macports upgrade outdated + install' },
                { cmd: `brew tap homebrew-ffmpeg/ffmpeg && brew install --with-options-here homebrew-ffmpeg/ffmpeg/ffmpeg --HEAD 2>/dev/null || brew install ffmpeg`, desc: 'brew tap + install' },
                { cmd: `curl -L https://evermeet.cx/ffmpeg/getrelease/zip -o /tmp/ffmpeg.zip && unzip -o /tmp/ffmpeg.zip -d /usr/local/bin/ && chmod +x /usr/local/bin/ffmpeg`, desc: 'official evermeet build' }
            ],
            update: `brew update`,
            install: `brew install ${packages.join(' ')}`
        },
        linux: {
            methods: [
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo apt-get update -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `sudo apt-get upgrade -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' },
                { cmd: `sudo DEBIAN_FRONTEND=noninteractive apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt with DEBIAN_FRONTEND' },
                { cmd: `sudo yum update -y && sudo yum install -y ${packages.join(' ')}`, desc: 'yum update + install' },
                { cmd: `sudo yum upgrade -y && sudo yum install -y ${packages.join(' ')}`, desc: 'yum upgrade + install' },
                { cmd: `sudo dnf update -y && sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf update + install' },
                { cmd: `sudo dnf upgrade -y && sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf upgrade + install' },
                { cmd: `sudo pacman -Sy --noconfirm && sudo pacman -S --noconfirm ${packages.join(' ')}`, desc: 'pacman sync + install' },
                { cmd: `sudo pacman -Syu --noconfirm && sudo pacman -S --noconfirm ${packages.join(' ')}`, desc: 'pacman upgrade + install' },
                { cmd: `sudo zypper refresh && sudo zypper install -y ${packages.join(' ')}`, desc: 'zypper refresh + install' },
                { cmd: `sudo zypper update -y && sudo zypper install -y ${packages.join(' ')}`, desc: 'zypper update + install' },
                { cmd: `sudo xbps-install -Sy && sudo xbps-install -y ${packages.join(' ')}`, desc: 'xbps sync + install' },
                { cmd: `sudo xbps-install -Syu && sudo xbps-install -y ${packages.join(' ')}`, desc: 'xbps upgrade + install' },
                { cmd: `apk update && apk add ${packages.join(' ')}`, desc: 'apk update + install' },
                { cmd: `apk upgrade && apk add ${packages.join(' ')}`, desc: 'apk upgrade + install' }
            ],
            update: `sudo apt update -y`,
            install: `sudo apt install -y ${packages.join(' ')}`
        }
    };
    
    return cmds[osInfo.type] || cmds.linux;
}

async function autoInstallDependencies() {
    const osInfo = detectOS();
    
    log.header(`🤖 🌸MISS SHASIKALA START කරමින්\n${chalk.yellow(`Platform: ${osInfo.display}`)}`);

    // 🔧 SYSTEM UPGRADE සහ CRITICAL PACKAGES
    log.header('🔧 System Package Upgrade & Node.js/Python Installation');
    
    try {
        await autoUpgradeSystemPackages(osInfo);
        await autoInstallNodeJS(osInfo);
        await autoInstallPython(osInfo);
    } catch (e) {
        log.warn('System upgrade/install අසාර්ථකයි, ඉපිසිරුවමින්...');
    }

    // Check npm
    if (!checkNpmInstalled()) {
        log.error('npm හමු නොවුණි!');
        log.info(`Node.js නැවත ස්ථාපනය කරමින්...\n`);
        
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
                'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
            ],
            linux: [
                'sudo apt update && sudo apt install -y nodejs npm',
                'sudo yum install -y nodejs npm',
                'sudo dnf install -y nodejs npm',
                'sudo pacman -S --noconfirm nodejs npm'
            ]
        };

        const methods = nodeMethods[osInfo.type] || nodeMethods.linux;
        
        let npmInstalled = false;
        for (const method of methods) {
            try {
                log.info(`Node.js ස්ථාපනය උත්සාහ කරමින்...`);
                execSync(method, { stdio: 'inherit', timeout: 180000 });
                
                if (checkNpmInstalled()) {
                    log.success('Node.js සාර්ථකව ස්ථාපනය කරන ලදී!');
                    npmInstalled = true;
                    break;
                }
            } catch (e) {
                log.warn('උත්සාහය අසාර්ථකයි');
            }
        }

        if (!npmInstalled) {
            log.error('npm install කිරීමට අසාර්ථකයි!');
            process.exit(1);
        }
    }

    log.success('npm හමු විය!');

    // package.json පරීක්ෂා කරමින්
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        log.error(`package.json හමු නොවුණි! (${packageJsonPath})`);
        process.exit(1);
    }

    // package.json ලබාගනිමින්
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (e) {
        log.error('package.json ලබාගැනීම කිරීමට අසාර්ථයි: ' + e.message);
        process.exit(1);
    }

    const dependencies = packageJson.dependencies || {};
    const dependencyNames = Object.keys(dependencies);

    log.info(`සියලුම npm පැකේජ ඉල්ලමින්: ${chalk.yellow(dependencyNames.length)}`);

    // එක එක dependency පරීක්ෂා කරමින්
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

    // නැතිවූ පැකේජ්ය හමු වුණු විට බහු නැවත උත්සාහ ක්‍රම සඳහා ස්ථාපනය කරමින්
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

    // පද්ධති බිමට අවශ්‍යතා පරීක්ෂා කරමින් සහ නැතිවූ විට ස්වයංක්‍රියව ස්ථාපනය
    log.header('🔧 system පරීක්ෂා කරමින්');
    
    // 🎵 YouTube සඳහා අනිවාර්ය: ffmpeg, yt-dlp, python3
    // 🎵 shasikala.js සිතුවම් download feature සඳහා: .song .spotify .soundcloud .play commands
    const mandatorySysDeps = ['ffmpeg', 'yt-dlp', 'python3']; 
    const optionalSysDeps = {
        'curl': 'HTTP ඉල්ලුම් / streaming (shasikala)',
        'git': 'version control පද්ධතිය',
        'spotifydl': 'Spotify ට්‍රැක download (shasikala .spotify)',
        'imagemagick': 'ඡායාරූප පරිවර්තනය',
        'ghostscript': 'PDF/document ක්‍රියාවලිය',
        'youtube-dl': 'YouTube සිതුවම් download (shasikala fallback)',
        'wget': 'direct ගොනුව download (shasikala fallback)',
        'aria2c': 'බහු-thread download (shasikala fallback)',
        'ffprobe': 'මීඩියා තොරතුරු'
    };

    let missingMandatory = [];
    let missingOptional = [];

    // අනිවාර්ය බිමට අවශ්‍යතා පරීක්ෂා කරමින්
    for (const cmd of mandatorySysDeps) {
        if (commandExists(cmd)) {
            console.log(`  ${chalk.green('✓')} ${cmd.padEnd(12)} - අනිවාර්ය`);
        } else {
            console.log(`  ${chalk.red('✗')} ${cmd.padEnd(12)} - අනිවාර්ය`);
            missingMandatory.push(cmd);
        }
    }

    // විකල්ප බිමට අවශ්‍යතා පරීක්ෂා කරමින්
    for (const [cmd, desc] of Object.entries(optionalSysDeps)) {
        if (commandExists(cmd)) {
            console.log(`  ${chalk.green('✓')} ${cmd.padEnd(12)} - ${desc}`);
        } else {
            console.log(`  ${chalk.red('✗')} ${cmd.padEnd(12)} - ${desc}`);
            missingOptional.push(cmd);
        }
    }

    // නැතිවූ අනිවාර්ය බිමට අවශ්‍යතා හසුරුවමින්
    if (missingMandatory.length > 0) {
        log.error(`\n❌ අනිවාර්ය දෙයක් නැතිවුණි: ${missingMandatory.join(', ')}`);
        
        const installCmds = getInstallCommands(osInfo, missingMandatory);
        
        const isRoot = process.getuid && process.getuid() === 0;
        
        if (osInfo.type === 'termux' && isRoot) {
            log.warn('⚠️  Termux root user detected - trying alternate methods...');
            log.info('All installation methods attempting in parallel...\n');
            
            const rootMethods = [
                'apt update -y && apt install -y ffmpeg',
                'apt-get update -y && apt-get install -y ffmpeg',
                'apt upgrade -y && apt install -y ffmpeg',
                'apt full-upgrade -y && apt install -y ffmpeg',
                'apt-get upgrade -y && apt-get install -y ffmpeg',
                'apk update && apk add ffmpeg',
                'apt clean && apt autoclean && apt update && apt install -y ffmpeg',
                'sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list && apt update && apt install -y ffmpeg 2>/dev/null || apt install -y ffmpeg'
            ];
            
            for (let i = 0; i < rootMethods.length; i++) {
                const cmd = rootMethods[i];
                try {
                    log.info(`[${i + 1}/${rootMethods.length}] ${chalk.cyan(cmd.substring(0, 80))}`);
                    execSync(cmd, { 
                        stdio: 'inherit',
                        shell: '/bin/bash',
                        timeout: 60000
                    });
                    
                    if (commandExists('ffmpeg')) {
                        log.success('\n✅ ffmpeg installed successfully (root user)!\n');
                        return;
                    }
                } catch (e) {
                    log.warn('Failed, trying next method...');
                }
            }
            
            log.info('\nTrying standard ffmpeg installation function...\n');
        }
            console.log(`\n${chalk.cyan(`${osInfo.display} - අනිවාර්ය dependencies ස්ථාපනය කරමින්:`)}`);
            console.log(`  ${chalk.yellow(installCmds.update)}`);
            console.log(`  ${chalk.yellow(installCmds.install)}\n`);
            
            let mandatoryInstallSuccess = false;
            
            if (missingMandatory.includes('ffmpeg')) {
                log.header('📥 ffmpeg ස්ථාපනය - සියලුම ක්‍රම උත්සාහ කරමින්');
                mandatoryInstallSuccess = await installFFmpeg(osInfo);
            } else {
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
            
            if (!mandatoryInstallSuccess) {
                log.error('\n❌ ffmpeg අනිවාර්යයි - install කරන්න බැ!');
                log.warn('All automatic methods exhausted!');
                process.exit(1);
            }
    }

    // 🎵 සිතුවම් tools auto install
    const musicToolsToInstall = missingOptional.filter(tool => ['yt-dlp', 'youtube-dl', 'spotifydl', 'wget', 'aria2c'].includes(tool));
    
    if (musicToolsToInstall.length > 0) {
        log.warn(`\n🎵 සිතුවම් tools නැතිවුණි: ${musicToolsToInstall.join(', ')}`);
        
        let musicInstallSuccess = false;
        let musicAttempts = 0;
        const maxMusicAttempts = 3;
        
        while (!musicInstallSuccess && musicAttempts < maxMusicAttempts) {
            musicAttempts++;
            try {
                log.header(`📥 සිතුවම් Tools ස්ථාපනය උත්සාහය ${musicAttempts}/${maxMusicAttempts}`);
                
                // Python tools yt-dlp, youtube-dl, spotifydl සඳහා
                const pythonTools = musicToolsToInstall.filter(t => ['yt-dlp', 'youtube-dl', 'spotifydl'].includes(t));
                const systemTools = musicToolsToInstall.filter(t => ['wget', 'aria2c'].includes(t));
                
                if (pythonTools.length > 0) {
                    log.info(`Python tools ස්ථාපනය කරමින්: ${pythonTools.join(', ')}`);
                    try {
                        if (commandExists('pip3')) {
                            execSync(`pip3 install --upgrade ${pythonTools.join(' ')}`, { stdio: 'inherit', timeout: 180000 });
                            log.success('Python tools සාර්ථකව ස්ථාපනය කරන ලදී!');
                        } else if (commandExists('pip')) {
                            execSync(`pip install --upgrade ${pythonTools.join(' ')}`, { stdio: 'inherit', timeout: 180000 });
                            log.success('Python tools සාර්ථකව ස්ථාපනය කරන ලදී!');
                        }
                    } catch (e) {
                        log.warn('Python tools ස්ථාපනය අසාර්ථකයි, system tools උත්සාහ කරමින්...');
                    }
                }
                
                if (systemTools.length > 0) {
                    log.info(`System tools ස්ථාපනය කරමින්: ${systemTools.join(', ')}`);
                    const musicInstallCmds = getMusicToolsInstallCommands(osInfo, systemTools);
                    
                    if (osInfo.type !== 'macos') {
                        try {
                            execSync(musicInstallCmds.update, { stdio: 'pipe', timeout: 60000 });
                        } catch (e) {}
                    }
                    
                    execSync(musicInstallCmds.install, { stdio: 'inherit', timeout: 180000 });
                    log.success('System tools සාර්ථකව ස්ථාපනය කරන ලදී!');
                }
                
                musicInstallSuccess = true;
            } catch (e) {
                log.warn(`උත්සාහය ${musicAttempts} අසාර්ථකයි`);
                
                if (musicAttempts < maxMusicAttempts) {
                    log.info(`${maxMusicAttempts - musicAttempts} උත්සාහ ඉතිරි ඇත...`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
        
        if (musicInstallSuccess) {
            log.success('\n✅ සිතුවම් tools සාර්ථකව ස්ථාපනය කරන ලදී!');
        } else {
            log.warn('⚠️  සිතුවම් tools manual ස්ථාපනය උත්සාහ කරන්න:');
            console.log(`  pip3 install ${pythonTools.join(' ')}`);
            console.log(`  ${osInfo.type === 'macos' ? 'brew' : 'sudo apt'} install ${systemTools.join(' ')}\n`);
        }
    }

    // වෙනත් විකල්ප tools
    const otherOptionalTools = missingOptional.filter(tool => !['yt-dlp', 'youtube-dl', 'spotifydl', 'wget', 'aria2c'].includes(tool));
    if (otherOptionalTools.length > 0) {
        log.warn(`\nවෙනත් විකල්ප tools නැතිවුණි: ${otherOptionalTools.join(', ')}`);

        log.info('✅ ස්වයංක්‍රිය ස්ථාපනය උත්සාහ කරමින්...\n');
        
        let optionalInstallSuccess = false;
        let optionalAttempts = 0;
        const maxOptionalAttempts = 3;
        
        while (!optionalInstallSuccess && optionalAttempts < maxOptionalAttempts) {
            optionalAttempts++;
            try {
                const optionalCmds = getInstallCommands(osInfo, missingOptional);
                log.info(`[උත්සාහය ${optionalAttempts}/${maxOptionalAttempts}] විකල්ප dependencies ස්ථාපනය කරමින්...`);
                console.log(`  ${chalk.cyan(optionalCmds.install)}\n`);
                
                execSync(optionalCmds.install, { 
                    stdio: 'inherit',
                    timeout: 180000,
                    shell: '/bin/bash'
                });
                
                optionalInstallSuccess = true;
                log.success('✅ විකල්ප dependencies ස්ථාපනය සාර්ථකයි!');
            } catch (e) {
                log.warn(`උත්සාහය ${optionalAttempts} අසාර්ථකයි - continuing without optional deps...`);
            }
        }
        
        if (!optionalInstallSuccess) {
            log.info('\n⚠️  විකල්ප dependencies නොතිබුණු විට සිටින නිමිත්තේ:', missingOptional.join(', '));
            log.info('Enhanced features සිටින්නේ නැත (spotify, advanced tools, etc.)');
        }
    }

    log.success('Setup verification complete!');
}

// ප්‍රධාන ක්‍රියාවලිය
async function start() {
    try {
        // බිමට අවශ්‍යතා පරීක්ෂා කරමින් සහ ස්ථාපනය කරමින්
        await autoInstallDependencies();

        const osInfo = detectOS();
        log.header(`🚀 MISS SHASIKALA ආරම්භ වෙමින්\n${chalk.yellow(`Platform: ${osInfo.display}`)}`);

        // ප්‍රධාන යෙදුම ආරම්භ කරමින්
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

// ධාවනය කරමින්
start();
