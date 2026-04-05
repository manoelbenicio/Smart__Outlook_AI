# Architecture — AI Smart Organizer

## Current Pattern
**Monolith scripts** — No layered architecture. Each script is standalone and runs independently.

## Components

### 1. Email Analysis (exploratory)
- `analyze_inbox.mjs` — Node.js streaming CSV parser with Map-based accumulators
- `email_analyzer_pro.py` — Python pandas-based deep classifier (20+ regex rules, 3-pass classification)
- **Dependencies between them:** None (independent implementations of similar analysis)

### 2. MS Graph POC (abandoned)
- `poc_ms_graph.mjs` — MSAL Device Code Flow with multi-client-ID retry strategy
- `poc_report.md` — Documented results (NO-GO)
- `ms_graph_privilege_poc_antigravity.md` — Test plan and criteria

### 3. RFP Diligence Framework (reference material)
- `MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md` — Framework specification
- `rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/` — JSON schema + 14 CSV templates
- **Not code** — these are specification/template files for the pipeline

### 4. Documentation (enterprise)
- `docs/01_SAD_Solution_Architecture_Document.md` — Architecture
- `docs/02_TDD_Technical_Design_Document.md` — Technical Design
- `docs/03_Operations_Manual.md` — Operations
- `docs/04_Functional_Specification.md` — Functional
- `docs/05_Agentic_Project_Governance.md` — Project governance (OPUS + CODEX agents)

## Data Flow

```
[Outlook CSV Export] → [Python/Node Scripts] → [Markdown Report + JSON]

This will become (per SAD v2.0):

[Email in Ofertas DN] → [Power Automate] → [SharePoint] → [AI Builder] → [Dataverse] → [Email Report]
```

## Entry Points
- `node analyze_inbox.mjs` — Run inbox analysis
- `python email_analyzer_pro.py` — Run deep email classification
- `node poc_ms_graph.mjs` — Run MS Graph POC (will fail)

## Abstractions
- `classify_subject_deep()` in `email_analyzer_pro.py` — 3-pass classifier (subject → sender → body)
- `analyzeCSVStream()` in `analyze_inbox.mjs` — Streaming parser with constant memory
- No shared abstractions between scripts
