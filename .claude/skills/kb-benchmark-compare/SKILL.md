---
name: kb-benchmark-compare
description: Benchmark and compare Bedrock knowledge base vs local knowledge/ retrieval quality using a fixed 2000-question corpus. Use when the user asks to "benchmark kb", "compare bedrock vs local knowledge", or wants to validate KB retrieval quality.
user-invocable: true
---

# Knowledge Base Benchmark (Bedrock vs Local)

Runs the same fixed set of 2000 questions through two retrieval paths and produces a head-to-head comparison report:

1. **Bedrock path** — `sdd-knowledge-query` against the org Bedrock KB (vector search)
2. **Local path** — TF-IDF keyword search over a local `knowledge/` directory

Both paths are scored with the same retrieval metrics: **recall@5**, **MRR**, **category_match@1**, **category_match@5**, and **top-1 relevance score distribution**.

## Prerequisites

Ships inside the `sdd-tools` npm package as of v1.8.0. If `sdd-knowledge-benchmark` is on PATH, you're ready — no repo clone required.

```bash
# Verify the CLI is installed
sdd-knowledge-benchmark --help
```

If the command is missing, install/update sdd-tools: `npm install -g sdd-tools@latest`.

## When to Use

Invoke when the user asks to:
- "Benchmark the knowledge base" / "compare Bedrock vs local"
- "Validate KB retrieval quality"
- "Re-run the KB benchmark"

## Inputs (defaults shown — all overridable)

| Input | Default |
|---|---|
| Target knowledge dir | `./knowledge` (cwd) |
| Target CLAUDE.md | `./CLAUDE.md` (cwd) |
| Question count | `2000` |
| Output dir | `./benchmark-runs/<ISO-timestamp>/` |
| Questions fixture | Generated fresh per run against the target knowledge/ tree |

## Auth

Export the **conductor API key** (higher rate limits, no daily quota) before running:

```bash
export SDD_KNOWLEDGE_API_KEY="<conductor-key>"
```

Fetch the key from AWS (requires `saml2aws login` first):

```bash
aws --profile trust-wallet apigateway get-api-keys \
  --name-query "sdd-kb-conductor" --include-values --region eu-west-1 \
  --query 'items[0].value' --output text
```

VPN must be on. Never commit the key to source control.

## Execution

### Step 1 — Verify env (foreground, fast)

```bash
# Quick smoke test that Bedrock is reachable (requires SDD_KNOWLEDGE_API_KEY in env)
sdd-knowledge-query "dependency injection" --n 1 --json | head -20
```

If non-zero exit: remind user about VPN / `saml2aws login`. Stop.

### Step 2 — Run the benchmark

One command orchestrates generate → bedrock+local eval (parallel) → synthesize:

```bash
cd <target-repo>   # must contain knowledge/ and CLAUDE.md
sdd-knowledge-benchmark --count 2000
```

Useful flags:
- `--knowledge <dir>` / `--claude-md <path>` — override source paths
- `--count <n>` — smaller runs (e.g. 500) for quick iteration
- `--out <dir>` — custom output dir (default `./benchmark-runs/<ISO-timestamp>/`)
- `--rerank` — enable category rerank on Bedrock results
- `--skip-bedrock` / `--skip-local` — single-path runs

Expected wall time at 2000 questions:
- Bedrock: ~2 min at 20 req/s
- Local: <30 s

The CLI writes `questions.jsonl`, `bedrock-results.jsonl`, `local-results.jsonl`, `summary-*.json`, and `REPORT.md` to the output dir.

### Step 3 — Present to user

Print final metrics table + path to `REPORT.md`. Do NOT dump all 2000 records. Highlight:
- Overall recall@5 and MRR for each path
- Per-category winners
- 5 example questions where Bedrock wins big
- 5 example questions where Local wins big

## Metrics Definitions

| Metric | Definition |
|---|---|
| `recall@5` | Fraction of questions where the ground-truth source file appears in top-5 results |
| `MRR` | Mean Reciprocal Rank — 1/rank of ground-truth doc in results (0 if not found) |
| `category_match@1` | Top-1 result has same category as ground truth |
| `category_match@5` | At least one of top-5 has same category as ground truth |
| `keyword_overlap` | Jaccard similarity between top-1 content and ground-truth keywords |

## Question Generation Rules

Each question links back to the source MD file that is considered ground truth:

- **Factual**: "What is X?" — from H2/H3 headings
- **How-to**: "How do I X?" — from imperative section titles
- **Conceptual**: "Why X?" — from rationale/decision sections
- **Comparison**: "Difference between X and Y?" — from sibling sections
- **Troubleshooting**: from `## Troubleshooting` or anti-pattern sections

Target ~4 questions per file (2000 / ~522 files). Skip index.md, learnings.md, constitution.md (too meta).

## Output Artifacts

Each run produces in `./benchmark-runs/<ISO-timestamp>/`:

```
questions.jsonl         # fixture generated against this run's knowledge/ tree
bedrock-results.jsonl   # one JSON line per question with top-5 + scores
local-results.jsonl     # same schema
summary-bedrock.json    # aggregate metrics
summary-local.json
REPORT.md               # human-readable comparison
```

## Reusability Notes

- Bedrock runs are **not** idempotent (cache + possible KB updates). Multiple runs over time build a longitudinal picture — archive `benchmark-runs/` dirs of interest.
- Questions are regenerated per run because ground-truth source_file paths must match the target repo's knowledge tree. To reuse a fixture across runs of the *same* repo, pass `--questions <path>`.
- To test a different repo, `cd` into it and run `sdd-knowledge-benchmark` — defaults pick up `./knowledge` and `./CLAUDE.md`.
