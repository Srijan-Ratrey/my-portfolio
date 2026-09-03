---
title: Rupee-Optimal Risk
order: 20
blurb: A fraud decision engine that optimises money lost, not F1. On 118k held-out out-of-time transactions, picking the operating point by F1 instead of by rupee cost costs the merchant ₹112,750 per 10,000 transactions.
detail: 'LightGBM + isotonic calibration on IEEE-CIS (590k transactions), split temporally with each fold given exactly one job. Test PR-AUC 0.498, ECE 0.004, recall 0.536 at the cost-optimal threshold. Served as a FastAPI scorer with SHAP reason codes, an append-only audit log, and a degraded mode that falls back to a count rule rather than failing open or closed — p95 78ms. Two of our own ideas are reported as failures: amount-dependent thresholds measured null, per-band calibration improved validation and degraded test by ₹215k/10k. Cost constants are estimates, and the data is US e-commerce re-denominated at ₹88/USD — the method transfers, the rupee figures are illustrative.'
stack:
  - Python
  - LightGBM
  - scikit-learn
  - FastAPI
  - SQLite
links:
  - label: Repo
    href: https://github.com/Srijan-Ratrey/AI-risk-manager
    primary: false
  - label: Explainer
    href: https://github.com/Srijan-Ratrey/AI-risk-manager/blob/main/EXPLAINER.md
    primary: false
---
