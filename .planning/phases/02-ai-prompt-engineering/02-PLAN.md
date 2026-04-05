---
phase: 2
plan: 2
title: "Validate Multi-Language Prompt Behavior"
agent: OPUS
wave: 2
depends_on: [01-PLAN]
requirements: [OPUS-10]
files_modified:
  - rfp_engine/prompts/validation_results.md
autonomous: true
---

# Plan 02: Validate Multi-Language Prompt Behavior

<objective>
OPUS validates that all 4 prompts correctly handle documents in PT-BR, ES, and EN. Each prompt is tested with sample text in all 3 languages to verify extraction accuracy and correct A_VALIDAR behavior.
</objective>

<task id="1">
<title>Prepare Multi-Language Test Corpus</title>
<agent>OPUS</agent>

<read_first>
- rfp_engine/prompts/01_classify_offer.md (Prompt 1 spec)
- rfp_engine/prompts/02_extract_fields.md (Prompt 2 spec)
- rfp_engine/prompts/03_tech_practices.md (Prompt 3 spec)
- rfp_engine/prompts/04_gonogo_score.md (Prompt 4 spec)
- Usuario_GEN_OFERTAS.CSV (real offer emails — first 20 rows for sample)
</read_first>

<action>
Create `rfp_engine/prompts/test_corpus/` with 3 synthetic test documents:

1. `test_ptbr.txt` — RFP em português brasileiro:
   - Cliente: Empresa fictícia "TechBR Soluções"
   - Escopo: Implementação SAP S/4HANA
   - Valor: R$ 2.500.000,00
   - Prazo: 12 meses
   - SLAs com penalidades

2. `test_es.txt` — RFP en español:
   - Cliente: "Grupo Energía Latam"
   - Alcance: Migración cloud AWS
   - Valor: USD 850.000
   - Plazo: 8 meses
   - Cláusulas de propiedad intelectual

3. `test_en.txt` — RFP in English:
   - Client: "Global Finance Corp"
   - Scope: AI/ML analytics platform
   - Value: EUR 1,200,000
   - Timeline: 10 months
   - Strict data residency requirements

Each file should be 2-3 pages of realistic RFP content with sections matching real RFP structures.
</action>

<acceptance_criteria>
- Directory `rfp_engine/prompts/test_corpus/` exists
- File test_ptbr.txt exists and contains "R$" and "SAP"
- File test_es.txt exists and contains "USD" and "AWS"
- File test_en.txt exists and contains "EUR" and "AI/ML"
- Each file is at least 3000 characters
</acceptance_criteria>
</task>

<task id="2">
<title>Validate All Prompts Against Test Corpus</title>
<agent>OPUS</agent>

<read_first>
- rfp_engine/prompts/01_classify_offer.md (expected behavior)
- rfp_engine/prompts/test_corpus/test_ptbr.txt
- rfp_engine/prompts/test_corpus/test_es.txt
- rfp_engine/prompts/test_corpus/test_en.txt
</read_first>

<action>
Create `rfp_engine/prompts/validation_results.md` documenting:

For each prompt × each language (4 prompts × 3 languages = 12 tests):

| Test ID | Prompt | Language | Input File | Expected Output | Result | Notes |
|---------|--------|----------|------------|-----------------|--------|-------|
| V-01 | Classify_Offer | PT-BR | test_ptbr.txt | offer_type=RFP, client=TechBR | TBD | |
| V-02 | Classify_Offer | ES | test_es.txt | offer_type=RFP, client=Grupo Energía | TBD | |
| V-03 | Classify_Offer | EN | test_en.txt | offer_type=RFP, client=Global Finance | TBD | |
| V-04 | Extract_Fields | PT-BR | test_ptbr.txt | value=2500000 BRL | TBD | |
| ... | ... | ... | ... | ... | ... | |
| V-12 | GoNoGo_Score | EN | test_en.txt | 5 dimensions scored | TBD | |

**Validation criteria per test:**
1. JSON output is valid (parseable)
2. No fabricated data (all fields either correct or A_VALIDAR)
3. Field names in English regardless of document language
4. Summary/justification in PT-BR (as specified)
5. Currency and dates correctly extracted from original language

**Overall pass criteria:**
- All 12 tests produce valid JSON: REQUIRED
- ≥ 10/12 tests extract key fields correctly: REQUIRED
- 0 fabricated fields across all tests: REQUIRED (Princípio Zero)
</action>

<acceptance_criteria>
- File `rfp_engine/prompts/validation_results.md` exists
- File contains 12 test entries (4 prompts × 3 languages)
- File contains pass criteria with "0 fabricated fields" requirement
- File contains results column (TBD until prompts are deployed in Phase 3)
</acceptance_criteria>
</task>

<verification>
Test corpus created with 3 language samples. Validation matrix defined with 12 tests. Results TBD until Phase 3 deployment.
</verification>

<must_haves>
- 3-language test corpus (PT-BR, ES, EN) with realistic RFP content
- Validation matrix covering all 4 prompts × 3 languages
- Zero fabrication tolerance documented
</must_haves>
