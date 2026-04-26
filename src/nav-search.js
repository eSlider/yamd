import yaml from "https://esm.sh/yaml@2.8.0?bundle";
import { contentUrl } from "./site-nav.js";

/**
 * @typedef {{ path: string, navLabel: string, docTitle: string, haystack: string }} IndexRow
 */

/**
 * @param {string} text
 * @returns {{ frontmatter: string | null, body: string }}
 * Same as document.js
 */
function splitFrontmatter(/** @type {string} */ text) {
  if (!text.startsWith("---")) {
    return { frontmatter: null, body: text };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    return { frontmatter: null, body: text };
  }
  const n = text.indexOf("\n", 0);
  const fm = text.slice(n + 1, end).replace(/\r\n/g, "\n");
  let b = text.slice(end + 4);
  b = b.startsWith("\r\n") ? b.slice(2) : b.startsWith("\n") ? b.slice(1) : b;
  return { frontmatter: fm, body: b.replace(/\r\n/g, "\n") };
}

/**
 * @param {string} body
 * @returns {string}
 */
function bodyToIndexText(/** @type {string} */ body) {
  let s = String(body);
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/^#+\s*[^\n]*/gm, " ");
  s = s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1 ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/[*_~`#>|]/g, " ");
  s = s.replace(/https?:\/\/\S+/g, " ");
  s = s.replace(/[^\p{L}\p{N}\s-]/gu, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/**
 * @param {string} raw
 * @returns {string}
 */
function docTitleFromRaw(/** @type {string} */ raw) {
  const t = String(raw).replace(/^\uFEFF/, "");
  const { frontmatter, body: _b } = splitFrontmatter(t);
  if (!frontmatter) {
    return "";
  }
  try {
    const m = /** @type {Record<string, unknown>} */ (yaml.parse(frontmatter) ?? {});
    return typeof m.title === "string" ? m.title.trim() : "";
  } catch {
    return "";
  }
}

/**
 * @param {string} raw
 * @returns {string}
 */
function bodyForIndex(/** @type {string} */ raw) {
  const t = String(raw).replace(/^\uFEFF/, "");
  const { body } = splitFrontmatter(t);
  return bodyToIndexText(body);
}

/**
 * @param {{ path: string, label: string }[]} entries
 * @param {string} importMetaUrl
 * @returns {Promise<IndexRow[]>}
 */
export async function buildSearchIndex(/** @type {{ path: string, label: string }[]} */ entries, /** @type {string} */ importMetaUrl) {
  const rows = await Promise.all(
    entries.map(async (e) => {
      try {
        const u = contentUrl(e.path, importMetaUrl);
        const r = await fetch(u, { cache: "no-store" });
        if (!r.ok) {
          return makeRowFromNavOnly(e);
        }
        const raw = await r.text();
        const docTitle = docTitleFromRaw(raw);
        const bodyText = bodyForIndex(raw);
        return buildRow(e.path, e.label, docTitle, bodyText);
      } catch {
        return makeRowFromNavOnly(e);
      }
    })
  );
  return rows;
}

/**
 * @param {string} path
 * @param {string} navLabel
 * @param {string} docTitle
 * @param {string} bodyText
 * @returns {IndexRow}
 */
function buildRow(/** @type {string} */ path, /** @type {string} */ navLabel, /** @type {string} */ docTitle, /** @type {string} */ bodyText) {
  const t = [navLabel, docTitle, bodyText].filter(Boolean).join(" ");
  return {
    path,
    navLabel: navLabel || "",
    docTitle: docTitle || "",
    haystack: t.toLowerCase(),
  };
}

/**
 * @param {{ path: string, label: string }} e
 * @returns {IndexRow}
 */
function makeRowFromNavOnly(/** @type {{ path: string, label: string }} */ e) {
  return buildRow(e.path, e.label, "", "");
}

/**
 * @param {IndexRow[]} index
 * @param {string} q
 * @param {number} [limit]
 * @returns {{ path: string, title: string, sub: string, score: number }[]}
 */
export function searchIndex(/** @type {IndexRow[]} */ index, /** @type {string} */ q, limit = 12) {
  const t = String(q)
    .trim()
    .toLowerCase();
  if (!t) {
    return [];
  }
  const terms = t.split(/\s+/).filter((s) => s.length > 0);
  if (terms.length === 0) {
    return [];
  }
  /** @type {{ path: string, title: string, sub: string, score: number }[]} */
  const scored = [];
  for (const row of index) {
    const titleL = (row.docTitle + " " + row.navLabel).toLowerCase();
    let allTerms = true;
    for (const term of terms) {
      if (!row.haystack.includes(term) && !titleL.includes(term)) {
        allTerms = false;
        break;
      }
    }
    if (!allTerms) {
      continue;
    }
    let score = 0;
    for (const term of terms) {
      if (titleL.includes(term)) {
        score += 4;
      }
      if (row.haystack.includes(term)) {
        score += 1;
      }
    }
    const displayTitle = row.docTitle || row.navLabel || row.path;
    const sub = row.docTitle && row.navLabel && row.docTitle !== row.navLabel ? row.navLabel : row.path;
    scored.push({ path: row.path, title: displayTitle, sub, score });
  }
  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, limit);
}

/**
 * @param {{ onPick: (path: string) => void, onCloseMobile?: () => void }} actions
 * @param {string} importMetaUrl
 * @param {{ path: string, label: string }[]} entries
 * @returns {{ root: HTMLElement, getIndex: () => IndexRow[] }}
 */
export function setupNavSearch(/** @type {{ onPick: (path: string) => void, onCloseMobile?: () => void }} */ actions, /** @type {string} */ importMetaUrl, /** @type {{ path: string, label: string }[]} */ entries) {
  const { onPick, onCloseMobile } = actions;

  const block = document.createElement("div");
  block.className = "yamd-nav-search";
  const label = document.createElement("label");
  label.className = "yamd-nav-search__label";
  label.setAttribute("for", "yamd-nav-search-input");
  label.textContent = "Search site";

  const input = document.createElement("input");
  input.className = "yamd-nav-search__input";
  input.id = "yamd-nav-search-input";
  input.type = "search";
  input.name = "q";
  input.autocomplete = "off";
  input.placeholder = "Search…";
  input.setAttribute("aria-label", "Search page titles and content");
  input.setAttribute("enterkeyhint", "search");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("spellcheck", "false");

  const status = document.createElement("p");
  status.className = "yamd-nav-search__status";
  status.setAttribute("aria-live", "polite");

  const results = document.createElement("ul");
  results.className = "yamd-nav-search__results";
  results.setAttribute("role", "listbox");
  results.setAttribute("hidden", "");
  results.id = "yamd-nav-search-results";
  input.setAttribute("aria-controls", results.id);

  block.appendChild(label);
  block.appendChild(input);
  block.appendChild(status);
  block.appendChild(results);

  /** @type {IndexRow[]} */
  let index = [];
  let debounce = 0;
  /** Bumped on each focus; stale async completions are ignored. */
  let indexGeneration = 0;
  let indexLoading = false;

  function setStatus(/** @type {string} */ t) {
    status.textContent = t;
  }

  function idleStatus() {
    if (indexLoading) {
      setStatus("Indexing…");
    } else if (index.length) {
      setStatus(`${index.length} pages indexed`);
    } else {
      setStatus("Focus here to build search index");
    }
  }

  async function loadIndexOnFocus() {
    const gen = ++indexGeneration;
    indexLoading = true;
    if (input.value.trim()) {
      setStatus("Indexing…");
    } else {
      idleStatus();
    }
    try {
      const rows = await buildSearchIndex(entries, importMetaUrl);
      if (gen !== indexGeneration) {
        return;
      }
      index = rows;
      indexLoading = false;
      if (input.value.trim()) {
        runQuery();
      } else {
        idleStatus();
      }
    } catch {
      if (gen !== indexGeneration) {
        return;
      }
      index = entries.map((e) => makeRowFromNavOnly(e));
      indexLoading = false;
      setStatus("Index failed; nav titles only");
      if (input.value.trim()) {
        runQuery();
      } else {
        idleStatus();
      }
    }
  }

  function runQuery() {
    const q = input.value;
    if (!q.trim()) {
      results.textContent = "";
      results.setAttribute("hidden", "");
      idleStatus();
      return;
    }
    if (indexLoading) {
      setStatus("Indexing…");
      return;
    }
    if (!index.length) {
      setStatus("Focus search field to load index");
      return;
    }
    const hits = searchIndex(index, q, 20);
    results.textContent = "";
    if (hits.length === 0) {
      results.setAttribute("hidden", "");
      setStatus("No matches");
      return;
    }
    results.removeAttribute("hidden");
    for (const h of hits) {
      const li = document.createElement("li");
      li.className = "yamd-nav-search__item";
      li.setAttribute("role", "option");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "yamd-nav-search__hit";
      const t0 = document.createElement("span");
      t0.className = "yamd-nav-search__hit-title";
      t0.textContent = h.title;
      const t1 = document.createElement("span");
      t1.className = "yamd-nav-search__hit-sub";
      t1.textContent = h.sub;
      b.appendChild(t0);
      b.appendChild(t1);
      b.addEventListener("click", () => {
        input.value = "";
        results.textContent = "";
        results.setAttribute("hidden", "");
        setStatus(index.length ? `${index.length} pages indexed` : "");
        onPick(h.path);
        onCloseMobile?.();
      });
      li.appendChild(b);
      results.appendChild(li);
    }
    setStatus(
      hits.length
        ? `${hits.length} result${hits.length === 1 ? "" : "s"}`
        : ""
    );
  }

  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = window.setTimeout(() => {
      runQuery();
    }, 150);
  });

  input.addEventListener("search", runQuery);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      runQuery();
    }
  });

  input.addEventListener("focus", () => {
    void loadIndexOnFocus();
  });

  setStatus("Focus here to build search index");

  document.addEventListener("keydown", (e) => {
    if (e.key !== "/") {
      return;
    }
    const t = e.target;
    if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) {
      return;
    }
    if (t instanceof HTMLSelectElement) {
      return;
    }
    if (t instanceof HTMLElement && t.isContentEditable) {
      return;
    }
    e.preventDefault();
    input.focus();
  });

  return {
    root: block,
    getIndex: () => index,
  };
}
