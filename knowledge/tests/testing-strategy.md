---
title: Tests Strategy
category: tests
tags: [tests, go, validation, make-check, ci]
confidence: high
source: Makefile, .github/workflows/check.yml, internal/
updated: 2026-07-22
---

# Tests Strategy

## Unit tests

Located alongside the source in `internal/`. Run with `make test` (or `go test -race -cover ./...`). Covers the Go validation logic and config parsing.

## Integration / full-repo check

`make check` builds the binary and runs it against the full `blockchains/` file tree. This is the real correctness gate — it exercises all validators against actual token data.

## CI gate

Every PR runs `make check` in `check.yml`. A failing check blocks merge.

## Note on test coverage

The unit tests cover the Go validation rules, but the most important coverage is the `make check` integration scan: it applies all validators to real files and catches structural problems (missing logos, bad JSON, invalid field values) that unit tests can't replicate.

## See Also
- [ci/workflows/ci-overview.md](../ci/workflows/ci-overview.md)
- [repo overview](../architecture/repo-overview.md) <!-- rel:strong -->
- [go conventions](../code-conventions/go-conventions.md) <!-- rel:related -->
- [on checks](../ci/workflows/on-checks.md) <!-- rel:related -->
- [add token](../guides/add-token.md) <!-- rel:related -->
