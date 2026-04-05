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
```
## Entry Points
- `node analyze_inbox.mjs` — Run inbox analysis
- `python email_analyzer_pro.py` — Run deep email classification
- `node poc_ms_graph.mjs` — Run MS Graph POC (will fail)
## Abstractions
- `classify_subject_deep()` in `email_analyzer_pro.py` — 3-pass classifier (subject → sender → body)
- `analyzeCSVStream()` in `analyze_inbox.mjs` — Streaming parser with constant memory
- No shared abstractions between scripts
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
