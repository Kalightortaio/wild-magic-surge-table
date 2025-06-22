(() => {
  const DICE_SOUNDS = [
    "/resources/sounds/dice_sound_1.mp3",
    "/resources/sounds/dice_sound_2.mp3",
    "/resources/sounds/dice_sound_3.mp3",
    "/resources/sounds/dice_sound_4.mp3",
    "/resources/sounds/dice_sound_5.mp3",
    "/resources/sounds/dice_sound_6.mp3"
  ];

  const recent = [];

  function pickSound () {
    const pool = DICE_SOUNDS
      .map((_, i) => i)
      .filter(i => !recent.includes(i));

    const idx = pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : Math.floor(Math.random() * DICE_SOUNDS.length);

    recent.push(idx);
    if (recent.length > 2) recent.shift(); // keep only the last 2
    return DICE_SOUNDS[idx];
  }

  const PITCHES = [0.90, 0.95, 1.00, 1.05, 1.10];

  window.playDiceSound = function () {
    const audio = new Audio(pickSound()); 
    audio.playbackRate = PITCHES[Math.floor(Math.random() * PITCHES.length)];
    audio.volume = 0.15;
    audio.play().catch(console.error);
  };
})();