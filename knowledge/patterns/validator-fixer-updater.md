---
title: Validator / Fixer / Updater Pipeline
category: patterns
tags: [validation, fixer, updater, pipeline, go, pattern]
confidence: high
source: internal/processor/, internal/service/service.go
updated: 2026-07-22
---

# Validator / Fixer / Updater Pipeline

The repo's asset-quality enforcement uses three parallel strategy patterns, each represented as a named function value.

## Structs

```go
// internal/processor/model.go
type Validator struct { Name string; Run func(f *file.AssetFile) error }
type Fixer     struct { Name string; Run func(f *file.AssetFile) error }
type Updater   struct { Name string; Run func() error }
```

## How it works

1. `processor.Service.GetValidator(f)` / `GetFixers(f)` — returns the slice of `Validator` / `Fixer` applicable to the given `AssetFile` (determined by `f.Type()`).
2. `service.Service.RunJob(job)` — iterates all asset file paths, calls `job(f)` (either `Check` or `Fix`), and tracks errors via `report.Service`.
3. `Check` runs all validators; `Fix` runs all fixers; `RunUpdateAuto` runs all auto-updaters without iterating files.

## Dispatcher

`processor.Service.GetValidator(f)` and `GetFixers(f)` dispatch based on `file.AssetFile.Type()` — different asset types (root folder, chain folder, asset folder, tokenlist, etc.) get different validator sets.

## Layer note

There is one layer violation recorded: `InitAssetsService` (service layer) calls `filter` (labeled controller by the tool). `filter` is a generic Go 1.18 type-parameter helper in `internal/manager/manager.go` — it filters the file-path slice before building the service. The "controller" label is a mis-classification by the tool; `filter` is a utility function, not a controller boundary. Safe to ignore.

## See Also
- [features/processor.md](../features/processor.md)
- [features/service.md](../features/service.md)
- [call graph](../architecture/call-graph.md) <!-- rel:strong -->
- [layers](../architecture/layers.md) <!-- rel:strong -->
- [repo overview](../architecture/repo-overview.md) <!-- rel:strong -->
