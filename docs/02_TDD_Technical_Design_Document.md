# Technical Design Document (TDD)
## RFP Auto-Diligence Pipeline — v2.1
## 🏢 Arquitetura 100% Microsoft Power Platform / Copilot Studio

| Campo | Valor |
|---|---|
| **Ref. SAD** | `01_SAD_Solution_Architecture_Document.md` v2.1 |
| **Versão** | 2.1 |
| **Status** | ✅ IN DEPLOYMENT |
| **Data** | 2026-04-05 |

---

## 1. Componentes e Versionamento

### 1.1 Plataforma

| Componente | Versão | Tipo | Licença |
|---|---|---|---|
| Microsoft 365 | E3/E5 | SaaS | Corporativo Indra |
| Power Platform | Apr 2026 | SaaS | Corporativo Indra |
| Copilot Studio | Apr 2026 | SaaS | Licenciado (tenant) |
| AI Builder | Apr 2026 | SaaS | Incluso Copilot Studio |
| Power Automate | Apr 2026 | Cloud Flows | Incluso M365 |
| SharePoint Online | Apr 2026 | SaaS | Incluso M365 |
| Dataverse | Apr 2026 | SaaS | Incluso Copilot Studio |
| Outlook Connector | V3 | Standard | Incluso |
| Teams Connector | V1 | Standard | Incluso |
| Word Online | V1 | Standard | Incluso |
| Excel Online | V1 | Standard | Incluso |

### 1.2 Artefatos a Criar

| # | Artefato | Tipo | Ambiente |
|---|---|---|---|
| A1 | SharePoint Site: `OfertasDN` | Site + Libraries | SharePoint |
| A2 | Dataverse Table: `Ofertas` | Custom Table | Power Platform |
| A3 | Dataverse Table: `Scorecard_Items` | Custom Table | Power Platform |
| A4 | AI Builder Prompt: `Classify_Offer` | Prompt Builder | AI Builder |
| A5 | AI Builder Prompt: `Extract_Fields` | Prompt Builder | AI Builder |
| A6 | AI Builder Prompt: `Tech_Practices` | Prompt Builder | AI Builder |
| A7 | AI Builder Prompt: `GoNoGo_Score` | Prompt Builder | AI Builder |
| A8 | Flow: `RFP-01-Email-Intake` | Cloud Flow (Automated) | Power Automate |
| A9 | Flow: `RFP-02-Processing-Pipeline` | Cloud Flow (Instant/Child) | Power Automate |
| A10 | Flow: `RFP-03-Report-Generation` | Cloud Flow (Instant/Child) | Power Automate |
| A11 | Template: `GO_NO_GO_Report.docx` | Word Template | SharePoint |
| A12 | Template: `Email_Report.html` | HTML Template | Embedded in Flow |
| A13 | Agent: `RFP Diligence Assistant` | Copilot Studio Agent | Copilot Studio |

---

## 2. SharePoint — Estrutura de Sites e Pastas

### 2.1 Site: `/sites/OfertasDN/`

```
/sites/OfertasDN/
├── /Shared Documents/
│   ├── /Templates/                        ← Templates fixos
│   │   ├── GO_NO_GO_Report_Template.docx
│   │   ├── RFP_Diligence_Templates_v2.1/  ← Pack v2.1 original
│   │   └── Email_Scorecard_Template.html
│   │
│   └── /Ofertas/                          ← Uma pasta por oferta
│       ├── /OFR-20260405-143022/
│       │   ├── /input/                    ← Email + anexos originais
│       │   │   ├── body.html
│       │   │   ├── RFP_Cliente_X.pdf
│       │   │   └── Planilha_Precos.xlsx
│       │   ├── /extracted/                ← Texto extraído bruto
│       │   │   ├── raw_extract.txt
│       │   │   └── tables_extract.json
│       │   └── /output/                   ← Artefatos gerados
│       │       ├── classification.json
│       │       ├── filled_template.json
│       │       ├── scorecard.json
│       │       ├── GO_NO_GO_Report.pdf
│       │       └── processing_log.json
│       └── /OFR-20260406-091545/
│           └── ...
```

### 2.2 Permissões SharePoint

| Grupo | Permissão | Quem |
|---|---|---|
| Site Owners | Full Control | Manoel Benicio, Admins |
| Site Members | Contribute | Equipe de Arquitetos/Pré-Vendas |
| Site Visitors | Read | Diretoria (para consultar reports) |
| Power Automate | Contribute | Service Connection (automático) |

