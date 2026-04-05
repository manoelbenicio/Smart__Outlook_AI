#!/usr/bin/env python3
"""
Enterprise Email Analyzer v2.0
Senior Subject Matter Expert — Full-Stack Python Solution
Analyzes Outlook CSV exports with maximum accuracy.
Author: Antigravity AI
"""

import pandas as pd
import re
import json
import os
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# ─────────────── CONFIGURATION ───────────────
WORKSPACE = r"d:\VMs\Projetos\AI_Smart_Organizer"
INBOX_CSV = os.path.join(WORKSPACE, "Inbox.CSV")
OFERTAS_CSV = os.path.join(WORKSPACE, "Usuario_GEN_OFERTAS.CSV")
REPORT_MD = os.path.join(WORKSPACE, "email_analysis_report.md")
REPORT_JSON = os.path.join(WORKSPACE, "email_analysis.json")
USER_ADDRESS_FRAGMENT = "bc54f1cb5221425d8f32b883e14d9717"
USER_EMAIL = "mbenicios@minsait.com"

# ─────────────── CLASSIFICATION RULES (ordered by priority) ───────────────
# Each rule: (category_name, compiled_regex_pattern_on_subject, priority)
CLASSIFICATION_RULES = [
    # Calendar responses (highest priority — exact prefix match)
    ("📅 Calendar Responses",      re.compile(r"^(Recusado|Aceito|Tentativa|Cancelado|Declined|Accepted|Tentative):", re.I)),
    # Teams notifications
    ("💬 Microsoft Teams",         re.compile(r"(enviou uma mensagem|mencionou voc|Teams|novas mensagens no Teams|respondeu em|reagiu à|Responder no Teams)", re.I)),
    # JIRA / DevOps
    ("🔧 JIRA / DevOps",          re.compile(r"(JIRA|\[JIRA\]|sprint|deploy|pipeline|pull request|build|git|confluence|bitbucket|Jenkins)", re.I)),
    # Ofertas / RFP / Propostas
    ("📋 Ofertas / RFP",          re.compile(r"(oferta|RFP|proposta|anuncio de oferta|nova oportunidade|anúncio|COD\.\s*OFERTA|CÓDIGO DA OFERTA)", re.I)),
    # HR / UGR / People
    ("👥 RH / UGR / Pessoal",     re.compile(r"(UGR|desvinculação|desligamento|férias|admiss|rescis|aviso prévio|ponto.*colaborador|contratação|headcount|vagas)", re.I)),
    # Financial
    ("💰 Financeiro / Faturas",    re.compile(r"(fatura|invoice|pagamento|NF-?e?|nota fiscal|billing|cobrança|recibo|boleto|cierre|rolling forecast|forecast|presupuesto)", re.I)),
    # Quality / KPIs / ICD
    ("📊 Qualidade / ICD / KPIs",  re.compile(r"(índice|calidad|KPI|Rolling|ICD|indicador|SLA|OKR|meta|benchmark|quality|dashboard.*operacional)", re.I)),
    # SSO / Safety
    ("🛡️ SSO / Segurança",        re.compile(r"(SSO|segurança.*trabalho|saúde|SESMT|brigada|emergência|acidente|EPI|NR-?\d|safety)", re.I)),
    # Approvals
    ("✅ Aprovações",              re.compile(r"(aprovação|aprovado|aprovar|autorização|authorize|aprobación|DocuSign|assinar|signature|sign)", re.I)),
    # Clients (specific names)
    ("🏢 Clientes (projetos)",     re.compile(r"(Santander|CPFL|Aegea|Pluxee|Brasscom|Neoenergia|Bradesco|Itaú|Banco do Brasil|BB|Cielo|Stone|Natura|Ambev|Vale|Petrobras|Telefônica|Vivo|Tim|Claro|Oi)", re.I)),
    # Staffing / Alocação
    ("👤 Alocação / Staffing",     re.compile(r"(alocação|recurso|staffing|disponibilidade|PO.*PPO|disponível|bench|rotação|PPO)", re.I)),
    # Reports / Dashboards
    ("📈 Reports / Dashboards",    re.compile(r"(power\s*bi|dashboard|report|relatório|informe|weekly.*report|monthly|semanal|mensal)", re.I)),
    # Meetings / Calendar invites
    ("📅 Reuniões / Calendar",     re.compile(r"(reunião|meeting|convite|invite|ponto de controle|daily|standup|stand-up|sync|kickoff|kick-off|agenda|ceremony)", re.I)),
    # Internal Comms
    ("📢 Comunicações Corp.",      re.compile(r"(comunicação|comunicado|orientações|treinamento|curso|capacitação|openuniversity|learning|webinar|palestra|evento)", re.I)),
    # Newsletters / External
    ("📰 Newsletter / Externo",    re.compile(r"(newsletter|secret|digest|weekly.*update|AI Secret|DeepSeek|OpenAI|unsubscribe|Manus|Product Hunt|GitHub)", re.I)),
    # ServiceDesk / IT Support
    ("🖥️ ServiceDesk / TI",       re.compile(r"(ServiceDesk|service desk|chamado|ticket|incidente|CAU|suporte técnico|VPN|senha|password|acesso|access|helpdesk)", re.I)),
    # System notifications
    ("🔔 Notificações Sistemas",   re.compile(r"(Welcome|notification|notificação|alert|alerta|automated|automático|noreply|no-reply|system|automatic)", re.I)),
    # Forwarded
    ("📤 Encaminhados (FW/ENC)",   re.compile(r"^(FW:|ENC:|Fwd:)", re.I)),
    # Replies (broad)
    ("↩️ Respostas (RE/RES)",      re.compile(r"^(RE:|RES:|Re:)", re.I)),
]


