# fabricXai — Master Rebuild Plan

> **Decision (2026-07-09):** We upgrade, optimize, and enhance *this* repo
> (`fabricXai-the-garments-intelligent-platform`) into the real, backend-connected,
> AI-powered product. **The sibling `fabricxai-platform/` is not used** — not as a base,
> not as a dependency. It is only prior art we can *learn* patterns from (it proved out an
> AI-SDK / Supabase-SSR / RLS / auth approach); all code here is written fresh in this repo.
> `CLAUDE.md` will be updated to reflect that this repo is now the active build.

---

## 0. Where we are (ground truth)

The UI is a **complete, high-fidelity working prototype**; everything behind it is
simulated. Verified against code:

| Layer | Today | Evidence |
|---|---|---|
| Data | 100% browser `localStorage`, seeded from hardcoded arrays | `src/utils/supabase/database.tsx:14` → `USE_LOCALSTORAGE_FALLBACK = true` |
| Schema | one generic KV table `kv_store_1f923fcd(key, value jsonb)` | `src/supabase/functions/server/kv_store.tsx` |
| AI / MARBIM | scripted strings, no LLM anywhere | `AIAssistantPanel.tsx:750` `generateMockResponse()`; no `ai`/`@ai-sdk` dep |
| Auth | demo `localStorage` session, no email, no network | `AppContext.tsx:44`, `(auth)/login/page.tsx` |
| Embeddings | 384-dim hash placeholder | `server/index.tsx:698` |
| Real logic | only 3 tiny computations (FOB, avg DHU/AQL, avg efficiency) | see `CAPABILITY_INVENTORY.md §4` |

Only **6 of ~18 modules** even touch the (fake) data layer: Lead, Buyer, RFQ,
Costing, Production, Quality. The rest are pure inline mock.

**Patterns we build fresh here** (proven feasible elsewhere as prior art, but written new in this repo):
- `src/lib/ai/models.ts` — role-based registry (`fast: gemini-2.5-flash`, `reasoning: claude-sonnet-4-5`, `embed: openai text-embedding-3-small`).
- `src/lib/ai/extract.ts` — `generateObject` + Zod extraction, one schema per module.
- `src/lib/supabase/{client,server,middleware}.ts` — `@supabase/ssr` cookie auth.
- `src/app/api/agent/chat/route.ts` — streaming agent, RLS-scoped tools, `useChat` on the client.
- `supabase/migrations/*` — multi-tenant foundation (`companies`, `profiles`, `current_company_id()`,
  `handle_new_user()` trigger, RLS), plus `pending_changes` and one migration per module.

New deps to add to this repo: `ai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai`,
`@ai-sdk/react`, `@supabase/ssr`, `zod`. (React 18 stays; no upgrade to 19 required.)

---

## 1. The three things the user actually asked for

1. **Design system + UX pass** — keep the dark glassmorphism aesthetic; reduce data
   density, fix information hierarchy, make each dense screen readable from the *user's*
   perspective (owner vs floor worker). Not a re-skin.
2. **Real backend** — relational Supabase schema per module, RLS multi-tenant isolation,
   seeded demo data, every screen reading/writing real rows instead of `localStorage`.
3. **A working MARBIM copilot** — and this is the load-bearing one:

> **MARBIM is not "chat with an LLM." It is the propose → approve → commit loop.**
> Plain-language / photo / PDF input → the system **drafts a real ERP entry** → it lands
> in the existing **Approve inbox** (`Approve.tsx`) as a *pending change* → a human approves →
> it **commits to a real row**. The chat panel is only the surface; the loop is the product.
> The `Approve` screen already exists as the human half — we wire the other half to it.

Plus: **email-confirmation auth** replacing the demo localStorage session.

---

## 2. Target architecture

```
Browser (Next.js 16 App Router, React 18, existing UI)
  │
  ├─ @supabase/ssr client ──────── cookie session ──► Supabase Auth (email confirmation)
  │
  ├─ data hooks (replace database.tsx) ──► Supabase Postgres (RLS by company_id)
  │
  └─ MARBIM copilot
        ├─ /api/agent/chat        streaming reasoning (Anthropic)  ── tools scoped by RLS
        ├─ /api/extract/<module>  fast structured extract (Gemini) ── text/PDF/photo → Zod object
        └─ propose → pending_changes row → Approve inbox → approve() → commit to module table
                                                              │
                                              /api/embed (OpenAI) ──► pgvector knowledge base
```

**Model roles** (ported registry, extended):
- `reasoning` → Anthropic `claude-sonnet-4-5` — copilot chat, quote drafting, RFQ analysis.
- `fast` → Gemini `gemini-2.5-flash` — extraction, classification, autofill.
- `embed` → OpenAI `text-embedding-3-small` — real vectors for RAG (replaces hash placeholder).

**Never hardcode provider ids in feature code** — always go through `src/lib/ai/models.ts`.

---

## 3. The propose → approve → commit contract (the spine of MARBIM)

One generic mechanism every module reuses:

```
pending_changes (
  id, company_id, module, action ('create'|'update'|'delete'),
  target_table, target_id nullable, payload jsonb,   -- the drafted row
  summary text, ai_confidence numeric, source ('marbim'|'extract'|'manual'),
  status ('pending'|'approved'|'rejected'), created_by, reviewed_by, created_at
)  -- RLS by company_id
```