---

## 3. Dataverse — Schemas Detalhados

### 3.1 Table: `rfp_ofertas`

| Column Name | Display Name | Type | Required | Notes |
|---|---|---|---|---|
| `rfp_ofertaid` | Offer ID | Autonumber (PK) | Auto | Prefix: OFR- |
| `rfp_client` | Cliente | Text (100) | Yes | |
| `rfp_rfpid` | RFP ID | Text (50) | No | Do edital |
| `rfp_offercode` | Código Oferta | Text (30) | No | Ex: ENCPFLACA |
| `rfp_offertype` | Tipo de Oferta | Choice | No | LI, SOC, NOC, CLOUD, APPS, OUTSOURCING, OTHER |
| `rfp_deadline` | Prazo Submissão | Date Only | No | |
| `rfp_estimatedvalue` | Valor Estimado | Currency | No | BRL |
| `rfp_scopesummary` | Resumo do Escopo | Multiline (2000) | No | |
| `rfp_horizontal` | Horizontal | Text (20) | No | DS, SGE, AM, etc. |
| `rfp_contactname` | Contato | Text (100) | No | |
| `rfp_duration` | Duração (meses) | Whole Number | No | |
| `rfp_executionloc` | Local Execução | Choice | No | Remoto, Presencial, Híbrido |
| `rfp_recommendation` | Recomendação | Choice | No | GO, GO_CONDITIONAL, NO_GO |
| `rfp_scoretotal` | Score Total | Decimal (2) | No | 1.00 - 5.00 |
| `rfp_confidence` | Confiança | Decimal (2) | No | 0.00 - 1.00 |
| `rfp_headline` | Headline | Text (500) | No | 1 frase |
| `rfp_blockersp0` | Blockers P0 | Whole Number | No | Contagem |
| `rfp_fieldsavalidar` | Campos A_VALIDAR | Whole Number | No | Contagem |
| `rfp_status` | Status | Choice | Yes | RECEIVED, PROCESSING, COMPLETED, DECIDED |
| `rfp_emailsubject` | Assunto Email | Text (500) | No | |
| `rfp_sendername` | Remetente | Text (200) | No | |
| `rfp_sharepointurl` | SharePoint URL | URL | No | Link para pasta |
| `rfp_processingtime` | Tempo (seg) | Whole Number | No | |
| `rfp_decisionby` | Decidido por | Text (200) | No | Nome de quem decidiu |
| `rfp_decidedat` | Decidido em | DateTime | No | |
| `createdon` | Criado em | DateTime | Auto | |
| `modifiedon` | Modificado em | DateTime | Auto | |

### 3.2 Table: `rfp_scorecarditem`

| Column Name | Type | Required | Notes |
|---|---|---|---|
| `rfp_scorecarditemid` | Autonumber (PK) | Auto | |
| `rfp_ofertaid` | Lookup → rfp_ofertas | Yes | FK |
| `rfp_dimension` | Text (100) | Yes | Ex: "Alinhamento Estratégico" |
| `rfp_score` | Whole Number | Yes | 1-5 |
| `rfp_weightpercent` | Whole Number | Yes | 0-100 |
| `rfp_rationale` | Multiline (1000) | No | |
| `rfp_evidencerefs` | Multiline (500) | No | |

---

## 4. AI Builder — Prompt Specifications

### 4.1 Prompt: `Classify_Offer`

| Propriedade | Valor |
|---|---|
| **Nome** | RFP_Classify_Offer |
| **Model** | GPT-4.1 (Azure OpenAI — tenant corp) |
| **Inputs** | `email_body` (Texto), `sender_info` (Texto) |
| **Output** | Structured JSON |
| **Temperature** | 0.1 (máxima precisão) |
| **Status** | ✅ DEPLOYED — ColOfertasBrasilPro |

**System Prompt:** Conforme seção 5.1 do SAD v2.0

**Validation do Output:**
- JSON must parse successfully
- `offer_type` must be one of enum values
- `submission_deadline` must be valid date or "A_VALIDAR"

### 4.2 Prompt: `Extract_Fields`

| Propriedade | Valor |
|---|---|
| **Nome** | RFP_Extract_Fields |
| **Model** | GPT-4.1 |
| **Inputs** | `classification_json` (Texto), `document_text` (Texto) |
| **Output** | Structured JSON (5 seções: rfp_meta, scope, delivery, commercial, legal) |
| **Status** | ✅ DEPLOYED — ColOfertasBrasilPro |

