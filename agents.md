# Agents (bentossell/bentossell)

Small, practical agents that operate on this repo (static site + blog). All actions map to files here.

## Available agents

### blog-post-generator
- Purpose: create a new post and update the blog index.
- Inputs: title, optional tags, optional excerpt.
- How to run:
  - `npm run new-post` or `node create-post.js "Post Title" "tag1,tag2" "Short excerpt"`
- Outputs:
  - New file in `blog/posts/YYYY-MM-DD-slug.md` with frontmatter
  - Updated `blog/index.md` entry
- Source: [`create-post.js`](create-post.js), see [BLOG](BLOG.md)

### image-assets-checker
- Purpose: ensure required images exist for icons/OG previews.
- Inputs: files in `assets/images/`.
- Checks:
  - `favicon.png` (32x32)
  - `apple-touch-icon.png` (180x180)
  - `card.jpg` (1200x630)
- Output: ready-to-ship images per [assets/images/README](assets/images/README.md)

### docs-curator
- Purpose: keep written pages tidy and cross-referenced.
- Scope: `BLOG.md`, `blog/index.md`, `tools.md`, `investments.md`.
- Actions:
  - Verify new posts appear in `blog/index.md` (generator should do this; fix if missing)
  - Keep lists concise and up to date
  - Add minimal cross-links where relevant (e.g., from a post to tools/investments)

### local-preview
- Purpose: run the site locally for review.
- How to run: `npm run serve` (Python simple HTTP server at http://localhost:8000)
- Inputs: current repo state
- Output: locally rendered site using `index.html` + `assets/css/styles.css`

## Notes
- Blog rendering is client-side via `marked.js` in `index.html`.
- Blog posts require YAML-like frontmatter at the top (see examples in `blog/posts/`).

Back to the [README](README.md).
