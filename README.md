# GDG Cybersecurity Hands-on Learning Resource

Community-led cybersecurity learning platform with hands-on rooms, flag submissions, team progress tracking, and a modern React + Express stack.

## Current Status

- Repository structure is flattened: the app now lives at repository root.
- Vercel serverless entrypoint is in `api/[...slug].ts`.
- Authentication is session-based (cookie + passport).
- Production startup is resilient: if database initialization fails, app falls back to in-memory mode to stay available.

## Core Features

- User registration and login with team assignment (Blue/Red).
- Session-based auth with remember-me support.
- Dashboard showing profile, XP, and submissions.
- Challenge/room flows with flag submission endpoint.
- Community Hub and routed multi-page UI.
- Serverless-ready API for Vercel deployment.

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind, Radix UI, TanStack Query.
- Backend: Express, TypeScript, Passport, express-session.
- Data: Drizzle ORM + Neon/Postgres (with in-memory fallback mode).
- Build/runtime tools: tsx, esbuild, cross-env.

## Repository Structure

```text
.
|- api/                    Vercel function entry
|- client/                 React frontend
|- server/                 Express app/runtime
|- shared/                 Shared schema/types
|- script/                 Build helpers
|- package.json            Root scripts and dependencies
|- vercel.json             Vercel routing config
|- render.yaml             Render blueprint
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and set at least:

- `SESSION_SECRET` for production session security
- `DATABASE_URL` for persistent users/sessions/submissions
- `PORT` is optional (defaults to 5000)

Without `DATABASE_URL`, the app runs in in-memory mode (non-persistent).

### Run Locally

```bash
npm run dev
```

Open `http://localhost:5000`.

## Scripts

- `npm run dev` start development server
- `npm run check` run TypeScript checks
- `npm run build` build client and server bundle
- `npm run build:vercel` build serverless artifact + frontend output
- `npm run db:push` push Drizzle schema to Postgres
- `npm start` run production build

## Deployment Notes

### Vercel

- Root Directory: repository root
- Build Command: `npm run build:vercel`
- Output Directory: `dist/public`
- Required env vars: `SESSION_SECRET`, `DATABASE_URL` (recommended)

### Render

- Build: `npm ci && npm run build`
- Start: `npm start`

## Collaboration Notes (For Co-Developers)

### Daily Workflow

1. Pull latest `main` before starting work.
2. Create a feature branch from latest `main`.
3. Run `npm run check` before commit.
4. Run `npm run build:vercel` before opening PR.
5. Keep PRs focused; avoid unrelated formatting churn.

### Branch and Commit Guidance

- Suggested branch names:
    - `feature/<short-topic>`
    - `fix/<short-topic>`
    - `chore/<short-topic>`
- Prefer conventional commit style where possible:
    - `feat: ...`
    - `fix: ...`
    - `chore: ...`

### Auth and API Expectations

- `GET /api/me` returns `401` when logged out (expected).
- `POST /api/login` returns `401` for invalid credentials (expected).
- A browser warning about "Browsing Topics API removed" is not related to backend auth.

### Important Security Rules

- Never commit `.env` or secrets.
- If a secret is exposed accidentally, rotate it immediately.
- Avoid logging sensitive auth/flag payloads.

## Troubleshooting

### App starts but data resets

Likely in-memory mode. Confirm `DATABASE_URL` is present and valid.

### Vercel API startup fails

Check function logs first. Confirm:

- Root Directory is repo root
- `build:vercel` ran successfully
- `SESSION_SECRET` and `DATABASE_URL` are configured

### Login works but dashboard says logged out

Hard refresh once and retest. If persistent, capture logs for:

- `POST /api/login`
- first `GET /api/me`
- first `GET /api/dashboard`

## Maintainer Note

This codebase recently went through deployment and auth hardening. If behavior looks inconsistent between local and production, use deployment logs first, then compare with expected endpoint behavior above.
