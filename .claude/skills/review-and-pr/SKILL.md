---
name: review-and-pr
description: Deep code review followed by PR creation. Runs deep-review first, offers to fix P0/P1 issues, then creates a PR using pr-creator conventions. Use when the user wants to review and open a PR in one step.
user-invocable: true
---

# Review and PR

Combines deep code review with PR creation into a single workflow. Performs a structured review first, fixes critical issues if needed, then creates a PR following the repo's conventions.

## When to Use

Activate this skill when:
- User asks to "review and create a PR" or "review and open a PR"
- User says "/review-and-pr"
- User wants a quality check before submitting a PR in one step

## Instructions

### Phase 1: Deep Code Review

Follow the exact deep-review process described below.

#### 1.1 Accept Optional Context

The user may provide:
- A ticket description or requirements
- A PR description
- Any extra context about what the changes should accomplish

If none given, proceed without it. Store whatever is provided for reference in the report header.

#### 1.2 Identify Base Branch and Gather Diff

Determine the base branch (default: `main`). The user can specify a different base.

```bash
git diff main...HEAD
git diff main...HEAD --stat
git log --oneline main..HEAD
```

If the diff is empty, inform the user and stop.

#### 1.3 Detect Affected Areas

Inspect changed file paths to determine which areas/modules/packages are affected. Map each changed path to the part of the repo it belongs to (whatever structure the repo uses).

For each affected area, load the relevant convention docs if present:
- The area's architecture/design docs (e.g. `.claude/` docs or `docs/`)
- The area's testing conventions
- The area's lint/style config (the repo's configured linter)

Read the relevant guideline files for each detected area BEFORE starting the review.

#### 1.4 Read ALL Changed Files and Their Context

Read every changed file in its entirety before writing any findings. Cross-file issues (inconsistent interfaces, missing call-site updates, broken contracts) are often the most critical and can only be found by reading everything first.

Then identify files that import or reference the changed files — especially consumers of modified interfaces, protocols, or public APIs. Read those too. Bugs often live in callers that weren't updated to match a change.

#### 1.5 Analyze Per Area

Review across five lenses for each affected area:

**Architecture compliance**
- Layer constraints, module/package boundaries, established architectural patterns
- API/SDK/framework access patterns
- Theming or design-system usage where applicable
- Dependency direction violations

**Code quality**
- Error handling correctness and completeness
- Null safety / optionality
- Thread safety and concurrency
- Memory management (retain cycles, leaks)
- Edge cases

**Logic correctness**
- Does implementation match the stated requirements / ticket?
- Boolean and state logic correctness
- Concurrency / race conditions
- Off-by-one, boundary conditions

**Performance**
- Unnecessary allocations or object creation
- Redundant API/DB calls
- Missing caching opportunities
- Main thread / UI thread blocking work

**Security**
- Key material handling and storage
- Sensitive data in logs, analytics, or error messages
- Input validation on user-provided and external data
- Transaction signing and amount validation
- Deep link / universal link injection
- Insecure serialization or deserialization

#### 1.6 Check Git History for Repeated Patterns

Review `git log --oneline main..HEAD` for patterns. If the same kind of bug was already fixed earlier on this branch, flag it as a pattern risk.

#### 1.7 Validate API Contracts Across Consumers

When changes modify public interfaces, protocols, or data models:
- Check that consumers (other modules/packages/areas) are updated to match
- If consumers aren't in the diff, search for usages and verify backwards compatibility
- Flag any breaking change that doesn't have corresponding consumer updates

#### 1.8 Check Context Map Freshness

1. Read all `.md` files in `context-map/ui/screens/` and `context-map/ui/tabs/`
2. For each file that has a `sources:` field in its YAML frontmatter, expand the glob patterns against the list of changed files from step 1.2
3. If any changed file matches a doc's `sources:` pattern, mark that doc as **potentially stale**
4. For each stale doc, check whether the doc itself was also modified in the diff — if it was updated too, it is not stale
5. Report each remaining stale doc as a **P2 Minor** finding with:
   - The doc path (e.g., `context-map/ui/screens/Swap.md`)
   - Which source globs matched, and a sample of the changed files that triggered the match
   - Suggestion: "Review this context map doc and update any sections affected by the code changes (Tech Stack, Feature Flags, Services, BE Endpoints, Navigation, or Notes)"

**Skip conditions:**
- If no screen/tab docs have `sources:` fields, skip silently
- Do not check feature docs (`context-map/feature/`) — features are tracked indirectly through their related screens

