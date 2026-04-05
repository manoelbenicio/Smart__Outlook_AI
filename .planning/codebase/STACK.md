# Stack — AI Smart Organizer

## Runtime
- **Node.js** — ES Modules (`.mjs`), CommonJS (`package.json: type=commonjs`)
- **Python 3.13** — standalone scripts (no venv configured)

## Languages
- **JavaScript/Node.js** — POC scripts, streaming CSV parser (`analyze_inbox.mjs`, `poc_ms_graph.mjs`)
- **Python** — Enterprise email analyzer (`email_analyzer_pro.py`)
- **Markdown** — Documentation (5 enterprise docs in `docs/`)

## Frameworks & Libraries

### Node.js (`package.json`)
| Package | Version | Purpose |
|---|---|---|
| `@azure/msal-node` | ^5.1.2 | MS Graph Device Code Flow auth (POC — **NO-GO**, blocked by tenant CA) |

### Python (used in scripts, not in requirements.txt)
| Package | Used In | Purpose |
|---|---|---|
| `pandas` | `email_analyzer_pro.py` | CSV loading, analysis, cross-tabulation |
| `re` | `email_analyzer_pro.py` | Regex-based email classification (20+ rules) |
| `json` | `email_analyzer_pro.py` | JSON output generation |

## Configuration
- `.env` — Not yet created (planned)
- `.env.example` — Not yet created (planned)
- `package.json` — Minimal, only MSAL dependency

## Build & Run
- No build step (scripts run directly)
- No test framework configured (`"test": "echo Error..."`)
- No CI/CD configured

## Key Observation
> **The runtime stack will NOT carry forward.** The approved architecture (SAD v2.0) specifies a 100% Microsoft Power Platform solution (Copilot Studio + Power Automate + AI Builder + SharePoint + Dataverse). The existing Node.js/Python code is exploratory POC work that has been superseded.
