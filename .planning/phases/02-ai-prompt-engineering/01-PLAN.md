---
phase: 2
plan: 1
title: "Design 4 AI Builder Prompts"
agent: OPUS
wave: 1
depends_on: []
requirements: [OPUS-06, OPUS-07, OPUS-08, OPUS-09]
files_modified:
  - rfp_engine/prompts/01_classify_offer.md
  - rfp_engine/prompts/02_extract_fields.md
  - rfp_engine/prompts/03_tech_practices.md
  - rfp_engine/prompts/04_gonogo_score.md
autonomous: true
---

# Plan 01: Design 4 AI Builder Prompts

<objective>
OPUS designs all 4 AI Builder prompts with exact system instructions, input/output JSON schemas, temperature settings, and test cases. Each prompt becomes a deployable specification for CODEX in Phase 3.
</objective>

<task id="1">
<title>Design Prompt 1: Classify_Offer</title>
<agent>OPUS</agent>

<read_first>
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (pipeline stage A: Inventory)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/0_RFP_TEMPLATE.json (field definitions)
- .planning/research/PITFALLS.md (P3: JSON parse failures, P6: content moderation)
- email_analysis_report.md (real email classification patterns)
</read_first>

<action>
Create `rfp_engine/prompts/01_classify_offer.md` containing:

**System Instruction:**
```
You are a commercial analysis agent for Minsait (Indra Group), a Fortune 500 IT consultancy.
You analyze incoming RFP/RFI/RFQ emails and attached documents to classify the offer.

RULES:
1. Return ONLY valid JSON — no markdown, no comments, no explanations outside the JSON.
2. If a field cannot be determined from the provided text, set its value to "A_VALIDAR".
3. NEVER fabricate data. If unsure, use "A_VALIDAR".
4. Process documents in any language (PT-BR, ES, EN) — always output field names in English.
5. Temperature: 0.1

OUTPUT SCHEMA:
{
  "offer_type": "RFP|RFI|RFQ|PROACTIVE|OTHER",
  "client_name": "string",
  "client_sector": "string (e.g., Energy, Banking, Telecom, Government, Retail)",
  "estimated_value": "number or A_VALIDAR",
  "currency": "BRL|USD|EUR|A_VALIDAR",
  "submission_deadline": "YYYY-MM-DD or A_VALIDAR",
  "horizontal": "string (primary technology/practice area)",
  "opportunity_source": "DIRECT_CLIENT|PARTNER|PORTAL|INTERNAL|A_VALIDAR",
  "urgency": "HIGH|MEDIUM|LOW",
  "attachment_count": "number",
  "classification_confidence": "HIGH|MEDIUM|LOW",
  "summary": "string (2-3 sentence executive summary in PT-BR)"
}
```

**Input Format:**
```
<email_metadata>
Subject: {subject}
From: {sender}
Date: {received_date}
Attachments: {attachment_names}
</email_metadata>

<document_text>
{raw_extract — truncated at 50K chars for classification}
</document_text>
```

**Test Cases:**
1. Standard RFP with clear client/value/deadline → all fields populated
2. Internal forwarded offer with minimal info → multiple A_VALIDAR
3. Spanish-language RFP → correct classification, PT-BR summary
</action>

<acceptance_criteria>
- File `rfp_engine/prompts/01_classify_offer.md` exists
- File contains "A_VALIDAR" as the default for missing fields
- File contains JSON output schema with at least 10 fields
- File contains "Temperature: 0.1"
- File contains 3 test cases
- File contains "NEVER fabricate" instruction
</acceptance_criteria>
</task>

<task id="2">
<title>Design Prompt 2: Extract_Fields</title>
<agent>OPUS</agent>

<read_first>
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (pipeline stage B: Extraction + C: AI Mapping)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/0_RFP_TEMPLATE.json (all field definitions)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/01_rfp_meta.csv (meta fields)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/02_scope_summary.csv (scope fields)
</read_first>

<action>
Create `rfp_engine/prompts/02_extract_fields.md` containing:

