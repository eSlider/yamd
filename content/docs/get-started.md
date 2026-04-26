---
title: "Get started"
description: "Clone, dev server, edit content and tree."
---

# Get started

[← Framework home](#content/docs/index)

1. **Clone and run a static server** (ES modules and `fetch` will not work from `file://` the way you need):
   ```bash
   git clone https://github.com/eSlider/md-frontend-framework.git
   cd md-frontend-framework
   npm run dev
   ```
2. **Open** `http://127.0.0.1:3456/` (or the port in the log). The default view is set by `default_path` in `pages.yml` (here: [Framework home](#content/docs/index)) unless the URL has a hash.
3. **Change content** under [`content/`](https://github.com/eSlider/md-frontend-framework/tree/main/content); refresh. Deep links: `#content/docs/philosophy`, `#content/example`, etc. (no `.md` in the bar).
4. **Change the nav** by editing [`pages.yml`](https://github.com/eSlider/md-frontend-framework/blob/main/pages.yml) (paths are app-root-relative, e.g. `content/docs/index.md`).

`importmap` in `index.html` loads [marked](https://github.com/markedjs/marked) and [yaml](https://github.com/eemeli/yaml) from a CDN; no `npm install` of those is required for the **browser** path.

**Read next:** [Site map & routing](#content/docs/site-map) · [Live demo](#content/example) · [Architecture](#content/docs/architecture)
