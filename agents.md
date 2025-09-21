# Agents Guide (bentossell/bentossell)

This is my personal website. Use this guide to add features while keeping the same stack, look, and patterns.

## Architecture Overview
- Static site: `index.html` + `assets/css/styles.css` + Markdown content.
- Blog content: `blog/index.md` (listing) and `blog/posts/*.md` (posts with YAML-like frontmatter).
- Client-side rendering: `marked.js` parses Markdown in the browser; posts loaded from GitHub raw.
- Post generation: `create-post.js` script creates `blog/posts/YYYY-MM-DD-slug.md` and updates `blog/index.md`.
- Local preview: `npm run serve` (Python SimpleHTTPServer on http://localhost:8000).

## Languages & Tools
- HTML, CSS, vanilla JavaScript (no framework/build step).
- Node.js for the post generator; Python for local serving.
- No external backend or database.

## Design System & UI Patterns
- Typography: Google Fonts Inter (300/400/600).
- Layout: top bar with actions; left sidebar; resizable divider; tabbed main content (investments/tools/blog).
- Icons: Lucide inline SVGs; keep size ~24px in header buttons.
- Colors: CSS custom properties in `assets/css/styles.css`; supports light/dark mode via `body.dark-mode`.
- Components: badges, file headers, diff blocks, blog typography styles; keep spacing and sizes consistent.
- Keyboard: `i`/`t`/`b` for tab nav; `Cmd/Ctrl+K` to toggle command palette.

## Blog Conventions
- File name: `YYYY-MM-DD-slug.md`.
- Frontmatter keys: `title`, `date`, `author`, `tags`, `excerpt` (YAML-like top block).
- Links and media: standard Markdown; avoid inline scripts or untrusted HTML.
- Blog index: `blog/index.md` lists posts; generator inserts newest first.

## Security Considerations
- Content is rendered with `marked.parse` and injected as HTML; only add trusted Markdown.
- Do not add `<script>` tags or unsafe inline JS to posts.
- External links should use `target="_blank" rel="noopener"` (already applied where rendered).
- No secrets/keys in repo; commit info uses public GitHub APIs client-side.

## Git Workflow
- Branch from `main`; small, focused PRs.
- Fast-forward merges only; open a PR for all changes.
- Commit style: `feat:`, `fix:`, `docs:` etc.; write clear messages.
- Before opening PR: preview locally, test dark mode + mobile, verify keyboard shortcuts still work.

## Coding Conventions
- Keep it simple (HTML/CSS/vanilla JS). Avoid adding frameworks or build tooling.
- Reuse existing CSS tokens and classes; match spacing, sizes, and icon style.
- Put images in `assets/images/`; follow `assets/images/README.md` for required icons (`favicon.png`, `apple-touch-icon.png`, `card.jpg`).
- Keep Markdown concise; prefer lists; maintain consistent tone.

## Common Tasks
- New post: `npm run new-post` → edit generated file → commit.
- Local preview: `npm run serve` and visit http://localhost:8000.
- Styling tweaks: edit `assets/css/styles.css`; ensure dark mode parity.

## Minimal Directory Map
- `index.html` — app shell, UI, client-side blog renderer.
- `assets/css/styles.css` — design tokens + components + dark mode.
- `assets/images/` — icons/OG images (see README in folder).
- `blog/index.md` — blog landing + post list.
- `blog/posts/*.md` — individual posts.
- `create-post.js` — post generator.
- `README.md` — short bio.

## PR Checklist (for agents)
- [ ] Matches existing design (typography, spacing, icons)
- [ ] Light/dark mode verified
- [ ] Keyboard shortcuts unaffected
- [ ] Mobile layout OK
- [ ] No unsafe HTML/scripts in Markdown
- [ ] No new build/deps introduced without approval
