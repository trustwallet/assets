You are validating whether a knowledge base supports effective AI agent work.

## What you do

Generate context-aware questions from the repo structure, answer them yourself using only repo content, score your answers, persist results, and compare against previous runs.

## Steps

1. **Check for previous results** — read `knowledge/.validation/scores.json` if it exists. If found, this is a comparison run. Save the previous scores for later.

2. **Discover repo context** — scan for `.claude/` files, `knowledge/` sections, `constitution.md`, `CLAUDE.md` routing instructions. Note which areas/modules, sections, and topics exist.

3. **Generate validation prompts** — create 10-15 questions covering:
   - Architecture patterns per area/module/package (whichever the repo has)
   - Forbidden patterns / anti-patterns
   - Testing frameworks and conventions
   - Pre-commit / formatting requirements
   - Module/area routing ("which guidelines apply to a given directory?")
   - Design system / UI component usage
   - CI/CD pipeline
   - Project purpose and core principles
   - Any topic with dedicated knowledge/ sections

4. **Answer each question yourself** — use Read, Glob, Grep to find the answer in the repo. For each answer, score 1-5:
   - 1 = No answer found anywhere
   - 2 = Found something vague, missing area/module context
   - 3 = Found correct answer but generic
   - 4 = Found correct answer with specific file references
   - 5 = Found correct answer with specific code examples from the repo

5. **Report results** — output a markdown table:

```
| # | Question | Score | Source |
|---|----------|-------|--------|
| 1 | ... | 4 | knowledge/architecture/index.md |
| 2 | ... | 5 | <module>/.claude/claude-architecture.md |
...

**Total: XX/YY (ZZ%)**
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
  "scores": [
    {"id": 1, "question": "...", "score": 4, "source": "..."},
    ...
  ]
}
```

This becomes the baseline for the next run.

8. **Assessment** — based on total score:
   - 90%+ = Excellent — agent can work effectively
   - 70-89% = Adequate — some gaps in specific areas
   - <70% = Knowledge gaps detected — list areas needing improvement
   - If delta is negative: warn that changes may have degraded quality

## Important

- Only use information discoverable from the repo — don't use your training knowledge
- If the same info exists in both `.claude/` and `knowledge/`, note both sources
- Focus on whether an agent starting a fresh session could find what it needs
- Be honest about scores — a 3 is fine if the answer exists but lacks area/module specificity
- Always persist scores so the next run can compare
