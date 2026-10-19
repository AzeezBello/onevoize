-- ONE VOIZE Dashboard Schema
-- Run this once against your Neon DB project to initialize all tables.

-- ============================================================
-- USERS (admin / superadmin accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  password    TEXT        NOT NULL,   -- bcrypt hash
  role        TEXT        NOT NULL DEFAULT 'admin'
                          CHECK (role IN ('admin', 'superadmin')),
  avatar_url  TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DONATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id            SERIAL PRIMARY KEY,
  reference     TEXT        NOT NULL UNIQUE,
  donor_name    TEXT        NOT NULL,
  donor_email   TEXT        NOT NULL,
  amount        NUMERIC(12,2) NOT NULL,
  currency      TEXT        NOT NULL DEFAULT 'NGN',
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','success','failed')),
  campaign      TEXT,
  message       TEXT,
  channel       TEXT,        -- paystack channel (card, bank_transfer …)
  paid_at       TIMESTAMPTZ,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS members (
  id                 SERIAL PRIMARY KEY,
  full_name          TEXT        NOT NULL,
  email              TEXT        UNIQUE,
  phone              TEXT,
  address            TEXT,
  occupation         TEXT,
  application_reason TEXT,
  membership_no      TEXT        UNIQUE,
  status             TEXT        NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending','active','inactive','suspended')),
  joined_at          DATE        NOT NULL DEFAULT CURRENT_DATE,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id            SERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  description   TEXT,
  location      TEXT,
  event_date    TIMESTAMPTZ NOT NULL,
  end_date      TIMESTAMPTZ,
  status        TEXT        NOT NULL DEFAULT 'upcoming'
                            CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
  image_url     TEXT,
  max_attendees INT,
  created_by    INT         REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id            SERIAL PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        NOT NULL UNIQUE,
  description   TEXT,
  goal_amount   NUMERIC(12,2),
  raised_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','paused','completed','cancelled')),
  start_date    DATE,
  end_date      DATE,
  image_url     TEXT,
  created_by    INT         REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GALLERY ITEMS (photos & videos managed by admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id            SERIAL PRIMARY KEY,
  media_type    TEXT        NOT NULL DEFAULT 'image'
                            CHECK (media_type IN ('image', 'video')),
  src           TEXT        NOT NULL,
  title         TEXT        NOT NULL,
  caption       TEXT,
  alt_text      TEXT,
  category      TEXT        NOT NULL DEFAULT 'club',
  display_order INT         NOT NULL DEFAULT 0,
  is_published  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by    INT         REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INT         REFERENCES users(id),
  action      TEXT        NOT NULL,
  entity      TEXT        NOT NULL,
  entity_id   INT,
  details     JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_donations_status    ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created   ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_status      ON members(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date   ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_status    ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_gallery_order       ON gallery_items(display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user     ON audit_logs(user_id);
