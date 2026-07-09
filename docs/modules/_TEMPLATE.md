# Module: <Name>

> Wave: <n> · Status: `planned | in-progress | shipped` · Owner file(s): `src/components/pages/<X>.tsx`

## 1. What it is (Gazipur-simple)
One or two plain sentences. Owner value + worker value pair.

## 2. Current state
- Data source today (mock/localStorage/none) with file:line evidence.
- Sub-tabs / screens present.
- What real logic (if any) already exists.

## 3. Target UX changes (keep the aesthetic)
- Density/hierarchy fixes, primary action, empty/loading/error states.
- Owner vs worker view where relevant.

## 4. Data model (Postgres, RLS by company_id)
Tables + key columns. Note foreign keys to shared tables (companies, profiles, buyers…).

## 5. AI / MARBIM features
- Extraction schema (Gemini): what unstructured input → what fields.
- Reasoning tasks (Anthropic): what the copilot drafts/narrates.
- The propose → approve → commit loop for this module (concrete example).
- Any real deterministic engine to compute (not hardcode).

## 6. Backend wiring
- Data hooks replacing `database.tsx`.
- Server actions / API routes.
- Agent tools exposed to `/api/agent/chat`.

## 7. Optimization notes
- File size / split opportunities, query/index notes, caching.

## 8. UX polish checklist (every screen in this module)
- [ ] **States:** loading skeleton · empty state (fresh company) · error toast/retry · success feedback.
- [ ] **Controls:** hover / focus-visible / disabled / active styled; keyboard reachable.
- [ ] **Hierarchy:** one clear primary action; secondary actions de-emphasized; dense data behind
      progressive disclosure (tabs/accordions), not a wall.
- [ ] **Brand:** dark-glass aesthetic + teal `#57ACAF` / gold `#EAB308` tokens via CSS vars (no raw hex).
- [ ] **Ask MARBIM:** placed only where genuinely useful; each wired to a real MARBIM action
      (draft→approve), not decoration; noise/duplicates consolidated.
- [ ] **Responsive:** no horizontal body scroll; tables/wide content scroll in their own container.
- [ ] **Numbers:** every displayed figure comes from real data or a real engine — no hardcoded values.

## 9. Done criteria
Testable bullets that prove the module is real end-to-end.
