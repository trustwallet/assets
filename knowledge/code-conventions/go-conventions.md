---
title: Code Conventions — Go Style
category: code-conventions
tags: [go, naming, error-handling, cobra, viper, logrus]
confidence: high
source: internal/, cmd/, Makefile, .golangci.yml
updated: 2026-07-22
---

# Go Code Conventions

## CLI framework

Commands are defined with [cobra](https://github.com/spf13/cobra). New commands are registered in `manager.InitCommands()` and executed via `manager.Execute()`.

## Config

[Viper](https://github.com/spf13/viper) is used for config loading. Configuration is loaded once at startup; the global `config.Default` is the singleton accessor. Never parse the YAML config manually.

## Logging

[sirupsen/logrus](https://github.com/sirupsen/logrus) is used. Log level is set from config. Use structured fields: `log.WithFields(log.Fields{...}).Error(msg)`.

## Error handling

Composite errors are wrapped with `validation.ErrComposite` from `assets-go-libs`. Use `service.UnwrapComposite(err)` to flatten them for logging. Never swallow errors in validators — append to `ErrComposite`.

## Linting

golangci-lint v1.50.1 is used (`.golangci.yml`). Run via `make lint`. All checks must pass before merging.

## Testing

Unit tests via `go test -race -cover`. Run with `make test`. Coverage report written to `coverage.txt`.

## Build

`go build -o bin/assets ./cmd` — outputs a single binary. All commands (`check`, `fix`, `update-auto`, etc.) are subcommands of this binary.

## External dependencies

Key deps: `trustwallet/assets-go-libs` (file, path, validation), `trustwallet/go-primitives` (coin, asset, path types). These are TW-internal libraries — updates must coordinate with those repos.

## See Also
- [code-conventions/code-style/anti-patterns-failed-approaches.md](code-style/anti-patterns-failed-approaches.md)
- [repo overview](../architecture/repo-overview.md) <!-- rel:strong -->
- [config system](../libs/config-system.md) <!-- rel:strong -->
- [testing strategy](../tests/testing-strategy.md) <!-- rel:strong -->
- [add token](../guides/add-token.md) <!-- rel:strong -->