**System Prompt:** 
```
Você é o RFP Diligence Orchestrator v2.1.
Mapeie o texto para o template JSON campo-a-campo.
PRINCÍPIO ZERO: nunca inventar dados.
- Dado encontrado: field_status = "PRESENT"
- Dado não encontrado: field_status = "A_VALIDAR"
- Não se aplica: field_status = "NOT_APPLICABLE"
Para cada PRESENT: inclua excerpt do texto como evidência.
```

### 4.3 Prompt: `Tech_Practices`

| Propriedade | Valor |
|---|---|
| **Nome** | RFP_Tech_Practices |
| **Model** | GPT-4.1 |
| **Inputs** | `document_text` (Texto) |
| **Output** | JSON com technologies, methodologies, certifications, minsait_capability_match |
| **Status** | ✅ DEPLOYED — ColOfertasBrasilPro |

### 4.4 Prompt: `GoNoGo_Score`

| Propriedade | Valor |
|---|---|
| **Nome** | RFP_GoNoGo_Score |
| **Model** | GPT-4.1 |
| **Inputs** | `classification_json`, `extracted_fields_json`, `tech_catalog_json`, `document_text` (todos Texto) |
| **Output** | JSON com dimensions, weighted_total, recommendation, key_risks |
| **Status** | ✅ DEPLOYED — ColOfertasBrasilPro |

**System Prompt:** Conforme seção 5.2 do SAD v2.0

---

## 5. Power Automate Flows — Design Detalhado

### 5.1 Flow 1: `RFP-01-Email-Intake`

**Tipo:** Automated Cloud Flow
**Trigger:** When a new email arrives (V3) — Ofertas DN

```
[TRIGGER] When a new email arrives (V3)
   Folder: Ofertas DN → Inbox
   Include Attachments: Yes
   Importance: All
   │
   ├─[INIT] Initialize variable: v_offer_id
   │   Value: concat('OFR-', formatDateTime(utcNow(),'yyyyMMdd-HHmmss'))
   │
   ├─[ACTION] SharePoint: Create folder
   │   Site: /sites/OfertasDN
   │   Path: /Shared Documents/Ofertas/@{v_offer_id}/input
   │
   ├─[ACTION] SharePoint: Create file — body.html
   │   Path: /Shared Documents/Ofertas/@{v_offer_id}/input/body.html
   │   Content: @{triggerOutputs()?['body/content']}
   │
   ├─[LOOP] Apply to each: triggerOutputs()?['body/attachments']
   │   │
   │   └─[ACTION] SharePoint: Create file — attachment
   │       Path: /Ofertas/@{v_offer_id}/input/@{items('Apply_to_each')?['name']}
   │       Content: @{base64ToBinary(items('Apply_to_each')?['contentBytes'])}
   │
   ├─[ACTION] Dataverse: Add a new row → rfp_ofertas
   │   rfp_status: RECEIVED
   │   rfp_emailsubject: @{triggerOutputs()?['body/subject']}
   │   rfp_sendername: @{triggerOutputs()?['body/from']}
   │   rfp_sharepointurl: https://.../Ofertas/@{v_offer_id}
   │
   ├─[ACTION] Run a Child Flow → RFP-02-Processing-Pipeline
   │   Input: v_offer_id
   │
   └─[END]
```

### 5.2 Flow 2: `RFP-02-Processing-Pipeline`

**Tipo:** Instant Cloud Flow (Child/Called)
**Trigger:** Manually trigger / Called by Flow 1

