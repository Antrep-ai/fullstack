# ANTREP Unified Platform

Investment banking automation platform that connects startups, investors, incubators, VCs, companies, and investment bankers through three AI-powered engines: data profiling, two-way matching, and content generation.

## What it does

| Engine | Description |
|---|---|
| **Data Engine** | Scrapes and profiles companies and investors using Groq LLM + SerpAPI |
| **Matching Engine** | Hybrid rule + semantic scoring to rank startup–investor fit |
| **Content Engine** | Generates teasers, one-pagers, pitch decks (PPTX), and outreach emails |

---

## Quick Start (3 terminals)

```bash
# Terminal 1 — Node backend (auth + user profiles, port 4001)
cd antrep_backend
cp .env.example .env   # fill in your values
npm install
npm run dev

# Terminal 2 — FastAPI Python server (AI engines, port 8001)
pip install -r requirements.txt
python api_server.py

# Terminal 3 — React frontend (port 3000)
cd antrep_frontend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Folder Structure

```
fullstack/
├── antrep_frontend/          # React + Vite UI (port 3000)
│   ├── src/
│   │   ├── pages/            # 10 pages: Landing, Login, Register, Dashboard, ...
│   │   ├── context/          # AuthContext (Supabase session state)
│   │   ├── api/              # client.js — all FastAPI calls
│   │   └── lib/              # supabase.js client init
│   └── public/images/        # Role illustration assets
│
├── antrep_backend/           # Node + Express auth/profile API (port 4001)
│   ├── src/
│   │   ├── db/               # Drizzle ORM schema + connection
│   │   ├── routes/           # health, register, profile, webhook, tracker
│   │   ├── middleware/       # verifySupabase JWT, requestLogger, errorHandler
│   │   └── validators/       # Zod schemas for all 6 roles
│   └── drizzle/migrations/   # Generated SQL migration files
│
├── api_server.py             # FastAPI subprocess bridge (port 8001)
├── investor_profileV2/       # Data Engine — investor + company profiler
├── matchingenginetwoway/     # Matching Engine — hybrid rule + semantic scorer
└── content_engine/           # Content Engine — PPTX, PDF, email generator
```

---

## Environment Variables

### antrep_backend — copy `.env.example` to `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default `4001`) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **never expose to browser** |
| `FRONTEND_URL` | CORS allowed origin (default `http://localhost:3000`) |

### antrep_frontend — copy `.env.example` to `.env`

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key — safe to expose |
| `VITE_NODE_BACKEND_URL` | Node backend URL (default `http://localhost:4001`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Supabase JS client |
| Node Backend | Express, Drizzle ORM, Neon PostgreSQL, Zod, Supabase Admin |
| Python API | FastAPI, Uvicorn |
| Data Engine | Groq LLaMA-3, SerpAPI, DuckDuckGo scraper |
| Matching Engine | SentenceTransformers (all-MiniLM-L6-v2), FAISS, Groq |
| Content Engine | Groq LLaMA-3, python-pptx, Playwright (HTML → PDF) |
| Auth | Supabase Auth (JWT) |
| Database | Neon PostgreSQL (serverless) |
