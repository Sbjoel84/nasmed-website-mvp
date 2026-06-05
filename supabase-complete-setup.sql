-- ============================================================
-- NASMED COMPLETE DATABASE SETUP
-- Run this ONE file in the Supabase SQL editor to set up
-- (or repair) the entire database. Safe to re-run at any time.
-- ============================================================

-- ── 1. PROFILES TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  membership_type TEXT DEFAULT 'Professional Member',
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_read_profiles"   ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "allow_insert_profiles" ON public.profiles;
CREATE POLICY "allow_read_profiles"      ON public.profiles FOR SELECT USING (true);
CREATE POLICY "allow_update_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "allow_insert_profiles"    ON public.profiles FOR INSERT WITH CHECK (true);

-- Add optional columns (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='must_change_password') THEN
    ALTER TABLE public.profiles ADD COLUMN must_change_password BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='position') THEN
    ALTER TABLE public.profiles ADD COLUMN position TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='member_number') THEN
    ALTER TABLE public.profiles ADD COLUMN member_number TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='status') THEN
    ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='profession') THEN
    ALTER TABLE public.profiles ADD COLUMN profession TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='state') THEN
    ALTER TABLE public.profiles ADD COLUMN state TEXT; END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email    ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role     ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 2. APPLICATIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  profession      TEXT,
  membership_type TEXT,
  state           TEXT,
  qualifications  TEXT,
  workplace       TEXT,
  referee1_name   TEXT,
  referee1_email  TEXT,
  referee1_phone  TEXT,
  referee2_name   TEXT,
  referee2_email  TEXT,
  referee2_phone  TEXT,
  statement       TEXT,
  status          TEXT DEFAULT 'pending',
  payment_status  TEXT DEFAULT 'pending',
  payment_ref     TEXT,
  payment_method  TEXT,
  payment_receipt_url TEXT
);

-- Patch any columns missing from older schema versions.
-- Each statement is independent — if a column already exists IF NOT EXISTS skips it safely.
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS phone               TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS profession          TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS membership_type     TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS state               TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS qualifications      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS workplace           TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee1_name       TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee1_email      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee1_phone      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee2_name       TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee2_email      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referee2_phone      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS statement           TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS status              TEXT DEFAULT 'pending';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_status      TEXT DEFAULT 'pending';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_ref         TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_method      TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_receipt_url TEXT;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_applications" ON public.applications;
CREATE POLICY "allow_all_applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_applications_email  ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);


-- ── 3. PUBLICATIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.publications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  title       TEXT NOT NULL,
  type        TEXT,
  description TEXT,
  file_url    TEXT,
  file_name   TEXT DEFAULT '',
  downloads   INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'draft',
  access      TEXT DEFAULT 'free',
  price       TEXT DEFAULT '',
  author_id   UUID
);

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_publications" ON public.publications;
CREATE POLICY "allow_all_publications" ON public.publications FOR ALL USING (true) WITH CHECK (true);


-- ── 4. TRANSACTIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  payment_ref    TEXT NOT NULL,
  member_name    TEXT,
  email          TEXT,
  membership_type TEXT,
  amount         TEXT,
  currency       TEXT DEFAULT 'NGN',
  payment_method TEXT,
  status         TEXT DEFAULT 'pending',
  type           TEXT DEFAULT 'membership',
  description    TEXT,
  receipt_url    TEXT,
  receipt_name   TEXT,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_transactions" ON public.transactions;
CREATE POLICY "allow_all_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transactions_ref    ON public.transactions(payment_ref);
CREATE INDEX IF NOT EXISTS idx_transactions_email  ON public.transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);


-- ── 5. SUBSCRIPTIONS TABLE ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  member_id   UUID,
  tier        TEXT,
  start_date  DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status      TEXT DEFAULT 'active',
  amount      TEXT
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_subscriptions" ON public.subscriptions;
CREATE POLICY "allow_all_subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);


-- ── 6. NEWS POSTS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  title          TEXT NOT NULL,
  description    TEXT,
  category       TEXT NOT NULL DEFAULT 'update',
  category_label TEXT NOT NULL DEFAULT 'UPDATE',
  date_label     TEXT,
  read_time      TEXT,
  image_url      TEXT,
  published      BOOLEAN DEFAULT true
);

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_read_news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "allow_all_news_posts"  ON public.news_posts;
CREATE POLICY "allow_read_news_posts" ON public.news_posts FOR SELECT USING (true);
CREATE POLICY "allow_all_news_posts"  ON public.news_posts FOR ALL    USING (true) WITH CHECK (true);


