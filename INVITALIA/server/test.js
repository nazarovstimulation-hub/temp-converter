'use strict';
// Smoke test: starts the server on a random port with a temporary database in MOCK payment mode
// and walks through the whole flow: create → update → checkout (mock) → guest view → RSVP → responses → CSV.
process.env.PORT = '0';
process.env.DATABASE_PATH = require('node:path').join(require('node:os').tmpdir(), `invitalia-test-${Date.now()}.db`);
process.env.STRIPE_SECRET_KEY = '';
process.env.BASE_URL = 'http://test.local';

const assert = require('node:assert/strict');
const { server } = require('./server.js');

async function main() {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = async (method, p, body, token) => {
    const res = await fetch(base + p, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}), body: body ? JSON.stringify(body) : undefined });
    const text = await res.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data, headers: res.headers };
  };

  let r = await j('GET', '/api/health');
  assert.equal(r.status, 200); assert.equal(r.data.payments, 'mock');

  // create
  r = await j('POST', '/api/invitations', { lang: 'es', data: { name1: 'Lucía', name2: 'Mateo', date: '2026-09-12', askPlusOne: true, askMenu: true, menuOptions: 'Carne, Pescado', askComment: true, program: [{ t: '17:00', n: 'Ceremonia' }] } });
  assert.equal(r.status, 201);
  const { id, editToken } = r.data;
  assert.equal(r.data.invitation.slug, 'lucia-mateo');
  assert.equal(r.data.invitation.status, 'draft');

  // unauthorized
  r = await j('GET', `/api/invitations/${id}`); assert.equal(r.status, 401);
  r = await j('GET', `/api/invitations/${id}`, null, 'wrong'); assert.equal(r.status, 401);

  // update with cyrillic slug → transliterated
  r = await j('PUT', `/api/invitations/${id}`, { data: { name1: 'Lucía', name2: 'Mateo', date: '2026-09-12', slug: 'Лючия и Матео', askPlusOne: true, askMenu: true, menuOptions: 'Carne, Pescado', askComment: true } }, editToken);
  assert.equal(r.status, 200); assert.equal(r.data.invitation.slug, 'lyuchiya-i-mateo');
  const slug = r.data.invitation.slug;

  // guest cannot see a draft, owner preview can
  r = await j('GET', `/api/i/${slug}`); assert.equal(r.status, 404);
  r = await j('GET', `/api/i/${slug}?preview=${editToken}`); assert.equal(r.status, 200);
  r = await j('POST', `/api/i/${slug}/rsvp`, { name: 'Ana', answer: 'yes' }); assert.equal(r.status, 403);

  // mock checkout publishes
  r = await j('POST', `/api/invitations/${id}/checkout`, { lang: 'es' }, editToken);
  assert.equal(r.status, 200); assert.equal(r.data.mock, true); assert.equal(r.data.invitation.status, 'published');

  // guest view + rsvp
  r = await j('GET', `/api/i/${slug}`); assert.equal(r.status, 200); assert.equal(r.data.invitation.data.name1, 'Lucía');
  r = await j('POST', `/api/i/${slug}/rsvp`, { name: 'Ana García', answer: 'yes', plusOne: '1', menu: 'Pescado', comment: 'Sin gluten', lang: 'es' }); assert.equal(r.status, 201);
  r = await j('POST', `/api/i/${slug}/rsvp`, { name: 'Marco Rossi', answer: 'no', lang: 'it' }); assert.equal(r.status, 201);
  r = await j('POST', `/api/i/${slug}/rsvp`, { answer: 'yes' }); assert.equal(r.status, 400);

  // owner reads responses
  r = await j('GET', `/api/invitations/${id}/responses`, null, editToken);
  assert.equal(r.status, 200); assert.equal(r.data.responses.length, 2); assert.equal(r.data.counts.yes, 1); assert.equal(r.data.counts.no, 1); assert.equal(r.data.counts.extra, 1);
  r = await j('GET', `/api/invitations/${id}/responses.csv?lang=it&token=${editToken}`);
  assert.equal(r.status, 200); assert.ok(String(r.data).includes('Ospite')); assert.ok(String(r.data).includes('Ana García'));

  // static + pretty guest url
  let res = await fetch(base + '/'); assert.equal(res.status, 200); assert.ok((await res.text()).includes('<title>'));
  res = await fetch(base + `/i/${slug}`); assert.equal(res.status, 200); assert.ok((await res.text()).includes('guest'));
  res = await fetch(base + '/../server.js'); assert.notEqual(res.status, 200);
  res = await fetch(base + '/i/no-such-invitation'); assert.equal(res.status, 404); assert.ok((await res.text()).includes('guest'));

  // rate limit on RSVP (10 per 10 min per ip+slug): three attempts counted so far, 7 more pass, the 11th fails
  for (let i = 0; i < 7; i++) { r = await j('POST', `/api/i/${slug}/rsvp`, { name: 'G' + i, answer: 'yes' }); assert.equal(r.status, 201); }
  r = await j('POST', `/api/i/${slug}/rsvp`, { name: 'Late', answer: 'yes' }); assert.equal(r.status, 429);

  console.log('All server tests passed.');
  server.close(); require('node:fs').rmSync(process.env.DATABASE_PATH, { force: true });
}
main().catch(e => { console.error(e); process.exit(1); });
