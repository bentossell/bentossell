# Blog System

This website now includes a powerful blog system that supports rich markdown content including text, images, videos, code blocks, and more.

## 🚀 Quick Start

### Creating a New Blog Post

**Option 1: Interactive Mode**
```bash
npm run new-post
```
or
```bash
node create-post.js
```

The script will prompt you for:
- Post title
- Tags (comma-separated, optional)
- Excerpt (optional)

**Option 2: Command Line Arguments**
```bash
node create-post.js "My Amazing Post Title" "tech,javascript,blogging" "This is a short excerpt"
```

### What Gets Created

The script automatically:
1. Creates a new markdown file in `blog/posts/` with the format `YYYY-MM-DD-post-slug.md`
2. Adds proper frontmatter with metadata
3. Updates the blog index to include your new post
4. Provides a template with examples of different content types

## 📝 Content Support

The blog supports all standard markdown features plus:

### Text Formatting
- **Bold text**
- *Italic text*
- `inline code`
- [Links](https://example.com)
- > Blockquotes

### Code Blocks
```javascript
function hello() {
  console.log('Hello, world!');
}
```

### Images
```markdown
![Alt text](path/to/image.jpg)
*Optional caption*
```

### Videos
HTML5 video:
```html
<video controls width="100%">
  <source src="path/to/video.mp4" type="video/mp4">
</video>
```

YouTube embed:
```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
```

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

## 🏗️ File Structure

```
blog/
├── index.md              # Blog homepage with post listing
└── posts/
    ├── 2024-05-23-building-this-blog.md
    ├── 2024-05-20-investment-philosophy.md
    └── ... (your new posts)
```

## 📋 Frontmatter

Each blog post includes metadata at the top:

```yaml
---
title: "Your Post Title"
date: "2024-05-23"
author: "Ben Tossell"
tags: ["tag1", "tag2", "tag3"]
excerpt: "A brief description of your post"
---
```

## 🎨 Styling

The blog uses the same design system as the rest of the site:
- Automatic dark/light mode support
- Responsive design
- Consistent typography
- Code syntax highlighting
- Mobile-optimized navigation

## 🔧 Technical Details

- **Markdown Parser**: Uses marked.js for rich markdown rendering
- **Frontmatter**: YAML-style metadata parsing
- **Navigation**: Single-page app with client-side routing
- **Images**: Automatic responsive sizing and styling
- **Accessibility**: Proper semantic HTML and keyboard navigation

## 🚀 Publishing

1. Create your post using `npm run new-post`
2. Edit the generated markdown file with your content
3. Add any images to the `assets/images/` directory
4. Commit and push your changes to GitHub
5. Your post will be live immediately!

## 💡 Tips

- **Images**: Store in `assets/images/` and reference as `assets/images/filename.jpg`
- **SEO**: Use descriptive titles and excerpts for better search visibility
- **Tags**: Use consistent tagging for better content organization
- **Links**: External links automatically open in new tabs
- **Code**: Use proper language tags for syntax highlighting

## 🎯 Navigation

- **Keyboard Shortcut**: Press `b` to navigate to the blog
- **Command Palette**: `Cmd+K` (or `Ctrl+K`) → Blog
- **Click Navigation**: Click the "blog" tab in the main interface

Enjoy blogging! 🎉