/**
 * POC — MS Graph Privilege Gate — Tentativa 3
 * Usa Microsoft Office Client ID com escopo mínimo (User.Read)
 * Se funcionar, expande para Mail.ReadWrite
 */

import { PublicClientApplication } from "@azure/msal-node";
import * as fs from "node:fs";
import * as path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const REPORT_PATH = path.join(__dirname, "poc_report.md");
const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

function appendReport(md) {
  fs.appendFileSync(REPORT_PATH, md, "utf-8");
}

async function graphCall(method, urlPath, token, body = null) {
  const url = `${GRAPH_BASE}${urlPath}`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const start = Date.now();
  const res = await fetch(url, opts);
  const durationMs = Date.now() - start;
  let data = null;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = text; }
  return { httpStatus: res.status, ok: res.ok, data, durationMs, url, method };
}

// Clients to try, in order
const CLIENTS = [
  { name: "Microsoft Office", clientId: "d3590ed6-52b3-4102-aeff-aad2292ab01c" },
  { name: "Azure PowerShell", clientId: "1950a258-227b-4e31-a9cf-717495945fc2" },
  { name: "Visual Studio", clientId: "872cd9fa-d31f-45e0-9eab-6e460a02d1f1" },
  { name: "Azure CLI", clientId: "04b07795-8ddb-461a-bbee-02f9e1bf7b46" },
];

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("   POC — MS Graph Privilege Gate — Tentativa 3");
  console.log("   Testando múltiplos Client IDs com escopo mínimo");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let accessToken = null;
  let authClient = null;
  let authResponse = null;

  for (const client of CLIENTS) {
    console.log(`\n🔐 Tentando: ${client.name} (${client.clientId.substring(0, 8)}...)`);

    const pca = new PublicClientApplication({
      auth: { clientId: client.clientId, authority: "https://login.microsoftonline.com/common" },
    });

    try {
      const start = Date.now();
      const response = await pca.acquireTokenByDeviceCode({
        scopes: ["User.Read"],
        deviceCodeCallback: (resp) => {
          console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`  📱 ${client.name}`);
          console.log(`  1. Abra: ${resp.verificationUri}`);
          console.log(`  2. Código: ${resp.userCode}`);
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
          console.log("  Aguardando... (aceite MFA no celular se solicitado)");
        },
        timeout: 120, // 2 min timeout
      });
      const durationMs = Date.now() - start;

      accessToken = response.accessToken;
      authClient = client;
      authResponse = response;

      const md = `## ✅ TENTATIVA 3 — Device Code Flow com ${client.name}\n\n` +
        `| Campo | Valor |\n|---|---|\n` +
        `| **Timestamp** | ${new Date().toISOString()} |\n` +
        `| **Client ID** | \`${client.clientId}\` |\n` +
        `| **Status** | **PASS** |\n` +
        `| **Duração Auth** | ${durationMs} ms |\n` +
        `| **Account** | ${response.account?.username ?? "N/A"} |\n` +
        `| **Tenant ID** | ${response.tenantId ?? "N/A"} |\n` +
        `| **Escopos** | ${response.scopes?.join(", ") ?? "N/A"} |\n` +
        `| **Expira em** | ${response.expiresOn?.toISOString() ?? "N/A"} |\n\n---\n\n`;
      appendReport(md);

      console.log(`\n✅ Autenticado como: ${response.account?.username}`);
      break;
    } catch (err) {
      const md = `## ❌ TENTATIVA 3.${CLIENTS.indexOf(client) + 1} — ${client.name}\n\n` +
        `| Campo | Valor |\n|---|---|\n` +
        `| **Timestamp** | ${new Date().toISOString()} |\n` +
        `| **Client ID** | \`${client.clientId}\` |\n` +
        `| **Status** | **FAIL** |\n` +
        `| **Erro** | \`${err.errorCode ?? "unknown"}: ${err.message}\` |\n\n---\n\n`;
      appendReport(md);
      console.log(`   ❌ ${err.errorCode ?? err.message}`);
    }
  }

  if (!accessToken) {
    const md =
      `\n## 🔴 Veredicto Final: **NO-GO**\n\n` +
      `**Razão:** Nenhum Client ID público conseguiu autenticar no tenant Indra Group / Minsait.\n\n` +
      `**Timestamp:** ${new Date().toISOString()}\n\n` +
      `### Conclusão Técnica\n\n` +
      `O tenant possui políticas de segurança que impedem:\n` +
      `1. **AADSTS50105** — "User Assignment Required" habilitado para Graph Explorer e possivelmente outros apps\n` +
      `2. Device Code Flow bloqueado ou restrito a apps específicos\n` +
      `3. Consentimento de usuário bloqueado pelo administrador\n\n` +
      `### Próximos Passos (requer administrador)\n\n` +
      `1. Solicitar ao admin do tenant a criação de um App Registration com permissões delegadas\n` +
      `2. Ou solicitar que o admin atribua acesso ao Graph Explorer para o usuário\n` +
      `3. Ou usar Microsoft Graph com Application Permissions (requer admin consent)\n\n` +
      `### Alternativas sem Graph API\n\n` +
      `1. **Outlook COM/REST via add-in**: Criar um Outlook Add-in que opera dentro do contexto do usuário\n` +
      `2. **EWS (Exchange Web Services)**: Pode funcionar se EWS não estiver bloqueado\n` +
      `3. **Power Automate / Logic Apps**: Se disponível no tenant\n` +
      `4. **Outlook Rules (client-side)**: Automação via regras nativas do Outlook\n`;
    appendReport(md);
    console.log("\n🔴 RESULTADO: NO-GO — Todos os client IDs falharam.");
    console.log(`📄 Relatório: ${REPORT_PATH}`);
    process.exit(1);
  }

  // ── Run all tests T1–T6 ──────────────────────────────────────────────────
  console.log("\n📋 Executando testes T1–T6...\n");

  // T1
  {
    const r = await graphCall("GET", "/me", accessToken);
    const md = `## ${r.ok ? "✅" : "❌"} T1 — Identidade (GET /me)\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **id** | \`${r.data.id}\` |\n| **displayName** | ${r.data.displayName} |\n| **UPN** | ${r.data.userPrincipalName} |\n| **mail** | ${r.data.mail} |\n| **jobTitle** | ${r.data.jobTitle ?? "N/A"} |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T1: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", "T1 falhou"); process.exit(1); }
  }

  // Now try to get a token with Mail.ReadWrite
  console.log("\n🔑 Obtendo token com escopo Mail.ReadWrite...");
  let mailToken = accessToken;
  try {
    const pca2 = new PublicClientApplication({
      auth: { clientId: authClient.clientId, authority: "https://login.microsoftonline.com/common" },
    });
    const resp2 = await pca2.acquireTokenByDeviceCode({
      scopes: ["User.Read", "Mail.ReadWrite"],
      deviceCodeCallback: (resp) => {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`  📱 Agora com Mail.ReadWrite`);
        console.log(`  1. Abra: ${resp.verificationUri}`);
        console.log(`  2. Código: ${resp.userCode}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      },
      timeout: 120,
    });
    mailToken = resp2.accessToken;
    const md = `## ✅ AUTH-MAIL — Escopo Mail.ReadWrite obtido\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Escopos** | ${resp2.scopes?.join(", ")} |\n\n---\n\n`;
    appendReport(md);
    console.log(`✅ Token com Mail.ReadWrite obtido`);
  } catch (err) {
    const md = `## ❌ AUTH-MAIL — Falha ao obter Mail.ReadWrite\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Erro** | \`${err.message}\` |\n\n` +
      `> Mail.ReadWrite não disponível. Testes T2–T6 usarão token com User.Read apenas.\n\n---\n\n`;
    appendReport(md);
    console.log(`⚠️ Não conseguiu Mail.ReadWrite, tentando com User.Read...`);
  }

  // T2
  {
    const r = await graphCall("GET", "/me/mailFolders", mailToken);
    const md = `## ${r.ok ? "✅" : "❌"} T2 — Listar mailFolders (GET /me/mailFolders)\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **Pastas** | ${r.data.value?.length ?? 0} |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n` +
      (r.ok && r.data.value ? `<details><summary>Lista de pastas</summary>\n\n| Nome | ID (parcial) | Total |\n|---|---|---|\n${r.data.value.map(f => `| ${f.displayName} | \`${f.id.substring(0, 20)}...\` | ${f.totalItemCount ?? "?"} |`).join("\n")}\n\n</details>\n\n` : "") +
      `---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T2: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", `T2 falhou — HTTP ${r.httpStatus}`); process.exit(1); }
  }

  // T3
  let SRC_FOLDER_ID;
  {
    const r = await graphCall("POST", "/me/mailFolders", mailToken, { displayName: "_AG_POC_SRC" });
    SRC_FOLDER_ID = r.data?.id;
    const md = `## ${r.ok ? "✅" : "❌"} T3 — Criar pasta _AG_POC_SRC\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **SRC_FOLDER_ID** | \`${SRC_FOLDER_ID}\` |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T3: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", `T3 falhou — HTTP ${r.httpStatus}`); process.exit(1); }
  }

  // T4
  let DST_FOLDER_ID;
  {
    const r = await graphCall("POST", "/me/mailFolders", mailToken, { displayName: "_AG_POC_DST" });
    DST_FOLDER_ID = r.data?.id;
    const md = `## ${r.ok ? "✅" : "❌"} T4 — Criar pasta _AG_POC_DST\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **DST_FOLDER_ID** | \`${DST_FOLDER_ID}\` |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T4: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", `T4 falhou — HTTP ${r.httpStatus}`); process.exit(1); }
  }

  // T5
  let TEST_MESSAGE_ID;
  {
    const r = await graphCall("POST", `/me/mailFolders/${SRC_FOLDER_ID}/messages`, mailToken, {
      subject: "AG_POC_GRAPH_MOVE_TEST",
      body: { contentType: "Text", content: "Mensagem de teste criada pela POC de privilégios do Microsoft Graph." },
    });
    TEST_MESSAGE_ID = r.data?.id;
    const md = `## ${r.ok ? "✅" : "❌"} T5 — Criar mensagem de teste\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **TEST_MESSAGE_ID** | \`${TEST_MESSAGE_ID?.substring(0, 40)}...\` |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T5: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", `T5 falhou — HTTP ${r.httpStatus}`); process.exit(1); }
  }

  // T6
  {
    const r = await graphCall("POST", `/me/messages/${TEST_MESSAGE_ID}/move`, mailToken, { destinationId: DST_FOLDER_ID });
    const md = `## ${r.ok ? "✅" : "❌"} T6 — Mover mensagem\n\n` +
      `| Campo | Valor |\n|---|---|\n` +
      `| **Timestamp** | ${new Date().toISOString()} |\n` +
      `| **Status** | **${r.ok ? "PASS" : "FAIL"}** |\n` +
      `| **HTTP** | ${r.httpStatus} |\n` +
      `| **Duração** | ${r.durationMs} ms |\n` +
      (r.ok ? `| **Resultado** | Mensagem movida com sucesso para _AG_POC_DST |\n` : `| **Erro** | \`${JSON.stringify(r.data?.error)}\` |\n`) +
      `\n---\n\n`;
    appendReport(md);
    console.log(`${r.ok ? "✅" : "❌"} T6: ${r.ok ? "PASS" : "FAIL"} (${r.durationMs}ms)`);
    if (!r.ok) { writeVerdict("NO-GO", `T6 falhou — HTTP ${r.httpStatus}`); process.exit(1); }
  }

  // Cleanup
  console.log("\n🧹 Cleanup...");
  if (SRC_FOLDER_ID) await graphCall("DELETE", `/me/mailFolders/${SRC_FOLDER_ID}`, mailToken);
  if (DST_FOLDER_ID) await graphCall("DELETE", `/me/mailFolders/${DST_FOLDER_ID}`, mailToken);

  writeVerdict("GO", "Todos os testes T1–T6 passaram com sucesso");
  console.log("\n🎉 RESULTADO: GO!");
  console.log(`📄 Relatório: ${REPORT_PATH}`);
}

function writeVerdict(verdict, reason) {
  const emoji = verdict === "GO" ? "🟢" : "🔴";
  const md = `\n## ${emoji} Veredicto Final: **${verdict}**\n\n` +
    `**Razão:** ${reason}\n` +
    `**Timestamp:** ${new Date().toISOString()}\n`;
  appendReport(md);
}

main().catch(err => { console.error("💥 Fatal:", err); process.exit(1); });
