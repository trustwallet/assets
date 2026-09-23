---
category: architecture
subcategory: data
confidence: low
documentType: explanation
scope: repo
contentHash: 50dce908d6d6
tags: [architecture, service]
source: architecture/data/models.md
verified: 2026-07-22
splitPartIndex: 2
splitPartTotal: 3
canonical: false
synthetic: split-part
---

## Data Models & Schemas (Part 2)

| Field | Type | Optional |
|-------|------|----------|
| `Token0` | `string` | no |
| `Token1` | `string` | no |

## Link

_struct · `internal/info/model.go`:43_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `*string` | no |
| `URL` | `*string` | no |

## RootFolder

_struct · `internal/config/validators.go`:3_

| Field | Type | Optional |
|-------|------|----------|
| `AllowedFiles` | `[]string` | no |
| `SkipFiles` | `[]string` | no |
| `SkipDirs` | `[]string` | no |

## Service

_struct · `internal/processor/service.go`:9_

| Field | Type | Optional |
|-------|------|----------|
| `fileService` | `*file.Service` | no |
| `assetsManager` | `assetsmanager.Client` | no |

## Service

_struct · `internal/report/service.go`:5_

| Field | Type | Optional |
|-------|------|----------|
| `errors` | `int` | no |
| `totalFiles` | `int` | no |

## Service

_struct · `internal/service/service.go`:12_

| Field | Type | Optional |
|-------|------|----------|
| `fileService` | `*file.Service` | no |
| `processorService` | `*processor.Service` | no |
| `reportService` | `*report.Service` | no |
| `paths` | `[]string` | no |

## Tag

_struct · `internal/config/validators.go`:33_

| Field | Type | Optional |
|-------|------|----------|
| `ID` | `string` | no |
| `Name` | `string` | no |
| `Description` | `string` | no |

## TokenInfo

_struct · `internal/info/external/external.go`:18_

| Field | Type | Optional |
|-------|------|----------|
| `Symbol` | `string` | no |
| `Decimals` | `int` | no |
| `HoldersCount` | `int` | no |

## TokenInfo

_struct · `internal/processor/model.go`:45_

| Field | Type | Optional |
|-------|------|----------|
| `ID` | `string` | no |
| `Symbol` | `string` | no |
| `Name` | `string` | no |
| `Decimals` | `string` | no |

## TokenInfoERC20

_struct · `internal/info/external/erc20.go`:12_

| Field | Type | Optional |
|-------|------|----------|
| `Decimals` | `string` | no |
| `HoldersCount` | `int` | no |

## TokenInfoSPL

_struct · `internal/info/external/spl.go`:11_

| Field | Type | Optional |
|-------|------|----------|
| `Data` | `[]Data` | no |
| `HoldersCount` | `int` | no |

## TradingPair

_struct · `internal/processor/model.go`:36_

| Field | Type | Optional |
|-------|------|----------|
| `ID` | `string` | no |
| `ReserveUSD` | `string` | no |
| `VolumeUSD` | `string` | no |
| `TxCount` | `string` | no |
| `Token0` | `*TokenInfo` | no |
| `Token1` | `*TokenInfo` | no |

## TradingPairs

_struct · `internal/processor/model.go`:30_

| Field | Type | Optional |
|-------|------|----------|
| `Data` | `struct { Pairs []TradingPair `json:"pairs"` }` | no |

## TRC10TokensResponse

_struct · `internal/info/external/trc10.go`:12_

| Field | Type | Optional |
|-------|------|----------|
| `Data` | `[]struct { Symbol string `json:"abbr"` Decimals int `json:"precision"` HoldersCount int `json:"nrOfTokenHolders"` }` | no |

## TRC20TokensResponse

_struct · `internal/info/external/trc20.go`:12_

| Field | Type | Optional |
|-------|------|----------|
| `TRC20Tokens` | `[]struct { Symbol string `json:"symbol"` Decimals int `json:"decimals"` HoldersCount int `json:"holders_count"` }` | no |

## Updater

_struct · `internal/processor/model.go`:18_

| Field | Type | Optional |
|-------|------|----------|
| `Name` | `string` | no |
| `Run` | `func() error` | no |