def load_csv_robust(filepath: str) -> pd.DataFrame:
    """
    Load Outlook CSV with maximum robustness.
    Handles multiline fields, encoding issues, and malformed rows.
    """
    print(f"  Loading: {filepath}")
    print(f"  File size: {os.path.getsize(filepath) / 1024 / 1024:.1f} MB")

    # Try multiple encodings
    for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
        try:
            df = pd.read_csv(
                filepath,
                encoding=encoding,
                on_bad_lines='skip',
                engine='python',
                quotechar='"',
                skipinitialspace=True,
                dtype=str,
                keep_default_na=False,
            )
            print(f"  ✅ Loaded {len(df):,} rows (encoding: {encoding})")
            return df
        except Exception as e:
            print(f"  ⚠️ Failed with {encoding}: {str(e)[:80]}")
            continue

    raise RuntimeError(f"Could not load {filepath} with any encoding")


def classify_subject(subject: str) -> str:
    """Classify email by subject using ordered priority rules."""
    if not subject or pd.isna(subject):
        return "❓ Sem Assunto"

    for category, pattern in CLASSIFICATION_RULES:
        if pattern.search(subject):
            return category

    return "📁 Outros"


def classify_subject_deep(subject: str, body: str, sender: str) -> str:
    """
    Deep classification: uses subject + body preview + sender for maximum accuracy.
    Falls back to body/sender analysis only if subject classification returns 'Outros'.
    """
    # First pass: classify by subject
    cat = classify_subject(subject)
    if cat != "📁 Outros":
        return cat

    # Second pass: use sender patterns
    sender_lower = (sender or "").lower()
    if any(k in sender_lower for k in ["jira", "herramienta jira"]):
        return "🔧 JIRA / DevOps"
    if any(k in sender_lower for k in ["servicedesk", "service desk", "helpdesk"]):
        return "🖥️ ServiceDesk / TI"
    if any(k in sender_lower for k in ["adpweb", "assessoria adpweb"]):
        return "👥 RH / UGR / Pessoal"
    if any(k in sender_lower for k in ["comunicação interna", "comunicacion"]):
        return "📢 Comunicações Corp."
    if any(k in sender_lower for k in ["openuniversity", "open university"]):
        return "📢 Comunicações Corp."
    if any(k in sender_lower for k in ["noreply", "no-reply", "donotreply"]):
        return "🔔 Notificações Sistemas"
    if any(k in sender_lower for k in ["docusign"]):
        return "✅ Aprovações"
    if any(k in sender_lower for k in ["teams", "novas mensagens"]):
        return "💬 Microsoft Teams"
    if any(k in sender_lower for k in ["ofertas", "genérico ofertas"]):
        return "📋 Ofertas / RFP"
    if any(k in sender_lower for k in ["estación de control", "estacion de control"]):
        return "📊 Qualidade / ICD / KPIs"

    # Third pass: body preview (first 300 chars)
    body_preview = (body or "")[:300].lower()
    if any(k in body_preview for k in ["oferta", "rfp", "proposta técnica", "proposta comercial", "cod. oferta"]):
        return "📋 Ofertas / RFP"
    if any(k in body_preview for k in ["reunião", "meeting", "teams", "kick"]):
        return "📅 Reuniões / Calendar"

    return "📁 Outros"


