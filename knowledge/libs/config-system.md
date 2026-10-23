---
title: Config System
category: libs
tags: [config, viper, yaml, validators-settings]
confidence: high
source: internal/config/config.go, internal/config/validators.go, .github/assets.config.yaml
updated: 2026-07-22
---

# Config System

The config system is loaded once at startup via `config.SetConfig(configPath)` (using Viper) and accessed globally as `config.Default`.

## Structure

```
Config
├── App.LogLevel              — log level for sirupsen/logrus
├── ClientURLs
│   ├── Binance.{Dex,Explorer} — Binance chain API URLs
│   └── AssetsManagerAPI       — https://assets.trustwallet.com/api
├── URLs
│   ├── AssetsApp              — CDN base URL
│   └── Logo                   — Trust Wallet logo URL
├── TimeFormat                 — Go time parse format string
└── ValidatorsSettings         — per-folder-type rules (see below)
```

## ValidatorsSettings

Each field configures what files are allowed (or required) in each folder type:

| Field | Type | Purpose |
|-------|------|---------|
| `RootFolder` | `{AllowedFiles, SkipFiles, SkipDirs}` | Top-level repo root rules |
| `ChainFolder` | `{AllowedFiles}` | Per-blockchain folder |
| `AssetFolder` | `{AllowedFiles}` | Per-token asset folder |
| `ChainInfoFolder` | `{HasFiles}` | Chain info sub-folder |
| `ChainValidatorsAssetFolder` | `{HasFiles}` | Staking validator assets |
| `DappsFolder` | `{Ext}` | Required file extension in dapps |
| `CoinInfoFile.Tags` | `[]Tag{ID,Name,Description}` | Allowed coin tags |

## Default config path

`.github/assets.config.yaml` (can be overridden via `--config` flag). The config file is part of the repo and version-controlled.

## See Also
- [libs/config.md](../libs/config.md)
- [token models](../architecture/data/token-models.md) <!-- rel:strong -->
- [models](../architecture/data/models.md) <!-- rel:strong -->
- [go conventions](../code-conventions/go-conventions.md) <!-- rel:related -->
- [repo overview](../architecture/repo-overview.md) <!-- rel:related -->
