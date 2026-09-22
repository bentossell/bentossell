// Shared explainer content: six chapters, each one sentence + one picture.
window.JEV_PICS = (() => {
  const arrow = `<svg class="arrow" viewBox="0 0 44 16" aria-hidden="true"><path d="M0 8h40M34 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  const pics = {
    inout: () => `<div class="pic pic-inout" role="img" aria-label="Text goes into Jev and a number comes out. Text into a chat model and a paragraph comes out.">
      <div class="io"><span class="lbl">Jev</span><div class="doc"><i></i><i></i><i></i><i></i><i></i></div>${arrow}<div class="box jev">Jev</div>${arrow}<div class="out"><span class="big num">0.92</span><span class="cap">“yes”, 92% sure</span></div></div>
      <div class="io muted"><span class="lbl">Chat</span><div class="doc"><i></i><i></i><i></i><i></i><i></i></div>${arrow}<div class="box llm">LLM</div>${arrow}<div class="para"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    </div>`,
    kinds: () => `<div class="pic pic-kinds" role="img" aria-label="Three question types: yes or no, pick one, and score.">
      <div class="kind"><h4>Yes or no</h4><p class="q">“Is this email spam?”</p><div class="track"><span class="dot" style="left:92%"></span></div><div class="track-lbl"><span>no</span><span>yes</span></div><span class="val num" style="color:var(--yes)">0.92</span></div>
      <div class="kind"><h4>Pick one</h4><p class="q">“What kind of email is it?”</p><div class="bars"><div class="b"><span>Personal</span><i style="width:9%"></i><span class="num">.09</span></div><div class="b on"><span>Receipt</span><i style="width:71%"></i><span class="num">.71</span></div><div class="b"><span>Newsletter</span><i style="width:14%"></i><span class="num">.14</span></div><div class="b"><span>Work</span><i style="width:6%"></i><span class="num">.06</span></div></div></div>
      <div class="kind"><h4>Score</h4><p class="q">“How urgent, 1 to 5?”</p><div class="scale"><div class="axis"></div>${[0, 25, 50, 75, 100].map((x, i) => `<span class="tick" style="left:${x}%"><b>${i + 1}</b></span>`).join('')}<span class="mark" style="left:67.5%"></span></div><span class="val num">3.7</span></div>
    </div>`,
    speed: () => `<div class="pic pic-speed" role="img" aria-label="Jev answers in 70 to 500 milliseconds. Chat models take 3 seconds to 5 minutes.">
      <div class="r"><span class="who">Jev</span><div class="bar jev"><i></i><b class="num">70–500 ms</b></div></div>
      <div class="r"><span class="who">Chat model</span><div class="bar llm"><i></i><b class="num">3 s – 5 min</b></div></div>
      <div class="r"><span></span><span class="fine">Not even to scale. The Jev bar would be too thin to see.</span></div>
    </div>`,
    cost: () => `<div class="pic pic-cost" role="img" aria-label="One chat model call costs the same as about 400 Jev calls.">
      <div class="side"><span class="one"></span><b>1 chat-model call</b></div>
      <span class="eq" aria-hidden="true">=</span>
      <div class="side"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2"/></pattern></defs><rect width="200" height="200" fill="url(#dots)"/></svg><b>≈ 400 Jev calls</b><p>$0.042 per million words in. Answers cost nothing.</p></div>
    </div>`,
    parallel: () => {
      const qs = [['Is it spam?', 'no · .03', 'n'], ['Is it urgent?', 'yes · .88', 'y'], ['What language?', 'English', ''], ['Tone, 1–5', '4.1', ''], ['Needs a reply?', 'yes · .71', 'y'], ['Mentions an invoice?', 'no · .09', 'n']];
      const ys = qs.map((_, i) => 8 + i * (84 / (qs.length - 1)));
      return `<div class="pic pic-parallel" role="img" aria-label="One document, six questions, all answered at the same time.">
        <div class="doc"><i></i><i></i><i></i><i></i><i></i></div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${ys.map(y => `<path d="M0 50 C 45 50, 55 ${y}, 100 ${y}" vector-effect="non-scaling-stroke"/>`).join('')}</svg>
        <div class="qs">${qs.map(([q, a, c]) => `<div class="q"><span>${q}</span><b class="${c} num">${a}</b></div>`).join('')}</div>
      </div>`;
    },
    black: () => `<div class="pic pic-black" role="img" aria-label="A black box marked with a question mark. It outputs only the number 0.92."><div class="bb" aria-hidden="true">?</div><span class="only num">0.92</span><span class="cap">That is all you get. No reason.</span></div>`,
  };
  const chapters = [
    { pic: 'inout', h: 'It is an AI that decides. It does not chat.', p: 'Text goes in. A number comes out. That is the whole idea.' },
    { pic: 'kinds', h: 'You can ask three kinds of question.', p: 'Yes or no. Pick one. Score it. Every answer comes with how sure it is.' },
    { pic: 'speed', h: 'It answers in a blink.', p: '70 to 500 milliseconds. A chat model needs seconds to minutes for the same call.' },
    { pic: 'cost', h: 'It is almost free.', p: 'About 40 to 400 times cheaper than a chat model. You pay for words in. Answers are free.' },
    { pic: 'parallel', h: 'Ask a hundred questions at once.', p: 'They are all answered together, in about the time of one.' },
    { pic: 'black', h: 'It never explains itself.', p: 'You get a number, not a reason. Test it before you trust it.' },
  ];
  const minis = [
    `<div class="pic mini-io"><div class="doc"><i></i><i></i><i></i><i></i></div>${arrow}<div class="box jev">Jev</div>${arrow}<span class="big num">0.92</span></div>`,
    `<div class="pic" style="display:grid;gap:10px"><div class="track" style="width:80%"><span class="dot" style="left:92%"></span></div><div class="bars" style="width:80%"><div class="b on" style="grid-template-columns:1fr 3ch"><i style="width:71%"></i><span class="num">.71</span></div><div class="b" style="grid-template-columns:1fr 3ch"><i style="width:14%"></i><span class="num">.14</span></div></div></div>`,
    `<div class="pic mini-speed"><div class="r jev"><i></i><b class="num">70–500 ms</b></div><div class="r llm"><i></i><span class="num">3 s – 5 min</span></div></div>`,
    `<div class="pic" style="display:flex;align-items:center;gap:14px"><span style="width:28px;height:28px;border-radius:50%;background:var(--text-3);flex:none"></span><span style="color:var(--text-3);font-size:22px">=</span><svg viewBox="0 0 200 200" style="width:84px;height:84px;fill:var(--accent)" aria-hidden="true"><defs><pattern id="dots2" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2"/></pattern></defs><rect width="200" height="200" fill="url(#dots2)"/></svg></div>`,
    `<div class="pic pic-black" style="gap:6px;justify-items:start"><div class="bb" style="width:56px;height:56px;font-size:30px;border-radius:12px">?</div><span class="only num" style="font-size:24px">0.92</span></div>`,
  ];
  const whoMade = 'Jev is made by TypeSafe AI. The founder, Diogo Almeida, worked on the research behind ChatGPT at OpenAI. Released 15 September 2026, early access.';
  return { pics, chapters, minis, whoMade, arrow };
})();
