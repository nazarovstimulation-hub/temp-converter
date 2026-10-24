#!/usr/bin/env node
'use strict';
// Checks a deployment end to end: DNS records, HTTPS, API health, guest page.
// Usage: node check-deploy.js [domain]      e.g. node check-deploy.js invitalia.co
const dns = require('node:dns').promises;
const domain = (process.argv[2] || 'invitalia.co').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
const RENDER_APEX_IP = '216.24.57.1';
let problems = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); problems++; };

(async () => {
  console.log(`\nDNS for ${domain}`);
  try { const a = await dns.resolve4(domain); a.includes(RENDER_APEX_IP) ? ok(`A ${a.join(', ')} → Render`) : bad(`A ${a.join(', ')} (expected ${RENDER_APEX_IP} for Render; check what the Render dashboard shows)`); }
  catch (e) { bad(`no A record for ${domain} (${e.code})`); }
  try { const c = await dns.resolveCname('www.' + domain); /onrender\.com$/.test(c[0]) ? ok(`CNAME www → ${c[0]}`) : bad(`CNAME www → ${c[0]} (expected <service>.onrender.com)`); }
  catch (e) { bad(`no CNAME for www.${domain} (${e.code})`); }

  for (const host of [domain, 'www.' + domain]) {
    console.log(`\nHTTPS https://${host}`);
    try {
      const r = await fetch(`https://${host}/api/health`, { redirect: 'follow' });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { ok(`API health: payments=${j.payments}, price=${(j.price.amount / 100).toFixed(2)} ${j.price.currency.toUpperCase()}, languages=${j.languages.join(',')}`); if (j.payments === 'mock') bad('payments are in MOCK mode: set STRIPE_SECRET_KEY on the server'); }
      else bad(`API health returned ${r.status}`);
      const g = await fetch(`https://${host}/i/no-such-slug`); g.status === 404 ? ok('guest route /i/:slug served (404 for unknown slug)') : bad(`guest route returned ${g.status}`);
      const s = await fetch(`https://${host}/`); (await s.text()).includes('Invitalia') ? ok('landing page served') : bad('landing page content unexpected');
    } catch (e) { bad(`cannot connect: ${e.cause && e.cause.code || e.message}`); }
  }
  console.log(problems ? `\n${problems} problem(s) found.` : '\nAll good: the deployment is live.');
  process.exit(problems ? 1 : 0);
})();
