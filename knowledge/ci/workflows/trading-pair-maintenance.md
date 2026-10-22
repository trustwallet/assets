---
category: ci
subcategory: workflows
confidence: low
documentType: how-to
scope: org
contentHash: 6cb29ded738b
tags: [script]
source: README.md
verified: 2026-07-22
---

## Trading pair maintenance

Info on supported trading pairs are stored in `tokenlist.json` files.
Trading pairs can be updated --
from Uniswap/Ethereum and PancakeSwap/Smartchain -- using update script (and checking in changes).
Minimal limit values for trading pair inclusion are set in the [config file](https://github.com/trustwallet/assets/blob/master/.github/assets.config.yaml).
There are also options for force-include and force-exclude in the config.

## See Also
- [overview](../../patterns/brand/overview.md) <!-- rel:strong -->
- [quick starter](../../specs/quick-starter.md) <!-- rel:strong -->
- [disclaimer](../../specs/business/disclaimer.md) <!-- rel:related -->
