# Agents (bentossell/bentossell)

Agents that operate on this repo (personal site + blog). For broader context see the [README](README.md).

## Available Agents

### knowledge-graph-maintainer
- Scope (this repo): keep docs, links, and indices in sync across `blog/`, `assets/`, and root docs.  
- When to use: after creating/moving/renaming files; after adding a blog post.  
- Inputs: changed paths (e.g., `blog/posts/*.md`, `blog/index.md`, `BLOG.md`, `tools.md`, `investments.md`, `assets/images/*`).  
- Actions/Outputs: verify/update bi-directional links; ensure new posts appear in `blog/index.md` (or fix if `create-post.js` missed it); cross-link new/edited docs; open a small PR.

### documentation-specialist
- Scope (this repo): author/edit `BLOG.md`, `tools.md`, `investments.md`, and improve `README.md`.  
- When to use: need clear docs, guides, or cleanup.  
- Inputs: prompts, repo files, notes.  
- Outputs: concise markdown with cross-links and examples relevant to this site.

## Automations in this repo
- `create-post.js` — blog post generator. Run `npm run new-post` or `node create-post.js`. It creates `blog/posts/YYYY-MM-DD-slug.md` and updates `blog/index.md`. See [BLOG](BLOG.md).  
- After generating a post, run knowledge-graph-maintainer to validate links and indices.

## Conventions (repo-specific)
- Bi-directional links: if A links to B, add a link back from B → A (e.g., `README.md` ↔ `agents.md`).  
- Blog: `blog/index.md` lists posts; each post should include a simple “Back to Blog” footer (recommended).  
- New docs: keep them short/actionable and cross-link from relevant pages.

## How to add a new agent (for this repo)
1. Define scope, purpose, inputs, outputs for this repo.  
2. Add an H3 entry under “Available Agents”.  
3. Cross-link `agents.md` ↔ relevant files (e.g., `README.md`, `BLOG.md`).  
4. Open a small PR.

---

Back to the [README](README.md) • 2025-09-21
