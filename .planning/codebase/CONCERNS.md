# Concerns — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual deployment status

## Active Blockers

### BLOCK-01: Child Flow Connector Not Available
- **Impact:** Flow 2 cannot call Flow 3 as a child flow
- **Root Cause:** "Executar um fluxo filho" (Run a Child Flow) requires flows to be inside a Dataverse Solution. Our flows are standalone.
- **Options:**
  1. Move all 3 flows into a Solution (recommended)
  2. Change Flow 3 trigger to Dataverse-based (trigger when status = SCORED)
  3. Use HTTP Request trigger on Flow 3 (requires premium connector)
- **Priority:** HIGH — blocks end-to-end pipeline completion

### BLOCK-02: Dataverse "Estado" Field Type Mismatch
- **Impact:** Flow 2 "Atualizar uma linha 1" shows "invalid integer" error for Estado field
- **Root Cause:** Dataverse Status/State fields are integer-based (optionset), not text
- **Fix:** Use status reason integer codes instead of text strings (e.g., 1 = Active, 2 = Inactive)
- **Priority:** MEDIUM — workaround using custom text field "status" column

## Technical Debt

### TD-01: Hardcoded Paths and Credentials
- **Files:** `email_analyzer_pro.py` (line 18-24), `analyze_inbox.mjs` (line 126-127)
- **Issue:** Workspace paths, email addresses, and user keys are hardcoded
- **Risk:** Low — these scripts are POC, not production code
- **Priority:** LOW

### TD-02: Duplicate Implementations
- **Files:** `analyze_inbox.mjs` and `email_analyzer_pro.py`
- **Resolution:** Python version is canonical. Both are POC — production uses AI Builder.

### TD-03: No Requirements.txt
- **Priority:** LOW — Python scripts are not production

### TD-04: No .gitignore — ✅ RESOLVED
- **Status:** `.gitignore` created and committed. Large CSVs, node_modules excluded.

### TD-05: Deploy Scripts Blocked
- **Files:** `deploy/01_deploy_sharepoint.ps1`, `deploy/02_deploy_dataverse.ps1`
- **Issue:** PowerShell scripts require Entra ID app registration (PnP.PowerShell -Interactive/-DeviceLogin)
- **Resolution:** Browser-based automation used instead. Scripts kept for documentation.

### TD-06: Governance Doc Sprint Status Not Updated
- **File:** `docs/05_Agentic_Project_Governance.md`
- **Issue:** All sprint items show "TODO" status — none updated to reflect completed work
- **Priority:** MEDIUM — needs update during documentation sweep

## Security Concerns

### SEC-01: Large CSV Files Contain Email Data — ✅ MITIGATED
- **Mitigation:** Added to `.gitignore`. Files not committed to repo.

### SEC-02: MS Graph Client IDs in POC
- **Risk:** LOW — these are public/documented Microsoft client IDs

### SEC-03: User Email Hardcoded
- **Risk:** LOW — personal identifier in POC file, not a secret

## Known Issues

### ISS-01: MS Graph Blocked by Corporate Tenant — ✅ RESOLVED
- **Resolution:** Pivoted to Power Platform architecture (uses delegated connectors)

### ISS-02: Inbox CSV Too Large to Load Naively — ✅ RESOLVED
- **Resolution:** v2 uses streaming parser. Production uses Outlook connector (no CSV).

### ISS-03: Power Automate New Designer Search Issues
- **Impact:** Action search in New Designer sometimes fails to find connectors
- **Workaround:** Switch to Classic Designer for hard-to-find actions
- **Priority:** LOW — cosmetic, doesn't block functionality

## Performance
- POC: `email_analyzer_pro.py` processes ~15,630 emails in ~30 seconds
- Production: Power Platform handles its own scaling. Target: ≤ 30 min per offer E2E.

## Fragile Areas
- **AI Builder prompts:** Sensitive to input quality. Very long documents may hit token limits.
- **Dataverse column names:** Internal names (cr8b2_*) must be used in expressions, not display names.
- **Power Automate dynamic content:** Must use correct "Text" output from AI Builder, not "Resposta do Prompt".
