// token activity graph. mounts into every [data-token-activity] element.
// data: daily.json published hourly from the mac mini, merged from both machines.
(() => {
  const DATA_URL = 'https://lively-yacht-j3mr.here.now/daily.json';
  const APPS = ['claude', 'codex', 'pi', 'factory', 'bb'];
  const COLORS = { claude: '#d97757', codex: '#10a37f', pi: '#8b5cf6', factory: '#2f6bff', bb: '#d4a017' };
  const CELL = 10, GAP = 2, LEFT = 24, TOP = 14, SCELL = 8, SLEFT = 66, ROWGAP = 12;
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fmt = (n) => n >= 1e9 ? (n / 1e9).toFixed(n < 1e10 ? 2 : 1) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(n < 1e7 ? 1 : 0) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'k' : String(Math.round(n));
  const money = (n) => n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n.toFixed(n < 10 ? 2 : 0);
  const total = (r) => r.in + r.out + r.cr + r.cw;
  const metricOf = (r, m) => m === 'output' ? r.out : m === 'cost' ? r.cost : total(r);
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const esc = (s) => s.replace(/"/g, '&quot;');
  function calendar() {
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const start = new Date(end); start.setDate(end.getDate() - 52 * 7 - ((end.getDay() + 6) % 7));
    const weeks = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const row = (d.getDay() + 6) % 7;
      if (row === 0 || !weeks.length) weeks.push([]);
      weeks[weeks.length - 1].push({ date: iso(d), d: new Date(d), row });
    }
    return weeks;
  }
  const label = (date) => { const d = new Date(date + 'T00:00'); return dayName[d.getDay()] + ' ' + d.getDate() + ' ' + monName[d.getMonth()]; };
  function shader(values) {
    const nz = values.filter(v => v > 0).sort((a, b) => a - b);
    const q = [0.2, 0.4, 0.6, 0.8].map(p => nz[Math.floor(p * (nz.length - 1))] || 0);
    const op = [0.22, 0.42, 0.62, 0.82, 1];
    return (v) => v <= 0 ? 0 : op[q.filter(t => v > t).length];
  }

  const CSS = `
.ta{--ta-muted:var(--muted,#9ba4b1);--ta-ink:var(--ink,#202126);--ta-paper:var(--paper,#fbfdfd);--ta-cell:color-mix(in srgb,var(--ink,#202126) 8%,transparent);font:12px/1.5 var(--mono,"SFMono-Regular",Consolas,"Liberation Mono",monospace);color:var(--ta-ink)}
.ta .ta-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.ta .ta-head p{margin:0;color:var(--ta-muted)}
.ta .ta-title{font-weight:600;color:inherit;text-decoration:none}
.ta a.ta-title:hover{text-decoration:underline;text-underline-offset:3px}
.ta .ta-toggle{display:flex;gap:10px}
.ta button{all:unset;cursor:pointer;color:var(--ta-muted)}
.ta .ta-toggle button.on{color:var(--ta-ink);text-decoration:underline;text-underline-offset:3px}
.ta .ta-apps{display:flex;gap:14px;margin:10px 0 8px;flex-wrap:wrap;align-items:baseline}
.ta .ta-apps button b{font-weight:600}
.ta .ta-apps button.dim{opacity:.45}
.ta .ta-apps .sw{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}
.ta .ta-split{margin-left:auto}
.ta .ta-split.on{color:var(--ta-ink);text-decoration:underline;text-underline-offset:3px}
.ta .ta-scroll{overflow-x:auto;padding-bottom:4px}
.ta svg{display:block}
.ta .ta-axis{fill:var(--ta-muted);font-size:9px}
.ta .ta-foot{margin-top:8px;color:var(--ta-muted);display:flex;gap:16px;flex-wrap:wrap}
.ta .ta-foot b{color:var(--ta-ink);font-weight:600}
.ta-tip{position:fixed;display:none;pointer-events:none;background:var(--ink,#202126);color:var(--paper,#fbfdfd);padding:5px 8px;border-radius:4px;font:11px/1.45 var(--mono,"SFMono-Regular",Consolas,monospace);white-space:nowrap;z-index:9}
`;

  let tipEl;
  function tip(el) {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'ta-tip'; document.body.appendChild(tipEl); }
    el.addEventListener('mousemove', (e) => {
      const c = e.target.closest('[data-tip]'); if (!c) { tipEl.style.display = 'none'; return; }
      tipEl.innerHTML = c.dataset.tip; tipEl.style.display = 'block';
      const w = tipEl.offsetWidth; let x = e.clientX + 12; if (x + w > innerWidth - 8) x = e.clientX - w - 12;
      tipEl.style.left = x + 'px'; tipEl.style.top = (e.clientY + 14) + 'px';
    });
    el.addEventListener('mouseleave', () => tipEl.style.display = 'none');
  }

  function mount(root, data) {
    const linkTitle = root.dataset.tokenActivity === 'link';
    const state = { metric: 'tokens', only: null, split: false };
    root.classList.add('ta');
    root.innerHTML = `<div class="ta-head"><div>${linkTitle ? '<a class="ta-title" href="/token-activity/">token activity</a>' : '<span class="ta-title">token activity</span>'}<p class="ta-sub"></p></div><div class="ta-toggle"><button data-m="tokens" class="on">tokens</button><button data-m="output">output only</button><button data-m="cost">cost</button></div></div><div class="ta-apps"></div><div class="ta-scroll"></div><div class="ta-foot"></div>`;
    const $ = (s) => root.querySelector(s);
    const weeks = calendar(), days = weeks.flat();
    const unit = (v) => state.metric === 'cost' ? money(v) : fmt(v);
    const val = (c, a) => data.days[c.date]?.[a] ? metricOf(data.days[c.date][a], state.metric) : 0;
    const tipFor = (c, apps) => {
      const parts = apps.filter(a => val(c, a) > 0).sort((a, b) => val(c, b) - val(c, a)).map(a => `<span style="color:${COLORS[a]}">■</span> ${a} ${unit(val(c, a))}`).join('<br>');
      const s = apps.reduce((x, a) => x + val(c, a), 0);
      return esc(s > 0 ? `<b>${label(c.date)}</b> · ${unit(s)}<br>${parts}` : `${label(c.date)} · nothing`);
    };
    const monthLabels = (left, cell, y) => { let s = '', last = -1; weeks.forEach((w, i) => { const m = w[0].d.getMonth(); if (m !== last && w[0].d.getDate() <= 7) { s += `<text class="ta-axis" x="${left + i * (cell + GAP)}" y="${y}">${monName[m]}</text>`; last = m; } }); return s; };

    $('.ta-toggle').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; state.metric = b.dataset.m; for (const x of b.parentNode.children) x.classList.toggle('on', x === b); render(); };
    $('.ta-apps').onclick = (e) => {
      if (e.target.closest('.ta-split')) { state.split = !state.split; state.only = null; render(); return; }
      const b = e.target.closest('button[data-app]'); if (!b) return;
      state.only = state.only === b.dataset.app ? null : b.dataset.app; state.split = false; render();
    };
    tip($('.ta-scroll'));

    function render() {
      const { metric, only, split } = state;
      const tot = {}; for (const a of APPS) tot[a] = days.reduce((x, c) => x + val(c, a), 0);
      const order = [...APPS].sort((a, b) => tot[b] - tot[a]);
      $('.ta-apps').innerHTML = order.map(a => `<button data-app="${a}" class="${only && only !== a ? 'dim' : ''}"><span class="sw" style="background:${COLORS[a]}"></span><b style="color:${COLORS[a]}">${a}</b> ${unit(tot[a])}</button>`).join('') + `<button class="ta-split ${split ? 'on' : ''}">${split ? 'combine' : 'split'}</button>`;
      $('.ta-sub').textContent = split ? 'one strip per app. a faint square is still a million tokens.' : only ? `${only} only. click again for every app.` : "every token my agents used, by day. colour is the app that did most of the work.";
      let s;
      if (!split) {
        const apps = only ? [only] : APPS;
        const sums = days.map(c => apps.reduce((x, a) => x + val(c, a), 0));
        const shade = shader(sums);
        const W = LEFT + weeks.length * (CELL + GAP), H = TOP + 7 * (CELL + GAP);
        s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + monthLabels(LEFT, CELL, 9);
        weeks.forEach((w, i) => { for (const c of w) {
          const v = sums[days.indexOf(c)];
          let top = only; if (!only) { let tv = 0; for (const a of APPS) { const x = val(c, a); if (x > tv) { tv = x; top = a; } } }
          s += `<rect rx="2" x="${LEFT + i * (CELL + GAP)}" y="${TOP + c.row * (CELL + GAP)}" width="${CELL}" height="${CELL}" fill="${v > 0 ? COLORS[top] : 'var(--ta-cell)'}" opacity="${v > 0 ? shade(v).toFixed(2) : 1}" data-tip="${tipFor(c, apps)}"/>`;
        } });
        [0, 2, 4].forEach(r => s += `<text class="ta-axis" x="0" y="${TOP + r * (CELL + GAP) + 9}">${dayName[(r + 1) % 7]}</text>`);
        s += '</svg>';
      } else {
        const shade = shader(APPS.flatMap(a => days.map(c => val(c, a))));
        const blockH = 7 * (SCELL + GAP);
        const W = SLEFT + weeks.length * (SCELL + GAP), H = 12 + APPS.length * (blockH + ROWGAP);
        s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` + monthLabels(SLEFT, SCELL, 8);
        order.forEach((a, ai) => {
          const y0 = 12 + ai * (blockH + ROWGAP);
          const active = days.filter(c => val(c, a) > 0).length;
          s += `<text x="0" y="${y0 + 10}" font-weight="600" font-size="11" fill="${COLORS[a]}">${a}</text><text class="ta-axis" x="0" y="${y0 + 22}">${unit(tot[a])}</text><text class="ta-axis" x="0" y="${y0 + 34}">${active} days</text>`;
          weeks.forEach((w, i) => { for (const c of w) {
            const v = val(c, a);
            s += `<rect rx="2" x="${SLEFT + i * (SCELL + GAP)}" y="${y0 + c.row * (SCELL + GAP)}" width="${SCELL}" height="${SCELL}" fill="${v > 0 ? COLORS[a] : 'var(--ta-cell)'}" opacity="${v > 0 ? shade(v).toFixed(2) : 1}" data-tip="${tipFor(c, [a])}"/>`;
          } });
        });
        s += '</svg>';
      }
      const g = $('.ta-scroll'); g.innerHTML = s; g.scrollLeft = g.scrollWidth;
      const apps = only ? [only] : APPS;
      const tokens = days.reduce((x, c) => x + apps.reduce((y, a) => y + (data.days[c.date]?.[a] ? total(data.days[c.date][a]) : 0), 0), 0);
      const cost = days.reduce((x, c) => x + apps.reduce((y, a) => y + (data.days[c.date]?.[a]?.cost || 0), 0), 0);
      const activeDays = days.filter(c => apps.some(a => val(c, a) > 0)).length;
      let streak = 0; for (let i = days.length - 1; i >= 0 && apps.some(a => val(days[i], a) > 0); i--) streak++;
      const updated = data.generatedAt ? new Date(data.generatedAt) : null;
      const ago = updated ? Math.max(0, Math.round((Date.now() - updated) / 36e5)) : null;
      $('.ta-foot').innerHTML = `<span><b>${fmt(tokens)}</b> tokens</span><span><b>${money(cost)}</b> at list price</span><span><b>${activeDays}</b> active days</span><span><b>${streak}</b> day streak</span>${ago != null ? `<span>updated ${ago < 1 ? 'just now' : ago + 'h ago'}</span>` : ''}`;
    }
    render();
  }

  function init() {
    const roots = document.querySelectorAll('[data-token-activity]');
    if (!roots.length) return;
    if (!document.getElementById('ta-css')) { const st = document.createElement('style'); st.id = 'ta-css'; st.textContent = CSS; document.head.appendChild(st); }
    const src = roots[0].dataset.src || DATA_URL;
    fetch(src + (src.includes('?') ? '&' : '?') + 't=' + Math.floor(Date.now() / 36e5), { cache: 'no-store' }).then(r => r.json()).then(data => roots.forEach(r => mount(r, data))).catch(() => roots.forEach(r => { r.classList.add('ta'); r.innerHTML = '<p style="color:var(--muted,#9ba4b1);margin:0">token activity is unavailable right now.</p>'; }));
  }
  window.tokenActivityInit = init;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
