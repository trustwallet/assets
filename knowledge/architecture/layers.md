# Architectural Layers

<!-- sdd-knowledge-generated -->

> Layer of each module (path/role-derived) and any calls that flow **up** the stack — a layering violation. Allowed flow: ui → controller → service → repository → model.

## Layer distribution

| Layer | Symbols |
|-------|---------|
| controller | 1 |
| service | 14 |
| model | 4 |

## Violations (1)

| From (layer) | To (layer) | Via |
|------|------|-----|
| `InitAssetsService` (service) | `filter` (controller) | calls |