- MARBIM/extraction never writes a module table directly. It writes a `pending_changes` row.
- `Approve.tsx` lists `pending_changes` (replacing its static mock at `Approve.tsx:23`).
- Approve → server action validates payload against the module's Zod schema → writes the real
  row inside a transaction → marks the change `approved`. Reject → marks `rejected`, no write.
- This gives the deck's promise a literal implementation: *"Describe what happened. fabricXai
  does the ERP. You just approve."*

---

## 4. Rollout — vertical slices, not horizontal layers

We do **not** "connect all data, then seed all, then wire AI." We take one module fully
through the whole stack, prove the pattern, then fan out. Waves:

| Wave | Scope | Exit criteria |
|---|---|---|
| **0 — Foundation** | Port AI layer + `@supabase/ssr` + middleware; email-confirmation auth; multi-tenant schema + `pending_changes`; data-hook abstraction to retire `database.tsx`; design-system tokens pass; wire `Approve` to `pending_changes`. | Sign up → email confirm → land in app; one seeded table read through RLS; Approve inbox reads real pending rows. |
| **1 — Flagship: RFQ & Quotation** | Full end-to-end per `docs/modules/rfq-quotation.md`: schema, seed, list/detail wired, upload RFQ → Gemini extract → draft → Approve → commit → Anthropic drafts quotation. | A brand-new RFQ can be created *only* by describing/uploading it and approving; quote math is real. |
| **2 — Sales & Costing** | Lead Management, Buyer Management, Costing, Contacts. | CRUD on real rows; Costing FOB engine persists; each has one MARBIM loop. |
| **3 — Supply Chain** | Supplier Evaluation, Inventory Management, Shipment. | " |
| **4 — Production & People** | Production Planning, Workforce Management, Machine Maintenance. | " |
| **5 — Quality & Compliance** | Quality Control (real AQL/DHU), Compliance & Policy, Sustainability. | AQL engine computed, not hardcoded. |
| **6 — Intelligence** | Analytics, role Dashboards, Finance. | KPIs aggregate from real module tables, not constants. |
| **Cross-cutting** | Settings, Company Profile, Module Setup activation persisted. | Module on/off is a real row. |

Each module gets its **own doc** in `docs/modules/<module>.md` (see `_TEMPLATE.md`),
fleshed out at the start of its wave and kept current as it ships.

---

## 5. Design-system / UX approach

- **Keep** the canonical tokens (`CAPABILITY_INVENTORY.md §8`): teal `#57ACAF` (brand),
  gold `#EAB308` (MARBIM/AI), slate `#6F83A7` (muted), red `#D0342C` (danger), ink `#0D1117`,
  card `#1A1F2E`, gold→teal AI gradient. Promote these to real CSS variables / a tokens file so
  they stop being 5,000 scattered hex literals.
- **UX changes (user perspective, not a re-skin):** reduce the wall-of-data density on the
  heaviest screens (RFQ 309KB, Supplier 203KB, Production 198KB, BuyerMgmt 194KB) — progressive
  disclosure, a clear primary action per screen, owner-vs-worker view toggle where it already
  exists in `moduleConfigs.ts`, empty/loading/error states now that data is async.
- **DesignSync / Figma MCP** is available as an *optional refinement lane* for specific screens
  once tokens are centralized — used to iterate a screen's structure against the design system,
  not to regenerate the app.

### Expanded UI mandate (granted 2026-07-09)
Latitude is broader than "keep look, swap guts." Within each wave I may:
- **Enhance and modify UI** where it genuinely improves clarity/usability — not just wire data.
- **Polish states** — loading/empty/error/success, hover/focus, disabled, skeletons — so screens
  feel finished, not mock.
- **Restructure parts of a screen** where the current layout is cluttered or confusing, as long as
  the brand aesthetic (dark glass, teal/gold tokens) is preserved.
- **Place "Ask MARBIM" affordances deliberately** — add them where they're genuinely useful and
  remove/consolidate where they're noise. Today some screens carry 80–115 `onAskMarbim` calls
  (Supplier Evaluation ~115); the goal is *properly placed*, high-value copilot entry points, each
  wired to a real MARBIM action, not decoration.
Guardrail: enhancement serves clarity and the propose→approve→commit story; it is not a re-skin,
and it never changes the core brand look without reason.

---

## 6. Documentation model (per user request)

```
docs/
  MASTER_PLAN.md          ← this file (the spine)
  ENV_SETUP.md            ← exactly where to paste each credential
  modules/
    00-INDEX.md           ← every module: status, target tables, AI features, wave
    _TEMPLATE.md          ← the shape every module doc follows
    rfq-quotation.md      ← flagship, fully specced
    <module>.md           ← one per module, filled at its wave
```

Each module doc is self-contained: current state → target UX → data model → AI features →
backend wiring → optimization notes → done-criteria. This is the "individual module documents"
the user asked for.

---

## 7. Immediate next step (blocked on you)

I need credentials before writing code. See `docs/ENV_SETUP.md` for the exact file and keys.
Once `.env.local` is populated I start **Wave 0**, then **Wave 1 (RFQ)** as the proof slice.
