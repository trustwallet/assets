# Call Graph

<!-- sdd-knowledge-generated -->

> Deterministic call graph extracted via tree-sitter (no LLM). Direct calls are resolved by lexical scope + imports; **dynamic dispatch and ambiguous name matches are withheld** rather than guessed. The `## Calls` table is `EXTRACTED` (a single resolved target). Member calls (`obj.method()`) whose method name resolves to exactly one definition repo-wide are recovered separately under `## Inferred calls` (`INFERRED` — receiver type unverified, but a single plausible target).

## Calls

| Caller | Callee | Example args | Sites |
|--------|--------|--------------|-------|
| `ValidateAsset` | `ValidateAssetDecimalsAccordingType(assetType: string, decimals: int): error` | `(…, …)` | 1 |
| `ValidateAsset` | `ValidateAssetID(id: string): error` | `(…, addr)` | 1 |
| `ValidateAsset` | `ValidateAssetRequiredKeys(a: AssetModel): error` | `(a)` | 1 |
| `ValidateAsset` | `ValidateDecimals(decimals: int): error` | `(…)` | 1 |
| `ValidateAsset` | `ValidateDescription(description: string): error` | `(…)` | 1 |
| `ValidateAsset` | `ValidateDescriptionWebsite(description: string): error` | `(…, …)` | 1 |
| `ValidateAsset` | `ValidateLinks(links: []Link): error` | `(a.Links)` | 1 |
| `ValidateAsset` | `ValidateStatus(status: string): error` | `(…)` | 1 |
| `ValidateCoin` | `ValidateCoinRequiredKeys(c: CoinModel): error` | `(c)` | 1 |
| `ValidateCoin` | `ValidateCoinType(assetType: string): error` | `(…)` | 1 |
| `ValidateCoin` | `ValidateDecimals(decimals: int): error` | `(…)` | 1 |
| `ValidateCoin` | `ValidateDescription(description: string): error` | `(…)` | 1 |
| `ValidateCoin` | `ValidateDescriptionWebsite(description: string): error` | `(…, …)` | 1 |
| `ValidateCoin` | `ValidateLinks(links: []Link): error` | `(c.Links)` | 1 |
| `ValidateCoin` | `ValidateStatus(status: string): error` | `(…)` | 1 |
| `ValidateCoin` | `ValidateTags(tags: []string): error` | `(c.Tags, allowedTags)` | 1 |
| `GetTokenInfo` | `GetTokenInfoForERC20(tokenID: string): (*TokenInfo, error)` | `(tokenID)` | 1 |
| `GetTokenInfo` | `GetTokenInfoByScraping(url: string): (*TokenInfo, error)` | `(…)` | 4 |
| `GetTokenInfo` | `GetTokenInfoForSPL(tokenID: string): (*TokenInfo, error)` | `(tokenID)` | 1 |
| `GetTokenInfo` | `GetTokenInfoForTRC10(tokenID: string): (*TokenInfo, error)` | `(tokenID)` | 1 |
| `GetTokenInfo` | `GetTokenInfoForTRC20(tokenID: string): (*TokenInfo, error)` | `(tokenID)` | 1 |
| `ValidateAssetRequiredKeys` | `isEmpty(field: string): bool` | `(…)` | 7 |
| `ValidateCoinRequiredKeys` | `isEmpty(field: string): bool` | `(…)` | 7 |
| `ValidateExplorer` | `explorerURLAlternatives(chain: string): []string` | `(chain.Handle, name)` | 1 |
| `ValidateLinks` | `linkNameAllowed(str: string): bool` | `(…)` | 1 |
| `ValidateLinks` | `supportedLinkNames(): []string` | `()` | 1 |
| `AddTokenToTokenListJSON` | `getAssetInfo(chain: coin.Coin, tokenID: string): (*info.AssetModel, error)` | `(chain, tokenID)` | 1 |
| `AddTokenToTokenListJSON` | `setup()` | `()` | 1 |
| `handleAddTokenList` | `AddTokenToTokenListJSON(chain: coin.Coin, assetID: string, tokenListType: path.TokenListType): error` | `(chain, …, tokenID, tokenlistType)` | 1 |
| `InitAssetsService` | `filter(ss: []T, test: func(T) bool): (ret []T)` | `(paths, func(path string) bool { for _, dir :=)` | 1 |
| `InitAssetsService` | `setup()` | `()` | 1 |
| `FixLogo` | `calculateTargetDimension(width: int): (targetW, targetH int)` | `(width, height)` | 1 |
| `ValidateTokenListExtendedFile` | `validateTokenList(path1: string, chain1: coin.Coin): error` | `(tokenListPathExtended, tokenListPath, …)` | 1 |
| `ValidateTokenListFile` | `validateTokenList(path1: string, chain1: coin.Coin): error` | `(tokenListPath, tokenListExtendedPath, …)` | 1 |
| `ValidateValidatorsListFile` | `isStackingChain(c: coin.Coin): bool` | `(…)` | 1 |
| `handleError` | `UnwrapComposite(err: error): []error` | `(err)` | 1 |

## Callers (reverse)

