---
name: review-responder
description: Review and respond to GitHub PR comments. Use when the user asks to check PR comments, answer review feedback, or resolve review threads.
user-invocable: true
---

# Review Responder

This skill fetches GitHub PR review comments, analyzes whether issues are already addressed in the current code, applies fixes, captures reusable learnings from Copilot comments into `learnings/` (committed to the same PR as the fixes), replies to each comment, and offers to resolve the threads.

## When to Use

Activate this skill when:
- User asks to "check PR comments" or "answer review comments"
- User asks to "resolve PR feedback" or "respond to reviewers"
- User wants to handle review comments on a specific PR

## Instructions

### 1. Identify the PR

Determine the PR number and repo:
- If user provides a PR number or URL, use it
- Otherwise, detect from current branch:
  ```bash
  gh pr view --json number,url,headRefName -q '.number'
  ```
- If no PR found, ask the user for the PR number

Get the repo owner and name:
```bash
gh repo view --json owner,name -q '.owner.login + "/" + .name'
```

### 2. Fetch Review Comments

Get the current authenticated user and PR author:
```bash
gh api user -q .login
gh pr view {PR_NUMBER} --json author -q '.author.login'
```

Fetch all review comments on the PR:
```bash
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/comments --paginate \
  --jq '.[] | {id: .id, node_id: .node_id, path: .path, line: .line, body: (.body[:1000]), user: .user.login, in_reply_to_id: .in_reply_to_id, created_at: .created_at, diff_hunk: (.diff_hunk[-300:])}'
```

**Filter comments from the fetched results:**
- Skip comments that are replies (have `in_reply_to_id`) — these are already part of a thread
- Skip comments authored by the current user (already responded)
- Focus on top-level comments that haven't been replied to by the PR author
- Build a map: for each top-level comment ID, check if any reply exists from the PR author. Skip those.

### 3. Analyze Each Comment

For each unanswered comment (note: the REST API does not expose thread resolution state — filtering is based on reply presence, not resolution status):

1. **Read the referenced file** at the mentioned path and line to understand current state. Note: PR comment `line` values refer to diff context and may be `null` or outdated after force-pushes. Also use `diff_hunk` from the comment payload to locate the relevant code when `line` is unreliable.
2. **Compare** the comment's concern against the current code:
   - Is the issue already fixed in a subsequent commit?
   - Does the code need changes?
   - Is the comment a misunderstanding or already handled by design?
3. **Categorize** the response:
   - **Already Fixed**: The issue was addressed in a previous commit.
   - **Will Fix**: The issue is valid and needs a code change.
   - **By Design**: The current behavior is intentional.
   - **Acknowledged**: The suggestion is noted but out of scope.

### 4. Apply Fixes

If any comments require code changes ("Will Fix"):
1. Make all the necessary fixes
2. Verify the build/tests if the project has a build-verification procedure.

Do **not** commit or push yet — Step 5 captures learnings so they land in the same commit push.

### 5. Capture Learnings from Copilot Comments

Once **all** Copilot comments on the PR have been addressed (fixed, or dispositioned as By Design / Acknowledged), record any learnings they surfaced and commit them to the **same PR** as the fixes. This step is mandatory, not optional, and applies to Copilot-authored comments specifically (login matches the Copilot reviewer bot, e.g. `Copilot` / `copilot-pull-request-reviewer[bot]` / `github-copilot[bot]`). Human-reviewer comments are out of scope for learning capture here.

**Do not ask the user which learnings to capture** — write every candidate that clears the bar. If the repo's `CLAUDE.md` has a `## Learnings` section or a `learnings/_capture-protocol.md`, follow that repo's conventions; otherwise use the defaults below.

