---
category: architecture
subcategory: data
confidence: low
documentType: explanation
scope: repo
contentHash: b2d5633c11a8
tags: [architecture]
source: architecture/data/models.md
verified: 2026-07-22
splitPartIndex: 3
splitPartTotal: 3
canonical: false
synthetic: split-part
---

## Data Models & Schemas (Part 3)

_struct · `internal/config/config.go`:30_

| Field | Type | Optional |
|-------|------|----------|
| `AssetsApp` | `string` | no |
| `Logo` | `string` | no |

## Validator

_struct · `internal/processor/model.go`:8_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `string` | no |
| `Run` | `func(f *file.AssetFile) error` | no |

## ValidatorsSettings

_struct · `internal/config/config.go`:35_

| Field | Type | Optional |
|-------|------|----------|
| `RootFolder` | `RootFolder` | no |
| `ChainFolder` | `ChainFolder` | no |
| `AssetFolder` | `AssetFolder` | no |
| `ChainInfoFolder` | `ChainInfoFolder` | no |
| `ChainValidatorsAssetFolder` | `ChainValidatorsAssetFolder` | no |
| `DappsFolder` | `DappsFolder` | no |

## See Also
- [config system](../../libs/config-system.md) <!-- rel:strong -->
- [config](../../libs/config.md) <!-- rel:strong -->
- [processor](../../features/processor.md) <!-- rel:related -->
- [validator fixer updater](../../patterns/validator-fixer-updater.md) <!-- rel:related -->
- [info](../../features/info.md) <!-- rel:related -->
