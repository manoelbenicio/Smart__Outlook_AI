# Integrations — AI Smart Organizer

## External APIs

### Microsoft Graph API (POC — FAILED)
- **File:** `poc_ms_graph.mjs`
- **Protocol:** REST (via MSAL Device Code Flow)
- **Endpoints targeted:** `/me/messages`, `/me/mailFolders`
- **Status:** ❌ **NO-GO** — Blocked by tenant Conditional Access Policies (AADSTS50105, AADSTS53003)
- **Multiple client IDs attempted:** de8bc8b5, 04f0c124, 1950a258, d3590ed6, 29d9ed98, fb78d390
- **Documented in:** `poc_report.md`, `ms_graph_privilege_poc_antigravity.md`

### Outlook CSV Export (Current Workaround)
- **Files:** `Inbox.CSV` (169MB, ~14,739 emails), `Usuario_GEN_OFERTAS.CSV` (8.8MB, ~891 emails)
- **Format:** Outlook desktop CSV export (comma-separated, multiline fields, multiple encodings)
- **Columns:** De (Nome/Endereço/Tipo), Para/CC (Nome/Endereço), Assunto, Corpo, Importance, etc.

## Databases
- None configured (files only)

## Auth Providers
- Microsoft Identity Platform (MSAL) — attempted but blocked by corporate tenant

## Webhooks
- None

## File-Based Integrations
- **RFP Templates v2.1:** `rfp_engine/templates/RFP_Diligence_Templates_v2.1_STRICT/`
  - 1 JSON schema (`0_RFP_TEMPLATE.json`)
  - 14 CSV templates for diligence framework
  - Extracted from `Master_Prompt_Template_Diligence_pack_v2.1_STRICT_PLACEHOLDER.zip`

## Planned Integrations (SAD v2.0 — Power Platform)
- SharePoint Online (file storage)
- Dataverse (structured data)
- AI Builder / GPT-4o (document processing)
- Power Automate (flow orchestration)
- Outlook Connector (email trigger)
- Teams Connector (notifications)
- Word Online (report generation)
