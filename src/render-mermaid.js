/**
 * Renders ` ```mermaid` blocks (marked → `pre > code.language-mermaid`) to SVG.
 * Loads mermaid from CDN only when at least one such block exists.
 */

const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

/** @param {ParentNode} root */
function queryMermaidCodes(root) {
  return root.querySelectorAll("pre > code.language-mermaid");
}

let mermaidReady = null;

/**
 * @returns {Promise<unknown>}
 */
function loadMermaid() {
  if (!mermaidReady) {
    mermaidReady = (async () => {
      const mod = await import(/* webpackIgnore: true */ MERMAID_CDN);
      return mod.default;
    })();
  }
  return mermaidReady;
}

function isDarkTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark") {
    return true;
  }
  if (explicit === "light") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getThemeVariables(darkMode) {
  if (darkMode) {
    return {
      darkMode: true,
      background: "#111111",
      fontFamily: "Inter var, Inter, system-ui, sans-serif",
      fontSize: "16px",
      primaryColor: "#333333",
      primaryTextColor: "#fafafa",
      primaryBorderColor: "#8e8e8e",
      secondaryColor: "#222222",
      tertiaryColor: "#2a2a2a",
      lineColor: "#a8a8a8",
      textColor: "#fafafa",
      mainBkg: "#2b2b2b",
      noteBkgColor: "#2f2f2f",
      noteTextColor: "#fafafa",
      noteBorderColor: "#7f7f7f",
    };
  }
  return {
    darkMode: false,
    background: "#ffffff",
    fontFamily: "Inter var, Inter, system-ui, sans-serif",
    fontSize: "16px",
    primaryColor: "#f2f2f2",
    primaryTextColor: "#000000",
    primaryBorderColor: "#7a7a7a",
    secondaryColor: "#f7f7f7",
    tertiaryColor: "#efefef",
    lineColor: "#666666",
    textColor: "#000000",
    mainBkg: "#f3f3f3",
    noteBkgColor: "#fff8cf",
    noteTextColor: "#000000",
    noteBorderColor: "#8a8a8a",
  };
}

/**
 * @param {HTMLElement} root — host of rendered article (e.g. #content)
 */
export async function runMermaidInRoot(root) {
  const codes = queryMermaidCodes(root);
  if (codes.length === 0) {
    return;
  }
  const mermaid = await loadMermaid();
  const darkMode = isDarkTheme();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: getThemeVariables(darkMode),
  });
  for (const code of codes) {
    const pre = code.parentElement;
    if (!pre || pre.localName.toLowerCase() !== "pre") {
      continue;
    }
    const def = (code.textContent || "").replace(/\n$/, "");
    const out = document.createElement("div");
    out.className = "mermaid";
    out.setAttribute("role", "img");
    if (def.trim().slice(0, 80)) {
      out.setAttribute("aria-label", "Diagram: " + def.trim().slice(0, 80).replace(/\s+/g, " ") + (def.length > 80 ? "…" : ""));
    }
    const id = "mmd-" + Math.random().toString(36).slice(2) + "-" + String(Date.now());
    pre.replaceWith(out);
    try {
      const { svg } = await mermaid.render(id, def);
      out.innerHTML = svg;
    } catch (e) {
      out.className = "mermaid err";
      out.removeAttribute("role");
      out.removeAttribute("aria-label");
      out.textContent = (e instanceof Error ? e.message : String(e)) || "Mermaid render error";
    }
  }
}
