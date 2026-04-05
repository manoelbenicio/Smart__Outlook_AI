# Functional Specification (FS)
## RFP Auto-Diligence Pipeline — v2.1
## 🏢 Arquitetura 100% Microsoft Power Platform / Copilot Studio

| Campo | Valor |
|---|---|
| **Ref. SAD** | `01_SAD_Solution_Architecture_Document.md` v2.1 |
| **Ref. TDD** | `02_TDD_Technical_Design_Document.md` v2.1 |
| **Status** | ✅ UPDATED |
| **Audiência** | Stakeholders de negócio, equipe de pré-vendas |
| **Data** | 2026-04-05 |

---

## 1. Visão Geral

### 1.1 O que é
Um sistema automatizado que analisa novas ofertas/RFPs recebidas na caixa
Ofertas DN e gera um relatório GO/NO-GO para tomada de decisão.

### 1.2 Para quem
- **Arquitetos de Solução / Pré-Vendas** — recebem o report pronto
- **Diretoria de Prática / Mercado** — tomam a decisão GO/NO-GO
- **Bid Managers** — acompanham status das ofertas

### 1.3 Problema que resolve
Hoje, cada nova oferta exige ~4 horas de trabalho manual para ler documentos,
extrair dados, avaliar viabilidade e preparar recomendação. Com ~3-5 ofertas por
semana, isso consome 12-20 horas/semana de trabalho qualificado.

### 1.4 Como resolve
O sistema faz automaticamente em 10-30 minutos:
1. Captura o email e seus anexos
2. Extrai texto de PDFs, Word e Excel
3. Usa IA para classificar e mapear os dados
4. Avalia cada dimensão com scoring 1-5
5. Envia email com a recomendação GO/NO-GO

---

## 2. Personas e Jornadas

### 2.1 Persona: Manoel (Líder de Prática / Arquiteto)

**Antes (AS-IS):**
```
09:00 — Chega email com nova RFP (PDF de 47 páginas)
09:05 — Abre PDF, começa a ler
09:45 — Extrai dados-chave para uma planilha
10:15 — Avalia requisitos técnicos vs capacidade da equipe
10:45 — Consulta rate card, estima margem
11:00 — Preenche template de diligência
11:30 — Escreve email-resumo com recomendação
12:00 — Envia para Diretoria
⏱️ Total: ~3 horas (sem interrupções)
```

**Depois (TO-BE):**
```
09:00 — Email chega na Ofertas DN
09:15 — 🤖 Sistema processa automaticamente
09:30 — 📧 Recebe email GO/NO-GO com scorecard completo
09:32 — Revisa o report, confirma ou ajusta
09:35 — Encaminha decisão para Diretoria
⏱️ Total: ~5 minutos de trabalho humano
```

### 2.2 Persona: Barbara (Bid Manager)

**Antes:** Precisa perguntar a vários arquitetos o status de cada oferta.

**Depois:** Abre o chat com o Agent no Teams e pergunta:
- "Quais ofertas estão ativas?"
- "Status da oferta CPFL?"
- "Quantas ofertas vieram esta semana?"

---

## 3. Funcionalidades

### 3.1 F1: Captura Automática de Ofertas

| Aspecto | Detalhe |
|---|---|
| **Trigger** | Novo email na caixa Ofertas DN |
| **O que captura** | Email body (HTML) + todos os anexos |
| **Formatos suportados** | PDF, DOCX, XLSX, CSV, ZIP |
| **Onde salva** | SharePoint → `/Ofertas/{ID}/input/` |
| **Quanto tempo** | < 2 minutos |
| **Intervenção humana** | Nenhuma |

### 3.2 F2: Extração Inteligente de Dados

| Aspecto | Detalhe |
|---|---|
| **Input** | Arquivos salvos no SharePoint |
| **O que extrai** | Texto completo de todos os documentos |
| **Tecnologia** | AI Builder Document Processing + Word/Excel Online |
| **Output** | Arquivo `raw_extract.txt` com todo conteúdo |
| **Quanto tempo** | 2-10 minutos (depende do volume) |
| **Intervenção humana** | Nenhuma |