1. **Decide what clears the bar.** For each addressed Copilot comment, ask: *would a future agent save real time by reading this before touching the same surface?*
   - **Capture** when the comment exposed a non-obvious defect, a root-cause mechanism, a cross-cutting pitfall (concurrency, state, lifecycle, crash, i18n, feature-flag gating), or a repo convention that isn't obvious from the code.
   - **Skip** pure style nits, one-off typos, or anything whose lesson is just "read the diff." When in doubt on a borderline correctness finding, capture it.
   - It's normal for a PR to yield **zero** learnings. If nothing clears the bar, say so in the summary and move on — do not manufacture a learning.

2. **Locate the learnings directory.** Use the repo's existing `learnings/` if present; if it doesn't exist yet, bootstrap it (`mkdir -p learnings`). Consult existing entries first so you extend rather than duplicate:
   ```bash
   grep -ril "<keyword>" learnings/ 2>/dev/null
   ```
   If a matching entry exists, **edit that file** instead of creating a new one.

3. **Write each new learning** as `learnings/<slug>.md`, or `learnings/<topic>/<slug>.md` if the repo already organizes learnings into topic subfolders (match the existing layout — flat or nested). Use the standard frontmatter shape:
   ```yaml
   ---
   title: <imperative one-line rule>
   date: <today, YYYY-MM-DD>
   pr: <this PR number>
   area: <surface / subsystem>
   files:
     - <source file the comment touched>
   symptom: <the observable problem the Copilot comment flagged>
   tags: [<keyword>, <keyword>]
   summary: <one-line hook used by the generated index>
   ---
   ```
   Then a body covering: the **symptom**, the **root cause** (the actual mechanism, not just "the bug"), why prior fixes weren't enough if applicable, the **rule going forward**, and any **regression guards** added. Base each on the concrete Copilot comment + the fix you applied.

4. **Regenerate the learnings index** if the repo uses one (never hand-edit `learnings/index.md`):
   ```bash
   sdd-knowledge --learnings-index
   ```
   If `sdd-knowledge` isn't installed, skip regeneration — commit only the new learning file(s) and note in the summary that the index needs a `sdd-knowledge --learnings-index` pass (the lightweight path; `--garden` also rebuilds it but does much more).

### 6. Commit and Push

