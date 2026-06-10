-- NASMED CME Series & OGM 2026 — Event Setup
-- Run this in the Supabase SQL editor (PostgreSQL)

-- Ensure registration_fee, body_content, and flier_url columns exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_fee INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS body_content TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS flier_url TEXT;

-- Remove any previous version of this event (safe to re-run)
DELETE FROM public.events WHERE title = 'NASMED CME Series & Ordinary General Meeting (OGM)'
   OR title = 'NASMED CME Series & OGM — Webinar Q2 2026';

-- Insert the event
INSERT INTO public.events (
  title, description, location, event_date,
  day_label, month_label, cta_text, cta_style,
  registration_fee, body_content, flier_url, published
) VALUES (
  'NASMED CME Series & OGM — Webinar Q2 2026',
  'The Continuing Medical Education (CME) Series & Ordinary General Meeting (OGM) in commemoration of the 2nd Anniversary of the current EXCO. Featuring presentations on Paralympic Athletes'' Classification Journey and Advancing Athlete Health through Sports Medicine Innovation.',
  'Virtual (Zoom)',
  '2026-06-19',
  '19',
  'JUN',
  'Register Now',
  'filled',
  10000,
  'Nigeria Association of Sports Medicine (NASMED)

Present

Continuing Medical Education (CME) Series & Ordinary General Meeting (OGM)
(Webinar, Second Quarter 2026)

Theme: Strengthening Sports Medicine Practice for Better Athlete Health & Performance

Date: Friday, 19th June 2026
Venue: Virtual (Zoom)
Moderator: Dr. Olajide Adebola


WELCOME ADDRESS

The Nigeria Association of Sports Medicine (NASMED) welcomes members, professionals, researchers, practitioners, stakeholders, and invited guests to the Continuing Medical Education (CME) Series and Ordinary General Meeting (OGM).

This event marks the second anniversary of the current Executive Committee (EXCO). It provides an opportunity to share knowledge, discuss emerging issues in sports medicine, and review the Association''s activities from 2024 to 2026.


PROGRAMME OF EVENTS

TIME                      ACTIVITY
12:30 PM                  Registration & Participants Log-in
12:45 PM                  Housekeeping rules
1:00 PM                   Welcome Remarks by the Moderator
1:05 PM                   Introduction of NASMED CME Series & OGM
1:10 PM – 1:35 PM         Dr. Bakare Ummukulthoum (2nd Vice President)
                          Topic: Paralympic Athletes'' Classification Journey
1:35 PM – 2:00 PM         Dr. Obinnaya Francis Udigwu (Secretary General)
                          Topic: From Preparation to Podium: Advancing Athlete Health, Performance and Well-being through Sports Medicine Innovation, Research and Collaboration
2:00 PM – 2:30 PM         Interactive Questions & Answers Session
2:30 PM – 3:30 PM         Ordinary General Meeting (OGM)
2:35 PM                   Presentation of NASMED Activity Report (2024–2026)
3:00 PM                   Strategic Discussions and Members'' Contributions
3:20 PM                   Closing Remarks
3:30 PM                   Adjournment


OBJECTIVES

- To strengthen collaboration among members and stakeholders.
- To discuss emerging trends in sports medicine and athlete care.
- To promote research, education, and policy development.
- To provide networking and professional engagement opportunities.
- To present the NASMED Activity Report covering 2024–2026.


PARTICIPATION INFORMATION

- Members who have paid their annual dues will attend FREE of charge.
- Members yet to pay their dues and non-members will be required to pay a participation fee of ₦10,000 for the webinar only.


EXPECTED PARTICIPANTS

- NASMED Members
- Sports Medicine Practitioners
- Physiotherapists
- Medical Doctors
- Researchers and Academics
- Sports Scientists
- Allied Health Professionals
- Students
- Stakeholders in Sports and Exercise Medicine


We look forward to your participation.

NASMED Secretariat',
  '/webinar%202026.jpeg',
  true
);

-- ── News post announcement (shows in the News grid with flier) ──
-- Remove any previous version of this post (safe to re-run)
DELETE FROM public.news_posts WHERE title = 'NASMED CME Series & Ordinary General Meeting (OGM)'
   OR title = 'NASMED CME Series & OGM — Webinar Q2 2026';

INSERT INTO public.news_posts (
  title, description, category, category_label,
  date_label, read_time, image_url, published
) VALUES (
  'NASMED CME Series & OGM — Webinar Q2 2026',
  'Nigeria Association of Sports Medicine (NASMED) presents the Continuing Medical Education (CME) Series & Ordinary General Meeting (OGM) for the Second Quarter of 2026. The webinar features presentations on Paralympic Athletes'' Classification Journey and Advancing Athlete Health through Sports Medicine Innovation. Date: Friday, 19th June 2026 | Venue: Virtual (Zoom). FREE for paid-up members · ₦10,000 for others.',
  'conference',
  'CONFERENCE',
  'Jun 2026',
  '2 min read',
  '/webinar%202026.jpeg',
  true
);
