# Dashboard Swayog App

Unified React + Vite frontend and Express + Prisma API for Vercel deployment.

## Structure

- `src/` frontend application
- `api/` Vercel function entrypoints for `/api` and `/api/*`
- `server/src/` shared Express app, routes, and backend utilities
- `server/prisma/schema.prisma` database schema

## Local Setup

1. Install dependencies:
   - `npm install`
2. Copy env values:
   - `copy .env.example .env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Start the frontend:
   - `npm run dev`
5. Start the API in a second terminal:
   - `npm run api:dev`

The frontend runs on `http://localhost:5173` and the local API runs on `http://localhost:4000`.

## Deployment-Faithful Local Dev

- Use `vercel dev` to test the Vite SPA, API functions, and rewrite behavior the same way Vercel will serve them.
- Keep `VITE_API_BASE_URL` empty for same-origin Vercel-style behavior.
- Set `VITE_API_BASE_URL=http://localhost:4000` only when running the frontend and API as separate local processes.

## Database and Prisma

- `DATABASE_URL` should use the pooled runtime connection string.
- `DIRECT_URL` should use the direct connection string for migrations.
- Root Prisma commands:
  - `npm run prisma:generate`
  - `npm run prisma:migrate`
  - `npm run prisma:seed`

## Auth and Customer APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/account/profile`
- `PATCH /api/account/profile`
- `GET /api/customer/invoices`
- `POST /api/customer/invoices/:invoiceId/checkout-session`
- `POST /api/customer/payment-methods/setup-intent`
- `POST /api/customer/payment-methods/sync`

## Notes

- Account settings and customer billing address stay synchronized through the shared account profile model.
- Stripe Checkout handles invoice payment, and Stripe Setup Intents handle saved cards.
- Deep links are handled by `vercel.json`, while `/api/*` stays on the exported Express app.