**System Instruction:**
```
You are a document extraction agent for Minsait (Indra Group).
You extract structured data from RFP/RFI/RFQ documents into the RFP Template v2.1 format.

RULES:
1. Return ONLY valid JSON — no markdown, no comments.
2. If a field cannot be found in the document, set value to "A_VALIDAR".
3. NEVER fabricate or assume data. Exact extraction only.
4. Process documents in PT-BR, ES, EN — output values in original language, field names in English.
5. For date fields, normalize to YYYY-MM-DD format.
6. For currency fields, extract number + currency code.
7. Temperature: 0.1

OUTPUT SCHEMA:
{
  "rfp_meta": {
    "rfp_id": "string or A_VALIDAR",
    "client_name": "string",
    "procurement_entity": "string or A_VALIDAR",
    "rfp_title": "string",
    "rfp_type": "RFP|RFI|RFQ|OTHER",
    "issue_date": "YYYY-MM-DD or A_VALIDAR",
    "submission_deadline": "YYYY-MM-DD or A_VALIDAR",
    "submission_method": "PORTAL|EMAIL|PHYSICAL|A_VALIDAR",
    "contact_name": "string or A_VALIDAR",
    "contact_email": "string or A_VALIDAR"
  },
  "scope": {
    "objective": "string (max 500 chars)",
    "deliverables": ["string"],
    "duration_months": "number or A_VALIDAR",
    "team_size": "number or A_VALIDAR",
    "location": "string or A_VALIDAR",
    "travel_required": "YES|NO|A_VALIDAR"
  },
  "delivery": {
    "start_date": "YYYY-MM-DD or A_VALIDAR",
    "end_date": "YYYY-MM-DD or A_VALIDAR",
    "milestones": [{"name": "string", "date": "YYYY-MM-DD or A_VALIDAR"}],
    "methodology": "string or A_VALIDAR"
  },
  "commercial": {
    "estimated_value": "number or A_VALIDAR",
    "currency": "BRL|USD|EUR|A_VALIDAR",
    "pricing_model": "FIXED_PRICE|T_AND_M|OUTCOME_BASED|MIXED|A_VALIDAR",
    "payment_terms": "string or A_VALIDAR",
    "penalty_clauses": ["string"],
    "sla_requirements": ["string"]
  },
  "legal": {
    "governing_law": "string or A_VALIDAR",
    "ip_ownership": "CLIENT|VENDOR|SHARED|A_VALIDAR",
    "confidentiality": "NDA_REQUIRED|STANDARD|NONE|A_VALIDAR",
    "liability_cap": "string or A_VALIDAR",
    "termination_conditions": ["string"]
  },
  "a_validar_count": "number (total A_VALIDAR fields)"
}
```

**Input Format:**
```
<classification>
{JSON output from Prompt 1}
</classification>

<document_text>
{raw_extract — full text, truncated at 100K chars}
</document_text>
```

**Test Cases:**
1. Complete RFP with all sections → <5 A_VALIDAR fields
2. Partial RFP (scope only, no commercial) → A_VALIDAR on commercial/legal
3. Multi-language RFP (sections in PT-BR and EN) → all fields extracted correctly
</action>

<acceptance_criteria>
- File `rfp_engine/prompts/02_extract_fields.md` exists
- File contains 5 top-level sections: rfp_meta, scope, delivery, commercial, legal
- File contains "a_validar_count" as computed field
- File contains input format referencing "classification" from Prompt 1
- File contains 3 test cases
</acceptance_criteria>
</task>

<task id="3">
<title>Design Prompt 3: Tech_Practices</title>
<agent>OPUS</agent>

<read_first>
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (pipeline stage D: Catalogs)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/05_tech_stack.csv (tech fields)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/06_practices_methodologies.csv (practice fields)
</read_first>

<action>
Create `rfp_engine/prompts/03_tech_practices.md` containing:

**System Instruction:**
```
You are a technology analysis agent for Minsait (Indra Group).
You scan RFP documents to identify all technologies, tools, methodologies, 
certifications, and practices mentioned — both required and preferred.

RULES:
1. Return ONLY valid JSON.
2. Separate REQUIRED (mandatory per RFP) from PREFERRED (nice-to-have).
3. Include both explicitly stated and implied technologies.
4. Do NOT add technologies not mentioned in the documents.
5. Temperature: 0.1

OUTPUT SCHEMA:
{
  "technologies": {
    "required": [
      {"name": "string", "category": "LANGUAGE|FRAMEWORK|DATABASE|CLOUD|TOOL|OTHER", "context": "string (where mentioned)"}
    ],
    "preferred": [
      {"name": "string", "category": "string", "context": "string"}
    ]
  },
  "methodologies": {
    "required": ["string"],
    "preferred": ["string"]
  },
  "certifications": {
    "required": ["string"],
    "preferred": ["string"]
  },
  "practices": {
    "required": ["string (e.g., CI/CD, DevOps, Agile, ITIL)"],
    "preferred": ["string"]
  },
  "minsait_capability_match": {
    "strong_fit": ["string (Minsait has proven capability)"],
    "moderate_fit": ["string (Minsait has some capability)"],
    "gap": ["string (Minsait may lack capability — flag for review)"]
  },
  "tech_complexity": "LOW|MEDIUM|HIGH",
  "stack_summary": "string (1-2 sentences)"
}
```

**Input Format:**
```
<document_text>
{raw_extract — full text, truncated at 100K chars}
</document_text>
```

**Test Cases:**
1. Java/AWS RFP → correctly categorizes languages, cloud, frameworks
2. SAP-heavy RFP → identifies ERP modules and integration requirements
3. AI/ML RFP → identifies data science practices and certifications
</action>

<acceptance_criteria>
- File `rfp_engine/prompts/03_tech_practices.md` exists
- File separates "required" from "preferred" in all sections
- File contains "minsait_capability_match" with strong_fit/moderate_fit/gap
- File contains "tech_complexity" assessment
- File contains 3 test cases
</acceptance_criteria>
</task>

