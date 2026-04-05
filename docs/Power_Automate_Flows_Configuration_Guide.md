# 🔧 Power Automate Flows — Complete Configuration Guide
## RFP Auto-Diligence Pipeline v2.1 | Minsait Brasil

| Item | Detail |
|------|--------|
| **Environment** | ColOfertasBrasilPro |
| **URL** | https://make.powerautomate.com |
| **Date** | 2026-04-05 |
| **Author** | Architecture Team |

---

## All 3 Flows Created ✅

The screenshot below shows all 3 RFP flows successfully created in the ColOfertasBrasilPro environment:

![Flows list showing all 3 RFP flows created in Power Automate](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flows_list_overview_1775406716321.png)

| Flow | Type | Status |
|------|------|--------|
| **RFP-02-Processing-Pipeline** | Instantâneo | Created — needs AI Builder actions |
| **RFP-01-Email-Intake** | Automatizado | Created — needs full configuration |
| **RFP-03-Report-Generation** | Instantâneo | Created — partially configured |

---
---

# FLOW 3: RFP-03-Report-Generation

> **Purpose:** Read scored data from Dataverse → compose HTML report → email to Architecture team → mark COMPLETED

## Current Designer View

![Flow 3 designer showing 5 action cards connected vertically](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow3_designer_complete_1775406770868.png)

**Structure:** Trigger → Obter uma linha por ID → Compor → Enviar email (V2) → Atualizar uma linha

---

### 3.1 Trigger Configuration

![Flow 3 trigger showing offer_id input configured](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow3_trigger_config_actual_1775406787866.png)

| Field | Value | Status |
|-------|-------|--------|
| **Type** | Disparar um fluxo manualmente | ✅ Correct |
| **Input 1** | `offer_id` (Texto) | ✅ Configured |

> [!NOTE]
> This is a child flow - it receives the `offer_id` from the parent flow (RFP-02).

---

### 3.2 Action 1: Obter uma linha por ID (Dataverse)

![Flow 3 Get Row showing RFP Ofertas table and offer_id dynamic content](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow3_dataverse_get_1775406846660.png)

| Field | Value | Status |
|-------|-------|--------|
| **Nome da tabela** | `RFP Ofertas` | ✅ Configured |
| **ID de Linha** | 🔵 `offer_id` (dynamic content from trigger) | ✅ Configured |
| **Parâmetros avançados** | Mostrando 0 de 4 | ℹ️ Not needed |
| **Conexão** | mbenicios@minsait.com | ✅ Active |

---

### 3.3 Action 2: Compor (Data Operations)

> [!IMPORTANT]
> This action needs the HTML email template. Currently it may have placeholder text. Replace the "Entradas" field with the full HTML below.

**Value to paste in the "Entradas" field:**

```html
<div style="font-family:Segoe UI,sans-serif;max-width:720px;margin:0 auto;">
<div style="background:linear-gradient(135deg,#0078D4,#00BCF2);padding:24px;border-radius:12px 12px 0 0;color:white;">
<h1 style="margin:0;font-size:24px;">RFP Diligence Report</h1>
<p style="margin:4px 0 0;opacity:0.9;">Pipeline Automatizado v2.1</p>
</div>
<div style="background:#f8f9fa;padding:20px;border:1px solid #e0e0e0;">
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #ddd;">
<td style="padding:12px;font-weight:bold;width:35%;color:#555;">Email Subject</td>
<td style="padding:12px;">@{outputs('Obter_uma_linha_por_ID')?['body/rfp_emailsubject']}</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#fff;">
<td style="padding:12px;font-weight:bold;color:#555;">Status</td>
<td style="padding:12px;">@{outputs('Obter_uma_linha_por_ID')?['body/rfp_status']}</td>
</tr>
</table>
</div>
<div style="background:#107C10;color:white;padding:24px;text-align:center;margin-top:2px;">
<h1 style="margin:0;font-size:28px;">GO/NO-GO Report</h1>
</div>
<div style="background:#fff;padding:20px;border:1px solid #e0e0e0;border-top:none;">
<h3 style="color:#333;margin-top:0;">Headline</h3>
<p style="color:#555;font-size:15px;">@{outputs('Obter_uma_linha_por_ID')?['body/rfp_headline']}</p>
</div>
<div style="background:#f0f0f0;padding:12px;text-align:center;border-radius:0 0 12px 12px;">
<p style="margin:0;color:#999;font-size:11px;">Gerado pelo RFP Diligence Pipeline v2.1 | Minsait Brasil</p>
</div>
</div>
```

