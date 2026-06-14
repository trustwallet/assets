---
name: sdd-what-this-repo-is
description: Analyze the current repo and auto-fill the `## What this repo is` section at the top of CLAUDE.md with a precise, agent-navigable summary (domain, primary users, what it produces, key directories). Use when the user asks to "fill in what this repo is", "update CLAUDE.md repo summary", "describe this repo for agents", or invokes /sdd-what-this-repo-is. Replaces the heuristic auto-fill that `sdd-knowledge --garden` produces with a deeper analysis.
user-invocable: true
---

# /sdd-what-this-repo-is — agent-grade repo summary for CLAUDE.md

## What this skill does

Every BB session loads CLAUDE.md. Its top-of-file bytes are recurring cost — paid on every conversation turn. The `## What this repo is` section at the top of CLAUDE.md should answer, in 3–5 lines an agent can skim once:

1. **What this repo is** (single sentence — domain + form).
2. **Who uses it** (downstream consumers, end users, internal teams).
3. **What it produces** (artifacts: binaries, APIs, events, services, packages).
4. **How agents navigate it** (which dirs / TOCs are load-bearing).

`sdd-knowledge --garden` populates this section with a heuristic: stack from `package.json`, produces from `bin`/`main`, knowledge categories from `knowledge/`. That gets you 80% accuracy across simple repos but misses domain, consumers, and navigation. This skill goes deeper — it actually reads the code, the README, the constitution, the largest knowledge sections, and synthesizes a precise summary.

## When to use

- User asks: "fill in what this repo is", "update the repo summary in CLAUDE.md", "describe this repo for agents", "make the top of CLAUDE.md useful".
- User invokes `/sdd-what-this-repo-is`.
- The current `## What this repo is` section is missing, empty, generic (matches the `- Stack: …` / `- Produces: …` pattern), or contains `[TODO:` stubs.
- The user explicitly wants a richer, hand-quality summary instead of the heuristic.

## When NOT to use

- A user has already hand-curated the `## What this repo is` body with prose that doesn't match the auto-fill pattern. In that case, ask before overwriting.
- The repo has no `knowledge/` directory (skill expects the v1.8.10+ CLAUDE.md shape). Suggest the user run `sdd-knowledge` first.
- The user just wants the heuristic auto-fill — they should run `sdd-knowledge --garden` instead. This skill is the LLM-grade upgrade.

## Workflow

### 1. Confirm the target file exists

```bash
test -f CLAUDE.md || { echo "No CLAUDE.md found at repo root."; exit 1; }
test -d knowledge || echo "(warning: no knowledge/ directory — falling back to repo-tree analysis only)"
```

If CLAUDE.md is missing, tell the user to run `sdd-knowledge` first.

### 2. Read the current section state

```bash
# Extract the current "## What this repo is" body if any.
awk '/^## What this repo is$/{flag=1; next} /^## /{flag=0} flag' CLAUDE.md
```

Classify the current state:

- **Missing**: no `## What this repo is` heading.
- **Auto-fill** (garden output): every bullet starts with `- Stack:`, `- Produces:`, or `- Knowledge base:`.
- **Stubbed**: body contains `[TODO:`, `[TODO]`, or `[TODO ` tokens.
- **User-curated**: anything else.

If user-curated and the user did not explicitly invoke `/sdd-what-this-repo-is`, **stop and ask** before overwriting. If they did invoke it directly, ask once whether to keep, edit, or replace.

### 3. Gather signal — read these in this order

Read each file fully (not partial) when present:

