const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root=process.cwd(), out=path.join(root,'public');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const files=['index.html','home.html','photos.html','journey.html','songs.html','videos.html','writings.html','feelings.html','nafsam-media.json','i18n.js','page-audio.js','json-text-loader.js','apple-touch-icon.png','manifest.webmanifest','_headers','_redirects','mobile-responsive.css','mobile-touch.js','site-nav.js','cosmic-theme.css','cosmic-enhance.js','sw.js'];
for(const file of files){const source=path.join(root,file);if(fs.existsSync(source))fs.copyFileSync(source,path.join(out,file));}
const archiveDir=path.join(root,'archive-private-viewer');
if(fs.existsSync(archiveDir))fs.cpSync(archiveDir,path.join(out,'archive-private-viewer'),{recursive:true});
const vite=path.join(root,'node_modules','.bin',process.platform==='win32'?'vite.cmd':'vite');
if(!fs.existsSync(vite))throw new Error('Missing Vite: run npm install before building');
execFileSync(vite,['build','--config','cosmic-app/vite.config.ts'],{cwd:root,stdio:'inherit'});
for(const file of ['index.html','home.html','photos.html','journey.html','songs.html','videos.html','writings.html','feelings.html','cosmic/index.html'])if(!fs.existsSync(path.join(out,file)))throw new Error('Build missing '+file);
console.log('NAFSAM legacy + cosmic build verified');
