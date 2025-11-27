// Terminal state
const state = {
    history: [],
    historyIndex: -1,
    theme: localStorage.getItem('terminal-theme') || 'midnight'
};

// Content data
const content = {
    now: [
        { text: 'founder & solo-gp', link: 'https://bensbites.com', linkText: "ben's bites" },
        { text: 'i invest $100-200k into technical founders building technical tools' },
        { text: 'head of dev rel @', link: 'https://factory.ai', linkText: 'Factory' },
        { text: 'i write a newsletter where I show what tools im building with. 140k+ love it' },
        { text: 'twin dad (1 of each btw)' }
    ],
    prev: [
        { text: 'built and sold the biggest no-code community, makerpad, to zapier (in 18 months)' },
        { text: 'scouted for a16z and invested in; gamma, cosine, julius.ai, lex, texel, llamaindex' },
        { text: 'led the product hunt community & homepage, testing 1000s of products' },
        { text: 'lived in china when I was in uni' }
    ],
    social: [
        { text: 'twitter/x', link: 'https://x.com/bentossell' },
        { text: 'linkedin', link: 'https://linkedin.com/in/ben-tossell-70453537' },
        { text: 'github', link: 'https://github.com/bentossell' }
    ],
    contact: [
        { text: 'email: ben@bensbites.com' },
        { text: 'twitter: @bentossell' }
    ]
};

// Available themes
const themes = ['midnight', 'phosphor', 'amber', 'matrix', 'contrast'];