| Symbol | Called by |
|--------|-----------|
| `AddTokenToTokenListJSON` | `handleAddTokenList` |
| `calculateTargetDimension` | `FixLogo` |
| `explorerURLAlternatives` | `ValidateExplorer` |
| `filter` | `InitAssetsService` |
| `getAssetInfo` | `AddTokenToTokenListJSON` |
| `GetTokenInfoByScraping` | `GetTokenInfo` |
| `GetTokenInfoForERC20` | `GetTokenInfo` |
| `GetTokenInfoForSPL` | `GetTokenInfo` |
| `GetTokenInfoForTRC10` | `GetTokenInfo` |
| `GetTokenInfoForTRC20` | `GetTokenInfo` |
| `isEmpty` | `ValidateAssetRequiredKeys`, `ValidateCoinRequiredKeys` |
| `isStackingChain` | `ValidateValidatorsListFile` |
| `linkNameAllowed` | `ValidateLinks` |
| `setup` | `AddTokenToTokenListJSON`, `InitAssetsService` |
| `supportedLinkNames` | `ValidateLinks` |
| `UnwrapComposite` | `handleError` |
| `ValidateAssetDecimalsAccordingType` | `ValidateAsset` |
| `ValidateAssetID` | `ValidateAsset` |
| `ValidateAssetRequiredKeys` | `ValidateAsset` |
| `ValidateCoinRequiredKeys` | `ValidateCoin` |
| `ValidateCoinType` | `ValidateCoin` |
| `ValidateDecimals` | `ValidateAsset`, `ValidateCoin` |
| `ValidateDescription` | `ValidateAsset`, `ValidateCoin` |
| `ValidateDescriptionWebsite` | `ValidateAsset`, `ValidateCoin` |
| `ValidateLinks` | `ValidateAsset`, `ValidateCoin` |
| `ValidateStatus` | `ValidateAsset`, `ValidateCoin` |
| `ValidateTags` | `ValidateCoin` |
| `validateTokenList` | `ValidateTokenListExtendedFile`, `ValidateTokenListFile` |

## Inferred calls (member, unique name)

> `INFERRED` (confidence 0.9): `obj.method()` where `method` resolves to exactly one definition repo-wide. Receiver type is not resolved; common method names (init/update/onCreate) remain withheld as ambiguous. Use SCIP (`--scip`) for type-resolved member calls at full certainty.

| Caller | Callee | Example args | Sites |
|--------|--------|--------------|-------|
| `main` | `Execute()` | `()` | 1 |
| `main` | `InitCommands()` | `()` | 1 |
| `setup` | `SetConfig(confPath: string): error` | `(configPath)` | 1 |
| `ValidateAssetFolder` | `GetStatus(): string` | `()` | 1 |
| `ValidateAssetInfoFile` | `ValidateAsset(a: AssetModel, chain: coin.Coin, addr: string): error` | `(assetInfo, …, …)` | 1 |
| `ValidateChainInfoFile` | `ValidateCoin(c: CoinModel, allowedTags: []string): error` | `(coinInfo, tags)` | 1 |
| `Check` | `GetValidator(f: *file.AssetFile): []Validator` | `(f)` | 1 |
| `Check` | `handleError(err: error, info: *file.AssetFile, valName: string)` | `(err, f, validator.Name)` | 1 |
| `Fix` | `GetFixers(f: *file.AssetFile): []Fixer` | `(f)` | 1 |
| `Fix` | `handleError(err: error, info: *file.AssetFile, valName: string)` | `(err, f, fixer.Name)` | 1 |
| `handleError` | `IncErrors()` | `()` | 1 |
| `RunJob` | `GetReport(): string` | `()` | 1 |
| `RunJob` | `IncTotalFiles()` | `()` | 1 |
| `RunJob` | `IsFailed(): bool` | `()` | 1 |
| `RunUpdateAuto` | `GetUpdatersAuto(): []Updater` | `()` | 1 |
| `RunUpdateAuto` | `runUpdaters(updaters: []processor.Updater)` | `(updaters)` | 1 |

## Graph analytics

- Call edges: **36** across **107** symbols
- Reachable from entry points (exported symbols + routes): **103**
- Dependency cycles: **0**
- Cross-domain bridges: **0**
- Dead-code candidates (non-exported, zero callers, unreachable): **4**

### Most-coupled symbols (god-node ranking)

| Symbol | Fan-in | Fan-out | Degree |
|--------|--------|---------|--------|
| `ValidateAsset` | 0 | 8 | 8 |
| `ValidateCoin` | 0 | 8 | 8 |
| `GetTokenInfo` | 0 | 5 | 5 |
| `ValidateLinks` | 2 | 2 | 4 |
| `AddTokenToTokenListJSON` | 1 | 2 | 3 |
| `isEmpty` | 2 | 0 | 2 |
| `ValidateAssetRequiredKeys` | 1 | 1 | 2 |
| `ValidateCoinRequiredKeys` | 1 | 1 | 2 |
| `ValidateDecimals` | 2 | 0 | 2 |
| `ValidateDescription` | 2 | 0 | 2 |
| `ValidateDescriptionWebsite` | 2 | 0 | 2 |
| `ValidateStatus` | 2 | 0 | 2 |
| `InitAssetsService` | 0 | 2 | 2 |
| `setup` | 2 | 0 | 2 |
| `validateTokenList` | 2 | 0 | 2 |

### Dead-code candidates

> Non-exported symbols with no resolved callers, unreachable from any entry point. Static analysis cannot see dynamic dispatch — verify before removing.

- `main` (`cmd/main.go`)
- `handleAddTokenList` (`internal/manager/manager.go`)
- `handleError` (`internal/service/service.go`)
- `runUpdaters` (`internal/service/service.go`)

## Layering violations

> Calls/handlers that flow **up** the architectural stack (e.g. a model calling a controller).

| From (layer) | To (layer) | Via |
|------|------|-----|
| `InitAssetsService` (service) | `filter` (controller) | calls |

## See Also
- [info](../features/info.md) <!-- rel:strong -->
- [processor](../features/processor.md) <!-- rel:strong -->
- [validator fixer updater](../patterns/validator-fixer-updater.md) <!-- rel:related -->
- [manager](../features/manager.md) <!-- rel:related -->
- [service](../features/service.md) <!-- rel:weak -->
