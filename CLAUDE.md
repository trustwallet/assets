# assets

## What this repo is

- Stack: Go
- Knowledge base: 4 categories — ci, code-conventions, patterns, specs

## Repo Manifest (for agents)

Machine-readable manifest: [`.claude/repo.yml`](.claude/repo.yml). It declares this repo's purpose (`summary`), the capabilities it `owns`, matching `topics`, `consumers`, and `depends_on`.

Agents: read it to decide whether a task belongs in **this** repo. To find the *right* repo for a task, match the task against repos' `owns` / `topics` / `summary` — org-wide manifests are aggregated for cross-repo routing.

## Knowledge Map

For the structured knowledge base, see [knowledge/constitution.md](knowledge/constitution.md).

- [ci](knowledge/ci/index.md) — CI/CD pipelines, deployment automation, and release processes
- [code-conventions](knowledge/code-conventions/index.md) — Code conventions, style rules, and decision records
- [patterns](knowledge/patterns/index.md) — Coding patterns, recipes, and proven approaches
- [specs](knowledge/specs/index.md) — Feature specifications and requirements

## Learnings

This repo may keep a living archive of incident-derived rules in [`learnings/`](learnings/) — each file a postmortem of a real bug or a non-obvious pattern that bit once and would bite again: root cause, the rule that prevents recurrence, and tags for matching. The folder is **optional and may be absent** — create it the first time you have a learning worth saving.

**Before** investigating any bug, regression, or "weird behavior", *if a `learnings/` directory exists*:

1. Open [`learnings/index.md`](learnings/index.md) first — the topic-organized ToC (sections by surface + a tag index for symptom-driven search). Faster than `ls`.
2. If the index points at a file, **read it before forming a hypothesis** — a 30-second read can turn a 2-hour investigation into a 5-minute fix.
3. No obvious match? Fall back to keyword search:
   - `grep -ril "<keyword>" learnings/` — matches the frontmatter `tags:` block + body.
   - `ls learnings/ | grep -i "<keyword>"` — matches the slug-style filename.
4. Every file has frontmatter (`title`, `date`, `area`, `files`, `symptom`, `tags`, `summary`; `pr` when tied to a specific PR). Skim the `summary:` line to decide whether to read the full body.

**After** any fix, feature, or non-trivial change — if you learned something not already obvious from the code:

1. Add a new file `learnings/<slug>.md` with the frontmatter above, then a body covering: the symptom, the root cause (the actual mechanism, not just "the bug"), why prior fixes weren't enough if applicable, the rule going forward, and any regression guards. Create the `learnings/` folder if it doesn't exist yet.
2. If the learning extends an existing entry, edit that file instead of creating a duplicate.
3. Add a row to [`learnings/index.md`](learnings/index.md) in the matching section — a file not listed there is effectively invisible.
4. Commit the learning **in the same PR as the fix** — never as a follow-up.

The bar: would a future agent save time by reading this before touching the same surface? If yes, write it; if it would just say "read the diff," skip it. Don't ask which learnings to capture — commit every candidate that clears the bar.

**Trust rule:** if the org knowledge base (Bedrock) contradicts this repo's code, `knowledge/`, or `learnings/`, **trust local** and flag the conflict.

## Repository Knowledge Scope

This repo's `knowledge/` covers: **ci, code-conventions, patterns, specs**

Topics NOT documented locally: architecture, build, conventions, core-libs, decisions, design, features, git-conventions, guides, observability, product, quality, security, tests, workflows, brand, business, legal, hr, prompts, api, libs, components, references

## Org Knowledge Base (Bedrock)

If the `search_knowledge` tool is available in your MCP surface, use it to query the org knowledge base when:
- You cannot find an answer in this repo's `knowledge/` directory
- You need context about **other services**, **org-wide standards**, or **cross-team patterns**
- The question is about a topic not covered locally (see scope above)
- You want to verify whether a pattern is used consistently across the org

Examples (only if the tool is registered):
- `search_knowledge({ query: "how does auth work" })` — broad search across all repos
- `search_knowledge({ query: "auth", repo: "payment-service" })` — specific repo
- `search_knowledge({ query: "forbidden patterns", confidence: "high" })` — org-wide rules
- `search_knowledge({ query: "deploy", category: "ci" })` — by category

The tool searches across 200+ repos. Requires VPN. If the tool is not registered
in this environment, rely on local `knowledge/` as the only knowledge source — do not
attempt to call the tool.

## Constraints

- [TODO: Add project-specific constraints]

<!-- sdd-knowledge-generated -->