> [!TIP]
> **How to set dynamic content references in the HTML:**
> After pasting, the `@{outputs('Obter_uma_linha_por_ID')?['body/FIELD']}` parts should auto-resolve as colored pills. If they don't, use the Expression tab (fx) to type them manually.

---

### 3.4 Action 3: Enviar um email (V2) (Office 365 Outlook)

| Field | Value | How to Set |
|-------|-------|------------|
| **Para (To)** | `mbenicios@minsait.com` | Type directly |
| **Assunto (Subject)** | `[RFP Diligence] GO/NO-GO Report` | Type static text; optionally add ⚡ dynamic: `rfp_emailsubject` |
| **Corpo (Body)** | Output of Compor | ⚡ Dynamic content → under "Compor" → select **"Saídas"** |
| **É HTML** | `Sim` | ⚙️ Show advanced options → toggle ON |
| **Importância** | `Alta` | Select from dropdown |

---

### 3.5 Action 4: Atualizar uma linha (Dataverse) — Mark COMPLETED

![Flow 3 Update Row showing RFP Ofertas, offer_id, Status COMPLETED](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow3_update_config_1775406832711.png)

| Field | Value | Status |
|-------|-------|--------|
| **Nome da tabela** | `RFP Ofertas` | ✅ Configured |
| **ID da Linha** | 🔵 `offer_id` (dynamic) | ✅ Configured |
| **Status** | `COMPLETED` | ✅ Configured |
| **Email From** | *(leave empty)* | ✅ Empty |
| **Email Received** | *(leave empty)* | ✅ Empty |
| **SharePoint Folder** | *(leave empty)* | ✅ Empty |

> [!NOTE]
> The `Email From`, `Email Received`, and `SharePoint Folder` fields are visible but should remain EMPTY in this flow. They are only set by Flow 1 (Intake).

---

### Flow 3 Status: ⚠️ NEEDS HTML IN COMPOR + EMAIL CONFIG

**What's done:** Trigger ✅ | Dataverse Get ✅ | Dataverse Update ✅  
**What's missing:** HTML content in Compor | Email action configuration (To, Subject, Body)

---
---

# FLOW 2: RFP-02-Processing-Pipeline

> **Purpose:** Orchestrate 4 AI Builder prompts → save results to Dataverse → call Report flow

## Current Designer View

![Flow 2 designer showing 4 cards: trigger, update, AI Builder, update](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow2_designer_complete_1775406921840.png)

**Current state:** Trigger → Atualizar uma linha → Executar uma solicitação → Atualizar uma linha 1

> [!WARNING]
> **MISSING ACTIONS**: This flow needs 3 more AI Builder actions + 1 child flow call. Currently has only 1 AI Builder action (Classify). Need to add: Extract, Tech, GoNoGo, and Run Child Flow.

---

### 2.1 Trigger Configuration ✅

![Flow 2 trigger showing offer_id and email_body_t inputs](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow2_trigger_config_1775407134470.png)

| Field | Value | Status |
|-------|-------|--------|
| **Input 1** | `offer_id` (Texto) | ✅ Configured |
| **Input 2** | `email_body_t` | ⚠️ **RENAME to `email_body_text`** — appears truncated |

> [!IMPORTANT]
> Verify the second input name is exactly `email_body_text` (not `email_body_t`). Click the field label to edit.

---

### 2.2 Action 1: Atualizar uma linha — Set PROCESSING ✅

![Flow 2 first Dataverse update showing PROCESSING status](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow2_update_processing_1775406938925.png)

| Field | Value | Status |
|-------|-------|--------|
| **Nome da tabela** | `RFP Ofertas` | ✅ Configured |
| **ID da Linha** | 🔵 `offer_id` (dynamic) | ✅ Configured |
| **Status** | `PROCESSING` | ✅ Configured |
| **Email From** | *(empty)* | ✅ |
| **Email Received** | *(empty)* | ✅ |
| **SharePoint Folder** | *(empty)* | ✅ |

---

### 2.3 Action 2: AI_Classify — Executar uma solicitação (AI Builder) ⚠️

![Flow 2 AI Builder action showing RFP_Classify_Offer prompt with base64 in AdditionalContext](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow2_ai_classify_1775406950994.png)

