# POC MS Graph Privilege Gate — Relatório Final

> [!IMPORTANT]
> **Veredicto: 🔴 NO-GO** — O tenant da Indra Group/Minsait bloqueia o acesso ao Microsoft Graph via Device Code Flow através de Conditional Access Policies.

---

## Sumário Executivo

| Item | Detalhe |
|---|---|
| **Data de execução** | 2026-04-05 (00:13Z – 00:57Z) |
| **Usuário testado** | `mbenicios@minsait.com` |
| **Organização** | Indra Group / Minsait (~60.000 funcionários) |
| **Objetivo** | Validar se o usuário consegue operar na própria mailbox via Microsoft Graph delegado |
| **Resultado** | **NO-GO** — Bloqueio por Conditional Access Policy |
| **Autenticação (senha/MFA)** | ✅ Funcionou — login bem-sucedido |
| **Acesso ao recurso** | ❌ Bloqueado pelo tenant |

---

## Cronologia Completa dos Testes

### Tentativa 1 — Device Code Flow (Azure PowerShell)

| Campo | Valor |
|---|---|
| **Timestamp** | 2026-04-05T00:15:05Z |
| **Client ID** | `1950a258-227b-4e31-a9cf-717495945fc2` (Microsoft Azure PowerShell) |
| **Escopos** | `User.Read, Mail.ReadWrite` |
| **Device Code** | `EFUG99KUF` |
| **Verification URI** | `https://login.microsoft.com/device` |
| **Resultado** | ❌ FAIL — Usuário reportou que não chegou a digitar a senha |
| **Observação** | Possivelmente bloqueado por CA Policy antes mesmo da autenticação |

---

### Tentativa 2 — Graph Explorer (Web Sign-in)

| Campo | Valor |
|---|---|
| **Timestamp** | 2026-04-05T00:19:15Z |
| **Client ID** | `de8bc8b5-d9f9-48b1-a8ad-b748da725064` (Microsoft Graph Explorer) |
| **Método** | Login interativo via browser |
| **Resultado** | ❌ FAIL — **AADSTS50105** |
| **Request ID** | `e3d6edfd-8d5e-4719-ac15-bcb87d9b2500` |
| **Correlation ID** | `019d5b01-9bea-7c2f-8e21-59f6573c986d` |

**Mensagem de erro completa:**
```
AADSTS50105: Your administrator has configured the application Graph Explorer 
('de8bc8b5-d9f9-48b1-a8ad-b748da725064') to block users unless they are specifically 
granted ('assigned') access to the application. The signed in user 
'mbenicios@minsait.com' is blocked because they are not a direct member of a group 
with access, nor had access directly assigned by an administrator. Please contact 
your administrator to assign access to this application.
```

**Análise:**
- O Enterprise Application "Graph Explorer" tem a flag **"User Assignment Required" = Yes** no Microsoft Entra ID
- O usuário `mbenicios@minsait.com` não está na lista de usuários/grupos atribuídos
- Esta é uma política deliberada do tenant, não um erro de configuração

---

### Tentativa 3 — Device Code Flow (4 Client IDs públicos)

Todos os 4 client IDs foram testados sequencialmente com timeout de 120 segundos cada:

| # | Client Name | Client ID | Timestamp | Resultado |
|---|---|---|---|---|
| 3.1 | Microsoft Office | `d3590ed6-52b3-4102-aeff-aad2292ab01c` | 00:41:43Z | ❌ `user_timeout_reached` |
| 3.2 | Azure PowerShell | `1950a258-227b-4e31-a9cf-717495945fc2` | 00:43:50Z | ❌ `user_timeout_reached` |
| 3.3 | Visual Studio | `872cd9fa-d31f-45e0-9eab-6e460a02d1f1` | 00:45:53Z | ❌ `user_timeout_reached` |
| 3.4 | Azure CLI | `04b07795-8ddb-461a-bbee-02f9e1bf7b46` | 00:47:59Z | ❌ `user_timeout_reached` |

**Observação:** Os códigos expiraram antes do usuário conseguir completar a autenticação. Isso motivou a tentativa 4.

---

### Tentativa 4 — Device Code Flow (Microsoft Office, timeout 5 min)

| Campo | Valor |
|---|---|
| **Timestamp** | 2026-04-05T00:56:54Z |
| **Client ID** | `d3590ed6-52b3-4102-aeff-aad2292ab01c` (Microsoft Office) |
| **Escopos** | `User.Read` |
| **Device Code** | `E4WKBMR7F` |
| **Timeout** | 300 segundos |
| **Resultado** | ❌ FAIL — **AADSTS53003** (Conditional Access Policy) |

**Detalhes do erro capturados da tela:**

```
Você não tem acesso

Seu login foi bem-sucedido, mas não atende aos critérios para acessar 
este recurso. Por exemplo, você pode estar entrando em um navegador, 
aplicativo, local ou um fluxo de autenticação restrito por seu administrador.
```

| Campo de Diagnóstico | Valor |
|---|---|
| **Error Code** | `53003` |
| **Request ID** | `fd7de2d0-ff7d-4f89-91e5-78ee82bb1000` |
| **Correlation ID** | `569af6a4-b875-438a-8580-d135b42d7c53` |
| **Timestamp** | `2026-04-05T00:57:16.638Z` |
| **Nome do aplicativo** | Microsoft Office |
| **ID do aplicativo** | `d3590ed6-52b3-4102-aeff-aad2292ab01c` |
| **Endereço IP** | `162.10.28.17` |
| **Identificador de dispositivo** | `1d7896ad-6728-4a24-902f-c71e44ca6d0` |
| **Plataforma do dispositivo** | Windows 10 |
| **Estado do dispositivo** | Compliant |

