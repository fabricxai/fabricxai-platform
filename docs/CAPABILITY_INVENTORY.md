# fabricXai — Capability Inventory (Phase A)

> **Purpose.** A code-grounded, factual inventory of what *fabricXai — The Garment Intelligent
> Platform* actually is today. Every claim below traces to a file in this repository. This document
> is the sole allowed source for the Phase B design brief.
>
> **Repo read:** `fabricXai-the-garments-intelligent-platform` (this directory).
> Framework: **Next.js 16 App Router** + React 18 + TypeScript + Tailwind + Radix UI + Recharts +
> Motion. Single-page-style app served through one catch-all route
> (`src/app/(app)/[[...slug]]/page.tsx`). Auth screens under `src/app/(auth)/`.

---

## 0. How to read the status labels

A strict, testable rubric is used throughout (this is what keeps the deck honest):

| Label | Meaning |
|-------|---------|
| **Shipped** | Real logic or persistence that works today, in code, not in a model or a mock array. |
| **Partial** | UI is complete and interactive, but runs on hardcoded mock data and/or browser-local persistence; nothing reaches a real backend or a real model. |
| **Planned** | Exists only as config text, a diagram, or a placeholder — no working behavior. |

**The single most important fact about this repo:** *the UI is a complete, high-fidelity working
prototype; the intelligence and the backend behind it are simulated.* Concretely:

- **No AI model is wired in.** There is no `@ai-sdk`, `@anthropic-ai`, or Google GenAI dependency
  anywhere (`package.json`), and no LLM call in the app. The "MARBIM AI" copilot returns
  **scripted strings** from `generateMockResponse()` (`src/components/AIAssistantPanel.tsx:750`).
- **No real database is used at runtime.** `src/utils/supabase/database.tsx:14` ships with
  `const USE_LOCALSTORAGE_FALLBACK = true;` — all reads/writes go to **browser localStorage**,
  seeded from hardcoded arrays. A Supabase edge backend exists but is dormant dead-code behind that flag.
- **No relational schema.** The only backend table is a single generic key→JSONB store
  (`src/supabase/functions/server/kv_store.tsx`, `kv_store_1f923fcd(key TEXT, value JSONB)`).
- **Vector/RAG is a demo.** Embeddings are a hash-based 384-dim placeholder, explicitly labelled
  "for demo purposes… In production, use OpenAI" (`src/supabase/functions/server/index.tsx:698-720`).

So almost every capability below is **"UI shipped, data mocked, AI scripted" → Partial.** The few
genuinely **Shipped** items are small pieces of deterministic math. This is a **product prototype /
design system**, not yet a live product — a crucial framing for the deck.

---

## 1. What the platform is — one integrated system

fabricXai presents as **one integrated ERP for a garment factory**, organized as a set of features
you switch on. The left navigation (`src/components/Sidebar.tsx`) groups everything under one shell:

- **CRM & Sales** — Lead Management, Buyer Management
- **Production & Supply Chain** — Supplier Evaluation, RFQ & Quotation, Costing, Production Planning,
  Workforce Management, Machine Maintenance, Inventory Management, Quality Control, Shipment
- **Financial & Compliance** — Finance, Compliance & Policy
- **Sustainability** — Sustainability (ESG / Digital Product Passport)
- **Analytics & Insights** — Analytics & Reporting

Cross-cutting screens: **Dashboard** (role-based landing views), **Approve** (unified approval inbox),
**Contacts**, **Module Setup** (activation marketplace), **Settings**, **Company Profile**, and legal pages.

Every feature module is turned on through the same guided flow — **Intro → Pricing → Onboarding** —
driven by one config file (`src/components/pages/modules/moduleConfigs.ts`, 15 modules, each with
`ownerImpact`, `employeeImpact`, `keyFeatures`, `aiCapabilities`, three pricing tiers
Basic/Growth/Enterprise, and step-by-step onboarding). `Module Setup`
(`src/components/pages/ModuleSetup.tsx`) is a marketplace where each feature shows status
`locked | available | onboarding | active` — reinforcing the "one platform, activate the features you
need" story rather than "22 separate products."

