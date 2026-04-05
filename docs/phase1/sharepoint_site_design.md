# SharePoint Site Design — OfertasDN

**Document:** OPUS-01 Design Specification
**Version:** 1.0
**Date:** 2026-04-05
**Agent:** OPUS 4.6

---

## 1. Site Configuration

| Property | Value |
|----------|-------|
| **Site URL** | `/sites/OfertasDN/` |
| **Site Type** | Team Site (M365 Group) |
| **Site Name** | OfertasDN |
| **Description** | RFP Auto-Diligence Pipeline — Processamento automatizado de ofertas |
| **Language** | Portuguese (Brazil) |
| **External Sharing** | OFF (internal only) |
| **Storage Quota** | Default (25 TB per tenant) |
| **Owner** | Service Account (svc-rfp-pipeline@minsait.com or designated) |

## 2. Document Libraries

### 2.1 Templates

| Property | Value |
|----------|-------|
| **Name** | Templates |
| **Purpose** | Store Word template for GO/NO-GO report generation |
| **Permissions** | Read-only for flows; Full Control for admins |
| **Versioning** | Major versions enabled |
| **Contents** | `GO_NO_GO_Report.docx` |

**Custom Columns:** None required.

---

### 2.2 Input

| Property | Value |
|----------|-------|
| **Name** | Input |
| **Purpose** | Store raw email body (HTML) and all attachments per offer |
| **Permissions** | Contribute for Power Automate; Read for Architecture team |
| **Versioning** | Off (files are write-once) |

**Custom Columns:**

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| OfferID | Single line of text | Yes | Unique offer identifier (OFR-{yyyyMMdd-HHmmss}) |
| EmailSubject | Single line of text | No | Original email subject |
| ReceivedDate | Date and Time | No | Email received timestamp |

**Folder Structure:**
```
/Input/
  └── OFR-20260405-143022/
        ├── email_body.html
        ├── RFP_CPFL_2026.pdf
        ├── Anexo_Tecnico.docx
        └── Planilha_Custos.xlsx
```

---

### 2.3 Extracted

| Property | Value |
|----------|-------|
| **Name** | Extracted |
| **Purpose** | Store extracted text from each document |
| **Permissions** | Contribute for Power Automate; Read for Architecture team |
| **Versioning** | Off |

**Custom Columns:**

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| OfferID | Single line of text | Yes | Links to Input folder |
| SourceFile | Single line of text | No | Original filename |
| CharCount | Number | No | Character count of extracted text |

**Folder Structure:**
```
/Extracted/
  └── OFR-20260405-143022/
        ├── RFP_CPFL_2026.txt
        ├── Anexo_Tecnico.txt
        ├── Planilha_Custos.txt
        └── raw_extract.txt    ← Concatenation of all, truncated at 100K chars
```

---

### 2.4 Output

| Property | Value |
|----------|-------|
| **Name** | Output |
| **Purpose** | Store AI outputs (JSON) and generated reports (PDF) |
| **Permissions** | Contribute for Power Automate; Read for Architecture team |
| **Versioning** | Major versions enabled |

**Custom Columns:**

| Column Name | Type | Required | Description |
|-------------|------|----------|-------------|
| OfferID | Single line of text | Yes | Links to Input folder |
| ReportType | Choice (PDF, JSON) | No | Type of output file |
| Recommendation | Choice (GO, GO_CONDITIONAL, NO_GO) | No | Final recommendation |

**Folder Structure:**
```
/Output/
  └── OFR-20260405-143022/
        ├── classification.json       ← Prompt 1 output
        ├── extracted_fields.json      ← Prompt 2 output
        ├── tech_practices.json        ← Prompt 3 output
        ├── gonogo_score.json          ← Prompt 4 output
        └── GO_NO_GO_Report.pdf        ← Final report
```

---

## 3. Folder Naming Convention

**Pattern:** `OFR-{yyyyMMdd-HHmmss}`

| Component | Source | Example |
|-----------|--------|---------|
| OFR | Fixed prefix | OFR |
| yyyyMMdd | Date email received | 20260405 |
| HHmmss | Time email received | 143022 |

**Full example:** `OFR-20260405-143022`

**Why timestamp-based:**
- Guarantees uniqueness (no two emails arrive at the exact same second)
- Sortable chronologically
- No dependency on email subject (which repeats)
- No special characters (safe for all systems)

**Collision handling:** If by rare chance a duplicate timestamp occurs, append `-2` suffix: `OFR-20260405-143022-2`

---

## 4. Permissions Matrix

| Principal | Templates | Input | Extracted | Output |
|-----------|-----------|-------|-----------|--------|
| **Service Account** | Full Control | Full Control | Full Control | Full Control |
| **Architecture Team** | Read | Read | Read | Read |
| **Power Automate (flow identity)** | Read | Contribute | Contribute | Contribute |
| **Bid Managers** | — | — | — | Read |
| **Site Admins** | Full Control | Full Control | Full Control | Full Control |

---

## 5. Retention & Lifecycle

| Policy | Value |
|--------|-------|
| **Retention** | 2 years (follows corporate document retention policy) |
| **Archive** | After 6 months, move to cold storage (if available) |
| **Deletion** | Manual only — no auto-delete |
| **Backup** | Covered by M365 tenant backup |

---

## 6. Power Automate Integration Notes

- **File creation:** Use "Create file" action with path `/Input/{OfferID}/{filename}`
- **Folder creation:** Use "Send an HTTP request to SharePoint" with `/_api/web/folders/add('/Input/{OfferID}')`
- **File reading:** Use "Get file content" with SharePoint file path
- **URL passing:** Always pass SharePoint URL (text) between flows — never binary content

---

*Design by: OPUS 4.6 — 2026-04-05*
*Status: Ready for CODEX deployment (CODEX-01, CODEX-02)*
