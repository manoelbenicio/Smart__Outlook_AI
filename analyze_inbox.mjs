import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { writeFileSync } from 'fs';

// Streaming CSV parser - does NOT store all records in memory
async function analyzeCSVStream(filePath, label) {
  console.log(`\nProcessing: ${label} (${filePath})`);
  
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  
  let headers = null;
  let currentRecord = '';
  let inQuotes = false;
  let recordCount = 0;
  
  // Stats accumulators (no raw data stored)
  const senderCount = new Map();
  const subjectPatterns = new Map();
  const importanceMap = new Map();
  const senderTypeCount = new Map();
  const toVsCc = { direct: 0, cc: 0, unknown: 0 };
  const userKey = 'bc54f1cb5221425d8f32b883e14d9717';
  const userEmail = 'mbenicios@minsait.com';
  
  for await (const line of rl) {
    currentRecord += (currentRecord ? '\n' : '') + line;
    
    const quoteCount = (line.match(/"/g) || []).length;
    if (inQuotes) { if (quoteCount % 2 === 1) inQuotes = false; }
    else { if (quoteCount % 2 === 1) inQuotes = true; }
    
    if (!inQuotes) {
      const fields = parseCSVLine(currentRecord);
      
      if (!headers) {
        headers = fields;
      } else if (fields.length >= 3) {
        recordCount++;
        
        // Map fields by index for speed
        const hIdx = {};
        headers.forEach((h, i) => { hIdx[h] = i; });
        
        const senderName = fields[hIdx['De: (Nome)']] || 'Unknown';
        const senderType = fields[hIdx['De: (Tipo)']] || '?';
        const subject = fields[hIdx['Assunto']] || '';
        const toAddr = (fields[hIdx['Para: (Endereço)']] || '').toLowerCase();
        const ccAddr = (fields[hIdx['CC: (Endereço)']] || '').toLowerCase();
        const importance = fields[hIdx['Importance']] || 'Normal';
        
        // Sender
        senderCount.set(senderName, (senderCount.get(senderName) || 0) + 1);
        senderTypeCount.set(senderType, (senderTypeCount.get(senderType) || 0) + 1);
        importanceMap.set(importance, (importanceMap.get(importance) || 0) + 1);
        
        // TO vs CC
        if (toAddr.includes(userKey) || toAddr.includes(userEmail)) toVsCc.direct++;
        else if (ccAddr.includes(userKey) || ccAddr.includes(userEmail)) toVsCc.cc++;
        else toVsCc.unknown++;
        
        // Subject pattern classification
        let pattern = 'Outros';
        if (/^(RE:|RES:|Re:)/i.test(subject)) pattern = 'RE: (Respostas)';
        else if (/^(FW:|ENC:|Fwd:)/i.test(subject)) pattern = 'FW: (Encaminhados)';
        else if (/oferta|RFP|proposta|anuncio de oferta|nova oportunidade/i.test(subject)) pattern = 'Ofertas/RFP/Propostas';
        else if (/reunião|meeting|convite|invite|ponto de controle/i.test(subject)) pattern = 'Reuniões/Calendar';
        else if (/^(Recusado:|Aceito:|Tentativa:|Cancelado:)/i.test(subject)) pattern = 'Respostas Calendar';
        else if (/Teams|enviou uma mensagem|mencionou você/i.test(subject)) pattern = 'Microsoft Teams';
        else if (/UGR|desvinculação|desligamento|férias|admissão/i.test(subject)) pattern = 'RH/UGR/Pessoal';
        else if (/índice|calidad|KPI|Rolling|ICD/i.test(subject)) pattern = 'Qualidade/ICD/KPIs';
        else if (/SSO|segurança|saúde|SESMT/i.test(subject)) pattern = 'SSO/Segurança';
        else if (/JIRA|sprint|deploy|pipeline|git|build/i.test(subject)) pattern = 'Dev/Tech/JIRA';
        else if (/newsletter|secret|daily|digest|weekly/i.test(subject)) pattern = 'Newsletter/Externo';
        else if (/power\s*bi|dashboard|report|relatório/i.test(subject)) pattern = 'Reports/Dashboards';
        else if (/Welcome|Manus|approved|notification/i.test(subject)) pattern = 'Notificações/Sistemas';
        else if (/comunicação|comunicado|orientações/i.test(subject)) pattern = 'Comunicações Corp.';
        else if (/Santander|CPFL|Aegea|Pluxee|Brasscom|Neoenergia|Bradesco|Itaú/i.test(subject)) pattern = 'Clientes (nome no assunto)';
        else if (/alocação|recurso|staffing|disponibilidade/i.test(subject)) pattern = 'Alocação/Staffing';
        else if (/fatura|invoice|pagamento|NF|nota fiscal/i.test(subject)) pattern = 'Financeiro/Faturas';
        else if (/aprovação|aprovado|aprovar|autorização/i.test(subject)) pattern = 'Aprovações';
        
        subjectPatterns.set(pattern, (subjectPatterns.get(pattern) || 0) + 1);
        
        if (recordCount % 2000 === 0) process.stdout.write(`\r  ${recordCount} emails processed...`);
      }
      currentRecord = '';
    }
  }
  
  console.log(`\r  ✅ ${recordCount} emails processed.`);
  
  return {
    total: recordCount,
    topSenders: getTopN(senderCount, 20),
    senderTypes: getTopN(senderTypeCount),
    subjectPatterns: getTopN(subjectPatterns, 20),
    toVsCc,
    importance: getTopN(importanceMap),
  };
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { current += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) { fields.push(current); current = ''; }
    else current += ch;
  }
  fields.push(current);
  return fields;
}

function getTopN(map, n = 10) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

// Main
console.log('=== 📊 EMAIL INBOX ANALYZER (Streaming) ===');

const inboxStats = await analyzeCSVStream('d:\\VMs\\Projetos\\AI_Smart_Organizer\\Inbox.CSV', 'Inbox');
const ofertasStats = await analyzeCSVStream('d:\\VMs\\Projetos\\AI_Smart_Organizer\\Usuario_GEN_OFERTAS.CSV', 'Ofertas DN');

// Build markdown report
let report = `# 📊 Relatório de Análise de E-mail — mbenicios@minsait.com

> **Gerado em:** ${new Date().toISOString()}
> **Fonte:** Exportação Outlook CSV (Inbox + Ofertas DN)

---

## 📬 Resumo Geral

| Caixa | Total de Emails |
|---|---|
| **Inbox** | **${inboxStats.total.toLocaleString()}** |
| **Ofertas DN** | **${ofertasStats.total.toLocaleString()}** |
| **TOTAL** | **${(inboxStats.total + ofertasStats.total).toLocaleString()}** |

---

## 📧 INBOX — Análise Detalhada

### Top 20 Remetentes

| # | Remetente | Qtd | % |
|---|---|---|---|
`;
inboxStats.topSenders.forEach(([n, c], i) => {
  report += `| ${i+1} | ${n} | ${c} | ${(c/inboxStats.total*100).toFixed(1)}% |\n`;
});

report += `\n### Direto (TO) vs Copiado (CC)\n\n| Tipo | Qtd | % |\n|---|---|---|\n`;
report += `| **Direto (TO)** | ${inboxStats.toVsCc.direct} | ${(inboxStats.toVsCc.direct/inboxStats.total*100).toFixed(1)}% |\n`;
report += `| **Copiado (CC)** | ${inboxStats.toVsCc.cc} | ${(inboxStats.toVsCc.cc/inboxStats.total*100).toFixed(1)}% |\n`;
report += `| **Outros (BCC/lista)** | ${inboxStats.toVsCc.unknown} | ${(inboxStats.toVsCc.unknown/inboxStats.total*100).toFixed(1)}% |\n`;

report += `\n### Top Categorias/Padrões Detectados\n\n| # | Categoria | Qtd | % |\n|---|---|---|---|\n`;
inboxStats.subjectPatterns.forEach(([p, c], i) => {
  report += `| ${i+1} | ${p} | ${c} | ${(c/inboxStats.total*100).toFixed(1)}% |\n`;
});

report += `\n### Importância\n\n| Nível | Qtd | % |\n|---|---|---|\n`;
inboxStats.importance.forEach(([l, c]) => {
  report += `| ${l} | ${c} | ${(c/inboxStats.total*100).toFixed(1)}% |\n`;
});

report += `\n### Tipo de Remetente\n\n| Tipo | Qtd | Descrição |\n|---|---|---|\n`;
inboxStats.senderTypes.forEach(([t, c]) => {
  report += `| ${t} | ${c} | ${t==='EX'?'Interno (Exchange)':t==='SMTP'?'Externo':t} |\n`;
});

// OFERTAS
report += `\n\n---\n\n## 📋 OFERTAS DN — Análise Detalhada\n\n### Top 20 Remetentes\n\n| # | Remetente | Qtd | % |\n|---|---|---|---|\n`;
ofertasStats.topSenders.forEach(([n, c], i) => {
  report += `| ${i+1} | ${n} | ${c} | ${(c/ofertasStats.total*100).toFixed(1)}% |\n`;
});

report += `\n### Direto (TO) vs Copiado (CC)\n\n| Tipo | Qtd | % |\n|---|---|---|\n`;
report += `| **Direto (TO)** | ${ofertasStats.toVsCc.direct} | ${(ofertasStats.toVsCc.direct/ofertasStats.total*100).toFixed(1)}% |\n`;
report += `| **Copiado (CC)** | ${ofertasStats.toVsCc.cc} | ${(ofertasStats.toVsCc.cc/ofertasStats.total*100).toFixed(1)}% |\n`;
report += `| **Outros** | ${ofertasStats.toVsCc.unknown} | ${(ofertasStats.toVsCc.unknown/ofertasStats.total*100).toFixed(1)}% |\n`;

report += `\n### Top Categorias/Padrões Detectados\n\n| # | Categoria | Qtd | % |\n|---|---|---|---|\n`;
ofertasStats.subjectPatterns.forEach(([p, c], i) => {
  report += `| ${i+1} | ${p} | ${c} | ${(c/ofertasStats.total*100).toFixed(1)}% |\n`;
});

report += `\n### Importância\n\n| Nível | Qtd | % |\n|---|---|---|\n`;
ofertasStats.importance.forEach(([l, c]) => {
  report += `| ${l} | ${c} | ${(c/ofertasStats.total*100).toFixed(1)}% |\n`;
});

writeFileSync('d:\\VMs\\Projetos\\AI_Smart_Organizer\\email_analysis_report.md', report, 'utf-8');
console.log('\n✅ Report: email_analysis_report.md');

// JSON summary
writeFileSync('d:\\VMs\\Projetos\\AI_Smart_Organizer\\email_analysis.json', JSON.stringify({
  inbox: inboxStats, ofertas: ofertasStats, generated: new Date().toISOString()
}, null, 2));
console.log('✅ JSON: email_analysis.json');
