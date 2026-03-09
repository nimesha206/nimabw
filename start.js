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

// වර්ණ ශ්‍රිතයන්
const log = {
    info: (msg) => console.log(`${chalk.cyan('ℹ')} ${msg}`),
    success: (msg) => console.log(`${chalk.green('✓')} ${msg}`),
    error: (msg) => console.log(`${chalk.red('✗')} ${msg}`),
    warn: (msg) => console.log(`${chalk.yellow('⚠')} ${msg}`),
    header: (msg) => console.log(`\n${chalk.bold.blue('═══════════════════════════════════')}\n${chalk.bold.cyan(msg)}\n${chalk.bold.blue('═══════════════════════════════════')}\n`)
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
            pm: 'pkg', // Updated to pkg
            pmAlternate: 'apt'
        };
    }
    
    // Ubuntu/Debian නම් පරීක්ෂා කරමින්
    if (platform === 'linux') {
        if (fs.existsSync('/etc/lsb-release') || fs.existsSync('/etc/debian_version')) {
            // WSL එකෙ ධාවනය වෙනවා නම් පරීක්ෂා කරමින්
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

// ffmpeg බහු ක්‍රම ස්ථාපනයට උත්සාහ කරමින්
// ffmpeg ශක්තිමත් ස්ථාපනය - සාර්ථකයි විය යුතුයි
async function installFFmpeg(osInfo) {
    log.header(`📥 ffmpeg අනිවාර්ය - සියල්ලම platform උත්සාහ කරමින්`);

    // Root සඳහා ස්ථාපිතයි නම් පරීක්ෂා කරමින්
    const escalateToRoot = async () => {
        try {
            execSync('sudo -n true 2>/dev/null || echo "need_password"', { stdio: 'pipe' });
            return true;
        } catch (e) {
            return false;
        }
    };

    const hasRoot = process.getuid ? process.getuid() === 0 : true;
    if (!hasRoot) {
        log.info('🔐 Root access attempting...');
        try {
            // Sudo ප්‍රවේශ මුරපදයින් තොරව ලබා ගැනීමට උත්සාහ කරමින්
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

    // දැනට platform සඳහා repository ස්ථාපනය ධාවනය කරමින්
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
                
                // Sudo ඔස්සේ ස්වයංක්‍රියව උසස් අධිකාරය
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

    log.header(`🔥 සියල්ලම platform fallbacks + repo fixes`);
    
    const aggressiveFallbacks = [
        // Termux with repo fix
        'sed -i "s/^deb http/deb [trusted=yes] http/" /etc/apt/sources.list 2>/dev/null; apt update -y && apt install -y ffmpeg 2>&1 || true',
        'pkg update -y && pkg install -y ffmpeg 2>&1 || true',
        'apt update -y && apt install -y ffmpeg 2>&1 || true',
        
        // Ubuntu with repo fix
        'sudo -E bash -c "apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2>/dev/null; apt update -y && apt install -y ffmpeg" 2>&1 || true',
        'sudo -E bash -c "sed -i \\"s/^deb http/deb [trusted=yes] http/\\" /etc/apt/sources.list; apt update && apt install -y ffmpeg" 2>&1 || true',
        'sudo -E apt update -y && sudo -E apt install -y ffmpeg 2>&1 || true',
        'sudo -E bash -c "dpkg --configure -a && apt install -y ffmpeg" 2>&1 || true',
        'sudo -E bash -c "apt clean && apt autoclean && apt update && apt install -y ffmpeg" 2>&1 || true',
        
        // CentOS/RHEL repository ස්ථාපනය සමඟ
        'sudo -E bash -c "yum clean all && yum update -y && yum install -y ffmpeg" 2>&1 || true',
        'sudo -E bash -c "dnf clean all && dnf update -y && dnf install -y ffmpeg" 2>&1 || true',
        
        // Arch repository ස්ථාපනය සමඟ
        'sudo -E bash -c "pacman -Sc --noconfirm && pacman -Sy --noconfirm && pacman -S --noconfirm ffmpeg" 2>&1 || true',
        
        // macOS
        'sudo -E bash -c "chown -R $(whoami) /usr/local/bin; brew update && brew install ffmpeg" 2>&1 || true',
        'brew update && brew install ffmpeg 2>&1 || true',
        'sudo port install ffmpeg 2>&1 || true',
        
        // Alpine Linux
        'sudo -E bash -c "zypper refresh && zypper install -y ffmpeg" 2>&1 || true',
        
        // WSL Windows (PowerShell)
        'powershell -Command "winget install FFmpeg -h --accept-source-agreements" 2>&1 || true',
        
        // සිදු හැකි සියල්ලම sudo උසස්කරණය සමඟ
        'sudo -E bash -c "apt update && apt install -y ffmpeg" 2>&1 || apt update && apt install -y ffmpeg 2>&1 || true',
        'sudo -E bash -c "yum update -y && yum install -y ffmpeg" 2>&1 || yum update -y && yum install -y ffmpeg 2>&1 || true',
        'sudo -E bash -c "pacman -Sy --noconfirm && pacman -S --noconfirm ffmpeg" 2>&1 || true'
    ];

    for (let i = 0; i < aggressiveFallbacks.length; i++) {
        totalAttempts++;
        try {
            log.info(`[${totalAttempts}] ${chalk.cyan(aggressiveFallbacks[i].substring(0, 80))}`);
            execSync(aggressiveFallbacks[i], { stdio: 'inherit', timeout: 90000, shell: '/bin/bash' });
            await new Promise(r => setTimeout(r, 500));
            
            if (commandExists('ffmpeg')) {
                log.success(`\n✅ ffmpeg ස්ථාපිතයි!\n`);
                return true;
            }
        } catch (e) {
            log.warn(`✗`);
        }
    }

    log.error(`\n❌ ffmpeg install failed! (උත්සාහ: ${totalAttempts})`);
    process.exit(1);
}

// සියල්ලම platform සඳහා සම්පූර්ණ ස්වයංක්‍රිය ධාවනය ක්‍රම
function getInstallCommands(osInfo, packages) {
    const pkg = packages[0]; // For ffmpeg specific handling
    
    const cmds = {
        termux: {
            methods: [
                { cmd: `pkg update -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg update + install' },
                { cmd: `pkg upgrade -y && pkg install -y ${packages.join(' ')}`, desc: 'pkg upgrade + install' },
                { cmd: `apt update -y && apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `apt upgrade -y && apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `apt-get update -y && apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `apt-get upgrade -y && apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' }
            ]
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
            ]
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
            ]
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
            ]
        },
        linux: {
            methods: [
                // Debian/Ubuntu based
                { cmd: `sudo apt update -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt update + install' },
                { cmd: `sudo apt upgrade -y && sudo apt install -y ${packages.join(' ')}`, desc: 'apt upgrade + install' },
                { cmd: `sudo apt-get update -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get update + install' },
                { cmd: `sudo apt-get upgrade -y && sudo apt-get install -y ${packages.join(' ')}`, desc: 'apt-get upgrade + install' },
                { cmd: `sudo DEBIAN_FRONTEND=noninteractive apt update && sudo apt install -y ${packages.join(' ')}`, desc: 'apt with DEBIAN_FRONTEND' },
                // RedHat/CentOS/Fedora පාදක
                { cmd: `sudo yum update -y && sudo yum install -y ${packages.join(' ')}`, desc: 'yum update + install' },
                { cmd: `sudo yum upgrade -y && sudo yum install -y ${packages.join(' ')}`, desc: 'yum upgrade + install' },
                { cmd: `sudo dnf update -y && sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf update + install' },
                { cmd: `sudo dnf upgrade -y && sudo dnf install -y ${packages.join(' ')}`, desc: 'dnf upgrade + install' },
                // Arch පාදක
                { cmd: `sudo pacman -Sy --noconfirm && sudo pacman -S --noconfirm ${packages.join(' ')}`, desc: 'pacman sync + install' },
                { cmd: `sudo pacman -Syu --noconfirm && sudo pacman -S --noconfirm ${packages.join(' ')}`, desc: 'pacman upgrade + install' },
                // openSUSE Linux
                { cmd: `sudo zypper refresh && sudo zypper install -y ${packages.join(' ')}`, desc: 'zypper refresh + install' },
                { cmd: `sudo zypper update -y && sudo zypper install -y ${packages.join(' ')}`, desc: 'zypper update + install' },
                // Void Linux විතරක්
                { cmd: `sudo xbps-install -Sy && sudo xbps-install -y ${packages.join(' ')}`, desc: 'xbps sync + install' },
                { cmd: `sudo xbps-install -Syu && sudo xbps-install -y ${packages.join(' ')}`, desc: 'xbps upgrade + install' },
                // Alpine
                { cmd: `apk update && apk add ${packages.join(' ')}`, desc: 'apk update + install' },
                { cmd: `apk upgrade && apk add ${packages.join(' ')}`, desc: 'apk upgrade + install' }
            ]
        }
    };
    
    return cmds[osInfo.type] || cmds.linux;
}

// නැතිවූ පැකේජ්ය ස්වයංක්‍රියව ස්ථාපනය කරමින් නැවත උත්සාහ තර්කය සමඟ
async function autoInstallDependencies() {
    const osInfo = detectOS();
    
    log.header(`🤖 🌸MISS SHASIKALA START කරමින්\n${chalk.yellow(`Platform: ${osInfo.display}`)}`);

    // Check npm
    if (!checkNpmInstalled()) {
        log.error('npm හමු නොවුණි!');
        log.info(`Node.js ස්ථාපනය කරමින්...\n`);
        
        const osInfo = detectOS();
        let npmInstalled = false;
        
        // බහු ක්‍රම සමඟ Node.js ස්ථාපනය උත්සාහ කරමින්
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
        log.error('package.json ලබාගැනීම කිරීමට අසාර්ථකයි: ' + e.message);
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
                
                // එක එක උත්සාහයට පෙර පිරිසිදු කරමින්
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
    
    const mandatorySysDeps = ['ffmpeg']; // ffmpeg is mandatory
    const optionalSysDeps = {
        'python3': 'python3 scripts',
        'curl': 'http requests',
        'git': 'version control'
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
        
        // Check if running as root in Termux
        const isRoot = process.getuid && process.getuid() === 0;
        
        if (osInfo.type === 'termux' && isRoot) {
            log.warn('⚠️  Termux root user detected - trying alternate methods...');
            log.info('All installation methods attempting in parallel...\n');
            
            // Aggressive root user methods for Termux
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
            
            // සියල්ලම root ක්‍රම අසාර්ථකයි නම්, installFFmpeg උත්සාහ කරමින්
            log.info('\nTrying standard ffmpeg installation function...\n');
        }
            console.log(`\n${chalk.cyan(`${osInfo.display} - අනිවාර්ය dependencies ස්ථාපනය කරමින්:`)}`);
            console.log(`  ${chalk.yellow(installCmds.update)}`);
            console.log(`  ${chalk.yellow(installCmds.install)}\n`);
            
            let mandatoryInstallSuccess = false;
            
            // Try with ffmpeg specific installation function
            if (missingMandatory.includes('ffmpeg')) {
                log.header('📥 ffmpeg ස්ථාපනය - සියලුම ක්‍රම උත්සාහ කරමින්');
                mandatoryInstallSuccess = await installFFmpeg(osInfo);
            } else {
                // අනෙකුත් අනිවාර්ය බිමට අවශ්‍යතා සඳහා
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
            
            // ffmpeg installation MUST succeed
            if (!mandatoryInstallSuccess) {
                log.error('\n❌ ffmpeg අනිවාර්යයි - install කරන්න බැ!');
                log.warn('All automatic methods exhausted!');
                
                // නව ශක්තිමත් installFFmpeg ශ්‍රිතය සමඟ මෙය කිසිවිටෙක සිදුවිය යුතුවේ නැත
                process.exit(1);
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
