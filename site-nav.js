(()=> {
  const items=[
    ['home.html','home','Home'],
    ['photos.html','photo_library','Photos'],
    ['journey.html','route','Journey'],
    ['songs.html','graphic_eq','Songs'],
    ['videos.html','movie','Videos'],
    ['writings.html','ink_pen','Writings'],
    ['feelings.html','favorite','Feelings']
  ];

  const current=(location.pathname.split('/').pop()||'home.html').toLowerCase();

  // Remove all previous bottom navigation variants so every page uses one bar only.
  document.querySelectorAll('.nafsam-dock, nav.dock, #bottom-nav, nav[data-nafsam-bottom]').forEach(el=>el.remove());

  const nav=document.createElement('nav');
  nav.className='nafsam-unified-dock';
  nav.setAttribute('data-nafsam-bottom','true');
  nav.setAttribute('aria-label','NAFSAM navigation');

  items.forEach(([href,icon,label])=>{
    const a=document.createElement('a');
    a.href='./'+href;
    a.className='nafsam-unified-link'+(current===href?' active':'');
    a.setAttribute('aria-label',label);
    if(current===href)a.setAttribute('aria-current','page');
    a.innerHTML='<span class="material-symbols-outlined">'+icon+'</span><span class="nafsam-nav-label">'+label+'</span>';
    nav.appendChild(a);
  });

  document.body.appendChild(nav);
})();