# Testing — AI Smart Organizer

## Current State
**No tests exist.** The `package.json` has a placeholder test script:
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

## Test Framework
- None configured
- No test files (`tests/` directory does not exist)
- No test runner
- No CI/CD pipeline

## Test Coverage
- 0% — no automated tests of any kind

## Testing Strategy (Planned)
Per `docs/02_TDD_Technical_Design_Document.md` Section 8:

| # | Type | Scenario | Criteria |
|---|---|---|---|
| T1-T4 | Unit | Individual flow/prompt testing | Correct output |
| T5-T7 | Integration | E2E flow testing | Complete pipeline |
| T8 | Stress | 5 simultaneous offers | No throttling |
| T9 | Fallback | Failed PDF extraction | Correct error reporting |
| T10 | Validation | AI vs human comparison | ≥ 85% accuracy |

## Manual Verification Done
- `email_analyzer_pro.py` was run and produced `email_analysis_report.md` (15,630 emails processed)
- `poc_ms_graph.mjs` was run and produced `poc_report.md` (NO-GO documented)
- Both verified by output inspection, not automated tests

## Mocking
- Not applicable (no tests)

## Note
> Testing for the Power Platform solution (SAD v2.0) will use Power Automate run history, AI Builder prompt testing, and manual browser-based QA — not code-level unit tests. See `docs/05_Agentic_Project_Governance.md` for the QA distribution between OPUS (browser) and CODEX (automated).
