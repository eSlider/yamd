# yamd

**Yet another markdown** — *YAML + Markdown* — a **humanized documentation engine** with **zero backend** for every project with `.md` files. Drop in `index.html` + `src/`, add your `content/`, list pages in `pages.yml`, and ship on any static host (this repo includes **GitHub Pages** via Actions).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/eSlider/yamd/blob/main/LICENSE)
[![Pages](https://img.shields.io/badge/Pages-static%2C%20no%20Jekyll%20build-196127.svg?logo=github)](https://eSlider.github.io/yamd/)
[![ESM](https://img.shields.io/badge/runtime-browser%20ES%20modules-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guides/Modules)
[![no build](https://img.shields.io/badge/build-none-lightgrey.svg)](package.json)
[![zero backend](https://img.shields.io/badge/runtime-zero%20backend-333.svg)](https://github.com/eSlider/yamd#features)
[![declarative](https://img.shields.io/badge/style-declarative--first-5a3.svg)](https://github.com/eSlider/yamd#features)

**[Repository](https://github.com/eSlider/yamd)** ·
**[Live site (GitHub Pages)](https://eSlider.github.io/yamd/)** ·
**[Manual in the app](https://eSlider.github.io/yamd/#docs/index)**

The browser compiles each document (frontmatter + GFM + optional fenced ` ```ui` forms) to a small view model and renders the DOM. **Styling** stays in host CSS; authors don’t ship a build or a second framework to document and extend a project.

**What to read in-repo:** philosophy, architecture, and routing live in [`content/docs/`](https://github.com/eSlider/yamd/tree/main/content/docs) and appear in the left **yamd** section of the nav (from [`pages.yml`](pages.yml)).

> **Repository “About” (copy-paste):** *yamd — yet another markdown: YAML + Markdown, humanized docs, zero backend. GFM, frontmatter, fenced `ui` blocks, compile → render, vanilla ESM, static deploy.*

## Features (short)

| Label | Meaning here |
|-------|----------------|
| **Zero backend** | Shipped site is static files; no app server in the path. |
| **Zero build** | No bundler/CI compile for the app; ESM + `importmap` + `fetch`. |
| **Zero [author] code** | Authors use Markdown, YAML, and `pages.yml` — not per-page app UI code. |
| **Declarative-first** | Fences and the nav tree are data; the small engine in `src/*.js` maps to the DOM. |

**What this is *not*:** a claim the repo has no JavaScript (the engine is JS) or that untrusted markdown is safe by default—see [Security note](#security-note). Details: [Philosophy](https://eSlider.github.io/yamd/#docs/philosophy) · [Features (full)](https://eSlider.github.io/yamd/#docs/features).

## Run locally

`file://` is unsuitable for ES modules + `fetch`; use a static server:

```bash
git clone https://github.com/eSlider/yamd.git
cd yamd
npm run dev
# → http://127.0.0.1:3456/
```

[`marked`](https://github.com/markedjs/marked) and [`yaml`](https://github.com/eemeli/yaml) load from the CDN `importmap` in `index.html`; no `npm install` of those is required for the browser path.

## Site map and deploy

- **Nav + default page:** `pages.yml` (next to `index.html`); default route: **yamd** manual home. **Deep links:** the hash is the path **under** `content/` (no `content` segment), e.g. [`#cookbook`](https://eSlider.github.io/yamd/#cookbook) → `content/cookbook.md` (older `#content/...` forms still work and are rewritten in the address bar). In-app: [Site map & routing](https://eSlider.github.io/yamd/#docs/site-map).
- **GitHub Pages** uses [`.github/workflows/deploy-gh-pages.yml`](.github/workflows/deploy-gh-pages.yml): push to `main` → upload static `index.html`, `src/`, `content/`, `pages.yml`. **Settings** → **Pages** → **Source: GitHub Actions** so this workflow runs (not a competing “branch” deploy). After renaming the repository, the project URL is **`https://<user>.github.io/<repo>/`** (e.g. **[`https://eSlider.github.io/yamd/`](https://eSlider.github.io/yamd/)**).

**First visit after a deploy** can briefly show 404; refresh. Custom domain: [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Security note

`marked` output is set with `innerHTML`. For **untrusted** markdown, sanitize (e.g. DOMPurify) before insert. This repo is a **prototype**; it does not ship that hardening.

## License

[MIT](LICENSE). Copyright 2026 eSlider by default; adjust if you fork.

## Topics (for GitHub search)

`yamd`, `markdown`, `yaml`, `es-modules`, `static-site`, `github-pages`, `github-actions`, `form`, `documentation`, `no-build`, `declarative`, `frontend`.
