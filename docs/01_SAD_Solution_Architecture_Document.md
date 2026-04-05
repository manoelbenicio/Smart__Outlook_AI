# Solution Architecture Document (SAD)
## RFP Auto-Diligence Pipeline — v2.1
## 🏢 Arquitetura 100% Microsoft Power Platform / Copilot Studio

| Campo | Valor |
|---|---|
| **Projeto** | AI Smart Organizer — RFP Auto-Diligence |
| **Versão** | 2.1 |
| **Status** | ✅ IN DEPLOYMENT |
| **Autor** | Antigravity AI + Manoel Benicio |
| **Data** | 2026-04-05 |
| **Aprovador** | Manoel Benicio (Arquiteto/Líder de Prática) |
| **Classificação** | Interno — Indra Group / Minsait |
| **Supersedes** | SAD v1.0 (descartado — usava Python local) |

---

## 1. Princípio de Design

> **"100% Corporate Stack"** — A solução DEVE rodar inteiramente em ferramentas
> corporativas Microsoft já licenciadas (M365 + Power Platform + Copilot Studio).
> Nenhum componente externo, local, ou não-corporativo será utilizado.

---

## 2. Contexto e Problema

### 2.1 Situação Atual (AS-IS)

O time de Arquitetos e Pré-Vendas recebe ofertas/RFPs via caixa compartilhada
**"Ofertas DN"** (`ofertasdn@indracompany.com`). Processo atual:

```
📧 Email chega → 👤 Humano lê → 👤 Humano extrai dados →
👤 Humano preenche templates → 👤 Humano avalia GO/NO-GO →
👤 Humano escreve email resumo → ⏱️ ~4 horas/oferta
```

### 2.2 Situação Desejada (TO-BE)

```
📧 Email chega → ⚡ Power Automate captura →
🤖 AI Builder extrai docs → 🧠 Copilot Studio classifica →
📊 Power Automate preenche + gera report →
📧 Email GO/NO-GO enviado → ⏱️ 10-30 min/oferta
```

---

## 3. Componentes da Solução

### 3.1 Inventário de Componentes

| # | Componente | Produto Microsoft | Licença | Papel na Solução |
|---|---|---|---|---|
| C1 | **Copilot Studio Agent** | Microsoft Copilot Studio | ✅ Já licenciado | Cérebro: orquestração, IA generativa, classificação, scoring |
| C2 | **Power Automate Cloud Flow** | Power Automate | ✅ Incluso M365 | Braços: trigger de email, salvar anexos, chamar AI, enviar report |
| C3 | **AI Builder — Prompt Builder** | AI Builder (Power Platform) | ✅ Incluso Copilot Studio | IA: prompts GPT-4.1 para extração/classificação de documentos |
| C4 | **AI Builder — Document Processing** | AI Builder (Power Platform) | ✅ Incluso Copilot Studio | Extração estruturada de PDFs/DOCX/XLSX |
| C5 | **SharePoint Online** | SharePoint | ✅ Já licenciado | Repositório: armazenamento de ofertas + artefatos gerados |
| C6 | **Dataverse** | Dataverse | ✅ Incluso Copilot Studio | Banco de dados: tracking de ofertas, scorecard, status |
| C7 | **Outlook Connector** | Office 365 Outlook | ✅ Incluso M365 | Input: monitorar Ofertas DN; Output: enviar email report |
| C8 | **Teams Connector** | Microsoft Teams | ✅ Incluso M365 | Notificações: alertar sobre novas ofertas e deadlines |
| C9 | **Word Online** | Microsoft Word | ✅ Incluso M365 | Geração do GO_NO_GO_Report.docx via template |

> **Custo incremental: R$ 0** — Todos os componentes estão incluídos nas licenças já existentes (M365 + Copilot Studio).

---

## 4. Arquitetura Detalhada