def detect_to_cc(row: pd.Series) -> str:
    """Determine if user is in TO, CC, or BCC."""
    to_addr = str(row.get("Para: (Endereço)", "")).lower()
    cc_addr = str(row.get("CC: (Endereço)", "")).lower()

    if USER_ADDRESS_FRAGMENT in to_addr or USER_EMAIL in to_addr:
        return "TO"
    elif USER_ADDRESS_FRAGMENT in cc_addr or USER_EMAIL in cc_addr:
        return "CC"
    else:
        return "BCC/Lista"


def extract_dates_from_body(body: str) -> list:
    """Extract dates from email body for temporal analysis."""
    if not body:
        return []
    patterns = [
        r'\d{1,2}/\d{1,2}/\d{4}',
        r'\d{1,2}\s+de\s+\w+\s+de\s+\d{4}',
    ]
    dates = []
    for p in patterns:
        dates.extend(re.findall(p, str(body)[:500]))
    return dates


def analyze_mailbox(df: pd.DataFrame, label: str) -> dict:
    """Full analysis pipeline for a mailbox."""
    print(f"\n{'='*60}")
    print(f"  ANALYZING: {label} ({len(df):,} emails)")
    print(f"{'='*60}")

    results = {
        "label": label,
        "total": len(df),
        "columns": list(df.columns),
    }

    # ─── SENDER ANALYSIS ───
    print("  → Sender analysis...")
    sender_col = "De: (Nome)"
    sender_type_col = "De: (Tipo)"

    if sender_col in df.columns:
        sender_counts = df[sender_col].value_counts().head(30)
        results["top_senders"] = [
            {"name": name, "count": int(count), "pct": round(count / len(df) * 100, 1)}
            for name, count in sender_counts.items()
        ]
    else:
        results["top_senders"] = []

    if sender_type_col in df.columns:
        type_counts = df[sender_type_col].value_counts()
        results["sender_types"] = {str(k): int(v) for k, v in type_counts.items()}
    else:
        results["sender_types"] = {}

    # ─── TO vs CC ANALYSIS ───
    print("  → TO vs CC analysis...")
    df["_direction"] = df.apply(detect_to_cc, axis=1)
    direction_counts = df["_direction"].value_counts()
    results["direction"] = {str(k): int(v) for k, v in direction_counts.items()}
    results["direction_pct"] = {
        str(k): round(v / len(df) * 100, 1) for k, v in direction_counts.items()
    }

    # ─── DEEP CLASSIFICATION ───
    print("  → Deep subject+sender+body classification...")
    subject_col = "Assunto"
    body_col = "Corpo"

    if subject_col in df.columns:
        df["_category"] = df.apply(
            lambda r: classify_subject_deep(
                str(r.get(subject_col, "")),
                str(r.get(body_col, ""))[:300] if body_col in df.columns else "",
                str(r.get(sender_col, ""))
            ),
            axis=1
        )
        cat_counts = df["_category"].value_counts()
        results["categories"] = [
            {"category": cat, "count": int(cnt), "pct": round(cnt / len(df) * 100, 1)}
            for cat, cnt in cat_counts.items()
        ]
    else:
        results["categories"] = []

    # ─── IMPORTANCE ANALYSIS ───
    print("  → Importance analysis...")
    imp_col = "Importance"
    if imp_col in df.columns:
        imp_counts = df[imp_col].value_counts()
        results["importance"] = {str(k): int(v) for k, v in imp_counts.items()}
    else:
        results["importance"] = {}

    # ─── UNIQUE SUBJECTS (for pattern mining) ───
    print("  → Subject pattern mining...")
    if subject_col in df.columns:
        # Strip RE:/FW: prefixes and count unique threads
        df["_thread"] = df[subject_col].apply(
            lambda s: re.sub(r"^(RE:|RES:|FW:|ENC:|Fwd:)\s*", "", str(s), flags=re.I).strip()
        )
        thread_counts = df["_thread"].value_counts().head(20)
        results["top_threads"] = [
            {"subject": subj, "count": int(cnt)}
            for subj, cnt in thread_counts.items()
        ]
    else:
        results["top_threads"] = []

    # ─── CATEGORY + DIRECTION CROSS-TAB ───
    print("  → Cross-tabulation (category × direction)...")
    if "_category" in df.columns and "_direction" in df.columns:
        cross = pd.crosstab(df["_category"], df["_direction"])
        results["cross_category_direction"] = {
            str(cat): {str(d): int(cross.loc[cat, d]) if d in cross.columns else 0
                       for d in ["TO", "CC", "BCC/Lista"]}
            for cat in cross.index
        }
    else:
        results["cross_category_direction"] = {}

    # ─── CATEGORY × IMPORTANCE ───
    if "_category" in df.columns and imp_col in df.columns:
        cross_imp = pd.crosstab(df["_category"], df[imp_col])
        results["cross_category_importance"] = {}
        for cat in cross_imp.index:
            results["cross_category_importance"][str(cat)] = {
                str(col): int(cross_imp.loc[cat, col]) for col in cross_imp.columns
            }

    print(f"  ✅ Analysis complete for {label}")
    return results


