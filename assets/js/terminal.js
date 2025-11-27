// Terminal state
const state = {
  history: [],
  historyIndex: -1,
  theme: localStorage.getItem("terminal-theme") || "midnight",
  commandCount: 0,
};

// Fun vibes that rotate (changes every 8 seconds + on each command)
const vibes = [
  "building things",
  "shipping fast",
  "caffeinated ☕",
  "in the zone",
  "thinking...",
  "exploring ideas",
  "creating chaos",
  "vibing",
  "debugging life",
  "ctrl+c ctrl+v",
  "tabs not spaces",
  "git push -f",
  "rm -rf doubts",
  "npm install coffee",
  "making things",
  "iterating",
  "learning in public",
  "writing code",
  "breaking things",
  "fixing things",
  "one more feature...",
  "refactoring",
  "deep work",
  "inbox zero (jk)",
  "async mode",
];

// Available themes
const themes = ["midnight", "phosphor", "amber", "matrix", "contrast"];

// Commands registry
const commands = {
  help: {
    desc: "show available commands",
    fn: () => {
      const lines = [
        "",
        '  <span class="bold white">Available Commands</span>',
        "",
        '  <span class="cmd">help</span>          show this help message',
        '  <span class="cmd">whoami</span>        who is ben tossell',
        '  <span class="cmd">now</span>           what im doing',
        '  <span class="cmd">prev</span>          previous work',
        '  <span class="cmd">investments</span>   my investments',
        '  <span class="cmd">tools</span>         tools i use daily',
        '  <span class="cmd">models</span>        ai models i use',
        '  <span class="cmd">contact</span>       find me',
        '  <span class="cmd">theme</span>         list available themes',
        '  <span class="cmd">theme [name]</span>  switch theme',
        '  <span class="cmd">clear</span>         clear the terminal',
        '  <span class="cmd">music</span>         toggle music player',
        "",
        '  <span class="muted">tip: shift+tab to cycle themes</span>',
        "",
      ];
      return lines.join("\n");
    },
  },
  whoami: {
    desc: "who is ben tossell",
    fn: () => {
      return `
  <span class="bold white">Ben Tossell</span> <span class="muted">[2025]</span>
  ┌────────────────────────────────────────────────┐
  │  head of devrel      <a href="https://factory.ai" target="_blank" rel="noopener">Factory</a>                   │
  │  investor & writer   <a href="https://bensbites.com" target="_blank" rel="noopener">Ben's Bites</a>               │
  │  twin dad                                      │
  └────────────────────────────────────────────────┘

  i'm technically not technical, but technical enough to not be
  truly non-technical.

  technical, non-technical member of staff.

  type <span class="cmd">now</span> to see what i'm currently up to.
`;
    },
  },
  about: {
    desc: "alias for whoami",
    fn: () => commands.whoami.fn(),
  },
  now: {
    desc: "current activities",
    fn: () => {
      return `
  <span class="bold white">now:</span>

  • about to have baby number 3
  • shipping on github <a href="https://github.com/bentossell" target="_blank" rel="noopener">/bentossell</a> & <a href="https://github.com/factory-ben" target="_blank" rel="noopener">/factory-ben</a>
  • investing $100k into devtools & infra
  • writing <a href="https://bensbites.com" target="_blank" rel="noopener">ben's bites</a> newsletter
`;
    },
  },
  prev: {
    desc: "previous work",
    fn: () => {
      return `
  <span class="bold white">previously:</span>

  • founder, makerpad - sold to zapier (in 18 months) [2019-2021]
  • sequoia & a16z scout [2021-2025]
  • product hunt [2015-2017]
`;
    },
  },
  history: {
    desc: "alias for prev",
    fn: () => commands.prev.fn(),
  },
  contact: {
    desc: "find me",
    fn: () => {
      return `
  <span class="bold white">contact:</span>

  • <a href="https://x.com/bentossell" target="_blank" rel="noopener">twitter/x</a>
  • <a href="https://linkedin.com/in/ben-tossell-70453537" target="_blank" rel="noopener">linkedin</a>
  • <a href="https://github.com/bentossell" target="_blank" rel="noopener">github [personal]</a>
  • <a href="https://discord.gg/zuudFXxg69" target="_blank" rel="noopener">droid discord</a>
`;
    },
  },
  social: {
    desc: "alias for contact",
    fn: () => commands.contact.fn(),
  },
  theme: {
    desc: "change theme",
    fn: (args) => {
      if (!args || args.length === 0) {
        let output = '\n  <span class="bold white">Available Themes</span>\n\n';
        themes.forEach((t) => {
          const current =
            t === state.theme ? ' <span class="muted">(current)</span>' : "";
          output += `  • <span class="cmd">${t}</span>${current}\n`;
        });
        output +=
          '\n  usage: <span class="cmd">theme [name]</span> or shift+tab to cycle\n';
        return output;
      }
      const themeName = args[0].toLowerCase();
      if (themes.includes(themeName)) {
        setTheme(themeName);
        return `\n  theme changed to <span class="accent">${themeName}</span>\n`;
      }
      return `\n  <span class="error">unknown theme: ${themeName}</span>\n  type <span class="cmd">theme</span> to see available themes.\n`;
    },
  },
  clear: {
    desc: "clear terminal",
    fn: () => {
      setTimeout(() => {
        document.getElementById("output").innerHTML = "";
      }, 10);
      return "";
    },
  },
  investments: {
    desc: "investment portfolio",
    fn: () => {
      return `
  <span class="bold white">Investments</span>

  <span class="bold white">Fund Performance</span>
  ┌──────────────────────┬──────────┬─────────┐
  │ Fund                 │ MOIC     │ IRR     │
  ├──────────────────────┼──────────┼─────────┤
  │ Fund I ['20/'21]     │ 4x       │ 39%     │
  │ Fund II ['23/'25]    │ 2x       │ 36%     │
  ├──────────────────────┼──────────┼─────────┤
  │ Fund III             │ <span class="muted">first close complete - open to new LPs</span>
  └──────────────────────┴──────────┴─────────┘

  <span class="bold white">Notable Companies</span>

  • <a href="https://supabase.com" target="_blank" rel="noopener">supabase</a> <span class="muted">[seed]</span> → <span class="success">$5BN</span>
  • <a href="https://gamma.app" target="_blank" rel="noopener">gamma</a> <span class="muted">[seed+ - a16z scout]</span> → <span class="success">$2.3BN</span> <span class="muted">[a16z led]</span>
  • <a href="https://etched.com" target="_blank" rel="noopener">etched</a> <span class="muted">[seed+]</span> → <span class="success">$2.5BN</span>
  • <a href="https://scribe.how" target="_blank" rel="noopener">scribe</a> <span class="muted">[seed]</span> → <span class="success">$1.3BN</span>
  • <a href="https://factory.ai" target="_blank" rel="noopener">factory</a> <span class="muted">[seed]</span>
  • <a href="https://sfcompute.com" target="_blank" rel="noopener">sf compute</a> <span class="muted">[pre-seed]</span>
  • <a href="https://flutterflow.io" target="_blank" rel="noopener">flutterflow</a> <span class="muted">[seed]</span>
  • <a href="https://wordware.ai" target="_blank" rel="noopener">wordware</a> <span class="muted">[pre-seed]</span>
  • <a href="https://pika.art" target="_blank" rel="noopener">pika</a> <span class="muted">[series A]</span>
  • <a href="https://crewai.com" target="_blank" rel="noopener">crewai</a> <span class="muted">[seed]</span>
  • <a href="https://julius.ai" target="_blank" rel="noopener">julius</a> <span class="muted">[pre-seed]</span>
`;
    },
  },
  tools: {
    desc: "tools i use",
    fn: () => {
      return `
  <span class="bold white">tools:</span>

  • <a href="https://factory.ai" target="_blank" rel="noopener">Factory</a> <span class="accent">[droid]</span>
  • <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
  • <a href="https://linear.app" target="_blank" rel="noopener">Linear</a>
  • <a href="https://granola.ai" target="_blank" rel="noopener">Granola</a>
  • <a href="https://ghostty.org" target="_blank" rel="noopener">Ghostty</a>
`;
    },
  },
  models: {
    desc: "ai models i use",
    fn: () => {
      return `
  <span class="bold white">models:</span>

  • opus 4.5 <span class="muted">[default model]</span>
  • sonnet 4.5 <span class="muted">[usual daily driver]</span>
  • gpt 5.1-codex <span class="muted">[bug fixes/code review]</span>
`;
    },
  },
  music: {
    desc: "toggle music player",
    fn: () => {
      const player = document.getElementById("music-player");
      if (player) {
        player.classList.toggle("visible");
        return player.classList.contains("visible")
          ? "\n  music player shown. click play to start.\n"
          : "\n  music player hidden.\n";
      }
      return '\n  <span class="error">music player not available</span>\n';
    },
  },
  sudo: {
    desc: "nice try",
    fn: () =>
      '\n  <span class="error">nice try, but you don\'t have sudo access here.</span>\n',
  },
  rm: {
    desc: "nice try",
    fn: (args) => {
      if (args && args.join(" ").includes("-rf")) {
        return '\n  <span class="error">NICE TRY! this terminal is protected.</span>\n';
      }
      return '\n  <span class="error">rm: command not available in this terminal</span>\n';
    },
  },
  exit: {
    desc: "exit terminal",
    fn: () =>
      '\n  <span class="muted">there is no escape. you\'re stuck here with me.</span>\n',
  },
  vim: {
    desc: "editor wars",
    fn: () =>
      '\n  <span class="accent">vim is great.</span> but this isn\'t that kind of terminal.\n',
  },
  emacs: {
    desc: "editor wars",
    fn: () => '\n  <span class="muted">emacs users... i see you.</span>\n',
  },
  ls: {
    desc: "list files",
    fn: () =>
      '\n  README.md  investments.md  tools.md\n\n  <span class="muted">try: whoami, now, investments, tools</span>\n',
  },
  cat: {
    desc: "cat file",
    fn: (args) => {
      if (!args || args.length === 0) {
        return '\n  <span class="error">cat: missing file argument</span>\n';
      }
      const file = args[0].toLowerCase();
      if (file.includes("readme")) {
        return commands.whoami.fn();
      }
      if (file.includes("investment")) {
        return commands.investments.fn();
      }
      if (file.includes("tool")) {
        return commands.tools.fn();
      }
      return `\n  <span class="error">cat: ${args[0]}: no such file</span>\n`;
    },
  },
  cd: {
    desc: "change directory",
    fn: () => '\n  <span class="muted">you\'re already home.</span>\n',
  },
  pwd: {
    desc: "print working directory",
    fn: () => "\n  /home/ben\n",
  },
  echo: {
    desc: "echo text",
    fn: (args) => (args ? "\n  " + args.join(" ") + "\n" : "\n"),
  },
  date: {
    desc: "show date",
    fn: () => "\n  " + new Date().toString() + "\n",
  },
  neofetch: {
    desc: "system info",
    fn: () => `
  <span class="accent">       _</span>          ben@tossell
  <span class="accent">      (_)</span>         -----------
  <span class="accent">   ___ _  ___</span>     OS: Human 1.0
  <span class="accent">  / __| |/ _ \\</span>    Host: Earth
  <span class="accent">  \\__ \\ |  __/</span>    Kernel: Coffee-powered
  <span class="accent">  |___/_|\\___|</span>    Uptime: ${getAge()} years
                    Shell: bash
                    Terminal: bentossell
`,
  },
};

