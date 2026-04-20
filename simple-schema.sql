-- Simple Supabase-compatible schema for NASMED
-- Run this in Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  membership_type TEXT DEFAULT 'Professional Member',
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON public.profiles;

-- Create policies
CREATE POLICY "allow_read_profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "allow_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create other tables
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

-- Enable RLS on other tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_all_applications" ON public.applications;
DROP POLICY IF EXISTS "allow_all_publications" ON public.publications;
DROP POLICY IF EXISTS "allow_all_subscriptions" ON public.subscriptions;

-- Create policies for other tables
CREATE POLICY "allow_all_applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_publications" ON public.publications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- Create function and trigger for auto-profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Seed publications
INSERT INTO publications (title, type, description, status, downloads)
VALUES
  ('NASMED Clinical Guidelines 2024', 'Guidelines', 'Official clinical guidelines for sports injury management', 'published', 234),
  ('Quarterly Journal Q4 2024', 'Journal', 'Latest research in sports medicine', 'published', 567),
  ('Concussion Management Protocol', 'Protocol', 'Protocol for managing concussions in athletes', 'published', 892)
ON CONFLICT DO NOTHING;