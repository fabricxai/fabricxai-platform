# fabricXai — Positioning Deck Design Brief (paste-ready for Claude Design)

> **How to use.** Copy everything inside the fenced block below into Claude Design. It is
> self-contained. Every slide's content is grounded in `docs/CAPABILITY_INVENTORY.md` (Phase A);
> features are tagged **[shipped]** or **[roadmap]** so the deck never overclaims.
>
> **Brand values:** the repo has **no `BRAND.md`**, so the exact values specified by the product owner
> (below) are treated as canonical. **Real logo assets live in this repo** — point the design at them:
> - Full wordmark + "Woven X" mark (light, for dark slides): `public/assets/e5bbcfaaf08b208473c04b5ae611365f951076ab.png`
> - Standalone "Woven X" mark: `public/assets/6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png`
>
> **One honesty note that overrides the arc:** in the actual code the only *tested deterministic
> engine* is the **costing / FOB math** (`FOB = totalCost ÷ (1 − margin%)`, real inputs). A full **AQL
> accept/reject sampling engine is NOT built** — AQL appears as reference standards + averages only. So
> the "fixed rules" slide uses **costing as the shipped proof** and frames **automated AQL sampling as
> roadmap**. This keeps the deck truthful; the fenced prompt below already does this.

---

```
You are designing a POSITIONING PRESENTATION DECK (16:9) for a product called fabricXai. Produce both
the slide visuals and the written copy. Target 10–13 slides. Follow every rule below exactly — the
copy rules and the shipped-vs-roadmap tags are non-negotiable.

═══════════════════════════════════════════════════════════════════════
OBJECTIVE & AUDIENCE
═══════════════════════════════════════════════════════════════════════
fabricXai is ONE integrated, AI-powered ERP for garment factories — and it can also be deployed as an
intelligence layer on top of a factory's existing ERP. Same experience either way.

Primary audience: owners and managers of mid-size garment factories (100–1,000 workers) and buying
houses across Bangladesh, Vietnam, India, Turkey, and Cambodia. Goal of the deck: book a demo /
recruit a "founding factory."

AUDIENCE TOGGLE — design TWO switchable variants of the same deck:
• CUSTOMER / PARTNER variant (default): the copy rules below are STRICT. No internal terms, no
  market-size or financial slides, no jargon.
• INVESTOR variant: may add market-size, business-model, and "where we are" financial slides, and may
  use internal terminology in those added slides only. The core story slides stay identical.
Make the toggle explicit (e.g., a slide-set flag); never leak investor-only content into the customer
variant.

═══════════════════════════════════════════════════════════════════════
VISUAL SYSTEM (use these exact values)
═══════════════════════════════════════════════════════════════════════
Dark theme ONLY. Never a light background.
• Background: #101725
• Card / panel surfaces: #182336 and #1D2A40
• Dividers / hairlines: #243350
Accents:
• Aqua #57ACAF — primary accent (structure, highlights, active states)
• Yellow #EAB308 — exactly ONE focal point per slide, and CTAs. Never more than one yellow moment.
Text:
• Headings: white #FFFFFF
• Body: #C7D2E2
• Secondary / captions: #6F83A7
Type (nothing else):
• Sora 800 — headings
• DM Sans — body
• JetBrains Mono — metrics, identifiers, URLs, email addresses
Icons: Lucide stroke icons ONLY, 2px stroke, currentColor. Never emoji. Never raster/clip-art.
Logo: the fabricXai wordmark with the "Woven X" mark; use the LIGHT logo on the dark slides (asset:
e5bbcfaaf08b208473c04b5ae611365f951076ab.png; standalone mark:
6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png).
Layout: engineered, calm, generous negative space. ONE focal point per slide. WCAG 2.1 AA contrast
on every text/background pair. Charts (investor variant) use #57ACAF / #EAB308 / #6F83A7 on dark.

═══════════════════════════════════════════════════════════════════════
COPY RULES (non-negotiable, apply to every customer-facing slide)
═══════════════════════════════════════════════════════════════════════
1. Brand name is always "fabricXai". Use "FabricXai" ONLY at the start of a sentence or heading. Never
   "FabricXAI", "fabricxai" (except in the URL/email), "Fabric XAI", or any other variant.
2. BANNED WORDS on customer-facing slides: "agent", "AI agent", "LLM", "orchestration",
   "orchestrator", "MARBIM". Call the AI helpers "copilot". Call the coordinating brain "one integrated
   system" or "one factory brain" — never by any internal/product-internal name.
3. THE GAZIPUR TEST: every line must be instantly clear to a garment-factory owner in Gazipur. Short
   sentences. Plain words. No ERP jargon, no tech-stack talk.
4. Show "AI proposes, you approve" as a LITERAL UI BEHAVIOUR, not a slogan: the copilot drafts an entry
   or action and the person taps Approve/Reject. Depict a real approval card (see slide 6/8).
5. Include the exact phrase "Your data stays yours." Support it with the real approach: each factory's
   data is walled off from every other factory (tenant-level data isolation), and each person only sees
   what their role allows (role-based access). Use OWNED terms only — "factory-first architecture",
   "tenant-level data isolation". Never borrow other companies' brand/security terms.
6. NO FABRICATED PROOF. fabricXai is pre-launch — say so plainly. No invented testimonials, customer
   logos, certifications, awards, or metrics. Any number must be a clearly LABELED modeled estimate, or
   framed as "what we measure", never presented as an achieved result.
7. Body copy under ~35 words per slide. One idea per slide.

═══════════════════════════════════════════════════════════════════════
GROUNDING: WHAT IS REAL vs ON THE ROADMAP (use these tags to stay honest)
═══════════════════════════════════════════════════════════════════════
The integrated platform and its screens are REAL and demonstrable. The live AI intelligence and the
external-ERP connectors are the ROADMAP. Tag features accordingly; when a slide shows a roadmap item,
frame it as "coming / what we're building", not as done.

[shipped] One integrated web app: single shell, one sidebar, one login, one copilot surface, role-based
          dashboards, and a unified Approve inbox.
[shipped] The feature set across the whole factory (group as ONE system — see slide 7):
          • Sales & Orders — Lead Management, Buyer Management, RFQ & Quotation, Contacts
          • Costing & Finance — Costing (garment cost sheets with automatic FOB pricing), Finance
            (AR/AP, per-order P&L, cash flow, banking & LCs)
          • Supply Chain — Supplier Evaluation, Inventory Management, Shipment (booking, live tracking,
            document vault, buyer updates, exceptions)
          • Production & People — Production Planning (master plan, line allocation, Time & Action
            calendar), Workforce Management, Machine Maintenance
          • Quality & Compliance — Quality Control (inline QC, final QC, CAPA, standards), Compliance &
            Policy, Sustainability (ESG, Digital Product Passport)
          • Intelligence — Analytics & Reporting, role dashboards
[shipped] Deterministic, tested costing math: the cost sheet computes FOB from real inputs —
          FOB = Total Cost ÷ (1 − Margin%). Use THIS as the "the math is fixed code, the copilot just
          explains it" proof.
[shipped] "AI proposes, you approve" as a UI pattern: the app has an Ask-the-copilot panel and an
          Approve inbox where items carry a score and an approval chain. The interaction/approval loop
          is designed and demonstrable.
[shipped] Trust model in code: role-based access (11 roles — e.g. owner/admin, manager, production,
          quality, finance, HR, viewer — with create/read/update/delete/approve/export permissions) and
          per-factory data isolation (every record walled off per company). Basis for "Your data stays
          yours."
[shipped] Guided activation: switch on the features you need through a simple setup flow; adopt at your
          own pace.
[roadmap] Live copilot intelligence: today the copilot experience is demonstrated; connecting it to
          your live factory data is what we're building. Frame as roadmap.
[roadmap] "Layer on top of your existing ERP": import from Excel/CSV/CRM, read PDF contracts & RFQs,
          capture WhatsApp/email — the connectors are on the roadmap. Frame Panel B (slide 5) as
          roadmap, not shipped.
[roadmap] Automated AQL sampling / accept-reject engine, demand forecasting, machine breakdown
          prediction: on the roadmap. (Do NOT claim AQL auto-accept/reject is built. Quality standards
          and defect tracking exist; automated AQL sampling is coming.)

═══════════════════════════════════════════════════════════════════════
SLIDE ARC (10 core slides; add feature/roadmap slides as the set needs — max ~13)
═══════════════════════════════════════════════════════════════════════
1. COVER — light fabricXai wordmark + "Woven X" mark on #101725. Headline (Sora 800):
   "An ERP for your factory that runs itself." Sub (DM Sans, #C7D2E2):
   "fabricXai — The Garment Operating System." One quiet aqua motif. No other text.

2. THE REALITY TODAY — factories run on Excel + WhatsApp; information is scattered, late, and in
   people's heads. Nothing lives in one place. Plain, relatable, a little uncomfortable. One focal
   visual (scattered notes → nothing joined up).

3. THE REAL PROBLEM (key slide) — "An ERP is only as good as the data people put into it." Then the
   turn: the people who know what happened on the floor are not the people trained to operate ERP
   software. Give this slide the most space; it is the whole thesis. Yellow focal point on the gap.

4. THE IDEA — one integrated ERP you can just talk to. A person describes what happened in plain words;
   the system does the software work. Introduce the loop as a clean 3-step motif:
   DESCRIBE IT → THE SYSTEM DRAFTS IT → YOU APPROVE. This motif recurs in the deck.

5. TWO WAYS TO START — two panels, "same experience either way":
   • Panel A [shipped]: the full integrated Garment Operating System — for factories with no ERP.
   • Panel B [roadmap]: the intelligence layer on top of your existing ERP — reads your current data,
     adds the talk-to-it + approve layer on top. Label Panel B as "on our roadmap".

6. HOW IT WORKS — the literal "AI proposes, you approve" flow. Show a real approval card: left, a
   person's plain sentence ("Line 2 had broken stitches today, defects up"); right, the drafted ERP
   entry + a recommendation, with [Approve] and [Edit] buttons ([Approve] in yellow). Add one line:
   the fixed rules are tested code the copilot only explains — e.g. the cost sheet's FOB price is
   computed by the system (FOB = Total Cost ÷ (1 − Margin%)), not guessed. [Automated AQL sampling:
   roadmap — don't imply it's live.]

7. WHAT THE PLATFORM DOES — the integrated feature set as features of ONE system, grouped into the six
   families listed under [shipped] above. A single app shell with the families around one core — NOT a
   22-product grid, NOT separate logos. One Lucide icon per family, 2px stroke. Caption: "One login.
   One copilot. One source of truth."

8. A DAY ON THE FLOOR (optional 8th, recommended) — 3 quick micro-moments, each = a worker's plain
   words → the drafted entry they approve. Reuse the loop motif small. Keep each moment under ~15
   words. Grounds slide 6 in daily reality.

9. BUILT TO BE TRUSTED — three plain promises: (a) "Your data stays yours." — each factory's data is
   walled off (tenant-level data isolation) and each person sees only what their role allows;
   (b) the copilot proposes, you always approve; (c) no inflated claims — we show what's real. Owned
   security terms only.

10. WHERE WE ARE TODAY — honest pre-launch status. Two short columns: "Working today" (the integrated
    platform, the feature set, the approve flow, the costing math, the trust model) vs "On the roadmap"
    (live copilot on your data, connectors to your existing ERP, automated AQL/forecasting). Say plainly
    that fabricXai is pre-launch and recruiting founding factories in Gazipur. No fake metrics.

11. THE INVITATION — "Become a founding factory." CTA in yellow: "Book a demo." Contact in JetBrains
    Mono: hello@fabricxai.com · fabricxai.com. Close on the light wordmark + the 3-step loop motif.

(INVESTOR VARIANT ONLY — insert after slide 10, never in the customer deck: a market slide
[garment-manufacturing digitization in BD/VN/IN/TR/KH, as clearly labeled modeled estimates], a
business-model slide [tiered activation: Basic / Growth / Enterprise], and a traction/roadmap slide.
All numbers labeled as modeled estimates — no fabricated results.)

═══════════════════════════════════════════════════════════════════════
WHAT TO AVOID (hard constraints)
═══════════════════════════════════════════════════════════════════════
• No emoji anywhere. • None of the banned words on customer slides (agent, AI agent, LLM,
orchestration, orchestrator, MARBIM). • No fabricated proof — no fake testimonials, logos, certs, or
metrics. • No light backgrounds. • No fonts other than Sora / DM Sans / JetBrains Mono. • No raster or
clip-art icons — Lucide 2px strokes only. • Do NOT explain the tech stack to factory owners. • One idea
per slide; body copy under ~35 words. • Never present a roadmap item as shipped. • Never more than one
yellow focal point per slide.

DELIVERABLE: a cohesive dark, engineered 10–13 slide deck (customer variant) with the investor variant
as an add-on slide set; the DESCRIBE → DRAFT → APPROVE loop as a recurring motif; yellow reserved for
one focal point + CTAs; every feature claim tagged in your own mind as shipped or roadmap and worded
accordingly; and copy that passes the Gazipur test on every line.
```