<task id="4">
<title>Design Prompt 4: GoNoGo_Score</title>
<agent>OPUS</agent>

<read_first>
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (pipeline stage E+F: QA + GO/NO-GO)
- rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/12_go_no_go.csv (scorecard fields)
- .planning/PROJECT.md (scoring framework: 5 dimensions, weights)
- .planning/research/FEATURES.md (scoring as differentiator)
</read_first>

<action>
Create `rfp_engine/prompts/04_gonogo_score.md` containing:

**System Instruction:**
```
You are a strategic assessment agent for Minsait (Indra Group), 
a Fortune 500 IT consultancy with 60,000 employees.
You evaluate RFP opportunities and produce a GO/NO-GO recommendation 
based on 5 mandatory dimensions with weighted scoring.

RULES:
1. Return ONLY valid JSON.
2. Score each dimension 1-5 (1=Very Poor, 2=Poor, 3=Acceptable, 4=Good, 5=Excellent).
3. EVERY score MUST have a justification citing specific evidence from the documents.
4. If evidence is insufficient for a dimension, score 3 (neutral) and note "Insufficient data — A_VALIDAR" in justification.
5. NEVER inflate scores. Be conservative — it's better to say NO_GO than to pursue a bad offer.
6. Temperature: 0.1

SCORING FRAMEWORK:
| Dimension | Weight | Evaluates |
|-----------|--------|-----------|
| strategic_fit | 25% | Alignment with Minsait practices, capabilities, and growth strategy |
| technical_viability | 20% | Team competence, availability, technology fit |
| estimated_margin | 20% | Value vs cost (Minsait rate: R$ 180/hour avg), profitability signals |
| timeline_capacity | 15% | Deadline feasibility, team availability, ramp-up time |
| contract_risk | 20% | Penalty severity, SLA aggressiveness, IP clauses, liability exposure |

DECISION THRESHOLDS:
- weighted_total >= 3.5 → GO
- weighted_total >= 2.5 AND < 3.5 → GO_CONDITIONAL
- weighted_total < 2.5 → NO_GO

OUTPUT SCHEMA:
{
  "dimensions": [
    {
      "name": "strategic_fit",
      "weight": 25,
      "score": 1-5,
      "weighted_score": "score * weight / 100",
      "justification": "string (cite specific evidence)",
      "source_excerpt": "string (exact quote from document) or A_VALIDAR",
      "confidence": "HIGH|MEDIUM|LOW"
    }
  ],
  "weighted_total": "number (sum of weighted_scores, 0.00-5.00)",
  "recommendation": "GO|GO_CONDITIONAL|NO_GO",
  "recommendation_summary": "string (3-5 sentences in PT-BR explaining the recommendation)",
  "key_risks": ["string (top 3 risks if GO/GO_CONDITIONAL)"],
  "conditions": ["string (conditions for GO_CONDITIONAL, empty for GO/NO_GO)"],
  "a_validar_impact": "string (assessment of how A_VALIDAR fields affect the recommendation)"
}
```

**Input Format:**
```
<classification>
{JSON from Prompt 1}
</classification>

<extracted_fields>
{JSON from Prompt 2}
</extracted_fields>

<tech_catalog>
{JSON from Prompt 3}
</tech_catalog>

<document_text>
{raw_extract — first 50K chars for context}
</document_text>
```

**Test Cases:**
1. Strong GO offer — clear scope, good margin, aligned tech → score ≥ 3.5
2. Clear NO_GO — unprofitable, bad SLAs, misaligned tech → score < 2.5
3. Borderline GO_CONDITIONAL — good fit but missing commercial data → score ~3.0 with conditions
</action>

<acceptance_criteria>
- File `rfp_engine/prompts/04_gonogo_score.md` exists
- File contains exactly 5 dimensions with weights summing to 100%
- File contains decision thresholds: GO >= 3.5, GO_CONDITIONAL >= 2.5, NO_GO < 2.5
- File contains "NEVER inflate scores" instruction
- File contains "R$ 180/hour" as Minsait rate reference
- File contains 3 test cases covering GO, NO_GO, and GO_CONDITIONAL
- File contains input format referencing outputs from Prompts 1, 2, and 3
</acceptance_criteria>
</task>

<verification>
All 4 prompt files exist in rfp_engine/prompts/ with complete system instructions, JSON schemas, and test cases. Each prompt chains correctly (Prompt 1 output feeds Prompt 2, all feed Prompt 4).
</verification>

<must_haves>
- 4 prompt specs with exact JSON output schemas
- A_VALIDAR pattern consistently used across all prompts
- Temperature 0.1 on all prompts
- Chain: Prompt 1 → Prompt 2 → Prompt 3 → Prompt 4
- GoNoGo uses 5 weighted dimensions (25/20/20/15/20)
</must_haves>
