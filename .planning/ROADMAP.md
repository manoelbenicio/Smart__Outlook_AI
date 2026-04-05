# Roadmap: RFP Auto-Diligence Pipeline

**Created:** 2026-04-05
**Milestone:** v1.0 — Automated RFP Diligence
**Granularity:** Standard (7 phases)
**Agent Model:** OPUS 4.6 (Architect) + CODEX (Engineer)

## Overview

| # | Phase | Agent | Goal | Status | Completion |
|---|-------|-------|------|--------|------------|
| 1 | Infrastructure Setup | CODEX + OPUS | SharePoint, Dataverse, connections ready | ✅ COMPLETE | 2026-04-05 |
| 2 | AI Prompt Engineering | OPUS | 4 prompts designed, tested, validated | ✅ COMPLETE | 2026-04-05 |
| 3 | AI Prompt Deployment | CODEX + OPUS | Prompts deployed and verified in AI Builder | ✅ COMPLETE | 2026-04-05 |
| 4 | Flow Development | CODEX | 3 cloud flows deployed and internally tested | 🔄 IN PROGRESS | — |
| 5 | Flow QA & Integration | OPUS + CODEX | Flows verified via browser, bugs fixed | ⏳ NOT STARTED | — |
| 6 | E2E Testing & Accuracy | OPUS + CODEX | 3 real offers tested, ≥85% accuracy confirmed | ⏳ NOT STARTED | — |
| 7 | Copilot Studio Agent | CODEX + OPUS | Agent deployed in Teams, QA passed, GO-LIVE | ⏳ NOT STARTED | — |

---

## Phase Details

### Phase 1: Infrastructure Setup
**Goal:** All foundational infrastructure deployed and verified — SharePoint, Dataverse, connections
**Primary Agent:** CODEX (deploy) → OPUS (verify)

**Requirements:**
- OPUS-01: Design SharePoint site structure
- OPUS-02: Design Dataverse schema
- OPUS-03: Design Word template layout
- CODEX-01: Deploy SharePoint site
- CODEX-02: Create document libraries
- CODEX-03: Deploy Dataverse table rfp_ofertas
- CODEX-04: Deploy Dataverse table rfp_scorecarditem
- CODEX-05: Upload Word template
- CODEX-06: Configure service account connections
- CODEX-07: Configure shared mailbox permissions
- OPUS-11: Browser QA — verify SharePoint
- OPUS-12: Browser QA — verify Dataverse
- OPUS-22: Gate Review 0→1

**Success Criteria:**
1. SharePoint site accessible with 4 libraries and correct permissions
2. Both Dataverse tables created with all columns — verified in maker portal
3. Word template uploaded and content controls validated
4. Service account connections healthy — all 4 connectors green

**Depends on:** None (first phase)
**UI hint:** no

---

### Phase 2: AI Prompt Engineering
**Goal:** All 4 AI Builder prompts designed, tested with sample data, validated for multi-language
**Primary Agent:** OPUS (design + test)

**Requirements:**
- OPUS-06: Design Classify_Offer prompt
- OPUS-07: Design Extract_Fields prompt
- OPUS-08: Design Tech_Practices prompt
- OPUS-09: Design GoNoGo_Score prompt
- OPUS-10: Validate multi-language (PT-BR/ES/EN)

**Success Criteria:**
1. Each prompt produces valid JSON output with correct schema
2. A_VALIDAR used for missing data — zero fabricated fields
3. Temperature set to 0.1 for all prompts
4. All 4 prompts tested with 3 sample documents each
5. PT-BR, ES, and EN documents processed correctly

**Depends on:** Phase 1 (needs SharePoint sample data)
**UI hint:** no

---

### Phase 3: AI Prompt Deployment
**Goal:** All 4 prompts deployed in AI Builder and verified in studio
**Primary Agent:** CODEX (deploy) → OPUS (verify)

**Requirements:**
- CODEX-08: Deploy Classify_Offer
- CODEX-09: Deploy Extract_Fields
- CODEX-10: Deploy Tech_Practices
- CODEX-11: Deploy GoNoGo_Score
- CODEX-12: Test with 3 sample docs
- OPUS-13: Browser QA — verify AI Builder prompts

**Success Criteria:**
1. All 4 prompts accessible in AI Builder studio
2. Each prompt tested successfully with 3 different documents
3. JSON output validates against expected schema

**Depends on:** Phase 2 (needs prompt designs)
**UI hint:** no

---

### Phase 4: Flow Development
**Goal:** All 3 Power Automate cloud flows deployed and internally tested
**Primary Agent:** CODEX (deploy) + OPUS (design templates)

