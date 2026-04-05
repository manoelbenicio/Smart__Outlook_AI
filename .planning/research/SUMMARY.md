# Research Summary — RFP Auto-Diligence Pipeline

## Stack Decision
**Power Platform (100% corporate)** — Power Automate + AI Builder GPT-4o + SharePoint + Dataverse + Copilot Studio. All included in existing M365 + Copilot Studio licenses. Zero incremental cost.

## Table Stakes (must ship)
1. Email trigger on Ofertas DN mailbox
2. Attachment extraction (PDF, DOCX, XLSX)
3. Text extraction from documents
4. Offer classification (type, client, value, deadline)
5. GO/NO-GO recommendation with 5-dimension scorecard
6. Email report with PDF attachment
7. Audit trail (all artifacts saved to SharePoint)
8. Missing data flagged as A_VALIDAR (Princípio Zero)

## Key Architecture Pattern
**3-tier cloud flow architecture:**
- Tier 1: Email Intake (trigger + save)
- Tier 2: Processing Pipeline (extract + AI + score)
- Tier 3: Report Generation (Word → PDF → email → Teams)

Child flows for isolation, retry, and independent reprocessing.

## Top Risks (from Pitfalls)
| Risk | Severity | Mitigation |
|---|---|---|
| AI Builder credit exhaustion | High | Check credits before deploy, budget 60/month |
| Token limit on large PDFs | High | Chunk strategy: first 30 pages, 100K char limit |
| JSON parse failures from AI | Medium | Temperature 0.1, explicit "JSON only" instructions |
| Connection expiration | Medium | Service account, quarterly re-auth |
| Shared mailbox permissions | High | Test trigger FIRST before building anything |
| Content moderation blocks | Medium | Frame as business analysis, split problematic content |

## Build Order
1. SharePoint site + Dataverse tables (parallel, no dependencies)
2. AI Builder prompts (needs sample data)
3. Flow 1: Email Intake (needs SharePoint + Dataverse)
4. Flow 2: Processing Pipeline (needs AI Builder + SharePoint)
5. Flow 3: Report Generation (needs Word template + Dataverse)
6. E2E Testing (needs all above)
7. Copilot Studio Agent (needs Dataverse + SharePoint)

## Critical Pattern: URL-Based File Passing
Always save files to SharePoint first, then pass URLs (text) between components. Never try to pass binary content directly.