Commit the fixes and the captured learnings, then push to the PR branch:
1. Commit the code changes and the learning file(s) — use atomic commits per project conventions (a separate `docs(learnings): …` commit for the learning files alongside the fix commit is fine, as long as both land in this PR's push).
2. Include the regenerated `learnings/index.md` in the same commit as the new learning file(s) **only if the repo actually tracks it** — many repos (including this one) gitignore `learnings/index.md` as a generated artifact. Check first (`git check-ignore learnings/index.md` / `git ls-files learnings/index.md`) and never force-add an ignored index.
3. Push to the PR branch (confirm with the user before pushing).

This ensures the learnings ship **in the same PR as the fixes**, and that replies can reference actual committed changes.

### 7. Reply to Comments

After fixes are pushed (if any), reply to each comment using the GitHub API:
```bash
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/comments \
  -f body="Reply text here" \
  -F in_reply_to={COMMENT_ID}
```

**Reply guidelines:**
- Be concise and direct
- Reference specific code or commits when explaining fixes
- Use backtick formatting for code references
- Don't be defensive — acknowledge valid points
- For "Already Fixed" / "Will Fix" replies, mention what changed (e.g., "Fixed — added `X` to `Y`")
- For "By Design" replies, explain the reasoning clearly

### 8. Resolve Threads

After all comments are replied to, use the `AskUserQuestion` tool to ask if the user wants to resolve the answered threads. If they agree, use the GraphQL API:

First, get the thread node IDs (map each thread's first comment `databaseId` to the thread `id`). Inline all values directly in the query to avoid shell `$` variable interpolation issues. Paginate with `after:` cursor if `hasNextPage` is true (omit `after:` on the first request, then pass the `endCursor` value on subsequent requests):
```bash
gh api graphql -f query='query { repository(owner: "{owner}", name: "{repo}") { pullRequest(number: {PR_NUMBER}) { reviewThreads(first: 100, after: "{CURSOR}") { nodes { id isResolved comments(first: 1) { nodes { databaseId } } } pageInfo { hasNextPage endCursor } } } } }' --jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved == false) | {id: .id, commentId: .comments.nodes[0].databaseId}'
```

Then resolve each thread (inline the thread ID to avoid shell escaping issues with GraphQL variables):
```bash
gh api graphql -f query='
  mutation {
    resolveReviewThread(input: {threadId: "{THREAD_NODE_ID}"}) {
      thread { isResolved }
    }
  }
'
```

**Only resolve threads where:**
- The user confirmed they want to resolve
- The issue is confirmed fixed in the current code
- You have replied explaining the fix

**Do NOT resolve threads where:**
- The user declined to resolve
- The comment raises a valid concern that needs further discussion
- The fix hasn't been verified
- The reviewer is blocking the PR or you're unsure — default to leaving unresolved and letting the reviewer close it

### 9. Report Summary

After processing all comments, provide a summary table:

| # | File | Reviewer | Status | Action | Learning |
|---|------|----------|--------|--------|----------|
| 1 | `path/file.ts` | @reviewer | Fixed | Replied | — |
| 2 | `path/other.ts` | @reviewer | By Design | Replied | — |
| 3 | `path/new.ts` | Copilot | Will Fix | Fixed + Replied | `learnings/<slug>.md` |

Include counts:
- Total comments processed
- Already fixed
- Fixed now
- By design / acknowledged
- Threads resolved (if applicable)
- **Learnings captured** (list the new/edited `learnings/**/*.md` files, or state "none cleared the bar")

### 10. Mark PR Checklist

After all comments are processed and replied to, mark the `Review comments resolved (/review-responder)` checkbox in the PR description:

```bash
gh pr view --json body -q '.body' | sed 's/- \[ \] Review comments resolved (\/review-responder)/- [x] Review comments resolved (\/review-responder)/' | gh pr edit -F -
```

If no PR exists for the current branch, skip this step.

### 11. Retrigger Failed Checks

After replying to all comments, retrigger failed CI checks so they pick up the new state:

```bash
gh pr checks {PR_NUMBER} --json name,status,workflow --jq '.[] | select(.status == "FAILURE") | .workflow' | sort -u | while read workflow; do
  run_id=$(gh run list --workflow "$workflow" --branch "$(gh pr view {PR_NUMBER} --json headRefName -q '.headRefName')" --limit 1 --json databaseId -q '.[0].databaseId')
  if [ -n "$run_id" ]; then
    gh run rerun "$run_id" --failed
  fi
done
```

If no checks are failing, skip this step.

### 12. Suggest Next Steps

After all comments are processed:
- If CI checks were retriggered: "Run `/ci-fixer` if any checks fail again after the retrigger."
- Otherwise: "All review comments addressed. The PR is ready for re-review."

## Important Notes

- **Always read the referenced code** before replying — never reply based on the comment alone
- **Check git log** to see if the issue was fixed in a subsequent commit
- **Batch replies** — make all API calls efficiently, in parallel where possible
- **Respect rate limits** — GitHub API has rate limits; batch requests responsibly
- **Capture learnings from Copilot comments** — once all Copilot comments are addressed, record every learning that clears the bar and commit it to the **same PR** as the fixes (Step 5). Never ask which to capture; never hand-edit `learnings/index.md`.

## Example Workflow

```
User: "check and respond to PR comments"

1. Detect PR from current branch
2. Fetch 11 review comments (3 from Copilot)
3. Filter: 11 top-level, 0 already replied by author
4. Analyze each comment against current code
5. Apply fixes (no commit yet)
6. Capture learnings from the addressed Copilot comments:
   - 1 non-obvious root-cause finding → learnings/<slug>.md
   - regenerate learnings/index.md (if the repo uses one)
7. Commit fixes + learnings, push (same PR)
8. Reply to all comments
9. Report summary (incl. learnings captured)
10. Ask user: "Want to resolve the answered threads?"
    - Yes → resolve all replied threads
    - No → leave them for reviewers
```
