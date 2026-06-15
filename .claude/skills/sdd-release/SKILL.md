---
name: sdd-release
description: Release a new version of sdd-tools to Nexus — bump version, merge the PR, tag, create the GitHub release, and monitor the Publish workflow until the new version ships. Use when the user asks to "release sdd-tools", "cut a release", "publish a new version", "ship sdd-tools", or invokes /sdd-release.
user-invocable: true
---

# /sdd-release — cut and publish an sdd-tools release

## What this does

Publishing is driven by `.github/workflows/publish.yml`, which triggers on
**GitHub release `published`** and runs `npm publish` to the Nexus registry
(`https://nexus.twprod.net/repository/sdd-tools/`). So a release is: get the
version-bumped change onto `main`, tag it, create a GitHub release for that
tag, and watch the Publish workflow succeed.

Versions are `X.Y.Z` in `package.json`; tags and releases are `vX.Y.Z`.

## Preconditions (check first)

1. `gh auth status` is logged in and the remote is `trustwallet/sdd-tools`.
2. The release PR is green: `bash test/sdd-knowledge.test.sh` passes (the only
   expected failure is `mcp-no-url-fallback`, an env/VPN-gated network test —
   confirm it also fails on `main` before discounting it).
3. `package.json` `version` is **higher than the latest release**
   (`gh release list --limit 1`). If not, bump it (see step 1).

## Steps

### 1. Bump the version (if not already bumped in the PR)

```bash
LATEST=$(gh release list --limit 1 --json tagName --jq '.[0].tagName')   # e.g. v1.8.15
CURRENT=v$(node -p "require('./package.json').version")                    # e.g. v1.8.16
echo "latest released: $LATEST | package.json: $CURRENT"
```

If `package.json` still equals the latest release, bump the patch (or minor for
features) in `package.json` and commit to the PR branch. The version that ships
is whatever is on `main` at tag time — make sure it's the intended one.

### 2. Land the version bump + skill on the PR, then merge

Commit any final changes (version bump, new skills, tests) to the **same PR**,
push, and wait for required checks. Then merge:

```bash
gh pr merge <PR#> --squash --delete-branch    # match the repo's squash-merge history
```

(Use `--admin` only if you have rights and branch protection blocks an
otherwise-ready merge; never force past failing required checks.)

### 3. Pull latest main

```bash
git checkout main && git pull --ff-only origin main
NEW=v$(node -p "require('./package.json').version")
echo "releasing $NEW from $(git rev-parse --short HEAD)"
```

### 4. Tag and push

```bash
git tag "$NEW"
git push origin "$NEW"
```

### 5. Create the GitHub release (this fires Publish)

```bash
gh release create "$NEW" \
  --target main \
  --title "$NEW" \
  --generate-notes
```

`--generate-notes` autofills the changelog from merged PRs; replace with
`--notes "…"` for a hand-written summary. Creating the release with state
`published` is what triggers `publish.yml`.

### 6. Monitor the Publish workflow until it succeeds

```bash
# Wait for the run triggered by the release to appear, then watch it.
sleep 5
RUN=$(gh run list --workflow "Publish Package to Nexus" --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN" --exit-status
```

`gh run watch --exit-status` blocks until completion and returns non-zero on
failure. On failure, inspect logs:

```bash
gh run view "$RUN" --log-failed
```

### 7. Verify the new version actually published

```bash
npm view sdd-tools version --registry https://nexus.twprod.net/repository/sdd-tools/
```

It should equal the version you tagged. (Requires Nexus auth / VPN; if you
can't query Nexus locally, a green Publish run is the success signal.)

## Notes & gotchas

- **Trigger is `release: published`, not tag push.** Pushing the tag alone does
  NOT publish — you must create the GitHub release.
- **The Publish job embeds secrets at publish time** (Amplitude key, Learnings/
  Knowledge API URL + key) via `sed` placeholders in `bin/`. Those are injected
  in CI from repo secrets — never commit real values; keep the
  `__PLACEHOLDER__` tokens in source.
- **Self-hosted runner** (`[self-hosted, linux, platform-ci-v2]`) — if the run
  is stuck `queued`, a runner may be offline; that's an infra issue, not the
  release.
- **Re-publishing a version fails.** Nexus rejects an already-published version.
  If Publish failed *after* npm publish succeeded, bump the patch and re-release
  rather than retrying the same version.
- **Consumers install `sdd-tools@latest`** from Nexus (see `knowledge-sync.yml`
  templates). A successful publish makes the new version available to every
  repo's next garden run.
