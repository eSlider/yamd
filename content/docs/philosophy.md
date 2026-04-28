---
title: "Philosophy and constraints"
description: "Why yamd draws a hard line between content and engine, and what we refused to build."
---

# Philosophy and constraints

[← Back to Start](#start)

A documentation tool earns trust by what it refuses to do.

## The question we started from

Can **content** be a portable contract — a plain string — and the **view** a replaceable engine, **without** a full framework stack for every small docs experiment?

If yes, the rest of the design follows on its own.

## What we refused to build

| Direction | Why we said no |
| --- | --- |
| TypeScript pipeline, multiple module formats, adapter layers | One obvious **plain JS** ESM pipeline beats five flexible ones |
| React/MDX-style **bundles** for every page | **No build** in the repo: `importmap` + `fetch`, period |
| A second renderer (UI kit via dynamic import, etc.) | One DOM path. Fewer MIME, SPA, and CDN edge cases |
| A bag of vaguely scoped "services" inside the app | **Two steps:** `compile(raw)` and `render(container, doc)`, plus UI block render |

Every "no" above is a feature you do not have to learn, debug, or migrate off later.

## The contract

Content delivery (a file, a `fetch`, a CMS, a paste) only ever **provides a string**. Everything after that is:

- `compile(raw)` → `{ meta, parts }`
- `render(container, doc)` → DOM

That is the entire declaration the engine implements. Authors work in **Markdown + YAML** — frontmatter, fenced ` ```ui` blocks, and `pages.yml` — and never ship their own application bundle to add a form or a nav line.

## What this buys you

- **Substitutability.** Swap the renderer. Swap the host. Swap the content source. The contract holds.
- **Forensics.** When something is wrong, you only have two functions to suspect.
- **Longevity.** The Markdown stays readable in any text editor for the next twenty years.

## Related

- [Architecture](#docs/architecture) — how the contract is wired in code
- [Features and authoring model](#docs/features) — what falls out of the contract for authors
- [Idea and contract](#idea) — the original short note
