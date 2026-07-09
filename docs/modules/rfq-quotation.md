# Module: RFQ & Quotation ⭐ (flagship slice)

> Wave: 1 · Status: `planned` · Owner file: `src/components/pages/RFQQuotation.tsx` (309KB)
> Drawers: `UploadRFQDrawer`, `BroadcastRFQDrawer`, `RFQDetailDrawer`, `BuyerRFQDetailDrawer`,
> `SupplierRFQDetailDrawer`, `AwardedRFQDetailDrawer`, `QuoteComparisonDrawer`,
> `QuoteScenarioDetailDrawer`, `CreateCostSheetDrawer`.

This module is built first and completely — it proves the entire stack (real schema → seed →
async UI → Gemini extract → Anthropic draft → propose→approve→commit) so every later wave copies
a working pattern instead of inventing one.

## 1. What it is
Take in a buyer's request for quotation, build a priced quotation, track clarifications, compare
quote scenarios. **Owner value:** win more orders at the right margin. **Worker value:** the
merchandiser just uploads the buyer's email/PDF and approves — no manual data entry.

## 2. Current state
- Sub-tabs: dashboard / rfq-inbox / quotation-builder / clarification-tracker (`RFQQuotation.tsx`).
- Data: localStorage CRUD; **quote figures hardcoded** (`CAPABILITY_INVENTORY §2.1`).
- "Parse the RFQ PDF" is a scripted MARBIM string (`AIAssistantPanel.tsx:750`), not real parsing.

## 3. Target UX changes (keep the aesthetic)
- RFQ inbox: clear status pipeline (open → quoted → won/lost), one primary CTA **"New RFQ from
  document"** that opens the extract flow; manual entry stays as secondary.
- Detail: progressive disclosure — summary card first, specs/quote/clarifications behind tabs,
  not one 309KB wall.
- Real async states: skeleton while loading, empty state for a fresh company, error toasts.
- MARBIM draft shown as a **diff-style review card** (what it will create) before approval.

## 4. Data model (Postgres, RLS by company_id)
```sql
rfqs (                       -- request intake
  id, company_id, buyer_id → buyers, title, product_type, description,
  quantity, unit, target_price numeric(12,2), currency, deadline date,
  status ('open'|'quoted'|'won'|'lost'|'cancelled'),
  source ('manual'|'ai_extracted'), notes, created_by, created_at, updated_at )

quotes (                     -- a priced response to an rfq
  id, company_id, rfq_id → rfqs, version int, currency,
  material_cost, labor_cost, overhead_cost, freight_cost,   -- numeric(12,2)
  margin_pct numeric(5,2), fob_price numeric(12,2),         -- fob computed, stored for history
  lead_time_days int, moq int, status ('draft'|'sent'|'accepted'|'rejected'),
  created_by, created_at, updated_at )

quote_lines (                -- BOM/labor detail behind a quote
  id, quote_id → quotes, kind ('material'|'labor'|'overhead'|'freight'),
  description, quantity numeric, unit, unit_cost numeric(12,4), line_total numeric(12,2) )

rfq_clarifications (
  id, company_id, rfq_id → rfqs, question, answer, status ('open'|'answered'),
  raised_by, created_at )
```
Indexes: `rfqs(company_id, created_at desc)`, `rfqs(buyer_id)`, `quotes(rfq_id, version desc)`.
RLS: `company_id = current_company_id()` on all; `quote_lines`/`clarifications` via parent join.

## 5. AI / MARBIM features
**Extraction (Gemini, `fast`):** `rfqExtractionSchema` (already prototyped as prior art) —
buyer email / pasted text / uploaded PDF (and later photo) → `{ title, buyerCompanyName,
productType, quantity, unit, targetPrice, currency, deadline, description, notes }`.

**Reasoning (Anthropic, `reasoning`):**
- Given an extracted RFQ + the company's cost history, **draft a quotation**: propose
  material/labor/overhead/freight and a target margin, then the **engine computes FOB**, not the model.
- Detect missing specs and draft a clarification email to the buyer.
- Narrate the quote ("margin is 14%, below your 18% floor because fabric is up 6%…").

**The propose → approve → commit loop (concrete):**
1. Merchandiser clicks *New RFQ from document*, uploads the buyer PDF.
2. `/api/extract/rfq` (Gemini) returns a structured draft.
3. Draft is written to `pending_changes` (`module='rfq'`, `action='create'`, `target_table='rfqs'`,
   `payload=<extracted>`, `ai_confidence`, `source='extract'`).
4. It appears in **Approve** and inline as a review card.
5. Approve → server action validates payload against the `rfqs` Zod schema → inserts the real
   `rfqs` row in a transaction → marks change `approved`. Reject → no write.
6. MARBIM then offers "draft a quotation" → same loop into `quotes` + `quote_lines`.

**Deterministic engine (real, not hardcoded):** reuse the existing cost math
(`CreateCostSheetDrawer.tsx:114-142`): `totalCost = material+labor+overhead+freight`,
`fob = totalCost / (1 − margin/100)`. This is "the math is real, the copilot just narrates it."

## 6. Backend wiring
- `src/lib/data/rfqs.ts` — typed CRUD hooks (list/get/create/update) over Supabase, RLS-scoped.
- `src/app/api/extract/rfq/route.ts` — POST text/PDF → Gemini → draft → `pending_changes`.
- Server action `approvePendingChange(id)` — generic; validates + commits by `target_table`.
- Agent tools added to `/api/agent/chat`: `listRfqs`, `getRfq`, `draftQuote(rfqId)`,
  `createRfqDraft(payload)` (writes a pending change, never a direct row).

## 7. Optimization notes
- Split `RFQQuotation.tsx` (309KB) by sub-tab into lazy chunks; drawers already separate.
- PDF text extraction server-side; cap upload size; stream extraction result.
- Cache buyer list for the RFQ form; paginate the inbox.

## 8. UX polish checklist (every screen in this module)
- [ ] **States:** skeleton on inbox/detail load · empty state for a fresh company · extract-in-progress
      indicator · error toast + retry on failed extract/commit · success confirmation on approve.
- [ ] **Controls:** hover / focus-visible / disabled / active on all buttons, drawers, tabs; keyboard reachable.
- [ ] **Hierarchy:** primary CTA = "New RFQ from document"; specs/quote/clarifications behind tabs,
      not one 309KB wall; MARBIM draft shown as a diff-style review card before approve.
- [ ] **Brand:** dark-glass + teal `#57ACAF` / gold `#EAB308` (MARBIM) tokens via CSS vars, no raw hex.
- [ ] **Ask MARBIM:** consolidated to high-value spots (extract RFQ, draft quote, draft clarification),
      each wired to a real pending-change action — remove decorative ones.
- [ ] **Responsive:** inbox table scrolls in its own container; no horizontal body scroll.
- [ ] **Numbers:** FOB/margin/quote figures come from the engine — zero hardcoded quote values.

## 9. Done criteria
- [ ] A new RFQ can be created **only** by uploading/pasting a document and approving the draft.
- [ ] Approving writes a real `rfqs` row scoped to the company; another tenant cannot see it.
- [ ] MARBIM drafts a `quotes` row whose FOB is computed by the engine, editable before approve.
- [ ] Reject leaves no row. Approve inbox reflects both outcomes.
- [ ] Inbox/detail read live data with skeleton/empty/error states; no `localStorage`, no hardcoded figures.