### 4.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSOFT 365 TENANT                         │
│                    (Indra Group / Minsait)                       │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  📧 LAYER 1: EVENT TRIGGER                                │  │
│  │                                                            │  │
│  │  Power Automate Cloud Flow                                 │  │
│  │  ┌──────────────────────────────────────────────────┐     │  │
│  │  │ Trigger: "When a new email arrives (V3)"          │     │  │
│  │  │ Mailbox: Ofertas DN                               │     │  │
│  │  │ Filter: Has Attachments = Yes                     │     │  │
│  │  │                                                    │     │  │
│  │  │ Actions:                                           │     │  │
│  │  │  1. Parse email body (HTML → text)                 │     │  │
│  │  │  2. Create folder in SharePoint /Ofertas/{ID}      │     │  │
│  │  │  3. Save body.txt to SharePoint                    │     │  │
│  │  │  4. For each attachment → Save to SharePoint       │     │  │
│  │  │  5. Create Dataverse record (status: PROCESSING)   │     │  │
│  │  │  6. Call → Flow 2 (Processing Pipeline)            │     │  │
│  │  └──────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🔬 LAYER 2: DOCUMENT EXTRACTION                          │  │
│  │                                                            │  │
│  │  Power Automate Flow 2 (Child Flow)                        │  │
│  │  ┌──────────────────────────────────────────────────┐     │  │
│  │  │ For each file in SharePoint /Ofertas/{ID}/:       │     │  │
│  │  │                                                    │     │  │
│  │  │  IF PDF:                                           │     │  │
│  │  │    → AI Builder: Document Processing               │     │  │
│  │  │    → Extract text, tables, key-value pairs         │     │  │
│  │  │                                                    │     │  │
│  │  │  IF DOCX:                                          │     │  │
│  │  │    → Word Online: Get content as plain text        │     │  │
│  │  │                                                    │     │  │
│  │  │  IF XLSX:                                          │     │  │
│  │  │    → Excel Online: List rows + Get worksheets      │     │  │
│  │  │                                                    │     │  │
│  │  │  IF ZIP:                                           │     │  │
│  │  │    → SharePoint: Extract (native ZIP support)      │     │  │
│  │  │    → Re-process extracted files                    │     │  │
│  │  │                                                    │     │  │
│  │  │  → Concatenate all extracted text                  │     │  │
│  │  │  → Save raw_extract.txt to SharePoint              │     │  │
│  │  │  → Update Dataverse: extraction_status = DONE      │     │  │
│  │  └──────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🧠 LAYER 3: AI CLASSIFICATION + FIELD MAPPING            │  │
│  │                                                            │  │
│  │  AI Builder — Prompt Builder (GPT-4.1)                     │  │
│  │  ┌──────────────────────────────────────────────────┐     │  │
│  │  │ PROMPT 1: "Classify Offer"                        │     │  │
│  │  │  Input: raw_extract.txt                           │     │  │
│  │  │  Output JSON:                                     │     │  │
│  │  │   { client, rfp_id, offer_code, offer_type,       │     │  │
│  │  │     deadline, estimated_value, scope_summary,     │     │  │
│  │  │     horizontal, contact }                         │     │  │
│  │  │                                                    │     │  │
│  │  │ PROMPT 2: "Extract Diligence Fields"              │     │  │
│  │  │  Input: raw_extract.txt + JSON Schema v2.1        │     │  │
│  │  │  Output JSON: rfp_template_filled (campo-a-campo) │     │  │
│  │  │  Rules: A_VALIDAR se sem evidência                │     │  │
│  │  │                                                    │     │  │
│  │  │ PROMPT 3: "Technology & Practices Catalog"        │     │  │
│  │  │  Input: raw_extract.txt                           │     │  │
│  │  │  Output: technologies[], practices[]               │     │  │
│  │  │                                                    │     │  │
│  │  │ PROMPT 4: "GO/NO-GO Scoring"                      │     │  │
│  │  │  Input: filled JSON + company context              │     │  │
│  │  │  Output: scorecard[], recommendation,              │     │  │
│  │  │          blockers[], next_actions[]                │     │  │
│  │  └──────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  📊 LAYER 4: OUTPUT GENERATION                             │  │
│  │                                                            │  │
│  │  Power Automate Flow 3 (Report)                            │  │
│  │  ┌──────────────────────────────────────────────────┐     │  │
│  │  │ 1. Parse AI outputs (JSON)                        │     │  │
│  │  │ 2. Update Dataverse record with all fields        │     │  │
│  │  │ 3. Word Online: Populate GO_NO_GO template        │     │  │
│  │  │    → Save as PDF to SharePoint                    │     │  │
│  │  │ 4. Compose email HTML (Adaptive Card / HTML)      │     │  │
│  │  │ 5. Send email to: mbenicios@minsait.com           │     │  │
│  │  │    cc: stakeholders                               │     │  │
│  │  │    attachments: Report.pdf + Summary.xlsx          │     │  │
│  │  │ 6. Post Teams notification with summary            │     │  │
│  │  │ 7. Update Dataverse: status = COMPLETED           │     │  │
│  │  └──────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💾 LAYER 5: DATA STORE                                    │  │
│  │                                                            │  │
│  │  SharePoint: /sites/OfertasDN/                             │  │
│  │  ├── /Ofertas/{offer_code}/                                │  │
│  │  │   ├── /input/     (email + attachments originais)       │  │
│  │  │   ├── /extracted/ (raw text + manifest)                 │  │
│  │  │   └── /output/    (Report.pdf, Summary.xlsx, JSON)      │  │
│  │  │                                                         │  │
│  │  Dataverse: Table "Ofertas"                                │  │
│  │  ├── offer_id (PK)                                         │  │
│  │  ├── client, rfp_id, offer_code, offer_type                │  │
│  │  ├── deadline, estimated_value, horizontal                 │  │
│  │  ├── recommendation (GO/GO_CONDITIONAL/NO_GO)              │  │
│  │  ├── score_total, confidence                               │  │
│  │  ├── status (RECEIVED/PROCESSING/COMPLETED/DECIDED)        │  │
│  │  ├── blockers_p0_count, fields_a_validar_count             │  │
│  │  ├── processing_time_seconds                               │  │
│  │  └── created_at, completed_at, decided_at                  │  │
│  │                                                            │  │
│  │  Dataverse: Table "Scorecard Items"                        │  │
│  │  ├── item_id (PK), offer_id (FK)                           │  │
│  │  ├── dimension, score_1_5, weight_percent                  │  │
│  │  ├── rationale, evidence_refs                              │  │
│  │  └── created_at                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🤖 COPILOT STUDIO AGENT (Fase 2 — Interativo)            │  │
│  │                                                            │  │
│  │  "RFP Diligence Assistant"                                 │  │
│  │  ├── Topic: "Check Offer Status"                           │  │
│  │  │   → Query Dataverse → respond with current status       │  │
│  │  ├── Topic: "Ask about RFP"                                │  │
│  │  │   → Retrieve raw_extract from SharePoint                │  │
│  │  │   → AI Builder: answer question from document           │  │
│  │  ├── Topic: "List Active Offers"                           │  │
│  │  │   → Query Dataverse → table of active offers            │  │
│  │  ├── Topic: "Reprocess Offer"                              │  │
│  │  │   → Trigger Processing flow again                       │  │
│  │  └── Topic: "Generate Comparison"                          │  │
│  │      → Compare multiple offers side-by-side                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. AI Builder — Prompts Deployados

