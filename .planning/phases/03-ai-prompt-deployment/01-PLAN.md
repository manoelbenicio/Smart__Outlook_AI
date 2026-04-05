---
phase: 3
plan: 1
title: "Deploy 4 AI Builder Prompts"
agent: CODEX
wave: 1
depends_on: []
requirements: [CODEX-08, CODEX-09, CODEX-10, CODEX-11]
files_modified:
  - AI Builder (Power Platform)
autonomous: false
---

# Plan 01: Deploy 4 AI Builder Prompts

<objective>
CODEX deploys all 4 AI Builder prompts in the Power Platform environment using the exact system instructions, JSON schemas, and temperature settings designed by OPUS in Phase 2. Marked non-autonomous because it requires Power Platform portal interaction.
</objective>

<task id="1">
<title>Deploy Prompt 1: Classify_Offer</title>
<agent>CODEX</agent>

<read_first>
- rfp_engine/prompts/01_classify_offer.md (OPUS design spec — source of truth)
- .planning/research/PITFALLS.md (P2: token limits, P3: JSON parse failures)
</read_first>

<action>
In Power Platform → AI Builder → Prompt Builder:

1. Create new prompt named "RFP_Classify_Offer"
2. Set model: GPT-4o
3. Set temperature: 0.1
4. Copy system instruction EXACTLY from rfp_engine/prompts/01_classify_offer.md
5. Configure input parameters:
   - `email_subject` (Text)
   - `email_from` (Text)
   - `email_date` (Text)
   - `attachment_names` (Text)
   - `document_text` (Text — max 50K chars)
6. Configure output: JSON format matching the schema in the design spec
7. Save and publish the prompt
8. Document the prompt ID/name for Flow integration
</action>

<acceptance_criteria>
- Prompt "RFP_Classify_Offer" exists in AI Builder
- Prompt uses GPT-4o model
- Temperature is set to 0.1
- System instruction contains "A_VALIDAR" and "NEVER fabricate"
- Prompt has 5 input parameters
- Prompt is published (not draft)
</acceptance_criteria>
</task>

<task id="2">
<title>Deploy Prompt 2: Extract_Fields</title>
<agent>CODEX</agent>

<read_first>
- rfp_engine/prompts/02_extract_fields.md (OPUS design spec — source of truth)
</read_first>

<action>
In AI Builder → Prompt Builder:

1. Create new prompt named "RFP_Extract_Fields"
2. Set model: GPT-4o, temperature: 0.1
3. Copy system instruction from rfp_engine/prompts/02_extract_fields.md
4. Configure input parameters:
   - `classification_json` (Text — output from Prompt 1)
   - `document_text` (Text — max 100K chars)
5. Configure output: JSON with 5 sections (rfp_meta, scope, delivery, commercial, legal)
6. Save and publish
</action>

<acceptance_criteria>
- Prompt "RFP_Extract_Fields" exists in AI Builder
- Temperature is 0.1
- System instruction contains 5 output sections: rfp_meta, scope, delivery, commercial, legal
- Prompt has 2 input parameters (classification_json, document_text)
- Prompt is published
</acceptance_criteria>
</task>

<task id="3">
<title>Deploy Prompt 3: Tech_Practices</title>
<agent>CODEX</agent>

<read_first>
- rfp_engine/prompts/03_tech_practices.md (OPUS design spec — source of truth)
</read_first>

<action>
In AI Builder → Prompt Builder:

1. Create new prompt named "RFP_Tech_Practices"
2. Set model: GPT-4o, temperature: 0.1
3. Copy system instruction from rfp_engine/prompts/03_tech_practices.md
4. Configure input parameters:
   - `document_text` (Text — max 100K chars)
5. Configure output: JSON with technologies, methodologies, certifications, practices, minsait_capability_match
6. Save and publish
</action>

<acceptance_criteria>
- Prompt "RFP_Tech_Practices" exists in AI Builder
- Temperature is 0.1
- System instruction separates "required" from "preferred"
- System instruction contains "minsait_capability_match"
- Prompt has 1 input parameter (document_text)
- Prompt is published
</acceptance_criteria>
</task>

<task id="4">
<title>Deploy Prompt 4: GoNoGo_Score</title>
<agent>CODEX</agent>

<read_first>
- rfp_engine/prompts/04_gonogo_score.md (OPUS design spec — source of truth)
</read_first>

<action>
In AI Builder → Prompt Builder:

1. Create new prompt named "RFP_GoNoGo_Score"
2. Set model: GPT-4o, temperature: 0.1
3. Copy system instruction from rfp_engine/prompts/04_gonogo_score.md
4. Configure input parameters:
   - `classification_json` (Text — from Prompt 1)
   - `extracted_fields_json` (Text — from Prompt 2)
   - `tech_catalog_json` (Text — from Prompt 3)
   - `document_text` (Text — first 50K chars)
5. Configure output: JSON with dimensions array, weighted_total, recommendation
6. Save and publish
</action>

<acceptance_criteria>
- Prompt "RFP_GoNoGo_Score" exists in AI Builder
- Temperature is 0.1
- System instruction contains weights: 25, 20, 20, 15, 20
- System instruction contains thresholds: GO >= 3.5, NO_GO < 2.5
- Prompt has 4 input parameters
- Prompt is published
</acceptance_criteria>
</task>

<verification>
All 4 prompts visible in AI Builder studio, all published, all with correct GPT-4o model and temperature 0.1.
</verification>

<must_haves>
- 4 AI Builder prompts deployed and published
- All using GPT-4o at temperature 0.1
- Input/output schemas match OPUS design specs exactly
</must_haves>
