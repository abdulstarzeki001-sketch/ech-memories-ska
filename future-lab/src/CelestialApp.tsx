import { useEffect, useMemo, useRef, useState, Suspense, lazy } from 'react';
import type { CSSProperties, ReactNode, PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpLeft, AudioLines, BookOpenText, CirclePause, CirclePlay, Compass, Heart, Home, Image as ImageIcon, Search, Sparkles, Video, Volume2, Waves, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AiStudio, { prepareLocalImage } from './AiStudio';
import './styles.css';
import './celestial.css';

gsap.registerPlugin(ScrollTrigger);
const CelestialScene = lazy(() => import('./CelestialScene'));
type Key = 'home' | 'photos' | 'journey' | 'songs' | 'videos' | 'writings' | 'feelings';
type Entry = { title?: string; file?: string; src?: string; caption?: string; captions?: Record<string,unknown>; quote?: string };
type Manifest = { base?: string; photos?: string[]; photoEntries?: Entry[]; videos?: Entry[]; videoEntries?: Entry[]; songs?: Entry[]; pageTextGroups?: Record<string,unknown>; writings?: Record<string,unknown>; feelings?: Record<string,unknown>; archiveText?: Record<string,unknown> };
type Portal = { key:Key; name:string; eyebrow:string; title:string; desc:string; symbol:LucideIcon; number:string; color:string };
const portals:Portal[] = [
 {key:'home',name:'الرئيسية',eyebrow:'THE OBSERVATORY',title:'خارج حدود الزمن',desc:'المكان الذي تلتقي فيه كل الذكريات.',symbol:Home,number:'00',color:'#cfac76'},
 {key:'photos',name:'الصور',eyebrow:'THE LIGHT ARCHIVE',title:'الضوء الذي لم يغادر',desc:'لقطات تعبر الزمن لتبقى أقرب مما نظن.',symbol:ImageIcon,number:'01',color:'#93c6dc'},
 {key:'journey',name:'الرحلة',eyebrow:'THE TIMELINE',title:'أثرٌ على امتداد الزمن',desc:'لحظات تتصل لتصنع قصة لا تشبه سواها.',symbol:Compass,number:'02',color:'#c0a0e8'},
 {key:'songs',name:'الأغاني',eyebrow:'THE SOUND ROOM',title:'حين تتكلم الموسيقى',desc:'للأصوات قدرة غريبة على إعادة الأماكن.',symbol:AudioLines,number:'03',color:'#b2dbc8'},
 {key:'videos',name:'الفيديوهات',eyebrow:'THE CINEMA',title:'اللحظات تتحرك من جديد',desc:'مشاهد صغيرة تحمل عوالم كاملة.',symbol:Video,number:'04',color:'#cca2bf'},
 {key:'writings',name:'الكتابات',eyebrow:'THE LETTERS',title:'كل ما لم يقله الصمت',desc:'الكلمات التي بقيت حين انتهت الحكايات.',symbol:BookOpenText,number:'05',color:'#dac49b'},
 {key:'feelings',name:'المشاعر',eyebrow:'THE INNER UNIVERSE',title:'ما وراء الكلمات',desc:'بعض الذكريات لا تُرى، بل تُشعَر.',symbol:Heart,number:'06',color:'#e9a9bd'}
];
const n = (x:unknown):string => typeof x === 'string' ? x : '';
const rootUrl = () => new URL(location.pathname.includes('/future-lab/') ? '../' : './',location.href);
const fileLink = (path:string) => new URL(path,rootUrl()).href;
const asset = (base:string|undefined,folder:string,name:string) => {
 if (!base || !name) return '';
 if (/^https?:\/\//i.test(name)) return name;
 return base.replace(/\/$/,'')+'/'+folder+'/'+name.split('/').map(encodeURIComponent).join('/');
};
const currentKey=():Key=>{
 const hash=location.hash.replace(/^#\/?/,'').split('/')[0];
 const pathname=location.pathname.match(/(?:^|\/)(photos|journey|songs|videos|writings|feelings|home)\.html$/)?.[1];
 const found=portals.find(p=>p.key===hash||(!hash&&p.key===pathname));
 return found?.key||'home';
};
function extractText(value:unknown,max=1100,level=0):string[]{
 if(level>5)return [];
 if(typeof value==='string')return value.trim().length>30?[value.trim().slice(0,max)]:[];
 if(Array.isArray(value))return value.flatMap(v=>extractText(v,max,level+1)).slice(0,180);
 if(value&&typeof value==='object')return Object.values(value).flatMap(v=>extractText(v,max,level+1)).slice(0,180);
 return [];
}
const requestAi = async(route:'assistant'|'classify',payload:object,key:string):Promise<Record<string,unknown>>=>{
 const response=await fetch(fileLink('api/ai/'+route),{method:'POST',headers:{'Content-Type':'application/json','X-NAFSAM-AI-Key':key},body:JSON.stringify(payload),cache:'no-store'});
 const data=await response.json().catch(()=>({message:'الاستجابة غير متاحة'})) as Record<string,unknown>;
 if(!response.ok)throw new Error(typeof data.message==='string'?data.message:'الخدمة غير مهيأة ('+response.status+')');
 return data;
};
function Magnetic({children,onClick,className=''}:{children:ReactNode;onClick:()=>void;className?:string}){
 const ref=useRef<HTMLButtonElement>(null);
 const move=(event:RPointerEvent<HTMLButtonElement>)=>{
  if(event.pointerType!=='mouse'||!ref.current)return;
  const bounds=ref.current.getBoundingClientRect();
  ref.current.style.setProperty('--mag-x',((event.clientX-bounds.left-bounds.width/2)*.12)+'px');
  ref.current.style.setProperty('--mag-y',((event.clientY-bounds.top-bounds.height/2)*.12)+'px');
 };
 return <button ref={ref} type="button" onClick={onClick} onPointerMove={move} onPointerLeave={()=>{ref.current?.style.setProperty('--mag-x','0px');ref.current?.style.setProperty('--mag-y','0px')}} className={'cel-magnetic '+className}>{children}</button>;
}
function CosmicFallback(){return <div className="cel-orb-fallback" aria-hidden="true"><i className="cel-orb-heart"/><i className="cel-orbit cel-orbit-one"/><i className="cel-orbit cel-orbit-two"/><span>∞</span></div>}
function Reveal({children,className=''}:{children:ReactNode;className?:string}){return <div className={'cel-reveal '+className}>{children}</div>}
function SectionHeader({kicker,title,desc}: {kicker:string;title:string;desc?:string}){return <Reveal className="cel-section-heading"><div><span className="cel-kicker"><i/> {kicker}</span><h2>{title}</h2>{desc&&<p>{desc}</p>}</div><span className="cel-diamond" aria-hidden="true">✧</span></Reveal>}
function Intro({go,manifest,three,motionOn}:{go:(k:Key)=>void;manifest:Manifest|null;three:boolean;motionOn:boolean}){
 const count=(manifest?.photoEntries?.length||manifest?.photos?.length||0)+(manifest?.videos?.length||0)+(manifest?.songs?.length||0);
 return <><section className="cel-hero">
  <div className="cel-hero-copy">
   <span className="cel-kicker cel-hero-kicker"><i/> NAFSAM — A PRIVATE UNIVERSE OF MEMORIES</span>
   <span className="cel-overline">ليست مجرد ذكريات، بل كونٌ موازٍ</span>
   <h1>حين يصبح <span>الغياب</span><br/>ضوءًا لا ينطفئ<span className="cel-period">.</span></h1>
   <p>رحلة سينمائية عبر الضوء والصوت والزمن. عالم يحتفظ بالأثر، ويمنح كل صورة وكلمة ولحظة مكانها الخاص بين النجوم.</p>
   <div className="cel-hero-buttons"><Magnetic onClick={()=>go('journey')} className="cel-primary">ادخل إلى العالم <ArrowUpLeft size={18}/></Magnetic><Magnetic onClick={()=>go('photos')} className="cel-secondary">استكشف الذكريات <ArrowLeft size={17}/></Magnetic></div>
   <div className="cel-hero-footnote"><span className="cel-fine-rule"/> <span>EST. IN MEMORY <b>—</b> FOREVER IN ORBIT</span></div>
  </div>
  <div className="cel-hero-visual" aria-hidden="true"><div className="cel-scene-aura"/>{three&&motionOn?<Suspense fallback={<CosmicFallback/>}><CelestialScene/></Suspense>:<CosmicFallback/>}<div className="cel-orbit-label cel-orbit-label-a"><b>01</b> FRAGMENTS OF LIGHT <i/></div><div className="cel-orbit-label cel-orbit-label-b">NAFSAM / ∞ / MEMORY</div></div>
  <div className="cel-side-mark">SCROLL TO EXPLORE <span>↓</span></div>
 </section>
 <section className="cel-marquee" aria-label="هوية التصميم"><div>✦ BEYOND TIME <span>—</span> BEYOND SPACE <span>—</span> BEYOND FORGETTING <span>—</span> NAFSAM ✦</div></section>
 <section className="cel-portals"><SectionHeader kicker="DISCOVER / THE ARCHIVE" title="سبعة عوالم، حكاية واحدة" desc="اختر الباب الذي تريد الدخول منه. لكل ذاكرة إيقاعها، ولكل أثر سماؤه."/><div className="cel-portal-grid">{portals.slice(1).map((p,i)=><button className={'cel-portal cel-portal-'+(i+1)+' cel-reveal'} key={p.key} onClick={()=>go(p.key)} type="button" style={{'--tint':p.color} as CSSProperties}><span className="cel-portal-top"><span>{p.number} / 06</span><ArrowUpLeft size={20}/></span><div className="cel-portal-symbol"><p.symbol size={37} strokeWidth={1.1}/></div><span className="cel-portal-bottom"><small>{p.eyebrow}</small><strong>{p.name}</strong><em>{p.desc}</em></span></button>)}</div></section>
 <section className="cel-manifesto cel-reveal"><div className="cel-manifesto-art" aria-hidden="true"><span>✳</span></div><div><span className="cel-kicker">THE MEMORY CONSTELLATION</span><h2>كل نهاية تحمل<br/><em>بداية ضوءٍ آخر.</em></h2><p>لا نعيد الزمن إلى الوراء؛ نعيد اكتشاف الأشياء التي جعلته يستحق أن نتذكره.</p><Magnetic onClick={()=>go('feelings')} className="cel-secondary">اكتشف المشاعر <ArrowUpLeft size={18}/></Magnetic></div></section>
 <section className="cel-stats cel-reveal"><div><span>06</span><small>أقسام الأرشيف</small></div><div><span>{count||'∞'}</span><small>وسائط موثّقة في الفهرس</small></div><div><span>∞</span><small>مدى الذكرى</small></div></section></>;
}
function Gallery({data}:{data:Manifest|null}){
 const [visible,setVisible]=useState(18),[selected,setSelected]=useState<string|null>(null);
 const entries=data?.photoEntries?.length?data.photoEntries:(data?.photos||[]).map(file=>({file}));
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setSelected(null)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
 return <><div className="cel-count"><span>LIGHT ARCHIVE</span><span>{entries.length} MEMORY FRAMES</span></div><div className="cel-gallery">{entries.slice(0,visible).map((entry,index)=>{const name=n(entry.file);const url=asset(data?.base,'images/_thumbs/all_photos',name);const large=asset(data?.base,'images/all_photos',name);return <button type="button" key={name+index} className={'cel-photo cel-photo-'+(index%7)+' cel-reveal'} onClick={()=>setSelected(large)} aria-label={'عرض الصورة '+(index+1)}><img src={url} loading={index<3?'eager':'lazy'} decoding="async" alt={'من أرشيف نفسم - '+(index+1)} onError={e=>{const el=e.currentTarget;if(el.src!==large)el.src=large}}/><span className="cel-photo-label"><small>FRAME / {String(index+1).padStart(3,'0')}</small><ArrowUpLeft size={20}/></span></button>})}</div>{visible<entries.length&&<button className="cel-load-more" type="button" onClick={()=>setVisible(x=>x+18)}>اكتشف مزيدًا من الضوء <span>+18</span></button>}
 <AnimatePresence>{selected&&<motion.div className="cel-lightbox" role="dialog" aria-modal="true" aria-label="عرض الصورة" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><button type="button" onClick={()=>setSelected(null)} aria-label="إغلاق الصورة"><X/></button><img src={selected} alt="صورة من الأرشيف" onClick={e=>e.stopPropagation()}/></motion.div>}</AnimatePresence></>;
}
function Cinema({data}:{data:Manifest|null}){
 const [visible,setVisible]=useState(12),[playing,setPlaying]=useState<string|null>(null);
 const items=data?.videoEntries?.length?data.videoEntries:(data?.videos||[]);
 return <><div className="cel-count"><span>MOTION ARCHIVE / SELECTED SCENES</span><span>{items.length} FILMS</span></div><div className="cel-video-grid">{items.slice(0,visible).map((entry,index)=>{const file=n(entry.file),url=asset(data?.base,'media',file),poster=asset(data?.base,'posters',file.replace(/\.[^.]+$/,'')+'.jpg'),title=n(entry.title)||'لقطة من الذاكرة';return <article className="cel-video-card cel-reveal" key={file+index}><div className="cel-video-frame">{playing===file?<video controls playsInline preload="metadata" autoPlay poster={poster} src={url} onEnded={()=>setPlaying(null)}/>:<button type="button" onClick={()=>setPlaying(file)} aria-label={'تشغيل '+title}><img src={poster} alt="" loading="lazy"/><span className="cel-play"><CirclePlay size={45} strokeWidth={1}/></span></button>}</div><div className="cel-video-info"><span>SCENE {String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{n(entry.caption).slice(0,110)}</p></div></article>})}</div>{visible<items.length&&<button type="button" className="cel-load-more" onClick={()=>setVisible(x=>x+12)}>المزيد من المشاهد <span>+12</span></button>}</>;
}
function MusicRoom({data}:{data:Manifest|null}){
 const [current,setCurrent]=useState<number|null>(null);
 const items=data?.songs||[];
 return <><div className="cel-music-feature cel-reveal"><span className="cel-vinyl" aria-hidden="true"><i/></span><div><small>THE SOUND ROOM</small><h2>كل لحن باب<br/>إلى لحظة.</h2><p>استمع إلى قائمة الأغاني المحفوظة في أرشيفك.</p></div></div><div className="cel-tracklist">{items.map((song,i)=><button type="button" className={'cel-track cel-reveal '+(i===current?'is-playing':'')} key={n(song.src)+i} onClick={()=>setCurrent(v=>v===i?null:i)}><span className="cel-track-num">{String(i+1).padStart(2,'0')}</span><span className="cel-track-icon">{i===current?<CirclePause size={23}/>:<CirclePlay size={23}/>}</span><span className="cel-track-title">{n(song.title)||'لحن من الذاكرة'}</span><span className="cel-track-action">{i===current?'الآن':'استمع'}</span></button>)}</div>{current!==null&&items[current]&&<div className="cel-audio-player"><Volume2 size={19}/><div><strong>{n(items[current].title)}</strong><audio key={current} controls autoPlay preload="none" src={n(items[current].src)}/></div><button onClick={()=>setCurrent(null)} type="button" aria-label="إغلاق المشغل"><X size={20}/></button></div>}</>;
}
function Words({data,mode}:{data:Manifest|null;mode:'writings'|'journey'|'feelings'}){
 const [shown,setShown]=useState(8);
 const inputs:unknown=mode==='journey'?data?.pageTextGroups?.journey:mode==='writings'?(data?.writings?.ar||data?.pageTextGroups?.writings):data?.feelings;
 const all=useMemo(()=>[...new Set(extractText(inputs,1000))].filter(s=>s.length>30),[inputs]);
 const fallback=mode==='journey'?'كانت الرحلة أكبر من مجرد مكان؛ كانت لحظة نحتفظ بها في القلب.':mode==='writings'?'لا تزال الكلمات قادرة على حفظ الأشياء التي غادرت.':'بعض المشاعر لا يمكن اختصارها في صورة.';
 return <div className="cel-letters"><div className="cel-letters-lead cel-reveal"><span>✳</span><h2>{mode==='journey'?'خريطة من اللحظات':mode==='writings'?'رسائل عبر الزمن':'مسافة بين القلب والسماء'}</h2><p>النصوص التالية مأخوذة من محتوى الأرشيف الأصلي عند توفرها.</p></div><div className="cel-letter-list">{(all.length?all.slice(0,shown):[fallback]).map((str,i)=><article key={i} className="cel-letter cel-reveal"><span>{String(i+1).padStart(2,'0')} / {mode==='journey'?'TIMELINE':mode==='writings'?'LETTER':'FEELING'}</span><p>{str}</p><i>✦</i></article>)}</div>{shown<all.length&&<button type="button" className="cel-load-more" onClick={()=>setShown(v=>v+8)}>اقرأ المزيد <span>+08</span></button>}</div>;
}
function ArchivePage({portal,data,go}:{portal:Portal;data:Manifest|null;go:(k:Key)=>void}){
 const Symbol=portal.symbol;
 return <><section className="cel-inner-head" style={{'--tint':portal.color} as CSSProperties}><span className="cel-kicker">NAFSAM / {portal.eyebrow}</span><div className="cel-inner-main"><div><p className="cel-page-index">{portal.number} / 06 — MEMORY SECTOR</p><h1>{portal.title}</h1><p>{portal.desc}</p><div className="cel-page-actions"><Magnetic className="cel-secondary" onClick={()=>go('home')}>عودة إلى البداية <ArrowLeft size={18}/></Magnetic><a href={fileLink('classic/'+portal.key+'.html')} className="cel-classic">النسخة الأصلية <ArrowUpLeft size={16}/></a></div></div><div className="cel-inner-emblem" aria-hidden="true"><Symbol size={110} strokeWidth={.55}/><i/></div></div></section><section className="cel-archive-body">
  {portal.key==='photos'?<Gallery data={data}/>:portal.key==='videos'?<Cinema data={data}/>:portal.key==='songs'?<MusicRoom data={data}/>:<Words mode={portal.key==='home'?'writings':portal.key} data={data}/>}
 </section></>;
}
export default function CelestialApp(){
 const [active,setActive]=useState<Key>(currentKey);
 const [data,setData]=useState<Manifest|null>(null);
 const [error,setError]=useState('');
 const [search,setSearch]=useState(false);
 const [term,setTerm]=useState('');
 const [aiOpen,setAiOpen]=useState(false);
 const [motionOn,setMotionOn]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&localStorage.getItem('nafsam-motion-off')!=='1');
 const [can3d,setCan3d]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const searchInput=useRef<HTMLInputElement>(null);
 const portal=portals.find(p=>p.key===active)||portals[0];
 const results=useMemo(()=>portals.filter(p=>(p.name+p.title+p.eyebrow).toLowerCase().includes(term.trim().toLowerCase())),[term]);
 const go=(key:Key)=>{setActive(key);setSearch(false);if(location.hash!=='#/'+key)location.hash='/'+key;window.scrollTo({top:0,behavior:'instant'})};
 useEffect(()=>{const change=()=>setActive(currentKey());addEventListener('hashchange',change);return()=>removeEventListener('hashchange',change)},[]);
 useEffect(()=>{let canceled=false;fetch(fileLink('nafsam-media.json')).then(res=>{if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}).then((json:Manifest)=>{if(!canceled)setData(json)}).catch(()=>{if(!canceled)setError('تعذر تحميل الفهرس حاليًا. حاول إعادة تحميل الصفحة.')});return()=>{canceled=true}},[]);
 useEffect(()=>{const check=()=>{const small=window.matchMedia('(max-width: 959px)').matches;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const conn=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;let webgl=false;try{const c=document.createElement('canvas');webgl=!!(c.getContext('webgl2')||c.getContext('webgl'))}catch{}setCan3d(!small&&!reduce&&!conn?.saveData&&webgl)};check();addEventListener('resize',check,{passive:true});return()=>removeEventListener('resize',check)},[]);
 useEffect(()=>{try{localStorage.setItem('nafsam-motion-off',motionOn?'0':'1')}catch{}},[motionOn]);
 useEffect(()=>{const handle=(e:KeyboardEvent)=>{if(e.key==='Escape'){setSearch(false);setAiOpen(false)}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(v=>!v)}};addEventListener('keydown',handle);return()=>removeEventListener('keydown',handle)},[]);
 useEffect(()=>{if(search)searchInput.current?.focus()},[search]);
 useEffect(()=>{if(!motionOn||!root.current)return;const ctx=gsap.context(()=>{const nodes=gsap.utils.toArray<HTMLElement>('.cel-reveal');nodes.forEach(node=>{gsap.fromTo(node,{opacity:0,y:28},{opacity:1,y:0,duration:.95,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 98%',once:true}})})},root);return()=>ctx.revert()},[active,data,motionOn]);
 return <div ref={root} className={'cel-app '+(motionOn?'':'cel-still')} dir="rtl">
  <div aria-hidden="true" className="cel-cosmos"><i/><i/><i/><span/></div>
  <header className="cel-header">
   <button type="button" className="cel-brand" onClick={()=>go('home')} aria-label="نفسم، الرئيسية"><span className="cel-brand-sign">✳</span><span><strong>NAFSAM</strong><small>THE MEMORY UNIVERSE</small></span></button>
   <div className="cel-header-center"><span className="cel-live-dot"/> <span>ARCHIVE / BEYOND TIME</span></div>
   <div className="cel-head-actions"><button type="button" className="cel-icon-btn cel-ai-btn" onClick={()=>setAiOpen(true)} title="استوديو الذكريات" aria-label="استوديو الذكريات"><Sparkles size={19}/><span>AI STUDIO</span></button><button type="button" className="cel-icon-btn" onClick={()=>setSearch(true)} aria-label="البحث في الأقسام"><Search size={20}/></button><button type="button" className="cel-icon-btn" onClick={()=>setMotionOn(v=>!v)} aria-label={motionOn?'إيقاف المؤثرات':'تشغيل المؤثرات'} aria-pressed={!motionOn}><Waves size={20}/></button></div>
  </header>
  <main id="cel-content" className="cel-main">
   <AnimatePresence mode="wait" initial={false}>{active==='home'?<motion.div key="home" initial={motionOn?{opacity:0,y:18}:false} animate={{opacity:1,y:0}} exit={motionOn?{opacity:0,y:-12}:undefined} transition={{duration:.5}}><Intro go={go} manifest={data} three={can3d} motionOn={motionOn}/></motion.div>:<motion.div key={portal.key} initial={motionOn?{opacity:0,y:18}:false} animate={{opacity:1,y:0}} exit={motionOn?{opacity:0,y:-12}:undefined} transition={{duration:.5}}><ArchivePage portal={portal} data={data} go={go}/></motion.div>}</AnimatePresence>
   {error&&<div className="cel-error" role="status">{error}</div>}
  </main>
  <footer className="cel-footer"><span>✳ NAFSAM / THE CELESTIAL ARCHIVE</span><span>بعض الأشياء خُلقت لتبقى.</span><a href={fileLink('classic/index.html')}>الأرشيف الأصلي <ArrowUpLeft size={15}/></a></footer>
  <nav className="cel-bottom-nav" aria-label="تنقل أقسام الأرشيف">{portals.map(p=>{const Icon=p.symbol;return <button key={p.key} type="button" title={p.name} aria-current={active===p.key?'page':undefined} className={active===p.key?'is-active':''} onClick={()=>go(p.key)}><Icon size={19} strokeWidth={1.8}/><span>{p.name}</span></button>})}</nav>
  <AnimatePresence>{search&&<motion.div className="cel-search-shade" role="presentation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.currentTarget===e.target)setSearch(false)}}><section className="cel-search-panel" role="dialog" aria-modal="true" aria-label="بحث نفسم"><div className="cel-search-header"><span>✳ بوابة الاستكشاف</span><button type="button" onClick={()=>setSearch(false)} aria-label="إغلاق"><X/></button></div><label className="cel-search-input"><Search size={19}/><input ref={searchInput} value={term} onChange={e=>setTerm(e.target.value)} placeholder="إلى أي عالم تريد أن تذهب؟"/></label><div className="cel-search-results">{results.length?results.map(p=><button type="button" key={p.key} onClick={()=>go(p.key)}><p.symbol size={22}/><span>{p.name} <small>{p.eyebrow}</small></span><ArrowUpLeft size={18}/></button>):<p>لا توجد نتائج مطابقة.</p>}</div><small>بحث محلي عن الأقسام، لا يرسل بياناتك للخارج.</small></section></motion.div>}</AnimatePresence>
  {aiOpen&&<AiStudio onClose={()=>setAiOpen(false)} request={requestAi} prepareImage={prepareLocalImage}/>}
 </div>;
}