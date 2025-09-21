// Retro Mini Music Player — uses retro-sound via ESM CDN
// Arcade-style chiptune loops without any assets
// Autoplay is gated behind user interaction per browser policy

import { Sound, WhiteNoise } from 'https://esm.sh/retro-sound@1.0.4';

const root = document.getElementById('retro-miniplayer');
const playBtn = document.getElementById('retro-play');
const prevBtn = document.getElementById('retro-prev');
const nextBtn = document.getElementById('retro-next');
const volKnob = document.getElementById('retro-volume');
const trackLabel = document.getElementById('retro-track');

let AC;              // AudioContext (lazy)
let master;          // Master Gain
let isPlaying = false;
let currentIdx = 0;
let currentTrackCtl = null;

function ensureAudio() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    master.gain.value = (Number(volKnob?.value ?? 65)) / 100;
    master.connect(AC.destination);
  }
}

function updateVolAngle(v) {
  // v is 0..100 → percentage of the conic gradient fill
  const pct = Math.max(0, Math.min(100, v));
  volKnob.style.setProperty('--angle', pct + '%');
}

function setVolume(v) {
  if (master) master.gain.setTargetAtTime(v, AC.currentTime, 0.01);
  updateVolAngle(v * 100);
}

// Utility: play a short note with quick decay
function blip(note = 'A4', {
  type = 'square',
  volume = 0.9,
  decay = 0.22,
  mods = [],
  filter = null,
} = {}) {
  const s = new Sound(AC, type);
  mods.forEach(m => s.withModulator(m.type, m.depth, m.rate, m.param));
  if (filter) s.withFilter(filter.type, filter.freq);
  s.toDestination(master);
  // Resume context in case it was suspended
  AC.resume();
  s.play(note).rampToVolumeAtTime(0, decay).waitDispose();
}

// Utility: simple noise percussion tap
function tap({ cutoff = 8000, decay = 0.12 } = {}) {
  const n = new WhiteNoise(AC).withFilter('lowpass', cutoff).toDestination(master);
  AC.resume();
  n.play().rampFilterFreqAtTime(1000, decay * 0.5).rampToVolumeAtTime(0, decay).waitDispose();
}

// Sequencer helper — schedules setInterval ticks for a pattern
function makeLooper({ name, steps, tempoBPM = 140 }) {
  // 8th-note grid by default
  const stepMs = 60000 / (tempoBPM * 2);
  let i = 0;
  let t = null;

  return {
    name,
    start() {
      if (t) return; // already running
      // Prime one immediate tick
      tick();
      t = setInterval(tick, stepMs);
    },
    stop() {
      if (t) clearInterval(t), (t = null);
    }
  };

  function tick() {
    const step = steps[i % steps.length];
    // step can be array (poly) or string note or function
    if (typeof step === 'function') {
      step();
    } else if (Array.isArray(step)) {
      step.forEach(ev => playEv(ev));
    } else {
      playEv(step);
    }
    i++;
  }

  function playEv(ev) {
    if (!ev || ev === '-') return; // rest
    if (typeof ev === 'string') {
      blip(ev, { type: 'square', decay: 0.18, mods: [{ type: 'square', depth: 8, rate: 320, param: 'detune' }] });
      return;
    }
    // object-based
    const { note = 'A4', type = 'square', decay = 0.2, volume = 0.9, mods = [], filter = null, noise = false } = ev;
    if (noise) { tap({ cutoff: 6000, decay: 0.08 }); return; }
    blip(note, { type, decay, volume, mods, filter });
  }
}

// Five loopable arcade-y patterns
function trackRetroRacer() {
  return makeLooper({
    name: 'Retro Racer',
    tempoBPM: 152,
    steps: [
      { note: 'E4' }, '-', { note: 'G4' }, { note: 'A4' }, '-', { note: 'B4' }, { note: 'E5' }, '-','-','noise','-','-'
    ].map(s => (s === 'noise' ? { noise: true } : s))
  });
}

