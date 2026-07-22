---
category: ci
subcategory: workflows
confidence: medium
documentType: how-to
scope: org
contentHash: 8969cdf3631e
tags: [make , run ]
source: README.md
verified: 2026-07-22
---

## On Checks

This repo contains a set of scripts for verification of all the information. Implemented as Golang scripts, available through `make check`, and executed in CI build; checks the whole repo.
There are similar check logic implemented:

- in assets-management app; for checking changed token files in PRs, or when creating a PR.  Checks diffs, can be run from browser environment.
- in merge-fee-bot, which runs as a GitHub app shows result in PR comment. Executes in a non-browser environment.

## See Also
- [overview](../../patterns/brand/overview.md) <!-- rel:strong -->
- [disclaimer](../../specs/business/disclaimer.md) <!-- rel:related -->
- [patterns validated approaches](../../patterns/patterns-validated-approaches.md) <!-- rel:weak -->
- [anti patterns failed approaches](../../code-conventions/code-style/anti-patterns-failed-approaches.md) <!-- rel:weak -->
- [quick starter](../../specs/quick-starter.md) <!-- rel:weak -->
