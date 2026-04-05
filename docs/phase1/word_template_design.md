# Word Template Design — GO/NO-GO Report

**Document:** OPUS-03 Design Specification
**Version:** 1.0
**Date:** 2026-04-05
**Agent:** OPUS 4.6

---

## 1. Template Overview

| Property | Value |
|----------|-------|
| **File name** | GO_NO_GO_Report.docx |
| **Location** | /sites/OfertasDN/Templates/GO_NO_GO_Report.docx |
| **Page size** | A4 |
| **Orientation** | Portrait |
| **Font** | Segoe UI (body), Segoe UI Semibold (headings) |
| **Colors** | Minsait brand: Primary #003366, Accent #00A5E0, Warning #E74C3C, Success #27AE60 |

---

## 2. Content Controls Mapping

Each `{{placeholder}}` is a Word Content Control (Rich Text or Plain Text) that Power Automate's "Populate a Microsoft Word template" action will fill.

| # | Control Name | Dataverse Source | Type | Notes |
|---|-------------|-----------------|------|-------|
| 1 | `{{report_date}}` | Flow variable (utcNow) | Plain Text | Format: DD/MM/YYYY |
| 2 | `{{offer_id}}` | rfp_ofertas.ofr_id | Plain Text | Auto-generated ID |
| 3 | `{{client_name}}` | rfp_ofertas.ofr_client | Plain Text | Or "A_VALIDAR" |
| 4 | `{{offer_type}}` | rfp_ofertas.ofr_offer_type | Plain Text | RFP/RFI/RFQ/etc |
| 5 | `{{email_subject}}` | rfp_ofertas.ofr_email_subject | Rich Text | Full subject line |
| 6 | `{{email_from}}` | rfp_ofertas.ofr_email_from | Plain Text | Sender |
| 7 | `{{email_received}}` | rfp_ofertas.ofr_email_received | Plain Text | DD/MM/YYYY HH:mm |
| 8 | `{{deadline}}` | rfp_ofertas.ofr_deadline | Plain Text | DD/MM/YYYY or "A_VALIDAR" |
| 9 | `{{horizontal}}` | rfp_ofertas.ofr_horizontal | Plain Text | Tech area |
| 10 | `{{estimated_value}}` | rfp_ofertas.ofr_estimated_value | Plain Text | Formatted with currency |
| 11 | `{{recommendation}}` | rfp_ofertas.ofr_recommendation | Plain Text | GO / GO_CONDITIONAL / NO_GO |
| 12 | `{{weighted_total}}` | rfp_ofertas.ofr_weighted_score | Plain Text | 0.00 - 5.00 |
| 13 | `{{a_validar_count}}` | rfp_ofertas.ofr_a_validar_count | Plain Text | Integer |
| 14 | `{{processing_time}}` | rfp_ofertas.ofr_processing_duration_sec | Plain Text | Formatted MM:SS |
| 15 | `{{recommendation_summary}}` | GoNoGo JSON → recommendation_summary | Rich Text | 3-5 sentences PT-BR |
| 16 | `{{key_risks}}` | GoNoGo JSON → key_risks | Rich Text | Bullet list |
| 17 | `{{conditions}}` | GoNoGo JSON → conditions | Rich Text | Bullet list (GO_CONDITIONAL only) |
| 18 | `{{a_validar_impact}}` | GoNoGo JSON → a_validar_impact | Rich Text | Assessment text |
| 19 | `{{scope_objective}}` | Extract JSON → scope.objective | Rich Text | Max 500 chars |
| 20 | `{{deliverables}}` | Extract JSON → scope.deliverables | Rich Text | Bullet list |
| 21 | `{{duration}}` | Extract JSON → scope.duration_months | Plain Text | "X meses" |
| 22 | `{{tech_required}}` | Tech JSON → technologies.required | Rich Text | Comma-separated |
| 23 | `{{tech_preferred}}` | Tech JSON → technologies.preferred | Rich Text | Comma-separated |
| 24 | `{{capability_match}}` | Tech JSON → minsait_capability_match | Rich Text | strong/moderate/gap |

### Repeating Section: Scorecard Table

Power Automate uses a repeating section content control for the 5 dimensions:

| Control Name | Source | Type |
|-------------|--------|------|
| `{{dim_name}}` | rfp_scorecarditem.sci_dimension | Plain Text |
| `{{dim_weight}}` | rfp_scorecarditem.sci_weight | Plain Text |
| `{{dim_score}}` | rfp_scorecarditem.sci_score | Plain Text |
| `{{dim_weighted_score}}` | rfp_scorecarditem.sci_weighted_score | Plain Text |
| `{{dim_justification}}` | rfp_scorecarditem.sci_justification | Rich Text |
| `{{dim_confidence}}` | rfp_scorecarditem.sci_confidence | Plain Text |

---

## 3. Layout Sections

### Page 1: Cover + Executive Summary

