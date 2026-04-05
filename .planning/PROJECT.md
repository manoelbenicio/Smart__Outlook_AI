# RFP Auto-Diligence Pipeline

## What This Is

An automated pipeline that monitors the "Ofertas DN" shared mailbox, extracts data from RFP emails and their attachments (PDF, DOCX, XLSX, ZIP), applies a 5-dimension scoring framework, and generates a GO/NO-GO recommendation report for executive decision-making. Built 100% on Microsoft Power Platform (Copilot Studio + Power Automate + AI Builder + SharePoint + Dataverse) using existing corporate licenses. Target: reduce per-offer diligence time from ~4 hours to under 30 minutes.

## Core Value

Every new offer gets a scored, evidence-backed GO/NO-GO recommendation delivered to the Architecture team's inbox within 30 minutes — so Architects spend time on strategy, not document mining.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Email volumetry analyzed (15,630 emails: 14,739 Inbox + 891 Ofertas DN) — existing
- ✓ RFP Diligence Framework v2.1 mapped (1 JSON schema + 14 CSV templates) — existing
- ✓ Enterprise documentation created (SAD, TDD, Ops Manual, Func Spec, Governance) — existing
- ✓ Codebase mapped (.planning/codebase/ — 7 documents) — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Power Automate captures new emails from Ofertas DN with all attachments
- [ ] Attachments saved to SharePoint in organized folder structure per offer
- [ ] AI Builder extracts text from PDF, DOCX, XLSX documents
- [ ] AI Builder Prompt classifies offer type, client, value, deadline, horizontal
- [ ] AI Builder Prompt maps extracted data to RFP Template v2.1 fields
- [ ] AI Builder Prompt catalogs technologies and practices mentioned
- [ ] AI Builder Prompt scores GO/NO-GO across 5 mandatory dimensions (1-5 each, weighted)
- [ ] Missing data marked as A_VALIDAR (never fabricated — Princípio Zero)
- [ ] GO/NO-GO Report generated as PDF (Word Online template)
- [ ] Email report with rich HTML scorecard sent automatically to Architecture team
- [ ] Teams notification with Adaptive Card summary posted
- [ ] All results stored in Dataverse for tracking and querying
- [ ] Copilot Studio Agent answers questions about offers via Teams chat

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Auto-responding to clients — Risk of incorrect/unauthorized responses
- Auto-precificação — Requires full rate card integration and commercial approval
- Power BI dashboard — Nice-to-have, not critical for v1 decision workflow
- OCR for scanned PDFs — AI Builder standard covers text-based PDFs; scanned docs flagged as FAILED
- Mobile app — Web/Teams first; mobile later if needed
- Competitor analysis — Data not available within corporate systems
- Processing Inbox (main mailbox) — Only Ofertas DN mailbox in scope

## Context

- **Organization:** Minsait (Indra Group) — Fortune 500 consultancy, 60,000 employees
- **Team:** Architecture / Pre-Sales practice in Brazil
- **Mailbox:** "Ofertas DN" shared mailbox receives all RFPs and offers from all company practices
- **Volume:** ~891 emails in Ofertas DN, ~3-5 new offers per week
- **Current process:** Manual reading → extraction → template filling → scoring → email to Director (~4h/offer)
- **Decision flow:** AI recommends → Architecture team (Manoel) validates → Director makes final GO/NO-GO
- **Framework:** RFP Diligence Orchestrator v2.1 STRICT — 6-stage pipeline (A: Inventory → B: Extraction → C: AI Mapping → D: Catalogs → E: QA → F: GO/NO-GO)
- **Prior art:** MS Graph direct API access blocked by tenant Conditional Access Policies (POC NO-GO documented)
- **Agentic execution:** Project implemented by 2 AI agents — Opus 4.6 (architecture, planning, browser QA) + Codex (deploy, code fixes, automated QA), governed by formal check-in protocol with timestamps and evidence

## Constraints

- **Stack:** 100% Microsoft Power Platform — no external/local/custom infrastructure
- **Licenses:** Must use existing M365 + Copilot Studio licenses (zero incremental cost)
- **Security:** All data processed within corporate M365 tenant (Azure region)
- **Governance:** Full documentation required before any deployment (SAD, TDD, Ops Manual, Func Spec)
- **Approval gates:** No code to production without written approval, architecture review, and PR approval
- **Language:** Documents in PT-BR, ES, and EN — pipeline must handle all three
- **Performance:** Email → Report delivered in ≤ 30 minutes end-to-end
- **Accuracy:** ≥ 85% field extraction accuracy (compared to manual)
- **Integrity:** Zero data fabrication (Princípio Zero — A_VALIDAR for missing data)

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 100% Power Platform (no Python/Docker) | Corporate policy requires corporate tools only; existing licenses cover all needs | — Pending |
| AI Builder GPT-4o for extraction/scoring | Available within tenant, no additional cost, adequate quality | — Pending |
| Power Automate for orchestration (not Logic Apps) | Simpler, included in M365, sufficient for ~5 offers/week volume | — Pending |
| Dataverse for structured tracking (not SharePoint lists) | Better for relational data, query performance, and Copilot integration | — Pending |
| Human-in-the-loop for final decision | AI recommends but never decides — Director has final authority | ✓ Good |
| Princípio Zero: A_VALIDAR over fabrication | Critical for trust — users must know which data is real vs missing | ✓ Good |
| GSD (Get Shit Done) for project governance | Ensures spec-driven development with mandatory quality gates | ✓ Good |
| 2-agent execution: Opus (arch) + Codex (deploy) | Separation of concerns, browser QA vs automated QA | — Pending |

## Scoring Framework

The GO/NO-GO decision uses 5 mandatory dimensions:

| # | Dimension | Weight | Evaluates |
|---|-----------|--------|-----------|
| 1 | Alinhamento Estratégico | 25% | Fit with Minsait practices and capabilities |
| 2 | Viabilidade Técnica | 20% | Team competence and availability |
| 3 | Margem Estimada | 20% | Value vs cost (rate card R$ 180/h) |
| 4 | Prazo vs Capacidade | 15% | Timeline feasibility |
| 5 | Risco Contratual | 20% | Problematic clauses, penalties, SLAs |

**Recommendation outputs:** GO (pursue), GO_CONDITIONAL (pursue with caveats), NO_GO (decline)

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-05 after initialization*
