(()=> {
  const coarse=matchMedia('(pointer:coarse)').matches;
  if(!coarse) return;

  document.documentElement.classList.add('nafsam-touch');

  // Lazy media defaults without rewriting each archive renderer.
  const tuneMedia=root=>{
    root.querySelectorAll?.('img').forEach(img=>{
      if(!img.loading) img.loading='lazy';
      img.decoding='async';
      img.draggable=false;
    });
    root.querySelectorAll?.('video').forEach(v=>{
      v.preload='metadata';
      v.setAttribute('playsinline','');
    });
  };
  tuneMedia(document);
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{
    if(n.nodeType===1){ tuneMedia(n); }
  }))).observe(document.documentElement,{childList:true,subtree:true});

  // Swipe navigation for the photo lightbox using the already-rendered gallery.
  let sx=0,sy=0,st=0;
  const lightbox=document.getElementById('lightbox');
  const lbImg=document.getElementById('lightbox-img');
  const swipeTarget=lightbox||document.getElementById('holo-viewer');
  if(swipeTarget){
    swipeTarget.addEventListener('touchstart',e=>{
      if(e.touches.length!==1)return;
      sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();
    },{passive:true});
    swipeTarget.addEventListener('touchend',e=>{
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy,dt=Date.now()-st;
      if(dt>650||Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.25)return;
      const buttons=[...document.querySelectorAll('#lightbox button,[data-lightbox-prev],[data-lightbox-next],.lightbox-prev,.lightbox-next')];
      const prev=buttons.find(b=>/prev|previous|chevron_left|arrow_back/i.test((b.getAttribute('aria-label')||'')+' '+b.textContent));
      const next=buttons.find(b=>/next|chevron_right|arrow_forward/i.test((b.getAttribute('aria-label')||'')+' '+b.textContent));
      if(dx>0) prev?.click(); else next?.click();
    },{passive:true});
  }

  // Double-tap zoom on opened memory images.
  let lastTap=0;
  document.addEventListener('touchend',e=>{
    const img=e.target.closest?.('#lightbox img,#holo-viewer img');
    if(!img)return;
    const now=Date.now();
    if(now-lastTap<320){
      e.preventDefault();
      const zoomed=img.dataset.zoomed==='1';
      img.dataset.zoomed=zoomed?'0':'1';
      img.style.transform=zoomed?'scale(1)':'scale(1.8)';
      img.style.transformOrigin='center center';
      img.style.transition='transform .22s ease';
    }
    lastTap=now;
  },{passive:false});

  // Long press on a gallery image opens the existing lightbox/viewer via its native click.
  let holdTimer=null,holdTarget=null;
  document.addEventListener('touchstart',e=>{
    const img=e.target.closest?.('main img,.legacy-photo img,.journey-memory-image img');
    if(!img)return;
    holdTarget=img;
    holdTimer=setTimeout(()=>{
      if(holdTarget===img){
        navigator.vibrate?.(18);
        img.click();
      }
    },560);
  },{passive:true});
  ['touchmove','touchend','touchcancel'].forEach(type=>document.addEventListener(type,()=>{
    clearTimeout(holdTimer);holdTimer=null;holdTarget=null;
  },{passive:true}));

  // Pull-to-refresh only in installed PWA mode and only from scroll top.
  const standalone=matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
  if(standalone){
    let py=0,pulling=false;
    document.addEventListener('touchstart',e=>{
      if(scrollY===0&&e.touches.length===1){py=e.touches[0].clientY;pulling=true}
    },{passive:true});
    document.addEventListener('touchend',e=>{
      if(!pulling)return; pulling=false;
      const dy=e.changedTouches[0].clientY-py;
      if(dy>110) location.reload();
    },{passive:true});
  }

  // Service worker registration.
  if('serviceWorker' in navigator){
    addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}),{once:true});
  }
})();