```
[TRIGGER] Manually trigger a flow
   Input: offer_id (Text)
   │
   ├─[ACTION] Dataverse: Update row → status = PROCESSING
   │
   ├─[ACTION] SharePoint: List files in folder
   │   Path: /Ofertas/@{offer_id}/input/
   │
   ├─[INIT] v_all_text = ""
   │
   ├─[LOOP] Apply to each: file in file_list
   │   │
   │   ├─[CONDITION] If file extension = .pdf
   │   │   ├─ TRUE:
   │   │   │   [ACTION] AI Builder: Extract text from PDF
   │   │   │   [APPEND] v_all_text += extracted_text
   │   │   │
   │   ├─[CONDITION] If file extension = .docx
   │   │   ├─ TRUE:
   │   │   │   [ACTION] SharePoint: Get file content
   │   │   │   [ACTION] Word Online: Convert to text
   │   │   │   [APPEND] v_all_text += converted_text
   │   │   │
   │   ├─[CONDITION] If file extension = .xlsx
   │   │   ├─ TRUE:
   │   │   │   [ACTION] Excel Online: List rows present in table
   │   │   │   [APPEND] v_all_text += JSON.stringify(rows)
   │   │   │
   │   └─[CONDITION] If file = body.html
   │       ├─ TRUE:
   │       │   [ACTION] Content Conversion: HTML to text
   │       │   [APPEND] v_all_text += body_text
   │
   ├─[ACTION] SharePoint: Create file — raw_extract.txt
   │   Path: /Ofertas/@{offer_id}/extracted/raw_extract.txt
   │   Content: @{v_all_text}
   │
   ├─ ─ ─ AI PROCESSING ─ ─ ─
   │
   ├─[ACTION] AI Builder: Prompt "RFP_Classify_Offer"
   │   Input: v_all_text (truncated to 100K chars)
   │   Output → v_classification_json
   │
   ├─[ACTION] Parse JSON: v_classification_json
   │
   ├─[ACTION] AI Builder: Prompt "RFP_Extract_Fields"
   │   Input: v_all_text + template_schema
   │   Output → v_filled_json
   │
   ├─[ACTION] AI Builder: Prompt "RFP_Tech_Practices"
   │   Input: v_all_text
   │   Output → v_catalogs_json
   │
   ├─[ACTION] AI Builder: Prompt "RFP_GoNoGo_Score"
   │   Input: v_filled_json
   │   Output → v_scorecard_json
   │
   ├─ ─ ─ SAVE RESULTS ─ ─ ─
   │
   ├─[ACTION] SharePoint: Create file — classification.json
   ├─[ACTION] SharePoint: Create file — filled_template.json
   ├─[ACTION] SharePoint: Create file — scorecard.json
   │
   ├─[ACTION] Dataverse: Update row
   │   rfp_client, rfp_offercode, rfp_recommendation, etc.
   │   (all fields from AI outputs)
   │
   └─[ACTION] Run a Child Flow → RFP-03-Report-Generation
       Input: offer_id
```

### 5.3 Flow 3: `RFP-03-Report-Generation`

**Tipo:** Instant Cloud Flow (Child)

```
[TRIGGER] Input: offer_id
   │
   ├─[ACTION] Dataverse: Get row by ID
   │   → All offer fields
   │
   ├─[ACTION] Word Online: Populate template
   │   Template: /Templates/GO_NO_GO_Report_Template.docx
   │   Fields: client, recommendation, scorecard, etc.
   │
   ├─[ACTION] Word Online: Convert to PDF
   │   → v_report_pdf
   │
   ├─[ACTION] SharePoint: Create file — GO_NO_GO_Report.pdf
   │
   ├─[ACTION] Compose: HTML email body
   │   (Rich HTML with scorecard table, colors, icons)
   │
   ├─[ACTION] Office 365 Outlook: Send an email (V2)
   │   To: mbenicios@minsait.com
   │   Subject: "[RFP Diligence] @{recommendation} — @{client} — @{offer_code}"
   │   Body: composed HTML
   │   Attachments: GO_NO_GO_Report.pdf
   │   Importance: High (if NO_GO or blockers > 0)
   │
   ├─[ACTION] Teams: Post adaptive card
   │   Channel: Ofertas DN (ou chat direto)
   │   Card: summary with action buttons (Approve/Reject)
   │
   └─[ACTION] Dataverse: Update row
       status = COMPLETED
       processing_time = datediff(created, now)
```

---

## 6. Copilot Studio Agent — Topics

### 6.1 Agent: `RFP Diligence Assistant`

| Topic | Trigger Phrases | Action | Response |
|---|---|---|---|
| Check Status | "status oferta X", "como está a oferta" | Query Dataverse by offer_code | Card com status + scorecard resumido |
| List Active | "ofertas ativas", "pipeline de ofertas" | Query Dataverse where status != DECIDED | Tabela com todas ofertas ativas |
| Ask About RFP | "qual SLA pede o cliente?", "qual o valor?" | Get raw_extract.txt + AI Builder prompt | Resposta baseada no documento |
| Reprocess | "reprocessar oferta X" | Trigger Flow 2 novamente | Confirmação + link para pasta |
| Compare | "comparar oferta X com Y" | Get 2 Dataverse records | Tabela comparativa lado a lado |
| Deadline Alert | Event-driven (scheduled) | Query ofertas com deadline < 3 dias | Teams notification automática |

