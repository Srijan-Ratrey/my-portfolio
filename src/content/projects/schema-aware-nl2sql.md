---
title: Schema-Aware NL2SQL
order: 6
blurb: Converts natural language questions into SQL across database schemas it has not seen before.
detail: Fine-tuned T5 with QLoRA, conditioned on the target schema so it generalises across dynamic databases rather than memorising one. Ships both a web interface and a REST API.
stack:
  - Python
  - T5
  - QLoRA
  - FastAPI
links:
  - label: Repo
    href: https://github.com/Srijan-Ratrey/Schema-Aware-Natural-Language-to-SQL-Agent
---
