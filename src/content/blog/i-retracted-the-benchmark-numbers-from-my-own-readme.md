---
title: I retracted the benchmark numbers from my own README
description: My hybrid retriever was never 9× faster than the baseline, it does strictly more work than the baseline. Here is what that benchmark actually measured, and what I replaced it with.
pubDate: 2026-08-08
updatedDate: 2026-08-08
heroImage: /uploads/Screenshot 2026-08-08 at 6.34.33 PM.png
---

The README for my RAG system used to quote two numbers. A hybrid reranker that improved confidence by 5.9%, and that ran roughly 9× faster than the cosine-similarity baseline.

Both numbers are gone. I removed them and left a note in their place saying they came from a heuristic script and should not be trusted. This post is about why, because the way that benchmark broke is more instructive than any number it produced.

## The system

Twenty industrial and machine-safety PDFs, chunked into 3,084 passages of roughly 191 words with 50 tokens of overlap. Embeddings from `all-MiniLM-L6-v2` at 384 dimensions, stored in FAISS under inner-product similarity. Questions come in over a REST endpoint; answers come back with a citation to the source document.

Two retrieval paths. The baseline is dense retrieval: embed the query, take the nearest chunks by cosine similarity. The hybrid keeps that and adds BM25 keyword scoring on top, fusing the two at 70% vector and 30% BM25, with a confidence threshold of 0.5 below which the system declines to answer.

The question the benchmark was supposed to settle is whether the hybrid is worth having.

## "9× faster" was not a surprising result. It was an impossible one.

Look at what the hybrid does. It performs the entire dense retrieval path, and then it computes BM25 scores, and then it fuses the two ranked lists. Every operation the baseline performs, the hybrid also performs, plus more.

That is a strict superset of work. On identical hardware, over an identical corpus, the hybrid can be _slower_ than the baseline, or it can be _indistinguishable_ from the baseline if the extra work is negligible. It cannot be faster. There is no configuration of a correctly measured experiment in which it is 9× faster.

So when the script reported a 9× speedup, the correct response was not to write it in the README. It was to conclude that the harness was measuring something other than what it claimed.

It was. The baseline ran first, and the first call paid for everything that gets initialised lazily — loading the embedding model, faulting the FAISS index into memory, the first pass through code paths that later benefit from caching. All of that got charged to whichever configuration happened to go first, and the second configuration ran on a warm process and looked spectacular by comparison.

Two lines of defence would have caught it, and I had neither: discard warmup iterations before timing anything, and randomise or alternate the order of the configurations under test. A benchmark where run order determines the winner is measuring run order.

The tell was there the whole time. **When a result violates something you know to be structurally true, the result is wrong, not the structure.** A number that implies you got extra work for free is not a discovery. It is a bug report about your harness.

## "+5.9% confidence" was not evidence either, for three separate reasons.

The speed claim was wrong because of how it was timed. The confidence claim was wrong because of what it measured.

**Confidence is not correctness.** The score my system reports is its own estimate of how well a retrieved chunk matches a query. Tuning the retriever to raise that score measures how strongly the system agrees with itself, which is a quantity that can be increased indefinitely without any answer ever becoming more correct. It is the same shape of error as the one I wrote about [in the classifier post](/blog/multi-label-content-classification/): optimising a number that correlates with the goal loosely enough that it can be moved without moving the goal.

**The two scores are not the same quantity.** The baseline's score is a cosine similarity. The hybrid's score is `0.7 × vector + 0.3 × BM25`, a weighted blend of a bounded similarity and an unbounded lexical score with a completely different distribution. Subtracting one from the other and reporting the difference as a percentage is a unit error. It reads like a measurement, and there is no measurement in it.

**Per-query scores are not comparable across queries.** A similarity of 0.62 means one thing for a question whose answer is a verbatim clause and something else for a vague question with three partial matches spread across documents. Averaging a quantity whose meaning shifts per item produces a number that is stable, reportable, and about nothing.

## The script was fine. Its job description was wrong.

I have not deleted the heuristic comparison. It is still in the repo, labelled as what it actually is: a smoke test. It answers "did I break the pipeline" — do queries return, do scores land in a plausible range, did the last refactor silently disconnect the reranker. That is a real job and worth automating.

What it cannot do is decide whether the hybrid is better, and the failure was never in the script. It was in my treating a smoke test's output as an experimental result, because the output happened to be numeric and the harness happened to run.

## What replaced it

A separate evaluation path that computes retrieval metrics properly: Recall@k, MRR, and nDCG@k against labelled relevance judgments.

