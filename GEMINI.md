<!-- GSD:project-start source:PROJECT.md -->
## Project

**RFP Auto-Diligence Pipeline**

An automated pipeline that monitors the "Ofertas DN" shared mailbox, extracts data from RFP emails and their attachments (PDF, DOCX, XLSX, ZIP), applies a 5-dimension scoring framework, and generates a GO/NO-GO recommendation report for executive decision-making. Built 100% on Microsoft Power Platform (Copilot Studio + Power Automate + AI Builder + SharePoint + Dataverse) using existing corporate licenses. Target: reduce per-offer diligence time from ~4 hours to under 30 minutes.

**Core Value:** Every new offer gets a scored, evidence-backed GO/NO-GO recommendation delivered to the Architecture team's inbox within 30 minutes — so Architects spend time on strategy, not document mining.

### Constraints

- **Stack:** 100% Microsoft Power Platform — no external/local/custom infrastructure
- **Licenses:** Must use existing M365 + Copilot Studio licenses (zero incremental cost)
- **Security:** All data processed within corporate M365 tenant (Azure region)
- **Governance:** Full documentation required before any deployment (SAD, TDD, Ops Manual, Func Spec)
- **Approval gates:** No code to production without written approval, architecture review, and PR approval
- **Language:** Documents in PT-BR, ES, and EN — pipeline must handle all three
- **Performance:** Email → Report delivered in ≤ 30 minutes end-to-end
- **Accuracy:** ≥ 85% field extraction accuracy (compared to manual)
- **Integrity:** Zero data fabrication (Princípio Zero — A_VALIDAR for missing data)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Production Stack (100% Microsoft Power Platform)
| Component | Service | Purpose |
|---|---|---|
| **Orchestration** | Power Automate | 3 cloud flows (Intake, Processing, Report) |
| **AI/ML** | AI Builder (GPT-4.1) | 4 custom prompts (Classify, Extract, Tech, GoNoGo) |
| **Database** | Dataverse | Structured data (rfp_ofertas table) |
| **File Storage** | SharePoint Online | Document libraries (Input, Extracted, Output, Templates) |
| **Email** | Outlook 365 Connector | Shared mailbox trigger (Ofertas DN) |
| **Agent** | Copilot Studio | Teams chatbot (Phase 7 — planned) |

## POC Stack (Superseded)
- **Node.js** — ES Modules (`.mjs`), MSAL auth POC (NO-GO)
- **Python 3.13** — Email analyzer (`email_analyzer_pro.py`)
- **PowerShell** — Deploy scripts (blocked by Entra ID)

## Environment
- **Power Platform:** ColOfertasBrasilPro (e2d10003-4d8e-e007-9d63-76d5fe89ef56)
- **Dataverse:** https://colofertasbrasilpro.crm4.dynamics.com
- **Repository:** https://github.com/manoelbenicio/Smart__Outlook_AI.git
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Code Style
### Python (`email_analyzer_pro.py`)
- **Docstrings:** Yes — triple-quote docstrings on functions
- **Type hints:** Return types on some functions (`-> dict`, `-> str`, `-> list`)
- **Constants:** `UPPER_CASE` at module level
- **Functions:** `snake_case`
- **Error handling:** try/except with multiple encoding fallbacks in `load_csv_robust()`
- **String formatting:** f-strings throughout
- **Data structures:** pandas DataFrames, `Counter`, `defaultdict`
- **Classification pattern:** Ordered list of compiled regex tuples `(category, pattern)`
### JavaScript (`analyze_inbox.mjs`, `poc_ms_graph.mjs`)
- **Module style:** ES Modules (`.mjs`, `import` statements)
- **Variables:** `const`/`let` (no `var`)
- **Functions:** Mix of arrow functions and async functions
- **String formatting:** Template literals
- **Data structures:** `Map` for accumulators (memory-efficient)
- **Error handling:** try/catch with multi-attempt retry pattern (poc_ms_graph.mjs)
## Patterns
### CSV Processing Pattern
### Classification Pattern
- Python: `CLASSIFICATION_RULES = [(category, compiled_regex)]` — 20+ rules
- Node.js: Inline `if/else if` chain — ~18 rules
- Python version is more sophisticated (3-pass: subject → sender → body)
### Report Generation Pattern
- Python: f-string based `generate_markdown_report()`
- Node.js: Template literal string building
## Error Handling
- **CSV loading:** Multiple encoding attempts (`utf-8`, `utf-8-sig`, `latin-1`, `cp1252`)
- **MS Graph:** Multiple client ID attempts with graceful fallback
- **No centralized error handling** — each script handles its own errors
- **No logging framework** — `print()` and `console.log()` only
## Configuration
- Hardcoded paths (e.g., `WORKSPACE = r"d:\VMs\Projetos\AI_Smart_Organizer"`)
- Hardcoded email addresses and user keys
- No `.env` or config file pattern yet
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Current Pattern
**Cloud-native serverless** — 100% Microsoft Power Platform. No custom code in production.

## Production Components
### 1. Power Automate Flows (Phase 4)
- **RFP-01-Email-Intake** — Outlook V3 trigger → SharePoint → Dataverse
- **RFP-02-Processing-Pipeline** — 4x AI Builder prompts → Dataverse update
- **RFP-03-Report-Generation** — Compose report → Send email
### 2. AI Builder Prompts (Phase 3)
- 4 GPT-4.1 prompts: Classify, Extract, Tech, GoNoGo
- Temperature 0.1, JSON-only output, Princípio Zero enforced
### 3. Dataverse (Phase 1)
- Table: rfp_ofertas (cr8b2_rfpofertases)
- JSON storage columns: classification, extracted_fields, tech_catalog, gonogo
### 4. SharePoint (Phase 1)
- Libraries: Templates, Input, Extracted, Output

## POC Components (Superseded)
- `email_analyzer_pro.py` — Python email classifier
- `analyze_inbox.mjs` — Node.js streaming parser
- `poc_ms_graph.mjs` — MS Graph POC (NO-GO)

## Data Flow
```
[Email] → [Flow 1] → [SharePoint + Dataverse] → [Flow 2] → [4x AI] → [Flow 3] → [Email Report]
```
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
