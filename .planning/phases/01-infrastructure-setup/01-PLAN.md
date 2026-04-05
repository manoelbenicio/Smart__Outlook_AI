---
phase: 1
plan: 1
title: "Design SharePoint Site Structure & Dataverse Schema"
agent: OPUS
wave: 1
depends_on: []
requirements: [OPUS-01, OPUS-02, OPUS-03]
files_modified:
  - docs/phase1/sharepoint_site_design.md
  - docs/phase1/dataverse_schema_design.md
  - docs/phase1/word_template_design.md
autonomous: true
---

# Plan 01: Design SharePoint Site Structure & Dataverse Schema

<objective>
OPUS designs all Phase 1 infrastructure artifacts: SharePoint site structure, Dataverse table schemas, and Word template layout. These designs become the spec for CODEX to deploy.
</objective>

<task id="1">
<title>Design SharePoint Site Structure</title>
<agent>OPUS</agent>

<read_first>
- .planning/PROJECT.md (project context and constraints)
- .planning/REQUIREMENTS.md (OPUS-01 details)
- .planning/research/ARCHITECTURE.md (URL-based file passing pattern)
- docs/01_SAD_Solution_Architecture_Document.md (approved architecture)
</read_first>

<action>
Create `docs/phase1/sharepoint_site_design.md` with:

1. **Site URL:** /sites/OfertasDN/
2. **Document Libraries:**
   - `Templates` — Stores GO_NO_GO_Report.docx template. Read-only for flows.
   - `Input` — Stores raw email attachments per offer. Structure: `/Input/OFR-{yyyyMMdd-HHmmss}/`
   - `Extracted` — Stores extracted text files. Structure: `/Extracted/OFR-{yyyyMMdd-HHmmss}/`
   - `Output` — Stores generated reports + JSON outputs. Structure: `/Output/OFR-{yyyyMMdd-HHmmss}/`
3. **Permissions:**
   - Service account: Full Control on all libraries
   - Architecture team: Read on Output, Templates
   - Power Automate connections: Contribute on Input, Extracted, Output
4. **Folder naming convention:** `OFR-{yyyyMMdd-HHmmss}` — unique per offer, timestamp-based
5. **Metadata columns per library** (if any)
</action>

<acceptance_criteria>
- File `docs/phase1/sharepoint_site_design.md` exists
- File contains "OFR-{yyyyMMdd-HHmmss}" as folder naming convention
- File contains 4 library definitions: Templates, Input, Extracted, Output
- File contains permissions matrix with service account, Architecture team roles
</acceptance_criteria>
</task>

<task id="2">
<title>Design Dataverse Table Schemas</title>
<agent>OPUS</agent>

<read_first>
- .planning/REQUIREMENTS.md (OPUS-02 specification)
- docs/02_TDD_Technical_Design_Document.md (existing Dataverse schema draft)
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (field mapping reference)
</read_first>

<action>
Create `docs/phase1/dataverse_schema_design.md` with complete schema for both tables:

**Table 1: rfp_ofertas**
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ofr_id | AutoNumber | Yes | Primary key, format OFR-{seq} |
| ofr_email_subject | Text (500) | Yes | Email subject line |
| ofr_email_from | Text (200) | Yes | Sender email address |
| ofr_email_received | DateTime | Yes | Email received timestamp |
| ofr_client | Text (200) | No | Client name (from AI classification) |
| ofr_offer_type | Choice | No | RFP/RFI/RFQ/Proactive/Other |
| ofr_estimated_value | Currency | No | Estimated value (from AI) |
| ofr_deadline | DateTime | No | Submission deadline (from AI) |
| ofr_horizontal | Text (200) | No | Technology horizontal (from AI) |
| ofr_status | Choice | Yes | RECEIVED/PROCESSING/SCORED/COMPLETED/FAILED/PARSE_ERROR |
| ofr_recommendation | Choice | No | GO/GO_CONDITIONAL/NO_GO |
| ofr_weighted_score | Decimal | No | Weighted total score (0-5) |
| ofr_a_validar_count | Integer | No | Count of A_VALIDAR fields |
| ofr_sharepoint_folder | URL | Yes | Link to SharePoint Input folder |
| ofr_report_url | URL | No | Link to generated PDF report |
| ofr_processing_started | DateTime | No | Flow 2 start timestamp |
| ofr_processing_completed | DateTime | No | Flow 3 end timestamp |
| ofr_processing_duration | Integer | No | Duration in seconds |
| ofr_raw_extract_chars | Integer | No | Character count of raw_extract |
| ofr_error_message | Text (2000) | No | Error details if FAILED/PARSE_ERROR |

