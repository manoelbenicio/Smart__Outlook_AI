# Structure — AI Smart Organizer

## Directory Layout

```
AI_Smart_Organizer/
├── .agent/                          # GSD Framework v1.32.0
│   ├── skills/                      # 60 GSD skills
│   ├── agents/                      # GSD agent configs
│   └── get-shit-done/               # GSD core
├── .git/                            # Git (just initialized)
├── .planning/                       # GSD planning (being created now)
│   └── codebase/                    # This codebase map
├── docs/                            # Enterprise documentation (5 docs)
│   ├── 01_SAD_Solution_Architecture_Document.md
│   ├── 02_TDD_Technical_Design_Document.md
│   ├── 03_Operations_Manual.md
│   ├── 04_Functional_Specification.md
│   ├── 05_Agentic_Project_Governance.md
│   └── checkins/                    # Sprint check-in evidence (S0-S3 + gates)
├── rfp_engine/                      # RFP Engine (scaffold only)
│   └── templates/
│       └── RFP_Diligence_Templates_v2.1_STRICT/  # 15 files (1 JSON + 14 CSV)
├── node_modules/                    # npm packages (msal-node)
│
├── analyze_inbox.mjs                # Node.js email analyzer (streaming)
├── email_analyzer_pro.py            # Python email analyzer (pandas, deep classification)
├── poc_ms_graph.mjs                 # MS Graph POC (abandoned — NO-GO)
│
├── Inbox.CSV                        # Raw email export — 169MB, ~14,739 emails
├── Usuario_GEN_OFERTAS.CSV          # Ofertas DN export — 8.8MB, ~891 emails
│
├── email_analysis_report.md         # Generated analysis report
├── email_analysis.json              # Generated analysis data (JSON)
│
├── MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md  # Diligence framework spec
├── Master_Prompt_Template_Diligence_pack_v2.1_STRICT_PLACEHOLDER.zip  # Template pack
│
├── ms_graph_privilege_poc_antigravity.md  # POC test plan
├── poc_report.md                         # POC results
├── poc_results.json                      # POC output (empty: {})
│
├── package.json                     # Node.js project config
└── package-lock.json                # npm lockfile
```

## Key Locations

| What | Where |
|---|---|
| Enterprise documentation | `docs/` |
| RFP templates v2.1 | `rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/` |
| Email analysis code | `email_analyzer_pro.py`, `analyze_inbox.mjs` |
| Raw email data | `Inbox.CSV`, `Usuario_GEN_OFERTAS.CSV` |
| GSD framework | `.agent/` |
| Planning artefacts | `.planning/` |

## Naming Conventions
- Docs: `##_Name_With_Underscores.md` (numbered prefix)
- Scripts: `lowercase_with_underscores.py` or `camelCase.mjs`
- Data: `PascalCase.CSV` or `snake_case.json`
- No consistent convention (POC codebase)

## File Sizes

| File | Size | Note |
|---|---|---|
| `Inbox.CSV` | 169 MB | ⚠️ Large — do NOT load into memory naively |
| `Usuario_GEN_OFERTAS.CSV` | 8.8 MB | Manageable |
| `email_analyzer_pro.py` | 19.7 KB | Largest Python file |
| `poc_ms_graph.mjs` | 14.7 KB | Largest JS file |
