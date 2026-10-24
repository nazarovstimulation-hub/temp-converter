'use strict';
// Checks that every i18n key referenced by the site exists in every language dictionary.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const site = path.resolve(__dirname, process.env.SITE_DIR || '../site');
const src = fs.readFileSync(path.join(site, 'assets/i18n.js'), 'utf8');
const sandbox = { window: {}, document: { addEventListener() {}, readyState: 'loading', documentElement: { setAttribute() {}, getAttribute() { return null; } }, querySelectorAll() { return []; } }, navigator: { language: 'es' }, location: { search: '' }, localStorage: { getItem() { return null; }, setItem() {} }, CustomEvent: function () {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const D = sandbox.I18N.dict, LANGS = sandbox.I18N.langs;

const used = new Set();
for (const f of fs.readdirSync(site).filter(f => f.endsWith('.html')).concat(fs.readdirSync(path.join(site, 'assets')).filter(f => f.endsWith('.js') && f !== 'i18n.js').map(f => 'assets/' + f))) {
  const txt = fs.readFileSync(path.join(site, f), 'utf8');
  for (const m of txt.matchAll(/data-i18n(?:-html|-placeholder|-aria|-title)?="([^"]+)"/g)) used.add(m[1]);
  for (const m of txt.matchAll(/data-title-key="([^"]+)"/g)) used.add(m[1]);
  for (const m of txt.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) used.add(m[1]);
  for (const m of txt.matchAll(/I18N\.t\(\s*'([a-zA-Z0-9_.]+)'/g)) used.add(m[1]);
  for (const m of txt.matchAll(/I18N\.n\(\s*'([a-zA-Z0-9_.]+)'/g)) { used.add(m[1] + '.one'); used.add(m[1] + '.other'); }
}
// dynamic keys built in code
['inv.rsvp.doneYes', 'inv.rsvp.doneNo', 'io.exportTitle', 'io.importTitle', 'io.exportText', 'io.importText', 'dash.pill.yes', 'dash.pill.no'].forEach(k => used.add(k));

let missing = 0;
for (const lang of LANGS) {
  for (const k of used) if (D[lang][k] == null) { console.log(`missing ${lang}: ${k}`); missing++; }
}
// keys that exist in es but not elsewhere (translation gaps)
for (const lang of LANGS) for (const k of Object.keys(D.es)) if (D[lang][k] == null && !/\.(few|many)$/.test(k)) { console.log(`gap ${lang}: ${k}`); missing++; }
// placeholder consistency
for (const lang of LANGS) for (const k of Object.keys(D.es)) {
  const a = (D.es[k].match(/\{[a-z]+\}/g) || []).sort().join(','), b = ((D[lang][k] || '').match(/\{[a-z]+\}/g) || []).sort().join(',');
  if (D[lang][k] != null && a !== b) { console.log(`placeholder mismatch ${lang}: ${k}`); missing++; }
}
if (missing) { console.error(`${missing} i18n problem(s)`); process.exit(1); }
console.log(`i18n ok: ${used.size} keys used, ${LANGS.length} languages, ${Object.keys(D.es).length} keys each.`);
