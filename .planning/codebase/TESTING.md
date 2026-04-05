# Testing — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual testing status

## Current State

### Production Testing (Power Platform)
Testing for the Power Platform solution uses:
1. **Power Automate Run History** — verify flow execution and step-by-step results
2. **AI Builder Prompt Testing** — test prompts directly in AI Builder studio
3. **Browser-based QA** — manual verification of UI, data, and outputs
4. **Dataverse validation** — query records to verify data integrity

### Unit Tests Completed

| # | Component | Type | Status | Result |
|---|---|---|---|---|
| T-01 | AI Builder: Classify_Offer | Prompt test | ✅ Done | Valid JSON output |
| T-02 | AI Builder: Extract_Fields | Prompt test | ✅ Done | Valid JSON output |
| T-03 | AI Builder: Tech_Practices | Prompt test | ✅ Done | Valid JSON output |
| T-04 | AI Builder: GoNoGo_Score | Prompt test | ✅ Done | Valid JSON output |
| T-05 | SharePoint site + libraries | Browser QA | ✅ Done | Accessible with correct structure |
| T-06 | Dataverse rfp_ofertas table | Browser QA | ✅ Done | All columns present |
| T-07 | Dataverse JSON columns | Browser QA | ✅ Done | 4 multiline text columns added |

### Integration Tests Pending

| # | Scenario | Type | Status |
|---|---|---|---|
| T-08 | Flow 1: Email → SharePoint + Dataverse | Flow run test | ⏳ Phase 5 |
| T-09 | Flow 2: Trigger → 4x AI → Dataverse update | Flow run test | ⏳ Phase 5 |
| T-10 | Flow 3: Trigger → Report → Email | Flow run test | ⏳ Phase 5 |
| T-11 | E2E: Email → Report (offer #1 standard) | End-to-end | ⏳ Phase 6 |
| T-12 | E2E: Email → Report (offer #2 ZIP) | End-to-end | ⏳ Phase 6 |
| T-13 | E2E: Email → Report (offer #3 edge case) | End-to-end | ⏳ Phase 6 |
| T-14 | Accuracy: AI vs manual ≥ 85% | Accuracy | ⏳ Phase 6 |
| T-15 | Stress: 5 simultaneous offers | Performance | ⏳ Phase 6 |

## Test Framework
- **Production:** Power Automate run history + Dataverse queries (no code-level tests)
- **POC code:** No test framework configured (`"test": "echo Error..."` in package.json)

## Test Coverage
- **AI Builder prompts:** 4/4 tested (100%)
- **Infrastructure:** 3/3 verified (SharePoint, Dataverse, Connections)
- **Flows:** 0/3 integration-tested (Phase 5)
- **E2E:** 0/3 tested (Phase 6)

## POC Manual Verification (Historical)
- `email_analyzer_pro.py` was run and produced `email_analysis_report.md` (15,630 emails processed)
- `poc_ms_graph.mjs` was run and produced `poc_report.md` (NO-GO documented)
- Both verified by output inspection, not automated tests

## Test Strategy (per TDD v2.1 Section 8)

| # | Type | Scenario | Criteria | Phase |
|---|---|---|---|---|
| T1-T4 | Unit | Individual prompt testing | Correct JSON output | Phase 3 ✅ |
| T5-T7 | Unit | Individual flow testing | Correct execution | Phase 5 |
| T8-T10 | Integration | E2E flow testing | Complete pipeline | Phase 6 |
| T11 | Stress | 5 simultaneous offers | No throttling | Phase 6 |
| T12 | Fallback | Failed PDF extraction | Correct error reporting | Phase 6 |
| T13 | Validation | AI vs human comparison | ≥ 85% accuracy | Phase 6 |
