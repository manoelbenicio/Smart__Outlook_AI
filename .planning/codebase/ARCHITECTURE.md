# Architecture — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual deployed architecture

## Current Pattern
**Cloud-native serverless** — 100% Microsoft Power Platform. No custom code in production.

## Production Architecture (Deployed)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    POWER PLATFORM — ColOfertasBrasilPro             │
│                    Environment: e2d10003-4d8e-e007-9d63-76d5fe89ef56│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐ │
│  │  Outlook     │────→│ RFP-01-Email-    │────→│ SharePoint       │ │
│  │  Ofertas DN  │     │ Intake (Flow 1)  │     │ /Input/{offer}/  │ │
│  └─────────────┘     └──────────────────┘     └──────────────────┘ │
│                              │                                       │
│                              ▼                                       │
│                       ┌──────────────────┐                          │
│                       │ Dataverse         │                          │
│                       │ rfp_ofertas       │                          │
│                       │ (cr8b2_rfpofertases)│                        │
│                       └──────────────────┘                          │
│                              │                                       │
│                              ▼                                       │
│                       ┌──────────────────┐                          │
│                       │ RFP-02-Processing│                          │
│                       │ Pipeline (Flow 2)│                          │
│                       │                  │                          │
│                       │ 4x AI Builder:   │                          │
│                       │  ├─ Classify     │                          │
│                       │  ├─ Extract      │                          │
│                       │  ├─ Tech         │                          │
│                       │  └─ GoNoGo       │                          │
│                       └──────────────────┘                          │
│                              │                                       │
│                              ▼                                       │
│                       ┌──────────────────┐     ┌──────────────────┐ │
│                       │ RFP-03-Report-   │────→│ Email Report     │ │
│                       │ Generation       │     │ + Teams Card     │ │
│                       │ (Flow 3)         │     │ (Adaptive Card)  │ │
│                       └──────────────────┘     └──────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ AI Builder — GPT-4.1 (Temperature 0.1, JSON-only output)      │ │
│  │  ├─ RFP_01_Classify_Offer    (2 inputs: email_body, doc_text) │ │
│  │  ├─ RFP_02_Extract_Fields    (2 inputs: classification, text) │ │
│  │  ├─ RFP_03_Tech_Practices    (1 input: document_text)        │ │
│  │  └─ RFP_04_GoNoGo_Score      (3 inputs: class+fields+tech)   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Future: Copilot Studio Agent (Teams) — Phase 7                 │ │
│  │  ├─ Topic: Check Status    (Dataverse query)                  │ │
│  │  ├─ Topic: List Active     (Dataverse filter)                 │ │
│  │  └─ Topic: Ask About RFP   (NL Q&A from stored data)         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Power Automate Flows (Production — Phase 4)
- **RFP-01-Email-Intake** — Outlook V3 trigger → SharePoint save → Dataverse create → calls Flow 2
- **RFP-02-Processing-Pipeline** — Manual trigger → 4x AI Builder prompts → Dataverse update with scores
- **RFP-03-Report-Generation** — Trigger (TBD: manual or Dataverse) → Get Row → Compose Report → Send Email

### 2. AI Builder Prompts (Production — Phase 3)
- 4 custom prompts deployed in AI Builder studio
- All using GPT-4.1, Temperature 0.1, JSON-only output
- Each prompt has defined input parameters and structured JSON output schema
- Princípio Zero enforced: A_VALIDAR for missing data, never fabricated

### 3. Dataverse (Production — Phase 1)
- **Table:** `rfp_ofertas` (cr8b2_rfpofertases)
- **Key columns:** offer_id, email_subject, email_from, email_date, status, recommendation, weighted_score
- **JSON storage columns:** classification_json, extracted_fields_json, tech_catalog_json, gonogo_json
- **Status lifecycle:** RECEIVED → PROCESSING → SCORED → COMPLETED (or ERROR)

### 4. SharePoint (Production — Phase 1)
- **Site:** /sites/Grp_T_DN_Arquitetura_Solucoes_Multi_Praticas_QA
- **Libraries:** Templates, Input (per-offer folders), Extracted, Output

### 5. Email Analysis Scripts (POC — Superseded)
- `analyze_inbox.mjs` — Node.js streaming CSV parser with Map-based accumulators
- `email_analyzer_pro.py` — Python pandas-based deep classifier (20+ regex rules, 3-pass classification)
- **Status:** Exploratory. NOT used in production pipeline.

### 6. MS Graph POC (Abandoned)
- `poc_ms_graph.mjs` — MSAL Device Code Flow with multi-client-ID retry strategy
- **Status:** ❌ NO-GO — Blocked by tenant CA policies (AADSTS50105, AADSTS53003)

### 7. Documentation (Enterprise — Updated)
- `docs/01_SAD_Solution_Architecture_Document.md` — Architecture v2.1
- `docs/02_TDD_Technical_Design_Document.md` — Technical Design v2.1
- `docs/03_Operations_Manual.md` — Operations v2.1
- `docs/04_Functional_Specification.md` — Functional v2.1
- `docs/05_Agentic_Project_Governance.md` — Project governance
- `docs/Power_Automate_Flows_Configuration_Guide.md` — Flow config guide (NEW)

## Data Flow (Production)

```
[Email in Ofertas DN]
  → [Power Automate Flow 1] → Save to SharePoint + Create Dataverse Record
    → [Power Automate Flow 2] → Extract text → 4x AI Builder Prompts → Update Dataverse
      → [Power Automate Flow 3] → Compose Report → Send Email + Teams Card + Update Status
```

## Entry Points (Production)
- **Email trigger:** New email in Ofertas DN shared mailbox → Flow 1 auto-triggers
- **Manual test:** Run Flow 2 manually with offer_id + folder_url from Dataverse

## Entry Points (Legacy/POC)
- `node analyze_inbox.mjs` — Run inbox analysis
- `python email_analyzer_pro.py` — Run deep email classification
- `node poc_ms_graph.mjs` — Run MS Graph POC (will fail)