**Built-in owner-vs-worker framing.** `moduleConfigs.ts` gives every feature an explicit
`ownerImpact` and `employeeImpact` (e.g. Costing → owner "Accurate margins" / worker "Auto-updated
rates and FX"; Quality → owner "Reduced rework" / worker "AI defect detection and CAPA"). This is the
exact narrative the positioning wants, already encoded in the product.

---

## 2. Feature inventory (grouped as features of one platform)

For each feature: plain (Gazipur-simple) description · status · file path(s). Every module screen is a
complete, interactive UI; the status reflects data/logic reality.

### 2.1 Sales & Orders

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Lead Management** | Collect buyer leads, run outreach campaigns, keep a lead inbox & directory, score leads, log calls/emails/WhatsApp. | **Partial** (localStorage CRUD, seeded from mock) | `src/components/pages/LeadManagement.tsx` (dashboard/campaigns/lead-inbox/directory/analytics; sub-tabs `:3154`) |
| **Buyer Management** | One place for every buyer — profile, tier, contracts, health score, feedback & issues. | **Partial** (localStorage CRUD) | `src/components/pages/BuyerManagement.tsx` (dashboard/buyer-directory/feedback-issues) |
| **RFQ & Quotation** | Take in buyer RFQs, build quotations, track clarifications, compare quote scenarios. | **Partial** (localStorage CRUD; quote figures hardcoded) | `src/components/pages/RFQQuotation.tsx` (dashboard/rfq-inbox/quotation-builder/clarification-tracker) |
| **Contacts** | Directory of customers, suppliers, partners with status filters. | **Partial** (pure mock) | `src/components/pages/Contacts.tsx` |

### 2.2 Costing & Finance

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Costing — cost sheet & FOB math** | Build a garment cost sheet (material, labor, overhead, freight) and get the FOB price for a target margin. | **Shipped (the math)** — real formula in code | `src/components/CreateCostSheetDrawer.tsx:114-142` — `materialTotal = Σ qty×unitCost`, `laborTotal = Σ minutes×rate`, `totalCost = material+labor+overhead+freight`, `FOB = totalCost / (1 − margin/100)` |
| **Costing — sheets, scenarios, benchmarks** | List cost sheets, run margin scenarios, compare to benchmarks; margin alerts. | **Partial** — save is a toast stub (`CreateCostSheetDrawer.tsx:154 "// Submit logic here"`); list/scenario data hardcoded | `src/components/pages/Costing.tsx` (dashboard/cost-sheet-list/scenarios/benchmarks); real markup also at `Costing.tsx:221-227` (on constant inputs) |
| **Finance** | Accounts receivable/payable, per-order P&L, cash flow, banking & Letters of Credit. | **Partial** (pure mock; all figures hardcoded) | `src/components/pages/Finance.tsx` |

### 2.3 Supply Chain & Sourcing

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Supplier Evaluation** | Score suppliers, run an RFQ board out to suppliers, track sample requests. | **Partial** (pure mock, no persistence) | `src/components/pages/SupplierEvaluation.tsx` (dashboard/supplier-directory/rfq-board/samples) |
| **Inventory Management** | Track fabric/trims raw-material master, stock ledger/GRN, warehouse locations, material requests (with approve/auto-approve), finished goods, reorder & forecasting. | **Partial** (pure mock; "forecast" numbers hardcoded, not computed) | `src/components/pages/InventoryManagement.tsx` (7 sub-tabs `:589`) |
| **Shipment** | Book freight, track shipments live, keep an export document vault (with versions), send buyer updates, handle exceptions/delays. | **Partial** (pure mock; "AI suggestion" text hardcoded, e.g. `:1876`) | `src/components/pages/Shipment.tsx` (booking/live-tracking/document-vault/buyer-updates/exceptions) |

### 2.4 Production & Planning

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Production Planning** | Master plan (Gantt), line allocation, Time & Action calendar, material shortages, AI risk view; average line efficiency. | **Partial** (localStorage CRUD) · avg-efficiency mean is **Shipped** math (`ProductionPlanning.tsx:547-548`); no SMV/time-study engine | `src/components/pages/ProductionPlanning.tsx` (6 sub-tabs `:3492`) |
| **Workforce Management** | Worker roster & profiles, attendance & leave, skill matrix, training & assessments, welfare & safety. | **Partial** (pure mock) | `src/components/pages/WorkforceManagement.tsx` (6 sub-tabs) |
| **Machine Maintenance** | Machine registry, preventive-maintenance planner, breakdown/repair logs, spare parts, "AI predictive" panel. | **Partial** (pure mock; predictive = AI prompt, not a model) | `src/components/pages/MachineMaintenance.tsx` (6 sub-tabs) |

### 2.5 Quality & Compliance

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Quality Control** | Inline QC (DHU/defects), Final QC with AQL sampling, lab tests, CAPA, standards library; average DHU & average AQL level. | **Partial** (localStorage CRUD) · avg-DHU/avg-AQL means are **Shipped** math (`QualityControl.tsx:398-403`) | `src/components/pages/QualityControl.tsx` (6 sub-tabs `:2003`) |
| ↳ AQL pass/fail engine | — | **Planned / not present** — accept/reject criteria are **hardcoded strings** (`QualityControl.tsx:322-323`); there is **no ISO-2859 sample-size/acceptance-number engine**; pass/fail is a stored field, not computed. | same file |
| **Compliance & Policy** | Policy library, social/factory audits, regulatory-change monitor. | **Partial** (pure mock) | `src/components/pages/CompliancePolicy.tsx` (dashboard/policy-library/audits/regulatory-monitor) |
| **Sustainability** | ESG dashboards (environmental/social/governance), waste & materials, carbon footprint & Digital Product Passport. | **Partial** (pure mock; footprint numbers hardcoded) | `src/components/pages/Sustainability.tsx` (6 sub-tabs) |

### 2.6 Intelligence, Reporting & Cross-cutting

| Feature | Plain description | Status | Where |
|---|---|---|---|
| **Dashboard (role views)** | Role-specific landing dashboards: MD/CEO, merchandising, production, QC, HR, finance, compliance, line supervisor. | **Partial** (pure mock) | `src/components/pages/Dashboard.tsx` (role views `:275`) |
| **Analytics & Reporting** | Cross-module KPI dashboards, AI "explainers", report library, scheduled reports. | **Partial** (pure mock; correlation/root-cause are static arrays) | `src/components/pages/Analytics.tsx` |
| **Approve (approval inbox)** | One inbox to approve/reject items — POs, budgets, contracts, leave — each with an `aiScore` and an approval chain. | **Partial** (static mock list) — this is the human-approval half of "AI proposes, you approve" | `src/components/pages/Approve.tsx` (pending/approved/rejected/urgent; data `:23`) |
| **Company Profile** | Company overview, product catalog, public website builder, AI insights. | **Partial** (pure mock) | `src/components/pages/CompanyProfile.tsx` |
| **Module Setup (marketplace)** | Turn features on; each shows locked/available/onboarding/active; guided Intro→Pricing→Onboarding. | **Partial** (config-driven UI; activation is local state) | `src/components/pages/ModuleSetup.tsx`, `modules/ModuleRouter.tsx`, `modules/moduleConfigs.ts` |
| **Settings** | Account, company, security, notifications, preferences, integrations, billing, modules, advanced. | **Partial** (form state only) | `src/components/pages/Settings.tsx` |

---

## 3. The copilot interaction model — "MARBIM AI"

**One consistent pattern across the whole app.** Anywhere the product wants to feel intelligent, it
renders an **"Ask MARBIM"** affordance that forwards a canned prompt into a shared right-side AI panel:

- `MarbimAIButton` / `AICard` / `AskMarbimButton` call `onAskMarbim(prompt)` → `handleAskMarbim` in
  `src/contexts/AppContext.tsx:72` → opens `AIAssistantPanel`. Nearly every module wires dozens of
  these (Supplier Evaluation alone has ~115 `onAskMarbim` calls; most modules 20–80).
- The panel (`src/components/AIAssistantPanel.tsx`, 1346 lines) is a full chat UI with attachments,
  reasoning-step animation, tables, charts, and **action buttons** — a polished "AI proposes, here
  are your options" surface.

**Where "AI proposes, you approve" appears in code (as designed UX):**
- Scripted proposals end with an approve-style question — e.g. RFQ: *"I've parsed the RFQ PDF. Found 3
  missing specifications… Shall I draft a clarification email to the buyer?"*; Shipment: *"…Shall I
  notify the buyer with updated tracking?"* (`AIAssistantPanel.tsx:750-763`).
- `AICard` renders "AI-Powered Insights" with priority badges and action buttons — the file's own
  comment reads **`{/* Mock AI-Powered Insights */}`** (`src/components/AICard.tsx:57`).
- `Approve.tsx` is the human side: an approvals inbox where each item carries an `aiScore` and an
  approval chain (`Approve.tsx:23+`).
- Inventory shows "Auto-Approve" and "AI Procurement Recommendations" copy
  (`InventoryManagement.tsx:1197,1495`); Shipment exceptions carry canned "AI Suggestion" text.

**Honest characterization for the deck:** the propose-then-approve interaction model is **fully
designed and demonstrated**, but it is **scripted, not wired** — responses come from
`generateMockResponse()` (`AIAssistantPanel.tsx:750`), there is no LLM behind it, and approving an
item does not mutate any ERP record. It is a convincing, complete *demonstration* of the model, not a
working copilot→pending-change→approve→commit loop. **Status: the pattern is Shipped as UX; the
intelligence is Planned.**

---

## 4. Deterministic domain logic actually in code

Only three real computations exist; everything else labelled "AI/forecast/score" is a hardcoded value.

| Logic | Formula in code | Status | Where |
|---|---|---|---|
| **FOB / cost-sheet math** | `totalCost = material + labor + overhead + freight`; `FOB = totalCost / (1 − margin/100)`; from live form inputs (qty×unitCost, minutes×rate) | **Shipped** (compute works; save is stubbed) | `CreateCostSheetDrawer.tsx:114-142` |
| **Quality aggregates** | `avgDHU = mean(dhu)`, `avgAQL = mean(aqlLevel)`, pass/fail counts | **Shipped** | `QualityControl.tsx:396-403` |
| **Production efficiency** | `avgEfficiency = mean(line.efficiency)` | **Shipped** | `ProductionPlanning.tsx:547-548` |
| AQL sample-size / acceptance-number engine | — | **Not present** (hardcoded criteria strings) | `QualityControl.tsx:322` |
| SMV / time-study, reorder & demand forecasting, correlation/root-cause | — | **Not present** (hardcoded arrays) | Inventory/Analytics/Production files |

Takeaway: the deterministic-logic story is currently **thin** — one real pricing formula plus a few
averages. The copilots have almost nothing real to "narrate" yet.

---

## 5. Roles, permissions & tenant isolation ("your data stays yours")

Implemented in code, but enforced client-side over localStorage (server exists, dormant):

- **RBAC matrix** (`src/utils/supabase/rbac.tsx`): **11 roles** (admin, manager, sales, production,
  finance, procurement, compliance, hr, operations, quality, viewer), **6 permission types**
  (create/read/update/delete/approve/export), mapped per module in `MODULE_PERMISSIONS` (14 modules).
  Helpers: `hasModuleAccess()`, `hasPermission()`, `canPerformAction()`, `filterDataByAccess()`.
- **Tenant isolation by key prefix.** Every record is stored/fetched under `` `${companyId}:${key}` ``
  and listed by `getByPrefix('${companyId}:')` (`server/index.tsx:403,468,632`). Records are stamped
  with `companyId`/`ownerId` on write (`rbac.tsx addMetadata`). The dormant server enforces the same
  via `X-User-Id` / `X-Company-Id` / `X-User-Role` headers and 401/403 checks
  (`server/index.tsx:43-53,441,511,563`).
- **Sessions** are localStorage-only demo sessions (`AppContext.tsx:45-61` → `fabricxai_user`;
  `rbac.tsx` → `fabricxai_session`, 24h expiry). Login/logout make no network call.

**Status: Partial.** The isolation *model* (per-tenant keys + role matrix) is real and coherent in
code, but at runtime it guards **browser-local data**, not a shared multi-tenant database.

---

## 6. "Layer on top of an existing ERP" — integration readiness

- **What exists:** onboarding copy across modules invites CSV/Excel/CRM imports and PDF contract/RFQ
  uploads (e.g. "Import existing leads from CSV, Excel, or CRM export"; "Upload PDF contracts…";
  Salesforce/HubSpot mentions) — `moduleConfigs.ts` onboarding steps. There is an "Integration Layer"
  in a **diagram** (`src/components/DatabaseArchitectureDiagram.tsx:82`) and a Settings → Integrations
  tab. Communication logging supports phone/email/WhatsApp/note (`CommunicationLogger.tsx`, mock).
- **What actually works:** **none of it.** There is no connector, importer, file-ingestion parser,
  external API client, or sync job in the codebase. RFQ/contract "parsing" is a scripted MARBIM string.
- **Status: Planned.** The "intelligence layer on top of your ERP" is positioning and UI scaffolding,
  not implemented capability.

---

## 7. Business objects the system models

From seed data (`src/utils/supabase/seedDatabase.tsx`) and page mocks — plain English:

- **Leads** (name, company, country, source, fit score, status) · **Campaigns** (open/click/response
  rates) · **Conversations** (channel, sentiment, intent).
- **Buyers** (tier A/B/C, health score, revenue YTD, AR days, credit limit, payment terms,
  certifications — modelled on H&M, Zara, Gap, Nike, Uniqlo) · **Issues** · **Feedback**.
- **RFQs** (product, qty, target price, fabric, colors, sizes, incoterms) · **Quotes** (material/labor/
  overhead breakdown, margin, lead time, MOQ).
- **Cost sheets** (style, full BOM, labor/overhead lines, FOB, margin health, competitive index).
- **Production orders** (line, floor, planned/actual dates, produced/passed/failed qty, efficiency,
  defect rate, workers/machines assigned) · **Line capacity**.
- **QC inspections** (stage, AQL level/standard, lot & sample size, pass rate, critical/major/minor
  defects, corrective action) · **Defects**.
- **Users** and **Companies** (tenants).

Only these **6 modules** (Lead, Buyer, RFQ, Costing, Production, Quality) have seed entities; the other
9 feature areas are configured/UI-only with **no data model** yet.

---

## 8. Canonical brand tokens (from the code)

No `BRAND.md` exists; tokens are taken from actual usage across `.tsx`/`globals.css`
(frequency = repo-wide hex count).

| Token | Hex | Role | Evidence |
|---|---|---|---|
| **Slate-blue** | `#6F83A7` | Muted text / secondary (most-used) | 5,921 uses |
| **Teal (primary/brand)** | `#57ACAF` | Primary brand accent, positive states | 5,532 uses |
| **Gold/Amber (accent)** | `#EAB308` | Highlight, AI/MARBIM accent, warnings | 5,394 uses |
| **Red (danger)** | `#D0342C` | Alerts, delays, rejected/critical | 875 uses |
| **Ink / background** | `#0D1117` | App background (dark theme) | 166 uses |
| **Card surface** | `#1A1F2E` | Panels, tooltips, cards | 74 uses |
| Secondary amber | `#F59E0B` | occasional accent | 33 uses |
| Emerald | `#10B981` | occasional success | 9 uses |

- **Signature gradient** (AI surfaces): gold→teal, e.g. `from-[#EAB308] to-[#57ACAF]` (`AICard.tsx`).
- **Look & feel:** **dark theme**, glassmorphism (`backdrop-blur`, translucent borders), rounded-2xl
  cards, Motion animations, Recharts data-viz. Chart palette
  `['#EAB308','#57ACAF','#6F83A7','#D0342C']` (`AIAssistantPanel.tsx:769`).
- **Type:** system sans stack (`--font-sans`, `globals.css:77`); weights 400/500/600/700. No custom
  brand font is loaded.
- **Logo / product persona:** the AI copilot is branded **"MARBIM"** (logo `figma:asset/…`,
  `AIAssistantPanel.tsx`); app is **fabricXai**. Icon set: lucide-react.

---

## 9. Open questions (surface, don't guess)

1. **Which repo does the deck represent?** The workspace `CLAUDE.md` marks *this* repo as
   **"reference only … mock data, localStorage demo auth"** and names a sibling `fabricxai-platform/`
   as the **active production build with a real Supabase project and a real Anthropic+Gemini agent
   layer**. Phase A here is faithful to *this* codebase (scripted AI, localStorage). If the deck must
   describe **live AI + real ERP data**, those claims belong to the sibling repo, not this one.
   **Please confirm which product state the deck should represent.**

2. **Register of the deck: "ships today" vs "vision, prototyped."** Read literally, today = a complete
   *UI prototype* with scripted intelligence — an honest but thin story. The compelling-and-honest
   framing is: *"one integrated system, demonstrated end-to-end as a working UI prototype, with the
   AI copilot and ERP-intelligence layer as the roadmap."* Phase B needs this register decided before
   writing.

3. **Module count.** `moduleConfigs.ts` defines **15** feature modules; `rbac.tsx` /
   architecture diagram say **14** (business modules, excluding analytics + system pseudo-modules
   approve/dashboard). The deck should say **"one platform"**, not a number — but note the discrepancy.

4. **Pricing.** Three tiers (Basic/Growth/Enterprise) exist per module but carry **no monetary
   amounts** — pricing is feature-gated text only. No PRICING.md. If the deck needs prices, they must
   come from the user.

5. **"22 products."** The positioning brief references 22 standalone products; this repo contains
   **15 configured feature modules** (20+ screens). Confirm how the 22 maps to these features so the
   deck's "one platform, N features" line is accurate.
