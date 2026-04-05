# Conventions — AI Smart Organizer

> **Last updated:** 2026-04-05 — reflects production Power Platform conventions + POC legacy

## Production Conventions (Power Platform)

### Naming
| Resource | Convention | Example |
|---|---|---|
| AI Builder Prompts | `RFP_##_PascalCase` | `RFP_01_Classify_Offer` |
| Power Automate Flows | `RFP-##-Kebab-Case` | `RFP-01-Email-Intake` |
| Dataverse Table | `rfp_ofertas` (internal: `cr8b2_rfpofertases`) | — |
| Dataverse Columns | `snake_case` display, `cr8b2_` prefix internal | `classification_json` → `cr8b2_classificationjson` |
| SharePoint Folders | `OFR-{yyyyMMdd-HHmmss}` per offer | `OFR-20260405-143022` |

### Flow Design
- **Trigger → Actions → Update** pattern for all flows
- **Status lifecycle:** RECEIVED → PROCESSING → SCORED → COMPLETED (or ERROR)
- **Error handling:** Set to PARSE_ERROR on AI failures, continue pipeline
- **Dynamic content:** Use "Texto" (Text) output from AI Builder, not "Resposta do Prompt"

### AI Builder Prompt Design
- **Model:** GPT-4.1 (all prompts)
- **Temperature:** 0.1 (deterministic)
- **Output:** JSON-only (enforced via system prompt)
- **Missing data:** Use `"A_VALIDAR"` string (Princípio Zero — never fabricate)
- **Input naming:** Use descriptive parameter names (`email_body`, `document_text`, `classification_json`)

### Documentation
- Enterprise docs: `##_Name_With_Underscores.md` (numbered prefix)
- Prompt specs: `##_prompt_name.md` (numbered, snake_case)
- Configuration guides: `PascalCase_Guide.md`
- Versions: `v2.1` format appended to document headers

## POC Code Conventions (Legacy — Not Production)

### Python (`email_analyzer_pro.py`)
- **Docstrings:** Yes — triple-quote docstrings on functions
- **Type hints:** Return types on some functions (`-> dict`, `-> str`, `-> list`)
- **Constants:** `UPPER_CASE` at module level
- **Functions:** `snake_case`
- **Error handling:** try/except with multiple encoding fallbacks
- **String formatting:** f-strings throughout
- **Classification pattern:** Ordered list of compiled regex tuples `(category, pattern)`

### JavaScript (`analyze_inbox.mjs`, `poc_ms_graph.mjs`)
- **Module style:** ES Modules (`.mjs`, `import` statements)
- **Variables:** `const`/`let` (no `var`)
- **Functions:** Mix of arrow functions and async functions
- **Data structures:** `Map` for accumulators (memory-efficient)
- **Error handling:** try/catch with multi-attempt retry pattern

## Patterns

### Power Platform Patterns
- **Event-driven:** Dataverse status changes trigger downstream flows
- **Sequential AI chain:** Classify → Extract → Tech → GoNoGo (each builds on previous)
- **JSON storage:** AI outputs stored as multiline text (JSON string) in Dataverse columns

### CSV Processing Pattern (POC)
1. **Node.js streaming:** `createReadStream` + `readline` → constant memory
2. **Python pandas:** `pd.read_csv()` with encoding fallback chain

### Classification Pattern (POC)
- Python: `CLASSIFICATION_RULES = [(category, compiled_regex)]` — 20+ rules, 3-pass
- Node.js: Inline `if/else if` chain — ~18 rules

## Error Handling
- **Production:** Power Automate Try/Catch (Configure Run After) with PARSE_ERROR status
- **POC:** try/except (Python), try/catch (JS) — no centralized handling
- **No logging framework** — Power Automate run history serves as audit log

## Configuration
- **Production:** Power Platform connector authentication (managed)
- **POC:** Hardcoded paths (`WORKSPACE = r"d:\VMs\Projetos\AI_Smart_Organizer"`)
- No `.env` pattern (not applicable for Power Platform)
