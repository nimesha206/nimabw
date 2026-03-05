## Information

<div align="center">
<a href="https://github.com/nimesha206/nimabw/watchers"><img title="Watchers" src="https://img.shields.io/github/watchers/nimesha206/nimabw?label=Watchers&color=green&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/network/members"><img title="Forks" src="https://img.shields.io/github/forks/nimesha206/nimabw?label=Forks&color=blue&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/stargazers"><img title="Stars" src="https://img.shields.io/github/stars/nimesha206/nimabw?label=Stars&color=yellow&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/issues"><img title="Issues" src="https://img.shields.io/github/issues/nimesha206/nimabw?label=Issues&color=success&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/issues?q=is%3Aissue+is%3Aclosed"><img title="Issues" src="https://img.shields.io/github/issues-closed/nimesha206/nimabw?label=Issues&color=red&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/pulls"><img title="Pull Request" src="https://img.shields.io/github/issues-pr/nimesha206/nimabw?label=PullRequest&color=success&style=flat-square"></a>
<a href="https://github.com/nimesha206/nimabw/pulls?q=is%3Apr+is%3Aclosed"><img title="Pull Request" src="https://img.shields.io/github/issues-pr-closed/nimesha206/nimabw?label=PullRequest&color=red&style=flat-square"></a>
</div>

