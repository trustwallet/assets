You are validating whether a knowledge base supports effective AI agent work.

## What you do

Generate context-aware questions from the repo structure, answer them yourself using only repo content, score your answers, persist results, and compare against previous runs.

## Steps

1. **Check for previous results** — read `knowledge/.validation/scores.json` if it exists. If found, this is a comparison run. Save the previous scores for later.

2. **Discover repo context** — scan for `.claude/` files, `knowledge/` sections, `constitution.md`, `CLAUDE.md` routing instructions. Note which areas/modules, sections, and topics exist.

3. **Assemble the question set — deterministic base first, then supplement.**

   **3a. Load the structure-derived questions (the fixed base).** If
   `knowledge/.kb-questions.json` exists (produced by `sdd-knowledge --full`),
   load it and use EVERY question in it as the base set. These are derived
   deterministically from the relation graph — god-nodes, cross-domain bridges,
   layer violations, dependency cycles, data models — so they probe the code
   that actually matters and they are **identical across runs**, which makes the
   before/after delta in step 6 meaningful (an LLM-invented set drifts every run
   and makes deltas noise). Each carries:
   - `family`: `source-relations` (about what `--full` extracted — call graph,
     layers, models, signatures) or `structure` (general navigability),
   - `weight` (1–5): how important answering it is, from the symbol's centrality,
   - `targets`: the symbols/domains the answer must cover.

   The **`source-relations` family is the explicit yardstick for the `--full`
   enhancements**: if those questions score low, the deterministic graph found
   structure the knowledge base never wrote up.

   **3b. Supplement with repo-shaped questions** (aim for ~15–20 total) covering
   anything the base set doesn't, assigning each a `weight` of 3 and family
   `structure`:
   - Architecture patterns per area/module/package
   - Forbidden patterns / anti-patterns
   - Testing frameworks and conventions
   - Pre-commit / formatting requirements
   - Module/area routing ("which guidelines apply to a given directory?")
   - Design system / UI component usage · CI/CD pipeline
   - Project purpose and core principles
   - Any topic with dedicated `knowledge/` sections

   If `.kb-questions.json` is absent (repo never ran `--full`), generate
   10–15 questions per 3b only — and note in the report that the
   source-relations family was unavailable.

4. **Answer each question yourself** — use Read, Glob, Grep to find the answer in the repo. For each answer, score 1-5:
   - 1 = No answer found anywhere
   - 2 = Found something vague, missing area/module context
   - 3 = Found correct answer but generic
   - 4 = Found correct answer with specific file references
   - 5 = Found correct answer with specific code examples from the repo

   For `source-relations` questions, "found the answer" means the knowledge base
   (not the source) explains it — e.g. `architecture/call-graph.md`,
   `architecture/layers.md`, `architecture/data/models.md`, or a domain doc. If
   you can only answer it by reading the code yourself, that's a **2** (the graph
   knows it; the KB doesn't surface it).

5. **Report results — centrality-weighted.** Score each question 1–5 as above,
   but compute the total as a **weighted** average so failing to document a
   god-node (weight 5) costs more than a leaf (weight 2):

   `weightedPct = Σ(score × weight) / Σ(5 × weight) × 100`

   Output a markdown table (sorted by family, then weight desc), and report BOTH
   the raw and weighted percentage plus a per-family breakdown:

```
| # | Family | W | Question | Score | Source |
|---|--------|---|----------|-------|--------|
| 1 | source-relations | 5 | What is `X` responsible for…? | 4 | knowledge/architecture/call-graph.md |
| 2 | structure | 3 | … | 5 | knowledge/architecture/index.md |
...

**Weighted: XX% (raw YY/ZZ = WW%)**
By family — source-relations: A% · structure: B%
```

6. **Compare with previous run** — if previous scores exist, show the delta:

```
Previous: 42/60 (70%)  Current: 53/60 (88%)  Delta: +11 (+18%)

Per-question changes:
  #3 "Forbidden patterns?" — 2 → 5 (+3) now found in guides/troubleshooting/
  #7 "CI/CD pipeline?" — 3 → 3 (=) no change
```

If no previous scores, just report current results.

7. **Persist scores** — write results to `knowledge/.validation/scores.json`:

```json
{
  "timestamp": "2026-03-27T...",
  "total": 53,
  "max": 60,
  "percentage": 88,
  "weightedPercentage": 84,
  "byFamily": {"source-relations": 79, "structure": 90},
  "scores": [
    {"id": 1, "family": "source-relations", "weight": 5, "question": "...", "score": 4, "source": "..."},
    ...
  ]
}
```

This becomes the baseline for the next run. Persist `family` and `weight` per
question so the next run's delta can be reported per family (and so the same
`.kb-questions.json` base lines up question-for-question).

8. **Assessment** — based on the **weighted** percentage:
   - 90%+ = Excellent — agent can work effectively
   - 70-89% = Adequate — some gaps in specific areas
   - <70% = Knowledge gaps detected — list areas needing improvement
   - If delta is negative: warn that changes may have degraded quality
   - **Call out the `source-relations` family explicitly**: a low score there
     means the `--full` relation graph surfaced structure (call graph, layers,
     domains, models) the knowledge base doesn't explain — the highest-leverage
     gap to fill, since that's the knowledge an agent can't easily re-derive.

## Important

- Only use information discoverable from the repo — don't use your training knowledge
- If the same info exists in both `.claude/` and `knowledge/`, note both sources
- Focus on whether an agent starting a fresh session could find what it needs
- Be honest about scores — a 3 is fine if the answer exists but lacks area/module specificity
- Always persist scores so the next run can compare
