# Integrations — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects actual deployed integrations

## Production Integrations (Power Platform)

### Outlook 365 Connector
- **Trigger:** "When a new email arrives (V3)" on Ofertas DN shared mailbox
- **Actions:** Get email body, attachments, metadata
- **Connection:** Service account (mbenicios@minsait.com)
- **Status:** ✅ Configured in Flow 1

### SharePoint Online Connector
- **Site:** https://indra365.sharepoint.com/sites/Grp_T_DN_Arquitetura_Solucoes_Multi_Praticas_QA
- **Actions:** Create folder, Upload file, Get file content
- **Libraries:** Templates, Input, Extracted, Output
- **Status:** ✅ Configured

### Dataverse Connector
- **Environment:** ColOfertasBrasilPro
- **URL:** https://colofertasbrasilpro.crm4.dynamics.com
- **Table:** rfp_ofertas (cr8b2_rfpofertases)
- **Actions:** Add row, Update row, Get row by ID, List rows
- **Status:** ✅ Configured in Flows 1, 2, 3

### AI Builder (GPT-4.1)
- **Model:** GPT-4.1 (via AI Builder custom prompts)
- **Prompts deployed:**
  - RFP_01_Classify_Offer (2 inputs: email_body, document_text)
  - RFP_02_Extract_Fields (2 inputs: classification_json, document_text)
  - RFP_03_Tech_Practices (1 input: document_text)
  - RFP_04_GoNoGo_Score (3 inputs: classification_json, extracted_fields_json, tech_catalog_json)
- **Action:** "Executar uma solicitação" (Create text with GPT using a prompt)
- **Status:** ✅ All 4 prompts deployed and configured in Flow 2

### Teams Connector (Planned — Phase 7)
- **Actions:** Post Adaptive Card to channel
- **Status:** ⏳ Not yet configured

### Word Online Connector (Planned — Phase 4)
- **Actions:** Populate Word template → Convert to PDF
- **Status:** ⏳ Not yet configured (Flow 3 uses Compose + Email for now)

## POC Integrations (Superseded)

### Microsoft Graph API (FAILED)
- **File:** `poc_ms_graph.mjs`
- **Protocol:** REST (via MSAL Device Code Flow)
- **Endpoints targeted:** `/me/messages`, `/me/mailFolders`
- **Status:** ❌ **NO-GO** — Blocked by tenant Conditional Access (AADSTS50105, AADSTS53003)
- **Multiple client IDs attempted:** de8bc8b5, 04f0c124, 1950a258, d3590ed6, 29d9ed98, fb78d390
- **Documented in:** `poc_report.md`, `ms_graph_privilege_poc_antigravity.md`

### Outlook CSV Export (POC Workaround)
- **Files:** `Inbox.CSV` (169MB), `Usuario_GEN_OFERTAS.CSV` (8.8MB)
- **Format:** Outlook desktop CSV export
- **Status:** Superseded by Outlook connector in Power Automate

## Authentication
- **Production:** Power Platform managed connections (delegated auth via connectors)
- **POC:** MSAL Device Code Flow (blocked by CA policies)

## Webhooks
- None

## File-Based Integrations
- **RFP Templates v2.1:** `rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/`
  - 1 JSON schema (`0_RFP_TEMPLATE.json`)
  - 14 CSV templates for diligence framework
