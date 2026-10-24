#!/usr/bin/env node
// Creates the D1 database "invitalia" if it does not exist and writes its id into wrangler.toml.
// Needs wrangler to be logged in (wrangler login) or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID in the environment.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const tomlPath = path.join(here, '..', 'wrangler.toml');
const NAME = 'invitalia';
const run = (cmd) => execSync(cmd, { cwd: path.join(here, '..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

function listId() {
  const out = run('npx wrangler d1 list --json');
  const dbs = JSON.parse(out.slice(out.indexOf('[')));
  const db = dbs.find(d => d.name === NAME);
  return db ? (db.uuid || db.id) : null;
}

let id = listId();
if (!id) { console.log(`Creating D1 database "${NAME}"…`); run(`npx wrangler d1 create ${NAME}`); id = listId(); }
if (!id) { console.error('Could not determine the database id. Run `npx wrangler d1 list` and paste the id into wrangler.toml.'); process.exit(1); }

let toml = readFileSync(tomlPath, 'utf8');
if (!toml.includes(`database_id = "${id}"`)) {
  toml = toml.replace(/database_id = "[^"]*"/, `database_id = "${id}"`);
  writeFileSync(tomlPath, toml);
  console.log(`wrangler.toml updated with database_id ${id}`);
} else console.log(`wrangler.toml already has database_id ${id}`);
console.log('Applying migrations…');
run(`npx wrangler d1 migrations apply ${NAME} --remote`);
console.log('Done. Next: npm run deploy');