### 3.3 F3: Classificação Automática da Oferta

| Aspecto | Detalhe |
|---|---|
| **Input** | Texto extraído |
| **O que classifica** | Cliente, tipo, valor, prazo, escopo, horizontal |
| **Tecnologia** | AI Builder Prompt GPT-4.1 |
| **Regra de ouro** | Se dado não encontrado → marcado `A_VALIDAR` (nunca inventa) |
| **Output** | JSON com metadados da oferta |
| **Quanto tempo** | 1-3 minutos |

### 3.4 F4: Mapeamento para Template de Diligência v2.1

| Aspecto | Detalhe |
|---|---|
| **Input** | Texto extraído + schema do template |
| **O que faz** | Preenche campo-a-campo o JSON do RFP Template |
| **Framework** | RFP Diligence v2.1 (Princípio Zero) |
| **Campos** | rfp_meta, executive_summary, requirements, SLAs, staffing, etc. |
| **Evidências** | Cada campo PRESENT inclui trecho-fonte do documento |
| **Output** | `filled_template.json` |

### 3.5 F5: Scoring GO/NO-GO

| Aspecto | Detalhe |
|---|---|
| **Dimensões** | 5 dimensões com peso ponderado |
| **Scale** | 1-5 por dimensão |
| **Recomendação** | GO, GO_CONDITIONAL, ou NO_GO |
| **Blockers** | Lista automática de itens P0 que impedem GO |
| **Próximas ações** | Lista de ações para as próximas 48h |
| **Decisão** | NÃO automática — sempre humana (Diretoria) |

**Dimensões do Scorecard:**

| # | Dimensão | Peso | O que avalia |
|---|---|---|---|
| 1 | Alinhamento Estratégico | 25% | Fit com práticas e capacidades |
| 2 | Viabilidade Técnica | 20% | Competência + equipe disponível |
| 3 | Margem Estimada | 20% | Valor vs custo (rate card R$ 180/h) |
| 4 | Prazo vs Capacidade | 15% | Cronograma factível |
| 5 | Risco Contratual | 20% | Cláusulas, penalidades, SLAs |

### 3.6 F6: Email Report Automático

| Aspecto | Detalhe |
|---|---|
| **Formato** | Email HTML rico + PDF em anexo |
| **Conteúdo** | Recomendação, scorecard, blockers, resumo, ações |
| **Destinatário** | mbenicios@minsait.com (configurável) |
| **Quando** | Automaticamente ao fim do processamento |
| **Importância** | Alta se NO_GO ou se há blockers P0 |

### 3.7 F7: Notificação Teams

| Aspecto | Detalhe |
|---|---|
| **Formato** | Adaptive Card no Teams |
| **Conteúdo** | Resumo + botões de ação (Approve/Reject) |
| **Canal** | Canal "Ofertas DN" ou chat direto |

### 3.8 F8: Assistente Conversacional (Fase 2)

| Aspecto | Detalhe |
|---|---|
| **Canal** | Microsoft Teams (Copilot Studio Agent) |
| **Perguntas suportadas** | Status, detalhes RFP, comparação, reprocessar |
| **Base de dados** | Dataverse (estruturado) + SharePoint (docs) |

---

## 4. Regras de Negócio

| ID | Regra | Prioridade |
|---|---|---|
| RN-01 | O sistema NUNCA decide sozinho GO/NO-GO. Sempre gera **recomendação** para aprovação humana. | P0 |
| RN-02 | Se um dado não é encontrado no documento, DEVE ser marcado `A_VALIDAR`. NUNCA inventar. | P0 |
| RN-03 | Toda informação extraída DEVE ter referência ao documento e trecho de origem. | P0 |
| RN-04 | O email report DEVE ser enviado em até 30 minutos após recebimento do email. | P0 |
| RN-05 | Ofertas com blockers P0 DEVEM ser sinalizadas com importância "Alta" no email. | P1 |
| RN-06 | O sistema DEVE processar ofertas em PT-BR, Espanhol e Inglês. | P1 |
| RN-07 | Se a extração de um documento falhar, o report DEVE informar qual doc falhou e por quê. | P1 |
| RN-08 | Todos os artefatos gerados DEVEM ser salvos no SharePoint para auditoria. | P0 |
| RN-09 | O rate card de referência para scoring de margem é R$ 180/hora. | P1 |
| RN-10 | A decisão final é prerrogativa da Diretoria de Prática + Diretoria de Mercado. | P0 |

