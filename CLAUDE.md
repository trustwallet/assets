# assets

## What this repo is

- **Domain**: Crypto token asset registry — logos, metadata (`info.json`), and trading-pair tokenlists for ~188 blockchains maintained by the Trust Wallet community.
- **Route here**: Token logo additions/updates, `info.json` validation, blockchain tokenlist (`tokenlist.json`, `tokenlist-extended.json`) maintenance, asset validation tooling (Go CLI), DApp metadata.
- **Do not route here**: Wallet logic, key management, transaction signing, mobile/extension app code, backend API services.
- **Consumers**: Trust Wallet mobile app (CDN token logos/metadata), external wallet projects, `assets-management` web app (via the Assets Manager API).
- **Ships**: Compiled Go binary (`bin/assets`) with subcommands `check` / `fix` / `update-auto` / `add-token` / `add-tokenlist`. Also ships the asset file tree itself (consumed via GitHub raw URLs and CDN).
- **Agent map**: To add a token — use `make add-token`; to validate — `make check`; to auto-fix — `make fix`; to update trading pairs — `make update-auto`. See [guides/add-token.md](knowledge/guides/add-token.md).
- Stack: Go

## Repo Manifest (for agents)

Machine-readable manifest: [`.claude/repo.yml`](.claude/repo.yml). It declares this repo's purpose (`summary`), the capabilities it `owns`, matching `topics`, `consumers`, and `depends_on`.

Agents: read it to decide whether a task belongs in **this** repo. To find the *right* repo for a task, match the task against repos' `owns` / `topics` / `summary` — org-wide manifests are aggregated for cross-repo routing.

## Knowledge Map

For the structured knowledge base, see [knowledge/constitution.md](knowledge/constitution.md).

- [ci](knowledge/ci/index.md) — CI/CD pipelines, deployment automation, and release processes
- [code-conventions](knowledge/code-conventions/index.md) — Code conventions, style rules, and decision records
- [patterns](knowledge/patterns/index.md) — Coding patterns, recipes, and proven approaches
- [specs](knowledge/specs/index.md) — Feature specifications and requirements

- [architecture](knowledge/architecture/index.md) — Architecture
- [features](knowledge/features/index.md) — Features
- [guides](knowledge/guides/index.md) — Guides
- [libs](knowledge/libs/index.md) — Libs
- [tests](knowledge/tests/index.md) — Tests

## Learnings

This repo may keep a living archive of incident-derived rules in ~~[`learnings/`](learnings/)~~ — each file a postmortem of a real bug or a non-obvious pattern that bit once and would bite again: root cause, the rule that prevents recurrence, and tags for matching. The folder is **optional and may be absent** — create it the first time you have a learning worth saving.

**Before** investigating any bug, regression, or "weird behavior", *if a `learnings/` directory exists*:

1. Search the frontmatter directly — it's the source of truth and always present:
   - `grep -ril "<keyword>" learnings/` — matches the frontmatter `tags:`/`summary:` + body.
   - `ls learnings/ | grep -i "<keyword>"` — matches the slug-style filename.
   - Skim each match's `summary:` line to decide whether to read the full body.
2. For a topic-organized ToC (grouped by surface + a tag index), open `learnings/index.md`. It is a **generated** artifact that garden **always regenerates** from frontmatter — never hand-edit it (any edit is discarded next run). Depending on the repo it's either gitignored (a derived artifact) or committed; either way it can be stale if a learning file changed without a regen, so prefer `sdd-knowledge --learnings-index` over trusting it blindly.
3. Found a match? **Read it before forming a hypothesis** — a 30-second read can turn a 2-hour investigation into a 5-minute fix.
4. Every file has frontmatter (`title`, `date`, `area`, `files`, `symptom`, `tags`, `summary`; `pr` when tied to a specific PR). `area` drives the index's surface grouping; `tags` drive its tag index.

