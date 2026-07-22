---
category: guides
subcategory: troubleshooting
confidence: low
documentType: how-to
scope: org
contentHash: b5aea5623676
tags: [anti-pattern, troubleshooting, faq]
source: (synthesized)
verified: 2026-07-22
synthetic: synthesized-faq
---

## Common Mistakes and Anti-Patterns

<!-- sdd-knowledge-synthesized -->

> Auto-generated from anti-patterns found across the knowledge base.

### Code-conventions

**From [Anti-Patterns (failed approaches)](../../code-conventions/anti-patterns-failed-approaches.md):**
<!-- Add failed approaches here. Each anti-pattern should include:
- **type**: anti-pattern
- **discovered**: YYYY-MM-DD

**From [Go Code Conventions](../../code-conventions/go-code-conventions.md):**
[Viper](https://github.com/spf13/viper) is used for config loading. Configuration is loaded once at startup; the global `config.Default` is the singleton accessor. Never parse the YAML config manually.

**From [Go Code Conventions](../../code-conventions/go-code-conventions.md):**
Composite errors are wrapped with `validation.ErrComposite` from `assets-go-libs`. Use `service.UnwrapComposite(err)` to flatten them for logging. Never swallow errors in validators — append to `ErrComposite`.

