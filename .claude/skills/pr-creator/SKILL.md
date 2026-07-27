---
name: pr-creator
description: Create GitHub pull requests following Trust Wallet conventions. Use when the user asks to create a PR, open a PR, or mentions ticket numbers (SC-XXXXX).
user-invocable: true
---

# PR Creator

This skill helps create GitHub pull requests that follow Trust Wallet team conventions, including proper ticket formatting and PR structure.

## When to Use

Activate this skill when:
- User asks to "create a PR" or "open a PR"
- User mentions a ticket number (SC-XXXXX)
- User wants to submit changes for review

## Instructions

### 1. Check for Existing PR

Before doing anything, check if a PR already exists for the current branch:
```bash
gh pr view --json number,url -q '.url' 2>/dev/null
```
If a PR exists, inform the user and ask if they want to update it or create a new one.

### 2. Check for Ticket

- Look for ticket reference (SC-XXXXX, case-insensitive) in the conversation, branch name, or commits
- **If no ticket found:** Ask the user:
  - Do they need to create a ticket? Link: https://app.shortcut.com/trust-wallet-1/stories/new
  - Or is this a `chore:` that doesn't require a ticket?

### 3. Check Target Branch

- **If user didn't specify target branch:** Ask which branch to target:
  - `main` (default development branch)
  - Latest release branch (look up using `git branch -r | grep 'origin/release/[0-9]' | sed 's#origin/##' | sort -V | tail -1`)

### 4. Read PR Template

**IMPORTANT:** Always read `.github/pull_request_template.md` — this is the single source of truth for PR format.

### 5. Analyze Changes

Gather the full picture of what's being submitted:
```bash
git diff {target}...HEAD --stat
git diff {target}...HEAD
git log --oneline {target}..HEAD
```

Use this to write an accurate description and test plan — don't ask the user to describe changes you can read from the diff.

### 6. PR Title Requirements

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

### 7. PR Body

Use the format from `.github/pull_request_template.md` and fill in:
- **Description:** Summarize what changed and why, based on the diff and commit history
- **Checklist:** NEVER pre-check any items — always leave them as `- [ ]`. Conditionally include items from the PR template based on the `git diff --stat` output — include a checklist item only when the diff actually touches the area that item covers (for example, a "tested" item for the affected package/module, or a platform-specific item only when that platform's files changed).
  - "Screenshots provided 📸 (required for UI changes)" — only if the PR touches UI files (use the UI file patterns defined by the repo's PR template / CI config). CI may enforce this item is checked for such PRs. **Omit this item entirely** when no UI files are changed.
- **How to test:** Step-by-step instructions derived from the actual changes
- **Screenshots:** Include the Screenshots section with the table from the template only when the PR touches UI files (same patterns as above). Omit the section entirely for non-UI PRs.
- **Tests section:** Must include the `<!-- pr-tests-start -->` and `<!-- pr-tests-end -->` markers with test descriptions between them (CI enforces this)

### 8. PR Type

Ask the user if they want to create the PR as a **draft** or as **ready for review**.

### 9. Team Label

Ask the user which existing `team/*` label to apply to the PR. For example:
- `team/devops`
- `team/core-ui`
- `team/tgrowth`
- `team/trading-surfaces`
- `team/banking-team`

These are examples only — the user may choose any appropriate existing `team/*` label. If they're unsure what team labels exist, they can run `gh label list | grep '^team/'` in the repository. Platform labels (`platform/android`, `platform/ios`, etc.) are auto-assigned by CI — do not add them manually.

### 10. Release Label

If the target branch is a release branch (`release/...`), manually add the `Release` label with `--label Release`.

### 11. Push and Create PR

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

### 12. Move Shortcut Story to "In Review"

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

## Validation Reminders

- PR titles should NOT include ticket numbers — the ticket link belongs in the PR body only
- Target branches: `main` or `release/YYYY-MM-DD` (ask user if not specified)

## Examples

### PR Titles
```
feat: add support for WalletConnect v2
fix: resolve crash on token refresh
chore: update dependency versions
```

## After PR Creation

After the PR is created:

1. **If the PR touches UI files** (matching the patterns listed in the Screenshots section above), remind the developer:

```text
⚠️  This PR modifies UI files — screenshots are required.
    Add screenshots to the PR description and check the
    "Screenshots provided 📸" item, or CI will block the PR.
```

2. Inform the user of available follow-up skills:

```text
PR created. Follow-up skills available:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- /ci-fixer          — Fix failing CI checks
- /review-responder  — Respond to reviewer comments
- /deep-review       — Run a deep code review
```

## Notes

- Always read `.github/pull_request_template.md` for the latest PR format
- Ask about ticket creation if no ticket is found
- Chores typically don't require tickets
- **Do NOT** include Claude signature or Co-Authored-By footer in PRs
