/* Story and learning layer over the engine in game.js:
   - answer options in random order, so the right one is never "always first";
   - the correct conclusion shown after a mistake in the forensic chapter;
   - "listen" buttons that read English lines aloud;
   - a per-run results record, a learning report on the ending screen, and
     `evervale:milestone` events that analytics.js turns into reports. */
(() => {
  const RESULTS_KEY = 'evervale-results-v1';
  const ru = () => !isEnglishLevel(state.level);

  /* ---------- Results of the current run ---------- */
  function freshResults() {
    return { runId: Math.random().toString(36).slice(2, 10), startedAt: Date.now(), chapterStart: Date.now(),
      sent: {}, wordMistakes: 0, traceCorrect: 0, listens: 0, wrongForensics: [] };
  }
  let results = (() => { try { return JSON.parse(localStorage.getItem(RESULTS_KEY)) || freshResults(); } catch (e) { return freshResults(); } })();
  const keep = () => { try { localStorage.setItem(RESULTS_KEY, JSON.stringify(results)); } catch (e) {} };
  window.evervaleResults = () => results;

  function milestone(chapter, score, max, extra) {
    if (results.sent[chapter]) return;
    const now = Date.now();
    const detail = Object.assign({
      runId: results.runId, chapter, score, max,
      accuracy: max ? Math.round(score / max * 100) : null,
      minutes: Math.round((now - results.chapterStart) / 6000) / 10,
      totalMinutes: Math.round((now - results.startedAt) / 6000) / 10,
      level: state.level, hero: state.protagonist
    }, extra || {});
    results.sent[chapter] = detail;
    results.chapterStart = now;
    keep();
    document.dispatchEvent(new CustomEvent('evervale:milestone', { detail }));
  }

  /* ---------- Engine hooks ---------- */
  function wrap(name, after, before) {
    const engine = window[name];
    if (typeof engine !== 'function') return;
    window[name] = function (...args) {
      const ctx = before ? before(...args) : undefined;
      const out = engine.apply(this, args);
      if (after) after(ctx, ...args);
      return out;
    };
  }
  const shuffle = box => {
    if (!box) return;
    const items = [...box.children];
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    items.forEach(el => box.appendChild(el));
  };

  // One answer per question: a quick double click used to count twice and skip a question.
  let answering = false, answerTimer = null;
  function guardAnswers() {
    // Answers unlock only when the next question is actually on screen.
    [['answerAnalysis', 'renderAnalysisBoard', () => state.analysisStep < analysisQuestions.length],
     ['answerMemoryTrace', 'renderMemoryTrace', () => state.memoryTraceStep < memoryTraceQuestions.length],
     ['answerLongCase', 'renderLongCase', () => state.longCaseStep < longCaseNodes.length],
     ['answer', 'renderQuestion', () => state.question < dialogue.length],
     ['answerCaretaker', 'renderCaretaker', () => state.caretakerStep < caretakerDialogue.length]].forEach(([act, render, open]) => {
      const engineAct = window[act], engineRender = window[render];
      if (typeof engineAct !== 'function' || typeof engineRender !== 'function') return;
      window[act] = function (...args) {
        if (answering || !open()) return;
        answering = true; clearTimeout(answerTimer);
        answerTimer = setTimeout(() => { if (open()) answering = false; }, 4000);
        return engineAct.apply(this, args);
      };
      window[render] = function (...args) { if (open()) { answering = false; clearTimeout(answerTimer); } return engineRender.apply(this, args); };
    });
    const engineGo = window.go;
    window.go = id => { answering = false; return engineGo(id); };
  }

  function hookEngine() {
  wrap('renderAnalysisBoard', () => shuffle(document.getElementById('analysisOptions')));
  wrap('renderMemoryTrace', () => shuffle(document.getElementById('memoryTraceOptions')));
  wrap('renderLongCase', () => {
    const box = document.getElementById('longCaseOptions');
    // The category tags ("DISTRACTION", "COINCIDENCE"…) gave the answer away.
    box?.querySelectorAll('small').forEach(tag => tag.remove());
    shuffle(box);
    // Each of the eight sections has its own scene art (see twilight.css).
    const node = longCaseNodes[state.longCaseStep];
    const visual = document.querySelector('.long-case-visual');
    if (node && visual) visual.dataset.seg = node.seg;
  });

  wrap('selectLevel', () => {
    const fresh = !state.found.length && !state.question && !state.longCaseStep && !state.campaignNode;
    if (!fresh) return;
    results = freshResults(); keep(); document.dispatchEvent(new CustomEvent('evervale:milestone', { detail: { runId: results.runId, chapter: 'start', level: state.level } })); });
  wrap('selectCharacter', () => { if (!results.sent.hero) { results.sent.hero = true; keep(); document.dispatchEvent(new CustomEvent('evervale:milestone', { detail: { runId: results.runId, chapter: 'hero', level: state.level, hero: state.protagonist } })); } });

  wrap('findEvidence', () => { if (state.found.length === 4) milestone('1 apartment 17', 4, 4); });
  wrap('answerAnalysis', () => { if (state.analysisStep >= analysisQuestions.length) milestone('2 neighbours', state.analysisScore, analysisQuestions.length); });
  wrap('findHiddenEvidence', () => { if (state.hiddenFound.length === 4) milestone('3 caretaker office', 4, 4); });
  wrap('answerCaretaker', () => { if (state.caretakerStep >= caretakerDialogue.length) milestone('4 Mara Holt', null, null, { trust: state.caretakerTrust }); });

  wrap('answerLongCase', (ctx) => {
    if (ctx.node && !ctx.correct) {
      results.wrongForensics.push(ctx.index); keep();
      const right = ctx.node.opts[ctx.node.correct];
      showIrene((ru() ? 'Верный вывод: ' : 'The supported conclusion: ') + right.en + (ru() ? ' (' + right.ru + ')' : ''));
    } else closeIrene();
    if (state.longCaseStep >= longCaseNodes.length) milestone('5 archive investigation', state.longCaseScore, longCaseNodes.length, { mistakes: state.longCaseMistakes });
  }, index => {
    const node = longCaseNodes[state.longCaseStep];
    return node ? { node, index: state.longCaseStep, correct: index === node.correct } : { correct: true };
  });

  wrap('chooseWord', () => {
    if (state.memoryStage === 1) milestone('6 her last sentence', Math.max(0, 3 - results.wordMistakes), 3, { mistakes: results.wordMistakes });
  }, (w) => {
    const target = window.CASE_SENTENCE || '';
    const next = state.words.concat(w).join(' ');
    if (!target.startsWith(next)) { results.wordMistakes++; keep(); }
  });
  wrap('answerMemoryTrace', () => {
    if (state.memoryTraceStep >= memoryTraceQuestions.length) milestone('7 her memory', results.traceCorrect, memoryTraceQuestions.length);
  }, correct => { if (correct) { results.traceCorrect++; keep(); } });
  wrap('answer', () => { if (state.question >= dialogue.length) milestone('8 Silas', null, null, { trust: state.trust, influence: state.influence }); });
  wrap('finish', (ctx, type) => {
    milestone('9 verdict', null, null, { route: type });
    milestone('10 ending', null, null, { ending: 'case 001 closed', route: type, ...englishSummary() });
    renderReport();
  });
  }

  /* ---------- Learning report on the ending screen ---------- */
  function englishSummary() {
    const answered = analysisQuestions.length + longCaseNodes.length + memoryTraceQuestions.length;
    const right = state.analysisScore + state.longCaseScore + results.traceCorrect;
    return { englishScore: right, englishMax: answered, englishAccuracy: Math.round(right / answered * 100) };
  }
  function renderReport() {
    const box = document.getElementById('endingResult'); if (!box) return;
    const s = englishSummary(), r = ru() && state.level !== 'A2';
    const rows = [
      [r ? 'Показания соседей (грамматика как улика)' : 'The neighbours (grammar as evidence)', state.analysisScore, analysisQuestions.length],
      [r ? 'Архив невозможных людей (чтение)' : 'The Archive of Impossible People (reading)', state.longCaseScore, longCaseNodes.length],
      [r ? 'Её воспоминание (смысл фраз)' : 'Her memory (meaning of phrases)', results.traceCorrect, memoryTraceQuestions.length]
    ];
    const report = document.createElement('div');
    report.className = 'ev-report';
    report.innerHTML = `<b>${r ? 'Ваш английский в этом деле' : 'Your English in this case'}: ${s.englishAccuracy}%</b>` +
      rows.map(([name, got, max]) => `<div class="ev-report-row"><span>${name}</span><i style="--p:${Math.round(got / max * 100)}%"></i><em>${got}/${max}</em></div>`).join('') +
      `<small>${r ? 'Ошибок в порядке слов' : 'Word-order mistakes'}: ${results.wordMistakes} · ${r ? 'Прослушано фраз' : 'Lines listened to'}: ${results.listens}</small>`;
    box.querySelector('.ev-report')?.remove();
    box.appendChild(report);
  }

  /* ---------- Listen: English lines read aloud ---------- */
  const LISTEN = ['speech', 'caretakerSpeech', 'memoryFragment', 'appearanceQuote', 'campaignQuote', 'longCaseBody', 'sceneDescription'];
  function voice() {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
  }
  function speak(text) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”«»]/g, ''));
    const v = voice(); if (v) u.voice = v;
    u.lang = v ? v.lang : 'en-GB'; u.rate = ['A0', 'A1', 'A2'].includes(state.level) ? 0.82 : 0.95;
    speechSynthesis.speak(u);
    results.listens++; keep();
  }
  function addListenButtons() {
    if (!('speechSynthesis' in window)) return;
    LISTEN.forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.previousElementSibling?.classList.contains('ev-listen')) return;
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'ev-listen';
      btn.setAttribute('aria-label', 'Listen in English');
      btn.innerHTML = '<span aria-hidden="true">🔊</span> Listen';
      btn.addEventListener('click', () => speak(el.textContent || ''));
      el.before(btn);
    });
  }

  // Irene's hint fades after it has had time to be read, unless the pointer rests on it.
  function autoHideIrene() {
    const box = document.getElementById('irene'); if (!box) return;
    let timer = null;
    const canHover = matchMedia('(hover: hover)');
    const engineShow = window.showIrene;
    window.showIrene = text => {
      engineShow(text);
      clearTimeout(timer);
      const wait = Math.max(6000, String(text).length * 60);
      const until = Date.now() + 20000; // never longer than 20 s, even under a resting mouse
      const hide = () => { if (canHover.matches && box.matches(':hover') && Date.now() < until) timer = setTimeout(hide, 2000); else closeIrene(); };
      timer = setTimeout(hide, wait);
    };
  }

  function start() {
    autoHideIrene();
    hookEngine();
    guardAnswers();
    addListenButtons();
    const engineGo = window.go;
    window.go = id => { const r = engineGo(id); if (id === 'ending' && state.caseClosed && results.sent['10 ending']) renderReport(); return r; };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
