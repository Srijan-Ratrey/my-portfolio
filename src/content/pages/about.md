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

The thread running through my work is measurement. It is easy to build something that produces plausible output and much harder to know whether it is right.

A multi-label classifier that predicts no labels at all scores 89.83% exact-match accuracy on the Jigsaw toxic-comment data, at a macro-F1 of exactly zero. A RAG system will cite the wrong PDF with total confidence. A fraud model tuned for F1 can cost real money: on 118k held-out transactions, choosing the threshold on cost instead saved ₹112,750 per 10,000 decisions. So the work I find worth doing starts with picking a metric that can actually be wrong, calibrating the operating point instead of defaulting to 0.5, and holding data back so the result can't flatter me.

I do this in production too. At Kavana I took a content-safety classifier from a 66% to 77% catch rate across three model generations, and validated an LLM-as-judge against human labels (87% precision) before trusting it on 1,000 conversations a day.

The part I care about most is writing down exactly where things break. My toxicity classifier fails silently on Hinglish: it scores a Hindi death threat at 0.000 and fires no labels at all, which is worse than degrading. My Bengaluru lake tracker missed its own accuracy target because it undercounts dark, deep water, and I reported that instead of re-tuning after seeing the test results. I once retracted benchmark numbers from my own [README](https://srijan-ratrey.sr5.workers.dev/blog/multi-label-content-classification/) when I found the harness was flawed. A result you can't see failing isn't one you can trust.