> **Status:** Todos os 4 prompts deployados e publicados no ambiente **ColOfertasBrasilPro**
> em 2026-04-05. Modelo: **GPT-4.1** (Azure OpenAI via tenant corporativo).

### 5.1 Prompt 1: RFP_Classify_Offer ✅ DEPLOYED

| Propriedade | Valor |
|---|---|
| **Ambiente** | ColOfertasBrasilPro |
| **Modelo** | GPT-4.1 |
| **Temperature** | 0.1 |
| **Inputs** | `email_body` (Texto), `sender_info` (Texto) |

**Instrução:**
```
You are an email classification agent for Minsait (Indra Group).
Classify incoming emails from the Ofertas DN shared mailbox.
Analyze the email body and sender to determine if it is a genuine
RFP/offer or administrative noise. Return ONLY valid JSON.
Categories: RFP_PUBLICA, RFP_PRIVADA, PEDIDO_COTACAO, ADITIVO,
INFORMATIVO, SPAM_INTERNO, OUTROS.
Principio Zero: If uncertain, use A_VALIDAR.
```

### 5.2 Prompt 2: RFP_Extract_Fields ✅ DEPLOYED

| Propriedade | Valor |
|---|---|
| **Ambiente** | ColOfertasBrasilPro |
| **Modelo** | GPT-4.1 |
| **Inputs** | `classification_json` (Texto), `document_text` (Texto) |

