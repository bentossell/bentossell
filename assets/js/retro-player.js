/**
 * Retro Music Player
 * A mini music player that generates retro 8-bit style sounds for classic arcade games
 */

class RetroPlayer {
  constructor() {
    // Initialize audio context
    this.audioContext = null;
    this.masterGain = null;
    this.currentOscillators = [];
    this.isPlaying = false;
    this.currentGame = null;
    this.volume = 0.5;
    
    // Game patterns (notes and timing)
    this.gamePatterns = {
      tetris: {
        name: 'Tetris',
        notes: [
          { note: 'E5', duration: 0.25, type: 'square' },
          { note: 'B4', duration: 0.125, type: 'square' },
          { note: 'C5', duration: 0.125, type: 'square' },
          { note: 'D5', duration: 0.25, type: 'square' },
          { note: 'C5', duration: 0.125, type: 'square' },
          { note: 'B4', duration: 0.125, type: 'square' },
          { note: 'A4', duration: 0.25, type: 'square' },
          { note: 'A4', duration: 0.125, type: 'square' },
          { note: 'C5', duration: 0.125, type: 'square' },
          { note: 'E5', duration: 0.25, type: 'square' },
          { note: 'D5', duration: 0.125, type: 'square' },
          { note: 'C5', duration: 0.125, type: 'square' },
          { note: 'B4', duration: 0.375, type: 'square' },
          { note: 'C5', duration: 0.125, type: 'square' },
          { note: 'D5', duration: 0.25, type: 'square' },
          { note: 'E5', duration: 0.25, type: 'square' },
          { note: 'C5', duration: 0.25, type: 'square' },
          { note: 'A4', duration: 0.25, type: 'square' },
          { note: 'A4', duration: 0.5, type: 'square' }
        ],
        tempo: 150
      },
      donkeyKong: {
        name: 'Donkey Kong',
        notes: [
          { note: 'C4', duration: 0.125, type: 'sawtooth' },
          { note: 'E4', duration: 0.125, type: 'sawtooth' },
          { note: 'G4', duration: 0.125, type: 'sawtooth' },
          { note: 'C5', duration: 0.125, type: 'sawtooth' },
          { note: 'G4', duration: 0.125, type: 'sawtooth' },
          { note: 'E4', duration: 0.125, type: 'sawtooth' },
          { note: 'C4', duration: 0.25, type: 'sawtooth' },
          { note: 'G3', duration: 0.125, type: 'sawtooth' },
          { note: 'C4', duration: 0.25, type: 'sawtooth' },
          { note: 'D4', duration: 0.125, type: 'sawtooth' },
          { note: 'E4', duration: 0.125, type: 'sawtooth' },
          { note: 'F4', duration: 0.125, type: 'sawtooth' },
          { note: 'G4', duration: 0.25, type: 'sawtooth' }
        ],
        tempo: 120
      },
      pacman: {
        name: 'Pac-Man',
        notes: [
          { note: 'B4', duration: 0.125, type: 'triangle' },
          { note: 'B5', duration: 0.125, type: 'triangle' },
          { note: 'F#5', duration: 0.125, type: 'triangle' },
          { note: 'D#5', duration: 0.125, type: 'triangle' },
          { note: 'B5', duration: 0.0625, type: 'triangle' },
          { note: 'F#5', duration: 0.0625, type: 'triangle' },
          { note: 'D#5', duration: 0.0625, type: 'triangle' },
          { note: 'C5', duration: 0.0625, type: 'triangle' },
          { note: 'C6', duration: 0.0625, type: 'triangle' },
          { note: 'G5', duration: 0.0625, type: 'triangle' },
          { note: 'E5', duration: 0.0625, type: 'triangle' },
          { note: 'C6', duration: 0.0625, type: 'triangle' },
          { note: 'G5', duration: 0.0625, type: 'triangle' },
          { note: 'E5', duration: 0.0625, type: 'triangle' }
        ],
        tempo: 200
      },
      spaceInvaders: {
        name: 'Space Invaders',
        notes: [
          { note: 'C3', duration: 0.125, type: 'square' },
          { note: 'B2', duration: 0.125, type: 'square' },
          { note: 'A#2', duration: 0.125, type: 'square' },
          { note: 'A2', duration: 0.125, type: 'square' },
          { note: 'G#2', duration: 0.125, type: 'square' },
          { note: 'G2', duration: 0.125, type: 'square' },
          { note: 'F#2', duration: 0.125, type: 'square' },
          { note: 'F2', duration: 0.125, type: 'square' }
        ],
        tempo: 80,
        loop: true
      },
      asteroids: {
        name: 'Asteroids',
        notes: [
          { note: 'C4', duration: 0.125, type: 'sine' },
          { note: 'E4', duration: 0.125, type: 'sine' },
          { note: 'G4', duration: 0.125, type: 'sine' },
          { note: 'C5', duration: 0.125, type: 'sine' },
          { note: 'G4', duration: 0.125, type: 'sine' },
          { note: 'E4', duration: 0.125, type: 'sine' },
          { note: 'C4', duration: 0.125, type: 'sine' },
          { note: 'E4', duration: 0.125, type: 'sine' },
          { note: 'G4', duration: 0.125, type: 'sine' },
          { note: 'C5', duration: 0.125, type: 'sine' },
          { note: 'G4', duration: 0.125, type: 'sine' },
          { note: 'E4', duration: 0.125, type: 'sine' },
          { note: 'C4', duration: 0.125, type: 'sine' }
        ],
        tempo: 180
      }
    };
    
    // Note frequency mapping
    this.noteFrequencies = {
      'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
      'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
      'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53
    };
    
    // Create UI elements
    this.createPlayerUI();
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  /**
   * Initialize the Web Audio API context
   */
  initAudio() {
    // Create audio context if it doesn't exist
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);
    }
    
