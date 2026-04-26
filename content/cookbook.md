---
title: "Cookbook"
description: "Small patterns for pages.yml and forms."
---

# Cookbook

[← Framework home](#docs/index) · [Site map](#docs/site-map) · [Demo](#example)

- **Navigation** — tree lives in `pages.yml`; paths are relative to the app base (`content/...`).
- **Default page** — set `default_path: content/docs/index.md` (or your landing file) in `pages.yml`.
- **Forms** — use `type: form` with `action` / `method` and nested `items` (see [example](#example)).

## Nested group

```ui
- type: form
  title: Group
  items:
    - type: input
      name: x
      title: Field
```