function getAge() {
  const birth = new Date(1990, 7, 21);
  const now = new Date();
  return Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000));
}

function clearLastLine() {
  const output = document.getElementById("output");
  const lines = output.innerHTML.split("\n");
  lines.pop();
  lines.pop();
  output.innerHTML = lines.join("\n");
}

function appendOutput(text) {
  const output = document.getElementById("output");
  output.innerHTML += text;
  scrollToBottom();
}

function scrollToBottom() {
  const terminal = document.getElementById("terminal-body");
  terminal.scrollTop = terminal.scrollHeight;
}

function setTheme(themeName) {
  document.body.className = `theme-${themeName}`;
  state.theme = themeName;
  localStorage.setItem("terminal-theme", themeName);
}

function cycleTheme() {
  const currentIndex = themes.indexOf(state.theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  setTheme(themes[nextIndex]);
  appendOutput(
    `\n  <span class="muted">theme: ${themes[nextIndex]}</span>\n\n`,
  );
  scrollToBottom();
}

function updateUKTime() {
  const timeEl = document.getElementById("status-time");
  if (timeEl) {
    const ukTime = new Date().toLocaleTimeString("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
    });
    timeEl.textContent = ukTime + " UK";
  }
}

function updateVibe() {
  const vibeEl = document.getElementById("status-vibe");
  if (vibeEl) {
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    vibeEl.textContent = randomVibe;
  }
}