// Commands registry
const commands = {
    help: {
        desc: 'show available commands',
        fn: () => {
            const lines = [
                '',
                '  <span class="accent">Available Commands:</span>',
                '',
                '  <span class="cmd">help</span>          show this help message',
                '  <span class="cmd">whoami</span>        who is ben tossell',
                '  <span class="cmd">now</span>           what im currently doing',
                '  <span class="cmd">prev</span>          previous work & history',
                '  <span class="cmd">investments</span>   my investment portfolio',
                '  <span class="cmd">tools</span>         tools i use daily',
                '  <span class="cmd">blog</span>          blog posts',
                '  <span class="cmd">social</span>        social links',
                '  <span class="cmd">contact</span>       get in touch',
                '  <span class="cmd">theme</span>         list available themes',
                '  <span class="cmd">theme [name]</span>  switch theme',
                '  <span class="cmd">clear</span>         clear the terminal',
                '  <span class="cmd">music</span>         toggle music player',
                ''
            ];
            return lines.join('\n');
        }
    },
    whoami: {
        desc: 'who is ben tossell',
        fn: () => {
            return `
  <span class="accent">Ben Tossell</span>

  Builder, investor, and writer based in the UK.
  
  I build tools, invest in technical founders, and write about
  what I'm learning along the way. Previously built Makerpad
  (acquired by Zapier) and led community at Product Hunt.
  
  Type <span class="cmd">now</span> to see what I'm currently up to.
`;
        }
    },
    about: {
        desc: 'alias for whoami',
        fn: () => commands.whoami.fn()
    },
    now: {
        desc: 'current activities',
        fn: () => {
            let output = '\n  <span class="accent">Currently:</span>\n\n';
            content.now.forEach(item => {
                if (item.link) {
                    output += `  • ${item.text} <a href="${item.link}" target="_blank" rel="noopener">${item.linkText}</a>\n`;
                } else {
                    output += `  • ${item.text}\n`;
                }
            });
            return output;
        }
    },
    prev: {
        desc: 'previous work',
        fn: () => {
            let output = '\n  <span class="accent">Previously:</span>\n\n';
            content.prev.forEach(item => {
                output += `  • ${item.text}\n`;
            });
            return output;
        }
    },
    history: {
        desc: 'alias for prev',
        fn: () => commands.prev.fn()
    },
    social: {
        desc: 'social links',
        fn: () => {
            let output = '\n  <span class="accent">Social Links:</span>\n\n';
            content.social.forEach(item => {
                output += `  • <a href="${item.link}" target="_blank" rel="noopener">${item.text}</a>\n`;
            });
            return output;
        }
    },
    contact: {
        desc: 'contact info',
        fn: () => {
            let output = '\n  <span class="accent">Contact:</span>\n\n';
            content.contact.forEach(item => {
                output += `  • ${item.text}\n`;
            });
            output += '\n  Feel free to reach out!\n';
            return output;
        }
    },
    theme: {
        desc: 'change theme',
        fn: (args) => {
            if (!args || args.length === 0) {
                let output = '\n  <span class="accent">Available Themes:</span>\n\n';
                themes.forEach(t => {
                    const current = t === state.theme ? ' <span class="muted">(current)</span>' : '';
                    output += `  • <span class="cmd">${t}</span>${current}\n`;
                });
                output += '\n  Usage: <span class="cmd">theme [name]</span>\n';
                return output;
            }
            const themeName = args[0].toLowerCase();
            if (themes.includes(themeName)) {
                setTheme(themeName);
                return `\n  Theme changed to <span class="accent">${themeName}</span>\n`;
            }
            return `\n  <span class="error">Unknown theme: ${themeName}</span>\n  Type <span class="cmd">theme</span> to see available themes.\n`;
        }
    },
    clear: {
        desc: 'clear terminal',
        fn: () => {
            setTimeout(() => {
                document.getElementById('output').innerHTML = '';
            }, 10);
            return '';
        }
    },
    investments: {
        desc: 'investment portfolio',
        fn: async () => {
            appendOutput('\n  <span class="muted">Loading investments...</span>\n');
            try {
                const resp = await fetch('https://raw.githubusercontent.com/bentossell/bentossell/main/investments.md');
                if (!resp.ok) throw new Error('Failed to fetch');
                const text = await resp.text();
                const formatted = formatMarkdown(text);
                clearLastLine();
                return '\n  <span class="accent">Investments:</span>\n\n' + formatted;
            } catch (e) {
                clearLastLine();
                return '\n  <span class="error">Failed to load investments</span>\n';
            }
        }
    },
    tools: {
        desc: 'tools i use',
        fn: async () => {
            appendOutput('\n  <span class="muted">Loading tools...</span>\n');
            try {
                const resp = await fetch('https://raw.githubusercontent.com/bentossell/bentossell/main/tools.md');
                if (!resp.ok) throw new Error('Failed to fetch');
                const text = await resp.text();
                const formatted = formatMarkdown(text);
                clearLastLine();
                return '\n  <span class="accent">Tools I Use:</span>\n\n' + formatted;
            } catch (e) {
                clearLastLine();
                return '\n  <span class="error">Failed to load tools</span>\n';
            }
        }
    },
    blog: {
        desc: 'blog posts',
        fn: async (args) => {
            if (args && args.length > 0) {
                return await loadBlogPost(args[0]);
            }
            appendOutput('\n  <span class="muted">Loading blog...</span>\n');
            try {
                const resp = await fetch('https://raw.githubusercontent.com/bentossell/bentossell/main/blog/index.md');
                if (!resp.ok) throw new Error('Failed to fetch');
                const text = await resp.text();
                const formatted = formatBlogIndex(text);
                clearLastLine();
                return '\n  <span class="accent">Blog Posts:</span>\n\n' + formatted + '\n  Type <span class="cmd">blog [slug]</span> to read a post.\n';
            } catch (e) {
                clearLastLine();
                return '\n  <span class="error">Failed to load blog</span>\n';
            }
        }
    },
    music: {
        desc: 'toggle music player',
        fn: () => {
            const player = document.getElementById('music-player');
            if (player) {
                player.classList.toggle('visible');
                return player.classList.contains('visible') 
                    ? '\n  Music player shown. Click play to start.\n' 
                    : '\n  Music player hidden.\n';
            }
            return '\n  <span class="error">Music player not available</span>\n';
        }
    },
    // Easter eggs
    sudo: {
        desc: 'nice try',
        fn: () => '\n  <span class="error">Nice try, but you don\'t have sudo access here.</span>\n'
    },
    'rm': {
        desc: 'nice try',
        fn: (args) => {
            if (args && args.join(' ').includes('-rf')) {
                return '\n  <span class="error">NICE TRY! This terminal is protected.</span>\n';
            }
            return '\n  <span class="error">rm: command not available in this terminal</span>\n';
        }
    },
    exit: {
        desc: 'exit terminal',
        fn: () => '\n  <span class="muted">There is no escape. You\'re stuck here with me.</span>\n'
    },
    vim: {
        desc: 'editor wars',
        fn: () => '\n  <span class="accent">Vim is great.</span> But this isn\'t that kind of terminal.\n'
    },
    emacs: {
        desc: 'editor wars',
        fn: () => '\n  <span class="muted">Emacs users... I see you.</span>\n'
    },
    ls: {
        desc: 'list files',
        fn: () => '\n  README.md  investments.md  tools.md  blog/\n\n  <span class="muted">Try: whoami, now, investments, tools, blog</span>\n'
    },
    cat: {
        desc: 'cat file',
        fn: (args) => {
            if (!args || args.length === 0) {
                return '\n  <span class="error">cat: missing file argument</span>\n';
            }
            const file = args[0].toLowerCase();
            if (file.includes('readme')) {
                return commands.whoami.fn();
            }
            if (file.includes('investment')) {
                return commands.investments.fn();
            }
            if (file.includes('tool')) {
                return commands.tools.fn();
            }
            return `\n  <span class="error">cat: ${args[0]}: No such file</span>\n`;
        }
    },
    cd: {
        desc: 'change directory',
        fn: () => '\n  <span class="muted">You\'re already home.</span>\n'
    },
    pwd: {
        desc: 'print working directory',
        fn: () => '\n  /home/ben\n'
    },
    echo: {
        desc: 'echo text',
        fn: (args) => args ? '\n  ' + args.join(' ') + '\n' : '\n'
    },
    date: {
        desc: 'show date',
        fn: () => '\n  ' + new Date().toString() + '\n'
    },
    neofetch: {
        desc: 'system info',
        fn: () => `
  <span class="accent">       _</span>          ben@tossell
  <span class="accent">      (_)</span>         -----------
  <span class="accent">   ___ _  ___</span>     OS: Human 1.0
  <span class="accent">  / __| |/ _ \\</span>    Host: Earth
  <span class="accent">  \\__ \\ |  __/</span>    Kernel: Coffee-powered
  <span class="accent">  |___/_|\\___|</span>    Uptime: ${getAge()} years
                    Shell: bash
                    Terminal: ben.tossell
`
    }
};

