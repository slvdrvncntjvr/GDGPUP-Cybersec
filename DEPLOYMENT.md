# Deployment Guide

This project is a single Node web service:
- The server runs Express APIs.
- The client is built with Vite into `dist/public`.
- `npm start` serves both API and frontend from one process.

## Prerequisites

- Node.js 18+
- A production `SESSION_SECRET`
- Optional PostgreSQL `DATABASE_URL` for persistent data

If `DATABASE_URL` is missing, storage falls back to in-memory mode (data is not persistent).

## Quick Validation Before Deploy

Run from this folder:

```powershell
npm ci
npm run check
npm run build
```

## Free Option 1: Render Only (Easiest)

A Render blueprint file is included at `render.yaml`.

### Steps

1. Push this folder to your GitHub repository.
2. In Render, create a new Blueprint service from the repo.
3. Use the repository root as the service Root Directory.
4. Confirm commands:
   - Build: `npm ci && npm run build`
   - Start: `npm start`
5. Set required environment variables:
   - `NODE_ENV=production`
   - `SESSION_SECRET` (long random string)
   - `DATABASE_URL` (optional but recommended)
6. Deploy and verify `GET /api/health` returns `{ "status": "ok" }`.

This option keeps frontend and backend on one domain, so session auth works without CORS/cookie cross-site complexity.

## Free Option 2: Vercel + Render (Vercel-Style)

Use this if you want the frontend on Vercel and backend on Render.

### Important

This requires cross-origin auth/session setup (CORS + cookie settings). If you do not apply those backend adjustments, login sessions can fail across domains.

### Steps

1. Deploy backend to Render first (same as Option 1).
2. Deploy frontend to Vercel from this repo using:
   - Framework preset: Other
   - Build command: `npm run build`
   - Output directory: `dist/public`
3. Add frontend env var in Vercel:
   - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`
4. Update frontend API calls to use that env var (if not already wired).
5. Update backend for cross-origin sessions:
   - allow CORS from your Vercel domain with credentials
   - set cookie `sameSite: "none"` and `secure: true` in production
6. Redeploy both and test login/logout/dashboard flow.

## Common Production Gotchas

- App will fail fast in production if `SESSION_SECRET` is missing or default.
- Cookies are marked `secure` in production, so auth sessions require HTTPS in real deployments.
- If frontend and backend are on different domains, default cookie settings are not enough for session auth.
- `npm start` expects `dist/index.cjs`, so `npm run build` must run first.
- `drizzle.config.ts` requires `DATABASE_URL` only when running `npm run db:push`.

## Recommended Post-Deploy Checks

- `GET /api/health` responds 200
- Register and login flows work
- Submission endpoint writes and reads dashboard data
- Data survives restarts (if `DATABASE_URL` is set)