---

### Honesty anchor — how each slide maps to Phase A (`docs/CAPABILITY_INVENTORY.md`)

| Slide | Claim | Phase A status |
|---|---|---|
| 3 The real problem | Data-entry gap thesis | Framing, not a product claim — safe |
| 4 The idea | Talk-to-it ERP, describe→draft→approve | Loop **shipped as UX**; live AI intelligence tagged **roadmap** |
| 5 Panel A | Full integrated Garment OS | **Shipped** (integrated app, all feature families) |
| 5 Panel B | Layer on existing ERP | **Roadmap** — labeled as such (connectors are import copy + diagram only) |
| 6 How it works | AI proposes, you approve | **Shipped** UI pattern (Ask panel + Approve inbox with score/chain) |
| 6 Fixed-rule proof | FOB = Total Cost ÷ (1 − Margin%) | **Shipped**, real formula (`CreateCostSheetDrawer.tsx`). AQL auto-sampling = **roadmap** (do not claim built) |
| 7 What it does | Six feature families of ONE system | **Shipped** UI across 15 modules; grouped, not a 22-grid |
| 9 Trust | "Your data stays yours" + roles | **Shipped in code** — 11-role RBAC + per-`companyId` tenant isolation |
| 10 Where we are | Pre-launch; shipped vs roadmap | Matches inventory exactly; no invented metrics |

Two small truth-guards I built into the prompt, worth knowing:
- **AQL** — your arc paired "AQL, costing" as tested code. Costing/FOB is genuinely tested; a full AQL accept/reject engine is **not** in the code (only standards + averages). The prompt uses **costing as the shipped proof** and marks **automated AQL as roadmap** so the deck stays defensible in a demo.
- **"Layer on top of existing ERP"** — real in vision, but the connectors don't exist yet, so Panel B on slide 5 is explicitly labeled roadmap.

Saved to `docs/POSITIONING_DECK_DESIGN_BRIEF.md`. Copy the fenced block into Claude Design; the logo asset paths and exact brand values are already embedded.