function getAge() {
    const birth = new Date(1991, 0, 1);
    const now = new Date();
    return Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000));
}

function formatMarkdown(text) {
    const lines = text.split('\n');
    let output = '';
    lines.forEach(line => {
        let formatted = line
            .replace(/^### (.+)$/, '<span class="accent">$1</span>')
            .replace(/^## (.+)$/, '<span class="accent">$1</span>')
            .replace(/^# (.+)$/, '<span class="accent">$1</span>')
            .replace(/\*\*(.+?)\*\*/g, '<span class="bold">$1</span>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/^- (.+)$/, '  • $1')
            .replace(/^\* (.+)$/, '  • $1');
        output += '  ' + formatted + '\n';
    });
    return output;
}

function formatBlogIndex(text) {
    const lines = text.split('\n');
    let output = '';
    const postPattern = /\[([^\]]+)\]\(\/blog\/posts\/([^)]+)\)/;
    lines.forEach(line => {
        const match = line.match(postPattern);
        if (match) {
            const title = match[1];
            const slug = match[2].replace('.md', '');
            output += `  • <span class="cmd">${slug}</span> - ${title}\n`;
        }
    });
    return output || '  No posts found.\n';
}

async function loadBlogPost(slug) {
    appendOutput('\n  <span class="muted">Loading post...</span>\n');
    try {
        const resp = await fetch(`https://raw.githubusercontent.com/bentossell/bentossell/main/blog/posts/${slug}.md`);
        if (!resp.ok) throw new Error('Not found');
        const text = await resp.text();
        const content = text.replace(/^---[\s\S]*?---\n/, '');
        const formatted = formatMarkdown(content);
        clearLastLine();
        return '\n' + formatted;
    } catch (e) {
        clearLastLine();
        return `\n  <span class="error">Post not found: ${slug}</span>\n  Type <span class="cmd">blog</span> to see available posts.\n`;
    }
}

function clearLastLine() {
    const output = document.getElementById('output');
    const lines = output.innerHTML.split('\n');
    lines.pop();
    lines.pop();
    output.innerHTML = lines.join('\n');
}

function appendOutput(text) {
    const output = document.getElementById('output');
    output.innerHTML += text;
    scrollToBottom();
}

function scrollToBottom() {
    const terminal = document.getElementById('terminal-body');
    terminal.scrollTop = terminal.scrollHeight;
}

function setTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    state.theme = themeName;
    localStorage.setItem('terminal-theme', themeName);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
}

async function executeCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    state.history.push(trimmed);
    state.historyIndex = state.history.length;
    
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    appendOutput(`<span class="prompt">$</span> ${escapeHtml(trimmed)}\n`);
    
    if (commands[cmd]) {
        const result = await commands[cmd].fn(args);
        if (result) {
            appendOutput(result + '\n');
        }
    } else {
        appendOutput(`\n  <span class="error">Command not found: ${cmd}</span>\n  Type <span class="cmd">help</span> for available commands.\n\n`);
    }
    
    scrollToBottom();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCompletions(partial) {
    const cmdNames = Object.keys(commands);
    return cmdNames.filter(c => c.startsWith(partial.toLowerCase()));
}

async function boot() {
    const output = document.getElementById('output');
    const lines = [
        'Initializing terminal...',
        'Loading modules... done',
        'Connecting to ben.tossell... connected',
        ''
    ];
    
    for (const line of lines) {
        output.innerHTML += `<span class="muted">${line}</span>\n`;
        await sleep(150);
        scrollToBottom();
    }
    
    output.innerHTML += `<span class="accent ascii-art">
  ██████╗   ███████╗  ███╗   ██╗
  ██╔══██╗  ██╔════╝  ████╗  ██║
  ██████╔╝  █████╗    ██╔██╗ ██║
  ██╔══██╗  ██╔══╝    ██║╚██╗██║
  ██████╔╝  ███████╗  ██║ ╚████║
  ╚═════╝   ╚══════╝  ╚═╝  ╚═══╝

  ████████╗  ██████╗   ███████╗  ███████╗  ███████╗  ██╗       ██╗
  ╚══██╔══╝  ██╔═══██╗  ██╔════╝  ██╔════╝  ██╔════╝  ██║       ██║
     ██║     ██║   ██║  ███████╗  ███████╗  █████╗    ██║       ██║
     ██║     ██║   ██║  ╚════██║  ╚════██║  ██╔══╝    ██║       ██║
     ██║     ╚██████╔╝  ███████║  ███████║  ███████╗  ███████╗  ███████╗
     ╚═╝      ╚═════╝   ╚══════╝  ╚══════╝  ╚══════╝  ╚══════╝  ╚══════╝
</span>
`;
    await sleep(100);
    
    output.innerHTML += `
  Welcome to my terminal. Type <span class="cmd">help</span> to see available commands.

`;
    scrollToBottom();
    
    document.getElementById('command-input').focus();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command-input');
    const form = document.getElementById('command-form');
    
    setTheme(state.theme);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = input.value;
        input.value = '';
        await executeCommand(value);
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                input.value = state.history[state.historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                input.value = state.history[state.historyIndex] || '';
            } else {
                state.historyIndex = state.history.length;
                input.value = '';
            }
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            const value = input.value.trim();
            if (value) {
                const completions = getCompletions(value);
                if (completions.length === 1) {
                    input.value = completions[0] + ' ';
                } else if (completions.length > 1) {
                    appendOutput(`<span class="prompt">$</span> ${value}\n`);
                    appendOutput(`<span class="muted">${completions.join('  ')}</span>\n\n`);
                    scrollToBottom();
                }
            }
        }
        else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            document.getElementById('output').innerHTML = '';
        }
        else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            appendOutput(`<span class="prompt">$</span> ${input.value}^C\n\n`);
            input.value = '';
        }
    });
    
    document.getElementById('terminal').addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            input.focus();
        }
    });
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
    
    document.getElementById('help-btn')?.addEventListener('click', async () => {
        await executeCommand('help');
    });
    
    boot();
});
