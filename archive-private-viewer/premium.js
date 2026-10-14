const $ = id => document.getElementById(id);
const root = $('results');
const repoAssets = 'https://raw.githubusercontent.com/abdulstarzeki001-sketch/ech-memories-ska/main/';
const hostedApp = /\.appdeploy\.ai$/i.test(location.hostname);
const archiveBase = new URL(hostedApp ? repoAssets + 'archive-private-viewer/' : './', location.href);
const sourceBase = new URL(hostedApp ? repoAssets : '../', location.href);
const privateDataUrl = new URL('archive.enc.json', archiveBase);
const originalFilesUrl = new URL('files.enc.json', archiveBase);
const writingsDataUrl = new URL('nafsam-media.json', sourceBase);
const state = {
  locked: true, passphrase: '', messages: [], catalog: {}, originalFiles: null,
  fileStatus: 'idle', writingStatus: 'idle', writingsData: null, writings: [],
  tab: 'messages', batch: [], shown: 0, batchSize: 35, epoch: 0, objectURLs: [],
};
const b64bytes = data => Uint8Array.from(atob(data), c => c.charCodeAt(0));
const clean = value => String(value ?? '');
const langText = (value, lang = 'ar') => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return clean(value[lang] || value.ar || value.tr || value.fa || value.en || '');
  return clean(value);
};
const node = (name, cls = '', content) => {
  const e = document.createElement(name);
  if (cls) e.className = cls;
  if (content !== undefined) e.textContent = clean(content);
  return e;
};
const safeUrl = text => {
  try {
    const u = new URL(clean(text));
    return u.protocol === 'https:' ? u.href : '';
  } catch { return ''; }
};
const mediaUrl = (kind, filename) => {
  const base = safeUrl(state.catalog.base);
  if (!base || !filename) return '';
  return base.replace(/\/$/, '') + '/' + (kind === 'photo' ? 'images/all_photos' : 'media') + '/' + clean(filename).split('/').map(encodeURIComponent).join('/');
};
const updateStatus = text => { $('status').textContent = text; };
const titleOfTab = { messages: 'سجل الرسائل', writings: 'الكتابات المحفوظة', photos: 'ألبوم الصور', videos: 'الفيديوهات', audio: 'الموسيقى', files: 'ملفات المصدر', about: 'عن هذا الأرشيف' };
function updateMetrics() {
  if (!state.locked) {
    $('mMessages').textContent = state.messages.length.toLocaleString('en-US');
    $('mPhotos').textContent = (state.catalog.photos || []).length;
    $('mVideos').textContent = (state.catalog.videos || []).length;
    $('mMusic').textContent = (state.catalog.songs || []).length;
    $('mFiles').textContent = state.originalFiles?.length || 44;
    $('mWritings').textContent = state.writings.length || '…';
  }
}
async function decryptPacket(packet, pass, type) {
  if (!window.crypto?.subtle || !window.DecompressionStream) throw new Error('Browser does not support secure cryptography');
  if (packet.format !== type || packet.compression !== 'gzip') throw new Error('Unsupported encrypted data format');
  const chunks = packet.chunks || packet.cipherChunks;
  if (!Array.isArray(chunks)) throw new Error('Missing encrypted chunks');
  const encoder = new TextEncoder();
  const raw = await crypto.subtle.importKey('raw', encoder.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const aes = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64bytes(packet.salt), iterations: packet.iterations, hash: 'SHA-256' }, raw, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64bytes(packet.iv), additionalData: encoder.encode(packet.aad) }, aes, b64bytes(chunks.join('')));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(stream).text());
}
async function unlockArchive(event) {
  event.preventDefault();
  const password = $('archivePass').value.trim().toUpperCase();
  if (!password) { updateStatus('اكتب رمز فتح الأرشيف.'); return; }
  const run = ++state.epoch;
  $('unlockButton').disabled = true;
  updateStatus('جارٍ التحقق وفك تشفير الرسائل على جهازك…');
  try {
    const res = await fetch(privateDataUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Archive unavailable');
    const content = await decryptPacket(await res.json(), password, 'ECH_ARCHIVE_AES256_GCM_V1');
    if (!Array.isArray(content.conversations) || !Array.isArray(content.manifest?.photos)) throw new Error('Corrupt archive');
    if (run !== state.epoch) return;
    state.messages = content.conversations.sort((a, b) => clean(a.dt).localeCompare(clean(b.dt)));
    state.catalog = content.manifest;
    state.passphrase = password;
    state.locked = false;
    state.tab = 'messages';
    $('archivePass').value = '';
    $('unlockForm').hidden = true;
    $('lockButton').hidden = false;
    $('lockButton').disabled = false;
    $('accessTitle').textContent = 'أنت داخل الأرشيف';
    $('accessText').textContent = 'المحادثات والذكريات متاحة الآن. يمكنك التنقل بين الأقسام والبحث في جميع النصوص.';
    $('loaded').textContent = '✦ المكتبة مفتوحة';
    $('loaded').classList.add('open');
    $('topSecure').lastElementChild.textContent = 'جلسة خاصة مفتوحة';
    $('scope').value = 'direct';
    $('search').value = '';
    updateStatus('تم فتح ' + state.messages.length + ' سجلًا. لا حاجة إلى ZIP.');
    updateMetrics();
    render();
    void loadWritingsData();
  } catch (error) {
    $('archivePass').value = '';
    updateStatus(error.message?.includes('Browser') ? 'Safari أو المتصفح الحالي لا يدعم التشفير المطلوب.' : 'تعذر فتح الأرشيف. تأكد من الرمز والاتصال بالإنترنت.');
  } finally { $('unlockButton').disabled = false; }
}
function lockArchive() {
  state.epoch += 1;
  state.locked = true;
  state.messages = []; state.catalog = {}; state.originalFiles = null;
  state.fileStatus = 'idle'; state.writingsData = null;
  state.writingStatus = 'idle'; state.writings = [];
  state.passphrase = ''; state.shown = 0; state.batch = [];
  for (const u of state.objectURLs) URL.revokeObjectURL(u);
  state.objectURLs = [];
  $('unlockForm').hidden = false;
  $('lockButton').hidden = true;
  $('lockButton').disabled = true;
  $('archivePass').value = '';
  $('accessTitle').textContent = 'افتح أرشيفك';
  $('accessText').textContent = 'جميع السجلات متاحة في الموقع بصيغة مشفّرة. لا حاجة إلى رفع أي ملف.';
  $('loaded').textContent = '◆ الأرشيف مقفل';
  $('loaded').classList.remove('open');
  $('topSecure').lastElementChild.textContent = 'محمي بالتشفير';
  $('mWritings').textContent = '—';
  updateStatus('تم قفل الأرشيف ومسح البيانات المفتوحة من ذاكرة الصفحة.');
  closeModal(); render();
}
function writingItem(type, title, body, info = '', language = 'ar') {
  const text = clean(body).trim(), label = clean(title).trim();
  if (!text && !label) return null;
  return { type, title: label, text, info, language };
}
function gatherWritings(language = 'ar') {
  const data = state.writingsData || {};
  const list = [];
  const dedupe = new Set();
  const add = item => {
    if (!item || !item.text.trim()) return;
    const key = item.text.replace(/\s+/g, ' ').trim();
    if (dedupe.has(key)) return;
    dedupe.add(key); list.push(item);
  };
  const w = data.writings?.[language] || data.writings?.ar || {};
  for (let n = 1; n <= 10; n++) {
    if (w['w' + n]) add(writingItem('original', 'النص ' + String(n).padStart(2, '0'), w['w' + n], 'الكتابات الأصلية · نفسم', language));
  }
  add(writingItem('farewell', w.farewell_title || 'الوداع', w.farewell_text, 'نص الوداع المحفوظ', language));
  const photoCap = state.catalog.photoEntries || [];
  photoCap.forEach((p, n) => {
    const c = p.captions?.[language] || p.captions?.ar || {};
    add(writingItem('photo', c.title || ('صورة ' + (n + 1)), c.text || '', p.file || '', language));
  });
  const archive = data.archiveText || {};
  const captions = archive.captions?.[language] || archive.captions?.ar || [];
  captions.forEach((c, n) => add(writingItem('photo', c.title || ('صورة ' + (n + 1)), c.text || '', 'كتابات ألبوم الصور', language)));
  (archive.videos || []).forEach((v, n) => {
    const a = langText(v.caption, language), b = langText(v.quote, language);
    if (a || b) add(writingItem('video', langText(v.title, language) || ('فيديو ' + (n + 1)), [a,b].filter(Boolean).join('\n\n'), v.file || '', language));
  });
  const pages = archive.pages?.[language] || archive.pages?.ar || {};
  if (pages.moments_text) add(writingItem('journey','مقدمة الرحلة', pages.moments_text, 'الرحلة', language));
  for (let n = 1; n <= 30; n++) {
    const pre = 'moment' + n;
    const combined = [pages[pre + '_text'], pages[pre + '_memory']].filter(Boolean).join('\n\n');
    add(writingItem('journey',pages[pre + '_title'] || ('المحطة ' + n), combined, pages[pre + '_time'] || 'رحلة الذكريات',language));
  }
  if (pages.moments_footer) add(writingItem('journey', 'خاتمة الرحلة', pages.moments_footer, 'الرحلة', language));
  if (pages.songs_text) add(writingItem('songs','الموسيقى والذكرى', pages.songs_text,'كتابات الأغاني',language));
  for (let n = 1; n <= 30; n++) if (pages['song' + n + '_text']) add(writingItem('songs', 'أغنية ' + n, pages['song' + n + '_text'], 'كتابات الأغاني',language));
  if (pages.songs_footer) add(writingItem('songs','خاتمة الأغاني', pages.songs_footer,'كتابات الأغاني',language));
  const known = Object.keys(pages).filter(key => !/^moment\d+_|^song\d+_|^moments_|^songs_/.test(key));
  known.forEach(key => {
    const value = pages[key];
    if (typeof value === 'string' && value.trim()) add(writingItem('page', key.replace(/_/g, ' · '), value, 'نصوص صفحات نفسم',language));
  });
  const feelings = data.feelings?.[language] || (language === 'ar' ? data.feelings?.tr : null);
  if (feelings) {
    (feelings.memoryFragments || []).forEach((x,n) => add(writingItem('feelings', 'ذكرى ' + (x.label || n + 1), x.body, 'المشاعر · المصدر التركي', 'tr')));
    (feelings.collapseLines || []).forEach((x,n) => add(writingItem('feelings', 'نص شعوري ' + (n + 1), typeof x === 'string' ? x : (x.body || x.text), 'المشاعر · المصدر التركي','tr')));
    (feelings.storyParagraphs || []).forEach((x,n) => add(writingItem('feelings', feelings.storyTitle || ('قصة ' + (n + 1)), x, 'المشاعر · المصدر التركي','tr')));
    ['heroSub','memoriesSub','endingLine'].forEach(k => add(writingItem('feelings', k, feelings[k], 'المشاعر · المصدر التركي','tr')));
  }
  return list;
}
async function loadWritingsData() {
  if (state.locked || state.writingStatus === 'ready' || state.writingStatus === 'loading') return;
  const tick = state.epoch;
  state.writingStatus = 'loading';
  if (state.tab === 'writings') render();
  try {
    const res = await fetch(writingsDataUrl, { cache:'no-store' });
    if (!res.ok) throw new Error('Writing source not available');
    const data = await res.json();
    if (!data.writings || !data.archiveText) throw new Error('Writings are incomplete');
    if (tick !== state.epoch || state.locked) return;
    state.writingsData = data;
    state.writingStatus = 'ready';
  } catch {
    if (tick !== state.epoch || state.locked) return;
    state.writingStatus = 'error';
  }
  state.writings = gatherWritings($('writingLang').value);
  updateMetrics();
  if (state.tab === 'writings') render();
}
async function loadFiles() {
  if (state.locked || state.fileStatus === 'loading' || state.fileStatus === 'ready') return;
  const tick = state.epoch;
  state.fileStatus = 'loading'; render();
  try {
    const res = await fetch(originalFilesUrl, {cache:'no-store'});
    if (!res.ok) throw new Error('Unavailable files');
    const data = await decryptPacket(await res.json(), state.passphrase, 'ECH_SOURCE_FILES_AES256_GCM_V1');
    if (!Array.isArray(data.files) || data.count !== data.files.length || data.format !== 'ECH_SOURCE_FILES_V1') throw new Error('Invalid archive files');
    if (tick !== state.epoch || state.locked) return;
    state.originalFiles = data.files;
    state.fileStatus = 'ready';
    updateMetrics();
  } catch {
    if (tick !== state.epoch || state.locked) return;
    state.fileStatus = 'error';
  }
  if (state.tab === 'files') render();
}
function clearResults() {
  root.replaceChildren(); $('more').hidden = true; $('count').textContent = '';
  $('viewLabel').textContent = titleOfTab[state.tab];
  for (const b of $('tabs').querySelectorAll('.tab')) b.classList.toggle('active', b.dataset.tab === state.tab);
  $('scope').hidden = $('platform').hidden = state.tab !== 'messages';
  $('writingType').hidden = $('writingLang').hidden = state.tab !== 'writings';
  $('controls').hidden = state.tab === 'about';
  state.batch = [];state.shown = 0;
}
function empty(title, detail, icon='✧') {
  const wrap=node('div','empty');
  wrap.append(node('div','empty-mark',icon),node('h3','',title),node('p','',detail));
  root.append(wrap);
}
function renderAbout() {
  const note=node('div','notice','هذا أرشيف شخصي مشفّر. سجلات المحادثات والملفات الأصلية لا تُعرض إلا بعد إدخال رمز الفتح. الملفان archive.enc.json وfiles.enc.json يحتويان على بيانات مشفّرة؛ فكّ التشفير يتم محليًا في المتصفح. رمز الفتح لا يُخزن على الخادم. فهارس الصور والفيديوهات والأغاني تتضمن روابط ومعلومات وصفية؛ لا يعني وجود الرابط أن الملف الأصلي متاح أو موجود ضمن هذا المشروع.');
  root.append(note);
  const links=node('div','subpages');
  const host = hostedApp ? 'https://abdulstarzeki001-sketch.github.io/ech-memories-ska/' : '../';
  const pages=[['صفحة نفسم','home.html'],['الكتابات الأصلية','writings.html'],['رحلة الذكريات','journey.html'],['المشاعر','feelings.html'],['الصور','photos.html'],['الفيديوهات','videos.html'],['الأغاني','songs.html']];
  for (const [label,path] of pages) {
    const a=node('a','subpage',label+' ↗');
    a.href=new URL(path,hostedApp?host:new URL('../',location.href)).href;
    a.target='_blank'; a.rel='noopener noreferrer';
    a.append(node('span','','من الموقع الأصلي')); links.append(a);
  }
  root.append(links);
}
function messageElement(item) {
  const box=node('article','message '+(item.role === 'me' ? 'me' : item.role === 'elham' ? 'elham' : ''));
  const head=node('div','message-head'), who=node('span','',item.speaker || '—'), when=node('time','',item.time || (item.dt||'').slice(11));
  head.append(who,when);box.append(head,node('div','body',item.text||''),node('small','',[item.platform,item.kind,item.source].filter(Boolean).join(' · ')));
  const href=safeUrl(item.url);
  if(href){const link=node('a','media-action','فتح الرابط المرتبط ↗');link.href=href;link.target='_blank';link.rel='noopener noreferrer';box.append(link);}
  return box;
}
function writingsCard(item,index) {
  const box=node('article','writing-card');
  const meta=node('div','writing-meta');meta.append(node('span','',item.info || 'من النص الأصلي'),node('span','',item.language?.toUpperCase() || 'AR'));
  box.append(meta,node('h3','',item.title));
  const body=node('p',item.text.length>350?'clamped':'',item.text);box.append(body);
  const actions=node('div','writing-actions');
  if(item.text.length>350){const expand=node('button','','قراءة النص كاملًا ↓');expand.onclick=()=>{body.classList.toggle('clamped');expand.textContent=body.classList.contains('clamped')?'قراءة النص كاملًا ↓':'طي النص ↑';};actions.append(expand);}
  actions.append(node('span','spacer'));
  const copy=node('button','','نسخ النص');copy.onclick=async()=>{try{await navigator.clipboard.writeText(item.text);copy.textContent='تم النسخ ✓';}catch{copy.textContent='تعذر النسخ';}};actions.append(copy);box.append(actions);
  return box;
}
function mediaCard(item, kind, index) {
  const box=node('article','media-card'), frame=node('div','media-frame');
  const href=item.link||mediaUrl(kind,item.file);
  if(kind==='photo' && href){
    const img=node('img');img.loading='lazy';img.alt=clean(item.title || 'صورة من الأرشيف');img.src=href;
    img.onerror=()=>frame.replaceChildren(node('span','','الصورة غير متاحة'));
    img.onclick=()=>showModal('photo',href);frame.append(img);
  } else frame.append(node('span','',kind==='video'?'▷':kind==='audio'?'♫':'▧'));
  const body=node('div','media-body');body.append(node('span','media-num','ARCHIVE / '+String(index+1).padStart(3,'0')),node('h3','',item.title||item.file));
  if(item.description)body.append(node('p','',item.description));
  if(href){
    if(kind==='photo'){
      const b=node('button','media-action','تكبير الصورة ↗');b.onclick=()=>showModal('photo',href);body.append(b);
    }else if(kind==='video'||(kind==='audio'&&!item.link)){
      const b=node('button','media-action','تشغيل ' + (kind==='video'?'الفيديو':'المقطع') + ' ▶');
      b.onclick=()=>{const p=node(kind==='video'?'video':'audio');p.controls=true;p.playsInline=true;p.preload='metadata';p.src=href;p.style.width='100%';frame.replaceChildren(p);p.play().catch(()=>{});};body.append(b);
    }else{
      const a=node('a','media-action','فتح رابط الأغنية ↗');a.href=href;a.target='_blank';a.rel='noopener noreferrer';body.append(a);
    }
  }
  box.append(frame,body);return box;
}
function fileBytes(record){return b64bytes(record.b64);}
function fileBlob(record){
  return new Blob([fileBytes(record)],{type:record.mime || 'application/octet-stream'});
}
function fileObjectUrl(record){
  const u=URL.createObjectURL(fileBlob(record));state.objectURLs.push(u);return u;
}
function fileElement(file) {
  const row=node('article','file-row'),meta=node('div','file-meta'),actions=node('div','file-actions');
  meta.append(node('strong','',file.path),node('small','',(file.bytes/1024).toFixed(1)+' KB · '+(file.mime||'ملف')));
  const save=node('button','','حفظ');save.onclick=()=>{const a=node('a');a.href=fileObjectUrl(file);a.download=clean(file.path).split('/').pop();a.click();};actions.append(save);
  if (/^(text\/|application\/json|application\/javascript)/.test(file.mime)||/\.(txt|json|csv|html|md|js|css)$/i.test(file.path)){
    const preview=node('button','','قراءة');preview.onclick=()=>{
      const previous=row.querySelector('.file-preview');if(previous){previous.remove();preview.textContent='قراءة';return;}
      const pre=node('pre','file-preview',new TextDecoder().decode(fileBytes(file)).slice(0,120000));
      row.append(pre);preview.textContent='إغلاق';
    };actions.append(preview);
  }else if(file.mime==='application/pdf'||/\.pdf$/i.test(file.path)){
    const open=node('button','','عرض PDF');open.onclick=()=>window.open(fileObjectUrl(file),'_blank','noopener,noreferrer');actions.append(open);
  }
  row.append(meta,actions);return row;
}
function renderBatch() {
  const end=Math.min(state.batch.length,state.shown+state.batchSize);
  if(state.tab==='messages'){
    const list=root.querySelector('.message-list')||node('div','message-list');
    let lastDay=state.shown ? state.batch[state.shown-1]?.day : '';
    for(;state.shown<end;state.shown++){
      const m=state.batch[state.shown];
      if(m.day&&m.day!==lastDay){list.append(node('div','day-divider',m.day));lastDay=m.day;}
      list.append(messageElement(m));
    }
    if(!list.parentElement)root.append(list);
  }else if(state.tab==='writings'){
    const grid=root.querySelector('.writing-grid')||node('div','writing-grid');
    for(;state.shown<end;state.shown++)grid.append(writingsCard(state.batch[state.shown],state.shown));
    if(!grid.parentElement)root.append(grid);
  }else if(['photos','videos','audio'].includes(state.tab)){
    const grid=root.querySelector('.gallery')||node('div','gallery');
    for(;state.shown<end;state.shown++)grid.append(mediaCard(state.batch[state.shown],state.tab==='photos'?'photo':state.tab==='videos'?'video':'audio',state.shown));
    if(!grid.parentElement)root.append(grid);
  }else if(state.tab==='files'){
    const list=root.querySelector('.original-files')||node('div','original-files');
    for(;state.shown<end;state.shown++)list.append(fileElement(state.batch[state.shown]));
    if(!list.parentElement)root.append(list);
  }
  $('more').hidden=state.shown>=state.batch.length;
}
function prepareBatch(items,label) {
  state.batch=items;state.shown=0;
  $('count').textContent=items.length+' '+label;
  if(!items.length){empty('لا توجد عناصر مطابقة','جرّب تعديل البحث أو خيارات التصفية.');return;}
  renderBatch();
}
function render() {
  clearResults();
  if (state.tab==='about'){renderAbout();return;}
  if (state.locked){empty('هذا الأرشيف خاص','اكتب رمز الفتح في البطاقة بالأعلى لتعرض رسائلك وكتاباتك ووسائطك وملفات المصدر دون ZIP.','✦');return;}
  const q=$('search').value.toLocaleLowerCase().trim();
  if(state.tab==='messages'){
    const items=state.messages.filter(m=>{
      if($('scope').value==='direct'&&m.group!=='مباشر')return false;
      if($('scope').value==='other'&&m.group==='مباشر')return false;
      if($('platform').value!=='all'&&m.platform!==$('platform').value)return false;
      return !q||[m.text,m.speaker,m.dt,m.source,m.kind].join(' ').toLocaleLowerCase().includes(q);
    });
    prepareBatch(items,'رسالة وسجلًا'); return;
  }
  if(state.tab==='writings'){
    if(state.writingStatus==='idle'){void loadWritingsData();empty('جارٍ تجهيز الكتابات','نعرض الكتابات المحفوظة من الأرشيف والموقع الأصلي.');return;}
    if(state.writingStatus==='loading'){empty('جارٍ استرجاع الكتابات','نرتب النصوص والخواطر ونص الوداع وكتابات الصور والفيديوهات.');return;}
    const language=$('writingLang').value;
    state.writings=gatherWritings(language);
    updateMetrics();
    const type=$('writingType').value;
    const list=state.writings.filter(w=>(type==='all'||type===w.type)&&(!q||(w.text+' '+w.title+' '+w.info).toLocaleLowerCase().includes(q)));
    if(state.writingStatus==='error')root.append(node('div','notice','تعذر الاتصال بمصدر كتابات نفسم الآن. تظهر النصوص المحفوظة داخل الأرشيف؛ قد تكون بقية الكتابات ناقصة مؤقتًا.'));
    else root.append(node('div','writing-intro','الكتابات من مصادر نفسم الفعلية، بما فيها نصوص الوداع، والرحلة، والذكريات، وتعليقات الصور والفيديوهات.'));
    prepareBatch(list,'نصًا محفوظًا');return;
  }
  if(state.tab==='files'){
    if(state.fileStatus==='idle'){void loadFiles();empty('جارٍ فتح الملفات الأصلية','سنفكّ تشفير 44 ملفًا منفردًا داخل متصفحك.');return;}
    if(state.fileStatus==='loading'){empty('جارٍ فك تشفير الملفات','الملفات تُفتح محليًا، دون تحميل ZIP.');return;}
    if(state.fileStatus==='error'){empty('تعذر الوصول لملفات المصدر','تحقق من الاتصال، وأغلق الأرشيف ثم افتحه مجددًا.');return;}
    root.append(node('div','notice','يمكنك قراءة الملفات النصية أو فتح PDF أو حفظ ملف بعينه. الملفات تحتوي صادرات نصية وبيانات أصلية؛ صور ورسائل الوسائط غير الموجودة في التصدير لا يمكن استعادتها من هذه الفهارس.'));
    prepareBatch(state.originalFiles.filter(f=>!q||clean(f.path).toLocaleLowerCase().includes(q)),'ملفًا');return;
  }
  if(state.tab==='photos'){
    const list=(state.catalog.photoEntries?.length?state.catalog.photoEntries:state.catalog.photos||[]).map((p,i)=>typeof p==='string'?{file:p,title:'صورة '+(i+1),description:''}:{file:p.file,title:p.captions?.ar?.title||('صورة '+(i+1)),description:p.captions?.ar?.text||''});
    prepareBatch(list.filter(x=>!q||(x.title+' '+x.description+' '+x.file).toLocaleLowerCase().includes(q)),'صورة مفهرسة');return;
  }
  if(state.tab==='videos'){
    const list=(state.catalog.videos||[]).map((v,i)=>({file:v.file,title:langText(v.title)||('فيديو '+(i+1)),description:langText(v.caption)}));
    prepareBatch(list.filter(x=>!q||(x.title+' '+x.description+' '+x.file).toLocaleLowerCase().includes(q)),'فيديو مفهرس');return;
  }
  if(state.tab==='audio'){
    const list=[...(state.catalog.songs||[]).map((a,i)=>({title:clean(a.title)||('أغنية '+(i+1)),file:'',link:safeUrl(a.src),description:'من قائمة أغاني الذكريات'})),...Object.entries(state.catalog.pageAudio||{}).map(([p,f])=>({title:'موسيقى '+p,file:f,description:'الصوت المخصص لصفحة '+p}))];
    prepareBatch(list.filter(x=>!q||(x.title+' '+x.file).toLocaleLowerCase().includes(q)),'أغنية ومقطعًا');
  }
}
function showModal(kind,src){
  const href=safeUrl(src);if(!href)return;
  const box=$('lightbox'),area=$('lightboxContent');area.replaceChildren();
  const img=node(kind==='photo'?'img':'video');img.src=href;
  if(kind!=='photo'){img.controls=true;img.playsInline=true;}
  img.onerror=()=>area.replaceChildren(node('p','','الوسيط غير متاح على المصدر الأصلي.'));
  area.append(img);box.hidden=false;document.body.style.overflow='hidden';
}
function closeModal(){
  const el=$('lightbox');el.hidden=true;$('lightboxContent').replaceChildren();document.body.style.overflow='';
}
$('unlockForm').addEventListener('submit',unlockArchive);
$('lockButton').addEventListener('click',lockArchive);
$('showPass').addEventListener('click',()=>{$('archivePass').type=$('archivePass').type==='password'?'text':'password';});
for(const id of ['search','scope','platform','writingType','writingLang'])$(id).addEventListener(id==='search'?'input':'change',render);
$('more').addEventListener('click',renderBatch);
for(const btn of document.querySelectorAll('[data-tab]'))btn.addEventListener('click',()=>{
  state.tab=btn.dataset.tab;$('search').value='';render();
  if(state.tab==='writings'&&!state.locked&&state.writingStatus==='idle')void loadWritingsData();
});
$('closeLightbox').addEventListener('click',closeModal);
$('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))closeModal();});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
render();