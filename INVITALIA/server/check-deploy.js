#!/usr/bin/env node
'use strict';
// Checks the Cloudflare deployment end to end: name servers, DNS, HTTPS, API health, guest page.
// Usage: node check-deploy.js [domain]      e.g. node check-deploy.js invitalia.co
const dns = require('node:dns').promises;
const domain = (process.argv[2] || 'invitalia.co').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
let problems = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); problems++; };

(async () => {
  console.log(`\nDNS for ${domain}`);
  try { const ns = await dns.resolveNs(domain); ns.some(n => /cloudflare\.com$/i.test(n)) ? ok(`NS ${ns.join(', ')} → Cloudflare`) : bad(`NS ${ns.join(', ')} (expected *.ns.cloudflare.com; change the name servers at the registrar)`); }
  catch (e) { bad(`no NS records for ${domain} (${e.code})`); }
  try { const a = await dns.resolve4(domain); ok(`A ${a.join(', ')} (Cloudflare proxy)`); } catch (e) { bad(`no A record for ${domain} (${e.code}): attach the custom domain to the Worker`); }
  try { await dns.resolve4('www.' + domain); ok('www resolves'); } catch (e) { bad(`www.${domain} does not resolve (${e.code}): add it as a second custom domain on the Worker`); }

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
