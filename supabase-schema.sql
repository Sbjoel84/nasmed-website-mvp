-- NASMED Database Setup (Safe - handles existing objects)

-- Create tables (if not exists)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profession TEXT,
  membership_type TEXT,
  state TEXT,
  qualifications TEXT,
  workplace TEXT,
  referee1_name TEXT,
  referee1_email TEXT,
  referee1_phone TEXT,
  referee2_name TEXT,
  referee2_email TEXT,
  referee2_phone TEXT,
  statement TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  type TEXT,
  description TEXT,
  file_url TEXT,
  downloads INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  author_id UUID
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  member_id UUID,
  tier TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  amount TEXT
);

-- Enable RLS (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'applications'
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'publications'
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'subscriptions'
        AND n.nspname = 'public'
        AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'applications'
        AND policyname = 'allow_all_applications'
    ) THEN
        CREATE POLICY "allow_all_applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'publications'
        AND policyname = 'allow_all_publications'
    ) THEN
        CREATE POLICY "allow_all_publications" ON public.publications FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'subscriptions'
        AND policyname = 'allow_all_subscriptions'
    ) THEN
        CREATE POLICY "allow_all_subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Seed data (safe - won't duplicate)
INSERT INTO publications (title, type, description, status, downloads)
VALUES
  ('NASMED Clinical Guidelines 2024', 'Guidelines', 'Official clinical guidelines for sports injury management', 'published', 234),
  ('Quarterly Journal Q4 2024', 'Journal', 'Latest research in sports medicine', 'published', 567),
  ('Concussion Management Protocol', 'Protocol', 'Protocol for managing concussions in athletes', 'published', 892)
ON CONFLICT DO NOTHING;