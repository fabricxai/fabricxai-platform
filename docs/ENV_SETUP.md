# Environment Setup — where to paste your credentials

Create **one file**: `.env.local` in the repo root
(`fabricXai-the-garments-intelligent-platform/.env.local`). It is gitignored — never commit it.

Paste this and fill the values:

```bash
# ── Supabase (your NEW project) ─────────────────────────────
# Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...            # "anon / public" key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                # "service_role" key — SERVER ONLY, no NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_PROJECT_ID=YOUR_NEW_REF    # the ref, e.g. abcd1234...

# Dashboard → Project Settings → Database → Connection string (for CLI push/seed)
SUPABASE_DB_PASSWORD=your-db-password

# ── AI providers ────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...                    # reasoning (MARBIM chat, quote drafting)
GOOGLE_GENERATIVE_AI_API_KEY=AIza...            # fast extraction (text/PDF/photo → structured)
OPENAI_API_KEY=sk-...                           # embeddings for real RAG/semantic search

# ── App ─────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000       # used in auth email-confirmation redirect links
NEXT_PUBLIC_APP_NAME=fabricXai
```

## Notes

- **Key name matters.** The AI SDK reads `GOOGLE_GENERATIVE_AI_API_KEY` (not `GEMINI_API_KEY`)
  and `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` by convention — keep these exact names.
- **`SUPABASE_SERVICE_ROLE_KEY` and the three AI keys are server-only.** They must **not** be
  prefixed with `NEXT_PUBLIC_` or they'll leak to the browser bundle.
- The old repo hardcoded a Supabase project (`elznbletkunibhicbizb`) in
  `src/utils/supabase/info.tsx`. Wave 0 removes those fallbacks so only your env values are used.

## What I do once this file exists

1. `supabase link` to your new project ref, then apply migrations (`supabase db push`) —
   creates the real schema.
2. Run the seed script — populates demo buyers / RFQs / etc. so screens have real data.
3. Enable **email confirmation** in Supabase Auth settings (I'll tell you the exact toggle:
   Dashboard → Authentication → Providers → Email → "Confirm email" ON, and set the Site URL
   to `NEXT_PUBLIC_APP_URL`).
4. Start Wave 0 → Wave 1 (RFQ).

You do **not** need to add anything to Vercel yet — that's a later deployment step.
