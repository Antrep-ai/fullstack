# antrep-backend

Express + Drizzle ORM service that handles user registration, authentication, and profile management for the ANTREP platform. Runs on **port 4001**.

Supabase handles the auth token (JWT). This service verifies that token on every protected request, then reads/writes user profiles in Neon PostgreSQL via Drizzle ORM.

---

## Run

```bash
cp .env.example .env   # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev            # nodemon — restarts on file change
```

Production:

```bash
npm start              # node src/index.js
```

---

## API Endpoints

### Public

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server + database liveness check |

### Registration

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register-profile` | None | Create user profile after Supabase signup. Body must include `role`, `supabaseUserId`, `email`, `username`, and role-specific fields. Validated by Zod. |

### Profile (JWT required — `Authorization: Bearer <token>`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/profile/me` | Return the caller's `user_profiles` row plus their role-specific profile row |
| `PATCH` | `/api/profile/me` | Update allowed fields: `mobileNumber`, `firstName`, `lastName`, `username`, `status` |

### Webhooks

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/webhooks/supabase` | Receives Supabase Auth events. Flips `user_profiles.status` from `pending_email_verification` → `active` when email is confirmed. Configure in Supabase Dashboard → Auth → Hooks. |

### Monitoring

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/tracker` | Live hit counts for every registered route (auto-discovered at startup) |

---

## Database Migrations

The schema lives in `src/db/schema.js`. After any change to that file:

```bash
# 1. Generate a new SQL migration file from the schema diff
npm run db:generate

# 2. Apply the migration to Neon
npm run db:migrate
```

> **NEVER use `drizzle-kit push` in this project.**
> `push` silently alters the live database without creating a migration file,
> leaving no record of what changed and making rollbacks impossible.
> Always use `generate` → `migrate`.

To inspect data in a browser UI:

```bash
npm run db:studio    # opens Drizzle Studio at https://local.drizzle.studio
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port. Defaults to `4001`. |
| `NODE_ENV` | No | `development` or `production`. |
| `DATABASE_URL` | **Yes** | Neon PostgreSQL connection string. Get from console.neon.tech. |
| `SUPABASE_URL` | **Yes** | Your Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Service role key — used to verify JWTs server-side. Never expose to the browser. |
| `FRONTEND_URL` | No | CORS allowed origin. Defaults to `http://localhost:3000`. |

---

## Database Schema

7 tables in Neon PostgreSQL:

| Table | Purpose |
|---|---|
| `user_profiles` | Common profile for all 6 roles (email, username, status, …) |
| `startup_profiles` | Startup-specific fields (startupName, founderName, stage, …) |
| `investor_profiles` | Investor fields (thesis, ticket size, preferred sectors, …) |
| `incubator_profiles` | Incubator fields (incubatorName, focusSectors, …) |
| `venture_capitalist_profiles` | VC fields (firmName, AUM, preferred stages, …) |
| `company_profiles` | Company fields (companyName, industrySector, annualRevenue, …) |
| `investment_banker_profiles` | Banker fields (firmName, dealType, yearsOfExperience, …) |

All role-specific tables have a `user_profile_id` foreign key → `user_profiles.id` with `ON DELETE CASCADE`.
