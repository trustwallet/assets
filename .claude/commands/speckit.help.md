---
description: Brief overview on both operational modes and sequence of steps for user to do and validate.
---

## Role Context

You are a **SpecKit Usage Guide**. Your job is to orient the user within the SpecKit workflow. Be concise and practical — this is a tutorial for developers who have never used SpecKit or Beads before.

## User Input

```text
$ARGUMENTS
```

If the user provided a question or context above, answer it directly using the reference below. Otherwise, print the full tutorial.

## Analytics

**Before starting any work**, silently run this command (do not show output to the user):
```bash
sdd-track speckit_command --command help
```

## Tutorial Output

When no specific question is provided, print the following (adapt feature directory paths if detectable from git branch):

---

# SpecKit + Beads — Getting Started

SpecKit is a spec-driven development workflow that lives inside Claude Code. You describe a feature in plain English, and SpecKit generates design artifacts (spec, plan, tasks) then implements them — one commit per task. Beads (`bd`) is an optional local task tracker that gives you session resumption and dependency-aware task ordering.

## Prerequisites

1. **Claude Code** with slash commands working (you're here, so this is done)
2. **Beads** (optional but recommended): installed via Homebrew (`bd` command). Run `bd` to check. If not installed, SpecKit still works — you just lose task tracking and session resumption.
3. **Project constitution** (one-time setup): run `/speckit.constitution` to define project principles and architecture rules. This creates `knowledge/constitution.md` which all subsequent commands reference. Skip if it already exists.

## Choose Your Mode

### When to use Fast Track (`/speckit.fast`)
- Feature is small to medium (3-8 tasks)
- Requirements are clear — you could explain the feature in 2 sentences
- Touches at most 2 top-level directories
- No need for team review of the design
- Examples: "add a settings toggle for dark mode", "fix the payment timeout by adding retry logic"

### When to use Full Pipeline
- Feature is medium to large (8+ tasks)
- Requirements have unknowns or need stakeholder review
- Spans 3+ directories or requires data model / API contract design
- Examples: "implement multi-currency support", "add OAuth2 integration"

---

## Mode 1: Fast Track

**One command does everything**: generates a lightweight spec, derives tasks, and implements them.

```
/speckit.fast SC-12345 Add retry logic for failed API payments
```

### What happens step by step:

1. **Branch & spec creation** — creates `feature/SC-12345/retry-payment` branch and a compressed `spec.md` in `knowledge/specs/sc-12345-retry-payment/`
2. **Task generation** — derives a flat task list (`tasks.md`) directly from the spec's functional requirements
3. **Beads sync** — if `bd` is available, creates Beads issues with linear dependencies
4. **Complexity check** — evaluates whether the feature is actually small enough for fast mode. If it flags HIGH complexity, consider escalating (see below)
5. **Decision dialog** — presents a summary and asks you to choose:
   - **A) Implement** — proceed to write code
   - **B) Clarify** — run `/speckit.clarify` to resolve ambiguities first
   - **C) Escalate** — switch to full pipeline (`/speckit.plan` → `/speckit.tasks` → `/speckit.implement`)
   - **D) Abort** — keep branch + spec, stop here
6. **Implementation** — executes tasks one-by-one, one commit per task, updating `tasks.md` checkboxes as it goes
7. **Post-check** — verifies every functional requirement from the spec was addressed in the code
8. **Learnings capture** — asks if anything should be recorded for future sessions

### What you should validate:
- After step 2: skim the generated spec and task list — are the requirements correct?
- At step 5: choose wisely. If the summary shows >8 tasks or >2 directories, escalate.
- After step 6: review each commit. Run tests.

### Resuming an interrupted fast session:
Just run `/speckit.fast` again with the same description (or switch to the feature branch first). It detects existing artifacts and offers to resume from where you left off.

---

## Mode 2: Full Pipeline

Run each command in sequence. Each one produces an artifact you should review before proceeding.

### Step 1: Write the specification

```
/speckit.specify SC-12345 Implement multi-currency wallet support
```

**What it does**: Creates a feature branch, then generates `spec.md` with user stories, acceptance criteria, functional requirements, edge cases, and success criteria. Runs a self-quality-check and may ask you up to 3 clarification questions.

**Produces**: `knowledge/specs/sc-12345-multi-currency/spec.md` + HTML viewer (auto-opens in browser)

**You validate**: Read the spec. Are the user stories right? Are edge cases covered? Are requirements testable? Is the scope correct?

### Step 2 (optional): Clarify ambiguities

```
/speckit.clarify
```

**What it does**: Reads the current spec and probes for underspecified areas — up to 5 targeted questions about ambiguities, hidden assumptions, and edge cases. Injects your answers back into the spec.

**When to use**: When the spec has `[NEEDS CLARIFICATION]` markers, or when you want a second pass on completeness before investing in architecture.

### Step 3 (optional): Generate domain checklists

```
/speckit.checklist accessibility requirements for the wallet UI
```

**What it does**: Creates a checklist that validates whether your *spec's requirements* are well-written for a specific domain (accessibility, security, UX, etc.). Think of it as "unit tests for English" — it checks the spec, not the code.

**Produces**: `knowledge/specs/<feature>/checklists/<domain>.md`

### Step 4: Plan the architecture

```
/speckit.plan
```

**What it does**: Reads the spec and constitution, then generates `plan.md` with technical decisions, data model, API contracts, and research notes. Checks the design against constitution principles.

**Produces**: `plan.md`, `research.md`, `data-model.md`, `contracts/` directory, `quickstart.md` — all in the feature's specs folder + HTML viewers

**You validate**: Review architecture decisions. Check the data model. Verify API contracts match the spec's functional requirements.

### Step 5: Generate tasks

```
/speckit.tasks
```

