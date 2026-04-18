# Dashboard Swayog App (React + API + Prisma)

This folder now contains a frontend app and a backend service with JWT auth and PostgreSQL models.

## Structure

- `src/` React + TypeScript frontend
- `server/` Express + TypeScript backend
- `server/prisma/schema.prisma` Database schema

## Frontend Setup

1. Install frontend packages:
   - `npm install`
2. Copy env values:
   - `copy .env.example .env`
3. Start frontend:
   - `npm run dev`

## Backend Setup

1. Go to backend:
   - `cd server`
2. Install backend packages:
   - `npm install`
3. Copy env values:
   - `copy .env.example .env`
4. Generate Prisma client:
   - `npm run prisma:generate`
5. Create tables via migration:
   - `npm run prisma:migrate -- --name init`
6. Start backend:
   - `npm run dev`

Backend runs at `http://localhost:4000` by default.

## Auth Endpoints

- `POST /api/auth/register` customer self-signup only
- `POST /api/auth/login` login for any active user
- `GET /api/auth/me` token validation and user profile

## Customer Endpoints (admin/super-admin)

- `GET /api/customers?page=1&limit=10&sort=createdAt&order=desc&search=&zone=`
- `POST /api/customers`

## Frontend Routes

- `/login`
- `/register`
- `/` protected dashboard

## Notes

- Role policy follows PRD direction: self-signup creates only `CUSTOMER` role.
- Admin and other roles should be created by privileged backend workflows.
# Swayog-360