**Instrução:**
```
You are a document extraction agent for Minsait (Indra Group).
Extract structured data from RFP documents into 5 sections:
rfp_meta, scope, delivery, commercial, legal.
RULES: Return ONLY valid JSON. If a field cannot be found,
set value to A_VALIDAR. NEVER fabricate data.
Process documents in PT-BR, ES, EN.
Normalize dates to YYYY-MM-DD. Count total A_VALIDAR fields.
```

### 5.3 Prompt 3: RFP_Tech_Practices ✅ DEPLOYED

| Propriedade | Valor |
|---|---|
| **Ambiente** | ColOfertasBrasilPro |
| **Modelo** | GPT-4.1 |
| **Inputs** | `document_text` (Texto) |

**Instrução:**
```
You are a technology analysis agent for Minsait (Indra Group).
Scan RFP documents to identify ALL technologies, tools,
methodologies, certifications, and practices.
Separate REQUIRED from PREFERRED. Do NOT invent technologies.
Return ONLY valid JSON with minsait_capability_match analysis.
```

### 5.4 Prompt 4: RFP_GoNoGo_Score ✅ DEPLOYED

| Propriedade | Valor |
|---|---|
| **Ambiente** | ColOfertasBrasilPro |
| **Modelo** | GPT-4.1 |
| **Inputs** | `classification_json`, `extracted_fields_json`, `tech_catalog_json`, `document_text` (todos Texto) |

**Instrução:**
```
You are a strategic assessment agent for Minsait (Indra Group).
Evaluate RFP opportunities with 5 weighted scoring dimensions:
strategic_fit 25%, technical_viability 20%, estimated_margin 20%,
timeline_capacity 15%, contract_risk 20%.
Score 1-5 each. NEVER inflate scores. Be conservative.
Minsait rate 180 BRL/hour.
Thresholds: >= 3.5 GO, >= 2.5 GO_CONDITIONAL, < 2.5 NO_GO.
Return ONLY valid JSON with dimensions, weighted_total, recommendation.
```

---

## 6. Flows Power Automate — Especificação

### 6.1 Flow 1: Email Trigger + Intake

| Step | Action | Connector | Detalhes |
|---|---|---|---|
| 1 | Trigger: When new email arrives (V3) | Office 365 Outlook | Folder: Ofertas DN, Include Attachments: Yes |
| 2 | Initialize variable: offer_id | — | `concat('OFR-', utcNow('yyyyMMdd-HHmmss'))` |
| 3 | Create folder in SharePoint | SharePoint | Path: `/Ofertas/{offer_id}/input/` |
| 4 | Create file: body.html | SharePoint | Content: `triggerBody()?['body']?['content']` |
| 5 | Apply to each: attachments | — | `triggerBody()?['attachments']` |
| 5a | → Create file per attachment | SharePoint | Path: `/Ofertas/{offer_id}/input/{name}` |
| 6 | Create Dataverse row | Dataverse | Table: Ofertas, status: RECEIVED |
| 7 | Run child flow: Processing Pipeline | Power Automate | Input: offer_id |

### 6.2 Flow 2: Processing Pipeline (Child Flow)

