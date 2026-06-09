-- Event Registrations Table Setup
-- Run this in the Supabase SQL editor if event registrations are not saving

-- 1. Create the table (safe to run even if it already exists)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  event_id         UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_title      TEXT NOT NULL,
  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  organisation     TEXT,
  dues_status      TEXT NOT NULL DEFAULT 'non-member',
  registration_fee BIGINT NOT NULL DEFAULT 0,
  payment_status   TEXT NOT NULL DEFAULT 'pending',
  payment_ref      TEXT,
  payment_method   TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  notes            TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Drop any conflicting policies and recreate
DROP POLICY IF EXISTS allow_all_event_registrations  ON public.event_registrations;
DROP POLICY IF EXISTS allow_read_event_registrations ON public.event_registrations;
DROP POLICY IF EXISTS allow_insert_event_registrations ON public.event_registrations;

-- Allow anyone to insert (members registering from the website)
CREATE POLICY allow_insert_event_registrations
  ON public.event_registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read (admin portal uses the anon key)
CREATE POLICY allow_read_event_registrations
  ON public.event_registrations
  FOR SELECT
  USING (true);

-- Allow anyone to update (admin confirming / cancelling registrations)
CREATE POLICY allow_update_event_registrations
  ON public.event_registrations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. Indexes for fast admin queries
CREATE INDEX IF NOT EXISTS idx_ev_reg_event_id  ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_ev_reg_email     ON public.event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_ev_reg_status    ON public.event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_ev_reg_created   ON public.event_registrations(created_at DESC);

-- 5. Verify — should return 0 rows (empty table) or existing registrations
SELECT id, full_name, email, event_title, status, created_at
FROM public.event_registrations
ORDER BY created_at DESC
LIMIT 10;