| Priority | Source | What it tells you |
|---|---|---|
| 1 | `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / `build.gradle*` / `Package.swift` | Stack, version, declared `description`, dependencies that hint at domain (e.g. `aws-sdk` → infra service; `react-native` → mobile; `kafka-node` → event-driven service) |
| 2 | `README.md` (first 2 screens) | Tagline, primary use case, install/run instructions |
| 3 | `knowledge/constitution.md` (table of contents) | Which knowledge categories are populated, what the repo's structured docs cover |
| 4 | `knowledge/architecture/index.md` and its top-listed docs | Architecture in one paragraph (read the first doc whose title contains "architecture" / "overview" / "design") |
| 5 | The repo's actual top-level directory layout (`ls -la`) | Code organization: `src/`, `bin/`, `lib/`, `services/`, `apps/`, `packages/` etc. |
| 6 | Manifest `bin` / `main` / `exports` / build outputs | What artifacts ship |
| 7 | `.github/workflows/*.yml`, `Dockerfile`, `docker-compose.yml`, `Makefile` (only if present) | How the repo is built/run — informs "produces" line |
| 8 | A handful of leaf docs from the largest knowledge dir (5–10 doc titles) | Domain vocabulary — what real concepts this repo deals in |

Stop reading once you have a confident answer for all four lines below. **Don't keep reading "to be thorough"** — over-reading bloats context for no quality gain.

### 4. Synthesize the four lines

Produce a draft body with **exactly these four bullet shapes**, each on its own line, no headers:

```
- **Domain**: <one phrase — what the repo deals in, e.g. "Crypto wallet backend for the mobile app", "AI-orchestration platform for Claude Code sessions">
- **Consumers**: <who imports / runs / depends on this — be concrete: a sibling repo name, an internal team, end-users of an app>
- **Ships**: <artifacts produced — binaries with names, npm packages with their names, REST API on a specific path, Kafka events, etc.>
- **Agent map**: <which dirs/docs to read FIRST for which task — e.g. "feature work → `knowledge/architecture/`, deploys → `knowledge/ci/`, bug triage → `learnings/`">
```

Guidelines for each line:

- **Domain**: name the concrete domain, not the toolset. "Spec-Driven Development toolkit for Claude Code" ≠ "A Node.js CLI". The latter is what the heuristic produces; the former is what the skill should produce.
- **Consumers**: list named consumers if you can identify them. If the repo is library-shaped and you can't trace consumers, say "downstream repos via npm (or pip / cargo / …)". If it's a service, name the upstream caller pattern.
- **Ships**: be specific. Number of binaries by name; package name; API endpoint path; event topics; container images. Avoid "various tools" or "multiple commands".
- **Agent map**: this is the navigation hint. For each common task type the repo supports, name the FIRST file/dir to read. Maps a task to a knowledge entry point so agents don't drill blindly.

Hard rules:

- **Never emit `[TODO:`, `[TODO]`, or `[TODO ` stubs.** If you can't determine a line confidently, ask the user one question to fill the gap; if they decline to answer, OMIT that line (don't stub it).
- **Total body length: 4 lines.** Each line ≤ 220 characters. Resist the urge to expand into paragraphs. CLAUDE.md is read every turn — verbose summaries tax every session.
- **Don't include knowledge category lists** (`Knowledge base: 8 categories — architecture, build, ci, …`). That's `sdd-knowledge --garden`'s job and lives in the Knowledge Map block below. Duplicating it wastes tokens.

### 5. Show the user a diff before writing

Present a concise diff:

```
The new "## What this repo is" body will be:

  - **Domain**: <line>
  - **Consumers**: <line>
  - **Ships**: <line>
  - **Agent map**: <line>

(replaces N lines of <auto-fill | stub | missing>)
```

Ask: "Apply?" If yes, proceed to step 6. If no, accept edits and re-confirm.

### 6. Apply the edit

Replace only the body of the `## What this repo is` section, preserving everything else in CLAUDE.md. Use Edit (not Write) with a unique `old_string` anchored on `## What this repo is\n\n` through the next H2 / blank-line-pair / EOF.

If the section is missing entirely, insert it right before `## Knowledge Map`. Match the exact indentation and spacing of surrounding sections.

### 7. Verify

```bash
# Section appears exactly once.
[ "$(grep -c '^## What this repo is$' CLAUDE.md)" = "1" ]
# No [TODO: stubs in the new body.
awk '/^## What this repo is$/{flag=1; next} /^## /{flag=0} flag' CLAUDE.md | grep -q '\[TODO' && echo "FAIL: stub leaked" || echo "OK: no stubs"
# Length sanity: ≤ 10 non-blank lines.
awk '/^## What this repo is$/{flag=1; next} /^## /{flag=0} flag' CLAUDE.md | grep -c "^[^[:space:]]"
```

If any check fails, undo the edit and stop. Report the failure to the user.

## Interaction with `sdd-knowledge --garden`

`--garden`'s `isAutoFilledRepoSummary()` recognizes garden's own bullet shape (`Stack:` / `Produces:` / `Knowledge base:`) as auto-fill and will refresh it. The shape this skill produces (`**Domain**:` / `**Consumers**:` / `**Ships**:` / `**Agent map**:`) does NOT match that pattern — garden treats it as user-curated and leaves it alone. That's the intended contract: once a human or this skill has produced a precise summary, garden never overwrites it.

If you need to re-run this skill later (repo evolved), do so explicitly — garden won't trigger it.

## Output style

- Concrete nouns over generic categories: "Postgres-backed event queue" beats "data store".
- Named entities where they exist: "consumed by `payment-service` and `risk-engine`" beats "internal services".
- Imperatives in the agent-map line: "feature work → `knowledge/architecture/backend/`" — tells the agent where to *start*, not what to "look into".
- No marketing language. No "robust", "scalable", "enterprise-grade". An agent skimming CLAUDE.md doesn't care.

## Examples

### Good

```
## What this repo is

- **Domain**: Spec-Driven Development toolkit for Claude Code — generates and maintains `knowledge/` + CLAUDE.md across ~200 Trust Wallet repos.
- **Consumers**: every Trust Wallet repo that runs `npm i -g sdd-tools` (mobile-monorepo, tsdk, conductor-2, release-manager, +196 more), plus the Conductor session-pod orchestrator.
- **Ships**: 11 CLI binaries (`sdd-init`, `sdd-knowledge`, `sdd-track`, …) on npm, an S3 metadata sync pipeline, and a Bedrock KB query helper.
- **Agent map**: feature work → `bin/sdd-knowledge.js` (single-file CLI), garden internals → `learnings/`, downstream contract → `templates/knowledge-sync.yml`.
```

### Bad (don't emit)

```
## What this repo is

- Stack: Node.js (>=18.0.0)
- Produces: 11 CLI tools — sdd-init, sdd-knowledge, sdd-track, sdd-learnings, sdd-knowledge-query, +6 more
- Knowledge base: 8 categories — architecture, build, ci, code-conventions, guides, libs, observability, patterns
```

(That's the garden heuristic — fine as a fallback, not what this skill produces. Notice it doesn't tell an agent what the repo IS, who uses it, or where to start.)

### Bad (don't emit)

```
## What this repo is

- **Domain**: [TODO: domain]
- **Consumers**: [TODO: who uses it]
- **Ships**: A robust, scalable CLI toolkit for spec-driven development workflows that integrates seamlessly with modern AI agents and provides enterprise-grade automation for knowledge base management across hundreds of repositories.
```

(Stubs leaked; marketing language; one line is 30× too long.)