**Table 2: rfp_scorecarditem**
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| sci_id | AutoNumber | Yes | Primary key |
| sci_oferta | Lookup (rfp_ofertas) | Yes | Foreign key to parent offer |
| sci_dimension | Choice | Yes | STRATEGIC_FIT/TECHNICAL_VIABILITY/ESTIMATED_MARGIN/TIMELINE_CAPACITY/CONTRACT_RISK |
| sci_weight | Decimal | Yes | Weight percentage (25/20/20/15/20) |
| sci_score | Integer | Yes | Score 1-5 |
| sci_weighted_score | Decimal | Yes | score × weight / 100 |
| sci_justification | Text (2000) | Yes | AI-generated justification |
| sci_source_excerpt | Text (2000) | No | Excerpt from document supporting score |
| sci_confidence | Choice | No | HIGH/MEDIUM/LOW |
</action>

<acceptance_criteria>
- File `docs/phase1/dataverse_schema_design.md` exists
- File contains table `rfp_ofertas` with at least 15 columns defined
- File contains table `rfp_scorecarditem` with `sci_oferta` as Lookup type
- File contains Choice values for ofr_status: "RECEIVED/PROCESSING/SCORED/COMPLETED/FAILED/PARSE_ERROR"
- File contains Choice values for sci_dimension with all 5 dimensions
</acceptance_criteria>
</task>

<task id="3">
<title>Design Word Template Layout</title>
<agent>OPUS</agent>

<read_first>
- .planning/REQUIREMENTS.md (OPUS-03 specification)
- MASTER_PROMPT_RFP_Diligence_Orchestrator_v2.1_STRICT.md (output format reference)
</read_first>

<action>
Create `docs/phase1/word_template_design.md` documenting the GO_NO_GO_Report.docx template with:

1. **Content Controls list** — each control name mapped to Dataverse field:
   - `{{ofr_client}}` → rfp_ofertas.ofr_client
   - `{{ofr_offer_type}}` → rfp_ofertas.ofr_offer_type
   - `{{ofr_deadline}}` → rfp_ofertas.ofr_deadline
   - `{{ofr_recommendation}}` → rfp_ofertas.ofr_recommendation
   - `{{scorecard_table}}` → Repeating section from rfp_scorecarditem
   - `{{a_validar_list}}` → Fields marked A_VALIDAR
   - Plus all other mapped fields

2. **Layout sections:** Header (logo, date, offer ID), Executive Summary, Classification, Scorecard Table (5 rows), Field Details, A_VALIDAR Items, Recommendation, Footer

3. **Formatting notes:** Corporate branding colors, Minsait logo placeholder, professional fonts
</action>

<acceptance_criteria>
- File `docs/phase1/word_template_design.md` exists
- File contains at least 10 content control mappings
- File contains section layout with "Scorecard Table" and "A_VALIDAR" sections
- File references Dataverse column names matching the schema in task 2
</acceptance_criteria>
</task>

<verification>
All 3 design documents exist in docs/phase1/ with complete specifications that CODEX can use as deployment specs.
</verification>

<must_haves>
- SharePoint site design with 4 libraries and folder naming convention
- Dataverse schema with both tables fully specified
- Word template layout with content control mappings
</must_haves>
