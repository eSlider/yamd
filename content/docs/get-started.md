---
title: "Get started"
description: "Clone, local static servers, deploy, edit content and nav."
---

# Get started

[← yamd manual](#docs/index)

1. **Clone and run a static server** (ES modules and `fetch` will not work from `file://` the way you need):
   ```bash
   git clone https://github.com/eSlider/yamd.git
   cd yamd
   npm run dev
   ```
2. **Open** `http://127.0.0.1:3456/` (or the port in the log). The default view is set by `default_path` in `pages.yml` (here: [yamd manual](#docs/index)) unless the URL has a hash.
3. **Change content** under [`content/`](https://github.com/eSlider/yamd/tree/main/content); refresh. Deep links: `#docs/philosophy`, `#example`, `#examples/cookbook`, etc. (no `.md` in the bar).
4. **Change the nav** by editing [`pages.yml`](https://github.com/eSlider/yamd/blob/main/pages.yml) (paths are app-root-relative, e.g. `content/docs/index.md`).

`importmap` in `index.html` loads [marked](https://github.com/markedjs/marked) and [yaml](https://github.com/eemeli/yaml) from a CDN; no `npm install` of those is required for the **browser** path.

## Use a real HTTP server (not `file://`)

Opening `index.html` directly from disk will **not** work the way yamd needs: the app uses **ES modules**, `import()`, and `fetch` for `content/*` and `pages.yml`, so the project folder must be served as an **HTTP document root**.

## Other ways to run locally

Replace `8080` with any free port when the tool accepts a port, then open the matching URL (for example `http://127.0.0.1:8080/`). This repo’s `npm run dev` uses **3456** by default (see [dev-server.js](https://github.com/eSlider/yamd/blob/main/dev-server.js)). **Deno**’s `file-server` often defaults to **8000** unless you pass a flag.

| Tool | One command (static file server) |
|------|----------------------------------|
| **This repo (Node)** | `npm run dev` — `http://127.0.0.1:3456/` |
| **Node (npx)** | `npx --yes serve@latest -l 8080` or `npx --yes http-server@latest -p 8080 -c-1` |
| **Python 3** | `python3 -m http.server 8080` |
| **Ruby** | `ruby -run -ehttpd . -p 8080` |
| **PHP** (5.4+) | `php -S 127.0.0.1:8080 -t .` (run from the yamd project folder) |
| **PHP (Docker)** | `docker run --rm -p 8080:8080 -v "$PWD":/app -w /app php:8.3-cli php -S 0.0.0.0:8080 -t /app` |
| **Caddy** | `caddy file-server --root . --listen :8080` |
| **Deno** | `deno run --allow-net --allow-read jsr:@std/http/file-server` (port often 8000) |
| **Bun** | `bunx --bun serve@latest -p 8080` |
| **nginx (Docker)** | `docker run --rm -p 8080:80 -v "$PWD":/usr/share/nginx/html:ro nginx:alpine` |
| **BusyBox** | `busybox httpd -f -p 8080 -h .` |
| **Go** | No single stdlib *command*; use one of the rows above or a tiny `FileServer` program, or a static binary like [miniserve](https://github.com/svenstaro/miniserve), [darkhttpd](https://github.com/ryanmjacobs/darkhttpd), [static-web-server](https://github.com/static-web-server/static-web-server). |

*Security:* these are **local dev** patterns. Do not expose an unhardened static server to the public internet.

## Deploy: GitHub Pages (and static hosts in general)

- The shipped site is **static files**: `index.html`, `src/`, `content/`, `pages.yml` (see [.github/workflows/deploy-gh-pages.yml](https://github.com/eSlider/yamd/blob/main/.github/workflows/deploy-gh-pages.yml)). Push to `main` to publish via Actions.
- In the repo: **Settings → Pages → Source: GitHub Actions** so that workflow is used (not a duplicate branch deploy).
- After renaming the repository, the site URL is `https://<user>.github.io/<repo>/` (e.g. [eSlider.github.io/yamd](https://eSlider.github.io/yamd/)).
- **First visit** after a deploy can briefly show 404; refresh. Custom domains: [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
- **Deep links** use the hash as the path *under* `content/` (no `content` segment), e.g. `#examples/cookbook` → `content/examples/cookbook.md` — see [Site map & routing](#docs/site-map).

**Read next:** [Site map & routing](#docs/site-map) · [Security](#docs/security) · [Live demo](#example) · [Architecture](#docs/architecture)