The word doing the work there is _labelled_. These metrics require someone to decide, for each question, which chunks actually answer it — and there is no way to synthesise that from the system's own outputs, because using the system's judgment to grade the system is exactly the circularity that produced the confidence number. Labels cost human attention, and that cost is the reason the heuristic script existed in the first place.

So the README now reports no comparison at all, and instead tells you to run the IR evaluation against your own corpus and your own labels if you want trustworthy figures. That is a worse README from a marketing standpoint and an honest one. **A project page with no numbers is weaker than one with real numbers and much stronger than one with numbers I cannot defend.**

## What I expect the real evaluation to show

Stating predictions before running the experiment, so they can be wrong in public.

**The hybrid should win, and it should win on a specific, identifiable subset.** Safety documentation is unusually dense with rare exact tokens — standard numbers, clause references, table labels, equipment identifiers. Embeddings are weak at exact-token matching; a 384-dimension MiniLM embedding of a query containing a specific regulation number maps it near other things that look like regulation numbers, with no notion of which one was asked for. BM25 does not need to know what the token means, only that it is rare and present. On this corpus that is the correct prior.

Which means the hybrid's advantage should concentrate almost entirely in queries that carry an identifier, and shrink toward nothing on pure paraphrase queries. If instead the gain is spread evenly across query types, my explanation for _why_ hybrid helps is wrong, and I would want to know that.

**The hybrid should be slower.** It has to be. If a corrected benchmark shows the hybrid as faster again, the harness is still broken.

**Citation accuracy needs measuring separately from retrieval.** Recall@k asks whether the right chunk was in the top k. It does not ask whether the clause the answer _pointed at_ supports what the answer _said_ — and those come apart. The correct chunk can be retrieved while the generator cites a topically adjacent one from the same section, producing a right answer attached to a reference that does not contain it. On a safety corpus that is the worst output the system can produce, because it looks exactly like the good output. No retrieval metric will surface it.

## Design decisions worth keeping

**Chunking at \~191 words with 50-token overlap.** At 20 documents and 3,084 chunks, this choice matters more than the retriever does, and it is the first thing I would ablate. Safety documents have strong structural hierarchy, and a chunk boundary that severs a clause from the scope condition that qualifies it produces a passage that is locally readable and globally wrong.

**Citations at the document level, and that is not enough.** Pointing at a document is a shrug with a page count. Clause-level provenance is what makes an answer checkable, and it is also the precondition for measuring citation accuracy at all — you cannot evaluate whether a document-level pointer is wrong.

**A confidence threshold at 0.5.** The system can decline. Given everything above, I want to be precise about what this is: a knob tuned on the same heuristic scores I just spent this post discrediting. It is a reasonable default and it is not a calibrated one.

**The corpus is gitignored, with a manifest and a download script.** I cannot redistribute the PDFs, so the repo ships `sources.json` plus a script that fetches them and a verification step that checks the result. This is the one part of the project's reproducibility story I would not change.

## Limitations

- **There are currently no published retrieval numbers for this system.** That is the honest state after the retraction, not a gap I am hiding.
- **Twenty documents is a small corpus.** At this scale chunking and preprocessing dominate the retriever comparison, and I would not generalise any result here to a corpus two orders of magnitude larger, where dense retrieval has more room and BM25's rare-token edge dilutes.
- **`all-MiniLM-L6-v2` at 384 dimensions is a small, general-purpose embedding model** on a technical domain corpus. Some of what I would attribute to "dense retrieval is weak on identifiers" may be "this particular model is weak."
- **When I do label an eval set, it will be one annotator — me.** The labels will inherit whatever I misunderstood about these documents, and I have no second reader to bound that.
- **The confidence threshold was tuned on heuristic scores**, so the abstention behaviour is uncalibrated in the same way the retracted numbers were.

## Running it

The repo exposes two evaluation entry points, and the distinction between them is the whole point of this post. `rag-eval` is the heuristic smoke test: fast, no labels required, answers "is the pipeline alive." `rag-ir-eval` is the real one: Recall@k, MRR, nDCG@k, and it will refuse to tell you anything until you give it relevance judgments.

The corpus is not in the repo. `scripts/download_pdfs.py` fetches it from the manifest, `scripts/rebuild_data.sh` builds the chunks and the FAISS index, and `scripts/verify_setup.py` checks that what you got matches what you should have. Then serve the API and query it.

## Reproducibility

Embedding model `all-MiniLM-L6-v2`, 384 dimensions. 3,084 chunks at \~191 words with 50-token overlap. FAISS with inner-product similarity. Hybrid fusion at 0.7 vector / 0.3 BM25. Confidence threshold 0.5. Corpus of 20 PDFs, fetched from `sources.json`.
