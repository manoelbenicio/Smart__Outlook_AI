# Agentic Project Governance Framework
## RFP Auto-Diligence Pipeline — v1.0

| Campo | Valor |
|---|---|
| **Projeto** | AI Smart Organizer — RFP Auto-Diligence Pipeline |
| **Metodologia** | Agile (Scrum-like) com Governança Agêntica |
| **Status** | 🔄 IN PROGRESS (Phase 4 — Flow Development) |
| **Data** | 2026-04-05 |
| **Project Owner** | Manoel Benicio (mbenicios@minsait.com) |

---

## 1. Matriz de Agentes (RACI)

### 1.1 Agentes Designados

| Agente | Modelo | Papel Principal | Ambiente |
|---|---|---|---|
| **🏛️ OPUS** | Claude Opus 4.6 | Architect — Planejamento, design, decisões arquiteturais, QA browser-based | Conversational + Browser |
| **⚙️ CODEX** | OpenAI Codex | Engineer — Deploy de código, fix de bugs, QA automatizado, CI/CD | Terminal + IDE |
| **👤 MANOEL** | Humano | Project Owner — Aprovação, decisões GO/NO-GO, stakeholder mgmt | Revisão + Sign-off |

### 1.2 RACI por Atividade

| Atividade | OPUS | CODEX | MANOEL |
|---|---|---|---|
| Análise de requisitos | **R** (Responsible) | I (Informed) | **A** (Accountable) |
| Design arquitetural | **R** | I | **A** |
| Documentação técnica | **R** | C (Consulted) | **A** |
| Criação de componentes (SharePoint/Dataverse) | C | **R** | **A** |
| Desenvolvimento AI Builder Prompts | **R** | C | **A** |
| Desenvolvimento Power Automate Flows | C | **R** | **A** |
| Deploy de configurações | I | **R** | **A** |
| QA Automatizado (API, JSON validation) | I | **R** | I |
| QA Browser-Based (UI, portais, validação visual) | **R** | I | I |
| Code Review / PR Approval | **R** (reviewer) | **R** (author) | **A** |
| Bug fixes | C | **R** | I |
| Release / Go-Live | C | **R** | **A** |
| Retrospectiva | **R** | **R** | **A** |

---

## 2. Contrato de Projeto (Project Charter)

### 2.1 Contrato Principal

```
════════════════════════════════════════════════════
  CONTRATO DE PROJETO AGÊNTICO
  AI Smart Organizer — RFP Auto-Diligence Pipeline
════════════════════════════════════════════════════

PARTES:
  • Project Owner: Manoel Benicio (MANOEL)
  • Architect Agent: Claude Opus 4.6 (OPUS)
  • Engineer Agent: OpenAI Codex (CODEX)

OBJETO:
  Implementação do RFP Auto-Diligence Pipeline
  conforme SAD v2.0, TDD v2.0, Ops Manual v2.0 e
  Functional Spec v1.0, utilizando 100% Microsoft
  Power Platform / Copilot Studio.

PRAZO:
  Sprint 0 (Setup):    ___/___/2026 — ___/___/2026
  Sprint 1 (Core):     ___/___/2026 — ___/___/2026
  Sprint 2 (E2E):      ___/___/2026 — ___/___/2026
  Sprint 3 (Agent):    ___/___/2026 — ___/___/2026

CRITÉRIOS DE ACEITE:
  Conforme Functional Spec v1.0, Seção 5 (10 cenários)

METODOLOGIA:
  Agile Scrum com sprints de 1 semana
  Daily check-ins com evidências timestamped
  Gates obrigatórios entre fases

ASSINATURAS:
  MANOEL: _________________________ Data: ___/___/2026
  OPUS:   [PENDING ACTIVATION]      Data: ___/___/2026
  CODEX:  [PENDING ACTIVATION]      Data: ___/___/2026

════════════════════════════════════════════════════
```

---

## 3. Sprints e Backlog

### Sprint 0 — Setup e Infraestrutura

