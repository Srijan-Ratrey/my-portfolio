---
title: Rupee-Optimal Risk
order: 2
blurb: A fraud decision engine that optimises money lost, not F1. On 118k held-out out-of-time transactions, picking the operating point by F1 instead of by rupee cost costs the merchant ₹112,750 per 10,000 transactions.
detail: 'LightGBM + isotonic calibration on IEEE-CIS (590,540 transactions), split temporally with each fold given exactly one job: fit, calibrate, tune threshold, read test once. Test PR-AUC 0.498, ECE 0.004 after calibration, recall 0.536 at the cost-optimal threshold of 0.130. A baseline ladder puts a one-feature count rule ahead of logistic regression on money while losing on PR-AUC; the model captures 29.4% of the headroom the best simple baseline leaves. Served as a FastAPI scorer with tree-SHAP reason codes, an append-only audit log, and a degraded mode that falls back to the count rule instead of failing open or closed — p95 78ms. Two of our own ideas are reported as failures: amount-dependent thresholds measured as a null result, and per-band calibration improved validation by ₹75k/10k while degrading test by ₹215k/10k. Cost constants are estimates, not measurements, and the data is US e-commerce re-denominated at ₹88/USD — the method transfers, the absolute rupee figures are illustrative. No merchant, card, device or payment-method identifiers exist in the dataset, so no velocity features and no UPI analysis.'
stack:
  - Python
  - LightGBM
  - scikit-learn
  - FastAPI
  - SQLite
links:
  - label: Github
    href: https://github.com/Srijan-Ratrey/AI-risk-manager
    primary: false
  - label: Explainer
    href: https://github.com/Srijan-Ratrey/AI-risk-manager/blob/main/EXPLAINER.md
    primary: false
---