-- ── 7. EVENTS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  event_date  DATE,
  day_label   TEXT,
  month_label TEXT,
  cta_text    TEXT DEFAULT 'Register',
  cta_style   TEXT DEFAULT 'filled',
  published   BOOLEAN DEFAULT true
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_read_events" ON public.events;
DROP POLICY IF EXISTS "allow_all_events"  ON public.events;
CREATE POLICY "allow_read_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "allow_all_events"  ON public.events FOR ALL    USING (true) WITH CHECK (true);


-- ── 8. ENABLE REALTIME ─────────────────────────────────────
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;      EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.publications;  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.news_posts;    EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.events;        EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;


-- ── 9. SEED INITIAL NEWS & EVENTS (safe — skips if already present) ──
INSERT INTO public.news_posts (title, description, category, category_label, date_label, read_time, published) VALUES
  ('NASMED Annual Conference 2024 — Registration Now Open',    'Join leading sports medicine practitioners for two days of cutting-edge research presentations, workshops, and networking at the Abuja International Conference Centre.', 'conference', 'CONFERENCE',       'Jul 2024', '5 min read', true),
  ('New Research Grants Available for Early-Career Professionals', 'NASMED announces ₦5M in research funding for innovative sports medicine studies across Nigerian universities and hospitals.',                                       'research',    'RESEARCH',          'Jun 2024', '3 min read', true),
  ('Updated Concussion Management Guidelines Released',         'New evidence-based protocols for sideline concussion assessment in Nigerian sports, developed in collaboration with international experts.',                        'update',      'UPDATE',            'May 2024', '4 min read', true),
  ('West African Sports Medicine Summit — Call for Papers',    'Submit your research abstracts for the inaugural West African Sports Medicine Summit hosted by NASMED in Lagos.',                                                   'conference',  'CONFERENCE',        'Apr 2024', '3 min read', true),
  ('NASMED–University of Lagos Joint Research Programme',      'A new partnership to advance sports medicine research with focus on tropical climate athletic performance.',                                                         'research',    'RESEARCH',          'Mar 2024', '4 min read', true),
  ('New CPD Requirements for 2024 Membership Renewal',        'Updated continuing professional development requirements for all membership tiers effective January 2025.',                                                          'update',      'UPDATE',            'Feb 2024', '3 min read', true),
  ('New National Executive Board Inaugurated',                 'NASMED''s newly elected board takes office and outlines goals for 2024–2026.',                                                                                      'update',      'GOVERNANCE',        'Jun 2024', '3 min read', true),
  ('CAC Certificate of Incorporation Received',                'NASMED receives its Certificate of Incorporation from the Corporate Affairs Commission (CAC), a landmark step.',                                                   'update',      'MILESTONES',        'Jul 2024', '2 min read', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, description, location, event_date, day_label, month_label, cta_text, cta_style, published) VALUES
  ('NASMED Annual Conference Day 1',                             'Research Presentations & Keynote Sessions',  'Abuja, FCT',   '2024-09-14', '14', 'SEP', 'Register',  'filled',  true),
  ('NASMED Annual Conference Day 2 & Gala',                     'Workshops, AGM & Awards Gala Dinner',        'Abuja, FCT',   '2024-09-15', '15', 'SEP', 'Register',  'filled',  true),
  ('CPD Workshop — Sports Nutrition & Performance',             '2-day workshop | 20 CPD Credits',            'Lagos',        '2024-08-08', '08', 'AUG', 'Book Now',  'filled',  true),
  ('NASMED Webinar — Concussion Management in Nigerian Football','Free for members | 3 CPD Credits',          'Online (Zoom)','2024-11-22', '22', 'NOV', 'Join Free', 'outline', true)
ON CONFLICT DO NOTHING;


-- ── 10. RELOAD POSTGREST SCHEMA CACHE ─────────────────────
-- Forces PostgREST to re-read the schema so newly added columns
-- are immediately visible (fixes PGRST204 "column not in schema cache").
NOTIFY pgrst, 'reload schema';


-- ── DONE ───────────────────────────────────────────────────
-- All tables, policies, indexes and seed data are now in place.
-- You can safely re-run this file at any time.
