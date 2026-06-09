-- NASMED CME Series & OGM 2026 — Event Setup
-- Run this in the Supabase SQL editor (PostgreSQL)

-- Ensure registration_fee and body_content columns exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_fee INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS body_content TEXT;

-- Remove any previous version of this event (safe to re-run)
DELETE FROM public.events WHERE title = 'NASMED CME Series & Ordinary General Meeting (OGM)';

-- Insert the event
INSERT INTO public.events (
  title, description, location, event_date,
  day_label, month_label, cta_text, cta_style,
  registration_fee, body_content, published
) VALUES (
  'NASMED CME Series & Ordinary General Meeting (OGM)',
  'In commemoration of the 2nd Anniversary of the current EXCO — featuring CME presentations on Paralympic Classification and Athlete Health Innovation. Theme: Strengthening Sports Medicine Practice for Better Athlete Health & Performance.',
  'Zoom, Virtual / Online Platform',
  '2026-06-19',
  '19',
  'JUN',
  'Register Now',
  'filled',
  10000,
  'NASMED Continuing Medical Education (CME) Series & Ordinary General Meeting (OGM)
Theme: Strengthening Sports Medicine Practice for Better Athlete Health & Performance
Nigeria Association of Sports Medicine (NASMED)
Date: Friday, 19th June 2026
Venue: Zoom, Virtual / Online Platform

INTRODUCTION
The Nigeria Association of Sports Medicine (NASMED) is pleased to announce its CME Series and OGM in commemoration of the 2nd Year Anniversary of the current Executive Committee (EXCO). This event will bring together professionals, researchers, practitioners, stakeholders, and members to discuss current developments, athlete healthcare, research advancements, policy development, and future opportunities within sports medicine and exercise science in Nigeria. The OGM will also feature the presentation of the NASMED Activity Report covering the period from 2024 to 2026.

OBJECTIVES
- To celebrate the successful 2 years anniversary of the current EXCO.
- To strengthen collaboration among members and stakeholders.
- To discuss emerging trends in sports medicine and athlete care.
- To promote research, education, and policy development.
- To provide networking and professional engagement opportunities.
- To present the NASMED Activity Report (2024 to 2026).

CME PRESENTATIONS
First Presenter (Vice President): Paralympic Athletes Classification Journey
Second Presenter (Secretary General): From Preparation to Podium: Advancing Athlete Health, Performance and Well-being through Sports Medicine Innovation, Research and Collaboration

PROGRAMME SCHEDULE
12:30 PM             Registration
1:00 PM              1st Presentation
1:00 PM - 2:00 PM    CME Series Session
2:00 PM - 2:30 PM    Questions and Answers
2:30 PM - 3:30 PM    OGM and Presentation of Activity Report (2024-2026)

PARTICIPATION
- Members who have paid their dues will attend FREE.
- Members yet to pay their dues will pay NGN 10,000.

EXPECTED PARTICIPANTS
NASMED Members, Sports Medicine Practitioners, Physiotherapists, Medical Doctors, Researchers and Academics, Sports Scientists, Allied Health Professionals, Students and Stakeholders.

Signed: Secretary General, Nigeria Association of Sports Medicine (NASMED)',
  true
);