| Step | Action | Input | Output |
|---|---|---|---|
| 1 | List files in SharePoint folder | `/Ofertas/{offer_id}/input/` | file_list[] |
| 2 | For each file: | — | — |
| 2a | IF file is PDF → AI Builder: Extract text from document | file_content | extracted_text |
| 2b | IF file is DOCX → Word Online: Convert to plain text | file_url | extracted_text |
| 2c | IF file is XLSX → Excel: Get tables as JSON | file_url | tables_json |
| 3 | Concatenate all extracted texts | texts[] | raw_extract |
| 4 | Save raw_extract.txt to SharePoint | `/Ofertas/{offer_id}/extracted/` | — |
| 5 | AI Builder Prompt 1: Classify Offer | raw_extract | classification_json |
| 6 | Parse JSON: classification | classification_json | variables |
| 7 | AI Builder Prompt 2: Extract Fields | raw_extract + schema | filled_json |
| 8 | AI Builder Prompt 3: Tech & Practices | raw_extract | catalogs_json |
| 9 | AI Builder Prompt 4: GO/NO-GO Score | filled_json | scorecard_json |
| 10 | Update Dataverse with all results | all JSONs | — |
| 11 | Run child flow: Report Generation | offer_id | — |

### 6.3 Flow 3: Report Generation

| Step | Action | Detalhes |
|---|---|---|
| 1 | Get Dataverse record by offer_id | All fields |
| 2 | Word Online: Populate template | GO_NO_GO_Report_Template.docx stored in SharePoint |
| 3 | Convert Word to PDF | Word Online connector |
| 4 | Save PDF to SharePoint | `/Ofertas/{offer_id}/output/` |
| 5 | Compose HTML email body | Adaptive Card or rich HTML with scorecard table |
| 6 | Send email (V2) | To: configured recipients, Attachments: Report.pdf |
| 7 | Post to Teams channel | Adaptive Card with summary + deep link |
| 8 | Update Dataverse: status = COMPLETED | processing_time = elapsed |

---

## 7. Dataverse Schema

### 7.1 Table: Ofertas

| Column | Type | Description |
|---|---|---|
| offer_id | Text (PK) | Auto-generated: OFR-YYYYMMDD-HHmmss |
| client | Text | Nome do cliente |
| rfp_id | Text | ID da RFP (do email) |
| offer_code | Text | Código da oferta (ex: ENCPFLACA) |
| offer_type | Choice | LI, SOC, NOC, CLOUD, APPS, OUTSOURCING, OTHER |
| submission_deadline | Date | Prazo de submissão |
| estimated_value | Currency | Valor estimado |
| scope_summary | Multiline | Resumo do escopo |
| horizontal | Text | Horizontal (DS, SGE, AM, etc.) |
| recommendation | Choice | GO, GO_CONDITIONAL, NO_GO |
| score_total | Decimal | Score ponderado (1-5) |
| confidence | Decimal | 0.0 - 1.0 |
| headline | Text | 1 frase da recomendação |
| blockers_p0_count | Number | Quantidade de blockers P0 |
| fields_a_validar | Number | Campos não encontrados |
| status | Choice | RECEIVED, PROCESSING, COMPLETED, DECIDED |
| email_subject | Text | Assunto do email original |
| sender_name | Text | Remetente |
| sharepoint_folder | URL | Link para pasta no SP |
| processing_time_sec | Number | Tempo de processamento |
| created_at | DateTime | |
| completed_at | DateTime | |
| decided_at | DateTime | |
| decision_by | Text | Quem decidiu (manual) |

### 7.2 Table: Scorecard_Items

| Column | Type |
|---|---|
| item_id | AutoNumber (PK) |
| offer_id | Lookup → Ofertas |
| dimension | Text |
| score_1_5 | Number |
| weight_percent | Number |
| rationale | Multiline |
| evidence_refs | Multiline |

---

## 8. Segurança e Compliance