function trackSpacePatrol() {
  return makeLooper({
    name: 'Space Patrol',
    tempoBPM: 132,
    steps: [
      { note: 'A3', type: 'triangle', decay: 0.22 }, '-', { note: 'E4', type: 'triangle', decay: 0.22 }, '-',
      { note: 'A4', type: 'triangle', decay: 0.22 }, '-', { note: 'C5', type: 'triangle', decay: 0.22 }, '-',
      '-', { noise: true }, '-','-'
    ]
  });
}

function trackPixelQuest() {
  return makeLooper({
    name: 'Pixel Quest',
    tempoBPM: 160,
    steps: [
      ['C4','E4','G4'].map(n => ({ note: n, type: 'square', decay: 0.16 })), '-',
      ['D4','F4','A4'].map(n => ({ note: n, type: 'square', decay: 0.16 })), '-','-','noise','-','-'
    ].flatMap(step => step)
      .map(s => (Array.isArray(s) ? s : s))
  });
}

function trackDungeonCrawl() {
  return makeLooper({
    name: 'Dungeon Crawl',
    tempoBPM: 118,
    steps: [
      { note: 'A3', type: 'sawtooth', decay: 0.25, filter: { type: 'lowpass', freq: 900 } }, '-',
      { note: 'G3', type: 'sawtooth', decay: 0.25, filter: { type: 'lowpass', freq: 900 } }, '-',
      { note: 'F3', type: 'sawtooth', decay: 0.25, filter: { type: 'lowpass', freq: 900 } }, '-', '-', { noise: true }
    ]
  });
}

function trackSkyInvaders() {
  return makeLooper({
    name: 'Sky Invaders',
    tempoBPM: 170,
    steps: [
      { note: 'C5', type: 'square', decay: 0.12 }, { note: 'C6', type: 'square', decay: 0.12 }, '-', { noise: true },
      { note: 'G5', type: 'square', decay: 0.12 }, { note: 'G6', type: 'square', decay: 0.12 }, '-', '-'
    ]
  });
}

const trackFactories = [
  trackRetroRacer,
  trackSpacePatrol,
  trackPixelQuest,
  trackDungeonCrawl,
  trackSkyInvaders,
];

function playIndex(idx) {
  ensureAudio();
  AC.resume();
  if (currentTrackCtl) currentTrackCtl.stop();
  currentIdx = (idx + trackFactories.length) % trackFactories.length;
  currentTrackCtl = trackFactories[currentIdx]();
  trackLabel.textContent = currentTrackCtl.name;
  currentTrackCtl.start();
  isPlaying = true;
  root.classList.add('playing');
  playBtn.textContent = '⏸';
}

function togglePlay() {
  ensureAudio();
  if (!isPlaying) {
    playIndex(currentIdx);
  } else {
    // Pause = stop loop; resume starts from pattern beginning
    if (currentTrackCtl) currentTrackCtl.stop();
    isPlaying = false;
    root.classList.remove('playing');
    playBtn.textContent = '▶';
  }
}

playBtn?.addEventListener('click', async () => {
  ensureAudio();
  try { await AC.resume(); } catch {}
  togglePlay();
});

prevBtn?.addEventListener('click', async () => {
  ensureAudio();
  try { await AC.resume(); } catch {}
  playIndex(currentIdx - 1);
});

nextBtn?.addEventListener('click', async () => {
  ensureAudio();
  try { await AC.resume(); } catch {}
  playIndex(currentIdx + 1);
});

volKnob?.addEventListener('input', (e) => {
  const v = Number(e.target.value || 65);
  if (master && AC) setVolume(v / 100);
  else updateVolAngle(v);
});

// Initialize knob visual
updateVolAngle(Number(volKnob?.value ?? 65));

// Helpful: allow starting from keyboard (Enter/Space) when focusing the controls
playBtn?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    playBtn.click();
  }
});
