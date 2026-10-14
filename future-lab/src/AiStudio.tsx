import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, BrainCircuit, CheckCircle2, FileText, ImagePlus, Loader2, LockKeyhole, Search, ShieldCheck, Sparkles, Tags, X } from 'lucide-react';

export type AiReply = Record<string, unknown>;
export type AiRequest = (route: 'assistant' | 'classify', payload: object, key: string) => Promise<AiReply>;
export type PreparedImage = { data: string; mimeType: string };
export type ImagePreparer = (file: File) => Promise<PreparedImage>;
type Props = { onClose: () => void; request: AiRequest; prepareImage: ImagePreparer };
type Source = { id: string; title: string; text: string };
type Classification = { name: string; label: string; tags: string[]; description: string; date: string | null };
const categories = ['أشخاص', 'أماكن', 'رحلات', 'مناسبات', 'مشاعر', 'أغاني', 'نصوص', 'أخرى'];
function normalize(value: string) { return value.toLowerCase().replace(/[ًٌٍَُِّْ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim(); }
function bestSources(question: string, content: string): Source[] {
  const chunks = content.split(/\n\s*\n/g).map(x => x.trim()).filter(Boolean).slice(0, 120);
  const words = normalize(question).split(/\s+/).filter(w => w.length > 2);
  return chunks.map((text, i) => {
    const lowered = normalize(text);
    const score = words.reduce((n, word) => n + (lowered.includes(word) ? 1 : 0), 0);
    return { id: String(i + 1), title: 'مقطع ' + (i + 1), text: text.slice(0, 3500), score };
  }).sort((a, b) => b.score - a.score).slice(0, 5).map(({ id, title, text }) => ({ id, title, text }));
}
export async function prepareLocalImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) throw new Error('اختر صورة بصيغة يدعمها المتصفح.');
  const img = new Image();
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('تعذر قراءة الصورة. جرّب JPG أو PNG.'));
      img.src = url;
    });
    const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight), Math.sqrt(1_900_000 / (img.naturalWidth * img.naturalHeight)));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('المتصفح لا يدعم تجهيز هذه الصورة.');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL('image/jpeg', .78).split(',')[1], mimeType: 'image/jpeg' };
  } finally { URL.revokeObjectURL(url); }
}
export default function AiStudio({ onClose, request, prepareImage }: Props) {
  const [tab, setTab] = useState<'assistant' | 'classify'>('assistant');
  const [key, setKey] = useState('');
  const [memory, setMemory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [used, setUsed] = useState<Source[]>([]);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [classified, setClassified] = useState<Classification[]>([]);
  const [working, setWorking] = useState(false);
  const [problem, setProblem] = useState('');
  const [done, setDone] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalWords = useMemo(() => memory.trim().split(/\s+/).filter(Boolean).length, [memory]);
  async function loadFile(file?: File) {
    if (!file) return;
    if (file.size > 140_000 || !/\.(txt|md|json)$/i.test(file.name)) { setProblem('الاستيراد يدعم ملفات TXT وMD وJSON حتى 140 كيلوبايت.'); return; }
    const value = await file.text();
    setMemory(old => (old ? old + '\n\n' : '') + value.slice(0, 120_000));
    setProblem('');
  }
  async function ask() {
    if (!question.trim()) { setProblem('اكتب سؤالك أولًا.'); return; }
    if (memory.trim().length < 15) { setProblem('أضف ملاحظات أو استورد ملفًا أولًا حتى تكون الإجابة مستندة إلى بيانات.'); return; }
    const sources = bestSources(question, memory);
    setWorking(true); setProblem(''); setAnswer('');
    try {
      const response = await request('assistant', { question: question.trim().slice(0, 1000), sources }, key);
      if (typeof response.answer !== 'string') throw new Error('استجابة المساعد غير مكتملة.');
      setAnswer(response.answer);
      setUsed(sources);
    } catch (err) { setProblem(err instanceof Error ? err.message : 'فشل الاتصال بخدمة المساعد.'); }
    finally { setWorking(false); }
  }
  async function classify() {
    if (!text.trim() && photos.length === 0) { setProblem('ألصق نصًا أو اختر صورًا لتحليلها.'); return; }
    setProblem(''); setWorking(true); setDone(0); setClassified([]);
    const items: { name: string; image?: PreparedImage; text?: string }[] = [];
    if (text.trim()) items.push({ name: 'النص المُدخل', text: text.trim().slice(0, 8000) });
    try {
      for (const file of photos.slice(0, 6)) items.push({ name: file.name.slice(0, 100), image: await prepareImage(file) });
      const results: Classification[] = [];
      for (const item of items) {
        const response = await request('classify', { ...item, categories }, key);
        const label = typeof response.label === 'string' && categories.includes(response.label) ? response.label : 'أخرى';
        const tags = Array.isArray(response.tags) ? response.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 6) : [];
        const description = typeof response.description === 'string' ? response.description.slice(0, 400) : '';
        const date = typeof response.date === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(response.date) ? response.date : null;
        results.push({ name: item.name, label, tags, description, date });
        setClassified([...results]); setDone(results.length);
      }
    } catch (err) { setProblem(err instanceof Error ? err.message : 'فشل التصنيف.'); }
    finally { setWorking(false); }
  }
  const groups = useMemo(() => {
    const map = new Map<string, Classification[]>();
    for (const row of classified) map.set(row.label, [...(map.get(row.label) || []), row]);
    return [...map.entries()];
  }, [classified]);
  return <div className="ai-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="ai-panel" role="dialog" aria-modal="true" aria-label="نفسم الذكي" dir="rtl">
      <header className="ai-head"><div className="ai-heading"><span className="ai-logo"><BrainCircuit size={25}/></span><div><span className="ai-small">NAFSAM / INTELLIGENCE CORE</span><h2>ذكاء الذاكرة</h2></div></div><button type="button" aria-label="إغلاق" className="ai-close" onClick={onClose}><X size={23}/></button></header>
      <div className="ai-tabs" role="tablist" aria-label="أدوات الذكاء الاصطناعي"><button role="tab" aria-selected={tab==='assistant'} type="button" className={tab==='assistant'?'current':''} onClick={()=>{setTab('assistant');setProblem('')}}><BrainCircuit size={17}/> مساعد الذكريات</button><button role="tab" aria-selected={tab==='classify'} type="button" className={tab==='classify'?'current':''} onClick={()=>{setTab('classify');setProblem('')}}><Tags size={17}/> التصنيف الذكي</button></div>
      <div className="ai-safety"><ShieldCheck size={19}/><p>المحتوى يبقى في المتصفح حتى تضغط «اسأل» أو «صنّف». عندها تُرسل فقط المقاطع أو الصور المختارة إلى خدمة AI. لا تُحمّل الأرشيف المشفّر تلقائيًا، ولا تحفظ هذه الواجهة مفتاح الوصول.</p></div>
      <div className="ai-key"><LockKeyhole size={16}/><input type="password" value={key} onChange={e=>setKey(e.target.value)} autoComplete="off" placeholder="مفتاح خدمة Cloudflare AI (إذا كانت الخدمة تطلبه)" aria-label="مفتاح خدمة الذكاء الاصطناعي"/></div>
      {tab==='assistant'?<div className="ai-tab-content" role="tabpanel"><div className="ai-field-label"><FileText size={18}/> ملاحظاتك ومحتوى الأرشيف المحدد <span>{totalWords} كلمة</span></div><textarea className="ai-textarea" value={memory} onChange={e=>setMemory(e.target.value.slice(0,120_000))} placeholder={'الصق محادثة أو ذكريات أو يوميات هنا.\n\nقسّم الأحداث إلى فقرات وبينها سطر فارغ حتى يظهر المصدر بدقة.'} rows={7}/><div className="ai-row"><input ref={inputRef} type="file" accept=".txt,.md,.json,text/plain,application/json" hidden onChange={e=>{void loadFile(e.target.files?.[0]);e.target.value=''}}/><button type="button" className="ai-outline" onClick={()=>inputRef.current?.click()}><FileText size={17}/> استيراد TXT / MD / JSON</button><button type="button" className="ai-minor" onClick={()=>{setMemory('');setAnswer('');setUsed([])}}>مسح المحتوى</button></div><div className="ai-field-label"><Search size={18}/> ماذا تريد أن تعرف؟</div><div className="ai-query"><input type="text" maxLength={1000} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="مثلاً: ماذا حدث في الرحلة الأخيرة؟" onKeyDown={e=>{if(e.key==='Enter')void ask()}}/><button type="button" disabled={working} onClick={()=>void ask()}>{working?<Loader2 className="ai-spin" size={17}/>:<ArrowLeft size={17}/>} اسأل</button></div>{answer&&<section className="ai-answer" aria-live="polite"><span className="ai-small">إجابة من المستندات التي اخترتها</span><p>{answer}</p><div className="ai-references"><span>المقاطع المستخدمة:</span>{used.map(s=><span key={s.id}>[{s.id}] {s.title}</span>)}</div></section>}</div>:
       <div className="ai-tab-content" role="tabpanel"><div className="ai-field-label"><FileText size={18}/> نص تريد تصنيفه</div><textarea className="ai-textarea" rows={4} value={text} onChange={e=>setText(e.target.value.slice(0,8000))} placeholder="اكتب ذكرى أو ألصق نصًا... وسيقترح النظام فئته ووسومه وتاريخه إن وجد."/><div className="ai-field-label"><ImagePlus size={18}/> أو اختر حتى 6 صور</div><label className="ai-drop"><ImagePlus size={25}/><span>اختيار صور من جهازك</span><small>JPG / PNG وغيرها حسب دعم جهازك — يجرى التصغير قبل الإرسال</small><input type="file" accept="image/*" multiple onChange={e=>{setPhotos(Array.from(e.target.files||[]).slice(0,6));setClassified([])}}/></label>{photos.length>0&&<div className="ai-file-list">{photos.map((f,i)=><span key={i}>{f.name}</span>)}</div>}<button type="button" disabled={working} className="ai-run" onClick={()=>void classify()}>{working?<Loader2 className="ai-spin" size={17}/>:<Sparkles size={18}/>} {working?'جارِ تحليل الملف '+done+'...':'تصنيف وتحليل المحدد'}</button>{groups.length>0&&<div className="ai-results" aria-live="polite"><div className="ai-field-label"><CheckCircle2 size={18}/> نتائج التصنيف {classified.length}</div>{groups.map(([label,rows])=><section className="ai-group" key={label}><h3>{label} <small>{rows.length}</small></h3>{rows.map((row,i)=><article className="ai-classified" key={i}><strong>{row.name}</strong><p>{row.description}</p>{row.date&&<time dateTime={row.date}>التاريخ الظاهر: {row.date}</time>}<div className="ai-tags">{row.tags.map((tag,j)=><span key={j}>#{tag}</span>)}</div></article>)}</section>)}</div>}</div>}
      {problem&&<div className="ai-error" role="alert">{problem}</div>}
      <footer className="ai-foot"><span><LockKeyhole size={15}/> المعالجة تتم عند طلبك فقط</span><button type="button" onClick={onClose}>عودة إلى نفسم <ArrowLeft size={17}/></button></footer>
    </section>
  </div>;
}
