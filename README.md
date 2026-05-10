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
- 8 PDF-aligned rooms (RED-1..4, BLUE-1..4) with per-challenge XP.
- `NEXUS{...}` flag system bound to each user's `TEAM_ID`.
- Community Hub and routed multi-page UI.
- Serverless-ready API for Vercel deployment.

## Room Model (PDF-aligned)

| Code   | Session | Title                              | Team   |
| ------ | ------- | ---------------------------------- | ------ |
| RED-1  | 5       | Web Exploitation (Juice Shop)      | Red    |
| RED-2  | 9       | Advanced Application Exploits      | Red    |
| RED-3  | 11      | Cloud Attacks                      | Red    |
| RED-4  | 9       | Post-Exploitation Foundations      | Red    |
| BLUE-1 | 6       | Host & Network Hardening           | Blue   |
| BLUE-2 | 8       | Monitoring & Packet Analysis      | Blue   |
| BLUE-3 | 10      | IDS/IPS & SIEM Fundamentals        | Blue   |
| BLUE-4 | 12      | Incident Response & Cloud Defense  | Blue   |

The full catalog (challenges, points, flag templates) lives in
[`shared/challengeCatalog.ts`](shared/challengeCatalog.ts).

### Flag Format

Every challenge has a flag of the form:

```text
NEXUS{<CHALLENGE_TOKEN>_<TEAM_ID>}
```

Examples for a user whose `TEAM_ID` is `TEAM05`:

- `NEXUS{SQLI_ADMIN_TEAM05}` — RED-1, Challenge 1
- `NEXUS{HOST_FIREWALL_TEAM05}` — BLUE-1, Challenge 1

Validation is constant-time (`timingSafeEqual`); raw flag values are never
persisted (only their SHA-256).

### TEAM_ID Workflow

- A unique `TEAM_ID` (e.g. `TEAM01`, `TEAM02`, …) is assigned automatically on
  registration, backed by a Postgres sequence.
- The ID is shown on the dashboard profile card and is the value substituted
  into every flag template — there is no manual entry step.
- Old deployments using `ADMIN_BOOTSTRAP_TEAM_ID` can drop that variable; it is
  no longer consulted.

### XP Awards

XP is awarded per-challenge (15–60 each) and only on the **first** successful
solve of that `(user, room, challenge)` triple, enforced atomically by a unique
`user_solves` table. Repeated submissions log the attempt without doubling XP.

### Support Bot (optional Gemini)

The floating help bot has two modes, picked automatically:

- **Static FAQ** (default) — answers from `shared/supportFaq.ts`. Covers
  TEAM_ID, NEXUS flag format, room codes, XP, login.
- **Gemini** (when `GEMINI_API_KEY` is set) — proxies to
  `gemini-2.5-flash` via `POST /api/support/chat` with a tight system prompt
  that scopes answers to the platform and refuses to leak literal flags or
  off-topic content. The endpoint is rate-limited (12 req/min/IP), times out
  after 12s, and falls back to the FAQ on any failure. Override the model via
  `GEMINI_MODEL`. Each assistant bubble shows a small badge so you always know
  whether you got Gemini or the FAQ.

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
- `npm run test` run the Vitest suite (catalog + API tests)
- `npm run build` build client and server bundle
- `npm run build:vercel` build serverless artifact + frontend output
- `npm run db:push` push Drizzle schema to Postgres
- `npm start` run production build

CI runs `npm run check`, `npm run test`, and the production builds on every
PR (see `.github/workflows/ci.yml`).

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
