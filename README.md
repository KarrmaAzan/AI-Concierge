# AMHRL

AMHRL is a cinematic, AI-guided landing experience designed to convert visitors into qualified clients.

Instead of static content, the interface speaks, guides, and adapts in real time — creating a structured journey from awareness to action.

---

## ✦ Core Concept

This is not a traditional landing page.

AMHRL is a **guided system**:
- The experience begins with an activation interaction
- AI narration introduces the product and directs user flow
- Each section is triggered intentionally through scroll
- User intent is captured and carried into conversion
- The journey ends in a high-quality call or portfolio exploration

---

## ✦ Features

### 🎧 AI Voice Narration
- OpenAI Text-to-Speech integration
- Dynamic narration per section
- Intro greeting sequence before content begins
- No overlapping audio system

### 🧠 Guided User Flow
- Activation entry (Yin-Yang trigger)
- Auto-scroll progression after selection
- Section-based narration tied to viewport
- Intent-based experience (service selection)

### 📊 Conversion System
- Invisible lead capture (no friction UX)
- Supabase event tracking
- Service selection passed into CTA + booking flow
- Calendly integration with prefilled data

### 🎬 Cinematic UI
- Dark ambient gradient environment
- Typewriter-style subtitles synced to narration
- Smooth transitions using Framer Motion
- Structured, intentional layout (no template patterns)

---

## ✦ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Material UI (MUI)**
- **Framer Motion**
- **Redux Toolkit**
- **React Context (Audio System)**
- **Supabase (Database + Analytics)**
- **OpenAI API (TTS)**
- **Calendly Integration**

---

## ✦ Architecture Overview

app/
api/
tts/ → OpenAI speech generation
events/ → analytics tracking
leads/ → lead capture
layout.tsx → root layout
page.tsx → main experience

components/
sections/ → Hero, Services, Deliverables, etc.
IntroGreeting → activation intro sequence
SubtitleDisplay → typewriter subtitles
CTA → conversion endpoint

context/
AudioProvider → global narration system

store/
slices/ → UI + selection state
store.ts → Redux config

lib/
analytics.ts → Supabase event helpers


---

## ✦ Environment Variables

Create a `.env.local` file:


OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CALENDLY_URL=


---

## ✦ Running Locally

```bash
npm install
npm run dev

Then open:

http://localhost:3000
✦ Build
npm run build
npm start
✦ Deployment

Recommended: Vercel

Push repo to GitHub
Import into Vercel
Add environment variables
Deploy
✦ Purpose

AMHRL is built as a client acquisition system, not just a website.

It is designed to:

Increase engagement
Guide user intent
Qualify leads automatically
Create a premium first impression
✦ Future Improvements
Audio caching to reduce API usage
Multi-voice narration modes
Personalization based on user behavior
Advanced analytics dashboard
Expanded portfolio integration
✦ License

Private / Client Use


---

## Then run:

```bash
git add .
git commit -m "Added README"
git push