---

## 5. Critérios de Aceitação (UAT)

### 5.1 Cenários de Aceite

| # | Cenário | Dado que... | Quando... | Então... |
|---|---|---|---|---|
| CA-01 | Oferta simples | Email com 1 PDF (10 páginas) | Email chega | Report enviado em < 15 min |
| CA-02 | Oferta complexa | Email com 3 PDFs + 1 XLSX + 1 DOCX | Email chega | Todos os docs processados |
| CA-03 | Oferta com ZIP | Email com 1 ZIP contendo 5 PDFs | Email chega | ZIP descompactado e processado |
| CA-04 | Oferta em espanhol | Documentos em ES | Email chega | Classificação correta do idioma |
| CA-05 | PDF sem texto | PDF scanned (imagem) | Processamento | Report indica "FAILED" naquele doc |
| CA-06 | Blockers P0 | Oferta sem SLA definido | Scoring | Email com importância "Alta", blocker listado |
| CA-07 | Recomendação GO | Oferta alinhada e com boa margem | Scoring | recommendation = GO, score ≥ 3.5 |
| CA-08 | Recomendação NO_GO | Valor abaixo do custo | Scoring | recommendation = NO_GO, explicação clara |
| CA-09 | Dados faltantes | RFP não informa valor | Classificação | estimated_value = "A_VALIDAR" |
| CA-10 | Consulta Agent | "Qual status da oferta CPFL?" | Chat Teams | Agent retorna status + scorecard |

### 5.2 Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---|---|---|
| Tempo E2E (email → report) | ≤ 30 min | `processing_time` no Dataverse |
| Campos extraídos corretamente | ≥ 85% | Comparação manual vs automático (3 ofertas) |
| Zero dados fabricados | 100% compliance | Auditoria: todo PRESENT tem evidência |
| Uptime do sistema | ≥ 99% (horário comercial) | Power Automate run history |
| Satisfação do usuário | ≥ 4/5 | Feedback após 1 mês de uso |

---

## 6. Fora de Escopo (v1.0)

| Item | Motivo | Quando |
|---|---|---|
| Dashboard Power BI de ofertas | Nice-to-have, não Priority | Fase futura |
| Auto-responder ao cliente | Risco de resposta incorreta | Fase futura |
| Precificação automática | Requer integração com rate card completo | Fase futura |
| Comparação automática com concorrência | Dados não disponíveis | Fase futura |
| Processamento de imagens/OCR avançado | AI Builder padrão cobre apenas texto | Fase futura |

---

## 7. Glossário

| Termo | Definição |
|---|---|
| **Ofertas DN** | Caixa de email compartilhada que recebe todas as RFPs e ofertas |
| **RFP** | Request for Proposal — documento formal de solicitação de proposta |
| **GO/NO-GO** | Decisão de perseguir ou não uma oportunidade comercial |
| **Diligence** | Processo de análise detalhada de uma oferta antes da decisão |
| **P0** | Prioridade máxima — bloqueante |
| **A_VALIDAR** | Campo que não pôde ser preenchido automaticamente |
| **Scorecard** | Tabela de pontuação por dimensão para avaliação da oferta |
| **Horizontal** | Área de prática da Minsait (DS, SGE, AM, BPO, ITO, etc.) |
| **Rate Card** | Tabela de preços por perfil/hora usado para estimar margem |

---

## Status de Aprovação

| Documento | Status |
|---|---|
| SAD v2.1 | ✅ IN DEPLOYMENT |
| TDD v2.1 | ✅ IN DEPLOYMENT |
| Ops Manual v2.0 | ✅ UPDATED |
| **Functional Spec v1.0** | **✅ UPDATED** |