#### 1.9 Categorize Issues

| Priority | Criteria |
|---|---|
| **P0 Critical** | Crash, data loss, security vulnerability, fundamental architecture violation. Must fix before merge. |
| **P1 Important** | Logic error, missing edge case, performance regression, significant convention violation. Should fix. |
| **P2 Minor** | Naming, readability, style, suggestion. Fix if time permits. |

**Decision guide:**
- Crash or security issue → P0
- Incorrect user-visible behavior → P1
- Meaningful quality improvement → P2
- Trivial nitpick or personal preference → don't report

Be strict but honest. Do not manufacture issues. If the code is solid, say so.

#### 1.10 Identify Unit Test Opportunities

For each affected area, suggest tests following that area's conventions. Read the test guidelines loaded in step 1.3, and match the existing test framework, mocking approach, assertion style, fixture patterns, and naming conventions already used in the repo. Do not impose a framework the repo doesn't use.

Each test suggestion must include:
1. What to test (function/component/flow)
2. Which scenarios to cover
3. A skeleton code example following the repo's conventions

#### 1.11 Present Review Inline

Output the full review directly in chat (do NOT write a file). Use this structure:

**Header:** branch name, date, base, commit count, affected areas, context summary.

**Summary:** 2-3 sentence overall assessment + P0/P1/P2 counts table.

**P0 Critical section:** Each issue with file path + line, impact, description, and concrete code fix suggestion. If none, state "No issues found."

**P1 Important section:** Same format as P0. If none, state "No issues found."

**P2 Minor section:** Lighter format — file path + line and brief description with suggestion. If none, state "No issues found."

**Unit Test Suggestions:** What to test, scenarios, and skeleton code examples following the repo's conventions.

**Positive Observations:** Genuinely good patterns, decisions, or code quality worth acknowledging.

### Phase 2: Fix Issues (if any P0/P1 found)

If there are P0 or P1 findings, use the `AskUserQuestion` tool to ask: "Want me to apply the P0/P1 fixes before creating the PR?"

If the user agrees:
1. Apply all P0 fixes first, then P1 fixes
2. Commit the changes using atomic commits per project conventions

If the user declines, proceed to Phase 3.

**Gate:** If P0 issues remain unfixed, warn the user that merging is risky and ask if they still want to create the PR. If they say no, stop.

### Phase 3: Create PR

Follow the exact pr-creator process described below.

#### 3.1 Check for Existing PR

```bash
gh pr view --json number,url -q '.url' 2>/dev/null
```
If a PR exists, inform the user and ask if they want to update it or create a new one.

#### 3.2 Check for Ticket

- Look for ticket reference (SC-XXXXX, case-insensitive) in the conversation, branch name, or commits
- **If no ticket found:** Ask the user:
  - Do they need to create a ticket? Link: https://app.shortcut.com/trust-wallet-1/stories/new
  - Or is this a `chore:` that doesn't require a ticket?

#### 3.3 Check Target Branch

- **If user didn't specify target branch:** Ask which branch to target:
  - `main` (default development branch)
  - Latest release branch (look up using `git branch -r | grep 'origin/release/[0-9]' | sed 's#origin/##' | sort -V | tail -1`)

#### 3.4 Read PR Template

**IMPORTANT:** Always read `.github/pull_request_template.md` — this is the single source of truth for PR format.

#### 3.5 Analyze Changes

Gather the full picture of what's being submitted:
```bash
git diff {target}...HEAD --stat
git diff {target}...HEAD
git log --oneline {target}..HEAD
```

Use this to write an accurate description and test plan.

#### 3.6 PR Title Requirements

- Use conventional commit prefixes: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
- **Derive the prefix from the branch name.** Parse the current branch name prefix (the part before the first `/`) and map it:
  - `feature` → `feat:`
  - `fix`, `bugfix`, `hotfix`, `bug` → `fix:`
  - `chore` → `chore:`
  - `refactor` → `refactor:`
  - If the branch name doesn't match any known pattern, ask the user which prefix to use.
- **Do NOT include ticket numbers in the title** — the ticket link is already in the PR body
- **Format:** `feat: add biometric authentication support` (lowercase after the colon)
- **Chores without ticket:** `chore: update dependencies`

#### 3.7 PR Body