| Field | Value | Status |
|-------|-------|--------|
| **Prompt** | `RFP_Classify_Offer` | ✅ Correct prompt selected |
| **AdditionalContext** | `base64(...)` | ⚠️ **WRONG** — should be `email_body_text` dynamic content |
| **Item.item/source** | `{"consumptionSource":"PowerAutomate"...}` | ℹ️ Auto-filled by system |

> [!CAUTION]
> **FIX REQUIRED:** The `AdditionalContext` field has a `base64(...)` expression instead of the trigger's `email_body_text`. This needs to be corrected:
> 1. Click the `X` next to `base64(...)` to remove it
> 2. Click the field → type `/` or click ⚡ lightning bolt
> 3. Select **"email_body_text"** from the trigger's dynamic content

**After fix, the correct configuration should be:**

| Field | Value | How to Set |
|-------|-------|------------|
| **Prompt** | `RFP_Classify_Offer` | Already correct ✅ |
| **email_body** | 🔵 `email_body_text` | ⚡ Dynamic → trigger → email_body_text |
| **sender_info** | `Ofertas DN Shared Mailbox` | Type directly (static text) |

> [!TIP]
> **RENAME this action** to `AI_Classify`: Click "..." menu → "Renomear" → type `AI_Classify`. This makes its output easier to find in subsequent steps.

---

### 2.4 Action 3: AI_Extract — TO BE ADDED ❌

Click **"+"** between AI_Classify and Atualizar uma linha 1 → Search: `Executar uma solicitacao` → Select AI Builder

| Field | Value | How to Set |
|-------|-------|------------|
| **Prompt** | `RFP_Extract_Fields` | Dropdown → select |
| **classification_json** | Output of AI_Classify | ⚡ Dynamic → under **"AI_Classify"** (or "Executar uma solicitação") → **"Text"** |
| **document_text** | 🔵 `email_body_text` | ⚡ Dynamic → trigger → **email_body_text** |

> Rename to: `AI_Extract`

---

### 2.5 Action 4: AI_Tech — TO BE ADDED ❌

Click **"+"** below AI_Extract → Same AI Builder action

| Field | Value | How to Set |
|-------|-------|------------|
| **Prompt** | `RFP_Tech_Practices` | Dropdown → select |
| **document_text** | 🔵 `email_body_text` | ⚡ Dynamic → trigger → **email_body_text** |

> Rename to: `AI_Tech`

---

### 2.6 Action 5: AI_GoNoGo — TO BE ADDED ❌

Click **"+"** below AI_Tech → Same AI Builder action

| Field | Value | How to Set |
|-------|-------|------------|
| **Prompt** | `RFP_GoNoGo_Score` | Dropdown → select |
| **classification_json** | Output of AI_Classify | ⚡ Dynamic → **AI_Classify** → **"Text"** |
| **extracted_fields_json** | Output of AI_Extract | ⚡ Dynamic → **AI_Extract** → **"Text"** |
| **tech_catalog_json** | Output of AI_Tech | ⚡ Dynamic → **AI_Tech** → **"Text"** |
| **document_text** | 🔵 `email_body_text` | ⚡ Dynamic → trigger → **email_body_text** |

> Rename to: `AI_GoNoGo`

---

### 2.7 Action 6: Atualizar uma linha 1 — Save Results (Existing, needs edits)

This action already exists. Current config needs additional fields:

| Field | Value | How to Set |
|-------|-------|------------|
| **Nome da tabela** | `RFP Ofertas` | Already configured ✅ |
| **ID da Linha** | 🔵 `offer_id` | Already configured ✅ |
| **Status** | `SCORED` | Change from current value to `SCORED` |
| **Headline** | Output of AI_GoNoGo | ⚡ Dynamic → **AI_GoNoGo** → **"Text"** |
| **Classification** | Output of AI_Classify | ⚡ Dynamic → **AI_Classify** → **"Text"** |

> [!TIP]
> Click **"Mostrar tudo"** to see all Dataverse columns including Headline and Classification.

---

### 2.8 Action 7: Executar um fluxo filho — TO BE ADDED ❌

Click **"+"** below the last Atualizar → Search: `Executar um fluxo filho` or `Run a Child Flow`

| Field | Value | How to Set |
|-------|-------|------------|
| **Fluxo filho** | `RFP-03-Report-Generation` | Dropdown → select |
| **offer_id** | 🔵 `offer_id` | ⚡ Dynamic → trigger → **offer_id** |

---

### Flow 2 Status: ⚠️ NEEDS 4 MORE ACTIONS

