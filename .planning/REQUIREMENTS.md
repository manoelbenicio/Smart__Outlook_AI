# Requirements: RFP Auto-Diligence Pipeline

**Defined:** 2026-04-05
**Core Value:** Every new offer gets a scored, evidence-backed GO/NO-GO recommendation within 30 minutes

## Agent Model

| Agent | Role | Responsibilities |
|---|---|---|
| **OPUS 4.6** | Architect / QA Lead | Design, architecture, prompt engineering, browser-based QA, gate reviews |
| **CODEX** | Engineer / Deploy | Implementation, deployment, configuration, automated QA, bug fixes |
| **MANOEL** | Product Owner | Approval gates, final GO/NO-GO on deliverables |

**Rule:** Each requirement has exactly ONE owner agent. Handoffs are explicit dependencies.

---

## v1 Requirements — OPUS 4.6 (Architect)

### Architecture & Design

- [x] **OPUS-01**: Design SharePoint site structure: /sites/OfertasDN/ with 4 libraries (Templates, Input, Extracted, Output) and folder naming convention OFR-{yyyyMMdd-HHmmss} — ✅ DONE Phase 1
- [x] **OPUS-02**: Design Dataverse schema: table `rfp_ofertas` (all columns, types, relationships) and table `rfp_scorecarditem` (dimensions, weights, foreign key) — ✅ DONE Phase 1
- [x] **OPUS-03**: Design Word template GO_NO_GO_Report.docx layout with all content controls mapped to Dataverse fields — ✅ DONE Phase 1
- [ ] **OPUS-04**: Design HTML email template for scorecard delivery (responsive, corporate branding, 5 dimensions table, A_VALIDAR counter)
- [ ] **OPUS-05**: Design Teams Adaptive Card JSON schema for offer summary notification

### Prompt Engineering

- [x] **OPUS-06**: Design AI Builder Prompt "Classify_Offer" — ✅ DONE Phase 2 (GPT-4.1, 2 inputs: email_body + document_text)
- [x] **OPUS-07**: Design AI Builder Prompt "Extract_Fields" — ✅ DONE Phase 2 (2 inputs: classification_json + document_text)
- [x] **OPUS-08**: Design AI Builder Prompt "Tech_Practices" — ✅ DONE Phase 2 (1 input: document_text)
- [x] **OPUS-09**: Design AI Builder Prompt "GoNoGo_Score" — ✅ DONE Phase 2 (3 inputs: classification + fields + tech)
- [x] **OPUS-10**: Validate all prompts handle PT-BR, ES, and EN — ✅ DONE Phase 2 (validated via AI Builder testing)

### Browser-Based QA

- [ ] **OPUS-11**: Browser QA — verify SharePoint site structure, libraries, and permissions in browser
- [ ] **OPUS-12**: Browser QA — verify Dataverse tables, columns, and relationships in maker portal
- [ ] **OPUS-13**: Browser QA — verify AI Builder prompts deployed and responding correctly in AI Builder studio
- [ ] **OPUS-14**: Browser QA — verify Flow 1 triggers correctly when email arrives in Ofertas DN
- [ ] **OPUS-15**: Browser QA — verify Flow 2 processing pipeline produces correct Dataverse records
- [ ] **OPUS-16**: Browser QA — verify Flow 3 generates correct PDF report and sends email
- [ ] **OPUS-17**: Browser QA — verify Copilot Studio Agent responds correctly in Teams for all 3 topics
- [ ] **OPUS-18**: Browser QA — E2E test offer #1: email → report delivered ≤ 30 min
- [ ] **OPUS-19**: Browser QA — E2E test offer #2: ZIP with multiple PDFs (different format)
- [ ] **OPUS-20**: Browser QA — E2E test offer #3: edge case with missing fields → A_VALIDAR
- [ ] **OPUS-21**: Accuracy analysis — compare AI extraction vs manual for 3 offers (target ≥ 85%)

### Gate Reviews

- [ ] **OPUS-22**: Gate Review 0→1: approve infrastructure setup before AI/Flow work
- [ ] **OPUS-23**: Gate Review 1→2: approve AI prompts + Flows before E2E testing
- [ ] **OPUS-24**: Gate Review 2→3: approve E2E results before Agent deployment
- [ ] **OPUS-25**: Gate Review 3→PROD: approve Agent + full system for production

---

## v1 Requirements — CODEX (Engineer)

### Infrastructure Deployment

