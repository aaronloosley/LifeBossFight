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
### Quick start (demo mode)
1. Install dependencies from the project root:
   ```bash
   npm install
   ```
2. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
3. Leave the Firebase values blank in `.env.local` if you just want to try the app locally in demo mode. The app will still boot and use local demo storage.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

### Local setup with Firebase (optional)
If you want Google sign-in and Firebase-backed services, create a Firebase web app and copy its config into `.env.local`.

1. Open the [Firebase console](https://console.firebase.google.com/).
2. Create or select a project.
3. In **Project settings > Your apps**, register a **Web app** if you do not already have one.
4. Copy the web app config values into these variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```
5. Optional: keep `NEXT_PUBLIC_ENABLE_DEMO=true` in `.env.local` to match `.env.example`.
6. Restart `npm run dev` after updating env vars.

If the `NEXT_PUBLIC_FIREBASE_*` values are missing, the app falls back to demo mode instead of crashing.

Evidence attachments are stored on the user’s device by default for the MVP to keep remote storage costs low. Firebase Storage remains available as the future upload/sync path when you want multi-device access or cloud backups.

## Deployment (Vercel)
Life Boss Fight deploys to Vercel as a standard Next.js app. You do not need a custom `vercel.json`.

### Vercel project settings
- **Framework preset:** Next.js
- **Root directory:** `.` (the repository root)
- **Install command:** `npm install` (Vercel's default for this repo is fine)
- **Build command:** `npm run build` (Vercel's default Next.js build also works)
- **Output directory:** leave blank so Vercel uses the default `.next` output

### Environment variables to add in Vercel
In **Project Settings > Environment Variables**, add these if you want Firebase configured in that Vercel environment:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Optional:

```bash
NEXT_PUBLIC_ENABLE_DEMO=true
```

You can get the Firebase values from **Firebase console > Project settings > Your apps > Web app config**. If you are deploying a demo-only environment, you can leave the Firebase values unset and the app will fall back to demo mode.

### Deploy steps
1. Import the repository into Vercel.
2. Confirm the project root is the repository root.
3. Add the Firebase environment variables above for the environments you use (typically Production, Preview, and optionally Development).
4. Deploy.

If you deploy without the Firebase variables, the app should still build and run in demo mode, but Firebase-powered features such as Google sign-in will not be configured.

## Firestore collections (recommended)
See `docs/firestore-schema.md` for scalable data model guidance matching users, mission templates, mission runs, evidence, timeline events, reminders, contacts, and reports.

## Documentation
- Firebase authentication integration guide: `docs/firebase-authentication-setup.md`
- Production readiness backlog: `docs/tasks/README.md`
- Mission roadmap shortlist: `docs/mission-roadmap.md`

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