> [!CAUTION]
> **Achado crítico:** O login (senha + MFA) **funcionou**. O bloqueio é uma **Conditional Access Policy** que restringe o tipo de fluxo de autenticação (Device Code Flow) ou o acesso a apps não pré-aprovados. O dispositivo está marcado como **Compliant**, então o bloqueio não é por compliance do device.

---

## Análise Técnica dos Bloqueios Identificados

### 1. AADSTS50105 — User Assignment Required
- **Afeta:** Graph Explorer (`de8bc8b5...`)
- **Causa:** Enterprise Application com "User Assignment Required" = Yes
- **Impacto:** O usuário precisa ser explicitamente atribuído ao app pelo admin
- **Nível de bloqueio:** App-specific (cada app pode ter config diferente)

### 2. AADSTS53003 — Conditional Access Block
- **Afeta:** Microsoft Office (`d3590ed6...`) e provavelmente todos os apps via Device Code Flow
- **Causa:** Conditional Access Policy do tenant bloqueia:
  - Device Code Flow especificamente, **OU**
  - Acesso a apps não autorizados, **OU**
  - Fluxos de autenticação fora do padrão corporativo
- **Impacto:** Mesmo com credenciais válidas e dispositivo compliant, o acesso é negado
- **Nível de bloqueio:** Tenant-wide (política global)

### 3. Credenciais e MFA
- ✅ A autenticação (senha + MFA) funciona corretamente
- ✅ O dispositivo é reconhecido como "Compliant"
- ❌ O bloqueio ocorre **após** a autenticação, na camada de autorização

---

## Testes T1–T6 da POC

| Teste | Descrição | Status |
|---|---|---|
| AUTH | Autenticar via Device Code Flow | ❌ FAIL (CA Policy) |
| T1 | Autenticar e ler `/me` | ⬜ NÃO EXECUTADO |
| T2 | Listar `/me/mailFolders` | ⬜ NÃO EXECUTADO |
| T3 | Criar pasta `_AG_POC_SRC` | ⬜ NÃO EXECUTADO |
| T4 | Criar pasta `_AG_POC_DST` | ⬜ NÃO EXECUTADO |
| T5 | Criar mensagem de teste | ⬜ NÃO EXECUTADO |
| T6 | Mover mensagem | ⬜ NÃO EXECUTADO |

> Nenhum teste funcional (T1–T6) pôde ser executado porque a autenticação é bloqueada antes de obter o access token.

---

## 🔴 Veredicto Final: NO-GO

**O tenant da Indra Group/Minsait possui políticas de segurança enterprise que impedem o uso do Microsoft Graph API via fluxos de autenticação delegados (Device Code Flow) sem pré-autorização do administrador.**

### Bloqueadores identificados:
1. **Conditional Access Policy (AADSTS53003)** bloqueia Device Code Flow
2. **User Assignment Required (AADSTS50105)** bloqueia apps não pré-atribuídos
3. **Sem acesso ao Entra ID** para criar App Registration ou modificar políticas

---

## Alternativas e Próximos Passos

### Opção A — Solicitar App Registration ao TI (viabilidade: MÉDIA)
Pedir ao administrador do tenant para:
1. Criar um App Registration com permissões delegadas `User.Read` + `Mail.ReadWrite`
2. Atribuir o usuário ao Enterprise Application
3. Garantir que o app esteja excluído das Conditional Access Policies restritivas

### Opção B — Outlook Add-in (viabilidade: ALTA)
- Criar um **Office Add-in** que opera dentro do próprio Outlook
- O add-in roda no contexto do usuário autenticado (não precisa de Graph API externa)
- Usa a **Office.js API** (OfficeRuntime) para acessar a mailbox
- **Não requer App Registration separado** se distribuído como sideload

### Opção C — Exchange Web Services / EWS (viabilidade: MÉDIA-BAIXA)
- EWS pode estar disponível se não foi desabilitado
- Endpoint: `https://outlook.office365.com/EWS/Exchange.asmx`
- Autentica via OAuth ou NTLM (se permitido)
- Microsoft está depreciando EWS, então não é solução de longo prazo

### Opção D — Power Automate (viabilidade: ALTA se disponível)
- Se o usuário tem licença Power Automate, pode criar fluxos de automação de e-mail
- Usa conectores nativos do Microsoft 365
- Não requer permissões adicionais de Graph API
- **Verificar:** O usuário tem acesso a https://make.powerautomate.com?

### Opção E — Outlook Rules / VBA (viabilidade: ALTA)
- Regras nativas do Outlook para organização automática de e-mails
- VBA macros para automação mais complexa
- Funciona 100% client-side, sem dependência de APIs externas
- **Limitação:** Requer Outlook desktop aberto

---

## Ambiente de Teste

| Item | Valor |
|---|---|
| **OS** | Windows 10 (x64) |
| **Node.js** | v22.15.0 |
| **MSAL Node** | @azure/msal-node (latest) |
| **Browser** | Chrome 146.0.0.0 |
| **IP do usuário** | 162.10.28.17 |
| **Device Compliance** | Compliant |
| **Workspace** | `D:\VMs\Projetos\AI_Smart_Organizer` |

---

*Relatório gerado automaticamente pela POC MS Graph Privilege Gate*
*Timestamp final: 2026-04-05T00:58:00Z*
