(()=>{'use strict';
 const items=[['home.html','home','الرئيسية','Home'],['photos.html','photo_library','الصور','Photos'],['journey.html','route','الرحلة','Journey'],['songs.html','graphic_eq','الأغاني','Songs'],['videos.html','movie','الفيديوهات','Videos'],['writings.html','ink_pen','الكتابات','Writings'],['feelings.html','favorite','المشاعر','Feelings']];
 const current=(location.pathname.split('/').pop()||'home.html').toLowerCase();
 const lang=(()=>{try{return localStorage.getItem('nafsam_language')||'ar'}catch{return 'ar'}})();
 const arabic=lang!=='en'&&lang!=='tr';
 if(!document.querySelector('link[data-cosmic-theme]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./cosmic-theme.css?v=1';l.dataset.cosmicTheme='true';document.head.appendChild(l)}
 document.querySelectorAll('.nafsam-dock,nav.dock,#bottom-nav,nav[data-nafsam-bottom]').forEach(el=>el.remove());
 const nav=document.createElement('nav');nav.className='nafsam-unified-dock';nav.dataset.nafsamBottom='true';nav.setAttribute('aria-label',arabic?'التنقل الرئيسي':'NAFSAM navigation');
 for(const [href,icon,ar,en]of items){const label=arabic?ar:en;const a=document.createElement('a');a.href='./'+href;a.className='nafsam-unified-link'+(current===href?' active':'');a.setAttribute('aria-label',label);if(current===href)a.setAttribute('aria-current','page');const i=document.createElement('span');i.className='material-symbols-outlined';i.textContent=icon;const t=document.createElement('span');t.className='nafsam-nav-label';t.textContent=label;a.append(i,t);nav.appendChild(a)}
 document.body.appendChild(nav);
 const script=document.createElement('script');script.src='./cosmic-enhance.js?v=1';script.defer=true;document.body.appendChild(script);
})();