```
┌──────────────────────────────────────┐
│  [MINSAIT LOGO]                      │
│                                      │
│  RELATÓRIO GO/NO-GO                  │
│  Análise Automatizada de Oferta      │
│                                      │
│  Cliente: {{client_name}}            │
│  Oferta:  {{offer_type}}             │
│  Data:    {{report_date}}            │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   RECOMENDAÇÃO: {{recommendation}} │
│  │   Score: {{weighted_total}} /5.0   │
│  └────────────────────────────────┘  │
│                                      │
│  RESUMO EXECUTIVO                    │
│  {{recommendation_summary}}          │
│                                      │
│  RISCOS CHAVE                        │
│  {{key_risks}}                       │
│                                      │
│  CONDIÇÕES (se GO_CONDITIONAL)       │
│  {{conditions}}                      │
└──────────────────────────────────────┘
```

### Page 2: Scorecard

```
┌──────────────────────────────────────┐
│  SCORECARD — 5 DIMENSÕES             │
│                                      │
│  ┌─────────┬────┬─────┬──────┬────┐  │
│  │Dimensão │Peso│Score│Pond. │Conf│  │
│  ├─────────┼────┼─────┼──────┼────┤  │
│  │{{dim_name}}│{{w}}│{{s}}│{{ws}}│{{c}}│  │
│  │ {{dim_justification}}          │  │
│  ├─────────┼────┼─────┼──────┼────┤  │
│  │ ... (5 rows)                   │  │
│  ├─────────┼────┼─────┼──────┼────┤  │
│  │ TOTAL   │100%│ — │{{weighted_total}}│ │
│  └─────────┴────┴─────┴──────┴────┘  │
│                                      │
│  IMPACTO DOS CAMPOS A_VALIDAR        │
│  {{a_validar_impact}}                │
│  Campos pendentes: {{a_validar_count}}│
└──────────────────────────────────────┘
```

### Page 3: Classification & Scope

```
┌──────────────────────────────────────┐
│  CLASSIFICAÇÃO                       │
│  Tipo: {{offer_type}}                │
│  Cliente: {{client_name}}            │
│  Valor: {{estimated_value}}          │
│  Prazo: {{deadline}}                 │
│  Horizontal: {{horizontal}}          │
│                                      │
│  ESCOPO                              │
│  Objetivo: {{scope_objective}}       │
│  Entregáveis: {{deliverables}}       │
│  Duração: {{duration}}               │
│                                      │
│  STACK TECNOLÓGICO                   │
│  Requerido: {{tech_required}}        │
│  Desejável: {{tech_preferred}}       │
│  Fit Minsait: {{capability_match}}   │
└──────────────────────────────────────┘
```

### Footer (all pages)

```
┌──────────────────────────────────────┐
│ Gerado automaticamente pelo RFP     │
│ Auto-Diligence Pipeline v1.0        │
│ ID: {{offer_id}} | {{report_date}}  │
│ Processado em: {{processing_time}}  │
│ ⚠ Este relatório é uma recomendação │
│   — a decisão final é do Diretor.   │
└──────────────────────────────────────┘
```

---

## 4. Visual Styling

### Recommendation Badge Colors

| Recommendation | Background | Text | Border |
|---------------|------------|------|--------|
| GO | #27AE60 (green) | White | 2px solid #1E8449 |
| GO_CONDITIONAL | #F39C12 (amber) | White | 2px solid #D68910 |
| NO_GO | #E74C3C (red) | White | 2px solid #CB4335 |

### Score Color Coding

| Score | Color | Meaning |
|-------|-------|---------|
| 5 | #27AE60 | Excellent |
| 4 | #2ECC71 | Good |
| 3 | #F39C12 | Acceptable |
| 2 | #E67E22 | Poor |
| 1 | #E74C3C | Very Poor |

---

## 5. Power Automate Integration Notes

1. Use "Populate a Microsoft Word template" action (Premium connector)
2. Template must use **Content Controls** (Developer tab → Rich Text Content Control)
3. DO NOT use mail merge fields — they are not supported by Power Automate
4. After populating: use "Convert Word Document to PDF" action (Word Online connector)
5. Sanitize all AI outputs before insertion — strip `<`, `>`, `&` to avoid XML errors
6. For repeating section (scorecard): use "Repeating Section Content Control" in Word
7. Maximum field value length: test with 2000 chars for Rich Text controls

---

## 6. Content Control Creation Steps (for CODEX)

1. Open Word Desktop (not Online)
2. Enable Developer tab (File → Options → Customize Ribbon → Developer)
3. For each control:
   a. Type the placeholder text (e.g., "{{client_name}}")
   b. Select the text
   c. Developer → Rich Text Content Control (or Plain Text for simple fields)
   d. Click Properties → set Tag = control name (e.g., "client_name")
   e. Set Title = display name (e.g., "Client Name")
4. For the Scorecard repeating section:
   a. Create one row with all dimension controls
   b. Select the entire row
   c. Developer → Repeating Section Content Control
   d. Set Tag = "scorecard_dimensions"
5. Save as .docx (not .doc)
6. Upload to /sites/OfertasDN/Templates/

---

*Design by: OPUS 4.6 — 2026-04-05*
*Status: Ready for CODEX deployment (CODEX-05)*
