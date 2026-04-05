---
phase: 1
plan: 4
title: "Configure Service Account & Mailbox Permissions"
agent: CODEX
wave: 2
depends_on: [01-PLAN]
requirements: [CODEX-06, CODEX-07]
files_modified:
  - Power Platform connections
  - Outlook shared mailbox permissions
autonomous: false
---

# Plan 04: Configure Service Account & Mailbox Permissions

<objective>
CODEX configures all Power Automate connections (Outlook, SharePoint, Dataverse, AI Builder) using the service account, and grants delegate permissions on the "Ofertas DN" shared mailbox. Marked as non-autonomous because it requires admin portal access.
</objective>

<task id="1">
<title>Create Power Automate Connections</title>
<agent>CODEX</agent>

<read_first>
- .planning/research/PITFALLS.md (P4: Connection Expiration, P8: Mailbox Permissions)
- docs/03_Operations_Manual.md (setup procedures)
</read_first>

<action>
In Power Automate → Connections:

1. Create connection: **Office 365 Outlook** — authenticate with service account
2. Create connection: **SharePoint** — authenticate with service account
3. Create connection: **Microsoft Dataverse** — authenticate with service account
4. Create connection: **AI Builder** — authenticate with service account
5. Verify all 4 connections show "Connected" status (green checkmark)
6. Document connection names and IDs for flow configuration
</action>

<acceptance_criteria>
- Connection "Office 365 Outlook" exists and shows Connected status
- Connection "SharePoint" exists and shows Connected status
- Connection "Microsoft Dataverse" exists and shows Connected status
- Connection "AI Builder" exists and shows Connected status
- All 4 connections authenticated under the same service account
</acceptance_criteria>
</task>

<task id="2">
<title>Configure Shared Mailbox Access</title>
<agent>CODEX</agent>

<read_first>
- .planning/research/PITFALLS.md (P8: Mailbox Permissions)
</read_first>

<action>
In Exchange Admin Center or M365 Admin:

1. Navigate to shared mailbox "Ofertas DN"
2. Grant **Full Access** or **Send As** permission to the service account
3. Alternatively, grant **Read** delegate permission if Full Access is not approved
4. Test: Send a test email to "Ofertas DN" and verify the service account can see it
5. Document the exact mailbox address: ofertas.dn@minsait.com (or actual address)

**Note:** Power Automate V3 trigger requires the "Shared Mailbox" parameter set to the exact mailbox address.
</action>

<acceptance_criteria>
- Service account can access "Ofertas DN" shared mailbox
- Test email visible to service account via Outlook connector
- Mailbox address documented for flow trigger configuration
</acceptance_criteria>
</task>

<verification>
All 4 Power Automate connections active. Service account can access Ofertas DN mailbox. Test email visible.
</verification>

<must_haves>
- 4 active Power Automate connections
- Shared mailbox access confirmed with test email
</must_haves>
