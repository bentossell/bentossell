# Agents

This repo tracks the assistants powering my knowledge system. For context on the wider project see the [README](README.md).

## Available Agents

### knowledge-graph-maintainer
- Purpose: keeps docs in sync; updates `CLAUDE.md` + directory `.md` files when files move, rename, or new agents appear.  
- When to use: any structural change (create/move/rename) or adding an agent.  
- Inputs: file/folder events, new-agent definitions.  
- Outputs: updated markdown docs, commit/PR notes.

### documentation-specialist
- Purpose: researches + writes clear, complete project docs.  
- When to use: need deep docs, API refs, or synthesis.  
- Inputs: raw code, specs, questions.  
- Outputs: concise markdown docs, diagrams, examples.

## Conventions
- Bi-directional links: if A links to B, B must link to A.  
- New agents: add entry here and cross-link related docs.  
- Keep docs short, actionable; prefer lists > prose.

## How to add a new agent
1. Define purpose, inputs, outputs.  
2. Add an H3 entry under “Available Agents”.  
3. Link agents.md ↔ relevant files (e.g., README).  
4. Open a small PR.

---

Back to the [README](README.md) • 2025-09-21
