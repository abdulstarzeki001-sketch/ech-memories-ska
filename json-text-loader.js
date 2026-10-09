(()=>{
  const page=(location.pathname.split('/').pop()||'home.html').replace(/^$/,'home.html');
  const route=page.endsWith('.html')?page:page+'.html';
  const supported=new Set(['home.html','journey.html','photos.html','songs.html','videos.html','writings.html']);
  if(!supported.has(route))return;

  const lang=()=>{try{return localStorage.getItem('nafsam_language')||'ar'}catch(e){return 'ar'}};
  const labels={
    ar:{title:'نصوص الأرشيف',path:'مسار النص',empty:'لا توجد نصوص إضافية لهذه الصفحة.'},
    fa:{title:'متن‌های آرشیو',path:'مسیر متن',empty:'متن اضافه‌ای برای این صفحه وجود ندارد.'},
    tr:{title:'Arşiv Metinleri',path:'Metin yolu',empty:'Bu sayfa için ek metin yok.'},
    en:{title:'Archive Texts',path:'Text path',empty:'No additional text exists for this page.'}
  };
  const L=()=>labels[lang()]||labels.en;

  const css=document.createElement('style');
  css.id='nafsam-json-text-style';
  css.textContent=`
  #nafsam-json-texts{width:min(1180px,92vw);margin:54px auto 120px;position:relative;z-index:5}
  #nafsam-json-texts .jt-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin-bottom:18px}
  #nafsam-json-texts .jt-head h2{margin:0;color:#edf9fd;font:500 clamp(26px,4vw,42px)/1.15 "Playfair Display",serif}
  #nafsam-json-texts .jt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  #nafsam-json-texts .jt-card{border:1px solid rgba(165,231,255,.11);border-radius:20px;padding:18px;background:rgba(8,15,22,.64);box-shadow:0 16px 42px rgba(0,0,0,.18)}
  #nafsam-json-texts .jt-key{display:block;color:#d8b878;font:600 9px/1.4 Geist,system-ui;letter-spacing:.12em;text-transform:uppercase;margin-bottom:9px}
  #nafsam-json-texts .jt-text{margin:0;color:#b9c9d0;font:400 15px/1.9 Cairo,Geist,sans-serif;white-space:pre-wrap}
  #nafsam-json-texts .jt-path{display:block;margin-top:11px;color:#617985;font:500 9px/1.5 Geist,system-ui;overflow-wrap:anywhere}
  @media(max-width:720px){#nafsam-json-texts .jt-grid{grid-template-columns:1fr}}
  `;
  document.head.append(css);

  fetch('./nafsam-media.json',{cache:'no-store'}).then(r=>{
    if(!r.ok)throw new Error('manifest '+r.status);return r.json()
  }).then(data=>{
    const groups=data.pageTextGroups||{};
    const groupName=route.replace('.html','');
    const keys=groups[groupName]||[];
    const p=data.archiveText?.pages?.[lang()]||data.archiveText?.pages?.ar||data.archiveText?.pages?.tr||data.archiveText?.pages?.en||{};
    const routes=data.textRoutes||{};
    const items=keys.filter(k=>p[k]).map(k=>({key:k,text:p[k],path:routes[k]?.paths?.[lang()]||('archiveText.pages.'+lang()+'.'+k)}));
    if(!items.length)return;

    const sec=document.createElement('section');sec.id='nafsam-json-texts';
    const head=document.createElement('div');head.className='jt-head';
    const h=document.createElement('h2');h.textContent=L().title;head.append(h);
    const grid=document.createElement('div');grid.className='jt-grid';

    for(const it of items){
      const card=document.createElement('article');card.className='jt-card';
      const key=document.createElement('span');key.className='jt-key';key.textContent=it.key.replaceAll('_',' ');
      const text=document.createElement('p');text.className='jt-text';text.textContent=it.text;
      const path=document.createElement('code');path.className='jt-path';path.textContent=L().path+': '+it.path;
      card.append(key,text,path);grid.append(card);
    }
    sec.append(head,grid);

    const main=document.querySelector('main');
    if(!main)return;
    if(route==='journey.html'){
      const anchor=document.getElementById('journey-real-root');
      if(anchor) main.insertBefore(sec,anchor); else main.append(sec);
    }else{
      main.append(sec);
    }
  }).catch(e=>console.error('NAFSAM JSON text loader:',e));
})();