| ID | User Story | Owner | Acceptance Criteria | Status |
|---|---|---|---|---|
| S0-01 | Como admin, preciso do SharePoint site criado | CODEX | Site `/sites/OfertasDN` acessível com pastas | ✅ DONE |
| S0-02 | Como admin, preciso das tables Dataverse criadas | CODEX | 2 tables com todas as colunas conforme TDD | ✅ DONE (1 table + JSON columns) |
| S0-03 | Como admin, preciso do template Word uploadado | CODEX | Template em `/Templates/` no SharePoint | ⏳ DEFERRED |
| S0-04 | Como admin, preciso verificar AI Builder credits | OPUS (browser) | Screenshot do admin center com quota | ✅ DONE |
| S0-05 | Como arquiteto, preciso validar permissões | OPUS (browser) | Checklist de permissões validado | ✅ DONE |

### Sprint 1 — AI + Flows Core

| ID | User Story | Owner | Acceptance Criteria | Status |
|---|---|---|---|---|
| S1-01 | Como sistema, preciso do prompt Classify_Offer | OPUS (design) + CODEX (deploy) | JSON válido para 3 amostras | ✅ DONE |
| S1-02 | Como sistema, preciso do prompt Extract_Fields | OPUS + CODEX | Campos mapeados corretamente | ✅ DONE |
| S1-03 | Como sistema, preciso do prompt Tech_Practices | OPUS + CODEX | Arrays não-vazios para amostra | ✅ DONE |
| S1-04 | Como sistema, preciso do prompt GoNoGo_Score | OPUS + CODEX | Scorecard com 5 dimensões | ✅ DONE |
| S1-05 | Como sistema, preciso do Flow 1 (Email Intake) | CODEX | Email salvo no SharePoint | ✅ CREATED |
| S1-06 | Como sistema, preciso do Flow 2 (Pipeline) | CODEX | raw_extract.txt gerado | ✅ CREATED (7 actions) |
| S1-07 | Como sistema, preciso do Flow 3 (Report) | CODEX | Email report enviado | ✅ CREATED |

### Sprint 2 — Integração E2E + QA

| ID | User Story | Owner | Acceptance Criteria | Status |
|---|---|---|---|---|
| S2-01 | Teste E2E: oferta real #1 | CODEX (auto) + OPUS (browser) | Report correto em ≤ 30min | TODO |
| S2-02 | Teste E2E: oferta real #2 | CODEX + OPUS | 2ª oferta processada | TODO |
| S2-03 | Teste E2E: oferta real #3 | CODEX + OPUS | 3ª oferta processada | TODO |
| S2-04 | Comparação automático vs manual | OPUS | ≥ 85% campos corretos | TODO |
| S2-05 | Fix bugs encontrados em E2E | CODEX | Todos bugs resolvidos | TODO |
| S2-06 | Validação browser portais | OPUS | Screenshots com evidência | TODO |

### Sprint 3 — Copilot Studio Agent

| ID | User Story | Owner | Acceptance Criteria | Status |
|---|---|---|---|---|
| S3-01 | Criar Agent no Copilot Studio | CODEX | Agent publicado | TODO |
| S3-02 | Topic: Check Status | CODEX | Retorna status correto | TODO |
| S3-03 | Topic: List Active Offers | CODEX | Lista ofertas do Dataverse | TODO |
| S3-04 | Topic: Ask About RFP | OPUS (prompt) + CODEX | Resposta baseada no doc | TODO |
| S3-05 | QA browser: testar Agent no Teams | OPUS | Screenshots + evidência | TODO |

---

## 4. Protocolo de Check-in

### 4.1 Formato Obrigatório de Check-in

Cada agente DEVE reportar no seguinte formato ao completar uma task:

```markdown
## CHECK-IN REPORT
- **Agent:** [OPUS|CODEX]
- **Sprint:** S[0-3]
- **Task ID:** S[X]-[YY]
- **Timestamp:** YYYY-MM-DD HH:MM:SS (America/Sao_Paulo)
- **Status:** [DONE|BLOCKED|IN_PROGRESS]
- **Duration:** [tempo gasto]

### O que foi feito:
[Descrição clara e concisa]

### Evidências:
- [ ] Screenshot/log anexado: [path ou link]
- [ ] Teste executado: [nome do teste + resultado]
- [ ] Artefato gerado: [nome do arquivo + localização]

### Blockers (se houver):
[Descrição + quem pode desbloquear]

### Próximo passo:
[Qual task vai iniciar em seguida]

### Assinatura:
Agent: [OPUS|CODEX] | Timestamp: [auto] | Hash: [SHA-256 do report]
```

### 4.2 Regras de Check-in

