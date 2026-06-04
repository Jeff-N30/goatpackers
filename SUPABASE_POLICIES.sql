-- ═══════════════════════════════════════════════════════════════
-- Run this in Supabase → SQL Editor
-- Your tables already exist — this only adds policies & grants.
-- ═══════════════════════════════════════════════════════════════

-- 1. Grant base permissions to Supabase roles
--    (needed when tables are created via SQL, not the UI wizard)
GRANT SELECT ON public.events         TO anon, authenticated;
GRANT SELECT ON public.gallery        TO anon, authenticated;
GRANT SELECT ON public.team           TO anon, authenticated;
GRANT SELECT ON public.site_settings  TO anon, authenticated;
GRANT INSERT ON public.contacts       TO anon;
GRANT INSERT ON public.page_views     TO anon;
GRANT ALL    ON public.contacts       TO authenticated;
GRANT ALL    ON public.page_views     TO authenticated;
GRANT ALL    ON public.events         TO authenticated;
GRANT ALL    ON public.gallery        TO authenticated;
GRANT ALL    ON public.team           TO authenticated;
GRANT ALL    ON public.site_settings  TO authenticated;

-- 2. Enable RLS
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings  ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies — drop first in case any partial ones exist
DROP POLICY IF EXISTS "public_read"   ON public.events;
DROP POLICY IF EXISTS "public_read"   ON public.gallery;
DROP POLICY IF EXISTS "public_read"   ON public.team;
DROP POLICY IF EXISTS "public_read"   ON public.site_settings;
DROP POLICY IF EXISTS "public_insert" ON public.contacts;
DROP POLICY IF EXISTS "public_insert" ON public.page_views;
DROP POLICY IF EXISTS "admin_all"     ON public.events;
DROP POLICY IF EXISTS "admin_all"     ON public.gallery;
DROP POLICY IF EXISTS "admin_all"     ON public.team;
DROP POLICY IF EXISTS "admin_all"     ON public.contacts;
DROP POLICY IF EXISTS "admin_all"     ON public.page_views;
DROP POLICY IF EXISTS "admin_all"     ON public.site_settings;

-- Anyone can read public content
CREATE POLICY "public_read" ON public.events        FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.gallery       FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.team          FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.site_settings FOR SELECT USING (true);

-- Anyone can submit contact + page-view tracking
CREATE POLICY "public_insert" ON public.contacts   FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert" ON public.page_views FOR INSERT WITH CHECK (true);

-- Logged-in admins can do everything
CREATE POLICY "admin_all" ON public.events        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all" ON public.gallery       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all" ON public.team          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all" ON public.contacts      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all" ON public.page_views    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. gallery table is missing width/height — add them (nullable, safe to add)
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS width  integer;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS height integer;
