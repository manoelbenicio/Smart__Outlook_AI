# Features Research — RFP Diligence Automation

## Table Stakes (must have or users leave)

| Feature | Complexity | Why Table Stakes |
|---|---|---|
| **Email trigger on new mail** | Low | Core trigger — without it, nothing happens |
| **Attachment extraction (PDF/DOCX/XLSX)** | Medium | RFPs arrive as attachments, not email body |
| **Text extraction from documents** | Medium | Can't classify or score without reading the docs |
| **Offer classification (type, client, value)** | Medium | Basic metadata needed for any tracking |
| **GO/NO-GO recommendation** | Medium | The entire purpose of the pipeline |
| **Email report delivery** | Low | Decision-makers expect email, not a portal |
| **Audit trail (all artifacts saved)** | Low | Corporate compliance — who, when, what |
| **Missing data flagged (A_VALIDAR)** | Low | Trust — users must know what's real vs missing |

## Differentiators (competitive advantage)

| Feature | Complexity | Why Differentiating |
|---|---|---|
| **5-dimension weighted scorecard** | Medium | Structured, defensible recommendation (not just "yes/no") |
| **Evidence linking (excerpt from doc)** | High | Each field shows WHERE in the doc it came from |
| **Copilot Studio conversational agent** | Medium | "What SLA does the CPFL offer require?" in Teams chat |
| **Technology/practices catalog** | Medium | Maps tech requirements to existing Minsait capabilities |
| **Adaptive Card in Teams** | Low | Interactive approval buttons directly in Teams |
| **Multi-language support (PT-BR/ES/EN)** | Medium | Minsait operates across LATAM |
| **Deadline alerts** | Low | Auto-notify when submission deadline < 3 days |
| **Offer comparison (side-by-side)** | Medium | Compare 2+ offers on same dimensions |

## Anti-Features (things to deliberately NOT build)

| Anti-Feature | Why NOT |
|---|---|
| Auto-responding to clients | Unauthorized communication risk — legal liability |
| Auto-pricing | Requires full rate card integration, commercial approval, and margins negotiation |
| Auto-deciding GO/NO-GO | Decision authority is human (Director) — AI recommends only |
| Real-time document editing | SharePoint already handles collaboration — don't reinvent |
| Mobile native app | Teams mobile + Outlook mobile already cover mobile access |
| OCR for scanned PDFs | High complexity, low accuracy, rare use case (~5% of docs) |

## Dependencies Between Features

```
Email trigger ──→ Attachment extraction ──→ Text extraction
                                              │
                                              ├──→ Classification ──→ Dataverse record
                                              │
                                              ├──→ Field mapping ──→ Filled template
                                              │
                                              ├──→ Tech catalog
                                              │
                                              └──→ GO/NO-GO scoring ──→ Report ──→ Email
                                                                         │
                                                                         └──→ Teams card
                                              
Copilot Agent ◄── Dataverse + SharePoint (reads results)
```
