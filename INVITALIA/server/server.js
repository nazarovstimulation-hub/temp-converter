#!/usr/bin/env node
'use strict';
/**
 * INVITALIA.co backend
 * Zero-dependency Node.js (>= 22.13) server: HTTP API + static site + SQLite storage + Stripe Checkout.
 *
 * Environment (see .env.example):
 *   PORT                 default 8787
 *   HOST                 default 0.0.0.0
 *   BASE_URL             public URL of this deployment, e.g. https://invitalia.co (used in links and QR)
 *   SITE_DIR             folder with the static site, default ../site
 *   DATABASE_PATH        SQLite file, default ./data/invitalia.db
 *   STRIPE_SECRET_KEY    sk_live_… / sk_test_…  (if empty, payments run in MOCK mode and publish immediately)
 *   STRIPE_WEBHOOK_SECRET whsec_…  (optional but recommended)
 *   PRICE_AMOUNT         price in minor units, default 2900 (= 29.00)
 *   PRICE_CURRENCY       default eur
 *   CORS_ORIGINS         comma-separated list of allowed origins for the API (e.g. the GitHub Pages site); empty = same origin only
 *   TRUST_PROXY          "1" if behind a reverse proxy (uses X-Forwarded-For for rate limiting)
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// ---------- config ----------
loadDotEnv(path.join(__dirname, '.env'));
const CFG = {
  port: Number(process.env.PORT || 8787),
  host: process.env.HOST || '0.0.0.0',
  baseUrl: (process.env.BASE_URL || `http://localhost:${process.env.PORT || 8787}`).replace(/\/$/, ''),
  siteDir: path.resolve(__dirname, process.env.SITE_DIR || '../site'),
  dbPath: path.resolve(__dirname, process.env.DATABASE_PATH || './data/invitalia.db'),
  stripeKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  priceAmount: Number(process.env.PRICE_AMOUNT || 2900),
  priceCurrency: (process.env.PRICE_CURRENCY || 'eur').toLowerCase(),
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),
  trustProxy: process.env.TRUST_PROXY === '1',
};
const MOCK_PAYMENTS = !CFG.stripeKey;
const LANGS = ['es', 'en', 'it', 'pt', 'fr', 'de', 'ru'];
const RESERVED_SLUGS = new Set(['api', 'i', 'admin', 'editor', 'index', 'assets', 'login', 'pay', 'static', 'www', 'app', 'help', 'about', 'pricing', 'terms', 'privacy']);

// ---------- database ----------
fs.mkdirSync(path.dirname(CFG.dbPath), { recursive: true });
const db = new DatabaseSync(CFG.dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS invitations (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    edit_token_hash TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'es',
    data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    paid_at TEXT
  );
  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    answer TEXT NOT NULL,
    plus_one TEXT,
    menu TEXT,
    comment TEXT,
    lang TEXT,
    ip_hash TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_responses_inv ON responses(invitation_id, created_at);
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    session_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    raw TEXT
  );
  CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    received_at TEXT NOT NULL
  );
`);

const Q = {
  insertInv: db.prepare(`INSERT INTO invitations (id, slug, edit_token_hash, lang, data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)`),
  getInvById: db.prepare(`SELECT * FROM invitations WHERE id = ?`),
  getInvBySlug: db.prepare(`SELECT * FROM invitations WHERE slug = ?`),
  updateInv: db.prepare(`UPDATE invitations SET slug = ?, lang = ?, data = ?, updated_at = ? WHERE id = ?`),
  publishInv: db.prepare(`UPDATE invitations SET status = 'published', published_at = COALESCE(published_at, ?), paid_at = COALESCE(paid_at, ?), updated_at = ? WHERE id = ?`),
  insertResp: db.prepare(`INSERT INTO responses (id, invitation_id, name, answer, plus_one, menu, comment, lang, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  listResp: db.prepare(`SELECT id, name, answer, plus_one, menu, comment, lang, created_at FROM responses WHERE invitation_id = ? ORDER BY created_at DESC`),
  countResp: db.prepare(`SELECT answer, COUNT(*) AS n, COALESCE(SUM(CASE WHEN plus_one GLOB '[0-9]*' THEN CAST(plus_one AS INTEGER) ELSE 0 END), 0) AS extra FROM responses WHERE invitation_id = ? GROUP BY answer`),
  insertPay: db.prepare(`INSERT INTO payments (id, invitation_id, provider, session_id, amount, currency, status, created_at, updated_at, raw) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  getPayBySession: db.prepare(`SELECT * FROM payments WHERE session_id = ?`),
  updatePay: db.prepare(`UPDATE payments SET status = ?, updated_at = ?, raw = ? WHERE id = ?`),
  seenEvent: db.prepare(`SELECT 1 FROM webhook_events WHERE id = ?`),
  markEvent: db.prepare(`INSERT OR IGNORE INTO webhook_events (id, received_at) VALUES (?, ?)`),
};

// ---------- helpers ----------
function now() { return new Date().toISOString(); }
function id(prefix) { return prefix + '_' + crypto.randomBytes(9).toString('base64url'); }
function token() { return crypto.randomBytes(32).toString('base64url'); }
function sha256(s) { return crypto.createHash('sha256').update(String(s)).digest('hex'); }
function safeEqual(a, b) { const x = Buffer.from(String(a)); const y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); }
function clampStr(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
function pickLang(v, fallback) { v = String(v || '').slice(0, 2).toLowerCase(); return LANGS.includes(v) ? v : (fallback || 'es'); }

const TRANSLIT = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[а-яё]/g, c => TRANSLIT[c] ?? '')
    .replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}
function validSlug(s) { return /^[a-z0-9](?:[a-z0-9-]{1,46}[a-z0-9])?$/.test(s) && !RESERVED_SLUGS.has(s); }
function uniqueSlug(base, selfId) {
  let s = validSlug(base) ? base : 'invitacion';
  for (let i = 0; i < 20; i++) {
    const row = Q.getInvBySlug.get(s);
    if (!row || row.id === selfId) return s;
    s = (validSlug(base) ? base : 'invitacion').slice(0, 42) + '-' + crypto.randomBytes(2).toString('hex');
  }
  return id('inv').toLowerCase().replace(/_/g, '-');
}

function sanitizeData(input) {
  // Keep only known fields with bounded sizes; the invitation JSON is what the editor produces.
  const d = (input && typeof input === 'object') ? input : {};
  const prog = Array.isArray(d.program) ? d.program.slice(0, 30).map(p => ({ t: clampStr(p && p.t, 10), n: clampStr(p && p.n, 120) })) : [];
  return {
    template: ['palazzo', 'linea', 'heritage', 'amalfi', 'botanica', 'noir'].includes(d.template) ? d.template : 'palazzo',
    name1: clampStr(d.name1, 60), name2: clampStr(d.name2, 60),
    greeting: clampStr(d.greeting, 600),
    date: /^\d{4}-\d{2}-\d{2}$/.test(d.date || '') ? d.date : '', time: /^\d{2}:\d{2}$/.test(d.time || '') ? d.time : '',
    venue: clampStr(d.venue, 120), address: clampStr(d.address, 200),
    mapUrl: /^https?:\/\//i.test(d.mapUrl || '') ? clampStr(d.mapUrl, 500) : '',
    program: prog, dress: clampStr(d.dress, 200),
    rsvpQuestion: clampStr(d.rsvpQuestion, 160), rsvpDeadline: /^\d{4}-\d{2}-\d{2}$/.test(d.rsvpDeadline || '') ? d.rsvpDeadline : '',
    askPlusOne: !!d.askPlusOne, askMenu: !!d.askMenu, menuOptions: clampStr(d.menuOptions, 300), askComment: !!d.askComment,
    music: !!d.music, track: clampStr(d.track, 120),
    slug: slugify(d.slug),
  };
}
function publicView(row) {
  const data = JSON.parse(row.data);
  return { slug: row.slug, lang: row.lang, status: row.status, publishedAt: row.published_at, data };
}
function ownerView(row) {
  const data = JSON.parse(row.data);
  const counts = { yes: 0, no: 0, extra: 0 };
  for (const c of Q.countResp.all(row.id)) { counts[c.answer] = c.n; if (c.answer === 'yes') counts.extra = c.extra; }
  return { id: row.id, slug: row.slug, lang: row.lang, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, publishedAt: row.published_at, paidAt: row.paid_at,
    url: `${CFG.baseUrl}/i/${row.slug}`, data, counts, price: { amount: CFG.priceAmount, currency: CFG.priceCurrency }, payments: MOCK_PAYMENTS ? 'mock' : 'stripe' };
}

// ---------- rate limiting ----------
const buckets = new Map();
function rateLimit(key, limit, windowMs) {
  const t = Date.now(); let b = buckets.get(key);
  if (!b || b.reset < t) { b = { count: 0, reset: t + windowMs }; buckets.set(key, b); }
  b.count++; return b.count <= limit;
}
setInterval(() => { const t = Date.now(); for (const [k, b] of buckets) if (b.reset < t) buckets.delete(k); }, 60000).unref();
function clientIp(req) {
  if (CFG.trustProxy) { const xf = req.headers['x-forwarded-for']; if (xf) return String(xf).split(',')[0].trim(); }
  return req.socket.remoteAddress || '';
}

// ---------- http plumbing ----------
class HttpError extends Error { constructor(status, code, message) { super(message || code); this.status = status; this.code = code; } }
function send(res, status, body, headers) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {});
  res.writeHead(status, h); res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => { size += c.length; if (size > (limit || 256 * 1024)) { reject(new HttpError(413, 'payload_too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req) {
  const raw = await readBody(req);
  if (!raw.length) return {};
  try { return JSON.parse(raw.toString('utf8')); } catch { throw new HttpError(400, 'invalid_json'); }
}
function bearer(req, url) {
  const h = req.headers.authorization || '';
  if (/^Bearer\s+/i.test(h)) return h.replace(/^Bearer\s+/i, '').trim();
  return url.searchParams.get('token') || '';
}
function requireOwner(req, url, invId) {
  const row = Q.getInvById.get(invId);
  if (!row) throw new HttpError(404, 'not_found');
  const t = bearer(req, url);
  if (!t || !safeEqual(sha256(t), row.edit_token_hash)) throw new HttpError(401, 'unauthorized');
  return row;
}
function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && CFG.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '600');
  }
}

// ---------- Stripe (REST, no SDK) ----------
function formEncode(obj, prefix, out) {
  out = out || [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) continue;
    if (typeof v === 'object') formEncode(v, key, out); else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join('&');
}
async function stripe(method, endpoint, body) {
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method, headers: { Authorization: `Bearer ${CFG.stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Stripe-Version': '2024-06-20' },
    body: body ? formEncode(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new HttpError(502, 'stripe_error', (json.error && json.error.message) || `Stripe ${res.status}`);
  return json;
}
function verifyStripeSignature(raw, header) {
  if (!CFG.stripeWebhookSecret) return true; // not configured: accept (log a warning at startup)
  const parts = Object.fromEntries(String(header || '').split(',').map(p => p.split('=')));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac('sha256', CFG.stripeWebhookSecret).update(`${t}.${raw}`).digest('hex');
  return safeEqual(expected, v1);
}
function markPaidAndPublish(invId, sessionId, amount, currency, raw) {
  const ts = now();
  const pay = sessionId ? Q.getPayBySession.get(sessionId) : null;
  if (pay) Q.updatePay.run('paid', ts, raw ? JSON.stringify(raw).slice(0, 20000) : pay.raw, pay.id);
  else Q.insertPay.run(id('pay'), invId, MOCK_PAYMENTS ? 'mock' : 'stripe', sessionId || null, amount, currency, 'paid', ts, ts, raw ? JSON.stringify(raw).slice(0, 20000) : null);
  Q.publishInv.run(ts, ts, ts, invId);
}
const PRODUCT_NAME = { es: 'Invitación de boda digital Invitalia', en: 'Invitalia digital wedding invitation', it: 'Invito di nozze digitale Invitalia', pt: 'Convite de casamento digital Invitalia', fr: 'Faire-part de mariage numérique Invitalia', de: 'Digitale Hochzeitseinladung Invitalia', ru: 'Электронное свадебное приглашение Invitalia' };

// ---------- API routes ----------
async function api(req, res, url) {
  const m = req.method;
  const p = url.pathname.replace(/\/+$/, '');
  const seg = p.split('/').slice(2); // after /api

  if (m === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (p === '/api/health') return send(res, 200, { ok: true, payments: MOCK_PAYMENTS ? 'mock' : 'stripe', price: { amount: CFG.priceAmount, currency: CFG.priceCurrency }, languages: LANGS, time: now() });

  // --- organizer: create ---
  if (p === '/api/invitations' && m === 'POST') {
    if (!rateLimit('create:' + clientIp(req), 20, 3600000)) throw new HttpError(429, 'rate_limited');
    const body = await readJson(req);
    const data = sanitizeData(body.data);
    const lang = pickLang(body.lang, 'es');
    const base = data.slug || slugify(`${data.name1} ${data.name2}`) || 'invitacion';
    const slug = uniqueSlug(base);
    data.slug = slug;
    const invId = id('inv'); const tok = token(); const ts = now();
    Q.insertInv.run(invId, slug, sha256(tok), lang, JSON.stringify(data), ts, ts);
    return send(res, 201, { id: invId, editToken: tok, invitation: ownerView(Q.getInvById.get(invId)) });
  }

  // --- organizer: read / update / responses / checkout ---
  if (seg[0] === 'invitations' && seg[1]) {
    const invId = seg[1];
    if (seg.length === 2 && m === 'GET') { const row = requireOwner(req, url, invId); return send(res, 200, { invitation: ownerView(row) }); }
    if (seg.length === 2 && m === 'PUT') {
      const row = requireOwner(req, url, invId);
      const body = await readJson(req);
      const data = sanitizeData(body.data);
      const lang = pickLang(body.lang, row.lang);
      const wanted = data.slug || row.slug;
      const slug = wanted === row.slug ? row.slug : uniqueSlug(wanted, row.id);
      data.slug = slug;
      Q.updateInv.run(slug, lang, JSON.stringify(data), now(), invId);
      return send(res, 200, { invitation: ownerView(Q.getInvById.get(invId)) });
    }
    if (seg[2] === 'responses' && m === 'GET') {
      const row = requireOwner(req, url, invId);
      return send(res, 200, { responses: Q.listResp.all(invId).map(r => ({ id: r.id, name: r.name, answer: r.answer, plusOne: r.plus_one, menu: r.menu, comment: r.comment, lang: r.lang, createdAt: r.created_at })), counts: ownerView(row).counts });
    }
    if (seg[2] === 'responses.csv' && m === 'GET') {
      const row = requireOwner(req, url, invId);
      const lang = pickLang(url.searchParams.get('lang'), row.lang);
      const H = { es: ['Invitado', 'Respuesta', 'Acompañantes', 'Menú', 'Comentario', 'Fecha'], en: ['Guest', 'Answer', 'Plus ones', 'Menu', 'Comment', 'Date'], it: ['Ospite', 'Risposta', 'Accompagnatori', 'Menù', 'Commento', 'Data'], pt: ['Convidado', 'Resposta', 'Acompanhantes', 'Menu', 'Comentário', 'Data'], fr: ['Invité', 'Réponse', 'Accompagnants', 'Menu', 'Commentaire', 'Date'], de: ['Gast', 'Antwort', 'Begleitung', 'Menü', 'Kommentar', 'Datum'], ru: ['Гость', 'Ответ', 'Спутники', 'Меню', 'Комментарий', 'Дата'] }[lang];
      const A = { es: { yes: 'Asistirá', no: 'No asistirá' }, en: { yes: 'Attending', no: 'Not attending' }, it: { yes: 'Parteciperà', no: 'Non parteciperà' }, pt: { yes: 'Vai', no: 'Não vai' }, fr: { yes: 'Présent', no: 'Absent' }, de: { yes: 'Kommt', no: 'Kommt nicht' }, ru: { yes: 'Придёт', no: 'Не сможет' } }[lang];
      const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      const lines = [H.map(esc).join(';')].concat(Q.listResp.all(invId).map(r => [r.name, A[r.answer] || r.answer, r.plus_one || '', r.menu || '', r.comment || '', r.created_at.replace('T', ' ').slice(0, 16)].map(esc).join(';')));
      return send(res, 200, '﻿' + lines.join('\r\n'), { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="invitalia-${row.slug}.csv"` });
    }
    if (seg[2] === 'checkout' && seg.length === 3 && m === 'POST') {
      const row = requireOwner(req, url, invId);
      const body = await readJson(req);
      const lang = pickLang(body.lang, row.lang);
      if (row.status === 'published') return send(res, 200, { alreadyPublished: true, invitation: ownerView(row) });
      if (MOCK_PAYMENTS) {
        markPaidAndPublish(invId, 'mock_' + id('s'), CFG.priceAmount, CFG.priceCurrency, { mock: true });
        return send(res, 200, { mock: true, url: `${CFG.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&paid=1`, invitation: ownerView(Q.getInvById.get(invId)) });
      }
      const successUrl = /^https?:\/\//.test(body.successUrl || '') ? body.successUrl : `${CFG.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = /^https?:\/\//.test(body.cancelUrl || '') ? body.cancelUrl : `${CFG.baseUrl}/editor.html?id=${encodeURIComponent(invId)}&canceled=1`;
      const session = await stripe('POST', 'checkout/sessions', {
        mode: 'payment', locale: lang, client_reference_id: invId,
        success_url: successUrl, cancel_url: cancelUrl,
        line_items: [{ quantity: 1, price_data: { currency: CFG.priceCurrency, unit_amount: CFG.priceAmount, product_data: { name: PRODUCT_NAME[lang] || PRODUCT_NAME.es, description: `${CFG.baseUrl}/i/${row.slug}` } } }],
        metadata: { invitation_id: invId, slug: row.slug },
      });
      const ts = now();
      Q.insertPay.run(id('pay'), invId, 'stripe', session.id, CFG.priceAmount, CFG.priceCurrency, 'pending', ts, ts, null);
      return send(res, 200, { url: session.url, sessionId: session.id });
    }
    if (seg[2] === 'checkout' && seg[3] === 'verify' && m === 'POST') {
      // Fallback for deployments without a webhook: the editor posts the session id from the success redirect.
      const row = requireOwner(req, url, invId);
      const body = await readJson(req);
      if (row.status === 'published') return send(res, 200, { paid: true, invitation: ownerView(row) });
      if (MOCK_PAYMENTS) throw new HttpError(400, 'mock_mode');
      const sid = clampStr(body.sessionId, 120);
      const pay = Q.getPayBySession.get(sid);
      if (!pay || pay.invitation_id !== invId) throw new HttpError(404, 'session_not_found');
      const session = await stripe('GET', `checkout/sessions/${encodeURIComponent(sid)}`);
      if (session.payment_status === 'paid') { markPaidAndPublish(invId, sid, session.amount_total || CFG.priceAmount, session.currency || CFG.priceCurrency, { id: session.id, payment_status: session.payment_status }); return send(res, 200, { paid: true, invitation: ownerView(Q.getInvById.get(invId)) }); }
      return send(res, 200, { paid: false, paymentStatus: session.payment_status });
    }
  }

  // --- Stripe webhook ---
  if (p === '/api/stripe/webhook' && m === 'POST') {
    const raw = (await readBody(req, 1024 * 1024)).toString('utf8');
    if (!verifyStripeSignature(raw, req.headers['stripe-signature'])) throw new HttpError(400, 'bad_signature');
    let event; try { event = JSON.parse(raw); } catch { throw new HttpError(400, 'invalid_json'); }
    if (event.id && Q.seenEvent.get(event.id)) return send(res, 200, { received: true, duplicate: true });
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const s = event.data && event.data.object || {};
      const invId = (s.metadata && s.metadata.invitation_id) || s.client_reference_id;
      if (invId && Q.getInvById.get(invId) && s.payment_status === 'paid') markPaidAndPublish(invId, s.id, s.amount_total || CFG.priceAmount, s.currency || CFG.priceCurrency, { id: s.id, payment_status: s.payment_status, customer_email: s.customer_details && s.customer_details.email });
    }
    if (event.id) Q.markEvent.run(event.id, now());
    return send(res, 200, { received: true });
  }

  // --- guests: public invitation + RSVP ---
  if (seg[0] === 'i' && seg[1]) {
    const slug = seg[1].toLowerCase();
    const row = Q.getInvBySlug.get(slug);
    if (!row) throw new HttpError(404, 'not_found');
    if (seg.length === 2 && m === 'GET') {
      const preview = url.searchParams.get('preview');
      if (row.status !== 'published' && !(preview && safeEqual(sha256(preview), row.edit_token_hash))) throw new HttpError(404, 'not_published');
      return send(res, 200, { invitation: publicView(row) }, { 'Cache-Control': 'no-cache' });
    }
    if (seg[2] === 'rsvp' && m === 'POST') {
      if (row.status !== 'published') throw new HttpError(403, 'not_published');
      const ip = clientIp(req);
      if (!rateLimit(`rsvp:${slug}:${ip}`, 10, 600000)) throw new HttpError(429, 'rate_limited');
      const body = await readJson(req);
      const data = JSON.parse(row.data);
      const name = clampStr(body.name, 120);
      const answer = body.answer === 'yes' ? 'yes' : body.answer === 'no' ? 'no' : '';
      if (!name || !answer) throw new HttpError(400, 'name_and_answer_required');
      if (data.rsvpDeadline && new Date(data.rsvpDeadline + 'T23:59:59') < new Date()) throw new HttpError(410, 'deadline_passed');
      const plusOne = answer === 'yes' && data.askPlusOne ? clampStr(String(body.plusOne ?? ''), 3).replace(/[^0-9]/g, '') : '';
      const menu = answer === 'yes' && data.askMenu ? clampStr(body.menu, 80) : '';
      const comment = data.askComment ? clampStr(body.comment, 600) : '';
      const rid = id('r');
      Q.insertResp.run(rid, row.id, name, answer, plusOne, menu, comment, pickLang(body.lang, row.lang), sha256(ip).slice(0, 16), now());
      return send(res, 201, { ok: true, id: rid });
    }
  }

  throw new HttpError(404, 'not_found');
}

// ---------- static site ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  let status = 200;
  if (rel === '/') rel = '/index.html';
  const guest = rel.match(/^\/i\/([^/]+)\/?$/);
  if (guest) {                                                    // pretty guest URLs: the page itself reports the state, the status code tells crawlers
    const row = Q.getInvBySlug.get(guest[1].toLowerCase());
    if (!row || (row.status !== 'published' && !url.searchParams.get('preview'))) status = 404;
    rel = '/guest.html';
  }
  const file = path.normalize(path.join(CFG.siteDir, rel));
  if (!file.startsWith(CFG.siteDir)) return send(res, 403, { error: 'forbidden' });
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { return fs.readFile(path.join(CFG.siteDir, '404.html'), (e2, buf) => { res.writeHead(404, { 'Content-Type': e2 ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8' }); res.end(e2 ? 'Not found' : buf); }); }
    const ext = path.extname(file).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
    if (ext === '.html') headers['X-Frame-Options'] = 'SAMEORIGIN';
    res.writeHead(status, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  cors(req, res);
  try {
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) await api(req, res, url);
    else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, url);
    else send(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { error: e.code, message: e.message !== e.code ? e.message : undefined });
    console.error(now(), 'ERROR', req.method, url.pathname, e);
    send(res, 500, { error: 'internal' });
  }
});

if (require.main === module) {
  server.listen(CFG.port, CFG.host, () => {
    console.log(`INVITALIA server  →  http://${CFG.host}:${CFG.port}`);
    console.log(`  base url   ${CFG.baseUrl}`);
    console.log(`  site dir   ${CFG.siteDir}`);
    console.log(`  database   ${CFG.dbPath}`);
    console.log(`  payments   ${MOCK_PAYMENTS ? 'MOCK (set STRIPE_SECRET_KEY to enable Stripe)' : 'Stripe' + (CFG.stripeWebhookSecret ? '' : '  (warning: STRIPE_WEBHOOK_SECRET not set, webhook signatures are NOT verified)')}`);
    console.log(`  price      ${(CFG.priceAmount / 100).toFixed(2)} ${CFG.priceCurrency.toUpperCase()}`);
  });
}
module.exports = { server, db, CFG };

function loadDotEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* no .env */ }
}
