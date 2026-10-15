# MistiGolpo (মিষ্টি গল্প) — Production Deployment & Architecture Plan

## 1. Overview
MistiGolpo is a modern, Bengali-first e-commerce platform for cake ordering and customization.

## 2. Tech Stack
- **Backend:** Python, FastAPI, PostgreSQL, SQLAlchemy ORM, Pydantic, JWT Auth
- **Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS, Axios
- **Deployment Target:** Monorepo support for Vercel / Docker Compose / AWS / DigitalOcean

## 3. Deployment Steps on Vercel
1. Set up standard environment variables in Vercel project settings:
   - `DATABASE_URL` (PostgreSQL / Neon / Supabase connection string)
   - `JWT_SECRET_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
2. Root `vercel.json` automatically detects `@vercel/python` for `api/index.py` and `@vercel/static-build` for `frontend`.
3. Run database seed: `python -m backend.app.seed`
