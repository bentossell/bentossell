// music-player.js - Mini retro sound player for bentossell.com
// Uses retro-sound.js to generate arcade-style chiptune music

// Try to import Sound from retro-sound, catch and log errors but don't break the page
let Sound, AudioContext;
try {
  const module = await import('https://esm.sh/retro-sound');
  Sound = module.Sound;
  AudioContext = window.AudioContext || window.webkitAudioContext;
} catch (err) {
  console.error('Failed to load retro-sound library:', err);
}

// Initialize player only if Sound was successfully imported
if (Sound && AudioContext) {
  // Create audio context and master volume
  const AC = new AudioContext();
  const masterVolume = AC.createGain();
  masterVolume.gain.setValueAtTime(0.15, 0); // Default volume at 15%
  masterVolume.connect(AC.destination);

  // Track definitions - inspired by arcade games but not copying copyrighted melodies
  const tracks = [
    {
      name: "Tetris-like Puzzle",
      wave: "triangle",
      tempo: 180, // BPM
      notes: [
        { note: 'E5', duration: 0.25 }, { note: 'B4', duration: 0.25 },
        { note: 'C5', duration: 0.25 }, { note: 'D5', duration: 0.25 },
        { note: 'C5', duration: 0.25 }, { note: 'B4', duration: 0.25 },
        { note: 'A4', duration: 0.25 }, { note: 'A4', duration: 0.25 },
        { note: 'C5', duration: 0.25 }, { note: 'E5', duration: 0.25 },
        { note: 'D5', duration: 0.25 }, { note: 'C5', duration: 0.25 },
        { note: 'B4', duration: 0.5 }, { note: 'C5', duration: 0.25 },
        { note: 'D5', duration: 0.5 }, { note: 'E5', duration: 0.5 },
      ]
    },
    {
      name: "Space Invaders Groove",
      wave: "sawtooth",
      tempo: 120,
      notes: [
        { note: 'C3', duration: 0.25 }, { note: 'C3', duration: 0.25 },
        { note: 'G3', duration: 0.5 }, { note: 'C3', duration: 0.25 },
        { note: 'C3', duration: 0.25 }, { note: 'G3', duration: 0.5 },
        { note: 'E3', duration: 0.5 }, { note: 'F3', duration: 0.5 },
        { note: 'E3', duration: 0.5 }, { note: 'D3', duration: 0.5 },
        { note: 'C3', duration: 0.25 }, { note: 'C3', duration: 0.25 },
        { note: 'G3', duration: 0.5 }, { note: 'C3', duration: 0.25 },
      ]
    },
    {
      name: "Platformer Adventure",
      wave: "square",
      tempo: 150,
      notes: [
        { note: 'G4', duration: 0.25 }, { note: 'C5', duration: 0.25 },
        { note: 'E5', duration: 0.25 }, { note: 'G5', duration: 0.25 },
        { note: 'E5', duration: 0.25 }, { note: 'C5', duration: 0.25 },
        { note: 'G4', duration: 0.5 }, { note: 'A4', duration: 0.25 },
        { note: 'D5', duration: 0.25 }, { note: 'F5', duration: 0.25 },
        { note: 'A5', duration: 0.25 }, { note: 'F5', duration: 0.25 },
        { note: 'D5', duration: 0.25 }, { note: 'A4', duration: 0.5 },
      ]
    },
    {
      name: "Racing Circuit",
      wave: "square",
      tempo: 200,
      modulator: {
        type: 'square',
        frequency: 6,
        amount: 300,
        parameter: 'detune'
      },
      notes: [
        { note: 'E4', duration: 0.125 }, { note: 'E4', duration: 0.125 },
        { note: 'G4', duration: 0.125 }, { note: 'E4', duration: 0.125 },
        { note: 'A4', duration: 0.25 }, { note: 'B4', duration: 0.25 },
        { note: 'A4', duration: 0.125 }, { note: 'G4', duration: 0.125 },
        { note: 'E4', duration: 0.125 }, { note: 'E4', duration: 0.125 },
        { note: 'G4', duration: 0.125 }, { note: 'E4', duration: 0.125 },
        { note: 'D5', duration: 0.25 }, { note: 'C5', duration: 0.25 },
      ]
    },
    {
      name: "Dungeon Crawler",
      wave: "triangle",
      tempo: 90,
      filter: {
        type: 'lowpass',
        frequency: 800
      },
      notes: [
        { note: 'A3', duration: 0.5 }, { note: 'C4', duration: 0.5 },
        { note: 'D4', duration: 0.5 }, { note: 'A3', duration: 0.5 },
        { note: 'G3', duration: 0.5 }, { note: 'A3', duration: 0.5 },
        { note: 'E4', duration: 1.0 }, { note: 'D4', duration: 0.5 },
        { note: 'C4', duration: 0.5 }, { note: 'A3', duration: 0.5 },
        { note: 'G3', duration: 0.5 }, { note: 'A3', duration: 1.0 },
      ]
    }
  ];

  // Player state
  let currentTrackIndex = 0;
  let isPlaying = false;
  let abortController = null;

  // DOM elements (will be set after DOM is loaded)
  let playButton, prevButton, nextButton, titleDisplay, volumeSlider;

  // Play the current track
  async function playCurrentTrack() {
    if (abortController) {
      abortController.abort();
    }
    
    abortController = new AbortController();
    const signal = abortController.signal;
    
    // Make sure AudioContext is running
    if (AC.state === 'suspended') {
      await AC.resume();
    }
    
    const track = tracks[currentTrackIndex];
    updateTitleDisplay(track.name);
    
    // Loop until stopped
    try {
      while (!signal.aborted) {
        for (const noteObj of track.notes) {
          if (signal.aborted) break;
          
          // Create sound with the track's wave type
          const sound = new Sound(AC, track.wave);
          
          // Apply modulator if specified
          if (track.modulator) {
            sound.withModulator(
              track.modulator.type,
              track.modulator.frequency,
              track.modulator.amount,
              track.modulator.parameter
            );
          }
          
          // Apply filter if specified
          if (track.filter) {
            sound.withFilter(track.filter.type, track.filter.frequency);
          }
          
          // Connect to master volume and play
          sound.toDestination(masterVolume);
          
          // Calculate note duration based on tempo
          const durationSeconds = (60 / track.tempo) * noteObj.duration;
          
          // Play the note
          await sound.play(noteObj.note)
            .rampToVolumeAtTime(0, durationSeconds)
            .waitDispose();
            
          // Small gap between notes
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error playing track:', err);
      }
    }
  }

  // Stop the current track
  function stopCurrentTrack() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }

  // Update the title display
  function updateTitleDisplay(title) {
    if (titleDisplay) {
      titleDisplay.textContent = title;
    }
  }

  // Toggle play/pause
  function togglePlay() {
    if (isPlaying) {
      stopCurrentTrack();
      if (playButton) {
        playButton.innerHTML = '▶';
        playButton.setAttribute('aria-label', 'Play');
      }
    } else {
      playCurrentTrack();
      if (playButton) {
        playButton.innerHTML = '⏸';
        playButton.setAttribute('aria-label', 'Pause');
      }
    }
    isPlaying = !isPlaying;
  }

  // Go to next track
  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    if (isPlaying) {
      stopCurrentTrack();
      playCurrentTrack();
    } else {
      updateTitleDisplay(tracks[currentTrackIndex].name);
    }
  }

  // Go to previous track
  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    if (isPlaying) {
      stopCurrentTrack();
      playCurrentTrack();
    } else {
      updateTitleDisplay(tracks[currentTrackIndex].name);
    }
  }

  // Set volume
  function setVolume(value) {
    const volume = parseFloat(value);
    masterVolume.gain.setValueAtTime(volume, AC.currentTime);
  }

  // Create the music player UI
  function createMusicPlayerUI() {
    // Create container
    const container = document.createElement('div');
    container.id = 'music-player';
    container.className = 'music-player';
    
    // Create title display
    titleDisplay = document.createElement('div');
    titleDisplay.id = 'mp-title';
    titleDisplay.className = 'mp-title';
    titleDisplay.textContent = tracks[currentTrackIndex].name;
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'mp-controls';
    
    // Create prev button
    prevButton = document.createElement('button');
    prevButton.id = 'mp-prev';
    prevButton.className = 'mp-btn';
    prevButton.innerHTML = '⏮';
    prevButton.setAttribute('aria-label', 'Previous track');
    
    // Create play button
    playButton = document.createElement('button');
    playButton.id = 'mp-play';
    playButton.className = 'mp-btn';
    playButton.innerHTML = '▶';
    playButton.setAttribute('aria-label', 'Play');
    
    // Create next button
    nextButton = document.createElement('button');
    nextButton.id = 'mp-next';
    nextButton.className = 'mp-btn';
    nextButton.innerHTML = '⏭';
    nextButton.setAttribute('aria-label', 'Next track');
    
    // Create volume slider
    volumeSlider = document.createElement('input');
    volumeSlider.id = 'mp-vol';
    volumeSlider.className = 'mp-volume';
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '0.5';
    volumeSlider.step = '0.01';
    volumeSlider.value = '0.15';
    volumeSlider.setAttribute('aria-label', 'Volume');
    
    // Add event listeners
    playButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', nextTrack);
    prevButton.addEventListener('click', prevTrack);
    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
    
    // Assemble the player
    controls.appendChild(prevButton);
    controls.appendChild(playButton);
    controls.appendChild(nextButton);
    controls.appendChild(volumeSlider);
    
    container.appendChild(titleDisplay);
    container.appendChild(controls);
    
    // Add to document
    document.body.appendChild(container);
    
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMusicPlayerUI);
  } else {
    createMusicPlayerUI();
  }
}