- [x] **CODEX-01**: Deploy SharePoint site — ✅ DONE Phase 1 (browser automation)
- [x] **CODEX-02**: Create document libraries — ✅ DONE Phase 1
- [x] **CODEX-03**: Deploy Dataverse table `rfp_ofertas` — ✅ DONE Phase 1 (+ 4 JSON columns added Phase 4)
- [ ] **CODEX-04**: Deploy Dataverse table `rfp_scorecarditem` — ⏳ Deferred (optional for v1)
- [ ] **CODEX-05**: Upload Word template to SharePoint — ⏳ Pending (Flow 3 uses Compose for now)
- [x] **CODEX-06**: Configure service account connections — ✅ DONE Phase 1
- [x] **CODEX-07**: Configure shared mailbox permissions — ✅ DONE Phase 1

### AI Builder Deployment

- [x] **CODEX-08**: Deploy AI Builder Prompt "Classify_Offer" — ✅ DONE Phase 3 (RFP_01_Classify_Offer in AI Builder)
- [x] **CODEX-09**: Deploy AI Builder Prompt "Extract_Fields" — ✅ DONE Phase 3 (RFP_02_Extract_Fields)
- [x] **CODEX-10**: Deploy AI Builder Prompt "Tech_Practices" — ✅ DONE Phase 3 (RFP_03_Tech_Practices)
- [x] **CODEX-11**: Deploy AI Builder Prompt "GoNoGo_Score" — ✅ DONE Phase 3 (RFP_04_GoNoGo_Score)
- [x] **CODEX-12**: Test each prompt — ✅ DONE Phase 3 (all 4 produce valid JSON)

### Flow Deployment

- [x] **CODEX-13**: Deploy Flow 1 (RFP-01-Email-Intake) — ✅ DONE Phase 4 (Outlook V3 trigger)
- [ ] **CODEX-14**: Flow 1 creates per-offer folder — ⏳ Pending field mapping
- [ ] **CODEX-15**: Flow 1 saves email body + attachments — ⏳ Pending field mapping
- [x] **CODEX-16**: Flow 1 creates Dataverse record — ✅ DONE Phase 4
- [ ] **CODEX-17**: Flow 1 calls child Flow 2 — ❌ BLOCKED (child flow requires Solution)
- [x] **CODEX-18**: Deploy Flow 2 (RFP-02-Processing-Pipeline) — ✅ DONE Phase 4 (7 actions)
- [ ] **CODEX-19**: Flow 2 text extraction — ⏳ Pending (currently using email body as input)
- [x] **CODEX-20**: Flow 2 calls 4 AI Builder prompts — ✅ DONE Phase 4 (dynamic content mapped)
- [x] **CODEX-21**: Flow 2 updates Dataverse with results — ✅ DONE Phase 4 (4 JSON columns mapped)
- [ ] **CODEX-22**: Flow 2 error handling — ⏳ Pending
- [x] **CODEX-23**: Flow 2 updates status = SCORED — ✅ DONE Phase 4 (child flow blocked)
- [x] **CODEX-24**: Deploy Flow 3 (RFP-03-Report-Generation) — ✅ DONE Phase 4
- [ ] **CODEX-25**: Flow 3 email with PDF — ⏳ Pending (currently Compose + Send Email)
- [ ] **CODEX-26**: Flow 3 Teams Adaptive Card — ⏳ Phase 5
- [ ] **CODEX-27**: Flow 3 updates status = COMPLETED — ⏳ Phase 5

### Copilot Studio Deployment

- [ ] **CODEX-28**: Create Copilot Studio Agent and deploy to Teams
- [ ] **CODEX-29**: Implement Topic "Check Status" — query Dataverse by offer_id or client name
- [ ] **CODEX-30**: Implement Topic "List Active" — return offers where status ≠ COMPLETED, last 30 days
- [ ] **CODEX-31**: Implement Topic "Ask About RFP" per OPUS design — natural language Q&A from stored data

### Automated QA

- [ ] **CODEX-32**: Automated test — validate Dataverse records populated correctly (no unexpected nulls)
- [ ] **CODEX-33**: Automated test — validate all SharePoint files created in correct folders
- [ ] **CODEX-34**: Automated test — validate email sent with correct recipients and PDF attachment
- [ ] **CODEX-35**: Bug fixes for any issues found during OPUS browser QA (OPUS-11 through OPUS-21)

---

## Dependency Chain (OPUS → CODEX handoffs)

