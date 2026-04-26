---
title: "Features"
description: "Zero backend, zero build, declarative-first, author vs engine."
---

# Features

[← Framework home](#docs/index)

These labels describe **design intent**, not marketing absolutes.

| Label | Meaning in this project |
|-------|-------------------------|
| **Zero backend** | The **published** site is **static files** only. No app server, API, or database in the delivery path. The browser loads `index.html`, `src/`, `content/`, `pages.yml` from any static host. |
| **Zero build** | **No** bundler, no `npm run build` for the app. The browser runs **ES modules** with an **`importmap`**. `npm run dev` is a tiny static server, not a compile pipeline. |
| **Zero [author] code** | **You** (author) do not add application code to ship a page: only **Markdown**, **YAML** (frontmatter + ` ```ui` blocks), and **`pages.yml`**. The **engine** in `src/*.js` is shared and prewritten. |
| **Declarative-first** | The **source of truth** is **data**: UI in fenced blocks; the **site tree** in `pages.yml`; forms use `type`, `items`, `action` / `method`—**declare** what you need, the runtime maps to the DOM. |

**Not claimed:** that the repo contains *no* JavaScript (it does), or that **untrusted** markdown is safe without a sanitizer—see the [security section in the README](https://github.com/eSlider/md-frontend-framework#security-note).

**Related:** [Philosophy](#docs/philosophy) · [Architecture](#docs/architecture)
