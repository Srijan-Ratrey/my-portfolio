---
title: Multi-label content classification
order: 1
blurb: A DistilBERT fine-tune that predicts every applicable policy label on a comment — toxic, severe_toxic, obscene, threat, insult, identity_hate — not just the most likely one.
detail: 'Built around one claim: accuracy is the wrong metric. A model that predicts nothing at all scores 89.83% exact-match accuracy on this data at a macro-F1 of exactly 0.0. So the work is choosing the metric, calibrating a threshold per label on validation, and doing real error analysis. Macro-F1 0.6626 at 0.5, 0.6836 with tuned thresholds, against 0.5412 for a TF-IDF one-vs-rest baseline. Documented failure mode: it is English-only and fails silently on Hinglish.'
stack:
  - PyTorch
  - Transformers
  - DistilBERT
  - scikit-learn
  - Streamlit
links:
  - label: live demo
    href: https://multilabel-content-classification.streamlit.app/
  - label: Write-up
    href: /blog/multi-label-content-classification/
  - label: Repo
    href: https://github.com/Srijan-Ratrey/Multilabel-content-classification
  - label: Model
    href: https://huggingface.co/srijanratrey/distilbert-jigsaw-multilabel
---
