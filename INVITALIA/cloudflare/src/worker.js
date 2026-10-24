/**
 * INVITALIA.co on Cloudflare Workers + D1 + Static Assets.
 * Same API as server/server.js, ported to the Workers runtime (fetch handler, Web Crypto, D1 SQL).
 *
 * Bindings (wrangler.toml): DB (D1), ASSETS (static site), vars BASE_URL, PRICE_AMOUNT, PRICE_CURRENCY, CORS_ORIGINS;
 * secrets STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (set with `wrangler secret put`). Without STRIPE_SECRET_KEY payments run in MOCK mode.
 */

const LANGS = ['es', 'en', 'it', 'pt', 'fr', 'de', 'ru'];
const RESERVED_SLUGS = new Set(['api', 'i', 'admin', 'editor', 'index', 'assets', 'login', 'pay', 'static', 'www', 'app', 'help', 'about', 'pricing', 'terms', 'privacy']);
const TEMPLATES = ['palazzo', 'linea', 'heritage', 'amalfi', 'botanica', 'noir'];
const PRODUCT_NAME = { es: 'Invitación de boda digital Invitalia', en: 'Invitalia digital wedding invitation', it: 'Invito di nozze digitale Invitalia', pt: 'Convite de casamento digital Invitalia', fr: 'Faire-part de mariage numérique Invitalia', de: 'Digitale Hochzeitseinladung Invitalia', ru: 'Электронное свадебное приглашение Invitalia' };
const CSV_HEAD = { es: ['Invitado', 'Respuesta', 'Acompañantes', 'Menú', 'Comentario', 'Fecha'], en: ['Guest', 'Answer', 'Plus ones', 'Menu', 'Comment', 'Date'], it: ['Ospite', 'Risposta', 'Accompagnatori', 'Menù', 'Commento', 'Data'], pt: ['Convidado', 'Resposta', 'Acompanhantes', 'Menu', 'Comentário', 'Data'], fr: ['Invité', 'Réponse', 'Accompagnants', 'Menu', 'Commentaire', 'Date'], de: ['Gast', 'Antwort', 'Begleitung', 'Menü', 'Kommentar', 'Datum'], ru: ['Гость', 'Ответ', 'Спутники', 'Меню', 'Комментарий', 'Дата'] };
const CSV_ANSWER = { es: { yes: 'Asistirá', no: 'No asistirá' }, en: { yes: 'Attending', no: 'Not attending' }, it: { yes: 'Parteciperà', no: 'Non parteciperà' }, pt: { yes: 'Vai', no: 'Não vai' }, fr: { yes: 'Présent', no: 'Absent' }, de: { yes: 'Kommt', no: 'Kommt nicht' }, ru: { yes: 'Придёт', no: 'Не сможет' } };