| Aspecto | Controle |
|---|---|
| Dados de RFPs | Processados 100% dentro do tenant M365 (Azure da Indra) |
| AI Builder GPT-4o | Roda no Azure do tenant corporativo — dados não saem |
| Acesso SharePoint | Permissões delegadas via Power Automate (conta do usuário) |
| Dataverse | Row-level security configurável por prática |
| Credenciais | Zero hardcoded — tudo via conexões Power Platform |
| Audit trail | Dataverse change tracking + Power Automate run history |
| LGPD/GDPR | Sem dados pessoais processados (ofertas comerciais) |

---

## 9. Consumo de Créditos (Estimativa)

| Componente | Créditos por oferta | Volume mensal | Total mensal |
|---|---|---|---|
| AI Builder Prompt (4 chamadas) | ~4 créditos | ~15 ofertas | ~60 créditos |
| Power Automate Standard | ~10 runs | ~15 ofertas | ~150 runs |
| SharePoint storage | ~50MB | ~15 ofertas | ~750MB |
| **Total** | | | **~60 AI credits + 150 flow runs** |

> **Nota:** A licença Copilot Studio inclui AI Builder credits. Verificar quota no admin center.

---

## 10. Riscos e Mitigações

| Risco | Prob | Impacto | Mitigação |
|---|---|---|---|
| AI Builder quota insuficiente | Média | Alto | Monitorar no admin center; solicitar aumento se necessário |
| Extração de PDF complexo falha | Média | Médio | Fallback: marcar como FAILED, processar manualmente |
| Token limit excedido em documentos grandes | Média | Médio | Dividir em chunks (páginas 1-10, 11-20, etc.) |
| Power Automate throttling | Baixa | Baixo | Retry policy + delays entre chamadas AI |
| Classificação incorreta | Média | Médio | Human-in-the-loop: email pede confirmação antes de decidir |
| SharePoint permissions | Baixa | Alto | Testar permissões antes do deploy |

---

## 11. Plano de Deploy

### 11.1 Ambientes Power Platform

| Ambiente | Propósito | URL | Status |
|---|---|---|---|
| **ColOfertasBrasilPro** | Desenvolvimento + Produção | `make.powerapps.com` | ✅ ATIVO |
| **DEV** | Testes isolados (futuro) | — | ⏳ FUTURO |
| **TEST** | Testes com ofertas reais (cópias) | — | ⏳ FUTURO |

### 11.2 Critérios de Promoção

**DEV → TEST:**
- [ ] Flows 1-3 criados e testados individualmente
- [x] AI Builder prompts deployados e publicados (4/4)
- [x] Dataverse tables criadas (rfp_ofertas + rfp_scorecarditem)
- [x] SharePoint site criado com estrutura de pastas

**TEST → PROD:**
- [ ] 3 ofertas reais processadas com sucesso
- [ ] Tempo E2E ≤ 30 min comprovado
- [ ] Email report aprovado (formato e conteúdo)
- [ ] Créditos AI Builder suficientes confirmados
- [ ] Documentação operacional revisada

---

## 12. Próximos Passos (após aprovação)

1. ~~**Criar SharePoint site**~~ ✅ DONE — `/sites/OfertasDN/` com Ofertas + Templates
2. ~~**Criar Dataverse tables**~~ ✅ DONE — rfp_ofertas (26 colunas) + rfp_scorecarditem
3. ~~**Criar AI Builder Prompts**~~ ✅ DONE — 4 prompts GPT-4.1 publicados
4. **Criar Power Automate Flows** — 3 flows: Trigger + Pipeline + Report ⏳ PRÓXIMO
5. **Criar template Word** GO_NO_GO_Report_Template.docx ⏳ PENDENTE
6. **Criar Copilot Studio Agent** (Fase 2: interface conversacional) ⏳ FUTURO
7. **Testar E2E** com 3 ofertas da Ofertas DN ⏳ APÓS FLOWS

---

## 13. Aprovações

| Papel | Nome | Status | Data |
|---|---|---|---|
| Arquiteto / Líder de Prática | Manoel Benicio | ✅ IN PROGRESS | 2026-04-05 |

> **Nota:** Implementação da infraestrutura (SharePoint, Dataverse, AI Builder) foi aprovada e executada. Flows pendentes de deployment.
