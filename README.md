# 🍰 মিষ্টি গল্প — MistiGolpo
> **প্রতিটি কেকে একটি মিষ্টি গল্প।** *(A sweet story in every cake.)*

MistiGolpo is a modern, Bengali-first e-commerce platform for handcrafted celebration cakes, created by founder Sham.

---

## 🚀 Vercel Deployment Instructions

This repository is optimized for one-click Vercel deployment combining the React (Vite) frontend and FastAPI (Python) backend serverless function (`api/index.py`).

### 1. Connect Repository to Vercel
1. Push this project repository to GitHub / GitLab / Bitbucket.
2. Log in to your [Vercel Dashboard](https://vercel.com) and click **"Add New" -> "Project"**.
3. Import the repository.

### 2. Configure Environment Variables
In the Vercel project settings, add the following environment variables:

| Variable | Recommended Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/dbname?sslmode=require` | Managed PostgreSQL DB (Neon / Supabase / Railway) |
| `JWT_SECRET_KEY` | `your-secret-key-32-chars-minimum` | Secret key for signing user JWT tokens |
| `ADMIN_EMAIL` | `admin@mistigolpo.com` | Initial admin account email |
| `ADMIN_PASSWORD` | `Admin@123456` | Initial admin account password |

### 3. Deploy
- Vercel automatically detects `vercel.json` and builds both:
  - **Frontend:** Built with Vite into `frontend/dist`.
  - **Backend API:** FastAPI application hosted as Python serverless functions handling `/api/*` requests via `@vercel/python`.

---

## 🛠️ Tech Stack & Features

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** FastAPI, Python, SQLAlchemy, Pydantic v2, Pytest, JWT Auth.
- **Database:** PostgreSQL / SQLite fallback.
- **Localization:** Primary Bengali (`bn`) with English (`en`) language switcher & BDT (`৳`) currency formatting.
- **Features:** Catalog & search, categories, product size variants, custom cake builder, order tracking, admin dashboard, coupon validation, checkout with COD/bKash/Nagad/Card.

---

## 💻 Local Development Setup

### 1. Backend Setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m app.main
```
Backend server runs on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server runs on `http://localhost:5173`.
