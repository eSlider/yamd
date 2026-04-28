import { renderUiModel } from "./render-ui.js";

const TITLE = "yamd";

export function render(root, { meta, parts }) {
  const act = typeof meta.form_action === "string" ? meta.form_action : undefined;
  const meth = typeof meta.form_method === "string" ? meta.form_method : undefined;

  if (meta.title) {
    document.title = String(meta.title) + " · yamd";
  }

  const a = document.createElement("article");
  const first = parts[0];
  const h1InFirstMd =
    first &&
    first.type === "md" &&
    typeof first.html === "string" &&
    /^\s*<h1\b/i.test(first.html);
  if (!h1InFirstMd) {
    const h1 = document.createElement("h1");
    h1.textContent = String(meta.title || TITLE);
    a.appendChild(h1);
  }

  for (const p of parts) {
    const s = document.createElement("section");
    if (p.type === "md") {
      s.className = "md";
      s.innerHTML = p.html;
    } else {
      s.className = "ui";
      s.appendChild(renderUiModel(p.data, { action: act, method: meth }));
    }
    a.appendChild(s);
  }
  root.replaceChildren(a);
}
