# Prompt Validation Matrix — Phase 2

**Version:** 1.0
**Date:** 2026-04-05
**Agent:** OPUS 4.6

---

## Validation Matrix (4 Prompts × 3 Languages = 12 Tests)

| Test ID | Prompt | Language | Input File | Key Expected Values | Result | A_VALIDAR Count | Fabrication Check | Notes |
|---------|--------|----------|------------|--------------------:|--------|:---:|:---:|-------|
| V-01 | Classify_Offer | PT-BR | test_ptbr.txt | offer_type=RFP, client=TechBR Soluções, value=2500000, currency=BRL, deadline=2026-04-30 | TBD | TBD | TBD | |
| V-02 | Classify_Offer | ES | test_es.txt | offer_type=RFP, client=Grupo Energía Latam, value=850000, currency=USD, deadline=2026-05-15 | TBD | TBD | TBD | |
| V-03 | Classify_Offer | EN | test_en.txt | offer_type=RFP, client=Global Finance Corp, value=1200000, currency=EUR, deadline=2026-05-25 | TBD | TBD | TBD | |
| V-04 | Extract_Fields | PT-BR | test_ptbr.txt | 5 sections, scope.duration=12, SAP modules, penalty 2%/week | TBD | TBD | TBD | |
| V-05 | Extract_Fields | ES | test_es.txt | 5 sections, scope.duration=8, AWS services, penalty USD 10K/hr | TBD | TBD | TBD | |
| V-06 | Extract_Fields | EN | test_en.txt | 5 sections, scope.duration=10, ML frameworks, latency <100ms SLA | TBD | TBD | TBD | |
| V-07 | Tech_Practices | PT-BR | test_ptbr.txt | tech: SAP S/4HANA, ABAP, Fiori; cert: SAP, PMP; fit=STRONG | TBD | N/A | TBD | |
| V-08 | Tech_Practices | ES | test_es.txt | tech: AWS (EC2,RDS,EKS), Terraform, Docker; cert: AWS SA Pro; fit=STRONG | TBD | N/A | TBD | |
| V-09 | Tech_Practices | EN | test_en.txt | tech: TensorFlow/PyTorch, Spark, Kafka; cert: AWS ML; complexity=HIGH | TBD | N/A | TBD | |
| V-10 | GoNoGo_Score | PT-BR | test_ptbr.txt | 5 dims scored, weighted_total > 3.5, recommendation=GO (SAP = core Minsait) | TBD | TBD | TBD | |
| V-11 | GoNoGo_Score | ES | test_es.txt | 5 dims scored, weighted_total ~3.5, recommendation=GO (AWS = core Minsait) | TBD | TBD | TBD | |
| V-12 | GoNoGo_Score | EN | test_en.txt | 5 dims scored, weighted_total ~3.0, GO_COND (AI/ML = moderate Minsait fit) | TBD | TBD | TBD | |

---

## Pass Criteria

| Criterion | Requirement | Status |
|-----------|-------------|--------|
| Valid JSON | All 12 tests produce parseable JSON | TBD |
| Key field accuracy | ≥ 10/12 tests extract key fields correctly | TBD |
| Zero fabrication | 0 fabricated fields across all 12 tests | TBD (Princípio Zero) |
| A_VALIDAR correctness | A_VALIDAR used only for genuinely absent data | TBD |
| PT-BR summaries | Summaries/justifications in PT-BR regardless of source language | TBD |
| Date normalization | All dates in YYYY-MM-DD format | TBD |
| Currency extraction | Correct currency code + value separated | TBD |
| Chain integrity | Prompt 4 correctly uses outputs from Prompts 1+2+3 | TBD |

---

## Testing Protocol

1. **Phase 3 Deploy** → Each prompt deployed to AI Builder as specified
2. **Test execution** → Run each test_*.txt through each prompt sequentially
3. **Chain test** → Run full pipeline: Prompt 1 → 2 → 3 → 4 with same document
4. **Record results** → Update TBD columns with actual outputs
5. **Gate review** → Results reviewed by OPUS before Phase 4

---

*Results to be filled in Phase 3 (AI Prompt Deployment) after prompts are deployed to AI Builder.*
*Designed by: OPUS 4.6 — 2026-04-05*
