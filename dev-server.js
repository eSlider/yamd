import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3456;
/** In Docker, bind 0.0.0.0; local default stays 127.0.0.1. */
const host = process.env.HOST || "127.0.0.1";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json",
  ".yml": "text/yaml; charset=utf-8",
  ".yaml": "text/yaml; charset=utf-8",
};

const contentDir = path.join(root, "content");
const contentPagesYml = path.join(contentDir, "pages.yml");

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectMarkdownFiles(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(abs);
      out.push(...nested);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(abs);
    }
  }
  return out;
}

/**
 * @param {string} absPath
 * @returns {string}
 */
function prettyTitleFromMarkdown(absPath) {
  const base = path.basename(absPath, ".md");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

/**
 * @param {string[]} markdownFiles
 * @returns {string}
 */
function buildPagesYml(markdownFiles) {
  const sorted = [...markdownFiles].sort((a, b) => a.localeCompare(b));
  const rel = sorted.map((abs) => path.posix.join("content", path.relative(contentDir, abs).split(path.sep).join("/")));
  const lines = [`default_path: "${rel[0]}"`, "nav:"];
  for (let i = 0; i < rel.length; i++) {
    lines.push(`  - title: "${prettyTitleFromMarkdown(sorted[i]).replace(/"/g, '\\"')}"`);
    lines.push(`    path: "${rel[i]}"`);
  }
  return lines.join("\n") + "\n";
}

async function ensureContentPagesYml() {
  const exists = await fs.stat(contentPagesYml).then((st) => st.isFile()).catch(() => false);
  if (exists) {
    return;
  }
  const markdownFiles = await collectMarkdownFiles(contentDir);
  if (markdownFiles.length <= 1) {
    return;
  }
  await fs.writeFile(contentPagesYml, buildPagesYml(markdownFiles), "utf8");
  console.error(`generated: ${path.posix.join("content", "pages.yml")}`);
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || "/", "http://127.0.0.1");
    if (u.pathname.includes("..")) {
      res.writeHead(400);
      return res.end("bad path");
    }
    let p = u.pathname === "/" || u.pathname === "" ? "index.html" : u.pathname.replace(/^\//, "");
    p = path.posix.normalize(p);
    if (p.startsWith("..")) {
      res.writeHead(400);
      return res.end("bad path");
    }
    const f = path.join(root, p);
    const st = await fs.stat(f).catch(() => null);
    if (!st || !st.isFile()) {
      res.writeHead(404);
      return res.end("not found: " + u.pathname);
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(await fs.readFile(f));
  } catch (e) {
    res.writeHead(500);
    res.end(String(e instanceof Error ? e.message : e));
  }
});

void (async () => {
  await ensureContentPagesYml();
  server.listen(port, host, () => {
    console.error(`http://${host === "0.0.0.0" ? "127.0.0.1" : host}:${port}`);
  });
})();
