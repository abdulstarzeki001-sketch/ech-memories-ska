/* Additive progressive enhancement only. Does not read or change archive content. */
(()=>{'use strict';
  const links=document.querySelectorAll('.nafsam-unified-dock a');
  const localLang=(()=>{try{return localStorage.getItem('nafsam_language')||'ar'}catch{return 'ar'}})();
  document.querySelectorAll('.cosmic-preview-link').forEach(el=>el.remove());
  const preview=document.createElement('a');preview.className='cosmic-preview-link';preview.href='./cosmic/#/home';
  preview.textContent=localLang==='en'?'COSMIC VIEW':localLang==='fa'?'نمای کیهانی':localLang==='tr'?'KOZMİK GÖRÜNÜM':'التجربة الكونية';
  preview.setAttribute('aria-label',preview.textContent);document.body.appendChild(preview);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!('IntersectionObserver' in window))return;
  const observed=document.querySelectorAll('.module,.glass-panel,.glass-card,.journey-memory-card');
  const intersection=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('cosmic-inview');intersection.unobserve(entry.target)}}},{rootMargin:'0px 0px 30px 0px',threshold:.04});
  observed.forEach(el=>{el.classList.add('cosmic-reveal');intersection.observe(el)});
  document.body.classList.add('cosmic-ready');
  setTimeout(()=>{observed.forEach(el=>el.classList.add('cosmic-inview'));intersection.disconnect()},2600);
  for(const link of links){link.addEventListener('click',()=>{link.style.pointerEvents='none';setTimeout(()=>{link.style.pointerEvents=''},900)})}
})();
