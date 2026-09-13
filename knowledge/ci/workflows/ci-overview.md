---
title: CI Workflows
category: ci
tags: [ci, github-actions, check, s3, codeql, validation]
confidence: high
source: .github/workflows/
updated: 2026-07-22
---

# CI Workflows

## check.yml

Runs on every push and PR. Executes `make check` which builds the Go binary and runs all asset validators against the full `blockchains/` tree. This is the primary quality gate — PRs adding or modifying token files must pass it. Implemented check logic also runs in the assets-management web app and merge-fee-bot (duplicate coverage for faster feedback).

## upload-s3.yml

Uploads the asset files to S3 on merge to master. Backs the CDN at `https://assets-cdn.trustwallet.com`.

## codeql.yml

GitHub CodeQL security scan on the Go source.

## Parallel validation environments

Three separate systems run asset validation:
1. **This repo's CI** (`make check`) — full scan, runs on GitHub Actions
2. **assets-management web app** — checks changed token files in PRs, runs in browser
3. **merge-fee-bot** — GitHub app that posts validation results as a PR comment, runs in non-browser environment

This redundancy is intentional: each environment has different access and runtime constraints.

## See Also
- [ci/workflows/on-checks.md](on-checks.md)
- [ci/workflows/scripts.md](scripts.md)
- [testing strategy](../../tests/testing-strategy.md) <!-- rel:strong -->
- [repo overview](../../architecture/repo-overview.md) <!-- rel:strong -->
- [go conventions](../../code-conventions/go-conventions.md) <!-- rel:related -->
