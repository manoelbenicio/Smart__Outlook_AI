# Stack Research — Power Platform RFP Automation

## Recommended Stack (2026)

### Core Platform
| Component | Version/Edition | Purpose | Confidence |
|---|---|---|---|
| **Power Automate** | Cloud Flows (Apr 2026) | Orchestration — email triggers, file handling, AI calls, report generation | ⭐⭐⭐⭐⭐ High |
| **AI Builder** | Prompt Builder (GPT-4o) | Text extraction, classification, field mapping, scoring | ⭐⭐⭐⭐ High |
| **AI Builder** | Document Processing | Structured PDF/form extraction (prebuilt models) | ⭐⭐⭐⭐ High |
| **SharePoint Online** | M365 (current) | Document storage — organized by offer, versioned | ⭐⭐⭐⭐⭐ High |
| **Dataverse** | Included w/ Copilot Studio | Structured data — offer tracking, scorecard, status | ⭐⭐⭐⭐⭐ High |
| **Copilot Studio** | Apr 2026 | Conversational agent — query offers, ask questions about docs | ⭐⭐⭐⭐ High |
| **Word Online** | M365 (current) | Report generation — populate template → convert to PDF | ⭐⭐⭐⭐ High |
| **Outlook Connector** | V3 | Email trigger + email sending | ⭐⭐⭐⭐⭐ High |
| **Teams Connector** | V1 | Adaptive Card notifications | ⭐⭐⭐⭐ High |

### AI Model
| Model | Use For | Temperature | Max Tokens | Confidence |
|---|---|---|---|---|
| **GPT-4o** (Azure OpenAI via AI Builder) | All 4 prompts | 0.1-0.2 | 2K-8K | ⭐⭐⭐⭐ High |

### Why NOT These Alternatives
| Alternative | Why Not |
|---|---|
| Azure Logic Apps | More complex, overkill for ~5 offers/week volume |
| Azure Functions | Requires custom code, violates "100% Power Platform" constraint |
| Custom Python worker | Requires local/cloud infra outside corporate stack |
| SharePoint Lists (instead of Dataverse) | Poor for relational data, no Copilot Studio integration |
| Power Apps Model-Driven | Overkill for v1 — Copilot Studio agent is lighter |

## Key Version Considerations
- **AI Builder credits:** Verify allocation in Power Platform Admin Center. ~60 credits/month needed for ~15 offers.
- **GPT-4o availability:** Confirm model availability in tenant's Azure region.
- **Power Automate Premium:** Confirm if AI Builder actions require Premium connector license (typically included with Copilot Studio).

## Sources
- Microsoft Power Platform documentation (2025-2026)
- AI Builder best practices guides
- Power Automate enterprise automation patterns