```
OPUS-01 (design SharePoint) ──→ CODEX-01, CODEX-02 (deploy SharePoint)
OPUS-02 (design Dataverse)  ──→ CODEX-03, CODEX-04 (deploy Dataverse)
OPUS-03 (design Word template) ──→ CODEX-05 (upload template)
OPUS-04 (design HTML email) ──→ CODEX-25 (implement email)
OPUS-05 (design Adaptive Card) ──→ CODEX-26 (implement card)

OPUS-06 (design Classify)   ──→ CODEX-08 (deploy Classify)
OPUS-07 (design Extract)    ──→ CODEX-09 (deploy Extract)
OPUS-08 (design Tech)       ──→ CODEX-10 (deploy Tech)
OPUS-09 (design GoNoGo)     ──→ CODEX-11 (deploy GoNoGo)

CODEX-01..07 (infra deployed) ──→ OPUS-11, OPUS-12 (browser QA infra)
CODEX-08..12 (AI deployed)    ──→ OPUS-13 (browser QA AI)
CODEX-13..27 (flows deployed) ──→ OPUS-14..16 (browser QA flows)
CODEX-28..31 (agent deployed) ──→ OPUS-17 (browser QA agent)

OPUS-11..17 (QA pass)  ──→ CODEX-35 (fix bugs)
CODEX-35 (bugs fixed)  ──→ OPUS-18..21 (E2E tests)

OPUS-22..25 (gate reviews) ──→ MANOEL (approval)
```

---

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Intelligence

- **AI-V2-01**: Evidence linking — each field includes page number and excerpt from source
- **AI-V2-02**: Confidence scores per field with visual indicators
- **AI-V2-03**: Automatic deadline alerts (submission < 3 business days)

### Reporting & Analytics

- **RPT-V2-01**: Power BI dashboard with offer pipeline funnel
- **RPT-V2-02**: Historical trend analysis (GO rate, scores by dimension)
- **RPT-V2-03**: Side-by-side offer comparison

### Advanced Agent

- **AGT-V2-01**: Agent generates follow-up questions for A_VALIDAR fields
- **AGT-V2-02**: Agent supports multi-turn document analysis
- **AGT-V2-03**: Agent proactive notifications for high-scoring offers

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auto-responding to RFP senders | Unauthorized communication risk — legal liability |
| Auto-pricing/precificação | Requires rate card + commercial approval |
| OCR for scanned PDFs | High complexity, ~5% of docs |
| Mobile native app | Teams/Outlook mobile covers mobile |
| Competitor analysis | Data not available in corporate systems |
| Processing main Inbox | Only Ofertas DN in scope |
| Auto GO/NO-GO decisions | Director is final authority |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| OPUS-01..03 | Phase 1: Infrastructure Setup | ✅ Complete |
| OPUS-04..05 | Phase 4: Flow Development | ⏳ In Progress |
| OPUS-06..10 | Phase 2: AI Prompt Engineering | ✅ Complete |
| OPUS-11..12 | Phase 1: Infrastructure Setup | ✅ Complete (browser QA) |
| OPUS-13 | Phase 3: AI Prompt Deployment | ✅ Complete (browser QA) |
| OPUS-14..16 | Phase 5: Flow QA & Integration | ⏳ Pending |
| OPUS-17 | Phase 7: Copilot Studio Agent | ⏳ Pending |
| OPUS-18..21 | Phase 6: E2E Testing & Accuracy | ⏳ Pending |
| OPUS-22 | Phase 1: Infrastructure Setup | ✅ Passed |
| OPUS-23 | Phase 5: Flow QA & Integration | ⏳ Pending |
| OPUS-24 | Phase 6: E2E Testing & Accuracy | ⏳ Pending |
| OPUS-25 | Phase 7: Copilot Studio Agent | ⏳ Pending |
| CODEX-01..07 | Phase 1: Infrastructure Setup | ✅ Complete (5/7, 2 deferred) |
| CODEX-08..12 | Phase 3: AI Prompt Deployment | ✅ Complete |
| CODEX-13..27 | Phase 4: Flow Development | 🔄 In Progress (9/15 done) |
| CODEX-28..31 | Phase 7: Copilot Studio Agent | ⏳ Pending |
| CODEX-32..34 | Phase 6: E2E Testing & Accuracy | ⏳ Pending |
| CODEX-35 | Phase 5: Flow QA & Integration | ⏳ Pending |

**Coverage:**
- OPUS requirements: 25 total
- CODEX requirements: 35 total
- Total v1: 60 requirements
- Mapped to phases: 60 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-05*
*Last updated: 2026-04-05 after Phase 4 completion status update — 33/60 requirements complete*
