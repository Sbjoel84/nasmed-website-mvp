-- Migration: Add registration_fee and body_content to events table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registration_fee bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS body_content text;

COMMENT ON COLUMN public.events.registration_fee IS 'Registration fee in Naira (NGN). 0 = free for all. Members with paid dues always attend free.';
COMMENT ON COLUMN public.events.body_content IS 'Full event description / announcement body (Markdown or plain text).';

-- Insert the CME/OGM event
INSERT INTO public.events (
  title,
  description,
  location,
  event_date,
  day_label,
  month_label,
  cta_text,
  cta_style,
  registration_fee,
  body_content,
  published
) VALUES (
  'NASMED CME Series & Ordinary General Meeting (OGM)',
  '2nd Year EXCO Anniversary | CME Presentations on Paralympic Classification & Sports Medicine Innovation | Virtual/Online',
  'Virtual / Online Platform',
  '2026-06-19',
  '19',
  'JUN',
  'Register Now',
  'filled',
  10000,
  '# NASMED Continuing Medical Education (CME) Series & Ordinary General Meeting (OGM)

## Nigeria Association of Sports Medicine (NASMED)

### Theme:
**Strengthening Sports Medicine Practice for Better Athlete Health & Performance**

---

## Event Details
**Date:** Friday, 19th June 2026
**Venue:** Virtual / Online Platform

---

## Introduction

The Nigeria Association of Sports Medicine (NASMED) is pleased to announce its Continuing Medical Education (CME) Series and Ordinary General Meeting (OGM) in commemoration of the 2nd Year Anniversary of the current Executive Committee (EXCO).

This event will bring together professionals, researchers, practitioners, stakeholders, and members to discuss current developments, athlete healthcare, research advancements, policy development, and future opportunities within sports medicine and exercise science in Nigeria.

The OGM will also feature the presentation of the NASMED Activity Report covering the period from **2024 – 2026**.

---

## Objectives of the Webinar

- To celebrate the successful 2 years anniversary of the current EXCO.
- To strengthen collaboration among members and stakeholders.
- To discuss emerging trends in sports medicine and athlete care.
- To promote research, education, and policy development.
- To provide networking and professional engagement opportunities.
- To present the NASMED Activity Report (2024 – 2026).

---

## CME Presentations

### First Presenter — Vice President
**Topic:** *Paralympic Athletes'' Classification Journey*

### Second Presenter — Secretary General
**Topic:** *From Preparation to Podium: Advancing Athlete Health, Performance and Well-being through Sports Medicine Innovation, Research and Collaboration*

---

## Programme Schedule

| Time | Activity |
|------|----------|
| 12:30 PM | Registration |
| 1:00 PM | 1st Presentation |
| 1:00 PM – 2:00 PM | Continuing Medical Education (CME) Series Session |
| 2:00 PM – 2:30 PM | Questions & Answers Session |
| 2:30 PM – 3:30 PM | Ordinary General Meeting (OGM) & Presentation of Activity Report (2024 – 2026) |

---

## Participation Information

- Members who have paid their dues will attend **FREE**.
- Members yet to pay their dues will pay a registration fee of **₦10,000**.

---

## Expected Participants

NASMED Members · Sports Medicine Practitioners · Physiotherapists · Medical Doctors · Researchers & Academics · Sports Scientists · Allied Health Professionals · Students & Stakeholders

---

*Signed: Secretary General, Nigeria Association of Sports Medicine (NASMED)*',
  true
);
