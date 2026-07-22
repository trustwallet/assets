# Dependency Graph

<!-- sdd-knowledge-generated -->

## Feature Dependencies

```mermaid
flowchart LR
  cmd --> manager
  manager --> config
  manager --> processor
  manager --> report
  manager --> service
  processor --> config
```

## External Dependencies

| Package | Import Count |
|---------|--------------|
| `github.com` | 19 |

