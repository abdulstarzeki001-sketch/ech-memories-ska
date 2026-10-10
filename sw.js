const CACHE='nafsam-shell-v3';
const SHELL=[
  './','./home.html','./photos.html','./journey.html','./songs.html',
  './videos.html','./writings.html','./feelings.html',
  './nafsam-media.json','./i18n.js','./page-audio.js',
  './mobile-responsive.css','./mobile-touch.js','./manifest.webmanifest',
  './apple-touch-icon.png?v=2'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;

  // HTML/JSON: network-first so new memories appear immediately.
  if(req.mode==='navigate'||url.pathname.endsWith('.json')){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;
      }).catch(()=>caches.match(req).then(r=>r||caches.match('./home.html')))
    );
    return;
  }

  // Static shell: cache-first.
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}
    return res;
  })));
});
