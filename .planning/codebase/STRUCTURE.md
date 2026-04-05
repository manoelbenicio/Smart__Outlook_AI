# Structure — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual deployed state

## Directory Layout

```
AI_Smart_Organizer/
├── .agent/                          # GSD Framework v1.32.0
│   ├── skills/                      # 60 GSD skills
│   ├── agents/                      # GSD agent configs
│   └── get-shit-done/               # GSD core
├── .git/                            # Git (remote: github.com/manoelbenicio/Smart__Outlook_AI)
├── .gitignore                       # Configured — excludes CSVs, node_modules, .planning/
├── .planning/                       # GSD planning artifacts
│   ├── PROJECT.md                   # Project definition
│   ├── REQUIREMENTS.md              # 60 requirements (25 OPUS + 35 CODEX)
│   ├── ROADMAP.md                   # 7-phase roadmap
│   ├── STATE.md                     # Current execution state
│   ├── config.json                  # GSD settings
│   ├── codebase/                    # Codebase map (7 docs)
│   │   ├── ARCHITECTURE.md
│   │   ├── CONCERNS.md
│   │   ├── CONVENTIONS.md
│   │   ├── INTEGRATIONS.md
│   │   ├── STACK.md
│   │   ├── STRUCTURE.md             # ← This file
│   │   └── TESTING.md
│   ├── phases/                      # Phase plans
│   │   ├── 01-infrastructure-setup/ # 5 plans ✅ COMPLETE
│   │   ├── 02-ai-prompt-engineering/ # 2 plans ✅ COMPLETE
│   │   └── 03-ai-prompt-deployment/ # 2 plans ✅ COMPLETE
│   └── research/                    # Research artifacts
├── deploy/                          # Deployment scripts (PowerShell — superseded by browser automation)
│   ├── README.md
│   ├── 01_deploy_sharepoint.ps1     # SharePoint deployment (blocked by Entra ID)
│   └── 02_deploy_dataverse.ps1      # Dataverse deployment (blocked by Entra ID)
├── docs/                            # Enterprise documentation (6 docs)
│   ├── 01_SAD_Solution_Architecture_Document.md  # v2.1 ✅ Updated
│   ├── 02_TDD_Technical_Design_Document.md       # v2.1 ✅ Updated
│   ├── 03_Operations_Manual.md                   # v2.1 ✅ Updated
│   ├── 04_Functional_Specification.md            # v2.1 ✅ Updated
│   ├── 05_Agentic_Project_Governance.md          # v1.0 ⚠️ Needs sprint status update
│   ├── Power_Automate_Flows_Configuration_Guide.md # NEW — Step-by-step flow config
│   ├── checkins/                    # Sprint check-in evidence
│   │   ├── S0/ S1/ S2/ S3/         # Sprint directories (empty — pending)
│   │   └── gates/                   # Gate review evidence (empty — pending)
│   └── phase1/                      # Phase 1 design artifacts
│       ├── sharepoint_site_design.md
│       ├── dataverse_schema_design.md
│       └── word_template_design.md
├── rfp_engine/                      # RFP Engine
│   ├── prompts/                     # AI Builder prompt definitions (4 prompts)
│   │   ├── 01_classify_offer.md     # Classify_Offer prompt spec
│   │   ├── 02_extract_fields.md     # Extract_Fields prompt spec
│   │   ├── 03_tech_practices.md     # Tech_Practices prompt spec
│   │   └── 04_gonogo_score.md       # GoNoGo_Score prompt spec
│   └── templates/                   # RFP Diligence Templates v2.1
│       └── RFP_Diligence_Templates_v2.1_STRICT/  # 15 files (1 JSON + 14 CSV)
├── node_modules/                    # npm packages (msal-node — POC only)
│
├── analyze_inbox.mjs                # Node.js email analyzer (streaming) — POC
├── email_analyzer_pro.py            # Python email analyzer (pandas) — POC
├── poc_ms_graph.mjs                 # MS Graph POC (abandoned — NO-GO)
│
├── Inbox.CSV                        # Raw email export — 169MB ⚠️ GITIGNORED
├── Usuario_GEN_OFERTAS.CSV          # Ofertas DN export — 8.8MB ⚠️ GITIGNORED
│
├── email_analysis_report.md         # Generated analysis report
├── email_analysis.json              # Generated analysis data (JSON)
│
├── GEMINI.md                        # Agent configuration (GSD)
├── MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md
├── Master_Prompt_Template_Diligence_pack_v2.1_STRICT_PLACEHOLDER.zip
│
├── ms_graph_privilege_poc_antigravity.md  # POC test plan
├── poc_report.md                         # POC results (NO-GO)
├── poc_results.json                      # POC output (empty)
│
├── package.json                     # Node.js project config
└── package-lock.json                # npm lockfile
```

## Key Locations

| What | Where |
|---|---|
| Enterprise documentation | `docs/` (6 documents) |
| AI Builder prompt specs | `rfp_engine/prompts/` (4 prompts) |
| RFP templates v2.1 | `rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/` |
| Flow configuration guide | `docs/Power_Automate_Flows_Configuration_Guide.md` |
| Phase 1 design specs | `docs/phase1/` (3 design docs) |
| Email analysis code (POC) | `email_analyzer_pro.py`, `analyze_inbox.mjs` |
| Raw email data | `Inbox.CSV`, `Usuario_GEN_OFERTAS.CSV` (GITIGNORED) |
| GSD framework | `.agent/` |
| Planning artifacts | `.planning/` |
| Deploy scripts (deprecated) | `deploy/` |

## Naming Conventions
- Docs: `##_Name_With_Underscores.md` (numbered prefix)
- Prompts: `##_prompt_name.md` (numbered prefix, snake_case)
- Scripts: `lowercase_with_underscores.py` or `camelCase.mjs`
- Data: `PascalCase.CSV` or `snake_case.json`

## File Sizes

| File | Size | Note |
|---|---|---|
| `Inbox.CSV` | 169 MB | ⚠️ Large — GITIGNORED |
| `Usuario_GEN_OFERTAS.CSV` | 8.8 MB | GITIGNORED |
| `docs/01_SAD_*` | 27.5 KB | Largest doc |
| `docs/Power_Automate_*` | 19.7 KB | Flow config guide |
| `email_analyzer_pro.py` | 19.7 KB | Largest Python file |
| `poc_ms_graph.mjs` | 14.7 KB | Largest JS file |
