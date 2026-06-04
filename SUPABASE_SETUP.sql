-- ═══════════════════════════════════════════════════════════════
-- Goatpackers — Supabase database setup
-- Run this in the Supabase SQL Editor (supabase.com → Project → SQL)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Create tables (if not done yet) ────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  description      text NOT NULL,
  date             date NOT NULL,
  location         text NOT NULL,
  difficulty       text NOT NULL CHECK (difficulty IN ('Easy','Moderate','Hard','Expert')),
  type             text NOT NULL CHECK (type IN ('upcoming','past')),
  image_url        text,
  max_participants int,
  current_participants int DEFAULT 0,
  duration_hours   numeric,
  elevation_gain_m int,
  created_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url     text NOT NULL,
  caption       text,
  width         int  DEFAULT 800,
  height        int  DEFAULT 600,
  display_order int  CHECK (display_order IN (1,2,3)),
  event_id      uuid,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name      text NOT NULL,
  role      text NOT NULL,
  bio       text,
  image_url text,
  "order"   int  DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_views (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  path       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key        text NOT NULL UNIQUE,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- ── 2. Enable Row Level Security ─────────────────────────────

ALTER TABLE events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery     ENABLE ROW LEVEL SECURITY;
ALTER TABLE team        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ── 3. RLS Policies ──────────────────────────────────────────

-- Public can read events, gallery, team, site_settings
CREATE POLICY "public read events"        ON events        FOR SELECT USING (true);
CREATE POLICY "public read gallery"       ON gallery       FOR SELECT USING (true);
CREATE POLICY "public read team"          ON team          FOR SELECT USING (true);
CREATE POLICY "public read site_settings" ON site_settings FOR SELECT USING (true);

-- Public can insert contacts and page_views (forms + tracker)
CREATE POLICY "public insert contacts"   ON contacts   FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert page_views" ON page_views FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "admin all events"        ON events        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all gallery"       ON gallery       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all team"          ON team          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all contacts"      ON contacts      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all page_views"    ON page_views    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── 4. Storage: make gallery bucket public ───────────────────
-- Do this in Supabase Dashboard → Storage → gallery → Policies
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ── 5. Required environment variables ────────────────────────
-- Add to .env.local in your web/ directory:
--
--   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
--   SUPABASE_SERVICE_ROLE_KEY=eyJ...   ← get from Supabase → Settings → API → service_role key
--
-- The service role key is NEVER exposed to the browser.
-- It's used server-side to bypass RLS for admin operations.
