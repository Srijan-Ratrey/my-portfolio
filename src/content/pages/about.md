---
heading: About
lede: I'm Srijan Ratrey, an engineer in Bengaluru working on machine learning systems — mostly content safety, retrieval, and the evaluation infrastructure around them.
description: ML and backend engineer in Bengaluru — content safety, retrieval, and evaluation. Experience, education, and skills.
education:
  degree: B.Tech, Data Science and Artificial Intelligence
  school: IIIT Naya Raipur
  period: 2021 — 2025
skills:
  - group: Languages
    items: Python, SQL
  - group: ML & DL
    items: PyTorch, TensorFlow, Keras, XGBoost, CNNs, GANs, YOLO, ResNet, OpenCV
  - group: LLMs & NLP
    items: Transformers, LangChain, fine-tuning, LoRA, prompt engineering, GPT-4, Gemini, Claude, T5
  - group: Infra & MLOps
    items: Django, Docker, Flask, FAISS, Langfuse, A/B testing, MongoDB, GCP, BigQuery, Vertex AI, Amazon S3
certificates:
  - Deep Learning for NLP — NPTEL, 2025
  - Google Cloud Computing Foundations — NPTEL, 2024
---

The thread running through my work is measurement. It is easy to build something that produces
plausible output and much harder to know whether it is right. A multi-label classifier that
predicts no labels at all scores 89.83% exact-match accuracy on the Jigsaw toxic comment data,
at a macro-F1 of exactly zero. A RAG system will happily cite the wrong PDF with total
confidence. So a lot of the work I find worth doing is picking a metric that can actually be
wrong, calibrating the operating point instead of defaulting to 0.5, and writing down precisely
where the thing breaks.

That last part matters to me. The classifier I trained fails silently on Hinglish — it scores a
Hindi death threat at 0.000 and fires no labels at all. That is worse than degrading, and it
belongs in the README rather than in a footnote, so it is in the
[README](/blog/multi-label-content-classification/).
