# Deploy Scripts — Phase 1 Infrastructure

> **Status:** ⚠️ DEPRECATED — Browser-based automation used instead

## Why These Scripts Were Not Used

The PowerShell deployment scripts were designed to automate SharePoint and Dataverse setup via CLI tools (PnP.PowerShell + PAC CLI). However, both approaches were blocked by the corporate Entra ID configuration:

1. **PnP.PowerShell** — Requires `-Interactive` or `-DeviceLogin` auth, which needs an Entra ID app registration. Corporate tenant restricts app registrations.
2. **PAC CLI** — Requires `pac auth create` which was not available in the tenant configuration.

**Resolution:** All infrastructure was deployed via browser-based automation directly in the Power Platform maker portals:
- SharePoint: https://indra365.sharepoint.com
- Dataverse: https://make.powerapps.com
- AI Builder: https://make.powerapps.com → AI Builder
- Power Automate: https://make.powerautomate.com

## Scripts (Reference Only)

| Script | Purpose | Status |
|---|---|---|
| `01_deploy_sharepoint.ps1` | Create SharePoint site + libraries | ❌ Blocked |
| `02_deploy_dataverse.ps1` | Create Dataverse tables + columns | ❌ Blocked |

## Target Environment

| Resource | URL |
|---|---|
| SharePoint Site | https://indra365.sharepoint.com/sites/Grp_T_DN_Arquitetura_Solucoes_Multi_Praticas_QA |
| Dataverse | https://colofertasbrasilpro.crm4.dynamics.com |
| Power Platform | Environment: ColOfertasBrasilPro (e2d10003-4d8e-e007-9d63-76d5fe89ef56) |

## Prerequisites (If Scripts Were Used)
- PAC CLI: authenticated (`pac auth list`)
- PnP.PowerShell: installed (`Install-Module PnP.PowerShell`)
- Permissions: SharePoint Site Admin + Dataverse System Admin
