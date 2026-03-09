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

// 🎵 YouTube Download Methods Package Matrix (53+ methods - 2026 Upgrade)
const YOUTUBE_METHODS = {
    'yt-dlp': {
        packages: ['yt-dlp', 'python3'],
        methods: [
            'Default (best)', 'Android Client', 'WEB Mobile (mweb)', 'WEB Creator',
            'TV Embedded', 'iOS Client', 'VR Client', 'Studio Client',
            'android_music', 'android_creator', 'android_testsuite',
            'ios_music', 'tv', 'web_embedded', 'mediaconnect'
        ]
    },
    'youtube-dl': {
        packages: ['youtube-dl', 'python3'],
        methods: ['Python executable', 'Direct URL', 'Legacy mode', 'No-cookie mode']
    },
    'ffmpeg': {
        packages: ['ffmpeg'],
        methods: ['Direct stream extraction', 'libmp3lame encode', 'AAC->MP3', 'batch convert']
    },
    'spotifydl': {
        packages: ['spotifydl'],
        methods: ['Spotify streaming']
    },
    'curl': {
        packages: ['curl'],
        methods: ['HTTP streaming', 'pipe to ffmpeg']
    },
    'wget': {
        packages: ['wget'],
        methods: ['Direct download', 'pipe to ffmpeg']
    },
    'aria2c': {
        packages: ['aria2'],
        methods: ['Multi-thread download']
    },
    'sox': {
        packages: ['sox'],
        methods: ['Audio format conversion (shasikala fallback)']
    },
    'node-fetch': {
        packages: [],
        methods: [
            'cobalt API (17+ instances)',
            'invidious API (12+ instances)',
            'rapidapi-mp36', 'rapidapi-ytstream',
            'cnvmp3', 'ezmp3', 'yt1s', 'loader.to', 'tomp3.cc',
            'savefrom', 'notube', 'ymp4', 'converto',
            'mp3clan', 'ytbsave', 'ssyoutube'
        ]
    }
};

