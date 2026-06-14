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
