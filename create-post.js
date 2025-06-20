#!/usr/bin/env node

/**
 * Simple blog post generator
 * Usage: node create-post.js "Post Title" [tag1,tag2,tag3]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function createBlogPost(title, tags = [], excerpt = '') {
  const date = new Date();
  const dateStr = formatDate(date);
  const slug = slugify(title);
  const filename = `${dateStr}-${slug}.md`;
  const filepath = path.join(__dirname, 'blog', 'posts', filename);
  
  const frontmatter = `---
title: "${title}"
date: "${dateStr}"
author: "Ben Tossell"
tags: [${tags.map(tag => `"${tag.trim()}"`).join(', ')}]
excerpt: "${excerpt}"
---

# ${title}

Your content goes here...

## Subheading

Add your content with full markdown support:

- **Bold text**
- *Italic text*
- \`inline code\`
- [Links](https://example.com)

### Code Blocks

\`\`\`javascript
// Your code here
console.log('Hello, world!');
\`\`\`

### Images

![Alt text](path/to/image.jpg)

*Image caption*

### Videos

You can embed videos using HTML:

\`\`\`html
<video controls width="100%">
  <source src="path/to/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
\`\`\`

Or embed from platforms like YouTube:

\`\`\`html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>
\`\`\`

---

*Thanks for reading! Share your thoughts on [Twitter](https://x.com/claude).*
`;

  // Write the file
  fs.writeFileSync(filepath, frontmatter);
  
  // Update the blog index
  updateBlogIndex(title, filename, dateStr);
  
  return { filepath, filename };
}

function updateBlogIndex(title, filename, date) {
  const indexPath = path.join(__dirname, 'blog', 'index.md');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Create new post entry
  const newEntry = `- [${title}](/blog/posts/${filename}) - *${formatDateForDisplay(new Date(date))}*`;
  
  // Find the "## Latest Posts" section and add the new entry at the top
  const latestPostsRegex = /(## Latest Posts\n\n)(- .*\n)*/;
  const match = indexContent.match(latestPostsRegex);
  
  if (match) {
    const existingPosts = match[0].replace('## Latest Posts\n\n', '');
    const updatedPosts = `## Latest Posts\n\n${newEntry}\n${existingPosts}`;
    indexContent = indexContent.replace(latestPostsRegex, updatedPosts);
  } else {
    // If no "Latest Posts" section exists, add it
    indexContent += `\n\n## Latest Posts\n\n${newEntry}\n`;
  }
  
  fs.writeFileSync(indexPath, indexContent);
}

function formatDateForDisplay(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Command line interface
async function promptForInput() {
  const title = await askQuestion('Post title: ');
  if (!title.trim()) {
    console.log('Title is required!');
    process.exit(1);
  }
  
  const tagsInput = await askQuestion('Tags (comma-separated, optional): ');
  const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  const excerpt = await askQuestion('Excerpt (optional): ');
  
  return { title: title.trim(), tags, excerpt: excerpt.trim() };
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main execution
async function main() {
  console.log('🚀 Blog Post Generator\n');
  
  // Check if running from command line with arguments
  const args = process.argv.slice(2);
  
  let title, tags, excerpt;
  
  if (args.length > 0) {
    title = args[0];
    tags = args[1] ? args[1].split(',').map(tag => tag.trim()) : [];
    excerpt = args[2] || '';
  } else {
    // Interactive mode
    const input = await promptForInput();
    title = input.title;
    tags = input.tags;
    excerpt = input.excerpt;
  }
  
  try {
    const { filepath, filename } = createBlogPost(title, tags, excerpt);
    console.log(`✅ Blog post created successfully!`);
    console.log(`📁 File: ${filepath}`);
    console.log(`🔗 URL: /blog/posts/${filename}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Edit the markdown file to add your content`);
    console.log(`2. Add any images to the assets/images/ directory`);
    console.log(`3. Commit and push your changes`);
  } catch (error) {
    console.error('❌ Error creating blog post:', error.message);
    process.exit(1);
  }
  
  rl.close();
}

if (require.main === module) {
  main();
}

module.exports = { createBlogPost, slugify, formatDate };