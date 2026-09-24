/* Evervale analytics.
   Fill in the two values below (see ANALYTICS.md); leave a value empty to
   switch that part off. Players stay anonymous: each browser gets a random
   player code such as P-7K2QF, and nothing else identifies the person. */
const EVERVALE_ANALYTICS = {
  ga4: 'G-PY2RV08K7P',   // Google Analytics 4 measurement ID
  sheet: 'https://script.google.com/macros/s/AKfycbzDo0D7oZ9QYgGEgpZRr5IBkfYsKkeKR-2LBthf-FlIQjHhpFGwTqK8j5Qix191vNsR/exec'  // Google Apps Script web app
};

(() => {
  const cfg = EVERVALE_ANALYTICS;
  if (!cfg.ga4 && !cfg.sheet) return;

  const store = (key, make) => {
    try { let v = localStorage.getItem(key); if (!v) { v = make(); localStorage.setItem(key, v); } return v; }
    catch (e) { return make(); }
  };
  const code = n => Array.from({ length: n }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  const player = store('evervale-player', () => 'P-' + code(5));
  const session = code(6);
  const device = matchMedia('(max-width: 760px)').matches ? 'phone' : matchMedia('(max-width: 1100px)').matches ? 'tablet' : 'desktop';
  const current = () => (typeof state !== 'undefined' ? state : {});

  /* ---------- Google Analytics 4 ---------- */
  function gtag() { window.dataLayer.push(arguments); }
  if (cfg.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
    document.head.append(s);
    gtag('js', new Date());
    gtag('config', cfg.ga4, { send_page_view: false });
    gtag('set', 'user_properties', { player_id: player, device_kind: device });
  }
  const ga = (name, params) => { if (cfg.ga4) gtag('event', name, params); };

  /* ---------- Google Sheet (one row per event) ---------- */
  function row(event, extra) {
    if (!cfg.sheet) return;
    const s = current();
    const body = Object.assign({
      player, session, event, device,
      level: s.level || '', hero: s.protagonist || '',
      language: navigator.language || '', referrer: document.referrer ? new URL(document.referrer).hostname : ''
    }, extra || {});
    try {
      fetch(cfg.sheet, { method: 'POST', mode: 'no-cors', keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
        .catch(() => {}); // offline or blocked: the game carries on quietly
    } catch (e) {}
  }

  /* ---------- What is reported ---------- */
  row('visit');
  ga('visit', { player_id: player });

  document.addEventListener('evervale:milestone', e => {
    const d = e.detail || {};
    const name = d.chapter === 'start' ? 'case_started' : d.chapter === 'hero' ? 'hero_chosen' : d.chapter === '10 ending' ? 'case_finished' : 'chapter_complete';
    row(name === 'chapter_complete' ? 'chapter: ' + d.chapter : name, d);
    ga(name, {
      chapter: d.chapter, level: d.level, hero: d.hero, score: d.score, max_score: d.max, accuracy: d.accuracy,
      minutes: d.minutes, route: d.route, ending: d.ending, english_accuracy: d.englishAccuracy
    });
  });

  // Which screens people reach, and where they stop.
  function start() {
    const engineGo = window.go;
    window.go = id => {
      const r = engineGo(id);
      ga('page_view', { page_title: id, page_location: location.origin + location.pathname + '#' + id });
      return r;
    };
    ga('page_view', { page_title: 'start', page_location: location.origin + location.pathname + '#start' });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // The last screen seen when someone leaves.
  addEventListener('pagehide', () => {
    const screen = document.querySelector('.screen.active')?.id || '';
    row('left the game', { screen });
  });
})();
