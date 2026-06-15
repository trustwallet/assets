---
name: deep-review
description: Deep code review of the current branch with P0/P1/P2 issues, architecture validation, and unit test suggestions. Use when the user asks to review code, check quality, or validate before PR.
user-invocable: true
---

# Deep Code Review

Performs a structured code review of the current branch against a base branch. Produces a prioritized inline report with findings categorized as P0/P1/P2, architecture validation, and unit test suggestions.

## When to Use

Activate this skill when:
- User asks to "review code", "review my changes", or "deep review"
- User asks to "check quality" or "validate before PR"
- User wants a structured code review of their branch

## Instructions

### 1. Accept Optional Context

The user may provide:
- A ticket description or requirements
- A PR description
- Any extra context about what the changes should accomplish

If none given, proceed without it. Store whatever is provided for reference in the report header.

### 2. Identify Base Branch and Gather Diff

Determine the base branch (default: `main`). The user can specify a different base.

```bash
git diff main...HEAD
git diff main...HEAD --stat
git log --oneline main..HEAD
```

If the diff is empty, inform the user and stop.

### 3. Detect Affected Areas

Inspect changed file paths to determine which areas/modules/packages are affected. Map each changed path to the part of the repo it belongs to (whatever structure the repo uses).

For each affected area, load the relevant convention docs if present:
- The area's architecture/design docs (e.g. `.claude/` docs or `docs/`)
- The area's testing conventions
- The area's lint/style config (the repo's configured linter)

Read the relevant guideline files for each detected area BEFORE starting the review. These inform what conventions to enforce.

### 4. Read ALL Changed Files and Their Context

Read every changed file in its entirety before writing any findings. Cross-file issues (inconsistent interfaces, missing call-site updates, broken contracts) are often the most critical and can only be found by reading everything first.

Then identify files that import or reference the changed files — especially consumers of modified interfaces, protocols, or public APIs. Read those too. Bugs often live in callers that weren't updated to match a change.

### 5. Analyze Per Area

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

### 6. Check Git History for Repeated Patterns

Review `git log --oneline main..HEAD` for patterns. If the same kind of bug was already fixed earlier on this branch (e.g., a threading fix, a nil check, a missing cache invalidation), flag it as a pattern risk — the same mistake may exist in other files touched by the branch.

### 7. Validate API Contracts Across Consumers

When changes modify public interfaces, protocols, or data models:
- Check that consumers (other modules/packages/areas) are updated to match
- If consumers aren't in the diff, search for usages and verify backwards compatibility
- Flag any breaking change that doesn't have corresponding consumer updates

### 8. Check Context Map Freshness

1. Read all `.md` files in `context-map/ui/screens/` and `context-map/ui/tabs/`
2. For each file that has a `sources:` field in its YAML frontmatter, expand the glob patterns against the list of changed files from step 2
3. If any changed file matches a doc's `sources:` pattern, mark that doc as **potentially stale**
4. For each stale doc, check whether the doc itself was also modified in the diff — if it was updated too, it is not stale
5. Report each remaining stale doc as a **P2 Minor** finding with:
   - The doc path (e.g., `context-map/ui/screens/Swap.md`)
   - Which source globs matched, and a sample of the changed files that triggered the match
   - Suggestion: "Review this context map doc and update any sections affected by the code changes (Tech Stack, Feature Flags, Services, BE Endpoints, Navigation, or Notes)"
6. **Auto-stamp non-stale docs:** After completing the staleness report, for each doc that has a `sources:` field and was NOT marked as potentially stale, update its `last_synced` frontmatter field to today's date (YYYY-MM-DD). If the field already exists, replace the value; if missing, add `last_synced: YYYY-MM-DD` as the last line before the closing `---`. After all updates, run `node context-map/tools/build.js`. Do NOT stamp docs that were flagged as stale (they need human review first). Do NOT stamp docs without a `sources:` field.

**Skip conditions:**
- If no screen/tab docs have `sources:` fields, skip silently
- Do not check feature docs (`context-map/feature/`) — features are tracked indirectly through their related screens

### 9. Categorize Issues

Assign a priority to each finding:

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

### 10. Identify Unit Test Opportunities

For each affected area, suggest tests following that area's conventions. Read the test guidelines loaded in step 3, and match the existing test framework, mocking approach, assertion style, fixture patterns, and naming conventions already used in the repo. Do not impose a framework the repo doesn't use.

Each test suggestion must include:
1. What to test (function/component/flow)
2. Which scenarios to cover
3. A skeleton code example following the repo's conventions

### 11. Present Review Inline

Output the full review directly in chat (do NOT write a file). Use this structure:

**Header:** branch name, date, base, commit count, affected areas, context summary.

**Summary:** 2-3 sentence overall assessment + P0/P1/P2 counts table.

**P0 Critical section:** Each issue with file path + line, impact, description, and concrete code fix suggestion. If none, state "No issues found."

**P1 Important section:** Same format as P0. If none, state "No issues found."

**P2 Minor section:** Lighter format — file path + line and brief description with suggestion. If none, state "No issues found."

**Unit Test Suggestions:** What to test, scenarios, and skeleton code examples following the repo's conventions.

**Positive Observations:** Genuinely good patterns, decisions, or code quality worth acknowledging.

### 12. Offer to Apply Fixes

After presenting the review, if there are any P0 or P1 findings, use the `AskUserQuestion` tool to ask: "Want me to apply the P0/P1 fixes?"

If the user agrees:
1. Apply all P0 fixes first, then P1 fixes
2. Commit the changes using atomic commits per project conventions
3. Ask the user if they want to push

If the user declines, stop. The review is complete.

### 13. Mark PR Checklist

After the review is complete (regardless of whether fixes were applied), mark the `/deep-review completed` checkbox in the PR description:

```bash
gh pr view --json body -q '.body' | sed 's/- \[ \] \/deep-review completed/- [x] \/deep-review completed/' | gh pr edit -F -
```

If no PR exists for the current branch, skip this step.

### 14. Suggest Next Steps

After the review is complete, suggest the logical next action:

- If fixes were applied: "Run `/pr-creator` to create a PR, or `/ci-fixer` if CI checks fail after pushing."
- If no PR exists: "Run `/pr-creator` to open a PR for this branch."
- If a PR already exists: "Run `/ci-fixer` to check CI status, or `/review-responder` to handle reviewer feedback."

## Key Rules

- Read area guidelines BEFORE reviewing code
- Read ALL changed files BEFORE writing any findings
- Every P0 and P1 must include a concrete code fix suggestion
- Do NOT run linters, tests, or build commands — reference guideline rules as criteria only
- Do NOT write report files — output everything inline in chat
- Cross-area awareness: flag integration issues when changes affect consumers in other modules/packages
- Be strict but honest — acknowledge good code, don't inflate issue counts
