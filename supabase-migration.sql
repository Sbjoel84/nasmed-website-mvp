-- NASMED Additional Schema Migration
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql

-- 1. Add payment columns to applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_ref TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- 2. Add access, price, file_name to publications
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS access TEXT DEFAULT 'free';
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS price TEXT DEFAULT '';
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT '';

-- 3. Add profession and state to profiles (already has username, must_change_password, member_number)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;

-- 4. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  payment_ref TEXT NOT NULL,
  member_name TEXT,
  email TEXT,
  membership_type TEXT,
  amount TEXT,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT DEFAULT 'membership',
  description TEXT,
  receipt_url TEXT,
  receipt_name TEXT,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_transactions" ON public.transactions;
CREATE POLICY "allow_all_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transactions_ref ON public.transactions(payment_ref);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON public.transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- 5. Enable Supabase Realtime for all watched tables
-- Adds tables to the supabase_realtime publication so postgres_changes subscriptions fire.
-- Run once; safe to re-run (ADD TABLE on an already-added table is a no-op error, wrap in DO block).
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.publications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