**What's done:** Trigger ✅ | Update PROCESSING ✅ | AI_Classify (needs fix) | Update (needs edits)  
**What's missing:** AI_Extract ❌ | AI_Tech ❌ | AI_GoNoGo ❌ | Child Flow call ❌  
**Fixes needed:** AdditionalContext in AI_Classify (remove base64, add email_body_text)

---
---

# FLOW 1: RFP-01-Email-Intake

> **Purpose:** Monitor shared mailbox → generate offer ID → create Dataverse record → convert email HTML → call Processing pipeline

## Current Designer View

![Flow 1 designer showing trigger and placeholder Compose action](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow1_designer_complete_1775407017709.png)

**Current state:** Only Trigger + Placeholder Compose. Needs complete rebuild of all actions.

---

### 1.1 Trigger Configuration — Quando um novo email é recebido (V3)

![Flow 1 trigger showing all advanced parameters expanded](C:/Users/mbenicios/.gemini/antigravity/brain/40b37ab9-b3ba-4455-9b9e-cf31b753f625/flow1_trigger_config_1775407036920.png)

The trigger parameters are all showing (Mostrando 9 de 9). Configure each:

| Field | Value | Status |
|-------|-------|--------|
| **Para** | *(leave empty)* | ✅ Empty |
| **CC** | *(leave empty)* | ✅ Empty |
| **Para ou CC** | *(leave empty)* | ✅ Empty |
| **De** | *(leave empty)* | ✅ Empty |
| **Incluir Anexos** | `Sim` | ⚠️ Set to Sim |
| **Filtro de Assunto** | *(leave empty)* | ✅ Empty |
| **Importância** | `Qualquer` | ⚠️ Set to Qualquer |
| **Somente com Anexos** | `Não` | ⚠️ Set to Não |
| **Pasta** | `Inbox` | ⚠️ Set to Inbox |

> [!CAUTION]
> **CRITICAL FIELD MISSING FROM VIEW:** Scroll down to find or add **"Caixa de Correio Original"** (Original Mailbox). Set it to:
> ```
> ofertasdn@indracompany.com
> ```
> Without this, the flow monitors YOUR personal inbox instead of the shared mailbox!

---

### 1.2 DELETE the Placeholder Compose

Click on the brown **"Compose"** card → Click **"..."** → **"Excluir"** (Delete)

---

### 1.3 Action 1: Inicializar variável — TO BE ADDED

Click **"+"** below trigger → Search: `Inicializar variavel` → Select from **Variável**

| Field | Value |
|-------|-------|
| **Nome** | `v_offer_id` |
| **Tipo** | `Cadeia de caracteres` (String) |
| **Valor** | *(leave EMPTY)* |

---

### 1.4 Action 2: Definir variável — TO BE ADDED

Click **"+"** → Search: `Definir variavel` → Select from **Variável**

| Field | Value | How to Set |
|-------|-------|------------|
| **Nome** | `v_offer_id` | Dropdown → select |
| **Valor** | Expression below | Use the **"Expressão"** tab |

**Expression (paste in the fx box):**
```
concat('OFR-', formatDateTime(utcNow(), 'yyyyMMdd-HHmmss'))
```

> [!TIP]
> **How to enter an expression:**
> 1. Click on the "Valor" field
> 2. In the popup, switch to the **"Expressão"** tab (not "Conteúdo dinâmico")
> 3. Paste the expression into the function box
> 4. Click **"OK"** or **"Adicionar"**
>
> This generates IDs like: `OFR-20260405-134522`

---

### 1.5 Action 3: Adicionar nova linha (Dataverse) — TO BE ADDED

Click **"+"** → Search: `Adicionar nova linha` → Select from **Dataverse**

| Field | Value | How to Set |
|-------|-------|------------|
| **Nome da tabela** | `RFP Ofertas` | Dropdown → search "RFP" |
| **Status** | `RECEIVED` | Dropdown or type |
| **Email Subject** | Email subject | ⚡ Dynamic → **"Assunto"** from trigger |
| **Sender Name** | Email sender | ⚡ Dynamic → **"De"** from trigger |
| **SharePoint Folder** | Expression below | Use **"Expressão"** tab |

**SharePoint Folder expression:**
```
concat('https://indracompany.sharepoint.com/sites/OfertasDN/Shared Documents/Ofertas/', variables('v_offer_id'))
```

All other columns: **leave empty** (to be filled by Flow 2).

---

### 1.6 Action 4: Texto do Html — TO BE ADDED

Click **"+"** → Search: `Html para texto` or `Texto do Html` → Select from **Content Conversion**

