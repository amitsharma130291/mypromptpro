-- MyPromptPro D1 schema
-- Run once in the Cloudflare D1 console (or via: wrangler d1 execute mypromptpro-subscribers --remote --file=db/schema.sql)

CREATE TABLE IF NOT EXISTS subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  source     TEXT    NOT NULL DEFAULT 'homepage',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at);