---

## 7. Email Report — Template HTML

```html
<div style="font-family: Segoe UI, sans-serif; max-width: 680px;">
  <h2 style="color: #0078D4;">📋 RFP Diligence Report</h2>
  
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <tr style="background:#0078D4; color:white;">
      <td style="padding:8px;"><b>Cliente</b></td>
      <td style="padding:8px;">{{client}}</td>
    </tr>
    <tr style="background:#f5f5f5;">
      <td style="padding:8px;"><b>Código</b></td>
      <td style="padding:8px;">{{offer_code}}</td>
    </tr>
    <tr>
      <td style="padding:8px;"><b>Valor Estimado</b></td>
      <td style="padding:8px;">{{estimated_value}}</td>
    </tr>
    <tr style="background:#f5f5f5;">
      <td style="padding:8px;"><b>Prazo</b></td>
      <td style="padding:8px;">{{deadline}}</td>
    </tr>
    <tr>
      <td style="padding:8px;"><b>Horizontal</b></td>
      <td style="padding:8px;">{{horizontal}}</td>
    </tr>
  </table>

  <!-- RECOMMENDATION BANNER -->
  <div style="background:{{rec_color}}; color:white; 
              padding:16px; border-radius:8px; text-align:center;">
    <h1 style="margin:0;">{{recommendation}}</h1>
    <p style="margin:4px 0 0;">Confiança: {{confidence}}%</p>
    <p style="margin:4px 0 0;"><em>{{headline}}</em></p>
  </div>

  <!-- SCORECARD TABLE -->
  <h3>📊 Scorecard</h3>
  <table style="width:100%; border:1px solid #ddd;">
    <tr style="background:#0078D4; color:white;">
      <th>Dimensão</th><th>Score</th><th>Peso</th>
    </tr>
    {{#each scorecard}}
    <tr>
      <td>{{dimension}}</td>
      <td style="text-align:center;">{{score}}/5</td>
      <td style="text-align:center;">{{weight}}%</td>
    </tr>
    {{/each}}
  </table>

  <!-- BLOCKERS -->
  {{#if blockers}}
  <h3>⚠️ Blockers P0</h3>
  <ul>
    {{#each blockers}}
    <li><b>{{blocker}}</b> — Owner: {{owner}}</li>
    {{/each}}
  </ul>
  {{/if}}

  <!-- FOOTER -->
  <hr>
  <p style="color:#888; font-size:12px;">
    ⏱️ Processado em {{processing_time}} seg | 
    📎 <a href="{{sharepoint_url}}">Ver artefatos no SharePoint</a> |
    🤖 Gerado automaticamente pelo RFP Diligence Pipeline v2.0
  </p>
</div>
```

**Cores por recomendação:**
- GO: `#107C10` (verde)
- GO_CONDITIONAL: `#FF8C00` (laranja)
- NO_GO: `#D13438` (vermelho)

---

## 8. Testes

### 8.1 Plano de Testes

| # | Tipo | Cenário | Critério de Aceite |
|---|---|---|---|
| T1 | Unitário | Flow 1 recebe email com 3 anexos | Todos salvos no SharePoint |
| T2 | Unitário | AI Builder extrai texto de PDF real | raw_extract.txt não vazio |
| T3 | Unitário | Prompt Classify retorna JSON válido | JSON parseable, campos corretos |
| T4 | Unitário | Prompt GoNoGo retorna scorecard | 5 dimensões, scores 1-5 |
| T5 | Integração | Flow 1 → Flow 2 → Flow 3 completo | Email report enviado |
| T6 | E2E | Oferta real da Ofertas DN | Report correto vs manual |
| T7 | E2E | 3 ofertas diferentes | Tempo médio ≤ 30 min |
| T8 | Stress | 5 ofertas simultâneas | Sem falha de throttling |
| T9 | Fallback | PDF scanned (sem texto) | Status FAILED no report |
| T10 | Validação | Comparar AI vs humano em 3 ofertas | ≥ 85% campos corretos |

---

## Status de Aprovação

| Documento | Status |
|---|---|
| SAD v2.1 | ✅ IN DEPLOYMENT |
| **TDD v2.1** | **✅ IN DEPLOYMENT** |
| Operations Manual v2.0 | ✅ UPDATED |
| Functional Spec v1.0 | ✅ UPDATED |
