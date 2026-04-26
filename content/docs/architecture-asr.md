# Architecture ASR

[← yamd manual](index.md) · [Architecture](architecture.md) / [Research](../examples/research.md)

## shadcn/ui CDN availability

`shadcn/ui` is **not officially available** as a direct CDN-hosted library. The project is intentionally built as a **copy-paste component system**: you install component source code into your codebase with the CLI (`npx shadcn@latest add`) and own the implementation.

This model is preferred because it enables:

- Full source ownership and customization
- Better long-term maintainability than a remote black-box dependency
- Predictable integration with Tailwind and project-local conventions

## Community CDN options (unofficial)

There are community-maintained CDN approaches, but they are **not official shadcn/ui distributions**:

- `shadcdn` (Magic Patterns), published as an ESM module via jsDelivr:
  - `https://cdn.jsdelivr.net/npm/shadcdn/+esm`
- Community npm packages such as `@shadcn/ui` or `shadcn-ui` mirrored on jsDelivr (can be outdated, incomplete, or divergent from official components)

## Framework-agnostic alternatives

If you need shadcn-like design without React or CLI installation:

- `franken/ui`: HTML-first and framework-agnostic (blends shadcn-style design with UIkit 3), usable with Astro, Laravel, and plain HTML
- `Basecoat UI`: pure HTML + Tailwind approach inspired by shadcn design principles, suitable for simpler include-based workflows

## Recommendation

Use the **official CLI-driven approach** for production work by default.  
Community CDNs can introduce:

- Version mismatches
- Missing peer dependencies (for example Radix primitives)
- Reduced support and upgrade clarity

ASR decision: prefer official `shadcn/ui` CLI integration, treat CDN variants as best-effort community workarounds only.
