/* Small touches of atmosphere: a page rustle and a soft flash when the
   story moves to another screen, a chime when a clue is found, and music
   buttons that show whether the score is playing. Sounds are synthesised,
   so there are no extra files to load. */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let ctx = null;

  function audio() {
    try {
      const A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      if (!ctx) ctx = new A();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (err) { return null; }
  }

  // Paper turning: a short burst of noise swept through a band-pass filter.
  function pageTurn() {
    const a = audio(); if (!a) return;
    const now = a.currentTime, dur = 0.38;
    const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * t), 1.6) * (0.6 + 0.4 * Math.random());
    }
    const src = a.createBufferSource(); src.buffer = buf;
    const band = a.createBiquadFilter(); band.type = 'bandpass'; band.Q.value = 0.9;
    band.frequency.setValueAtTime(900, now);
    band.frequency.exponentialRampToValueAtTime(3800, now + dur);
    const gain = a.createGain(); gain.gain.value = 0.05;
    src.connect(band); band.connect(gain); gain.connect(a.destination);
    src.start(now);
  }

  // A clue found: three bell-like partials rising like a small arpeggio.
  function chime() {
    const a = audio(); if (!a) return;
    const now = a.currentTime;
    [[659.25, 0], [987.77, 0.09], [1318.5, 0.18]].forEach(([freq, delay]) => {
      const osc = a.createOscillator(), gain = a.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = now + delay;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(gain); gain.connect(a.destination);
      osc.start(t); osc.stop(t + 1.15);
    });
  }

  function flash() {
    if (reduceMotion.matches) return;
    const app = document.getElementById('app'); if (!app) return;
    const el = document.createElement('div');
    el.className = 'ev-flash'; el.setAttribute('aria-hidden', 'true');
    app.append(el);
    setTimeout(() => el.remove(), 800);
  }

  function markMusicButtons() {
    const on = typeof state !== 'undefined' && !!state.music;
    document.querySelectorAll('[id^="musicBtn"]').forEach(btn => {
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function start() {
    const engineGo = window.go;
    window.go = id => {
      const before = document.querySelector('.screen.active')?.id;
      const result = engineGo(id);
      const after = document.querySelector('.screen.active')?.id;
      if (after && after !== before) { pageTurn(); flash(); }
      return result;
    };

    const withChime = (name, found) => {
      const engine = window[name];
      if (typeof engine !== 'function') return;
      window[name] = n => {
        const isNew = !found().includes(n);
        const result = engine(n);
        if (isNew && found().includes(n)) chime();
        return result;
      };
    };
    withChime('findEvidence', () => state.found || []);
    withChime('findHiddenEvidence', () => state.hiddenFound || []);

    const engineMusic = window.updateMusicButtons;
    window.updateMusicButtons = () => { engineMusic(); markMusicButtons(); };
    markMusicButtons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
