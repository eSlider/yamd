---
title: "Security"
description: "Trust boundaries, innerHTML, and hardening for untrusted markdown."
---

# Security

[← yamd manual](#docs/index) · [Features](#docs/features) · [Get started](#docs/get-started)

## Trust model

The engine turns Markdown into HTML in the browser and **assigns the result with `innerHTML`**. For **content you own** (this repo, your `content/` tree), that is the intended path: fast, simple, no extra build.

For **untrusted** input (user uploads, public wikis, third-party sources), you must **not** use raw `marked` output as trusted HTML. Treat it like any other untrusted string:

- **Sanitize** before insert (e.g. [DOMPurify](https://github.com/cure53/DOMPurify)), or
- **Do not** render to HTML in the same process as untrusted auth — use a stricter content pipeline

This project is a **documentation prototype**; it does **not** ship a sanitizer in the default path. If you fork for production, add hardening in the `compile` / render pipeline where HTML is produced.

**Related:** [Features (what we claim and do not)](#docs/features) · [Architecture](#docs/architecture)
