const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const pub=path.join(process.cwd(),'public');
const read=n=>fs.readFileSync(path.join(pub,n),'utf8');
for(const f of ['index.html','home.html','photos.html','journey.html','songs.html','videos.html','writings.html','feelings.html']){const html=read(f);assert(html.includes('./future-lab/assets/'),f+' lacks bundled JS');assert(!html.includes('src/main.tsx'),f+' serves source TSX');assert(read('classic/'+f).length>500,'classic original missing '+f);}
assert(read('future-lab/index.html').includes('./assets/'),'future-lab assets broken');
const m=JSON.parse(read('nafsam-media.json'));
for(const k of ['photos','videos','songs'])assert(Array.isArray(m[k])&&m[k].length>0,k+' missing');
for(const f of ['archive-private-viewer/index.html','archive-private-viewer/archive.enc.json','archive-private-viewer/files.enc.json'])assert(fs.existsSync(path.join(pub,f)),f+' missing');
console.log('Production OK: eight routes, '+m.photos.length+' photos, '+m.videos.length+' videos, '+m.songs.length+' songs, classic & encrypted archive retained.');