**After** any fix, feature, or non-trivial change — if you learned something not already obvious from the code:

1. Add a new file `learnings/<slug>.md` with the frontmatter above, then a body covering: the symptom, the root cause (the actual mechanism, not just "the bug"), why prior fixes weren't enough if applicable, the rule going forward, and any regression guards. Create the `learnings/` folder if it doesn't exist yet.
2. If the learning extends an existing entry, edit that file instead of creating a duplicate.
3. Make the new file's `area`, `tags`, and `summary` accurate — those drive both `grep` and the generated index (`area` → its surface grouping, `tags` → its tag index, `summary` → its hook). **Never hand-edit `learnings/index.md`** — it's generated and always regenerated; edit the learning file's frontmatter instead.
4. Commit the learning **in the same PR as the fix** — never as a follow-up.

The bar: would a future agent save time by reading this before touching the same surface? If yes, write it; if it would just say "read the diff," skip it. Don't ask which learnings to capture — commit every candidate that clears the bar.

**Trust rule:** if the org knowledge base (Bedrock) contradicts this repo's code, `knowledge/`, or `learnings/`, **trust local** and flag the conflict.

## Repository Knowledge Scope

This repo's `knowledge/` covers: **ci, code-conventions, patterns, specs**

Topics NOT documented locally: architecture, build, conventions, core-libs, decisions, design, features, git-conventions, guides, observability, product, quality, security, tests, workflows, brand, business, legal, hr, prompts, api, libs, components, references

## Org Knowledge Base (Bedrock)

The `search_knowledge` tool searches an org-wide knowledge base spanning 200+ repos for **cross-repo** signal that this repo's local `knowledge/` cannot provide. **Local knowledge wins on conflict** — Bedrock chunks can be stale or wrong for this repo; trust local `knowledge/` and flag the contradiction rather than silently adopting a Bedrock-only claim.

**Query it when** (not on every read — only when a change reaches beyond this repo):
- You edit, rename, or delete a symbol, type, schema, or route **exported from this repo's public API surface** (a package entry point, a shared type/interface, a published client) — consumers may live in other repos.
- You change a **contract that crosses a module, package, or service boundary**: an HTTP/RPC route, a queue or event payload, a persisted schema, or an env var another component reads.
- You investigate a bug whose root cause may live in a **consumer repo** ("works locally, breaks in integration").
- You want to confirm a pattern or rule is applied **consistently across the org**.

**Skip it for** purely local work: refactors with no exported-surface change, tests, docs, comments, styling, or anything contained inside non-exported/internal files.

**Query shape** — name the symbol/route/key + the relationship (callers, consumers, usage). Optional filters: `scope` (`org` = reusable org-wide patterns; `repo` + `repo: "<name>"` = one repo's docs; omit = both), `category`, `confidence`, `documentType`, `tags`, `n` (1-10).
- `search_knowledge({ query: "how does auth work" })` — broad search across all repos
- `search_knowledge({ query: "PaymentClient callers" })` — find cross-repo consumers of an exported symbol
- `search_knowledge({ query: "auth", repo: "payment-service" })` — one specific repo
- `search_knowledge({ query: "forbidden patterns", confidence: "high", scope: "org" })` — org-wide rules

**Report what you found** — when a trigger fires and the tool is available, emit one auditable line per query: `KB: <query> → <consumers in repo X,Y | none | conflicts with local>`. If two queries for the same change return nothing useful, note `KB: exhausted` and stop — do not retry-spam.

**Tool-availability rule:** the tool requires VPN and an MCP server registered in this environment. If `search_knowledge` is not in your tool surface, skip all of the above and rely on local `knowledge/` as the only knowledge source — do not attempt to call the tool. A skip for unavailability is fine; skipping *while the tool is available and a trigger fired* is a defect.

## Constraints

- [TODO: Add project-specific constraints]

<!-- sdd-knowledge-generated -->
