# POC — MS Graph Privilege Gate via Antigravity

## Objetivo
Validar rapidamente se o usuário autenticado consegue, via Microsoft Graph em modo delegado, operar na própria mailbox com o mínimo viável para a futura automação de organização de e-mails.

## Premissas
- Sem acesso adicional de TI ao Microsoft Entra ID.
- Sem application permissions.
- Sem shared mailbox.
- Sem categorias Outlook nesta POC inicial.
- Login interativo com MFA do próprio usuário.

## Critério de GO / NO-GO
**GO** se os testes T1 a T5 passarem:
- T1: autenticar e ler `/me`
- T2: listar `/me/mailFolders`
- T3: criar pasta `_AG_POC_SRC`
- T4: criar pasta `_AG_POC_DST`
- T5: criar mensagem de teste em `_AG_POC_SRC` e movê-la para `_AG_POC_DST`

**NO-GO / Blocker** se:
- o consentimento não puder ser dado pelo usuário;
- o login pedir aprovação de administrador;
- a app não conseguir obter token com `User.Read` + `Mail.ReadWrite`;
- a criação de pasta ou o move falharem com `403`.

## Escopos mínimos
Use somente:
- `openid`
- `profile`
- `User.Read`
- `Mail.ReadWrite`

Opcional para sessões longas:
- `offline_access`

## O que NÃO entra nesta POC
- `MailboxSettings.ReadWrite`
- categorias Outlook (`/outlook/masterCategories`)
- webhooks
- delta sync
- acesso a mailbox compartilhada
- envio de e-mail

## Sequência de testes

### T1 — Identidade
**Request**
```http
GET https://graph.microsoft.com/v1.0/me
Authorization: Bearer <token>
```

**Esperado**
- `200 OK`
- retorno com `id`, `displayName`, `userPrincipalName`

### T2 — Leitura da mailbox
**Request**
```http
GET https://graph.microsoft.com/v1.0/me/mailFolders
Authorization: Bearer <token>
```

**Esperado**
- `200 OK`
- lista de pastas da mailbox

### T3 — Criar pasta de origem
**Request**
```http
POST https://graph.microsoft.com/v1.0/me/mailFolders
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "_AG_POC_SRC"
}
```

**Esperado**
- `201 Created`
- guardar `id` retornado como `SRC_FOLDER_ID`

### T4 — Criar pasta de destino
**Request**
```http
POST https://graph.microsoft.com/v1.0/me/mailFolders
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "_AG_POC_DST"
}
```

**Esperado**
- `201 Created`
- guardar `id` retornado como `DST_FOLDER_ID`

### T5 — Criar mensagem de teste em `_AG_POC_SRC`
**Request**
```http
POST https://graph.microsoft.com/v1.0/me/mailFolders/{SRC_FOLDER_ID}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "AG_POC_GRAPH_MOVE_TEST",
  "body": {
    "contentType": "Text",
    "content": "Mensagem de teste criada pela POC de privilégios do Microsoft Graph."
  }
}
```

**Esperado**
- `201 Created`
- guardar `id` retornado como `TEST_MESSAGE_ID`

### T6 — Mover a mensagem para `_AG_POC_DST`
**Request**
```http
POST https://graph.microsoft.com/v1.0/me/messages/{TEST_MESSAGE_ID}/move
Authorization: Bearer <token>
Content-Type: application/json

{
  "destinationId": "{DST_FOLDER_ID}"
}
```

**Esperado**
- `201 Created` ou resposta com a nova mensagem no destino
- prova de write/move na mailbox do usuário

## Cleanup opcional
### Remover pasta `_AG_POC_SRC`
```http
DELETE https://graph.microsoft.com/v1.0/me/mailFolders/{SRC_FOLDER_ID}
Authorization: Bearer <token>
```

### Remover pasta `_AG_POC_DST`
```http
DELETE https://graph.microsoft.com/v1.0/me/mailFolders/{DST_FOLDER_ID}
Authorization: Bearer <token>
```

## Interpretação rápida
- **Falhou antes do token / apareceu “Approval required”** → bloqueio de consentimento do tenant.
- **`/me` funciona, `/me/mailFolders` falha** → identidade ok, permissão de mail não concedida/permitida.
- **listar pastas funciona, criar pasta falha** → leitura ok, escrita não ok.
- **criar pasta funciona, criar/mover mensagem falha** → sem capacidade plena de automação de organização.
- **T1–T6 passam** → seguir para arquitetura completa com Graph delegado na mailbox própria.

## Próxima fase após GO
Somente depois do GO:
1. adicionar `MailboxSettings.ReadWrite` para categorias Outlook;
2. testar `PATCH /me/messages/{id}` para `categories`;
3. validar processamento incremental;
4. plugar skill/classificação.
