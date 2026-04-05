# Conventions — AI Smart Organizer

## Code Style

### Python (`email_analyzer_pro.py`)
- **Docstrings:** Yes — triple-quote docstrings on functions
- **Type hints:** Return types on some functions (`-> dict`, `-> str`, `-> list`)
- **Constants:** `UPPER_CASE` at module level
- **Functions:** `snake_case`
- **Error handling:** try/except with multiple encoding fallbacks in `load_csv_robust()`
- **String formatting:** f-strings throughout
- **Data structures:** pandas DataFrames, `Counter`, `defaultdict`
- **Classification pattern:** Ordered list of compiled regex tuples `(category, pattern)`

### JavaScript (`analyze_inbox.mjs`, `poc_ms_graph.mjs`)
- **Module style:** ES Modules (`.mjs`, `import` statements)
- **Variables:** `const`/`let` (no `var`)
- **Functions:** Mix of arrow functions and async functions
- **String formatting:** Template literals
- **Data structures:** `Map` for accumulators (memory-efficient)
- **Error handling:** try/catch with multi-attempt retry pattern (poc_ms_graph.mjs)

## Patterns

### CSV Processing Pattern
Two competing implementations of the same pattern:
1. **Node.js streaming:** `createReadStream` + `readline` → constant memory, custom CSV parser
2. **Python pandas:** `pd.read_csv()` with encoding fallback chain → loads entire file into memory

### Classification Pattern
Both implementations use a prioritized regex rule list:
- Python: `CLASSIFICATION_RULES = [(category, compiled_regex)]` — 20+ rules
- Node.js: Inline `if/else if` chain — ~18 rules
- Python version is more sophisticated (3-pass: subject → sender → body)

### Report Generation Pattern
Both implementations generate markdown reports by string concatenation:
- Python: f-string based `generate_markdown_report()`
- Node.js: Template literal string building

## Error Handling
- **CSV loading:** Multiple encoding attempts (`utf-8`, `utf-8-sig`, `latin-1`, `cp1252`)
- **MS Graph:** Multiple client ID attempts with graceful fallback
- **No centralized error handling** — each script handles its own errors
- **No logging framework** — `print()` and `console.log()` only

## Configuration
- Hardcoded paths (e.g., `WORKSPACE = r"d:\VMs\Projetos\AI_Smart_Organizer"`)
- Hardcoded email addresses and user keys
- No `.env` or config file pattern yet