**What it does**: Reads spec + plan and generates a dependency-ordered `tasks.md` organized by user story. Each task is independently committable. If Beads is available, syncs all tasks as Beads issues with dependency edges.

**Produces**: `tasks.md` + Beads issues (if `bd` is installed)

**You validate**: Check the task breakdown. Are dependencies correct? Is each task small enough for one commit? Are file paths accurate?

### Step 6 (optional): Analyze for consistency

```
/speckit.analyze
```

**What it does**: Cross-checks spec, plan, and tasks for inconsistencies, gaps, and ambiguities. Acts as an adversarial QA reviewer. Does not modify any files.

**When to use**: Before implementation, especially for large features. Catches spec-plan mismatches, missing requirements, and untestable tasks.

### Step 7: Implement

```
/speckit.implement
```

**What it does**: Executes all tasks from `tasks.md` in dependency order. One commit per task (constitutional requirement). If Beads is active, uses `bd ready` to pick unblocked tasks and marks them done as it goes. Supports session resumption — if interrupted, re-running picks up where it left off.

**You validate**: Review each commit. Run tests after each phase. Check that the code matches the spec.

### Step 8 (optional): Push tasks to GitHub

```
/speckit.taskstoissues
```

**What it does**: Creates GitHub Issues from `tasks.md` with dependency info. If Beads is available, enriches issues with priority and status metadata. Only works if the git remote is a GitHub URL.

### Step 9 (optional): Sync learnings with knowledge base

```
/speckit.sync search <query>
/speckit.sync upload
/speckit.sync download
```

**What it does**: Manages cross-project learnings via the Bedrock knowledge base. Three modes:
- **search** — query the knowledge base for learnings matching a keyword
- **upload** — classify local learnings as general vs project-specific, upload general ones with user confirmation
- **download** — search the knowledge base by project context, selectively import learnings into local `learnings.md`

**Note**: Requires `SDD_LEARNINGS_API_URL` to be configured (baked at publish or set as env var). Auto-upload of general learnings also happens silently during `/speckit.implement` and `/speckit.fast`.

---

## Beads Quick Reference

Beads (`bd`) is a local task tracker. SpecKit syncs tasks to it automatically — you mostly interact with it for status checks and claiming tasks.

| Action | Command | Notes |
|--------|---------|-------|
| See all tasks | `bd list --json` | Full state dump |
| See unblocked tasks | `bd ready --json` | Tasks you can work on now |
| Claim a task | `bd set-state <id> status=in-progress` | No `bd claim` command exists |
| Complete a task | `bd close <id>` | Unblocks dependents automatically |
| Export state | `bd sync` | Writes JSONL to `.beads/` |
| Log a discovery | `bd new --title "Fix: ..." --deps "discovered-from:bd-XXX"` | For unexpected work found during implementation |

**Important**: Always run `bd` commands from the **repo root**, never from feature directories. The `.beads/` directory is gitignored.

---

## Commit Signing (2FA / YubiKey)

If your org requires signed commits (GPG/SSH), speckit works transparently — every
`git commit` Claude runs will use your git signing config. However, hardware keys
(YubiKey) or 2FA that require a physical tap per commit need extra consideration:

- **Without `--auto-commit`**: Claude shows a Commit/Edit/Pause dialog before each
  task commit. You tap YubiKey when prompted. This is the smoothest flow since you're
  already in the loop for each commit.
- **With `--auto-commit`**: Claude commits immediately after each task. Each commit
  still triggers a YubiKey tap prompt, but Claude may start the next task before you
  tap — causing a failed commit. **Recommendation**: don't use `--auto-commit` with
  hardware signing keys. Use the default dialog flow instead.
- **Setup**: Ensure `gpg-agent` (or `ssh-agent`) is running with a long
  `default-cache-ttl` before starting a Claude session. For software-only keys with
  cached passphrases, `--auto-commit` works fine.

## Quick Decision Flowchart

- **Bug fix or trivial change** → just code it, no SpecKit needed
- **Small feature, clear requirements** → `/speckit.fast <description>`
- **Medium feature, some unknowns** → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
- **Large feature, team coordination** → full pipeline + `/speckit.clarify` + `/speckit.checklist` + `/speckit.analyze`
- **Switching from fast to full** → `/speckit.fast` offers an "Escalate" option that hands off to `/speckit.plan`
- **Resuming interrupted work** → re-run the same command; SpecKit detects existing artifacts and offers to resume
- **Lost or stuck** → `/speckit.help <your question>`

---

## Answering Specific Questions

When the user asks a question (e.g., "what do I do after speckit.plan?"), answer it using the tutorial above. Keep answers to 3-5 lines. Always suggest the concrete next command to run.

Common questions and how to answer them:

- **"What's next after X?"** → look up X in the full pipeline sequence and suggest the next step
- **"How do I track tasks?"** → explain `bd ready --json`, `bd set-state`, `bd close`
- **"Full pipeline or fast?"** → ask about feature size and clarity of requirements, then recommend
- **"How do I start a new feature?"** → check if `constitution.md` exists at `knowledge/constitution.md`. If not, suggest `/speckit.constitution` first. Then suggest `/speckit.specify <description>` or `/speckit.fast <description>`
- **"Can I switch from fast to full?"** → yes, during the decision dialog `/speckit.fast` offers "Escalate" to hand off to the full pipeline
- **"What's the SC-XXXXX in the command?"** → it's your issue tracker ticket ID (e.g., Shortcut). If provided, SpecKit uses it for branch naming (`feature/SC-12345/short-name`) and folder naming. If omitted, an auto-incremented number is used instead.
- **"What if I don't have Beads installed?"** → everything works without it, you just lose task dependency tracking and session resumption. Tasks are still tracked in `tasks.md` checkboxes.
