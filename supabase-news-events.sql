-- NASMED News & Events tables
-- Run this in the Supabase SQL editor after supabase-schema.sql

-- News Posts table
CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'update',
  category_label TEXT NOT NULL DEFAULT 'UPDATE',
  date_label TEXT,
  read_time TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT true
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date DATE,
  day_label TEXT,
  month_label TEXT,
  cta_text TEXT DEFAULT 'Register',
  cta_style TEXT DEFAULT 'filled',
  published BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies: public read, full access for authenticated (admin)
DROP POLICY IF EXISTS "allow_read_news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "allow_all_news_posts" ON public.news_posts;
CREATE POLICY "allow_read_news_posts" ON public.news_posts FOR SELECT USING (true);
CREATE POLICY "allow_all_news_posts" ON public.news_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_read_events" ON public.events;
DROP POLICY IF EXISTS "allow_all_events" ON public.events;
CREATE POLICY "allow_read_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "allow_all_events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- Seed with initial news posts
INSERT INTO public.news_posts (title, description, category, category_label, date_label, read_time, published) VALUES
  ('NASMED Annual Conference 2024 — Registration Now Open', 'Join leading sports medicine practitioners for two days of cutting-edge research presentations, workshops, and networking at the Abuja International Conference Centre.', 'conference', 'CONFERENCE', 'Jul 2024', '5 min read', true),
  ('New Research Grants Available for Early-Career Professionals', 'NASMED announces ₦5M in research funding for innovative sports medicine studies across Nigerian universities and hospitals.', 'research', 'RESEARCH', 'Jun 2024', '3 min read', true),
  ('Updated Concussion Management Guidelines Released', 'New evidence-based protocols for sideline concussion assessment in Nigerian sports, developed in collaboration with international experts.', 'update', 'UPDATE', 'May 2024', '4 min read', true),
  ('West African Sports Medicine Summit — Call for Papers', 'Submit your research abstracts for the inaugural West African Sports Medicine Summit hosted by NASMED in Lagos.', 'conference', 'CONFERENCE', 'Apr 2024', '3 min read', true),
  ('NASMED–University of Lagos Joint Research Programme', 'A new partnership to advance sports medicine research with focus on tropical climate athletic performance.', 'research', 'RESEARCH', 'Mar 2024', '4 min read', true),
  ('New CPD Requirements for 2024 Membership Renewal', 'Updated continuing professional development requirements for all membership tiers effective January 2025.', 'update', 'UPDATE', 'Feb 2024', '3 min read', true),
  ('NASMED 2024 National Conference – Abuja, September', 'Join over 500 sports medicine professionals for two days of world-class research presentations and workshops.', 'conference', 'ANNUAL CONFERENCE', 'Jun 2024', '4 min read', true),
  ('New National Executive Board Inaugurated', 'NASMED''s newly elected board takes office and outlines goals for 2024–2026.', 'update', 'GOVERNANCE', 'Jun 2024', '3 min read', true),
  ('CAC Certificate of Incorporation Received', 'NASMED receives its Certificate of Incorporation from the Corporate Affairs Commission (CAC), a landmark step in the Association''s journey.', 'update', 'MILESTONES', 'Jul 2024', '2 min read', true)
ON CONFLICT DO NOTHING;

-- Seed with initial events
INSERT INTO public.events (title, description, location, event_date, day_label, month_label, cta_text, cta_style, published) VALUES
  ('NASMED Annual Conference Day 1', 'Research Presentations & Keynote Sessions', 'Abuja, FCT', '2024-09-14', '14', 'SEP', 'Register', 'filled', true),
  ('NASMED Annual Conference Day 2 & Gala', 'Workshops, AGM & Awards Gala Dinner', 'Abuja, FCT', '2024-09-15', '15', 'SEP', 'Register', 'filled', true),
  ('CPD Workshop — Sports Nutrition & Performance', '2-day workshop | 20 CPD Credits', 'Lagos', '2024-08-08', '08', 'AUG', 'Book Now', 'filled', true),
  ('NASMED Webinar — Concussion Management in Nigerian Football', 'Free for members | 3 CPD Credits', 'Online (Zoom)', '2024-11-22', '22', 'NOV', 'Join Free', 'outline', true)
ON CONFLICT DO NOTHING;