    // Resume audio context if it's suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  /**
   * Create the player UI elements
   */
  createPlayerUI() {
    // Create container
    const container = document.createElement('div');
    container.id = 'retro-player';
    container.className = 'retro-player';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'retro-player-header';
    
    const title = document.createElement('div');
    title.className = 'retro-player-title';
    title.textContent = 'Retro Arcade Music';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'retro-player-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close music player');
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'retro-player-controls';
    
    const playBtn = document.createElement('button');
    playBtn.className = 'retro-player-play';
    playBtn.innerHTML = '▶';
    playBtn.setAttribute('aria-label', 'Play');
    
    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.min = '0';
    volumeControl.max = '1';
    volumeControl.step = '0.1';
    volumeControl.value = this.volume.toString();
    volumeControl.className = 'retro-player-volume';
    volumeControl.setAttribute('aria-label', 'Volume');
    
    controls.appendChild(playBtn);
    controls.appendChild(volumeControl);
    
    // Create game selector
    const gameSelector = document.createElement('div');
    gameSelector.className = 'retro-player-games';
    
    // Add game buttons
    Object.keys(this.gamePatterns).forEach(game => {
      const gameBtn = document.createElement('button');
      gameBtn.className = 'retro-player-game-btn';
      gameBtn.dataset.game = game;
      gameBtn.textContent = this.gamePatterns[game].name;
      gameSelector.appendChild(gameBtn);
    });
    
