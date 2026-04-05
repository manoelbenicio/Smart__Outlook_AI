# Architecture Research — Power Platform RFP Pipeline

## Standard Architecture Pattern

The recommended pattern for email-triggered document processing on Power Platform is a **3-tier cloud flow architecture** with event-driven orchestration:

```
┌─────────────────────────────────────────────┐
│          TIER 1: EVENT INGESTION            │
│                                             │
│  Power Automate (Automated Cloud Flow)      │
│  Trigger: When new email arrives (V3)       │
│  → Parse metadata                           │
│  → Save attachments to SharePoint           │
│  → Create Dataverse tracking record         │
│  → Call child flow (Tier 2)                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          TIER 2: PROCESSING                 │
│                                             │
│  Power Automate (Instant/Child Flow)        │
│  → Extract text from each document          │
│  → Concatenate to raw_extract               │
│  → Call AI Builder prompts (4x)             │
│  → Parse JSON outputs                       │
│  → Update Dataverse with results            │
│  → Call child flow (Tier 3)                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          TIER 3: OUTPUT                     │
│                                             │
│  Power Automate (Instant/Child Flow)        │
│  → Populate Word template → PDF             │
│  → Compose HTML email body                  │
│  → Send email with PDF attachment           │
│  → Post Teams Adaptive Card                 │
│  → Update Dataverse status = COMPLETED      │
└─────────────────────────────────────────────┘
```

## Why 3 Separate Flows (not 1 monolith)

| Reason | Detail |
|---|---|
| **Timeout management** | Single flows timeout at 30 days but individual actions timeout sooner. Child flows isolate long-running AI operations. |
| **Retry isolation** | If AI Builder fails, only Tier 2 retries — not the entire pipeline |
| **Reprocessing** | Can manually re-trigger Tier 2 or Tier 3 independently |
| **Debugging** | Each tier has its own run history — easier to diagnose |
| **Throttling** | Separates heavy AI operations from lightweight email/report operations |

## Data Flow

| Stage | Source | Destination | Format |
|---|---|---|---|
| Email arrives | Outlook | Power Automate | Email object |
| Body saved | Power Automate | SharePoint /input/ | HTML file |
| Attachments saved | Power Automate | SharePoint /input/ | Original format |
| Text extracted | AI Builder / Word / Excel | SharePoint /extracted/ | TXT file |
| Classification | AI Builder Prompt 1 | Dataverse + SharePoint | JSON |
| Field mapping | AI Builder Prompt 2 | SharePoint /output/ | JSON |
| Scorecard | AI Builder Prompt 4 | Dataverse + SharePoint | JSON |
| Report | Word Online | SharePoint /output/ | PDF |
| Notification | Power Automate | Outlook + Teams | Email + Adaptive Card |

## Component Boundaries

| Component | Responsibility | Does NOT do |
|---|---|---|
| **SharePoint** | Store files | Process or analyze |
| **Dataverse** | Store structured records | Store files (use SharePoint) |
| **AI Builder** | Extract text, classify, score | Store results (passes to flow) |
| **Power Automate** | Orchestrate, connect, transform | AI reasoning (delegates to AI Builder) |
| **Copilot Studio** | Conversational interface | Backend processing (delegates to flows) |
| **Word Online** | Generate formatted documents | Data analysis |

## Build Order (dependencies)

1. **SharePoint site** — no dependencies
2. **Dataverse tables** — no dependencies
3. **AI Builder prompts** — needs sample data (from SharePoint)
4. **Flow 1 (Intake)** — needs SharePoint + Dataverse
5. **Flow 2 (Processing)** — needs AI Builder prompts + SharePoint + Dataverse
6. **Flow 3 (Report)** — needs Word template + Dataverse + Outlook
7. **Copilot Studio Agent** — needs Dataverse + SharePoint (reads results)

## Key Pattern: URL-Based File Passing

**Critical:** Copilot Studio and Power Automate cannot pass binary file content directly. Always use the **URL pattern**:
1. Save file to SharePoint
2. Pass the SharePoint URL (text) to the next component
3. Component retrieves file content via SharePoint connector
