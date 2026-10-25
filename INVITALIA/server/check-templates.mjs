#!/usr/bin/env node
// Opens the guest page once per template (34×) on a deployed site and checks that the full invitation renders:
// top bar, cover with script names, countdown, story, programme, venue + colours, FAQ, RSVP form and footer.
// Usage: node check-templates.mjs [https://invitalia.co] [--shots dir]
// Creates one test invitation (mock payment) and switches its template with PUT; needs Playwright (npm i playwright).
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const base = (args.find(a => /^https?:/.test(a)) || 'https://invitalia.co').replace(/\/$/, '');
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : '';
const require = createRequire(import.meta.url);
const T = require(path.join(path.dirname(fileURLToPath(import.meta.url)), '../site/assets/templates.js'));
const { chromium } = require('playwright'); // resolved from this folder or NODE_PATH

const data = {
  template: T.default, name1: 'Lucía', name2: 'Mateo', greeting: 'Nos hará muy felices compartir este día con vosotros.',
  date: '2027-09-12', time: '17:00', tz: 'Europe/Madrid', venue: 'Villa del Balbianello', address: 'Via Comoedia 5, Lenno', venueText: 'Una ceremonia al aire libre y una cena entre flores.', mapUrl: 'https://maps.google.com/?q=Villa+del+Balbianello',
  program: [{ t: '17:00', n: 'Ceremonia', d: 'Nuestros votos.' }, { t: '18:30', n: 'Aperitivo', d: 'Brindis.' }, { t: '20:00', n: 'Cena y baile', d: 'Una noche para recordar.' }],
  story: [{ label: 'PRIMAVERA · 2022', title: 'Nuestro primer encuentro', text: 'Un café y una larga conversación.' }, { label: 'VERANO · 2024', title: 'Nuestro viaje', text: 'Amaneceres junto al mar.' }, { label: 'OTOÑO · 2026', title: 'El «sí»', text: 'Un nuevo capítulo.' }],
  faq: [{ q: '¿Qué podemos regalaros?', a: 'Vuestra presencia.' }, { q: '¿Puedo ir con acompañante?', a: 'Indícalo en el formulario.' }],
  palette: ['#b78087', '#d5b5ad', '#e4d7c2', '#a6aa93', '#6f7865'], dress: 'Elegante de noche',
  rsvpQuestion: '', rsvpDeadline: '2027-08-01', askPlusOne: true, askMenu: true, menuOptions: 'Carne, Pescado, Vegetariano', askComment: true, music: false, track: '', slug: 'prueba-plantillas',
};
async function api(method, p, body, token) {
  const r = await fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${method} ${p} → ${r.status} ${JSON.stringify(j)}`);
  return j;
}

const created = await api('POST', '/api/invitations', { data, lang: 'es' });
const { id, slug } = created.invitation, token = created.editToken;
await api('POST', `/api/invitations/${id}/checkout`, {}, token);
console.log(`test invitation ${base}/i/${slug} (id ${id})`);

if (shots) mkdirSync(shots, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(String(e)));
let bad = 0;
for (const t of T.list) {
  await api('PUT', `/api/invitations/${id}`, { data: { ...data, template: t.id }, lang: 'es' }, token);
  await page.goto(`${base}/i/${slug}?lang=es&v=${Date.now()}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#inv:not([hidden]) .i-art', { timeout: 15000 }).catch(() => {});
  const r = await page.evaluate(() => {
    const q = s => !!document.querySelector('#inv ' + s);
    const art = document.querySelector('#inv .i-art');
    return {
      cls: document.getElementById('inv').className,
      cover: art ? getComputedStyle(art).backgroundImage.replace(/^url\("?|"?\)$/g, '') : '',
      sections: { top: q('.i-top'), hero: q('.i-hero .art-title'), countdown: q('.count b'), story: q('#story article'), schedule: q('#schedule .event'), venue: q('.i-details .addr'), colors: q('.swatches i'), faq: q('details summary'), rsvp: q('form.rsvp [name=name]'), footer: q('.i-foot') },
    };
  });
  const coverOk = r.cover.includes(t.file) && (await fetch(r.cover.startsWith('http') ? r.cover : base + r.cover, { method: 'HEAD' })).status === 200;
  const missing = Object.entries(r.sections).filter(([, v]) => !v).map(([k]) => k);
  const themeOk = r.cls.includes('t-' + t.theme);
  const ok = coverOk && themeOk && !missing.length;
  if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'BAD'} ${t.id.padEnd(12)} theme ${t.theme.padEnd(10)} cover ${coverOk ? 'ok' : 'MISSING'}${missing.length ? ' missing: ' + missing.join(',') : ''}`);
  if (shots) await page.screenshot({ path: path.join(shots, `${t.file}.png`), fullPage: true });
}
await browser.close();
if (errors.length) console.log('page errors:', errors.slice(0, 5));
console.log(bad ? `PROBLEMS in ${bad} template(s)` : `all ${T.list.length} templates render the full invitation`);
process.exit(bad ? 1 : 0);
