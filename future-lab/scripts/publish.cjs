const fs=require('node:fs');const path=require('node:path');const root=path.join(process.cwd(),'public');const built=path.join(root,'future-lab','index.html');
if(!fs.existsSync(built))throw Error('Vite bundle index is missing');
const raw=fs.readFileSync(built,'utf8');if(!/assets\/[^"']+\.js/.test(raw))throw Error('Expected compiled JavaScript: Vite may not have run');
const html=raw.replaceAll('./assets/','./future-lab/assets/').replaceAll('../apple-touch-icon.png','./apple-touch-icon.png');
for(const name of ['index.html','home.html','photos.html','journey.html','songs.html','videos.html','writings.html','feelings.html'])fs.writeFileSync(path.join(root,name),html);
console.log('Main routes now serve compiled Celestial React; /classic preserves old HTML.');