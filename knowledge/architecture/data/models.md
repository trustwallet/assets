---
category: architecture
subcategory: data
confidence: low
documentType: explanation
scope: repo
contentHash: 13e9d8b37bf8
tags: [architecture, domain]
source: architecture/data/models.md
verified: 2026-07-22
splitPartIndex: 1
splitPartTotal: 3
canonical: true
---

## Data Models & Schemas
<!-- sdd-knowledge-generated -->

> Field-level shape of data models extracted via tree-sitter: TS interfaces / type aliases, Zod `z.object` schemas, Go/Rust/Swift structs, Kotlin data classes, and Python dataclasses. Scoped to domain data — UI views/props, view-models, design tokens (theme/style/colors), and constant/identifier namespaces are excluded. Deterministic, no LLM.

## App

_struct · `internal/config/config.go`:18_

| Field | Type | Optional |
|-------|------|----------|
| `LogLevel` | `string` | no |

## AssetFolder

_struct · `internal/config/validators.go`:13_

| Field | Type | Optional |
|-------|------|----------|
| `AllowedFiles` | `[]string` | no |

## AssetModel

_struct · `internal/info/model.go`:18_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `*string` | no |
| `Symbol` | `*string` | no |
| `Type` | `*string` | no |
| `Decimals` | `*int` | no |
| `Description` | `*string` | no |
| `Website` | `*string` | no |
| `Explorer` | `*string` | no |
| `Research` | `string` | no |
| `Status` | `*string` | no |
| `ID` | `*string` | no |
| `Links` | `[]Link` | no |
| `ShortDesc` | `*string` | no |
| `Audit` | `*string` | no |
| `AuditReport` | `*string` | no |
| `Tags` | `[]string` | no |
| `Code` | `*string` | no |
| `Ticker` | `*string` | no |
| `ExplorerEth` | `*string` | no |
| `Address` | `*string` | no |
| `X` | `*string` | no |
| `CoinMarketcap` | `*string` | no |
| `DataSource` | `*string` | no |

## ChainFolder

_struct · `internal/config/validators.go`:9_

| Field | Type | Optional |
|-------|------|----------|
| `AllowedFiles` | `[]string` | no |

## ChainInfoFolder

_struct · `internal/config/validators.go`:17_

| Field | Type | Optional |
|-------|------|----------|
| `HasFiles` | `[]string` | no |

## ChainValidatorsAssetFolder

_struct · `internal/config/validators.go`:21_

| Field | Type | Optional |
|-------|------|----------|
| `HasFiles` | `[]string` | no |

## ClientURLs

_struct · `internal/config/config.go`:22_

| Field | Type | Optional |
|-------|------|----------|
| `Binance` | `struct { Dex string `mapstructure:"dex"` Explorer string `mapstructure:"explorer"` }` | no |
| `AssetsManagerAPI` | `string` | no |

## CoinInfoFile

_struct · `internal/config/validators.go`:29_

| Field | Type | Optional |
|-------|------|----------|
| `Tags` | `[]Tag` | no |

## CoinModel

_struct · `internal/info/model.go`:4_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `*string` | no |
| `Website` | `*string` | no |
| `Description` | `*string` | no |
| `Explorer` | `*string` | no |
| `Research` | `string` | no |
| `Symbol` | `*string` | no |
| `Type` | `*string` | no |
| `Decimals` | `*int` | no |
| `Status` | `*string` | no |
| `Tags` | `[]string` | no |
| `Links` | `[]Link` | no |

## Config

_struct · `internal/config/config.go`:10_

| Field | Type | Optional |
|-------|------|----------|
| `App` | `App` | no |
| `ClientURLs` | `ClientURLs` | no |
| `URLs` | `URLs` | no |
| `TimeFormat` | `string` | no |
| `ValidatorsSettings` | `ValidatorsSettings` | no |

## DappsFolder

_struct · `internal/config/validators.go`:25_

| Field | Type | Optional |
|-------|------|----------|
| `Ext` | `string` | no |

## Data

_struct · `internal/info/external/spl.go`:16_

| Field | Type | Optional |
|-------|------|----------|
| `Decimals` | `int` | no |

## Fixer

_struct · `internal/processor/model.go`:13_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `string` | no |
| `Run` | `func(f *file.AssetFile) error` | no |

## ForceListPair

_struct · `internal/processor/model.go`:25_
