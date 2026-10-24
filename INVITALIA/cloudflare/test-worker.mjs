// Runs the Worker in Node with a D1 shim over node:sqlite and an ASSETS shim over ../site.
// Covers the same flow as server/test.js: create → update → mock checkout → guest view → RSVP → responses → CSV → static.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './src/worker.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(here, '..', 'site');

// ---- D1 shim ----
function d1(db) {
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    first: async (col) => { const r = db.prepare(sql).get(...args); return r == null ? null : (col ? r[col] : r); },
    all: async () => ({ results: db.prepare(sql).all(...args), success: true }),
    run: async () => { const r = db.prepare(sql).run(...args); return { success: true, meta: { changes: r.changes } }; },
    raw: async () => db.prepare(sql).all(...args).map(Object.values),
  });
  return { prepare: (sql) => stmt(sql), batch: async (stmts) => Promise.all(stmts.map(s => s.run())), exec: async (sql) => db.exec(sql) };
}
const ASSETS = { fetch: async (req) => { const u = new URL(req.url); let f = path.join(site, decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname)); if (!f.startsWith(site) || !existsSync(f)) return new Response('not found', { status: 404 }); return new Response(readFileSync(f), { status: 200, headers: { 'Content-Type': f.endsWith('.html') ? 'text/html' : 'application/octet-stream' } }); } };

const env = { DB: d1(new DatabaseSync(':memory:')), ASSETS, BASE_URL: 'http://test.local', PRICE_AMOUNT: '2900', PRICE_CURRENCY: 'eur', STRIPE_SECRET_KEY: '' };
const call = async (method, p, body, token, headers = {}) => {
  const h = { 'Content-Type': 'application/json', 'cf-connecting-ip': '203.0.113.7', ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await worker.fetch(new Request('http://test.local' + p, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env);
  const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, headers: res.headers };
};

let r = await call('GET', '/api/health'); assert.equal(r.status, 200); assert.equal(r.data.payments, 'mock'); assert.equal(r.data.runtime, 'cloudflare');

r = await call('POST', '/api/invitations', { lang: 'es', data: { name1: 'Lucía', name2: 'Mateo', date: '2027-09-12', askPlusOne: true, askMenu: true, menuOptions: 'Carne, Pescado', askComment: true, program: [{ t: '17:00', n: 'Ceremonia' }] } });
assert.equal(r.status, 201); const { id, editToken } = r.data; assert.equal(r.data.invitation.slug, 'lucia-mateo'); assert.equal(r.data.invitation.status, 'draft');

r = await call('GET', `/api/invitations/${id}`); assert.equal(r.status, 401);
r = await call('GET', `/api/invitations/${id}`, null, 'wrong'); assert.equal(r.status, 401);
r = await call('GET', `/api/invitations/${id}`, null, editToken); assert.equal(r.status, 200); assert.equal(r.data.invitation.url, 'http://test.local/i/lucia-mateo');

r = await call('PUT', `/api/invitations/${id}`, { lang: 'it', data: { name1: 'Lucía', name2: 'Mateo', date: '2027-09-12', slug: 'Лючия и Матео', askPlusOne: true, askMenu: true, menuOptions: 'Carne, Pescado', askComment: true } }, editToken);
assert.equal(r.status, 200); assert.equal(r.data.invitation.slug, 'lyuchiya-i-mateo'); assert.equal(r.data.invitation.lang, 'it'); const slug = r.data.invitation.slug;

// a second invitation with the same names gets a unique slug
r = await call('POST', '/api/invitations', { data: { name1: 'Lucía', name2: 'Mateo', slug: 'lyuchiya-i-mateo' } }); assert.equal(r.status, 201); assert.notEqual(r.data.invitation.slug, slug); assert.ok(r.data.invitation.slug.startsWith('lyuchiya-i-mateo-'));

r = await call('GET', `/api/i/${slug}`); assert.equal(r.status, 404);
r = await call('GET', `/api/i/${slug}?preview=${editToken}`); assert.equal(r.status, 200);
r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'Ana', answer: 'yes' }); assert.equal(r.status, 403);

