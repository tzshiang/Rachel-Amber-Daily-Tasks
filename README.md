# 安安樂樂每日任務打卡 (Rachel & Amber Daily Task Check-in)

A daily task check-in app for twin sisters 安安 (Rachel, pink theme) and 樂樂 (Amber, purple theme).

## Features

- **每日任務 Daily tasks**: Piano Practice, Read a Book, Write a Diary, Finish Homework, Something to Share, Take a Bath.
- **Each kid gets her own themed view** — pink for Rachel, purple for Amber — picked from the home screen.
- **Today / Week / Month tabs** with a celebration animation when all of today's tasks are done.
- **Heart rewards (💖)** — a 0–5 heart rating computed from the weekly and monthly completion rate.
- **Parent dashboard** (`/parent`, PIN-protected, default `0000`, changeable in the dashboard) showing both kids' daily progress plus weekly/monthly stats side by side.

Data is stored locally in the browser (`localStorage`), per device.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```
