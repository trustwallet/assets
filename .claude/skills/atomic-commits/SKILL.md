---
name: atomic-commits
description: Commit staged and unstaged changes as atomic conventional commits. Use when the user asks to commit, make commits, or says /atomic-commits.
user-invocable: true
---

# Atomic Commits

Split current changes into multiple atomic conventional commits — each commit represents one logical change.

## Instructions

### 1. Gather Context

```bash
git status
git diff HEAD
git log --oneline -10
git branch --show-current
```

### 2. Analyze and Group Changes

Review all staged and unstaged changes. Group them into logical units where each unit represents a single coherent change. Examples of good atomic splits:

- Adding a new file vs modifying an existing one
- Renaming/moving vs changing logic
- Test changes vs implementation changes
- Config/build changes vs source changes
- Independent bug fixes that happen to be in the same diff

### 3. Commit Format

Use conventional commits: `type(scope): message`

**Types:** `feat`, `fix`, `refactor`, `chore`, `test`, `docs`, `style`, `perf`, `build`, `ci`

**Scope:** Module, component, or area affected (e.g., `wallet-ui`, `earn`, `swap`)

**Examples:**
```
feat(earn): add stablecoin quote integration
fix(wallet-ui): show correct icon for imported Phantom wallets
refactor(swap): extract token validation logic
test(earn): add unit tests for quote service
chore(deps): bump <dependency> version
```

### 4. Create Commits

For each logical group, stage only the relevant files and commit:

```bash
git add <specific-files>
git commit -m "type(scope): message"
```

Repeat for each group, ordered so that foundational changes come first (e.g., new files before files that import them).

### 5. Rules

- **No co-author or generated-by footers** in commit messages
- **No empty commits** — skip if nothing to commit
- **Lowercase** commit messages (no capital first letter after the colon)
- **No period** at the end of the message
- **Keep messages concise** — one line, under 72 characters
- **After all commits are created**, run `git push` so the user can approve or deny it via the tool permission prompt
