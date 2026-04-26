import { compile } from "./document.js";
import { render } from "./render.js";

const el = document.getElementById("mdui-content");
if (!el) {
  throw new Error("#mdui-content");
}

const URL_MD = new URL("../content/example.md", import.meta.url);

(async () => {
  try {
    const res = await fetch(URL_MD, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    const doc = await compile(await res.text());
    el.replaceChildren();
    render(el, doc);
  } catch (e) {
    const p = document.createElement("p");
    p.className = "mdui-error";
    p.textContent = "Error: " + (e instanceof Error ? e.message : String(e));
    el.replaceChildren(p);
  }
})();
