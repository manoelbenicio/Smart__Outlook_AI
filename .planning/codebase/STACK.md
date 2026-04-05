# Stack — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual deployed stack

## Production Stack (100% Microsoft Power Platform)

| Component | Service | Purpose |
|---|---|---|
| **Orchestration** | Power Automate | 3 cloud flows (Intake, Processing, Report) |
| **AI/ML** | AI Builder (GPT-4.1) | 4 custom prompts (Classify, Extract, Tech, GoNoGo) |
| **Database** | Dataverse | Structured data (rfp_ofertas table) |
| **File Storage** | SharePoint Online | Document libraries (Input, Extracted, Output, Templates) |
| **Email** | Outlook 365 Connector | Shared mailbox trigger (Ofertas DN) |
| **Notifications** | Teams Connector | Adaptive Card notifications |
| **Reports** | Word Online + Compose | PDF report generation |
| **Agent** | Copilot Studio | Teams chatbot (Phase 7 — planned) |

### Power Platform Environment
- **Name:** ColOfertasBrasilPro
- **ID:** e2d10003-4d8e-e007-9d63-76d5fe89ef56
- **Dataverse URL:** https://colofertasbrasilpro.crm4.dynamics.com
- **Region:** South America (Azure Brazil South)

### AI Builder Configuration
- **Model:** GPT-4.1 (latest available in tenant)
- **Temperature:** 0.1 (all prompts)
- **Output format:** JSON-only (enforced via system prompt)
- **Prompts deployed:** 4 (Classify, Extract, Tech, GoNoGo)

## POC/Exploratory Stack (Superseded — NOT in production)

### Runtime
- **Node.js** — ES Modules (`.mjs`), CommonJS (`package.json: type=commonjs`)
- **Python 3.13** — standalone scripts (no venv configured)

### Languages
- **JavaScript/Node.js** — POC scripts, streaming CSV parser (`analyze_inbox.mjs`, `poc_ms_graph.mjs`)
- **Python** — Enterprise email analyzer (`email_analyzer_pro.py`)
- **Markdown** — Documentation (6 enterprise docs in `docs/`)
- **PowerShell** — Deploy scripts in `deploy/` (blocked by Entra ID — browser automation used instead)

### Node.js Dependencies (`package.json`)
| Package | Version | Purpose |
|---|---|---|
| `@azure/msal-node` | ^5.1.2 | MS Graph Device Code Flow auth (POC — **NO-GO**, blocked by tenant CA) |

### Python Dependencies (not in requirements.txt)
| Package | Used In | Purpose |
|---|---|---|
| `pandas` | `email_analyzer_pro.py` | CSV loading, analysis, cross-tabulation |
| `re` | `email_analyzer_pro.py` | Regex-based email classification (20+ rules) |
| `json` | `email_analyzer_pro.py` | JSON output generation |

## Configuration
- `.env` — Not applicable (Power Platform uses connector auth)
- `package.json` — Minimal, only MSAL dependency (POC)
- `.planning/config.json` — GSD framework settings

## Build & Run
- **Production:** No build step — Power Platform is configuration-driven
- **POC scripts:** Run directly (`node`, `python`)
- **No test framework** configured for local code
- **No CI/CD** — Power Platform Solution export is the deployment artifact

## Key Observation
> **The Node.js/Python code is POC work that has been superseded.** The production architecture is 100% Microsoft Power Platform as specified in SAD v2.1. All orchestration, AI processing, data storage, and reporting is handled by Power Automate + AI Builder + Dataverse + SharePoint.
