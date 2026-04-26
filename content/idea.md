---
title: "Idea"
---

# Idea

[← Framework home](#content/docs/index) · [Philosophy](#content/docs/philosophy) · [Architecture](#content/docs/architecture)

Content delivery hands the browser a **string**; `compile` turns it into `{ meta, parts }`; the renderer only consumes that object. This keeps the transport (HTTP, `file`, CMS) separate from the view.
