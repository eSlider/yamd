# md-frontend-framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/eSlider/md-frontend-framework/blob/main/LICENSE)
[![Pages](https://img.shields.io/badge/Pages-static%2C%20no%20Jekyll%20build-196127.svg?logo=github)](https://eSlider.github.io/md-frontend-framework/)
[![ESM](https://img.shields.io/badge/runtime-browser%20ES%20modules-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guides/Modules)
[![no build](https://img.shields.io/badge/build-none-lightgrey.svg)](package.json)
[![zero backend](https://img.shields.io/badge/runtime-zero%20backend-333.svg)](https://github.com/eSlider/md-frontend-framework#features)
[![declarative](https://img.shields.io/badge/style-declarative--first-5a3.svg)](https://github.com/eSlider/md-frontend-framework#features)

**[Repository](https://github.com/eSlider/md-frontend-framework)** ·
**[Live site](https://eSlider.github.io/md-frontend-framework/)** ·
**[Framework manual (in the app)](https://eSlider.github.io/md-frontend-framework/#content/docs/index)**

One markdown file = YAML **frontmatter** + **Markdown** (GFM) + fenced **` ```ui`** blocks (declarative form schema). The browser **compiles** the string to `{ meta, parts }` and **renders** to the DOM. Styling is host CSS only.

**What to read in-repo:** philosophy, architecture, and routing are documented as Markdown under [`content/docs/`](https://github.com/eSlider/md-frontend-framework/tree/main/content/docs) and appear in the left **Framework** section (driven by [`pages.yml`](pages.yml)).

> **Repository “About” (copy-paste):** *Client-side MD + YAML: frontmatter, fenced `ui` blocks, compile→render contract. Zero backend, zero build, declarative-first. Vanilla ESM. Research prototype.*

## Features (short)

| Label | Meaning here |
|-------|----------------|
| **Zero backend** | Shipped site is static files; no app server in the path. |
| **Zero build** | No bundler/CI compile for the app; ESM + `importmap` + `fetch`. |
| **Zero [author] code** | Authors use Markdown, YAML, and `pages.yml` — not hand-written UI framework code per page. |
| **Declarative-first** | Fences and the nav tree are data; the small engine in `src/*.js` maps to the DOM. |

**What this is *not*:** a claim the repo has no JavaScript (the engine is JS) or that untrusted markdown is safe by default—see [Security note](#security-note). Details: [Philosophy](https://eSlider.github.io/md-frontend-framework/#content/docs/philosophy) · [Features (full)](https://eSlider.github.io/md-frontend-framework/#content/docs/features).

## Run locally

`file://` is unsuitable for ES modules + `fetch`; use a static server:

```bash
git clone https://github.com/eSlider/md-frontend-framework.git
cd md-frontend-framework
npm run dev
# → http://127.0.0.1:3456/
```

[`marked`](https://github.com/markedjs/marked) and [`yaml`](https://github.com/eemeli/yaml) load from the CDN `importmap` in `index.html`; no `npm install` of those is required for the browser path.

## Site map and deploy

- **Nav + default page:** `pages.yml` (next to `index.html`); default route: **Framework** home. **Deep links:** `#content/...` (no `.md`). In-app: [Site map & routing](https://eSlider.github.io/md-frontend-framework/#content/docs/site-map).
- **GitHub Pages** uses [`.github/workflows/deploy-gh-pages.yml`](.github/workflows/deploy-gh-pages.yml): push to `main` → upload static `index.html`, `src/`, `content/`, `pages.yml`. **Settings** → **Pages** → **Source: GitHub Actions** so this workflow runs (not a competing “branch” deploy). URL pattern: `https://<user>.github.io/<repo>/`.

**First visit after a deploy** can briefly show 404; refresh. Custom domain: [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Security note

`marked` output is set with `innerHTML`. For **untrusted** markdown, sanitize (e.g. DOMPurify) before insert. This repo is a **prototype**; it does not ship that hardening.

## License

[MIT](LICENSE). Copyright 2026 eSlider by default; adjust if you fork.

## Topics (for GitHub search)

`markdown`, `yaml`, `es-modules`, `static-site`, `github-pages`, `github-actions`, `form`, `research`, `no-build`, `declarative`, `frontend`.