Use the format from `.github/pull_request_template.md` and fill in:
- **Description:** Summarize what changed and why, based on the diff and commit history
- **Checklist:** Treat `.github/pull_request_template.md` as the source of truth for which items are checked or unchecked by default. Preserve those default states, **except**: for this skill, pre-check the `/deep-review completed` item as `- [x]` (since the deep review was already performed in Phase 1), even if the template has it unchecked. Do not change the checked/unchecked state of any other items unless there is an explicit override in these skill instructions. For any template checklist items that are conditional on the kind of change (e.g. items scoped to a specific platform, environment, or to UI changes), include them only when the `git diff --stat` output shows the PR actually touches the relevant files, and omit them otherwise. Infer the relevant file patterns from the item's wording and the repo's structure.
- **How to test:** Step-by-step instructions derived from the actual changes
- **Screenshots:** If the template has a Screenshots section, include it only when the PR touches UI-related files (infer the relevant patterns from the repo's structure). Omit the section entirely for non-UI PRs.
- **Tests section:** Must include the `<!-- pr-tests-start -->` and `<!-- pr-tests-end -->` markers with test descriptions between them (CI enforces this)

#### 3.8 PR Type

Ask the user if they want to create the PR as a **draft** or as **ready for review**.

#### 3.9 Team Label

Ask the user which existing `team/*` label to apply to the PR. For example:
- `team/devops`
- `team/core-ui`
- `team/tgrowth`
- `team/trading-surfaces`
- `team/banking-team`

These are examples only — the user may choose any appropriate existing `team/*` label. Platform labels (`platform/android`, `platform/ios`, etc.) are auto-assigned by CI — do not add them manually.

#### 3.10 Release Label

If the target branch is a release branch (`release/...`), manually add the `Release` label with `--label Release`.

#### 3.11 Push and Create PR

1. Verify branch is pushed and up to date with remote
2. Push with `-u` flag if needed
3. Create the PR using `gh pr create` with a HEREDOC for the body, always including the chosen team label. If the user chose draft, add the `--draft` flag; otherwise omit it:

```bash
# For main:
gh pr create --base {target} --title "{title}" --assignee @me --label "{team_label}" --body "$(cat <<'EOF'
{body content}
EOF
)"

# For main (draft):
gh pr create --base {target} --title "{title}" --assignee @me --label "{team_label}" --draft --body "$(cat <<'EOF'
{body content}
EOF
)"

# For release branches, add Release label too:
gh pr create --base {target} --title "{title}" --assignee @me --label "{team_label}" --label Release --body "$(cat <<'EOF'
{body content}
EOF
)"

# For release branches (draft):
gh pr create --base {target} --title "{title}" --assignee @me --label "{team_label}" --label Release --draft --body "$(cat <<'EOF'
{body content}
EOF
)"
```

#### 3.12 Move Shortcut Story to "In Review"

After the PR is successfully created, if a ticket number (SC-XXXXX) was found:

1. Extract the numeric story ID from the ticket (e.g., from `SC-120105` take `120105`) and fetch the story using `mcp__shortcut__stories-get-by-id` with that numeric ID
2. Check the story's current workflow state — only move if it's in a pre-review state (e.g., "To Do", "In Progress")
3. Determine which workflow the story belongs to by checking its current `workflow_state_id`:
   - **Standard** workflow states: `500000006` (Unscheduled), `500000007` (To Do), `500000008` (In Progress), `500000009` (In Review), `500000010` (Done)
   - **Engineering** workflow states: `500000515` (Backlog), `500000516` (To Do), `500000517` (In Progress), `500000518` (In Review), `500000519` (Done)
4. Move the story to **"In Review"** using `mcp__shortcut__stories-update` with the correct `workflow_state_id`:
   - **Standard** workflow: `500000009`
   - **Engineering** workflow: `500000518`
5. Inform the user that the story was moved to "In Review"

If the Shortcut MCP server is not available or the update fails, skip this step silently and just show the PR URL.

## Key Rules

- Read area guidelines BEFORE reviewing code
- Read ALL changed files BEFORE writing any findings
- Every P0 and P1 must include a concrete code fix suggestion
- Do NOT run linters, tests, or build commands — reference guideline rules as criteria only
- Do NOT write report files — output everything inline in chat
- Cross-area awareness: flag integration issues when changes affect consumers in other modules/packages
- Be strict but honest — acknowledge good code, don't inflate issue counts
- Always read `.github/pull_request_template.md` for the latest PR format
- Ask about ticket creation if no ticket is found
- Chores typically don't require tickets
- **Do NOT** include Claude signature or Co-Authored-By footer in PRs