export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS invitations (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, edit_token_hash TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'es', data TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, published_at TEXT, paid_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS responses (id TEXT PRIMARY KEY, invitation_id TEXT NOT NULL, name TEXT NOT NULL, answer TEXT NOT NULL, plus_one TEXT, menu TEXT, comment TEXT, lang TEXT, ip_hash TEXT, created_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_responses_inv ON responses(invitation_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, invitation_id TEXT NOT NULL, provider TEXT NOT NULL, session_id TEXT UNIQUE, amount INTEGER NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, raw TEXT)`,
  `CREATE TABLE IF NOT EXISTS webhook_events (id TEXT PRIMARY KEY, received_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)`,
];

// ---------- helpers ----------
class HttpError extends Error { constructor(status, code, message) { super(message || code); this.status = status; this.code = code; } }
const now = () => new Date().toISOString();
const enc = new TextEncoder();
function randomId(prefix) { const b = new Uint8Array(9); crypto.getRandomValues(b); return prefix + '_' + b64url(b); }
function randomToken() { const b = new Uint8Array(32); crypto.getRandomValues(b); return b64url(b); }
function b64url(bytes) { let s = ''; for (const x of bytes) s += String.fromCharCode(x); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function hex(buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
async function sha256(s) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(String(s)))); }
async function hmacHex(secret, msg) { const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', key, enc.encode(msg))); }
function safeEqual(a, b) { a = String(a); b = String(b); if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
function clampStr(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
function pickLang(v, fallback) { v = String(v || '').slice(0, 2).toLowerCase(); return LANGS.includes(v) ? v : (fallback || 'es'); }
const TRANSLIT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
function slugify(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[а-яё]/g, c => TRANSLIT[c] ?? '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 48); }
function validSlug(s) { return /^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])?$/.test(s) && !RESERVED_SLUGS.has(s); }
function json(body, status = 200, headers = {}) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } }); }
function cfg(env) {
  return {
    baseUrl: (env.BASE_URL || 'https://invitalia.co').replace(/\/$/, ''),
    priceAmount: Number(env.PRICE_AMOUNT || 2900), priceCurrency: String(env.PRICE_CURRENCY || 'eur').toLowerCase(),
    stripeKey: env.STRIPE_SECRET_KEY || '', webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    corsOrigins: String(env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  };
}
function sanitizeData(input) {
  const d = (input && typeof input === 'object') ? input : {};
  const prog = Array.isArray(d.program) ? d.program.slice(0, 30).map(p => ({ t: clampStr(p && p.t, 10), n: clampStr(p && p.n, 120) })) : [];
  return {
    template: TEMPLATES.includes(d.template) ? d.template : 'palazzo',
    name1: clampStr(d.name1, 60), name2: clampStr(d.name2, 60), greeting: clampStr(d.greeting, 600),
    date: /^\d{4}-\d{2}-\d{2}$/.test(d.date || '') ? d.date : '', time: /^\d{2}:\d{2}$/.test(d.time || '') ? d.time : '',
    venue: clampStr(d.venue, 120), address: clampStr(d.address, 200), mapUrl: /^https?:\/\//i.test(d.mapUrl || '') ? clampStr(d.mapUrl, 500) : '',
    program: prog, dress: clampStr(d.dress, 200),
    rsvpQuestion: clampStr(d.rsvpQuestion, 160), rsvpDeadline: /^\d{4}-\d{2}-\d{2}$/.test(d.rsvpDeadline || '') ? d.rsvpDeadline : '',
    askPlusOne: !!d.askPlusOne, askMenu: !!d.askMenu, menuOptions: clampStr(d.menuOptions, 300), askComment: !!d.askComment,
    music: !!d.music, track: clampStr(d.track, 120), slug: slugify(d.slug),
  };
}

// ---------- database ----------
let schemaReady = null;
async function ensureSchema(env) {
  if (!schemaReady) schemaReady = env.DB.batch(SCHEMA.map(s => env.DB.prepare(s))).catch(e => { schemaReady = null; throw e; });
  await schemaReady;
}
const q = (env, sql, ...args) => env.DB.prepare(sql).bind(...args);
async function getInvById(env, id) { return q(env, 'SELECT * FROM invitations WHERE id = ?', id).first(); }
async function getInvBySlug(env, slug) { return q(env, 'SELECT * FROM invitations WHERE slug = ?', slug).first(); }
async function uniqueSlug(env, base, selfId) {
  const fallback = 'invitacion';
  let s = validSlug(base) ? base : fallback;
  for (let i = 0; i < 20; i++) {
    const row = await getInvBySlug(env, s);
    if (!row || row.id === selfId) return s;
    const r = new Uint8Array(2); crypto.getRandomValues(r);
    s = (validSlug(base) ? base : fallback).slice(0, 42) + '-' + hex(r.buffer);
  }
  return randomId('inv').toLowerCase().replace(/_/g, '-');
}
async function counts(env, invId) {
  const rows = (await q(env, `SELECT answer, COUNT(*) AS n, COALESCE(SUM(CASE WHEN plus_one GLOB '[0-9]*' THEN CAST(plus_one AS INTEGER) ELSE 0 END), 0) AS extra FROM responses WHERE invitation_id = ? GROUP BY answer`, invId).all()).results || [];
  const c = { yes: 0, no: 0, extra: 0 };
  for (const r of rows) { c[r.answer] = r.n; if (r.answer === 'yes') c.extra = r.extra; }
  return c;
}
async function ownerView(env, row) {
  const C = cfg(env);
  return { id: row.id, slug: row.slug, lang: row.lang, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at, paidAt: row.paid_at,
    url: `${C.baseUrl}/i/${row.slug}`, data: JSON.parse(row.data), counts: await counts(env, row.id), price: { amount: C.priceAmount, currency: C.priceCurrency }, payments: C.stripeKey ? 'stripe' : 'mock' };
}
function publicView(row) { return { slug: row.slug, lang: row.lang, status: row.status, publishedAt: row.published_at, data: JSON.parse(row.data) }; }
async function rateLimit(env, key, limit, windowMs) {
  const t = Date.now(), reset = t + windowMs;
  const row = await q(env, `INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN rate_limits.reset_at < ? THEN 1 ELSE rate_limits.count + 1 END, reset_at = CASE WHEN rate_limits.reset_at < ? THEN ? ELSE rate_limits.reset_at END RETURNING count`, key, reset, t, t, reset).first();
  if (Math.random() < 0.02) await q(env, 'DELETE FROM rate_limits WHERE reset_at < ?', t).run();
  return (row ? row.count : 1) <= limit;
}
async function markPaidAndPublish(env, invId, sessionId, amount, currency, raw) {
  const ts = now();
  const rawStr = raw ? JSON.stringify(raw).slice(0, 20000) : null;
  const pay = sessionId ? await q(env, 'SELECT * FROM payments WHERE session_id = ?', sessionId).first() : null;
  if (pay) await q(env, 'UPDATE payments SET status = ?, updated_at = ?, raw = COALESCE(?, raw) WHERE id = ?', 'paid', ts, rawStr, pay.id).run();
  else await q(env, 'INSERT INTO payments (id, invitation_id, provider, session_id, amount, currency, status, created_at, updated_at, raw) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', randomId('pay'), invId, cfg(env).stripeKey ? 'stripe' : 'mock', sessionId || null, amount, currency, 'paid', ts, ts, rawStr).run();
  await q(env, `UPDATE invitations SET status = 'published', published_at = COALESCE(published_at, ?), paid_at = COALESCE(paid_at, ?), updated_at = ? WHERE id = ?`, ts, ts, ts, invId).run();
}

// ---------- request plumbing ----------
async function readJson(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 256 * 1024) throw new HttpError(413, 'payload_too_large');
  const txt = await request.text();
  if (txt.length > 256 * 1024) throw new HttpError(413, 'payload_too_large');
  if (!txt.trim()) return {};
  try { return JSON.parse(txt); } catch { throw new HttpError(400, 'invalid_json'); }
}
function bearer(request, url) { const h = request.headers.get('authorization') || ''; return /^Bearer\s+/i.test(h) ? h.replace(/^Bearer\s+/i, '').trim() : (url.searchParams.get('token') || ''); }
async function requireOwner(env, request, url, invId) {
  const row = await getInvById(env, invId);
  if (!row) throw new HttpError(404, 'not_found');
  const t = bearer(request, url);
  if (!t || !safeEqual(await sha256(t), row.edit_token_hash)) throw new HttpError(401, 'unauthorized');
  return row;
}
function clientIp(request) { return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '0.0.0.0'; }
function corsHeaders(env, request) {
  const origin = request.headers.get('origin');
  if (origin && cfg(env).corsOrigins.includes(origin)) return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Max-Age': '600' };
  return {};
}

// ---------- Stripe ----------
function formEncode(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) continue;
    if (typeof v === 'object') formEncode(v, key, out); else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join('&');
}
async function stripe(env, method, endpoint, body) {
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, { method, headers: { Authorization: `Bearer ${cfg(env).stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Stripe-Version': '2024-06-20' }, body: body ? formEncode(body) : undefined });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new HttpError(502, 'stripe_error', (j.error && j.error.message) || `Stripe ${res.status}`);
  return j;
}
async function verifyStripeSignature(env, raw, header) {
  const secret = cfg(env).webhookSecret;
  if (!secret) return true;
  const parts = Object.fromEntries(String(header || '').split(',').map(p => p.split('=')));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  return safeEqual(await hmacHex(secret, `${parts.t}.${raw}`), parts.v1);
}

// ---------- API ----------
async function api(request, env, url) {
  const C = cfg(env);
  const MOCK = !C.stripeKey;
  const m = request.method;
  const p = url.pathname.replace(/\/+$/, '');
  const seg = p.split('/').slice(2);
  await ensureSchema(env);

  if (p === '/api/health') return json({ ok: true, runtime: 'cloudflare', payments: MOCK ? 'mock' : 'stripe', price: { amount: C.priceAmount, currency: C.priceCurrency }, languages: LANGS, time: now() });

  if (p === '/api/invitations' && m === 'POST') {
    if (!(await rateLimit(env, 'create:' + clientIp(request), 20, 3600000))) throw new HttpError(429, 'rate_limited');
    const body = await readJson(request);
    const data = sanitizeData(body.data);
    const lang = pickLang(body.lang, 'es');
    const slug = await uniqueSlug(env, data.slug || slugify(`${data.name1} ${data.name2}`) || 'invitacion');
    data.slug = slug;
    const invId = randomId('inv'), tok = randomToken(), ts = now();
    await q(env, `INSERT INTO invitations (id, slug, edit_token_hash, lang, data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)`, invId, slug, await sha256(tok), lang, JSON.stringify(data), ts, ts).run();
    return json({ id: invId, editToken: tok, invitation: await ownerView(env, await getInvById(env, invId)) }, 201);
  }

  if (seg[0] === 'invitations' && seg[1]) {
    const invId = seg[1];
    if (seg.length === 2 && m === 'GET') { const row = await requireOwner(env, request, url, invId); return json({ invitation: await ownerView(env, row) }); }
    if (seg.length === 2 && m === 'PUT') {
      const row = await requireOwner(env, request, url, invId);
      const body = await readJson(request);
      const data = sanitizeData(body.data);
      const lang = pickLang(body.lang, row.lang);
      const wanted = data.slug || row.slug;
      const slug = wanted === row.slug ? row.slug : await uniqueSlug(env, wanted, row.id);
      data.slug = slug;
      await q(env, 'UPDATE invitations SET slug = ?, lang = ?, data = ?, updated_at = ? WHERE id = ?', slug, lang, JSON.stringify(data), now(), invId).run();
      return json({ invitation: await ownerView(env, await getInvById(env, invId)) });
    }
    if (seg[2] === 'responses' && m === 'GET') {
      const row = await requireOwner(env, request, url, invId);
      const rows = (await q(env, 'SELECT id, name, answer, plus_one, menu, comment, lang, created_at FROM responses WHERE invitation_id = ? ORDER BY created_at DESC', invId).all()).results || [];
      return json({ responses: rows.map(r => ({ id: r.id, name: r.name, answer: r.answer, plusOne: r.plus_one, menu: r.menu, comment: r.comment, lang: r.lang, createdAt: r.created_at })), counts: await counts(env, row.id) });
    }
    if (seg[2] === 'responses.csv' && m === 'GET') {
      const row = await requireOwner(env, request, url, invId);
      const lang = pickLang(url.searchParams.get('lang'), row.lang);
      const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      const rows = (await q(env, 'SELECT * FROM responses WHERE invitation_id = ? ORDER BY created_at DESC', invId).all()).results || [];
      const lines = [CSV_HEAD[lang].map(esc).join(';')].concat(rows.map(r => [r.name, CSV_ANSWER[lang][r.answer] || r.answer, r.plus_one || '', r.menu || '', r.comment || '', r.created_at.replace('T', ' ').slice(0, 16)].map(esc).join(';')));
      return new Response('﻿' + lines.join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="invitalia-${row.slug}.csv"`, 'Cache-Control': 'no-store' } });
    }
    if (seg[2] === 'checkout' && seg.length === 3 && m === 'POST') {
      const row = await requireOwner(env, request, url, invId);
      const body = await readJson(request);
      const lang = pickLang(body.lang, row.lang);
      if (row.status === 'published') return json({ alreadyPublished: true, invitation: await ownerView(env, row) });
      if (MOCK) {
        await markPaidAndPublish(env, invId, 'mock_' + randomId('s'), C.priceAmount, C.priceCurrency, { mock: true });
        return json({ mock: true, url: `${C.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&paid=1`, invitation: await ownerView(env, await getInvById(env, invId)) });
      }
      const successUrl = /^https?:\/\//.test(body.successUrl || '') ? body.successUrl : `${C.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = /^https?:\/\//.test(body.cancelUrl || '') ? body.cancelUrl : `${C.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&canceled=1`;
      const session = await stripe(env, 'POST', 'checkout/sessions', {
        mode: 'payment', locale: lang, client_reference_id: invId, success_url: successUrl, cancel_url: cancelUrl,
        line_items: [{ quantity: 1, price_data: { currency: C.priceCurrency, unit_amount: C.priceAmount, product_data: { name: PRODUCT_NAME[lang] || PRODUCT_NAME.es, description: `${C.baseUrl}/i/${row.slug}` } } }],
        metadata: { invitation_id: invId, slug: row.slug },
      });
      const ts = now();
      await q(env, 'INSERT INTO payments (id, invitation_id, provider, session_id, amount, currency, status, created_at, updated_at, raw) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)', randomId('pay'), invId, 'stripe', session.id, C.priceAmount, C.priceCurrency, 'pending', ts, ts).run();
      return json({ url: session.url, sessionId: session.id });
    }
    if (seg[2] === 'checkout' && seg[3] === 'verify' && m === 'POST') {
      const row = await requireOwner(env, request, url, invId);
      const body = await readJson(request);
      if (row.status === 'published') return json({ paid: true, invitation: await ownerView(env, row) });
      if (MOCK) throw new HttpError(400, 'mock_mode');
      const sid = clampStr(body.sessionId, 120);
      const pay = await q(env, 'SELECT * FROM payments WHERE session_id = ?', sid).first();
      if (!pay || pay.invitation_id !== invId) throw new HttpError(404, 'session_not_found');
      const session = await stripe(env, 'GET', `checkout/sessions/${encodeURIComponent(sid)}`);
      if (session.payment_status === 'paid') { await markPaidAndPublish(env, invId, sid, session.amount_total || C.priceAmount, session.currency || C.priceCurrency, { id: session.id, payment_status: session.payment_status }); return json({ paid: true, invitation: await ownerView(env, await getInvById(env, invId)) }); }
      return json({ paid: false, paymentStatus: session.payment_status });
    }
  }

  if (p === '/api/stripe/webhook' && m === 'POST') {
    const raw = await request.text();
    if (!(await verifyStripeSignature(env, raw, request.headers.get('stripe-signature')))) throw new HttpError(400, 'bad_signature');
    let event; try { event = JSON.parse(raw); } catch { throw new HttpError(400, 'invalid_json'); }
    if (event.id && await q(env, 'SELECT 1 AS x FROM webhook_events WHERE id = ?', event.id).first()) return json({ received: true, duplicate: true });
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const s = (event.data && event.data.object) || {};
      const invId = (s.metadata && s.metadata.invitation_id) || s.client_reference_id;
      if (invId && s.payment_status === 'paid' && await getInvById(env, invId)) await markPaidAndPublish(env, invId, s.id, s.amount_total || C.priceAmount, s.currency || C.priceCurrency, { id: s.id, payment_status: s.payment_status, customer_email: s.customer_details && s.customer_details.email });
    }
    if (event.id) await q(env, 'INSERT OR IGNORE INTO webhook_events (id, received_at) VALUES (?, ?)', event.id, now()).run();
    return json({ received: true });
  }

  if (seg[0] === 'i' && seg[1]) {
    const slug = seg[1].toLowerCase();
    const row = await getInvBySlug(env, slug);
    if (!row) throw new HttpError(404, 'not_found');
    if (seg.length === 2 && m === 'GET') {
      const preview = url.searchParams.get('preview');
      if (row.status !== 'published' && !(preview && safeEqual(await sha256(preview), row.edit_token_hash))) throw new HttpError(404, 'not_published');
      return json({ invitation: publicView(row) }, 200, { 'Cache-Control': 'no-cache' });
    }
    if (seg[2] === 'rsvp' && m === 'POST') {
      if (row.status !== 'published') throw new HttpError(403, 'not_published');
      const ip = clientIp(request);
      if (!(await rateLimit(env, `rsvp:${slug}:${ip}`, 10, 600000))) throw new HttpError(429, 'rate_limited');
      const body = await readJson(request);
      const data = JSON.parse(row.data);
      const name = clampStr(body.name, 120);
      const answer = body.answer === 'yes' ? 'yes' : body.answer === 'no' ? 'no' : '';
      if (!name || !answer) throw new HttpError(400, 'name_and_answer_required');
      if (data.rsvpDeadline && new Date(data.rsvpDeadline + 'T23:59:59') < new Date()) throw new HttpError(410, 'deadline_passed');
      const plusOne = answer === 'yes' && data.askPlusOne ? clampStr(String(body.plusOne ?? ''), 3).replace(/[^0-9]/g, '') : '';
      const menu = answer === 'yes' && data.askMenu ? clampStr(body.menu, 80) : '';
      const comment = data.askComment ? clampStr(body.comment, 600) : '';
      const rid = randomId('r');
      await q(env, 'INSERT INTO responses (id, invitation_id, name, answer, plus_one, menu, comment, lang, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', rid, row.id, name, answer, plusOne, menu, comment, pickLang(body.lang, row.lang), (await sha256(ip)).slice(0, 16), now()).run();
      return json({ ok: true, id: rid }, 201);
    }
  }
  throw new HttpError(404, 'not_found');
}

// ---------- static site ----------
async function serveSite(request, env, url) {
  const guest = url.pathname.match(/^\/i\/([^/]+)\/?$/);
  if (guest) {
    await ensureSchema(env);
    const row = await getInvBySlug(env, decodeURIComponent(guest[1]).toLowerCase());
    const status = (!row || (row.status !== 'published' && !url.searchParams.get('preview'))) ? 404 : 200;
    const res = await env.ASSETS.fetch(new Request(new URL('/guest.html', url), { headers: request.headers }));
    return new Response(res.body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex' } });
  }
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(env, request);
    try {
      if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
        const res = await api(request, env, url);
        for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
        return res;
      }
      if (request.method === 'GET' || request.method === 'HEAD') return serveSite(request, env, url);
      return json({ error: 'method_not_allowed' }, 405);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.code, message: e.message !== e.code ? e.message : undefined }, e.status, cors);
      console.error('ERROR', request.method, url.pathname, e && e.stack || e);
      return json({ error: 'internal' }, 500, cors);
    }
  },
};
