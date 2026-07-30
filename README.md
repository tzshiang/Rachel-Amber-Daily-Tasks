# 安安樂樂每日任務打卡 (Rachel & Amber Daily Task Check-in)

A daily task check-in app for twin sisters 安安 (Rachel, pink theme) and 樂樂 (Amber, purple theme).

## Features

- **每日任務 Daily tasks**: Piano Practice, Read a Book, Write a Diary, Finish Homework, Something to Share, Take a Bath.
- **Each kid gets her own themed view** — pink for Rachel, purple for Amber — picked from the home screen.
- **Today / Week / Month tabs** with a celebration animation when all of today's tasks are done.
- **Heart rewards (💖)** — a 0–5 heart rating computed from the weekly and monthly completion rate.
- **Parent dashboard** (`/parent`, PIN-protected, default `0000`, changeable in the dashboard) showing both kids' daily progress plus weekly/monthly stats side by side.
- **99 multiplication table practice** (`/kid/:kidId/math`) — drill one number's table (2-9) or take a 20-question random quiz, multiple choice.

Data is stored in a Supabase (Postgres) database, so progress shows up the same way on any device.

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql) once to create the tables.
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. Copy `.env.example` to `.env.local` and fill in those two values:
   ```bash
   cp .env.example .env.local
   ```
5. When deploying (e.g. on Vercel), add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the project settings.

This app has no login system — the Supabase `anon` key is used directly from the browser with permissive row-level-security policies (see `supabase/schema.sql`). That's an acceptable tradeoff for a private family checklist, but don't reuse this schema for anything sensitive.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

## Docs

- [`docs/dev-guide.md`](./docs/dev-guide.md) — narrative case study of how this project was actually built, bugs and all.
- [`docs/dev-sop.md`](./docs/dev-sop.md) — the reusable Claude Code + GitHub + Vercel + Supabase playbook distilled from that experience, for the next app.
- [`docs/app-brief-template.md`](./docs/app-brief-template.md) — a fill-in-the-blank template for briefing Claude Code on a new app, with real examples from this project.