**Requirements:**
- OPUS-04: Design HTML email template
- OPUS-05: Design Teams Adaptive Card schema
- CODEX-13: Deploy Flow 1 (Email Intake)
- CODEX-14: Flow 1 creates per-offer folder
- CODEX-15: Flow 1 saves body + attachments
- CODEX-16: Flow 1 creates Dataverse record
- CODEX-17: Flow 1 calls child Flow 2
- CODEX-18: Deploy Flow 2 (Processing Pipeline)
- CODEX-19: Flow 2 text extraction + raw_extract
- CODEX-20: Flow 2 calls 4 AI prompts
- CODEX-21: Flow 2 updates Dataverse
- CODEX-22: Flow 2 error handling
- CODEX-23: Flow 2 calls child Flow 3
- CODEX-24: Deploy Flow 3 (Report Generation)
- CODEX-25: Flow 3 email with PDF
- CODEX-26: Flow 3 Teams Adaptive Card
- CODEX-27: Flow 3 updates status COMPLETED

**Success Criteria:**
1. Flow 1 triggers on test email in Ofertas DN
2. Flow 2 processes document and produces Dataverse records with scores
3. Flow 3 generates PDF report and sends email
4. All Dataverse records have correct status transitions (RECEIVED → SCORED → COMPLETED)
5. Error handling captures failures gracefully (PARSE_ERROR status)

**Depends on:** Phase 3 (needs deployed AI prompts), Phase 1 (needs SharePoint + Dataverse)
**UI hint:** no

---

### Phase 5: Flow QA & Integration
**Goal:** All flows verified via browser QA, bugs identified and fixed
**Primary Agent:** OPUS (QA) → CODEX (fix)

**Requirements:**
- OPUS-14: Browser QA — Flow 1 trigger
- OPUS-15: Browser QA — Flow 2 processing
- OPUS-16: Browser QA — Flow 3 report
- CODEX-35: Bug fixes from browser QA
- OPUS-23: Gate Review 1→2

**Success Criteria:**
1. OPUS confirms all 3 flows execute correctly in browser
2. All bugs found during QA resolved by CODEX
3. SharePoint folder structure correct (Input/Extracted/Output)
4. Gate Review 1→2 passed — MANOEL approves for E2E testing

**Depends on:** Phase 4 (needs deployed flows)
**UI hint:** no

---

### Phase 6: E2E Testing & Accuracy
**Goal:** System validated with 3 real offers, accuracy ≥ 85% confirmed
**Primary Agent:** OPUS (E2E + analysis) + CODEX (auto tests + fixes)

**Requirements:**
- OPUS-18: E2E test offer #1 (standard)
- OPUS-19: E2E test offer #2 (ZIP format)
- OPUS-20: E2E test offer #3 (edge case)
- OPUS-21: Accuracy comparison (AI vs manual ≥ 85%)
- CODEX-32: Automated test — Dataverse validation
- CODEX-33: Automated test — SharePoint files
- CODEX-34: Automated test — email delivery
- OPUS-24: Gate Review 2→3

**Success Criteria:**
1. 3 real offers processed end-to-end, reports delivered in ≤ 30 minutes each
2. Accuracy ≥ 85% for field extraction (compared to manual)
3. A_VALIDAR correctly flagged for all genuinely missing data
4. Automated tests pass (Dataverse, SharePoint, email)
5. Gate Review 2→3 passed — MANOEL approves for Agent phase

**Depends on:** Phase 5 (needs QA-passed flows)
**UI hint:** no

---

### Phase 7: Copilot Studio Agent
**Goal:** Conversational agent deployed in Teams, all topics working, GO-LIVE approved
**Primary Agent:** CODEX (deploy) → OPUS (QA) → MANOEL (GO-LIVE)

**Requirements:**
- CODEX-28: Create Agent in Copilot Studio
- CODEX-29: Topic "Check Status"
- CODEX-30: Topic "List Active"
- CODEX-31: Topic "Ask About RFP"
- OPUS-17: Browser QA — Agent in Teams
- OPUS-25: Gate Review 3→PROD

**Success Criteria:**
1. Agent accessible in Teams for Architecture team
2. "Check Status" returns correct offer info
3. "List Active" returns correct active offers list
4. "Ask About RFP" answers natural language questions from stored data
5. Gate Review 3→PROD passed — MANOEL approves GO-LIVE

**Depends on:** Phase 6 (needs validated data in Dataverse/SharePoint)
**UI hint:** no

---

## Milestone Summary

| Metric | Value |
|---|---|
| **Total phases** | 7 |
| **OPUS requirements** | 25 |
| **CODEX requirements** | 35 |
| **Total requirements** | 60 |
| **Gate reviews** | 4 (OPUS-22..25) |
| **E2E tests** | 3 (offers #1, #2, #3) |
| **Target timeline** | 4 sprints |

---
*Roadmap created: 2026-04-05*
*Last updated: 2026-04-05 — Phases 1-3 complete, Phase 4 in progress*
