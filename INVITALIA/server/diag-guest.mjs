#!/usr/bin/env node
// Diagnoses the guest page on a deployed site: compares served assets with the repo, creates a test invitation,
// and loads the guest page in Chromium reporting console messages, failed requests and what is visible.
// Usage: node diag-guest.mjs [https://invitalia.co]
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'https://invitalia.co').replace(/\/$/, '');
const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(here, '../site');
const sha = b => createHash('sha256').update(b).digest('hex').slice(0, 12);

console.log('== served assets vs repository');
for (const f of ['assets/invitation.js', 'assets/invitation.css', 'assets/templates.js', 'assets/i18n.js', 'assets/config.js', 'guest.html', 'editor.html', 'index.html']) {
  const r = await fetch(`${base}/${f}`, { headers: { 'Cache-Control': 'no-cache' } });
  const body = Buffer.from(await r.arrayBuffer());
  const local = readFileSync(path.join(site, f));
  console.log(`${sha(body) === sha(local) ? 'same   ' : 'DIFFERS'} ${f.padEnd(24)} live ${sha(body)} (${body.length} b, ${r.status}, cf-cache ${r.headers.get('cf-cache-status')}, etag ${r.headers.get('etag')})  repo ${sha(local)} (${local.length} b)`);
}
const h = await (await fetch(`${base}/api/health`)).json(); console.log('health', JSON.stringify(h));

const require = createRequire(import.meta.url);
const T = require(path.join(site, 'assets/templates.js'));
const data = { template: T.default, name1: 'Diag', name2: 'Test', date: '2027-09-12', time: '17:00', venue: 'Villa', program: [{ t: '17:00', n: 'Ceremonia' }], story: [{ label: 'A', title: 'B', text: 'C' }], faq: [{ q: 'Q', a: 'A' }], palette: ['#b78087'], rsvpDeadline: '2027-08-01', askPlusOne: true, askMenu: true, menuOptions: 'A, B', askComment: true, slug: 'diag-guest' };
const api = async (m, p, body, tok) => { const r = await fetch(base + p, { method: m, headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: 'Bearer ' + tok } : {}) }, body: body ? JSON.stringify(body) : undefined }); return { status: r.status, j: await r.json().catch(() => ({})) }; };
const c = await api('POST', '/api/invitations', { data, lang: 'es' }); console.log('create', c.status, c.j.invitation && c.j.invitation.slug, c.j.error || '');
const { id, slug } = c.j.invitation, tok = c.j.editToken;
const k = await api('POST', `/api/invitations/${id}/checkout`, {}, tok); console.log('checkout', k.status, JSON.stringify(k.j).slice(0, 200));
const pub = await api('GET', `/api/i/${slug}`); console.log('public', pub.status, JSON.stringify(pub.j).slice(0, 300));
const page0 = await fetch(`${base}/i/${slug}`); console.log('guest html', page0.status, page0.headers.get('content-type'), 'templates.js included:', (await page0.text()).includes('templates.js'));

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const log = [];
page.on('console', m => log.push(`console.${m.type()}: ${m.text()}`));
page.on('pageerror', e => log.push(`pageerror: ${e.message}`));
page.on('requestfailed', r => log.push(`requestfailed: ${r.url()} ${r.failure() && r.failure().errorText}`));
page.on('response', r => { if (r.status() >= 400) log.push(`http ${r.status()}: ${r.url()}`); });
await page.goto(`${base}/i/${slug}?lang=es`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const seen = await page.evaluate(() => ({
  state: document.getElementById('state') && !document.getElementById('state').hidden ? document.getElementById('state-text').textContent : '(state hidden)',
  invHidden: document.getElementById('inv').hidden, invClass: document.getElementById('inv').className, invChildren: document.getElementById('inv').children.length,
  firstClasses: [...document.getElementById('inv').children].slice(0, 4).map(e => e.className),
  hasINVITATION: typeof INVITATION, hasTemplates: typeof INVITALIA_TEMPLATES, hasI18N: typeof I18N,
  text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 300),
}));
console.log('== browser view', JSON.stringify(seen, null, 1));
console.log('== browser log'); log.slice(0, 30).forEach(l => console.log('  ' + l));
await page.screenshot({ path: path.join(here, 'diag-guest.png'), fullPage: false });
await browser.close();