def generate_markdown_report(inbox: dict, ofertas: dict) -> str:
    """Generate comprehensive markdown report."""
    total = inbox["total"] + ofertas["total"]

    r = f"""# 📊 Relatório de Inteligência de E-mail — mbenicios@minsait.com

> **Gerado em:** {datetime.now().isoformat()}
> **Método:** Deep Classification (Subject + Sender + Body Preview)
> **Engine:** Python 3.13 + pandas (Enterprise Analyzer v2.0)

---

## 📬 Resumo Executivo

| Métrica | Inbox | Ofertas DN | Total |
|---|---|---|---|
| **Total de Emails** | {inbox['total']:,} | {ofertas['total']:,} | **{total:,}** |
| **Internos (Exchange)** | {inbox['sender_types'].get('EX', 0):,} | {ofertas['sender_types'].get('EX', 0):,} | {inbox['sender_types'].get('EX',0)+ofertas['sender_types'].get('EX',0):,} |
| **Externos (SMTP)** | {inbox['sender_types'].get('SMTP', 0):,} | {ofertas['sender_types'].get('SMTP', 0):,} | {inbox['sender_types'].get('SMTP',0)+ofertas['sender_types'].get('SMTP',0):,} |

---

## 📧 INBOX — {inbox['total']:,} emails

### 🏆 Top 20 Remetentes

| # | Remetente | Qtd | % | Acumulado |
|---|---|---|---|---|
"""
    acc = 0
    for i, s in enumerate(inbox["top_senders"][:20]):
        acc += s["pct"]
        r += f"| {i+1} | {s['name']} | {s['count']:,} | {s['pct']}% | {acc:.1f}% |\n"

    r += f"""
### 📬 Direto (TO) vs Copiado (CC)

| Tipo | Qtd | % |
|---|---|---|
"""
    for d in ["TO", "CC", "BCC/Lista"]:
        v = inbox["direction"].get(d, 0)
        p = inbox["direction_pct"].get(d, 0)
        label_map = {"TO": "📩 **Direto (TO)**", "CC": "📋 **Copiado (CC)**", "BCC/Lista": "📮 **BCC / Lista**"}
        r += f"| {label_map.get(d, d)} | {v:,} | {p}% |\n"

    r += f"""
### 🏷️ Classificação por Categoria (Deep Analysis)

| # | Categoria | Qtd | % | Ação Sugerida |
|---|---|---|---|---|
"""
    action_map = {
        "📅 Calendar Responses": "Auto-archive",
        "💬 Microsoft Teams": "Auto-archive ou filtrar",
        "🔧 JIRA / DevOps": "Pasta: DevOps/JIRA",
        "📋 Ofertas / RFP": "Pasta: Ofertas (ALTA prioridade)",
        "👥 RH / UGR / Pessoal": "Pasta: RH/Pessoal",
        "💰 Financeiro / Faturas": "Pasta: Financeiro",
        "📊 Qualidade / ICD / KPIs": "Pasta: Qualidade/KPIs",
        "🛡️ SSO / Segurança": "Pasta: SSO",
        "✅ Aprovações": "Flag + Pasta: Aprovações",
        "🏢 Clientes (projetos)": "Pasta por cliente",
        "👤 Alocação / Staffing": "Pasta: Staffing",
        "📈 Reports / Dashboards": "Pasta: Reports",
        "📅 Reuniões / Calendar": "Auto-archive",
        "📢 Comunicações Corp.": "Auto-archive",
        "📰 Newsletter / Externo": "Auto-archive / Unsubscribe",
        "🖥️ ServiceDesk / TI": "Pasta: TI/Suporte",
        "🔔 Notificações Sistemas": "Auto-archive",
        "📤 Encaminhados (FW/ENC)": "Classificar por conteúdo",
        "↩️ Respostas (RE/RES)": "Manter thread original",
        "📁 Outros": "Revisar manualmente",
    }

    for i, c in enumerate(inbox["categories"]):
        action = action_map.get(c["category"], "—")
        r += f"| {i+1} | {c['category']} | {c['count']:,} | {c['pct']}% | {action} |\n"

    r += f"""
### 🔥 Top 20 Threads (agrupados por assunto)

| # | Assunto (sem RE/FW) | Qtd msgs |
|---|---|---|
"""
    for i, t in enumerate(inbox["top_threads"][:20]):
        subj = t["subject"][:80] + ("..." if len(t["subject"]) > 80 else "")
        r += f"| {i+1} | {subj} | {t['count']} |\n"

    r += f"""
### 📊 Importância

| Nível | Qtd | % |
|---|---|---|
"""
    for level, count in sorted(inbox["importance"].items(), key=lambda x: -x[1]):
        r += f"| {level} | {count:,} | {count/inbox['total']*100:.1f}% |\n"

    # Cross-tab: Category x Direction
    r += """
### 🔀 Matriz: Categoria × Direção (TO/CC/BCC)

| Categoria | TO | CC | BCC/Lista | Total |
|---|---|---|---|---|
"""
    for cat, dirs in sorted(inbox.get("cross_category_direction", {}).items(), key=lambda x: -(x[1].get("TO",0)+x[1].get("CC",0)+x[1].get("BCC/Lista",0))):
        to = dirs.get("TO", 0)
        cc = dirs.get("CC", 0)
        bcc = dirs.get("BCC/Lista", 0)
        total = to + cc + bcc
        r += f"| {cat} | {to} | {cc} | {bcc} | {total} |\n"

    # ─── OFERTAS ───
    r += f"""

---

## 📋 OFERTAS DN — {ofertas['total']:,} emails

### 🏆 Top 20 Remetentes

| # | Remetente | Qtd | % |
|---|---|---|---|
"""
    for i, s in enumerate(ofertas["top_senders"][:20]):
        r += f"| {i+1} | {s['name']} | {s['count']:,} | {s['pct']}% |\n"

    r += f"""
### 📬 Direto (TO) vs Copiado (CC)

| Tipo | Qtd | % |
|---|---|---|
"""
    for d in ["TO", "CC", "BCC/Lista"]:
        v = ofertas["direction"].get(d, 0)
        p = ofertas["direction_pct"].get(d, 0)
        r += f"| {d} | {v:,} | {p}% |\n"

    r += f"""
### 🏷️ Classificação por Categoria

| # | Categoria | Qtd | % |
|---|---|---|---|
"""
    for i, c in enumerate(ofertas["categories"]):
        r += f"| {i+1} | {c['category']} | {c['count']:,} | {c['pct']}% |\n"

    r += f"""
### 🔥 Top 20 Threads (Ofertas)

| # | Assunto | Qtd |
|---|---|---|
"""
    for i, t in enumerate(ofertas["top_threads"][:20]):
        subj = t["subject"][:80] + ("..." if len(t["subject"]) > 80 else "")
        r += f"| {i+1} | {subj} | {t['count']} |\n"

    return r


