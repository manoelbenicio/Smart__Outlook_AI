# Dataverse Schema Design — RFP Ofertas

**Document:** OPUS-02 Design Specification
**Version:** 1.0
**Date:** 2026-04-05
**Agent:** OPUS 4.6

---

## 1. Table: rfp_ofertas

**Display Name:** RFP Ofertas
**Plural Name:** RFP Ofertas
**Schema Name:** cr_rfp_ofertas (publisher prefix: cr)
**Primary Column:** ofr_email_subject
**Description:** Tracks each RFP/offer received in the Ofertas DN mailbox through the diligence pipeline.
**Row Ownership:** Organization

### 1.1 Columns

| # | Column Name | Display Name | Type | Max Length | Required | Default | Description |
|---|-------------|-------------|------|------------|----------|---------|-------------|
| 1 | ofr_email_subject | Email Subject | Text | 500 | ✓ | — | Original email subject line (Primary Column) |
| 2 | ofr_email_from | Email From | Text | 200 | ✓ | — | Sender email address |
| 3 | ofr_email_received | Email Received | DateTime | — | ✓ | — | Email received timestamp (UTC) |
| 4 | ofr_client | Client | Text | 200 | ✗ | — | Client name (from AI classification) |
| 5 | ofr_offer_type | Offer Type | Choice | — | ✗ | — | See §1.2 |
| 6 | ofr_estimated_value | Estimated Value | Currency | — | ✗ | — | Estimated contract value |
| 7 | ofr_currency | Currency | Choice | — | ✗ | BRL | BRL, USD, EUR |
| 8 | ofr_deadline | Submission Deadline | DateTime | — | ✗ | — | Submission deadline (from AI) |
| 9 | ofr_horizontal | Horizontal | Text | 200 | ✗ | — | Primary technology/practice area |
| 10 | ofr_status | Status | Choice | — | ✓ | RECEIVED | See §1.3 |
| 11 | ofr_recommendation | Recommendation | Choice | — | ✗ | — | See §1.4 |
| 12 | ofr_weighted_score | Weighted Score | Decimal | 2 dec | ✗ | — | Weighted total (0.00-5.00) |
| 13 | ofr_a_validar_count | A_VALIDAR Count | Integer | — | ✗ | 0 | Count of fields marked A_VALIDAR |
| 14 | ofr_sharepoint_folder | SharePoint Folder | URL | 500 | ✓ | — | Link to /Input/OFR-{id}/ folder |
| 15 | ofr_report_url | Report URL | URL | 500 | ✗ | — | Link to generated PDF report |
| 16 | ofr_processing_started | Processing Started | DateTime | — | ✗ | — | Flow 2 start timestamp |
| 17 | ofr_processing_completed | Processing Completed | DateTime | — | ✗ | — | Flow 3 completion timestamp |
| 18 | ofr_processing_duration_sec | Duration (seconds) | Integer | — | ✗ | — | End-to-end processing time |
| 19 | ofr_raw_extract_chars | Raw Extract Size | Integer | — | ✗ | — | Character count of raw_extract |
| 20 | ofr_attachment_count | Attachment Count | Integer | — | ✗ | 0 | Number of email attachments |
| 21 | ofr_error_message | Error Message | Text | 2000 | ✗ | — | Error details if FAILED/PARSE_ERROR |
| 22 | ofr_classification_json | Classification JSON | Text | 4000 | ✗ | — | Raw JSON from Prompt 1 |
| 23 | ofr_gonogo_json | GO/NO-GO JSON | Text | 4000 | ✗ | — | Raw JSON from Prompt 4 |

### 1.2 Choice: ofr_offer_type

| Value | Label | Description |
|-------|-------|-------------|
| 1 | RFP | Request for Proposal |
| 2 | RFI | Request for Information |
| 3 | RFQ | Request for Quotation |
| 4 | PROACTIVE | Proactive offer (not client-initiated) |
| 5 | OTHER | Other/unclassified |

### 1.3 Choice: ofr_status

| Value | Label | Color | Description |
|-------|-------|-------|-------------|
| 1 | RECEIVED | 🔵 Blue | Email captured, awaiting processing |
| 2 | PROCESSING | 🟡 Yellow | Flow 2 running — text extraction + AI |
| 3 | SCORED | 🟠 Orange | AI scoring complete, generating report |
| 4 | COMPLETED | 🟢 Green | Report sent, pipeline finished |
| 5 | FAILED | 🔴 Red | Unrecoverable error |
| 6 | PARSE_ERROR | 🟣 Purple | AI output could not be parsed — manual review needed |

### 1.4 Choice: ofr_recommendation

