# bentossell

Ben Tossell's personal website, presented as an agent app.

## Edit a thread

Each sidebar thread is a Markdown file in `threads/`.

```text
threads/
  about.md
  investments.md
  products-i-love.md
  now.md
  previously.md
```

The frontmatter controls the sidebar and simulated question:

```md
---
id: about
title: About me
slug: about-me
question: Who is Ben?
---

Write the answer here.
```

Use normal paragraphs, `##` headings, blockquotes, links, and list rows in this form:

```md
- **Label:** Value
```

Change the order in `threads/index.json`. Add a new filename there to add a thread.

## Run locally

```bash
npm run dev
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The Markdown files must be served over HTTP, so opening `index.html` directly will not load them.

## Main files

- `index.html` — interface, Markdown loader, and interactions
- `threads/*.md` — editable thread content
- `threads/index.json` — thread order
