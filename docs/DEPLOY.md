# Deploy — Vercel + GitHub

> **STATUS (2026-07-09): LIVE.** Project `fab's projects/fabricxai-platform` — linked, all env vars
> set (prod/preview/dev), GitHub `fabricxai/fabricxai-platform` connected (auto-deploy on push),
> production deployed → **https://fabricxai-platform.vercel.app** (verified: /login 200, APIs 401).
>
> **Remaining (you, DNS):** attach `app.fabricxai.com` — Vercel dashboard → project → Settings →
> Domains → add `app.fabricxai.com`; it shows a CNAME (`cname.vercel-dns.com`) to set at your
> registrar. Then add `https://app.fabricxai.com/**` + `https://*.vercel.app/**` to Supabase →
> Auth → Redirect URLs (so email-confirmation signup works on the deployed site; the seeded
> password login already works).


Hosting: **Vercel** (native Next.js, no Docker). Source: **github.com/fabricxai/fabricxai-platform**.
Data/auth stays on **managed Supabase** (`aqnrnbdnhekkbimaoewp`). Domain: **app.fabricxai.com**.

Deploys are automatic: every push to `main` ships to production; every PR gets a preview URL.

## One-time setup

### 1. Import the repo
1. vercel.com → **Add New… → Project** → import `fabricxai/fabricxai-platform`.
2. Framework preset auto-detects **Next.js**. Leave Build Command / Output as default
   (do NOT set them — the old Vite `vercel.json` was deleted for this reason).

### 2. Environment variables
Add these in **Project → Settings → Environment Variables** (tick Production + Preview +
Development). Values come from your `.env.local`.

| Key | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | `https://aqnrnbdnhekkbimaoewp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | anon key |
| `NEXT_PUBLIC_SUPABASE_PROJECT_ID` | public | `aqnrnbdnhekkbimaoewp` |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only** | never prefix NEXT_PUBLIC_ |
| `ANTHROPIC_API_KEY` | **server-only** | reasoning / quotes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | **server-only** | Gemini extraction |
| `OPENAI_API_KEY` | **server-only** | embeddings |
| `NEXT_PUBLIC_APP_URL` | public | **`https://app.fabricxai.com`** (prod) — drives auth email redirects |
| `NEXT_PUBLIC_APP_NAME` | public | `fabricXai` |

> The 4 server-only keys must NOT have the `NEXT_PUBLIC_` prefix or they leak into the browser bundle.

### 3. Domain
1. Vercel → **Project → Settings → Domains** → add `app.fabricxai.com`.
2. Point DNS as Vercel instructs (CNAME → `cname.vercel-dns.com`, or A record).
3. Confirm `NEXT_PUBLIC_APP_URL` = `https://app.fabricxai.com` in Production env.

### 4. Supabase auth URLs (so email confirmation redirects work)
Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL:** `https://app.fabricxai.com`
- **Redirect URLs:** add
  - `https://app.fabricxai.com/**`
  - `https://*.vercel.app/**`  (so preview deployments can log in)
  - `http://localhost:3000/**` (local dev)
- **Authentication → Providers → Email → Confirm email = ON**.

### 5. First deploy
Push to `main` (or click Deploy). Vercel runs `next build` — already verified green locally.
Type errors are skipped at build (`typescript.ignoreBuildErrors`, temporary — see PROGRESS.md).

## Notes
- No `vercel.json` needed; Vercel auto-detects Next.js. (A typed `vercel.ts` can be added later
  for crons/rewrites if wanted.)
- API routes (`/api/agent/chat`, `/api/extract/rfq`, `/api/rfq/draft-quote`) and server actions
  run as Vercel Functions automatically — nothing to configure.
- Before real traffic: replace Supabase's default auth SMTP (≈3–4 emails/hr) with a real SMTP
  provider in Supabase → Authentication → Emails.