| Value | Label | Color | Description |
|-------|-------|-------|-------------|
| 1 | GO | 🟢 Green | Pursue the opportunity |
| 2 | GO_CONDITIONAL | 🟡 Yellow | Pursue with conditions/caveats |
| 3 | NO_GO | 🔴 Red | Decline the opportunity |

---

## 2. Table: rfp_scorecarditem

**Display Name:** RFP Scorecard Item
**Plural Name:** RFP Scorecard Items
**Schema Name:** cr_rfp_scorecarditem
**Primary Column:** sci_dimension (display)
**Description:** Individual scoring dimension for an offer's GO/NO-GO assessment. 5 records per offer.
**Row Ownership:** Organization

### 2.1 Columns

| # | Column Name | Display Name | Type | Max Length | Required | Description |
|---|-------------|-------------|------|------------|----------|-------------|
| 1 | sci_oferta | Oferta | Lookup (rfp_ofertas) | — | ✓ | Foreign key to parent offer |
| 2 | sci_dimension | Dimension | Choice | — | ✓ | See §2.2 |
| 3 | sci_weight | Weight (%) | Decimal | 2 dec | ✓ | Weight percentage |
| 4 | sci_score | Score | Integer | 1-5 | ✓ | Score value (1=Very Poor, 5=Excellent) |
| 5 | sci_weighted_score | Weighted Score | Decimal | 2 dec | ✓ | Computed: score × weight / 100 |
| 6 | sci_justification | Justification | Text | 2000 | ✓ | AI-generated reasoning for score |
| 7 | sci_source_excerpt | Source Excerpt | Text | 2000 | ✗ | Exact quote from source document |
| 8 | sci_confidence | Confidence | Choice | — | ✗ | See §2.3 |

### 2.2 Choice: sci_dimension

| Value | Label | Weight | Description |
|-------|-------|--------|-------------|
| 1 | STRATEGIC_FIT | 25% | Alignment with Minsait capabilities and strategy |
| 2 | TECHNICAL_VIABILITY | 20% | Team competence and availability |
| 3 | ESTIMATED_MARGIN | 20% | Value vs cost (rate: R$ 180/h) |
| 4 | TIMELINE_CAPACITY | 15% | Deadline feasibility and team availability |
| 5 | CONTRACT_RISK | 20% | Penalties, SLAs, IP, liability |

### 2.3 Choice: sci_confidence

| Value | Label | Description |
|-------|-------|-------------|
| 1 | HIGH | Strong evidence in documents |
| 2 | MEDIUM | Partial evidence, some inference |
| 3 | LOW | Limited evidence, A_VALIDAR fields impact |

---

## 3. Relationship

| Parent | Child | Type | Behavior |
|--------|-------|------|----------|
| rfp_ofertas | rfp_scorecarditem | 1:N | Cascade delete — when offer is deleted, all scorecard items are deleted |

**Lookup column:** `sci_oferta` on rfp_scorecarditem → `ofr_id` on rfp_ofertas

**Expected cardinality:** Exactly 5 scorecard items per offer (one per dimension)

---

## 4. Views (recommended)

### 4.1 Active Offers
**Filter:** ofr_status ≠ COMPLETED AND ofr_status ≠ FAILED
**Columns:** ofr_email_subject, ofr_client, ofr_status, ofr_deadline, ofr_recommendation
**Sort:** ofr_email_received DESC

### 4.2 Completed Offers
**Filter:** ofr_status = COMPLETED
**Columns:** ofr_email_subject, ofr_client, ofr_recommendation, ofr_weighted_score, ofr_processing_duration_sec
**Sort:** ofr_processing_completed DESC

### 4.3 Failed/Errors
**Filter:** ofr_status = FAILED OR ofr_status = PARSE_ERROR
**Columns:** ofr_email_subject, ofr_status, ofr_error_message, ofr_email_received
**Sort:** ofr_email_received DESC

---

## 5. Business Rules (recommended)

| Rule | Trigger | Action |
|------|---------|--------|
| Auto-set processing duration | ofr_processing_completed changes | Calculate ofr_processing_duration_sec = completed - started |
| Validate score range | sci_score changes | Error if sci_score < 1 OR sci_score > 5 |
| Auto-compute weighted | sci_score or sci_weight changes | sci_weighted_score = sci_score × sci_weight / 100 |

---

## 6. Security Roles

| Role | rfp_ofertas | rfp_scorecarditem |
|------|-------------|-------------------|
| System Administrator | Full CRUD | Full CRUD |
| Power Automate (service account) | Create, Read, Write | Create, Read, Write |
| Architecture Team | Read | Read |
| Bid Managers | Read | Read |

---

*Design by: OPUS 4.6 — 2026-04-05*
*Status: Ready for CODEX deployment (CODEX-03, CODEX-04)*