| Regra | Descrição |
|---|---|
| **CI-01** | Check-in obrigatório ao completar CADA task (não ao final do dia) |
| **CI-02** | Evidência obrigatória: screenshot, log output, ou arquivo gerado |
| **CI-03** | Timestamp obrigatório no timezone `America/Sao_Paulo` |
| **CI-04** | Se BLOCKED: notificar MANOEL imediatamente com detalhes |
| **CI-05** | Check-ins salvos em `docs/checkins/S{sprint}/S{sprint}-{task_id}.md` |
| **CI-06** | Nenhuma task nova inicia sem check-in da task anterior validado |

---

## 5. Gate Reviews (Aprovações entre Fases)

### 5.1 Gate 0 → 1: Infrastructure Ready

```
GATE REVIEW: Sprint 0 → Sprint 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checklist:
□ SharePoint site criado e acessível
□ Dataverse tables criadas com todas colunas
□ Template Word uploadado
□ AI Builder credits verificados (≥ 100)
□ Permissões validadas
□ Todos check-ins de S0 com evidência

Revisor: OPUS (técnico) + MANOEL (aprovação)
Resultado: □ APPROVED  □ APPROVED WITH CONDITIONS  □ REJECTED
Justificativa: ___________________________________
Timestamp: ___/___/2026 __:__
Assinatura MANOEL: _______________________________
```

### 5.2 Gate 1 → 2: Core Components Ready

```
GATE REVIEW: Sprint 1 → Sprint 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checklist:
□ 4 AI Builder prompts criados e testados
□ 3 Power Automate flows criados
□ Flow 1 testado com email de teste
□ Flow 2 testado com sample files
□ Flow 3 testado com dados mock
□ Todos check-ins de S1 com evidência

Revisor: OPUS (técnico) + MANOEL (aprovação)
Resultado: □ APPROVED  □ APPROVED WITH CONDITIONS  □ REJECTED
```

### 5.3 Gate 2 → 3: E2E Validated

```
GATE REVIEW: Sprint 2 → Sprint 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checklist:
□ 3 ofertas reais processadas com sucesso
□ Tempo E2E ≤ 30 min comprovado
□ Acurácia ≥ 85% campos corretos
□ Zero dados fabricados (A_VALIDAR para ausentes)
□ Email report aprovado por MANOEL
□ Todos bugs resolvidos

Revisor: OPUS (técnico) + MANOEL (aprovação)
Resultado: □ APPROVED  □ APPROVED WITH CONDITIONS  □ REJECTED
```

### 5.4 Gate 3 → PROD: Release Ready

```
GATE REVIEW: Sprint 3 → PROD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checklist:
□ Copilot Studio Agent funcional no Teams
□ 10 cenários de aceitação (CA-01 a CA-10) validados
□ Operations Manual revisado e validado
□ Power Automate solution exportada (backup)
□ Rollback plan documentado
□ Todos check-ins finais com evidência
□ Retrospectiva realizada

Revisor: OPUS (técnico) + MANOEL (aprovação)
GO-LIVE APPROVAL:
  MANOEL: _________________ Data: ___/___/2026
```

---

## 6. Handoff Protocol (Passagem entre Agentes)

### 6.1 Formato de Handoff OPUS → CODEX

Quando OPUS finalizar design/planejamento e passar para CODEX executar:

```markdown
## HANDOFF: OPUS → CODEX
- **Sprint:** S[X]
- **Task(s):** S[X]-[YY], S[X]-[ZZ]
- **Timestamp:** YYYY-MM-DD HH:MM:SS

### Contexto:
[O que foi planejado/desenhado]

### Spec para implementação:
[Instruções exatas do que CODEX deve fazer]
[File paths, configurações, valores esperados]

### Acceptance Criteria:
[Como CODEX sabe que terminou corretamente]

### Referências:
- SAD: [seção relevante]
- TDD: [seção relevante]

### Assinatura OPUS:
[Timestamp + hash]
```

### 6.2 Formato de Handoff CODEX → OPUS

Quando CODEX finalizar implementação e passar para OPUS fazer QA browser:

```markdown
## HANDOFF: CODEX → OPUS
- **Sprint:** S[X]
- **Task(s):** S[X]-[YY]
- **Timestamp:** YYYY-MM-DD HH:MM:SS

### O que foi implementado:
[Descrição + evidências de execução]

### O que OPUS deve validar:
[URLs para abrir, steps para testar no browser]
[Expected results]

### Outputs gerados:
[Arquivos, logs, screenshots]

### Assinatura CODEX:
[Timestamp + hash]
```