| Field | Value | How to Set |
|-------|-------|------------|
| **Conteúdo** | Email HTML body | ⚡ Dynamic → **"Corpo"** (Body) from trigger |

> Converts HTML email body to clean text for AI processing.

---

### 1.7 Action 5: Executar um fluxo filho — TO BE ADDED

Click **"+"** → Search: `Executar um fluxo filho`

| Field | Value | How to Set |
|-------|-------|------------|
| **Fluxo filho** | `RFP-02-Processing-Pipeline` | Dropdown → select |
| **offer_id** | Dataverse row GUID | ⚡ Dynamic → under **"Adicionar nova linha"** → select the row ID |
| **email_body_text** | Plain text output | ⚡ Dynamic → under **"Texto do Html"** → **"Texto sem formatação"** |

---

### 1.8 Save and DISABLE

1. Click **"Salvar"**
2. **IMMEDIATELY** go to flow details → Click **"Desativar"**

> [!WARNING]
> If this flow stays ENABLED, it will process ALL new emails in the Ofertas DN mailbox. Only enable after Flows 2 and 3 are tested and working.

---

### Flow 1 Status: ❌ NEEDS COMPLETE BUILD

**What's done:** Trigger ✅ (needs mailbox field)  
**What's missing:** Delete Compose ❌ | Inicializar variável ❌ | Definir variável ❌ | Adicionar nova linha ❌ | Texto do Html ❌ | Fluxo filho ❌

---
---

# Complete Action Checklist

## Flow 3: RFP-03-Report-Generation
- [x] Trigger: `offer_id` input
- [x] Obter uma linha por ID: `RFP Ofertas` table, `offer_id` row
- [ ] Compor: Paste HTML email template
- [ ] Enviar email: Configure To, Subject, Body, HTML mode
- [x] Atualizar uma linha: `COMPLETED` status

## Flow 2: RFP-02-Processing-Pipeline
- [x] Trigger: `offer_id` and `email_body_text` inputs
- [x] Atualizar uma linha: `PROCESSING` status
- [ ] Fix AI_Classify: Remove base64, add `email_body_text` + `sender_info`
- [ ] Add AI_Extract: `RFP_Extract_Fields` prompt
- [ ] Add AI_Tech: `RFP_Tech_Practices` prompt
- [ ] Add AI_GoNoGo: `RFP_GoNoGo_Score` prompt (4 inputs)
- [ ] Update Atualizar uma linha 1: Change to `SCORED`, add Headline + Classification
- [ ] Add Executar fluxo filho: `RFP-03-Report-Generation`

## Flow 1: RFP-01-Email-Intake
- [ ] Set Caixa de Correio Original: `ofertasdn@indracompany.com`
- [ ] Set Incluir Anexos: `Sim`
- [ ] Delete placeholder Compose
- [ ] Add Inicializar variável: `v_offer_id`
- [ ] Add Definir variável: `concat('OFR-', ...)`
- [ ] Add Adicionar nova linha: `RFP Ofertas`
- [ ] Add Texto do Html: Convert email body
- [ ] Add Executar fluxo filho: `RFP-02-Processing-Pipeline`
- [ ] Save and DISABLE

---

# Expressions Reference

| Expression | Used In | Result Example |
|------------|---------|----------------|
| `concat('OFR-', formatDateTime(utcNow(), 'yyyyMMdd-HHmmss'))` | Flow 1, Action 2 | `OFR-20260405-134522` |
| `concat('https://indracompany.sharepoint.com/sites/OfertasDN/Shared Documents/Ofertas/', variables('v_offer_id'))` | Flow 1, Action 3 | Full SharePoint URL |

---

# Dynamic Content Quick Reference

| Symbol | Meaning |
|--------|---------|
| ⚡ | Click lightning bolt icon to open Dynamic Content panel |
| 🔵 | Blue pill = Dynamic content reference (from another action) |
| `fx` | Switch to Expression tab for formulas |
| `Text` | Output of AI Builder actions (the generated text response) |
| `Saídas` | Output of Compose actions |

---

# Testing Strategy

| Phase | What to Test | How |
|-------|-------------|-----|
| **Phase 1** | Flow 3 alone | Manual trigger with a Dataverse row ID |
| **Phase 2** | Flow 2 → Flow 3 | Manual trigger with ID + sample text from `test_en.txt` |
| **Phase 3** | Full E2E | Enable Flow 1, send test email to `ofertasdn@indracompany.com` |
