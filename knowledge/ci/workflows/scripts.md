---
category: ci
subcategory: workflows
confidence: high
documentType: how-to
scope: org
contentHash: 00efba286e64
tags: [make , run ]
source: README.md
verified: 2026-07-22
---

## Scripts

There are several scripts available for maintainers:

- `make check` -- Execute validation checks; also used in continuous integration.
- `make fix` -- Perform automatic fixes where possible
- `make update-auto` -- Run automatic updates from external sources, executed regularly (GitHub action)
- `make add-token asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Create `info.json` file as asset template.
- `make add-tokenlist asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist.json.
- `make add-tokenlist-extended asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist-extended.json.

## See Also
- [overview](../../patterns/brand/overview.md) <!-- rel:strong -->
- [disclaimer](../../specs/business/disclaimer.md) <!-- rel:strong -->
- [quick starter](../../specs/quick-starter.md) <!-- rel:related -->
