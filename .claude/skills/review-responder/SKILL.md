---
name: review-responder
description: Review and respond to GitHub PR comments. Use when the user asks to check PR comments, answer review feedback, or resolve review threads.
user-invocable: true
---

# Review Responder

This skill fetches GitHub PR review comments, analyzes whether issues are already addressed in the current code, replies to each comment, and offers to resolve the threads.

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

### 4. Apply Fixes, Commit, and Push

If any comments require code changes ("Will Fix"):
1. Make all the necessary fixes
2. Commit the changes (use atomic commits per the project conventions)
3. Push to the PR branch (confirm with the user before pushing)

This ensures replies can reference actual committed changes.

### 5. Reply to Comments

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

### 6. Resolve Threads

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

### 7. Report Summary

After processing all comments, provide a summary table:

| # | File | Reviewer | Status | Action |
|---|------|----------|--------|--------|
| 1 | `path/file.swift` | @reviewer | Fixed | Replied |
| 2 | `path/other.swift` | @reviewer | By Design | Replied |
| 3 | `path/new.swift` | @reviewer | Will Fix | Fixed + Replied |

Include counts:
- Total comments processed
- Already fixed
- Fixed now
- By design / acknowledged
- Threads resolved (if applicable)

### 8. Mark PR Checklist

After all comments are processed and replied to, mark the `Review comments resolved (/review-responder)` checkbox in the PR description:

```bash
gh pr view --json body -q '.body' | sed 's/- \[ \] Review comments resolved (\/review-responder)/- [x] Review comments resolved (\/review-responder)/' | gh pr edit -F -
```

If no PR exists for the current branch, skip this step.

### 9. Retrigger Failed Checks

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

### 10. Suggest Next Steps

After all comments are processed:
- If CI checks were retriggered: "Run `/ci-fixer` if any checks fail again after the retrigger."
- Otherwise: "All review comments addressed. The PR is ready for re-review."

## Important Notes

- **Always read the referenced code** before replying — never reply based on the comment alone
- **Check git log** to see if the issue was fixed in a subsequent commit
- **Batch replies** — make all API calls efficiently, in parallel where possible
- **Respect rate limits** — GitHub API has rate limits; batch requests responsibly

## Example Workflow

```
User: "check and respond to PR comments"

1. Detect PR from current branch
2. Fetch 11 review comments
3. Filter: 11 top-level, 0 already replied by author
4. Analyze each comment against current code
5. Apply fixes, commit, and push
6. Reply to all comments
7. Report summary
8. Ask user: "Want to resolve the answered threads?"
   - Yes → resolve all replied threads
   - No → leave them for reviewers
```
