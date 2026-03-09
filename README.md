# Life Boss Fight (MVP v1)

Life Boss Fight turns stressful incidents into guided, calm mission flows. This MVP ships a reusable mission engine and the first full mission: **Burst Pipe**.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS with shadcn-style UI primitives
- Framer Motion for subtle motion
- Firebase (Auth/Firestore/Storage) integration points
- Local-first device evidence storage for photos/files, with Firebase upload left optional
- Zod + React Hook Form for forms
- Vitest + Testing Library + Playwright for tests

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Firebase setup
Populate `.env.local` with Firebase web app credentials. If env vars are missing, app falls back to demo mode.

Evidence attachments are stored on the user’s device by default for the MVP to keep remote storage costs low. Firebase Storage remains available as the future upload/sync path when you want multi-device access or cloud backups.

## Deployment (Vercel)
- Import repository in Vercel.
- Add the `NEXT_PUBLIC_FIREBASE_*` env vars.
- Deploy with default Next.js build command.

## Firestore collections (recommended)
See `docs/firestore-schema.md` for scalable data model guidance matching users, mission templates, mission runs, evidence, timeline events, reminders, contacts, and reports.

## Architecture highlights
- Mission templates are data-driven (`src/data/missions/templates.ts`).
- Mission run logic is reusable (`src/lib/mission-engine/index.ts`).
- Burst Pipe is seeded as one mission; additional bosses can be added by defining templates and steps.

## Add a future Boss Fight
1. Add new `MissionTemplate` object in `src/data/missions/templates.ts`.
2. Include phases + step definitions + report config.
3. Keep status as `coming-soon` until content is complete.
4. No new screen logic required; runner/evidence/timeline/summary pages are reusable.

## Testing
```bash
npm run test
npm run test:e2e
```