මෙම ස්ක්‍රිප්ට් එක **Nimesha** විසින් Node.js සහ [WhiskeySocket/Baileys](https://github.com/WhiskeySockets/Baileys) පුස්තකාලය භාවිතා කර නිර්මාණය කර ඇත. මෙම ස්ක්‍රිප්ට් එක දැනට සංවර්ධනය වෙමින් පවතින (BETA) අවධියේ පවතින බැවින්, නොසලකා හැරිය හැකි සුළු දෝෂ තිබිය හැක. දෝෂ නිවැරදි කිරීමෙන් පසුවත් ඒවා දිගටම පවතී නම්, කරුණාකර සහාය සඳහා අයිතිකරු සම්බන්ධ කරගන්න. ~ Nima

#### සමූහයට එකතු වෙන්න
[![Grup WhatsApp](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029Vb68g1c3LdQLQDkbAQ3M) 

---
## 📦 අවශ්‍යතා (Requirements)

අවම අවශ්‍යතා:
- **Node.js** v20 හෝ ඊට වැඩි
- **Git**

පද්ධති සංරචක (`install.sh` මගින් ස්වයංක්‍රීයව හසුරුවනු ලැබේ):
- ffmpeg
- imagemagick
- yarn / npm

---
## 🚀 ස්ථාපනය (Installation)
### 1️⃣ රෙපොසිටරිය ක්ලෝන් කරන්න (Clone Repository)
```bash
git clone [https://github.com/nimesha206/nimabw](https://github.com/nimesha206/nimabw)
cd nimabw
```
---
### 2️⃣ ස්වයංක්‍රීය ස්ථාපනය (නිර්දේශිතයි)

```bash
bash install.sh
```

මෙම ස්ක්‍රිප්ට් එක මගින්:
- ​ඔබේ පැකේජ කළමනාකරු (pkg, apt, dnf, ආදිය) හඳුනා ගනී
- ​අවශ්‍ය පද්ධති සංරචක ස්ථාපනය කරයි
- ​Node.js පැකේජ ස්ථාපනය කරයි
- ​බොට් ස්වයංක්‍රීයව ක්‍රියාත්මක කරයි

---
## 📱 Termux (Android)
```bash
pkg update && pkg upgrade
pkg install git
pkg install nodejs
pkg install ffmpeg
pkg install imagemagick
git clone https://github.com/nimesha206/nimabw
cd nimabw
npm install
```
[ Termux සඳහා නිර්දේශිත ක්‍රමය ]
```bash
pkg install yarn
yarn
```
**yarn* භාවිතා කරන්න:

```bash
yarn install
yarn start
```

> `nodejs` සහ `yarn` ස්ථාපනය කර ඇති බව සහතික කරගන්න. `install.sh` ස්ක්‍රිප්ට් එක මගින් දැනටමත් මෙය හසුරුවනු ලැබේ.

---
## 💻 Laptop / Ubuntu / VPS / SSH
* Git බාගත කර ස්ථාපනය කරන්න [`මෙහි ක්ලික් කරන්න`](https://git-scm.com/downloads)
* NodeJS බාගත කර ස්ථාපනය කරන්න [`මෙහි ක්ලික් කරන්න`](https://nodejs.org/en/download)
* FFmpeg බාගත කර ස්ථාපනය කරන්න [`මෙහි ක්ලික් කරන්න`](https://ffmpeg.org/download.html) (**FFmpeg පද්ධති PATH එකට එකතු කිරීමට අමතක නොකරන්න**)
* ImageMagick බාගත කර ස්ථාපනය කරන්න [`මෙහි ක්ලික් කරන්න`](https://imagemagick.org/script/download.php)

**npm** භාවිතා කරන්න: 

```bash
npm install
npm start
```
---
## ▶️ බොට් ක්‍රියාත්මක කිරීම

```bash
npm start
# හෝ
yarn start
```

QR කේතය ස්කෑන් කරන්න හෝ Pairing Code එක භාවිතා කරන්න, එවිට බොට් භාවිතයට සූදානම් වේ.

---


## ⚙️ බොට් වින්‍යාස කිරීම (Configuration)

සියලුම ප්‍රධාන වින්‍යාසයන් (Settings) පිහිටා ඇත්තේ:

📁 **[settings.js](https://github.com/nimesha206/nimabw/blob/master/settings.js)**

### සංස්කරණය කළ හැකි සැකසුම්

#### අයිතිකරුගේ අංකය (Owner Number)
```js
global.owner = ['947xxxxxxxxxx']
```

#### බොට්ගේ අනන්‍යතාවය
```js
global.botname = 'Miss Chuti'
global.author = 'Nimesha'
```

#### විධාන උපසර්ගය (Command Prefix)
```js
global.listprefix = ['!', '.', '+']
```

#### පරිශීලක සීමාවන් සහ මුදල් (Limits & Balance)
```js
global.limit.free = 20
global.money.free = 10000
```

#### පේයාරින් කෝඩ් / බොට් අංකය (Pairing Code)
```js
global.pairing_code = true
global.number_bot = '947xxxxxxxxxx'
```

> [settings.js](https://github.com/nimesha206/nimabw/blob/master/settings.js) හි සිදු කරන ඕනෑම වෙනසක් බොට් නැවත පණ ගැන්වීමකින් (restart) තොරව **ස්වයංක්‍රීයව-යාවත්කාලීන** වේ.

---

## 🧩 විශේෂාංග සංස්කරණය සහ එක් කිරීම

​බොට්ගේ සියලුම විශේෂාංග ක්‍රියාත්මක කර ඇත්තේ:

📁 **[nima.js](https://github.com/nimesha206/nimabw/blob/master/nima.js)**

මෙහි ඇති **[switch (command)](https://github.com/nimesha206/nimabw/blob/61052a01ea8e8975a99f0db7f5d40bad5ee39a5b/nima.js#L742)** කොටස බලන්න.

### නව විශේෂාංග එක් කරන ආකාරය

[switch (command)](https://github.com/nimesha206/nimabw/blob/61052a01ea8e8975a99f0db7f5d40bad5ee39a5b/Nima.js#L742) කොටස තුළ නව විධාන එක් කරන්න.

### උදාහරණ: නව විධානයක් එක් කිරීම

```js
case 'ping': {
  reply('pong 🏓')
}
break
```

මගපෙන්වීම්:
- සෑම විටම නව විධාන `case` භාවිතා කර එක් කරන්න
- ප්‍රධාන switch ව්‍යුහය ඉවත් නොකරන්න
- විශේෂාංගයට අදාළ තාර්කික කොටස් (logic) අදාළ `case` එක තුළ තබන්න

---

## 🔌 සම්බන්ධකය සහ මධ්‍යම හසුරුවන්නා (Core Handler)

WhatsApp සම්බන්ධතාවය සහ සිදුවීම් හැසිරවීම තේරුම් ගැනීමට, බලන්න:

📁 **[index.js](https://github.com/nimesha206/nimabw/blob/master/index.js)**
මෙම ගොනුව වගකියනු ලබන්නේ:
- Baileys සම්බන්ධතාවය ආරම්භ කිරීම
- WhatsApp සිදුවීම් හැසිරවීම
- [settings.js](https://github.com/nimesha206/nimabw/blob/master/settings.js) පූර්ණය කිරීම
- පණිවිඩ [nima.js](https://github.com/nimesha206/nimabw/blob/master/nima.js) වෙත යොමු කිරීම

⚠️ **ඔබ බොට්ගේ ක්‍රියාකාරිත්වය පිළිබඳව මැනවින් අවබෝධ කර නොමැති නම් [index.js](https://github.com/nimesha206/nimabw/blob/master/index.js) සංස්කරණය කිරීම නිර්දේශ නොකරයි.**

---
## 🗂 ව්‍යාපෘති ව්‍යුහය (Project Structure)
```
├── Dockerfile
├── LICENSE
├── Procfile
├── README.md
├── app.json
├── database
│   ├── jadibot
│   │   └── nima
│   └── temp
│       └── A
├── docker-compose.yml
├── heroku.yml
├── index.js
├── install.sh
├── lib
│   ├── converter.js
│   ├── exif.js
│   ├── function.js
│   ├── game.js
│   ├── math.js
│   ├── template_menu.js
│   ├── tictactoe.js
│   └── uploader.js
├── nima.js
├── nodemon.json
├── package.json
├── railway.json
├── replit.nix
├── settings.js
├── speed.py
├── src
│   ├── antispam.js
│   ├── database.js
│   ├── jadibot.js
│   ├── media
│   │   ├── fake.pdf
│   │   └── nima.png
│   ├── message.js
│   └── server.js
└── start.js
```
---
#### Heroku වෙත ස්ථාපනය (Deploy)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nimesha206/nimabw)

#### Heroku Buildpack
| Build Pack | ලින්ක් එක |
|--------|--------|
| **NODEJS** | heroku/nodejs |
| **FFMPEG** | [here](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest) |
| **IMAGEMAGICK** | [here](https://github.com/DuckyTeam/heroku-buildpack-imagemagick) |

---
### විශේෂාංග
| මෙනුව (menu) | Bot | Group | Search | Download | Tools | Ai | Game | Fun | Owner |
| --------- | --- | ----- | ------ | -------- | ----- | -- | ---- | --- | ----- |
| ක්‍රියාකාරීත්වය     |  ✅  |   ✅   |    ✅    |     ✅     |   ✅   | ✅ |   ✅   |  ✅  |    ✅    |


බලපත්‍රය: [MIT](https://choosealicense.com/licenses/mit/)

#### මට සහය වන්න
- [whatsapp](https://wa.me/++94726800969)

## දායකත්වය දුන් අය (Contributor)

- [Nimesha](https://github.com/nimesha206) (නිර්මාණකරු)
- [Shashikala](https://github.com/nimesha206) (API සේවා සපයන්නා)
- [Nimesha](https://github.com/nimesha206) (කේත දායකයා)


| [Nimesha](https://github.com/nimesha206) |