# Raw Extracts Spec (v2.1) — Premissa ZERO: não perder dados
raw_extracts/
  <file_id>__<original_name>.txt
  <file_id>__<original_name>.json
  manifest.json
Regras:
- Todo arquivo do File Inventory deve ter sha256 e método de extração.
- Se OCR for usado, registrar por página.
- Não sobrescrever sem versionar.
