---
phase: 3
plan: 2
title: "Test Prompts with Sample Documents & Browser QA"
agent: CODEX + OPUS
wave: 2
depends_on: [01-PLAN]
requirements: [CODEX-12, OPUS-13]
files_modified:
  - rfp_engine/prompts/validation_results.md
  - docs/checkins/S1/ai_builder_qa.md
autonomous: false
---

# Plan 02: Test Prompts with Sample Documents & Browser QA

<objective>
CODEX tests each deployed prompt with 3 sample documents and validates JSON output. OPUS then performs browser QA to verify prompts in AI Builder studio.
</objective>

<task id="1">
<title>CODEX: Test Each Prompt with 3 Sample Documents</title>
<agent>CODEX</agent>

<read_first>
- rfp_engine/prompts/test_corpus/test_ptbr.txt (PT-BR sample)
- rfp_engine/prompts/test_corpus/test_es.txt (ES sample)
- rfp_engine/prompts/test_corpus/test_en.txt (EN sample)
- rfp_engine/prompts/validation_results.md (validation matrix from Phase 2)
</read_first>

<action>
In AI Builder → Test each prompt:

**Prompt 1 (Classify_Offer):**
1. Test with test_ptbr.txt → verify JSON output, check offer_type, client_name
2. Test with test_es.txt → verify JSON output, check currency=USD
3. Test with test_en.txt → verify JSON output, check horizontal
4. Verify all outputs are valid JSON (parse without errors)
5. Verify no fabricated data (only data from input or A_VALIDAR)

**Prompt 2 (Extract_Fields):**
1. Feed Prompt 1 output + test_ptbr.txt → verify 5 sections populated
2. Feed Prompt 1 output + test_es.txt → verify penalty_clauses extracted
3. Feed Prompt 1 output + test_en.txt → verify a_validar_count
4. Verify date normalization to YYYY-MM-DD format

**Prompt 3 (Tech_Practices):**
1. Test with test_ptbr.txt → verify SAP identified in technologies.required
2. Test with test_es.txt → verify AWS identified
3. Test with test_en.txt → verify AI/ML identified
4. Verify minsait_capability_match populated

**Prompt 4 (GoNoGo_Score):**
1. Feed Prompts 1+2+3 outputs + test_ptbr.txt → verify 5 dimensions scored
2. Feed outputs + test_es.txt → verify weighted_total calculated
3. Feed outputs + test_en.txt → verify recommendation generated
4. Verify scores are integers 1-5
5. Verify weighted_total matches sum of weighted_scores

Record all results in rfp_engine/prompts/validation_results.md (update TBD columns).
</action>

<acceptance_criteria>
- File rfp_engine/prompts/validation_results.md updated with actual results (no TBD remaining)
- All 12 tests produce valid JSON (parseable)
- At least 10/12 tests extract key fields correctly
- 0 fabricated fields across all tests
- GoNoGo weighted_total correctly computed in all 3 tests
</acceptance_criteria>
</task>

<task id="2">
<title>OPUS: Browser QA — AI Builder Studio Verification</title>
<agent>OPUS</agent>

<read_first>
- rfp_engine/prompts/validation_results.md (CODEX test results)
- rfp_engine/prompts/01_classify_offer.md (expected prompt config)
- rfp_engine/prompts/04_gonogo_score.md (expected prompt config)
</read_first>

<action>
Open browser → AI Builder → Prompts:

1. Verify all 4 prompts are listed and status = Published
2. Open each prompt and verify:
   - Model = GPT-4o
   - Temperature = 0.1
   - System instruction matches design spec (spot check key phrases)
   - Input parameters match spec
3. Run one interactive test in AI Builder studio for Prompt 4 (GoNoGo_Score):
   - Feed combined outputs from Prompts 1-3
   - Verify recommendation generated (GO/GO_CONDITIONAL/NO_GO)
   - Verify justifications cite evidence
4. Take screenshots as evidence

Document findings in `docs/checkins/S1/ai_builder_qa.md`:
- Pass/Fail for each prompt
- Screenshots embedded
- Timestamp
- Issues found (if any)
</action>

<acceptance_criteria>
- File docs/checkins/S1/ai_builder_qa.md exists
- File contains Pass/Fail for all 4 prompts
- File confirms all prompts are Published status
- File confirms GPT-4o model and temperature 0.1 on all prompts
- File contains at least 1 screenshot showing AI Builder prompt test
</acceptance_criteria>
</task>

<verification>
All 4 prompts tested with real sample data. Validation matrix 100% filled. Browser QA confirms deployment matches design specs. 0 fabricated fields.
</verification>

<must_haves>
- 12/12 tests produce valid JSON
- 0 fabricated fields (Princípio Zero verified)
- Browser QA confirms all 4 prompts published and correctly configured
</must_haves>
