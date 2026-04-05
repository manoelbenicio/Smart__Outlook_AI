---
phase: 1
plan: 5
title: "Browser QA — Verify Infrastructure & Gate Review 0→1"
agent: OPUS
wave: 3
depends_on: [02-PLAN, 03-PLAN, 04-PLAN]
requirements: [OPUS-11, OPUS-12, OPUS-22]
files_modified:
  - docs/checkins/S0/gate_review_0_1.md
autonomous: false
---

# Plan 05: Browser QA — Verify Infrastructure & Gate Review 0→1

<objective>
OPUS performs browser-based QA to verify all infrastructure deployed by CODEX (SharePoint, Dataverse, connections), then conducts Gate Review 0→1.
</objective>

<task id="1">
<title>Browser QA — SharePoint Verification</title>
<agent>OPUS</agent>

<read_first>
- docs/phase1/sharepoint_site_design.md (expected state — design spec)
</read_first>

<action>
Open browser and verify:
1. Navigate to /sites/OfertasDN/ — site loads
2. Verify 4 document libraries exist: Templates, Input, Extracted, Output
3. Verify Templates library contains GO_NO_GO_Report.docx
4. Open GO_NO_GO_Report.docx in Word Online — verify content controls visible
5. Verify permissions: Architecture team has Read on Output
6. Take screenshots as evidence

Document findings in `docs/checkins/S0/sharepoint_qa.md`:
- Pass/Fail for each check
- Screenshots embedded
- Timestamp
</action>

<acceptance_criteria>
- File `docs/checkins/S0/sharepoint_qa.md` exists
- File contains Pass/Fail results for all 6 verification checks
- All checks marked Pass OR issues documented with ticket numbers
</acceptance_criteria>
</task>

<task id="2">
<title>Browser QA — Dataverse Verification</title>
<agent>OPUS</agent>

<read_first>
- docs/phase1/dataverse_schema_design.md (expected state — schema spec)
</read_first>

<action>
Open browser → Power Apps Maker Portal → Dataverse → Tables:
1. Verify table "rfp_ofertas" exists
2. Open table → verify all columns match schema spec (names, types, required/optional)
3. Verify ofr_status has 6 choice values
4. Verify ofr_recommendation has 3 choice values
5. Verify table "rfp_scorecarditem" exists
6. Verify sci_oferta column is Lookup to rfp_ofertas
7. Verify sci_dimension has 5 choice values
8. Create a test record in rfp_ofertas and a linked record in rfp_scorecarditem — verify relationship works
9. Delete test records

Document findings in `docs/checkins/S0/dataverse_qa.md`
</action>

<acceptance_criteria>
- File `docs/checkins/S0/dataverse_qa.md` exists
- File confirms both tables exist with correct columns
- File confirms lookup relationship works (tested with sample record)
</acceptance_criteria>
</task>

<task id="3">
<title>Gate Review 0→1</title>
<agent>OPUS</agent>

<read_first>
- docs/05_Agentic_Project_Governance.md (gate review protocol)
- docs/checkins/S0/sharepoint_qa.md (QA results)
- docs/checkins/S0/dataverse_qa.md (QA results)
</read_first>

<action>
Create gate review document `docs/checkins/gates/gate_review_0_1.md`:

1. **Header:** Gate Review 0→1 — Infrastructure Setup
2. **Date/Time:** Current timestamp
3. **Reviewer:** OPUS 4.6
4. **Items reviewed:**
   - SharePoint site: Pass/Fail (from QA)
   - Dataverse tables: Pass/Fail (from QA)
   - Connections: Pass/Fail (from CODEX)
   - Mailbox access: Pass/Fail (from CODEX)
5. **Recommendation:** APPROVE / REJECT / APPROVE WITH CONDITIONS
6. **Signature line:** Awaiting MANOEL approval
7. **SHA-256 hash** of the document content (for integrity per governance protocol)

Present to MANOEL for approval.
</action>

<acceptance_criteria>
- File `docs/checkins/gates/gate_review_0_1.md` exists
- File contains Pass/Fail for all 4 infrastructure items
- File contains recommendation (APPROVE/REJECT)
- File contains SHA-256 hash
- File contains signature line for MANOEL
</acceptance_criteria>
</task>

<verification>
All infrastructure verified via browser. Gate review document created. MANOEL approval pending.
</verification>

<must_haves>
- SharePoint QA documented (Pass/Fail)
- Dataverse QA documented (Pass/Fail)  
- Gate review 0→1 document created with recommendation
</must_haves>
