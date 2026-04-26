---
title: "Philosophy"
description: "Design goals: content as contract, view as engine."
---

# Philosophy

[← Framework home](#docs/index)

## The question

Can **content** be a portable **contract** (a string) and the **view** a replaceable **engine**—without a full framework stack for every small doc+form experiment?

## What we pushed back on

| Direction | Why it was too heavy for this sketch |
|-----------|--------------------------------------|
| TypeScript, `.mjs` sprawl, extra adapters | One obvious **plain JS** ESM pipeline |
| React/MDX-style **bundles** for every try | **No build** in the repo: `importmap` + `fetch` |
| A second renderer (e.g. UI kit via `import()`) | **One DOM path**; fewer MIME/SPA/CDN issues |
| Many ill-defined “services” in the app | **Two steps:** `compile(raw)` and `render(container, doc)` (+ UI block render) |

## The rule

**Content delivery** (file, `fetch`, CMS) only **provides a string**. Everything else is **compile** → `{ meta, parts }` and **render** → DOM. That is the **declaration** the engine implements.

**Authors** work in **Markdown + YAML** (frontmatter, ` ```ui` blocks, `pages.yml`). They do not ship their own app bundle to add a form or a nav line—see [Features](#docs/features).

## Related

- [Architecture](#docs/architecture) — how the contract is wired in code
- [Idea (short note)](#idea) in the old “reference” pages
