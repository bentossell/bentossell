---
title: "First Blog Post - Building This Blog"
date: "2024-05-23"
author: "Ben Tossell"
tags: ["web development", "markdown", "blogging"]
excerpt: "How I built a simple but powerful blog system using just HTML, CSS, and JavaScript"
---

# Building This Blog

Welcome to my new blog! I wanted to share how I built this simple yet powerful blog system.

## The Requirements

I needed something that was:
- **Fast** - no complex frameworks or databases
- **Simple** - easy to write and deploy
- **Flexible** - support for text, images, videos, and code
- **Maintainable** - easy to add new posts

## The Tech Stack

This blog is built with:
- **HTML/CSS/JavaScript** - no frameworks needed
- **Markdown** - for easy content creation
- **GitHub** - for hosting and version control
- **marked.js** - for markdown parsing

## Adding Rich Content

The blog supports various content types:

### Code Blocks

```javascript
function createBlogPost(title, content) {
  return {
    title,
    content,
    date: new Date().toISOString()
  };
}
```

### Images

![Example Image](https://via.placeholder.com/600x300/4f46e5/ffffff?text=Blog+Image)

*Images are fully supported with captions*

### Videos

You can embed videos using standard HTML5 video tags or iframe embeds for YouTube/Vimeo.

### Lists and Formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- `inline code` for technical terms
- [Links](https://bensbites.com) work perfectly

## What's Next

I plan to add:
1. Search functionality
2. RSS feed generation
3. Better navigation between posts
4. Comments system (maybe?)

The beauty of this system is its simplicity - everything is just markdown files that get rendered on the fly.

---

*That's it for now! More posts coming soon.*