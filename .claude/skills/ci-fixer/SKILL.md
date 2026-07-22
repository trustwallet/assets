---
name: ci-fixer
description: Diagnose and fix failed CI checks on a GitHub PR. Use when the user asks to fix CI, check why CI is failing, or mentions failing checks.
user-invocable: true
---

# CI Fixer

Fetches CI check status for the current PR, reads failure logs, categorizes problems, and applies fixes.

## When to Use

Activate this skill when:
- User asks to "fix CI", "fix checks", or "fix the pipeline"
- User mentions failing CI checks or red checks
- User asks "why is CI failing?" or "what's wrong with the build?"

## Instructions

### 1. Verify PR Exists

```bash
gh pr view --json number,url,headRefName -q '.number'
```

If no PR exists for the current branch, inform the user and suggest using `/pr-creator` first. Stop here.

### 2. Fetch CI Status

Get the check status for the PR:
```bash
gh pr checks --json name,state,link,bucket,workflow
gh pr view --json statusCheckRollup --jq '.statusCheckRollup[] | {name: .name, status: .status, conclusion: .conclusion, detailsUrl: .detailsUrl}'
```

### 3. Categorize Results

Group checks into three buckets:
- **Passed** — `conclusion == "SUCCESS"`
- **Failed** — `conclusion == "FAILURE"` or `conclusion == "ACTION_REQUIRED"`
- **Pending** — `status != "COMPLETED"`

**Early exits:**
- If all checks passed, inform the user and stop
- If checks are still pending with none failed, inform the user and suggest waiting
- If there are failures, continue to step 4

### 4. Fetch Failure Logs

For each failed check, get the run ID and fetch logs:
```bash
gh run view {RUN_ID} --log-failed 2>&1 | tail -200
```

If the log output is too large, focus on the last 200 lines per job — the actionable errors are typically at the end.

### 5. Categorize Failures

Classify each failure into one of these categories based on the job name and log content:

| Category | Matching CI Jobs | Indicators |
|---|---|---|
| **Lint / Format** | The repo's lint/format job(s) | Formatting violations, style errors |
| **PR Validation** | `Validate PR Requirements` | Missing labels, test descriptions, PR body markers |
| **Review Comments** | `Review Comments Addressed` | Unresolved review threads |
| **Policy / Rules** | The repo's policy/rules check (e.g. dependency or naming rules) | Dependency rules, module naming, policy violations |
| **Test Failures** | The repo's test job(s) | `FAILED`, assertion errors, test errors |
| **Build Failures** | The repo's build job(s) | Compilation errors, unresolved symbols, type mismatches |
| **Infrastructure** | Any | Timeouts, runner errors, network failures, flaky infra |

### 6. Present Analysis

Display a summary table:

```
| # | Check Name | Category | Status | Fix Strategy |
|---|------------|----------|--------|-------------|
| 1 | lint | Lint / Format | Failed | Auto-fix with the repo's format command |
| 2 | Validate PR | PR Validation | Failed | Edit PR metadata |
| ...
```

For each failure, provide:
- **Root cause** — what exactly failed and why
- **Fix strategy** — how to fix it (auto-fix command, manual edit, rerun)
- **Confidence** — high (auto-fixable), medium (likely fixable), low (needs investigation)

### 7. Ask User Before Fixing

Use the `AskUserQuestion` tool to present the list of fixable items and ask the user which ones to fix. Group by confidence level. Always give the option to fix all, fix only high-confidence items, or pick specific ones.

### 8. Apply Fixes by Category

Apply fixes in this order (earlier fixes can unblock later ones):

#### 8a. PR Validation

Fix missing PR metadata using `gh pr edit`:
- **Missing labels:** Add the required label (ask user which `team/*` label if not already set)
- **Missing test descriptions:** Edit PR body to fill in the `<!-- pr-tests-start -->` / `<!-- pr-tests-end -->` section based on actual changes in the PR
- **Missing PR body sections:** Fill in from diff analysis

```bash
gh pr edit {PR_NUMBER} --add-label "{label}"
gh pr view --json body -q '.body' | ... | gh pr edit -F -
```

#### 8b. Review Comments

If the `Review Comments Addressed` check failed due to unresolved review threads, delegate to `/review-responder` to handle them.

#### 8c. Lint Auto-Fixes

Run the repo's configured formatter/lint-fix command for the area that failed. Discover it from the project's build config, scripts, or CI workflow definition (e.g. a `format`/`lint:fix` script or task) rather than assuming a fixed command.

After running, verify the formatter produced changes with `git diff --stat`.

#### 8d. Policy / Rules Violations

Read the policy/rules check log output to identify specific violations:
- **Dependency rule issues** — fix imports, module declarations
- **Module naming violations** — rename according to conventions
- Apply manual code edits based on the check output

#### 8e. Test Failures

For each failing test:
1. Read the test file and the source file under test
2. Understand what the test expects vs what the code does
3. Determine if the test needs updating or the source code has a bug
4. Apply the fix

Use `AskUserQuestion` if the fix is ambiguous (test is wrong vs code is wrong).

#### 8f. Build Failures

For each build error:
1. Read the error message (file, line, error type)
2. Read the relevant source file
3. Fix the compilation error (missing imports, type mismatches, unresolved symbols)

#### 8g. Infrastructure Failures

For transient infrastructure issues (timeouts, runner errors, network failures), rerun only the failed jobs:

```bash
gh run rerun {RUN_ID} --failed
```

### 9. Commit Fixes

After all fixes are applied, delegate to `/atomic-commits` to create properly scoped commits.

### 10. Push

Use `AskUserQuestion` to confirm with the user before pushing:

```bash
git push
```

After pushing, inform the user that CI will re-run and they can invoke `/ci-fixer` again if new failures appear.

### 11. Suggest Next Steps

After fixes are pushed, suggest:
- "Run `/review-responder` to check and respond to reviewer comments."
- If the `Review Comments Addressed` check was among the failures: "The review-responder skill was already suggested for this — run `/review-responder` to address unresolved threads."

## Key Rules

- Always fetch and read actual failure logs — never guess what went wrong
- Present analysis before making any changes
- Ask user confirmation before applying fixes and before pushing
- Lint formatters and validation scripts are safe to run locally
- Do NOT run full builds locally if they are slow or may need CI secrets
- For ambiguous test failures, ask the user whether the test or the code is wrong
- Infrastructure failures should be rerun, not "fixed" locally
- Delegate to existing skills (`/atomic-commits`, `/review-responder`) instead of reimplementing their logic