r = await call('POST', `/api/invitations/${id}/checkout`, { lang: 'es' }, editToken); assert.equal(r.status, 200); assert.equal(r.data.mock, true); assert.equal(r.data.invitation.status, 'published');
r = await call('POST', `/api/invitations/${id}/checkout`, { lang: 'es' }, editToken); assert.equal(r.data.alreadyPublished, true);

r = await call('GET', `/api/i/${slug}`); assert.equal(r.status, 200); assert.equal(r.data.invitation.data.name1, 'Lucía');
r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'Ana García', answer: 'yes', plusOne: '1', menu: 'Pescado', comment: 'Sin gluten', lang: 'es' }); assert.equal(r.status, 201);
r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'Marco Rossi', answer: 'no', lang: 'it' }); assert.equal(r.status, 201);
r = await call('POST', `/api/i/${slug}/rsvp`, { answer: 'yes' }); assert.equal(r.status, 400);

r = await call('GET', `/api/invitations/${id}/responses`, null, editToken); assert.equal(r.status, 200); assert.equal(r.data.responses.length, 2); assert.equal(r.data.counts.yes, 1); assert.equal(r.data.counts.no, 1); assert.equal(r.data.counts.extra, 1);
r = await call('GET', `/api/invitations/${id}/responses.csv?lang=de&token=${editToken}`); assert.equal(r.status, 200); assert.ok(r.data.includes('Gast')); assert.ok(r.data.includes('Ana García')); assert.ok(r.headers.get('content-type').includes('text/csv'));

// webhook without secret configured is accepted; idempotent on event id
r = await call('POST', '/api/stripe/webhook', { id: 'evt_1', type: 'checkout.session.completed', data: { object: { id: 'cs_x', payment_status: 'paid', metadata: { invitation_id: id } } } }); assert.equal(r.status, 200);
r = await call('POST', '/api/stripe/webhook', { id: 'evt_1', type: 'checkout.session.completed', data: { object: {} } }); assert.equal(r.data.duplicate, true);

// static + guest routes
let res = await worker.fetch(new Request('http://test.local/'), env); assert.equal(res.status, 200); assert.ok((await res.text()).includes('<title>'));
res = await worker.fetch(new Request(`http://test.local/i/${slug}`), env); assert.equal(res.status, 200); assert.ok((await res.text()).includes('guest'));
res = await worker.fetch(new Request('http://test.local/i/no-such'), env); assert.equal(res.status, 404);
res = await worker.fetch(new Request('http://test.local/editor.html', { method: 'DELETE' }), env); assert.equal(res.status, 405);

// rate limit: 3 attempts counted so far (2 ok + 1 invalid), 7 more pass, the 11th fails; another IP is unaffected
for (let i = 0; i < 7; i++) { r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'G' + i, answer: 'yes' }); assert.equal(r.status, 201); }
r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'Late', answer: 'yes' }); assert.equal(r.status, 429);
r = await call('POST', `/api/i/${slug}/rsvp`, { name: 'Other IP', answer: 'yes' }, null, { 'cf-connecting-ip': '198.51.100.9' }); assert.equal(r.status, 201);

// CORS only for configured origins
env.CORS_ORIGINS = 'https://pages.example';
res = await worker.fetch(new Request('http://test.local/api/health', { method: 'OPTIONS', headers: { origin: 'https://pages.example' } }), env); assert.equal(res.status, 204); assert.equal(res.headers.get('access-control-allow-origin'), 'https://pages.example');
res = await worker.fetch(new Request('http://test.local/api/health', { headers: { origin: 'https://evil.example' } }), env); assert.equal(res.headers.get('access-control-allow-origin'), null);

console.log('All Cloudflare Worker tests passed.');
