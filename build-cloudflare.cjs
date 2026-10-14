const fs=require('node:fs'); const path=require('node:path'); const root=process.cwd();const out=path.join(root,'public');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const files=['index.html','home.html','photos.html','journey.html','songs.html','videos.html','writings.html','feelings.html','nafsam-media.json','i18n.js','page-audio.js','json-text-loader.js','apple-touch-icon.png','manifest.webmanifest','_headers','_redirects','mobile-responsive.css','mobile-touch.js','site-nav.js','sw.js','cosmic-system.css','cosmic-system.js'];
fs.mkdirSync(path.join(out,'classic'),{recursive:true});
for(const f of files){const p=path.join(root,f);if(!fs.existsSync(p))continue;fs.copyFileSync(p,path.join(out,f));fs.copyFileSync(p,path.join(out,'classic',f));}
const dir=path.join(root,'archive-private-viewer');if(fs.existsSync(dir))fs.cpSync(dir,path.join(out,'archive-private-viewer'),{recursive:true});
console.log('Legacy originals preserved at /classic and encrypted archive unchanged.');