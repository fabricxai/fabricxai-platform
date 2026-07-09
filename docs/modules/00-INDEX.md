# Module Index

Every functional module, its current reality, its target data model, its MARBIM story, and
the rollout wave. Full per-module docs are written at the start of each module's wave using
`_TEMPLATE.md`. Status legend: **Partial** = UI done on mock data; **Planned** = UI-only, no data.

## Foundation (Wave 0) — shared, not a feature module
| Piece | Purpose |
|---|---|
| Auth (email confirmation) | Supabase Auth + `@supabase/ssr`; replaces `localStorage` demo session. |
| Tenancy | `companies`, `profiles`, `current_company_id()`, `handle_new_user()` trigger, RLS everywhere. |
| `pending_changes` | The propose→approve→commit spine (see MASTER_PLAN §3). |
| AI layer | Build fresh `models.ts` (fast/reasoning/embed roles), `extract.ts`, agent chat route in this repo. |
| Data hooks | Replace `src/utils/supabase/database.tsx` localStorage layer with real Supabase reads/writes. |
| Design tokens | Centralize brand hex into CSS vars / tokens file. |
| Approve inbox | `Approve.tsx` reads `pending_changes` instead of the static mock. |

## Feature modules
| Module | File | Today | Target tables | MARBIM loop | Wave |
|---|---|---|---|---|---|
| **RFQ & Quotation** ⭐ | `RFQQuotation.tsx` (309KB) | Partial (localStorage + hardcoded quote figures) | `rfqs`, `quotes`, `quote_lines`, `rfq_clarifications` | Upload/paste buyer RFQ → Gemini extract specs → draft RFQ+quote → approve → commit | **1** |
| **Lead Management** | `LeadManagement.tsx` (219KB) | Partial (localStorage CRUD) | `leads`, `campaigns`, `lead_activities` | Paste inbound message → extract lead → score → "next touch" suggestion → approve | 2 |
| **Buyer Management** | `BuyerManagement.tsx` (194KB) | Partial (localStorage CRUD) | `buyers` (ported), `buyer_issues`, `buyer_feedback`, `contracts` | Describe a buyer/issue → draft record → approve; health-score computed | 2 |
| **Costing** | `Costing.tsx` (172KB) | **Shipped math**, save is a stub (`CreateCostSheetDrawer.tsx:154`) | `cost_sheets`, `cost_lines`, `cost_scenarios` | Describe a style's BOM → draft cost sheet → engine computes FOB → approve | 2 |
| **Contacts** | `Contacts.tsx` (22KB) | Partial (pure mock) | view over `buyers`+`suppliers`+contacts | Extract contact from signature/card → approve | 2 |
| **Supplier Evaluation** | `SupplierEvaluation.tsx` (203KB) | Partial (pure mock) | `suppliers` (ported), `supplier_scores`, `supplier_rfqs`, `samples` | Extract supplier from email → scorecard → RFQ board → approve | 3 |
| **Inventory Management** | `InventoryManagement.tsx` (68KB) | Partial (hardcoded "forecast") | `materials`, `stock_ledger`, `warehouses`, `material_requests`, `finished_goods` | Describe a GRN/issue → draft ledger entry → approve; **real reorder/forecast engine** | 3 |
| **Shipment** | `Shipment.tsx` (106KB) | Partial (hardcoded "AI suggestion") | `shipments`, `shipment_docs`, `shipment_events` | Describe a delay → draft buyer update + exception → approve; ETA/OTIF computed | 3 |
| **Production Planning** | `ProductionPlanning.tsx` (198KB) | Partial (localStorage); avg-eff is real | `production_orders`, `lines`, `line_allocations`, `time_action` | Describe floor status → draft plan update → approve; efficiency/risk computed | 4 |
| **Workforce Management** | `WorkforceManagement.tsx` (149KB) | Partial (pure mock) | `workers`, `attendance`, `skills`, `trainings` | Describe attendance/skill event → draft record → approve | 4 |
| **Machine Maintenance** | `MachineMaintenance.tsx` (194KB) | Partial (pure mock) | `machines`, `maintenance_plans`, `breakdowns`, `spare_parts` | Photo/desc of breakdown → draft repair log → approve; **real predictive signal** | 4 |
| **Quality Control** | `QualityControl.tsx` (94KB) | Partial; avg DHU/AQL real, **no AQL engine** (`:322`) | `qc_inspections`, `qc_defects`, `capa`, `standards` | Photo of defect → draft inspection/CAPA → approve; **real ISO-2859 AQL engine** | 5 |
| **Compliance & Policy** | `CompliancePolicy.tsx` (104KB) | Partial (pure mock) | `policies`, `audits`, `audit_findings`, `regulatory_items` | Describe finding → draft CAPA task → approve | 5 |
| **Sustainability** | `Sustainability.tsx` (89KB) | Partial (hardcoded footprint) | `esg_metrics`, `waste_records`, `dpp_passports` | Describe an event → draft metric → approve; **carbon computed from factors** | 5 |
| **Analytics & Reporting** | `Analytics.tsx` (53KB) | Partial (static correlation arrays) | reads all module tables | AI explainer narrates real aggregates; scheduled reports | 6 |
| **Finance** | `Finance.tsx` (99KB) | Partial (pure mock) | `invoices`, `payments`, `lc_records`, per-order P&L view | Describe a payment → draft entry → approve; AR/AP computed | 6 |
| **Dashboards (roles)** | `Dashboard.tsx` (78KB) | Partial (pure mock) | aggregates over module tables | Role KPIs from real data | 6 |

## Cross-cutting (folded into waves)
| Screen | Note |
|---|---|
| **Approve** (`Approve.tsx`) | Wired to `pending_changes` in Wave 0 — the human half of every module's loop. |
| **Module Setup** (`ModuleSetup.tsx`, `moduleConfigs.ts`) | Activation state becomes a real `company_modules` row. |
| **Settings** (`Settings.tsx`) | Account/company/notification prefs persisted; integrations later. |
| **Company Profile** (`CompanyProfile.tsx`) | Company row + catalog table. |
| Legal (`Privacy/Terms`) | Static, no backend. |

## Notes on module count
`moduleConfigs.ts` defines 15 activatable modules; the deck says "one platform, N features."
This index tracks 16 feature screens + 5 cross-cutting. Present as **one platform**, never a count.
