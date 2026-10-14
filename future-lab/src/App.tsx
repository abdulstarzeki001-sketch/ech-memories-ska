import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpLeft, AudioLines, BookOpenText, Check, ChevronLeft, Command, Compass, Heart, Home, Image, Menu, MoonStar, Search, Sparkles, Video, Waves, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);
const OrbScene = lazy(() => import('./OrbScene'));

type Key = 'home' | 'photos' | 'journey' | 'songs' | 'videos' | 'writings' | 'feelings';
type Module = { key:Key; label:string; en:string; line:string; intro:string; icon:LucideIcon; number:string; tint:string; category:string; legacy:string };
const modules:Module[] = [
 {key:"home",label:"الرئيسية",en:"HOME",line:"المحطة المركزية",intro:"من هنا تبدأ رحلتك داخل عالم نفسم.",icon:Home,number:"00",tint:"#95d9f1",category:"المركز",legacy:"home.html"},
 {key:"photos",label:"الصور",en:"VISUAL ARCHIVE",line:"الضوء الذي لم يغادر",intro:"كل لقطة نافذة إلى لحظة لم يعد بالإمكان إعادتها.",icon:Image,number:"01",tint:"#99cbff",category:"أرشيف بصري",legacy:"photos.html"},
 {key:"journey",label:"الرحلة",en:"SPACE / TIME",line:"على امتداد الزمن",intro:"رحلة تجمع اللحظات والأماكن والقصص في مسار واحد.",icon:Compass,number:"02",tint:"#b69cff",category:"خط زمني",legacy:"journey.html"},
 {key:"songs",label:"الأغاني",en:"SONIC MEMORY",line:"كل ما تركه الصوت",intro:"ألحان بقي صداها بعد أن غادر الوقت.",icon:AudioLines,number:"03",tint:"#a0e9e0",category:"مكتبة صوتية",legacy:"songs.html"},
 {key:"videos",label:"الفيديوهات",en:"MOTION VAULT",line:"اللحظات تتحرك من جديد",intro:"مشاهد تتحول من أرشيف ساكن إلى حكاية متحركة.",icon:Video,number:"04",tint:"#e5b6ef",category:"سينما الذكريات",legacy:"videos.html"},
 {key:"writings",label:"الكتابات",en:"WORDS / ECHO",line:"ما لم يقله الصمت",intro:"نصوص احتفظت بما لم تتمكن الصور من قوله.",icon:BookOpenText,number:"05",tint:"#efcd96",category:"أرشيف مكتوب",legacy:"writings.html"},
 {key:"feelings",label:"المشاعر",en:"EMOTION CORE",line:"أعمق من الكلمات",intro:"مساحة تحفظ الأثر الإنساني خلف كل ذكرى.",icon:Heart,number:"06",tint:"#f0a9c9",category:"مسارات الشعور",legacy:"feelings.html"}
];
const highlights=[{icon:MoonStar,title:"المجرة",caption:"أضواء كونية وعمق بصري هادئ"},{icon:Sparkles,title:"الذكاء البصري",caption:"بحث وتنقل مباشر بين العوالم"},{icon:Waves,title:"الحركة",caption:"انتقالات سينمائية محسوبة"}];
const currentKey=():Key=>{const k=location.hash.replace(/^#\/?/,'').split('/')[0];return modules.find(x=>x.key===k)?.key||'home'};
const initialMotion=()=>{try{return localStorage.getItem('nafsam_motion_off')!=='true'&&!matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return true}};
function VisualFallback(){return <div className="orb-fallback" aria-hidden="true"><i className="orb-core"/><i className="orbit orbit-a"/><i className="orbit orbit-b"/><i className="orbit-dot"/></div>}
function Dock({active,onNavigate}:{active:Key;onNavigate:(key:Key)=>void}){
return <nav aria-label="التنقل الرئيسي" className="bottom-dock">{modules.map(item=>{const Icon=item.icon;return <button key={item.key} className={'dock-item '+(active===item.key?'selected':'')} type="button" onClick={()=>onNavigate(item.key)} aria-current={active===item.key?'page':undefined} title={item.label}><Icon size={19} strokeWidth={1.8}/><span>{item.label}</span></button>})}</nav>}
function ModuleCard({item,onNavigate}:{item:Module;onNavigate:(key:Key)=>void}){
const Icon=item.icon;
return <button type="button" onClick={()=>onNavigate(item.key)} className="module-card reveal" style={{'--tint':item.tint} as CSSProperties}>
 <span className="card-light"/><span className="card-top"><span className="card-sequence">{item.number} / NAFSAM</span><ArrowUpLeft size={19}/></span>
 <span className="card-orbit"><Icon size={31} strokeWidth={1.3}/></span>
 <span className="card-bottom"><span className="card-en">{item.en}</span><strong>{item.label}</strong><span className="card-sub">{item.line}</span></span>
 </button>}
function ModuleDetail({module,onNavigate}:{module:Module;onNavigate:(key:Key)=>void}){
 const Icon=module.icon;
 return <div className="inside-page">
  <div className="page-top reveal"><div><span className="tiny-label">NAFSAM / {module.en}</span><p className="breadcrumb">الذاكرة <ChevronLeft size={14}/> {module.label}</p></div><span className="page-number">{module.number} / 06</span></div>
  <div className="detail-hero reveal" style={{'--tint':module.tint} as CSSProperties}><div className="detail-copy"><span className="overline"><span className="live-dot"/> {module.category}</span><h1>{module.line}</h1><p>{module.intro}</p><div className="detail-buttons"><a className="primary-cta" href={'../'+module.legacy}>فتح القسم الأصلي <ArrowUpLeft size={18}/></a><button type="button" className="ghost-cta" onClick={()=>onNavigate('home')}>العودة للرئيسية <ArrowLeft size={18}/></button></div></div><div className="detail-graphic" aria-hidden="true"><div className="detail-ring ring-one"/><div className="detail-ring ring-two"/><Icon size={100} strokeWidth={.55}/></div></div>
  <div className="detail-info reveal"><section className="detail-info-card"><span className="tiny-label">ARCHIVE INTEGRITY</span><h2>ذكرياتك كما هي</h2><p>النموذج الجديد لا يستبدل الصور أو الكتابات ولا يعدّل بيانات الأرشيف. اضغط «فتح القسم الأصلي» للوصول إلى محتواك الموجود.</p><span className="confirmation"><Check size={15}/> المحتوى الأصلي محفوظ</span></section><section className="detail-info-card"><span className="tiny-label">EXPLORE FURTHER</span><h2>بوابة أخرى</h2><p>انتقل بين العوالم السبعة عبر شريط التنقل الثابت أسفل الشاشة.</p><button type="button" className="inline-link" onClick={()=>onNavigate(modules[(modules.findIndex(m=>m.key===module.key)+1)%modules.length].key)}>المحطة التالية <ArrowLeft size={17}/></button></section></div>
 </div>;
}
export default function App(){
 const [active,setActive]=useState<Key>(currentKey);
 const [motionOn,setMotionOn]=useState(initialMotion);
 const [searchOpen,setSearchOpen]=useState(false);
 const [query,setQuery]=useState('');
 const [can3d,setCan3d]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const searchInput=useRef<HTMLInputElement>(null);
 const chosen=modules.find(m=>m.key===active)||modules[0];
 const results=useMemo(()=>modules.filter(m=>m.label.includes(query.trim())||m.en.toLowerCase().includes(query.trim().toLowerCase())||m.line.includes(query.trim())),[query]);
 const navigate=(key:Key)=>{if(location.hash!=='#/'+key)location.hash='/'+key;setActive(key);setSearchOpen(false);window.scrollTo({top:0,behavior:'instant'})};
 useEffect(()=>{const onHash=()=>{setActive(currentKey());window.scrollTo(0,0)};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>{try{localStorage.setItem('nafsam_motion_off',String(!motionOn))}catch{}},[motionOn]);
 useEffect(()=>{const update=()=>{let supported=false;try{const c=document.createElement('canvas');supported=!!(c.getContext('webgl2')||c.getContext('webgl'))}catch{}const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;setCan3d(window.matchMedia('(min-width: 850px)').matches&&supported&&!connection?.saveData&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)};update();window.addEventListener('resize',update,{passive:true});return()=>window.removeEventListener('resize',update)},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(s=>!s)}if(e.key==='Escape')setSearchOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 useEffect(()=>{if(searchOpen){searchInput.current?.focus();document.body.style.overflow='hidden'}else document.body.style.overflow='';return()=>{document.body.style.overflow=''}},[searchOpen]);
 useEffect(()=>{if(!motionOn||!root.current)return;const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>{gsap.fromTo(el,{opacity:0,y:26},{opacity:1,y:0,duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}})})},root);return()=>ctx.revert()},[active,motionOn]);
 return <div className={'experience '+(!motionOn?'reduce-motion':'')} ref={root} dir="rtl">
  <div className="ambient-world" aria-hidden="true"><div className="starfield starfield-a"/><div className="starfield starfield-b"/><div className="aurora aurora-a"/><div className="aurora aurora-b"/><div className="grid-horizon"/></div>
  <header className="site-header"><a className="brand" href="#/home" onClick={e=>{e.preventDefault();navigate('home')}} aria-label="نفسم الرئيسية"><span className="brand-symbol"><Sparkles size={21}/></span><span className="brand-copy"><strong>NAFSAM</strong><small>FUTURE MEMORY SYSTEM</small></span></a>
  <span className="header-center"><span className="green-dot"/> النظام متصل <span className="header-divider"/> <span dir="ltr">20:99 / CORE</span></span>
  <div className="header-actions"><button type="button" className="header-button" onClick={()=>setSearchOpen(true)} aria-label="البحث"><Search size={18}/><span>بحث</span><kbd>⌘ K</kbd></button><button type="button" className="header-button square" aria-label={motionOn?'تعطيل الأنيميشن':'تشغيل الأنيميشن'} aria-pressed={!motionOn} onClick={()=>setMotionOn(v=>!v)}><Waves size={19}/></button><a className="header-button square original-link" aria-label="فتح الموقع الأصلي" title="الموقع الأصلي" href="../index.html"><Menu size={19}/></a></div>
  </header>
  <main id="main-content" className="page-container">
    <AnimatePresence mode="wait">
      {active==='home'?
      <motion.div key="home" initial={motionOn?{opacity:0,y:14}:false} animate={{opacity:1,y:0}} exit={motionOn?{opacity:0,y:-10}:{opacity:0}} transition={{duration:.38}}>
       <section className="hero-section"><div className="hero-text-col"><div className="status-pill"><span className="green-dot"/> <span dir="ltr">PRIVATE UNIVERSE / V.2099</span></div><p className="hero-kicker">حين تصبح الذكريات عالمًا كاملًا</p><h1>ما تبقّى من<br/><span>الزمن... يضيء.</span></h1><p className="hero-lede">عالم نفسم الخاص. بين سكون الفضاء وذكاء المستقبل، تتحول الصور والرحلة والأغاني والكتابات إلى مجرّة من الذكريات.</p><div className="hero-actions"><button type="button" className="primary-cta" onClick={()=>navigate('journey')}>ابدأ الرحلة <ArrowUpLeft size={20}/></button><a href="../home.html" className="ghost-cta">الأرشيف الأصلي <ArrowLeft size={18}/></a></div><div className="hero-meta"><span>✦ تجربة تفاعلية</span><span>✦ مساحة خاصة</span><span>✦ مصمم للآيفون</span></div></div>
       <div className="hero-art"><div className="art-backdrop"/>{can3d&&motionOn?<Suspense fallback={<VisualFallback/>}><OrbScene/></Suspense>:<VisualFallback/>}<div className="orbit-caption orbit-caption-a"><span className="signal"/> NAFSAM SYSTEM <small>ONLINE</small></div><div className="orbit-caption orbit-caption-b"><span>✧</span> MEMORY / CORE <small>2099</small></div><span className="hero-art-coordinate" dir="ltr">N 36° 11′  /  ∞</span></div></section>
       <section className="feature-bar reveal">{highlights.map(({icon:Icon,title,caption})=><div className="feature" key={title}><span className="feature-icon"><Icon size={21}/></span><div><strong>{title}</strong><small>{caption}</small></div></div>)}</section>
       <section className="modules-area"><div className="section-title reveal"><div><span className="tiny-label">EXPLORE THE ARCHIVE / 06 SECTORS</span><h2>بوابات <em>الذاكرة</em></h2><p>ستة عوالم؛ لكل عالم أثر لا يشبه الآخر.</p></div><span className="section-counter">01 — 06</span></div><div className="module-grid">{modules.slice(1).map(item=><ModuleCard item={item} key={item.key} onNavigate={navigate}/>)}</div></section>
       <section className="final-banner reveal"><div><span className="tiny-label">BEYOND SPACE. BEYOND TIME.</span><h2>بعض الأشياء لا ترحل.<br/>إنها تغيّر شكل وجودها فقط.</h2></div><button type="button" className="ghost-cta" onClick={()=>navigate('feelings')}>ادخل إلى المشاعر <ArrowUpLeft size={18}/></button></section>
      </motion.div>:
      <motion.div key={chosen.key} initial={motionOn?{opacity:0,y:12}:false} animate={{opacity:1,y:0}} exit={motionOn?{opacity:0,y:-10}:{opacity:0}} transition={{duration:.35}}><ModuleDetail module={chosen} onNavigate={navigate}/></motion.div>}
    </AnimatePresence>
  </main>
  <footer className="site-footer"><span>© NAFSAM · MEMORY UNIVERSE</span><span>صُنعت التفاصيل لتبقى.</span><a href="../index.html">العودة إلى البوابة <ArrowUpLeft size={13}/></a></footer>
  <Dock active={active} onNavigate={navigate}/>
  <AnimatePresence>{searchOpen&&<motion.div className="search-shade" role="presentation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false)}}><motion.div role="dialog" aria-modal="true" aria-label="مركز البحث والتنقل" className="search-dialog" initial={{y:15,scale:.98}} animate={{y:0,scale:1}} exit={{y:10,opacity:0}}><div className="search-title"><span><Command size={20}/> مساعد التنقل</span><button type="button" className="icon-close" onClick={()=>setSearchOpen(false)} aria-label="إغلاق"><X size={21}/></button></div><p className="search-notice">بحث محلي في أقسام نفسم. لا يُرسل أي نص إلى خادم ذكاء اصطناعي.</p><div className="search-input"><Search size={20}/><input ref={searchInput} value={query} onChange={e=>setQuery(e.target.value)} placeholder="إلى أي عالم تريد الذهاب؟" aria-label="ابحث عن قسم"/></div><div className="search-list">{results.length?results.map(item=>{const Icon=item.icon;return <button type="button" key={item.key} onClick={()=>navigate(item.key)}><Icon size={19}/><span>{item.label}<small>{item.en}</small></span><ArrowUpLeft size={17}/></button>}):<p className="empty-results">لا يوجد قسم مطابق.</p>}</div><div className="search-hint"><Sparkles size={14}/> تنقّل سريع بلا جمع لبياناتك.</div></motion.div></motion.div>}</AnimatePresence>
  <a className="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
 </div>;
}