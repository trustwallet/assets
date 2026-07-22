# Data Models & Schemas

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

## URLs

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

