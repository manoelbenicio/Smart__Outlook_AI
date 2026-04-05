---
phase: 1
plan: 2
title: "Deploy SharePoint Site & Document Libraries"
agent: CODEX
wave: 2
depends_on: [01-PLAN]
requirements: [CODEX-01, CODEX-02, CODEX-05]
files_modified:
  - sites/OfertasDN (SharePoint)
autonomous: true
---

# Plan 02: Deploy SharePoint Site & Document Libraries

<objective>
CODEX deploys the SharePoint site /sites/OfertasDN/ with all 4 document libraries per OPUS design spec, and uploads the Word template.
</objective>

<task id="1">
<title>Create SharePoint Site</title>
<agent>CODEX</agent>

<read_first>
- docs/phase1/sharepoint_site_design.md (OPUS design spec — source of truth)
- docs/01_SAD_Solution_Architecture_Document.md (architecture reference)
</read_first>

<action>
In SharePoint Admin Center or via Power Platform:
1. Create a new Team Site named "OfertasDN" at URL /sites/OfertasDN/
2. Set site description: "RFP Auto-Diligence Pipeline — Automated offer processing"
3. Set site owner to service account
4. Configure external sharing: OFF (internal only)
</action>

<acceptance_criteria>
- SharePoint site /sites/OfertasDN/ is accessible
- Site name is "OfertasDN"
- External sharing is disabled
</acceptance_criteria>
</task>

<task id="2">
<title>Create Document Libraries</title>
<agent>CODEX</agent>

<read_first>
- docs/phase1/sharepoint_site_design.md (library definitions and permissions)
</read_first>

<action>
In the OfertasDN SharePoint site, create 4 document libraries:
1. **Templates** — Default view, no custom columns needed
2. **Input** — Add metadata column "OfferID" (Single line of text)
3. **Extracted** — Add metadata column "OfferID" (Single line of text)
4. **Output** — Add metadata columns "OfferID" (Single line of text), "ReportType" (Choice: PDF, JSON)

Set permissions per design spec:
- Service account: Full Control on all 4 libraries
- Architecture team group: Read on Output, Templates
- Power Automate connector identity: Contribute on Input, Extracted, Output
</action>

<acceptance_criteria>
- Library "Templates" exists in /sites/OfertasDN/
- Library "Input" exists with "OfferID" column
- Library "Extracted" exists with "OfferID" column
- Library "Output" exists with "OfferID" and "ReportType" columns
- Service account has Full Control on all libraries
</acceptance_criteria>
</task>

<task id="3">
<title>Upload Word Template</title>
<agent>CODEX</agent>

<read_first>
- docs/phase1/word_template_design.md (content controls specification)
</read_first>

<action>
1. Create GO_NO_GO_Report.docx based on OPUS design spec (docs/phase1/word_template_design.md)
2. Insert all content controls with exact names matching the spec
3. Upload to /sites/OfertasDN/Templates/GO_NO_GO_Report.docx
4. Verify content controls are accessible by Power Automate "Populate template" action
</action>

<acceptance_criteria>
- File GO_NO_GO_Report.docx exists in /sites/OfertasDN/Templates/
- File opens correctly in Word Online
- Content controls are visible and named per design spec
</acceptance_criteria>
</task>

<verification>
SharePoint site /sites/OfertasDN/ accessible with 4 libraries, Word template uploaded and content controls validated.
</verification>

<must_haves>
- SharePoint site created and accessible
- All 4 document libraries with correct metadata columns
- Word template uploaded with content controls
</must_haves>
