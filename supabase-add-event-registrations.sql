-- Migration: Create event_registrations table
-- Run this in your Supabase SQL Editor (after supabase-add-event-registration.sql)

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  event_id       UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_title    TEXT NOT NULL,
  full_name      TEXT NOT NULL,
  email          TEXT NOT NULL,
  organisation   TEXT,
  dues_status    TEXT NOT NULL DEFAULT 'non-member', -- 'member' | 'non-member'
  registration_fee bigint NOT NULL DEFAULT 0,        -- fee in Naira (0 = free)
  payment_status TEXT NOT NULL DEFAULT 'pending',    -- 'free' | 'pending' | 'paid'
  payment_ref    TEXT,
  payment_method TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',    -- 'pending' | 'confirmed' | 'cancelled'
  notes          TEXT
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id  ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email     ON public.event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status    ON public.event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created   ON public.event_registrations(created_at DESC);

-- RLS: allow all (consistent with other tables in this project)
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all_event_registrations ON public.event_registrations FOR ALL USING (true) WITH CHECK (true);
