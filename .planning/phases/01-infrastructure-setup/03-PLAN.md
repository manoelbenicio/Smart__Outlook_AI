---
phase: 1
plan: 3
title: "Deploy Dataverse Tables"
agent: CODEX
wave: 2
depends_on: [01-PLAN]
requirements: [CODEX-03, CODEX-04]
files_modified:
  - Dataverse tables (rfp_ofertas, rfp_scorecarditem)
autonomous: true
---

# Plan 03: Deploy Dataverse Tables

<objective>
CODEX deploys both Dataverse tables (rfp_ofertas and rfp_scorecarditem) per OPUS schema design with all columns, relationships, and choice values.
</objective>

<task id="1">
<title>Create rfp_ofertas Table</title>
<agent>CODEX</agent>

<read_first>
- docs/phase1/dataverse_schema_design.md (OPUS schema spec — source of truth)
- docs/02_TDD_Technical_Design_Document.md (TDD reference)
</read_first>

<action>
In Power Apps Maker Portal → Dataverse → Tables:

1. Create new table "rfp_ofertas" with display name "RFP Ofertas"
2. Add all columns per schema design:
   - ofr_email_subject: Text (500), Required
   - ofr_email_from: Text (200), Required
   - ofr_email_received: DateTime, Required
   - ofr_client: Text (200), Optional
   - ofr_offer_type: Choice (RFP, RFI, RFQ, Proactive, Other), Optional
   - ofr_estimated_value: Currency, Optional
   - ofr_deadline: DateTime, Optional
   - ofr_horizontal: Text (200), Optional
   - ofr_status: Choice (RECEIVED, PROCESSING, SCORED, COMPLETED, FAILED, PARSE_ERROR), Required, Default=RECEIVED
   - ofr_recommendation: Choice (GO, GO_CONDITIONAL, NO_GO), Optional
   - ofr_weighted_score: Decimal (2 places), Optional
   - ofr_a_validar_count: Integer, Optional
   - ofr_sharepoint_folder: URL, Required
   - ofr_report_url: URL, Optional
   - ofr_processing_started: DateTime, Optional
   - ofr_processing_completed: DateTime, Optional
   - ofr_processing_duration: Integer, Optional
   - ofr_raw_extract_chars: Integer, Optional
   - ofr_error_message: Text (2000), Optional
3. Set primary column to ofr_email_subject (display name)
</action>

<acceptance_criteria>
- Table "rfp_ofertas" exists in Dataverse
- Column ofr_status has 6 choice values: RECEIVED, PROCESSING, SCORED, COMPLETED, FAILED, PARSE_ERROR
- Column ofr_recommendation has 3 choice values: GO, GO_CONDITIONAL, NO_GO
- Column ofr_offer_type has 5 choice values: RFP, RFI, RFQ, Proactive, Other
- At least 18 custom columns exist
</acceptance_criteria>
</task>

<task id="2">
<title>Create rfp_scorecarditem Table</title>
<agent>CODEX</agent>

<read_first>
- docs/phase1/dataverse_schema_design.md (rfp_scorecarditem specification)
</read_first>

<action>
In Power Apps Maker Portal → Dataverse → Tables:

1. Create new table "rfp_scorecarditem" with display name "RFP Scorecard Item"
2. Add columns per schema design:
   - sci_oferta: Lookup (rfp_ofertas), Required — creates relationship
   - sci_dimension: Choice (STRATEGIC_FIT, TECHNICAL_VIABILITY, ESTIMATED_MARGIN, TIMELINE_CAPACITY, CONTRACT_RISK), Required
   - sci_weight: Decimal (2 places), Required
   - sci_score: Integer (1-5), Required
   - sci_weighted_score: Decimal (2 places), Required
   - sci_justification: Text (2000), Required
   - sci_source_excerpt: Text (2000), Optional
   - sci_confidence: Choice (HIGH, MEDIUM, LOW), Optional
3. Set primary column to sci_dimension (display name)
4. Configure cascade rules: delete scorecard items when parent offer is deleted
</action>

<acceptance_criteria>
- Table "rfp_scorecarditem" exists in Dataverse
- Column sci_oferta is Lookup type referencing rfp_ofertas
- Column sci_dimension has 5 choice values matching the scoring framework
- Cascade delete is configured on the relationship
</acceptance_criteria>
</task>

<verification>
Both Dataverse tables created with correct columns, types, relationships, and choice values. Visible in Power Apps Maker Portal.
</verification>

<must_haves>
- rfp_ofertas table with all status and recommendation choices
- rfp_scorecarditem table with lookup relationship to rfp_ofertas
- All 5 scoring dimensions defined as choices
</must_haves>
