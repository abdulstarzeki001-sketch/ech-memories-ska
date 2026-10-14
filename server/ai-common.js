/* Pages AI endpoints: protected, stateless, strict request size limits. */
export const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export async function authorize(request, env) {
  const secret = env.NAFSAM_AI_ACCESS_KEY;
  if (!secret || secret.length < 24) return json({ error: 'AI_NOT_CONFIGURED', message: 'يلزم إعداد سر NAFSAM_AI_ACCESS_KEY بطول 24 رمزًا أو أكثر.' }, 503);
  const candidate = request.headers.get('X-NAFSAM-AI-Key') || '';
  if (candidate.length !== secret.length) return json({ error: 'UNAUTHORIZED', message: 'مفتاح الوصول غير صحيح.' }, 401);
  const a = new TextEncoder().encode(candidate);
  const b = new TextEncoder().encode(secret);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  if (mismatch) return json({ error: 'UNAUTHORIZED', message: 'مفتاح الوصول غير صحيح.' }, 401);
  if (!env.AI || typeof env.AI.run !== 'function') return json({ error: 'AI_BINDING_MISSING', message: 'يلزم إضافة ربط Workers AI باسم AI في إعدادات Cloudflare Pages.' }, 503);
  return null;
}
export async function parse(request, limit) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return { problem: json({ message: 'الطلب يجب أن يكون JSON.' }, 415) };
  const len = Number(request.headers.get('content-length') || 0);
  if (len > limit) return { problem: json({ message: 'حجم الطلب يتجاوز الحد المسموح.' }, 413) };
  const raw = await request.text();
  if (raw.length > limit) return { problem: json({ message: 'حجم الطلب يتجاوز الحد المسموح.' }, 413) };
  try { return { data: JSON.parse(raw) }; } catch { return { problem: json({ message: 'JSON غير صالح.' }, 400) }; }
}
export const textResult = value => typeof value === 'string' ? value : (value?.response ?? value?.result?.response ?? '');
export function parseObject(raw) {
  if (typeof raw !== 'string') return null;
  try { return JSON.parse(raw.replace(/^.*?\`\`\`(?:json)?\s*/s, '').replace(/\s*\`\`\`[\s\S]*$/s, '').trim()); }
  catch { const match = raw.match(/\{[\s\S]*\}/); if (!match) return null; try { return JSON.parse(match[0]); } catch { return null; } }
}