    // Create visualizer
    const visualizer = document.createElement('div');
    visualizer.className = 'retro-player-visualizer';
    
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      visualizer.appendChild(bar);
    }
    
    // Assemble player
    container.appendChild(header);
    container.appendChild(controls);
    container.appendChild(gameSelector);
    container.appendChild(visualizer);
    
    // Add to document
    document.body.appendChild(container);
    
    // Store references
    this.playerElement = container;
    this.playButton = playBtn;
    this.volumeControl = volumeControl;
    this.visualizer = visualizer;
    this.gameButtons = document.querySelectorAll('.retro-player-game-btn');
    this.closeButton = closeBtn;
  }
  
  /**
   * Set up event listeners for player controls
   */
  setupEventListeners() {
    // Play/Pause button
    this.playButton.addEventListener('click', () => {
      if (!this.currentGame) {
        // If no game is selected, select the first one
        this.selectGame(Object.keys(this.gamePatterns)[0]);
      }
      
      if (this.isPlaying) {
        this.stopSound();
      } else {
        this.playCurrentGame();
      }
    });
    
    // Volume control
    this.volumeControl.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      if (this.masterGain) {
        this.masterGain.gain.value = this.volume;
      }
    });
    
    // Game selection buttons
    this.gameButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        this.selectGame(game);
        
        if (this.isPlaying) {
          this.stopSound();
          this.playCurrentGame();
        }
      });
    });
    
    // Close button
    this.closeButton.addEventListener('click', () => {
      this.playerElement.classList.add('retro-player-minimized');
      
      // Create mini button to restore
      const miniButton = document.createElement('button');
      miniButton.className = 'retro-player-mini-button';
      miniButton.innerHTML = '🎮';
      miniButton.setAttribute('aria-label', 'Open music player');
      document.body.appendChild(miniButton);
      
      miniButton.addEventListener('click', () => {
        this.playerElement.classList.remove('retro-player-minimized');
        miniButton.remove();
      });
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Only handle if player is visible and not minimized
      if (this.playerElement.classList.contains('retro-player-minimized')) {
        return;
      }
      
      // Space to play/pause
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        this.playButton.click();
      }
      
      // Escape to minimize
      if (e.code === 'Escape') {
        this.closeButton.click();
      }
      
      // Number keys 1-5 to select games
      if (e.code.startsWith('Digit') && e.code !== 'Digit0') {
        const index = parseInt(e.code.replace('Digit', '')) - 1;
        const games = Object.keys(this.gamePatterns);
        if (index >= 0 && index < games.length) {
          this.selectGame(games[index]);
          if (this.isPlaying) {
            this.stopSound();
            this.playCurrentGame();
          }
        }
      }
    });
  }
  
  /**
   * Select a game to play
   * @param {string} game - The game key to select
   */
  selectGame(game) {
    this.currentGame = game;
    
    // Update UI
    this.gameButtons.forEach(btn => {
      if (btn.dataset.game === game) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  /**
   * Play the currently selected game's sound pattern
   */
  playCurrentGame() {
    if (!this.currentGame) return;
    
    this.initAudio();
    this.isPlaying = true;
    this.playButton.innerHTML = '⏸';
    this.playButton.setAttribute('aria-label', 'Pause');
    
    const pattern = this.gamePatterns[this.currentGame];
    this.playNoteSequence(pattern.notes, pattern.tempo, pattern.loop);
    
    // Start visualizer animation
    this.animateVisualizer();
  }
  
  /**
   * Play a sequence of notes
   * @param {Array} notes - Array of note objects with note, duration, and type properties
   * @param {number} tempo - Tempo in BPM
   * @param {boolean} loop - Whether to loop the sequence
   */
  playNoteSequence(notes, tempo, loop = false) {
    if (!this.audioContext) return;
    
    // Clear any existing oscillators
    this.stopSound(false);
    
    const secondsPerBeat = 60 / tempo;
    let currentTime = this.audioContext.currentTime;
    
    // Play each note in sequence
    notes.forEach((noteObj, index) => {
      const { note, duration, type } = noteObj;
      const frequency = this.noteFrequencies[note];
      
      if (!frequency) return;
      
      // Create oscillator
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = type || 'square';
      oscillator.frequency.value = frequency;
      
      // Create gain node for this note
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0;
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Schedule note start
      oscillator.start(currentTime);
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.01);
      
      // Schedule note end
      const noteEndTime = currentTime + (duration * secondsPerBeat);
      gainNode.gain.linearRampToValueAtTime(0, noteEndTime);
      oscillator.stop(noteEndTime + 0.05);
      
      // Store oscillator for later cleanup
      this.currentOscillators.push({ oscillator, gainNode });
      
      // Update current time for next note
      currentTime = noteEndTime;
      
      // If this is the last note and we're looping, schedule the loop
      if (loop && index === notes.length - 1) {
        setTimeout(() => {
          if (this.isPlaying) {
            this.playNoteSequence(notes, tempo, loop);
          }
        }, (currentTime - this.audioContext.currentTime) * 1000);
      }
    });
  }
  
  /**
   * Stop all currently playing sounds
   * @param {boolean} updateUI - Whether to update the UI
   */
  stopSound(updateUI = true) {
    this.isPlaying = false;
    
    // Stop all oscillators
    this.currentOscillators.forEach(({ oscillator, gainNode }) => {
      try {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // Ignore errors from already stopped oscillators
      }
    });
    
    this.currentOscillators = [];
    
    // Update UI
    if (updateUI) {
      this.playButton.innerHTML = '▶';
      this.playButton.setAttribute('aria-label', 'Play');
      this.stopVisualizerAnimation();
    }
  }
  
  /**
   * Animate the visualizer bars
   */
  animateVisualizer() {
    const bars = this.visualizer.querySelectorAll('.visualizer-bar');
    
    // Stop any existing animation
    this.stopVisualizerAnimation();
    
    // Create animation function
    const animate = () => {
      if (!this.isPlaying) return;
      
      // Randomize heights for each bar
      bars.forEach(bar => {
        const height = Math.floor(Math.random() * 100) + '%';
        bar.style.height = height;
      });
      
      // Schedule next frame
      this.visualizerAnimationFrame = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
  }
  
  /**
   * Stop visualizer animation
   */
  stopVisualizerAnimation() {
    if (this.visualizerAnimationFrame) {
      cancelAnimationFrame(this.visualizerAnimationFrame);
      this.visualizerAnimationFrame = null;
      
      // Reset bar heights
      const bars = this.visualizer.querySelectorAll('.visualizer-bar');
      bars.forEach(bar => {
        bar.style.height = '0%';
      });
    }
  }
}

// Add CSS styles
function addRetroPlayerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .retro-player {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background-color: var(--color-background, #fff);
      border: 2px solid var(--color-divider, #e6e6e6);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow: hidden;
      transition: transform 0.3s ease, opacity 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    
    body.dark-mode .retro-player {
      background-color: #212121;
      border-color: #30363d;
    }
    
    .retro-player-minimized {
      transform: translateY(calc(100% + 20px));
      opacity: 0;
      pointer-events: none;
    }
    
    .retro-player-mini-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: var(--color-background, #fff);
      border: 2px solid var(--color-divider, #e6e6e6);
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }
    
    body.dark-mode .retro-player-mini-button {
      background-color: #212121;
      border-color: #30363d;
    }
    
    .retro-player-mini-button:hover {
      transform: scale(1.1);
    }
    
    .retro-player-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid var(--color-divider, #e6e6e6);
      background-color: var(--color-background, #fff);
      cursor: move;
    }
    
    body.dark-mode .retro-player-header {
      border-color: #30363d;
      background-color: #171717;
    }
    
    .retro-player-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--color-text, #24292F);
    }
    
    body.dark-mode .retro-player-title {
      color: #c9d1d9;
    }
    
    .retro-player-close {
      background: none;
      border: none;
      color: var(--color-text-secondary, #8f8f8f);
      font-size: 20px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    
    .retro-player-close:hover {
      background-color: var(--color-divider, #e6e6e6);
      color: var(--color-text, #24292F);
    }
    
    body.dark-mode .retro-player-close:hover {
      background-color: #30363d;
      color: #c9d1d9;
    }
    
    .retro-player-controls {
      display: flex;
      align-items: center;
      padding: 15px;
      gap: 15px;
    }
    
    .retro-player-play {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background-color: var(--color-divider, #e6e6e6);
      color: var(--color-text, #24292F);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }
    
    body.dark-mode .retro-player-play {
      background-color: #30363d;
      color: #c9d1d9;
    }
    
    .retro-player-play:hover {
      background-color: #d0d0d0;
    }
    
    body.dark-mode .retro-player-play:hover {
      background-color: #444;
    }
    
    .retro-player-volume {
      flex: 1;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: var(--color-divider, #e6e6e6);
      border-radius: 2px;
      outline: none;
    }
    
    body.dark-mode .retro-player-volume {
      background: #30363d;
    }
    
    .retro-player-volume::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-text, #24292F);
      cursor: pointer;
    }
    
    body.dark-mode .retro-player-volume::-webkit-slider-thumb {
      background: #c9d1d9;
    }
    
    .retro-player-volume::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-text, #24292F);
      cursor: pointer;
      border: none;
    }
    
    body.dark-mode .retro-player-volume::-moz-range-thumb {
      background: #c9d1d9;
    }
    
    .retro-player-games {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      padding: 0 15px 15px;
    }
    
    .retro-player-game-btn {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid var(--color-divider, #e6e6e6);
      background-color: var(--color-background, #fff);
      color: var(--color-text, #24292F);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    body.dark-mode .retro-player-game-btn {
      border-color: #30363d;
      background-color: #212121;
      color: #c9d1d9;
    }
    
    .retro-player-game-btn:hover {
      background-color: var(--color-divider, #e6e6e6);
    }
    
    body.dark-mode .retro-player-game-btn:hover {
      background-color: #30363d;
    }
    
    .retro-player-game-btn.active {
      background-color: var(--color-text, #24292F);
      color: #fff;
      border-color: var(--color-text, #24292F);
    }
    
    body.dark-mode .retro-player-game-btn.active {
      background-color: #c9d1d9;
      color: #212121;
      border-color: #c9d1d9;
    }
    
    .retro-player-visualizer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 40px;
      padding: 0 15px 15px;
      gap: 3px;
    }
    
    .visualizer-bar {
      flex: 1;
      background-color: var(--color-text, #24292F);
      height: 0%;
      transition: height 0.1s ease;
      border-radius: 2px 2px 0 0;
    }
    
    body.dark-mode .visualizer-bar {
      background-color: #c9d1d9;
    }
    
    /* Responsive styles */
    @media (max-width: 480px) {
      .retro-player {
        width: 250px;
        bottom: 10px;
        right: 10px;
      }
      
      .retro-player-mini-button {
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
      
      .retro-player-games {
        padding: 0 10px 10px;
      }
      
      .retro-player-game-btn {
        padding: 4px 8px;
        font-size: 11px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize the player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  addRetroPlayerStyles();
  window.retroPlayer = new RetroPlayer();
});

// If the document is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  addRetroPlayerStyles();
  window.retroPlayer = new RetroPlayer();
}