---

## 7. QA Distribution

### 7.1 QA Automatizado (CODEX)

| Tipo | O que testa | Ferramenta |
|---|---|---|
| JSON Validation | AI Builder outputs são JSON válido | Power Automate Parse JSON |
| Schema Compliance | JSON matches v2.1 schema | Validation Rules |
| Flow Run Status | Flows completam sem erros | Power Automate Run History API |
| Data Integrity | Dataverse records corretos | Dataverse Web API queries |
| Email Delivery | Email report é enviado | Outlook API check |
| Performance | Tempo E2E ≤ 30 min | Timestamp comparison |

### 7.2 QA Browser-Based (OPUS)

| Tipo | O que testa | Ferramenta |
|---|---|---|
| SharePoint UI | Pastas criadas, arquivos presentes | Browser → SharePoint |
| Dataverse UI | Records visíveis com dados corretos | Browser → Power Apps |
| AI Builder UI | Prompts configurados, input/output corretos | Browser → AI Builder |
| Power Automate UI | Flows criados, connections ativas | Browser → Power Automate |
| Copilot Studio | Agent funcional, topics respondendo | Browser → Teams |
| Email Visual | HTML renderizado corretamente no Outlook | Browser → Outlook Web |
| Report PDF | GO_NO_GO_Report formatado corretamente | Browser → SharePoint → Open PDF |

---

## 8. Estrutura de Evidências

### 8.1 Diretório de Check-ins

```
docs/
├── checkins/
│   ├── S0/                        ← Sprint 0 check-ins
│   │   ├── S0-01_sharepoint_site.md
│   │   ├── S0-01_evidence_screenshot.png
│   │   ├── S0-02_dataverse_tables.md
│   │   └── ...
│   ├── S1/                        ← Sprint 1 check-ins
│   │   ├── S1-01_classify_prompt.md
│   │   └── ...
│   ├── S2/                        ← Sprint 2 check-ins
│   ├── S3/                        ← Sprint 3 check-ins
│   └── gates/                     ← Gate reviews
│       ├── gate_0_to_1.md
│       ├── gate_1_to_2.md
│       ├── gate_2_to_3.md
│       └── gate_3_to_prod.md
```

### 8.2 Nomeação de Evidências

```
Formato: {task_id}_{tipo}_{timestamp}.{ext}
Exemplo: S1-05_screenshot_20260410-143022.png
Exemplo: S2-01_flow_run_log_20260415-091500.json
Exemplo: S2-04_accuracy_comparison_20260416-112000.xlsx
```

---

## 9. Definition of Done (DoD)

Uma task SÓ pode ser marcada como DONE quando:

- [x] Implementação concluída conforme Acceptance Criteria
- [x] Check-in report preenchido com timestamp
- [x] Pelo menos 1 evidência anexada (screenshot, log ou arquivo)
- [x] Se tem código: code review aprovado
- [x] Se tem UI: validação browser por OPUS
- [x] Se tem dados: validação no Dataverse/SharePoint
- [x] Check-in salvo em `docs/checkins/S{sprint}/`
- [x] Próximo passo definido

---

## 10. Retrospectiva

Ao final de cada Sprint, OPUS gera relatório:

```markdown
## SPRINT RETROSPECTIVE — S[X]
- **Period:** ___/___/2026 — ___/___/2026
- **Tasks Planned:** [N]
- **Tasks Completed:** [N]
- **Tasks Blocked:** [N]

### What went well:
- ...

### What needs improvement:
- ...

### Action items for next sprint:
- ...

### Metrics:
| Metric | Target | Actual |
|---|---|---|
| Tasks completed | 100% | __% |
| Avg processing time | ≤ 30 min | __ min |
| Accuracy | ≥ 85% | __% |
| Zero data fabrication | 100% | __% |

### Assinaturas:
OPUS: [timestamp]  CODEX: [timestamp]  MANOEL: [timestamp]
```

---

## Status de Aprovação

| Documento | Status |
|---|---|
| SAD v2.1 | ✅ UPDATED |
| TDD v2.1 | ✅ UPDATED |
| Ops Manual v2.1 | ✅ UPDATED |
| Functional Spec v2.1 | ✅ UPDATED |
| Power Automate Config Guide | ✅ NEW |
| **Governance Framework v1.0** | **🔄 IN PROGRESS** |
