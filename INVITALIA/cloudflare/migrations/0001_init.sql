-- INVITALIA schema for Cloudflare D1 (applied with `wrangler d1 migrations apply invitalia --remote`).
-- The Worker also creates these tables on first request, so this file is a safety net and documentation.
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
  invitation_id TEXT NOT NULL,
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
  invitation_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  raw TEXT
);
CREATE TABLE IF NOT EXISTS webhook_events (id TEXT PRIMARY KEY, received_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
