# Operations Manual — Técnico
## RFP Auto-Diligence Pipeline — v2.0
## 🏢 Arquitetura 100% Microsoft Power Platform / Copilot Studio

| Campo | Valor |
|---|---|
| **Ref. SAD** | `01_SAD_Solution_Architecture_Document.md` v2.0 |
| **Ref. TDD** | `02_TDD_Technical_Design_Document.md` v2.0 |
| **Status** | ⏳ PENDING APPROVAL |
| **Audiência** | Administradores Power Platform, operadores do sistema |
| **Data** | 2026-04-05 |
| **Supersedes** | Ops Manual v1.0 (descartado — era Python/Docker) |

---

## 1. Pré-Requisitos

### 1.1 Licenças Necessárias (todas já existentes)

| Licença | Para quê | Validar em |
|---|---|---|
| Microsoft 365 E3/E5 | Outlook, SharePoint, Teams, Word | `admin.microsoft.com` |
| Copilot Studio | Agent + AI Builder | `copilotstudio.microsoft.com` |
| Power Automate (per user ou per flow) | Cloud Flows | `make.powerautomate.com` |

### 1.2 Permissões do Ambiente

| Recurso | Permissão Necessária | Quem Deve Ter |
|---|---|---|
| Power Platform Environment | Environment Maker | Manoel Benicio |
| Dataverse | System Customizer | Manoel Benicio |
| SharePoint (criar sites) | SharePoint Admin ou Site Owner | Manoel Benicio |
| AI Builder | AI Builder credits allocation | Power Platform Admin |
| Copilot Studio | Bot Creator | Manoel Benicio |
| Mailbox Ofertas DN | Delegate access (Read) | Service Account ou Manoel |

### 1.3 Verificação de AI Builder Credits

```
1. Acessar: https://admin.powerplatform.microsoft.com
2. Environments → [seu ambiente] → Resources → AI Builder
3. Verificar: "Available credits" ≥ 100/mês
4. Se insuficiente: solicitar ao admin via Service Request
```

---

## 2. Procedimento de Setup Inicial

### 2.1 Criar SharePoint Site (15 min)

```
1. Acessar: https://[tenant].sharepoint.com
2. + Create site → Team site
3. Nome: "OfertasDN"
4. URL: /sites/OfertasDN
5. Dentro do site → Documents:
   a. Criar pasta: "Templates"
   b. Criar pasta: "Ofertas"
   c. Upload GO_NO_GO_Report_Template.docx em /Templates/
6. Configurar permissões conforme TDD Seção 2.2
```

### 2.2 Criar Dataverse Tables (30 min)

```
1. Acessar: https://make.powerapps.com
2. Tables → + New table
3. Criar table "rfp_ofertas" com colunas conforme TDD Seção 3.1
   - Display name: "Ofertas RFP"
   - Schema name: rfp_ofertas
   - Primary column: offer_id (Text)
4. Criar table "rfp_scorecarditem" conforme TDD Seção 3.2
   - Adicionar Lookup para rfp_ofertas
5. Publicar ambas as tabelas
```

### 2.3 Criar AI Builder Prompts (45 min)

```
1. Acessar: https://make.powerapps.com → AI Builder → Prompts
2. + Create a prompt
3. Para cada prompt (4 total):
   a. Nome: conforme TDD Seção 4 (RFP_Classify_Offer, etc.)
   b. Colar System Prompt do SAD Seção 5
   c. Definir Input: raw_extract_text (ou filled_json)
   d. Model: GPT-4o
   e. Temperature: 0.1 (classify/extract) ou 0.2 (score)
   f. Testar com sample text de uma oferta real
   g. Salvar e publicar
```

### 2.4 Criar Power Automate Flows (60 min)

```
1. Acessar: https://make.powerautomate.com
2. + Create → Automated cloud flow

FLOW 1: RFP-01-Email-Intake
   a. Trigger: When a new email arrives (V3)
      - Mailbox: Ofertas DN
      - Include Attachments: Yes
   b. Seguir pseudo-código do TDD Seção 5.1
   c. Test run com email de teste
   d. DESABILITAR o flow até aprovação PROD

FLOW 2: RFP-02-Processing-Pipeline (Child)
   a. Trigger: Manually trigger (accept input: offer_id)
   b. Seguir pseudo-código do TDD Seção 5.2
   c. Atenção: configurar "Timeout" do flow para 30 min
   d. Atenção: configurar "Retry policy" nas chamadas AI Builder

FLOW 3: RFP-03-Report-Generation (Child)
   a. Trigger: Manually trigger (accept input: offer_id)
   b. Seguir pseudo-código do TDD Seção 5.3
   c. HTML do email: copiar template do TDD Seção 7
```

### 2.5 Criar Copilot Studio Agent (30 min — Fase 2)

```
1. Acessar: https://copilotstudio.microsoft.com
2. + Create → New agent
3. Nome: "RFP Diligence Assistant"
4. Environment: [ambiente do tenant]
5. Criar Topics conforme TDD Seção 6
6. Conectar ações ao Power Automate
7. Publicar no Teams
```

---

## 3. Operação Diária

