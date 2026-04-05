# Concerns — AI Smart Organizer

## Technical Debt

### TD-01: Hardcoded Paths and Credentials
- **Files:** `email_analyzer_pro.py` (line 18-24), `analyze_inbox.mjs` (line 126-127)
- **Issue:** Workspace paths, email addresses, and user keys are hardcoded
- **Risk:** Code is not portable; breaks if moved or run by another user
- **Priority:** Low — these scripts won't be used in production (Power Platform architecture)

### TD-02: Duplicate Implementations
- **Files:** `analyze_inbox.mjs` and `email_analyzer_pro.py`
- **Issue:** Two implementations of the same email analysis functionality (Node.js and Python)
- **Risk:** Confusion about which is canonical
- **Resolution:** Python version (`email_analyzer_pro.py`) is the canonical analyzer (deeper classification). Node.js version was an earlier attempt with memory issues.

### TD-03: No Requirements.txt
- **Issue:** Python dependencies (pandas) not documented in a `requirements.txt`
- **Risk:** Environment not reproducible
- **Priority:** Low — Python scripts are exploratory, not production code

### TD-04: No .gitignore
- **Issue:** `node_modules/`, large CSV files (169MB), and `.planning/` not gitignored
- **Risk:** Huge repo size if committed. Sensitive data in CSVs.
- **Priority:** High — must create `.gitignore` before first commit

## Security Concerns

### SEC-01: Large CSV Files Contain Email Data
- **Files:** `Inbox.CSV` (169MB), `Usuario_GEN_OFERTAS.CSV` (8.8MB)
- **Content:** Email bodies, sender addresses, subjects — potentially sensitive corporate data
- **Risk:** If committed to git, sensitive email content would be in version control
- **Mitigation:** Add to `.gitignore` immediately. Never commit these files.

### SEC-02: MS Graph Client IDs in POC
- **File:** `poc_ms_graph.mjs`
- **Issue:** Multiple well-known public client IDs hardcoded (but these are public/documented by Microsoft)
- **Risk:** Low — these are public client IDs, not secrets

### SEC-03: User Email Hardcoded
- **File:** `email_analyzer_pro.py` (line 24)
- **Content:** `USER_EMAIL = "mbenicios@minsait.com"`
- **Risk:** Low — personal identifier, not a secret

## Known Issues

### ISS-01: MS Graph Blocked by Corporate Tenant
- **Impact:** Cannot automate email access via Graph API
- **Root Cause:** Conditional Access Policies (AADSTS50105 — app not assigned, AADSTS53003 — CA policy blocked)
- **Resolution:** Pivoted to Power Platform architecture (uses delegated connectors, not Graph directly)

### ISS-02: Inbox CSV Too Large to Load Naively
- **Impact:** `analyze_inbox.mjs` v1 crashed with OOM
- **Resolution:** v2 uses streaming parser with Map accumulators (constant memory)

## Performance
- `email_analyzer_pro.py` processes ~15,630 emails in ~30 seconds (acceptable for one-time analysis)
- No performance concerns for production — Power Platform handles its own scaling

## Fragile Areas
- **CSV parsing:** Multiline fields in Outlook exports require careful quote-aware parsing. Both implementations handle this but differently.
- **Classification regex:** Sensitive to language (PT-BR/ES/EN mix). New email patterns may not match existing rules.
