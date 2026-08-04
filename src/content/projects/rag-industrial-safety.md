---
title: 'RAG Q&A over industrial safety documents'
order: 3
blurb: >-
  A question-answering service over industrial and machine safety PDFs, with citations back to
  the source document.
detail: >-
  A cosine-similarity baseline over sentence embeddings, then a hybrid reranker combining
  vector similarity with BM25 keyword matching to measure what the enhancement actually buys.
  20 safety PDFs, exposed behind a REST endpoint.
stack:
  - 'Python'
  - 'Sentence Transformers'
  - 'BM25'
  - 'REST API'
links:
  - label: 'Repo'
    href: 'https://github.com/Srijan-Ratrey/RAG-Q-A-System'
---
