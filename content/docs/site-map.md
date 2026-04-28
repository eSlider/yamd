---
title: "Information architecture"
description: "How URLs, pages.yml, and files on disk map to each other."
---

# Information architecture

[← Back to Start](#start)

One file owns navigation. One simple rule maps URLs to disk. That is the whole routing model.

## `pages.yml` owns the sidebar

`pages.yml` lives next to `index.html` and describes the left nav: titles, optional `path` to a `.md` under `content/`, and nested `items`. The app fetches it relative to the app root. If the fetch fails or the list is empty, the sidebar hides and the app still opens files via the URL hash.

Accepted root shapes: a top-level array, or an object with `nav` / `items` / `pages`, plus an optional `default_path`. See [`site-nav.js` parsePagesYmlText](https://github.com/eSlider/yamd/blob/main/src/site-nav.js) for the full grammar.

## URL-to-file mapping (one rule, no exceptions)

The hash is the path **under** `content/`. No `content/` segment. No `.md` extension.

| In the address bar | Loaded file |
| --- | --- |
| `#start` | `content/start.md` |
| `#docs/philosophy` | `content/docs/philosophy.md` |
| `#example` | `content/example.md` |
| `#examples/cookbook` | `content/examples/cookbook.md` |

Internal Markdown links use the same form: `[Cookbook](#examples/cookbook)`. Hash-only links survive subpath hosting (for example GitHub Pages under `/<repo>/`) without query rewrites.

Legacy `?path=content%2F…` links are rewritten once on load to the short hash form, so old bookmarks keep working.

## `default_path`

`default_path` in `pages.yml` is the file used when the URL has no hash. If the hash is unknown, the nav tree is consulted as a fallback. This site sets `default_path: content/start.md` so the first thing a new reader sees is the [Start here](#start) page.

## Mental model

- **Content lives in files.** You can grep it.
- **Navigation lives in YAML.** You can review it.
- **Routing is a hash.** You can read it.

If a docs question is not answered by one of those three, it is probably out of scope for yamd.

## Related

- [Get started](#docs/get-started) — the deploy paths that make these URLs real
- [Product overview](#docs/index) — where this fits in the bigger picture