// OS වර්ගය හඳුනාගනිමින්
function detectOS() {
    const platform = os.platform();
    const release = os.release();

    // ── Termux (Android) ──────────────────────────────────────
    // PREFIX env var = most reliable Termux indicator
    const isTermux =
        process.env.PREFIX?.includes('com.termux') ||
        fs.existsSync('/data/data/com.termux') ||
        fs.existsSync('/data/data/com.termux/files/usr/bin/pkg') ||
        fs.existsSync('/system/build.prop');

    if (isTermux) {
        return { type: 'termux', display: 'Termux (Android)', pm: 'pkg', pmAlternate: 'apt' };
    }

    // ── macOS ──────────────────────────────────────────────────
    if (platform === 'darwin') {
        return { type: 'macos', display: 'macOS', pm: 'brew', pmAlternate: 'port' };
    }

    if (platform === 'linux') {
        // ── WSL (Windows Subsystem for Linux) ─────────────────
        try {
            const procVer = fs.existsSync('/proc/version')
                ? fs.readFileSync('/proc/version', 'utf8').toLowerCase() : '';
            const isWSL = procVer.includes('microsoft') || procVer.includes('wsl') ||
                          release.toLowerCase().includes('microsoft') ||
                          process.env.WSL_DISTRO_NAME || process.env.WSLENV;
            if (isWSL) {
                return { type: 'wsl', display: 'Windows WSL', pm: 'apt', pmAlternate: 'apt-get' };
            }
        } catch {}

        // ── Cloud / Docker / Railway / Render ─────────────────
        const isDocker = fs.existsSync('/.dockerenv') ||
            (fs.existsSync('/proc/1/cgroup') &&
             fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker'));
        const isCloud  = process.env.RAILWAY_ENVIRONMENT || process.env.RENDER ||
                         process.env.HEROKU_APP_NAME || process.env.FLY_APP_NAME ||
                         process.env.REPL_ID;

        // ── Distro detection via /etc/os-release ──────────────
        let distroId = '';
        let distroLike = '';
        try {
            if (fs.existsSync('/etc/os-release')) {
                const osr = fs.readFileSync('/etc/os-release', 'utf8');
                distroId   = (osr.match(/^ID=(.+)$/m)?.[1] || '').replace(/"/g,'').toLowerCase();
                distroLike = (osr.match(/^ID_LIKE=(.+)$/m)?.[1] || '').replace(/"/g,'').toLowerCase();
            }
        } catch {}

        // Arch Linux
        if (distroId === 'arch' || distroLike.includes('arch') ||
            fs.existsSync('/etc/arch-release')) {
            return { type: 'arch', display: 'Arch Linux', pm: 'pacman', pmAlternate: 'yay' };
        }

        // Alpine Linux
        if (distroId === 'alpine' || fs.existsSync('/etc/alpine-release')) {
            return { type: 'alpine', display: 'Alpine Linux', pm: 'apk', pmAlternate: 'apk' };
        }

        // Fedora
        if (distroId === 'fedora' || distroLike.includes('fedora')) {
            return { type: 'fedora', display: 'Fedora', pm: 'dnf', pmAlternate: 'dnf' };
        }

        // CentOS / RHEL / Rocky / AlmaLinux
        if (['centos','rhel','rocky','almalinux','ol'].includes(distroId) ||
            distroLike.includes('rhel') || distroLike.includes('centos') ||
            fs.existsSync('/etc/centos-release') || fs.existsSync('/etc/redhat-release')) {
            return { type: 'centos', display: 'CentOS/RHEL/Rocky', pm: 'yum', pmAlternate: 'dnf' };
        }

        // openSUSE
        if (distroId.includes('suse') || distroLike.includes('suse') ||
            fs.existsSync('/etc/SuSE-release')) {
            return { type: 'opensuse', display: 'openSUSE', pm: 'zypper', pmAlternate: 'zypper' };
        }

        // Void Linux
        if (distroId === 'void' || fs.existsSync('/etc/void-release')) {
            return { type: 'void', display: 'Void Linux', pm: 'xbps-install', pmAlternate: 'xbps-install' };
        }

        // Debian / Ubuntu / Mint / Kali / Raspberry Pi OS (most common)
        if (distroId === 'debian' || distroId === 'ubuntu' || distroId === 'kali' ||
            distroLike.includes('debian') || distroLike.includes('ubuntu') ||
            fs.existsSync('/etc/debian_version') || fs.existsSync('/etc/lsb-release')) {
            const label = isDocker ? 'Docker (Debian/Ubuntu)' : isCloud ? 'Cloud VPS (Debian/Ubuntu)' : 'Ubuntu/Debian/VPS';
            return { type: 'ubuntu', display: label, pm: 'apt', pmAlternate: 'apt-get' };
        }

        // Generic Linux fallback
        return { type: 'linux', display: 'Linux (Generic)', pm: 'apt', pmAlternate: 'apt-get' };
    }

    // Windows (native node, not WSL)
    if (platform === 'win32') {
        return { type: 'windows', display: 'Windows', pm: 'winget', pmAlternate: 'choco' };
    }

    return { type: 'linux', display: 'Linux (Unknown)', pm: 'apt', pmAlternate: 'apt-get' };
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


// ═══════════════════════════════════════════════════════════
// 🎵 YT-DLP AUTO INSTALL / UPDATE / UPGRADE
// python3 → pip3 → binary fallback
// ═══════════════════════════════════════════════════════════

async function installOrUpdateYtDlp(osInfo) {
    log.header('📥 yt-dlp Install / Update / Upgrade');

    const alreadyInstalled = commandExists('yt-dlp');
    if (alreadyInstalled) {
        log.info('yt-dlp දැනටමත් install වෙලා — update/upgrade කරමින්...');
    } else {
        log.info('yt-dlp නෑ — fresh install කරමින්...');
    }

    // ══════════════════════════════════════════════════════════
    // Platform check නොකර — සියලු methods flat list එකක්
    // ඕනම platform එකක එකක් හරි හරියනවා
    // ══════════════════════════════════════════════════════════
    const YTDLP_BIN_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
    const termuxBin = '/data/data/com.termux/files/usr/bin/yt-dlp';
    const prefixBin = `${process.env.PREFIX || ''}/bin/yt-dlp`;
    const homeBin   = `${process.env.HOME   || ''}/bin/yt-dlp`;

    const allMethods = [
        // ── pip / python (ඕනම platform) ──────────────────────
        { cmd: 'pip3 install -U yt-dlp',                                    desc: 'pip3 -U' },
        { cmd: 'pip3 install --upgrade yt-dlp',                             desc: 'pip3 --upgrade' },
        { cmd: 'pip3 install -U --break-system-packages yt-dlp',            desc: 'pip3 --break-system-packages' },
        { cmd: 'pip install -U yt-dlp',                                     desc: 'pip -U' },
        { cmd: 'python3 -m pip install -U yt-dlp',                          desc: 'python3 -m pip -U' },
        { cmd: 'python3 -m pip install -U --break-system-packages yt-dlp',  desc: 'python3 -m pip --break-system-packages' },
        { cmd: 'python -m pip install -U yt-dlp',                           desc: 'python -m pip -U' },
        { cmd: 'sudo pip3 install -U yt-dlp',                               desc: 'sudo pip3 -U' },
        { cmd: 'sudo python3 -m pip install -U yt-dlp',                     desc: 'sudo python3 -m pip -U' },
        { cmd: 'pip3 install yt-dlp',                                       desc: 'pip3 fresh' },

        // ── Termux ────────────────────────────────────────────
        { cmd: 'pkg install -y yt-dlp',                                     desc: 'pkg install' },
        { cmd: 'pkg upgrade -y && pkg install -y yt-dlp',                   desc: 'pkg upgrade+install' },
        { cmd: 'apt install -y yt-dlp',                                     desc: 'apt install (termux)' },
        { cmd: 'apt update -y && apt install -y yt-dlp',                    desc: 'apt update+install (termux)' },

        // ── apt / apt-get (Ubuntu, Debian, Kali, Raspi, WSL) ─
        { cmd: 'sudo apt install -y yt-dlp',                                desc: 'sudo apt install' },
        { cmd: 'sudo apt update && sudo apt install -y yt-dlp',             desc: 'sudo apt update+install' },
        { cmd: 'sudo apt-get install -y yt-dlp',                            desc: 'sudo apt-get install' },
        { cmd: 'sudo apt-get update && sudo apt-get install -y yt-dlp',     desc: 'sudo apt-get update+install' },
        { cmd: 'sudo snap install yt-dlp',                                  desc: 'snap install' },

        // ── pacman / AUR (Arch, Manjaro) ──────────────────────
        { cmd: 'sudo pacman -S --noconfirm yt-dlp',                         desc: 'pacman -S' },
        { cmd: 'sudo pacman -Syu --noconfirm yt-dlp',                       desc: 'pacman -Syu' },
        { cmd: 'yay -S --noconfirm yt-dlp',                                 desc: 'yay (AUR)' },
        { cmd: 'paru -S --noconfirm yt-dlp',                                desc: 'paru (AUR)' },

        // ── apk (Alpine, Docker Alpine) ───────────────────────
        { cmd: 'apk add yt-dlp',                                            desc: 'apk add' },
        { cmd: 'apk update && apk add yt-dlp',                              desc: 'apk update+add' },

        // ── dnf (Fedora, RHEL 8+, Rocky, Alma) ───────────────
        { cmd: 'sudo dnf install -y yt-dlp',                                desc: 'dnf install' },
        { cmd: 'sudo dnf upgrade -y && sudo dnf install -y yt-dlp',         desc: 'dnf upgrade+install' },

        // ── yum (CentOS 7, RHEL 7) ────────────────────────────
        { cmd: 'sudo yum install -y yt-dlp',                                desc: 'yum install' },
        { cmd: 'sudo yum update -y && sudo yum install -y yt-dlp',          desc: 'yum update+install' },

        // ── zypper (openSUSE) ─────────────────────────────────
        { cmd: 'sudo zypper install -y yt-dlp',                             desc: 'zypper install' },
        { cmd: 'sudo zypper refresh && sudo zypper install -y yt-dlp',      desc: 'zypper refresh+install' },

        // ── xbps (Void Linux) ─────────────────────────────────
        { cmd: 'sudo xbps-install -y yt-dlp',                               desc: 'xbps install' },
        { cmd: 'sudo xbps-install -Sy yt-dlp',                              desc: 'xbps sync+install' },

        // ── brew (macOS / Linux brew) ─────────────────────────
        { cmd: 'brew install yt-dlp',                                       desc: 'brew install' },
        { cmd: 'brew upgrade yt-dlp',                                       desc: 'brew upgrade' },
        { cmd: 'sudo port install yt-dlp',                                  desc: 'macports install' },

        // ── Windows ───────────────────────────────────────────
        { cmd: 'winget install -e --id yt-dlp.yt-dlp -h --accept-source-agreements', desc: 'winget' },
        { cmd: 'choco install yt-dlp -y',                                   desc: 'chocolatey' },
        { cmd: 'scoop install yt-dlp',                                      desc: 'scoop' },

        // ── Binary direct download (ultimate fallback) ────────
        { cmd: `curl -L "${YTDLP_BIN_URL}" -o /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp`,  desc: 'binary curl → /usr/local/bin' },
        { cmd: `wget -q "${YTDLP_BIN_URL}" -O /usr/local/bin/yt-dlp && chmod a+rx /usr/local/bin/yt-dlp`,  desc: 'binary wget → /usr/local/bin' },
        { cmd: `curl -L "${YTDLP_BIN_URL}" -o /usr/bin/yt-dlp && chmod a+rx /usr/bin/yt-dlp`,              desc: 'binary curl → /usr/bin' },
        { cmd: `wget -q "${YTDLP_BIN_URL}" -O /usr/bin/yt-dlp && chmod a+rx /usr/bin/yt-dlp`,              desc: 'binary wget → /usr/bin' },
        { cmd: `curl -L "${YTDLP_BIN_URL}" -o "${termuxBin}" && chmod a+rx "${termuxBin}"`,                desc: 'binary curl → termux bin' },
        { cmd: `wget -q "${YTDLP_BIN_URL}" -O "${termuxBin}" && chmod a+rx "${termuxBin}"`,                desc: 'binary wget → termux bin' },
        { cmd: `curl -L "${YTDLP_BIN_URL}" -o "${prefixBin}" && chmod a+rx "${prefixBin}"`,                desc: 'binary curl → PREFIX/bin' },
        { cmd: `wget -q "${YTDLP_BIN_URL}" -O "${prefixBin}" && chmod a+rx "${prefixBin}"`,                desc: 'binary wget → PREFIX/bin' },
        { cmd: `mkdir -p "${homeBin.replace(/\/yt-dlp$/, '')}" && curl -L "${YTDLP_BIN_URL}" -o "${homeBin}" && chmod a+rx "${homeBin}"`, desc: 'binary curl → ~/bin' },
        { cmd: `mkdir -p "${homeBin.replace(/\/yt-dlp$/, '')}" && wget -q "${YTDLP_BIN_URL}" -O "${homeBin}" && chmod a+rx "${homeBin}"`, desc: 'binary wget → ~/bin' },
    ];

    let attempt = 0;
    for (const method of allMethods) {
        attempt++;
        try {
            log.info(`[${attempt}/${allMethods.length}] ${method.desc}`);
            execSync(method.cmd, { stdio: 'pipe', timeout: 120000, shell: '/bin/bash' });

            if (commandExists('yt-dlp')) {
                try {
                    const ver = execSync('yt-dlp --version', { encoding: 'utf8', timeout: 5000 }).trim();
                    log.success(`✅ yt-dlp ${ver} — සාර්ථකයි! (method: ${method.desc})`);
                } catch {
                    log.success(`✅ yt-dlp install/update සාර්ථකයි!`);
                }
                return true;
            }
        } catch (e) {
            log.warn(`✗ [${attempt}] ${method.desc}`);
        }
    }

    log.error('❌ yt-dlp install සියලු methods fail — bot limited mode හි run වෙනවා.');
    return false;
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
        log.warn('System upgrade/install අසාර්ථකයි, ඉදිරියට යමින්...');
    }

    // yt-dlp — bot start වෙන හැම විටම install / update / upgrade
    try {
        await installOrUpdateYtDlp(osInfo);
    } catch (e) {
        log.warn('yt-dlp install/update අසාර්ථකයි: ' + e.message);
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
    
    // ════════════════════════════════════════════════════════════
    // 🔧 SYSTEM DEPENDENCIES (2026 - Updated for 50+ YT methods)
    //
    // MANDATORY (bot නොනවතිනවා මේවා නැතිව):
    //   ffmpeg    - audio/video encode, shasikala methods 23-26
    //   python3   - yt-dlp + youtube-dl runtime
    //   yt-dlp    - lib/scraper.js + shasikala.js methods 1-16 (15 client variants)
    //
    // OPTIONAL (miss වුණොත් fallback methods use කරනවා):
    //   youtube-dl  - shasikala methods 9-14 fallback
    //   curl/wget   - shasikala methods 27-28, lib/scraper API download
    //   aria2c      - shasikala method 29 multi-thread
    //   sox         - shasikala method 30 audio convert
    //   node-fetch  - (npm) lib/scraper API methods 17-53 (cobalt, invidious, etc.)
    // ════════════════════════════════════════════════════════════
    // yt-dlp සහ python3 mandatory ලිස්ට් එකෙන් ඉවත් කරලා
    // වෙනම dedicated function එකෙන් handle කරනවා (pip3 / binary)
    const mandatorySysDeps = ['ffmpeg'];
    const optionalSysDeps = {
        'curl':        'HTTP streaming + API calls (shasikala & lib/scraper 50+ methods)',
        'wget':        'direct file download fallback (shasikala method 29)',
        'git':         'version control',
        'spotifydl':   'Spotify track download (shasikala .spotify command)',
        'imagemagick': 'image processing / sticker creation',
        'ghostscript': 'PDF/document processing',
        'youtube-dl':  'YT download fallback (shasikala methods 9-14)',
        'aria2c':      'multi-thread download (shasikala method 29)',
        'sox':         'audio format conversion (shasikala method 30 fallback)',
        'ffprobe':     'media info detection (usually bundled with ffmpeg)'
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
    const musicToolsToInstall = missingOptional.filter(tool => ['yt-dlp', 'youtube-dl', 'spotifydl', 'wget', 'aria2c', 'sox'].includes(tool));
    
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
                const systemTools = musicToolsToInstall.filter(t => ['wget', 'aria2c', 'sox'].includes(t));
                
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
    const otherOptionalTools = missingOptional.filter(tool => !['yt-dlp', 'youtube-dl', 'spotifydl', 'wget', 'aria2c', 'sox'].includes(tool));
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