async function executeCommand(input) {
  const trimmed = input.trim();
  if (!trimmed) return;

  state.history.push(trimmed);
  state.historyIndex = state.history.length;
  state.commandCount++;

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Command text in orange
  appendOutput(
    `<span class="prompt">∴</span> <span class="accent">${escapeHtml(trimmed)}</span>\n`,
  );

  if (commands[cmd]) {
    const result = await commands[cmd].fn(args);
    if (result) {
      appendOutput(result + "\n");
    }
  } else {
    appendOutput(
      `\n  <span class="error">command not found: ${cmd}</span>\n  type <span class="cmd">help</span> for available commands.\n\n`,
    );
  }

  scrollToBottom();
  updateVibe();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getCompletions(partial) {
  const cmdNames = Object.keys(commands);
  return cmdNames.filter((c) => c.startsWith(partial.toLowerCase()));
}

async function boot() {
  const output = document.getElementById("output");
  const lines = [
    "initializing terminal...",
    "loading modules... done",
    "connecting to ben.tossell... connected",
    "",
  ];

  for (const line of lines) {
    output.innerHTML += `<span class="muted">${line}</span>\n`;
    await sleep(150);
    scrollToBottom();
  }

  output.innerHTML += `<span class="accent ascii-art">  ██████╗ ███████╗███╗   ██╗  ████████╗ ██████╗ ███████╗███████╗███████╗██╗     ██╗
  ██╔══██╗██╔════╝████╗  ██║  ╚══██╔══╝██╔═══██╗██╔════╝██╔════╝██╔════╝██║     ██║
  ██████╔╝█████╗  ██╔██╗ ██║     ██║   ██║   ██║███████╗███████╗█████╗  ██║     ██║
  ██╔══██╗██╔══╝  ██║╚██╗██║     ██║   ██║   ██║╚════██║╚════██║██╔══╝  ██║     ██║
  ██████╔╝███████╗██║ ╚████║     ██║   ╚██████╔╝███████║███████║███████╗███████╗███████╗
  ╚═════╝ ╚══════╝╚═╝  ╚═══╝     ╚═╝    ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝╚══════╝</span>
`;
  await sleep(100);

  output.innerHTML += `
  builder. investor. dad.
  welcome to my cli. type <span class="cmd">help</span> to see commands.

`;
  scrollToBottom();

  document.getElementById("command-input").focus();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const form = document.getElementById("command-form");

  setTheme(state.theme);
  updateUKTime();
  updateVibe();
  setInterval(updateUKTime, 1000);
  setInterval(updateVibe, 8000); // Change vibe every 8 seconds

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = "";
    await executeCommand(value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (state.historyIndex > 0) {
        state.historyIndex--;
        input.value = state.history[state.historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        input.value = state.history[state.historyIndex] || "";
      } else {
        state.historyIndex = state.history.length;
        input.value = "";
      }
    } else if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      cycleTheme();
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const value = input.value.trim();
      if (value) {
        const completions = getCompletions(value);
        if (completions.length === 1) {
          input.value = completions[0] + " ";
        } else if (completions.length > 1) {
          appendOutput(
            `<span class="prompt">∴</span> <span class="accent">${value}</span>\n`,
          );
          appendOutput(
            `<span class="muted">${completions.join("  ")}</span>\n\n`,
          );
          scrollToBottom();
        }
      }
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      document.getElementById("output").innerHTML = "";
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      appendOutput(
        `<span class="prompt">∴</span> <span class="accent">${input.value}</span>^C\n\n`,
      );
      input.value = "";
    }
  });

  document.getElementById("terminal").addEventListener("click", (e) => {
    if (e.target.tagName !== "A" && !e.target.closest(".cmd-shortcut")) {
      input.focus();
    }
  });

  document.querySelectorAll(".cmd-shortcut").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const cmd = btn.dataset.cmd;
      if (cmd) {
        await executeCommand(cmd);
        input.focus();
      }
    });
  });

  document.getElementById("help-btn")?.addEventListener("click", async () => {
    await executeCommand("help");
  });

  boot();
});