# ═══════════════════ MAIN ═══════════════════
if __name__ == "__main__":
    print("=" * 60)
    print("  📊 ENTERPRISE EMAIL ANALYZER v2.0")
    print("  Python 3.13 + pandas — Deep Classification Engine")
    print("=" * 60)

    # Load data
    print("\n📂 PHASE 1: Loading CSVs...")
    inbox_df = load_csv_robust(INBOX_CSV)
    ofertas_df = load_csv_robust(OFERTAS_CSV)

    # Print column names for validation
    print(f"\n  Inbox columns: {list(inbox_df.columns)}")
    print(f"  Ofertas columns: {list(ofertas_df.columns)}")

    # Analyze
    print("\n🔬 PHASE 2: Deep Analysis...")
    inbox_results = analyze_mailbox(inbox_df, "Inbox")
    ofertas_results = analyze_mailbox(ofertas_df, "Ofertas DN")

    # Generate reports
    print("\n📝 PHASE 3: Report Generation...")
    md_report = generate_markdown_report(inbox_results, ofertas_results)
    with open(REPORT_MD, "w", encoding="utf-8") as f:
        f.write(md_report)
    print(f"  ✅ Markdown: {REPORT_MD}")

    # JSON export
    json_data = {
        "inbox": inbox_results,
        "ofertas": ofertas_results,
        "generated": datetime.now().isoformat(),
        "engine": "Enterprise Email Analyzer v2.0",
    }
    with open(REPORT_JSON, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False, default=str)
    print(f"  ✅ JSON: {REPORT_JSON}")

    print("\n" + "=" * 60)
    print("  🎉 ANALYSIS COMPLETE")
    print("=" * 60)