### 3.1 Modo Automático (após PROD habilitado)

O sistema opera de forma **100% autônoma**:

```
1. Email chega na Ofertas DN
2. Flow 1 dispara automaticamente (~30 seg)
3. Flow 2 processa os documentos (~5-20 min)
4. Flow 3 envia email report (~1 min)
5. Usuário recebe email com GO/NO-GO
6. Usuário decide e informa decisão ao Agent
```

**Nenhuma ação manual necessária** para o processamento.

### 3.2 Monitoramento

| O que monitorar | Onde | Frequência |
|---|---|---|
| Execuções dos Flows | `make.powerautomate.com` → Run history | Diário |
| Erros/falhas | Power Automate → All runs → Failed | Diário |
| Créditos AI Builder | Admin Center → AI Builder → Credits | Semanal |
| Espaço SharePoint | Admin Center → SharePoint → Storage | Mensal |
| Ofertas processadas | Dataverse → rfp_ofertas → Views | Diário |

### 3.3 Processamento Manual (fallback)

Se o automático falhar, processar oferta manualmente:

```
1. Acessar: https://make.powerautomate.com
2. My flows → RFP-02-Processing-Pipeline → Run
3. Input: offer_id da oferta que falhou
4. Verificar resultado em /Ofertas/{id}/output/
```

---

## 4. Troubleshooting

### 4.1 Problemas Comuns

| Sintoma | Causa Provável | Solução |
|---|---|---|
| Flow 1 não disparou | Flow desabilitado ou sem permissão na mailbox | Habilitar flow; verificar conexão Outlook |
| "AI Builder quota exceeded" | Créditos insuficientes no mês | Solicitar aumento ao admin; aguardar reset mensal |
| "Timeout" no Flow 2 | PDF muito grande ou muitos anexos | Aumentar timeout; processar apenas primeiras 30 páginas |
| JSON parse error após AI Builder | LLM retornou texto não-JSON | Adicionar retry + validação de JSON no flow |
| Email report vazio | Campos do Dataverse não preenchidos | Verificar output dos prompts AI Builder |
| SharePoint "Access denied" | Conexão do Power Automate expirou | Reconectar: Flow → Connections → Re-authenticate |
| Word template falha | Campos do template não correspondem | Verificar content controls no template .docx |

### 4.2 Logs e Diagnóstico

| Tipo | Localização | Retenção |
|---|---|---|
| Power Automate Runs | `make.powerautomate.com` → Flow → Run history | 28 dias |
| AI Builder Usage | Admin Center → AI Builder → Activity | 30 dias |
| SharePoint Audit | Microsoft Purview → Audit log | 90-180 dias |
| Dataverse Audit | Power Platform Admin → Dataverse → Auditing | 90 dias |
| `processing_log.json` | SharePoint → /Ofertas/{id}/output/ | Permanente |

---

## 5. Manutenção

### 5.1 Periódica

| Tarefa | Frequência | Responsável |
|---|---|---|
| Verificar créditos AI Builder | Semanal | Admin Power Platform |
| Limpar ofertas antigas do SharePoint (> 1 ano) | Trimestral | Manoel |
| Atualizar prompts AI Builder se necessário | Conforme demanda | Manoel |
| Verificar connections dos Flows | Mensal | Manoel |
| Backup do template Word | Após cada alteração | Manoel |

### 5.2 Atualização de Prompts

Quando a classificação não estiver satisfatória:

```
1. Acessar AI Builder → Prompts → selecionar prompt
2. Editar System Prompt
3. Testar com 3 ofertas de referência
4. Salvar nova versão
5. NÃO publicar sem testar primeiro (use "Test" no editor)
```

### 5.3 Ciclo de Vida

```
Novo Prompt/Flow → Testar em DEV → Testar com 3 ofertas reais →
Documentar mudança → Aprovar → Publicar em PROD
```

---

## 6. Disaster Recovery

### 6.1 Perda de um Flow

```
1. Power Automate → Solutions → Export solution (ZIP)
   (manter backup mensalmente)
2. Import solution no mesmo ou outro ambiente
```

### 6.2 Perda de dados no Dataverse

```
1. Dataverse mantém auditoria por 90 dias
2. Admin pode restaurar rows deletados
3. JSONs originais ficam salvos no SharePoint (redundância)
```

### 6.3 Export da solução inteira

```
1. Power Platform Admin → Solutions → Create new solution
2. Adicionar: todos os Flows + Agent + Tables + Prompts
3. Export como Managed/Unmanaged solution
4. Guardar ZIP em local seguro (rede ou OneDrive)
```

---

## 7. Contatos de Suporte

| Tipo | Contato |
|---|---|
| Power Platform Admin | [Preencher com admin do tenant] |
| SharePoint Admin | [Preencher] |
| Copilot Studio Support | Microsoft Premier Support |
| Documentação | `docs/` neste repositório |

---

## Status de Aprovação

| Documento | Status |
|---|---|
| SAD v2.0 | ⏳ PENDING |
| TDD v2.0 | ⏳ PENDING |
| **Ops Manual v2.0** | **⏳ PENDING** |
| Functional Spec v1.0 | ⏳ PENDING |
