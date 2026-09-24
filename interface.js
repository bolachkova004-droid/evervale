/* Presentation and menu state. The story engine remains in game.js. */
(() => {
  let levelContext = 'new';
  let keeperContext = 'new';
  const fullEnglish = () => ['B1', 'B2', 'C1'].includes(state.level);
  const playable = new Set(['intro','appearance','investigation','analysisboard','hiddenstudy','caretaker','longcase','memory','memorytrace','interrogation','verdict','campaign','ending']);
  const hasProgress = () => !!(state.level && state.protagonist);

  function refreshHome() {
    document.querySelectorAll('[data-continue]').forEach(el => { el.hidden = !hasProgress(); });
    document.querySelectorAll('[data-current-level]').forEach(el => { el.textContent = `English ${state.level || 'A2'} · ${fullEnglish() ? 'Immersion' : 'С поддержкой'}`; });
    document.querySelectorAll('[data-current-keeper]').forEach(el => { el.textContent = state.protagonist === 'male' ? 'Арден Вейн · Архивист' : state.protagonist === 'female' ? 'Элара Вейн · Архивист' : 'Выбрать архивиста'; });
    document.querySelectorAll('[data-music-toggle]').forEach(el => {
      el.setAttribute('aria-pressed', String(!!state.music));
      el.setAttribute('aria-label', state.music ? 'Выключить музыку' : 'Включить музыку');
    });
    document.querySelectorAll('[data-music-status]').forEach(el => { el.textContent = state.music ? 'On' : 'Start'; });
  }

  window.startNewCase = () => {
    if (hasProgress() && !window.confirm('Начать новое дело? Текущее сохранение будет заменено после выбора уровня.')) return;
    levelContext = 'new'; keeperContext = 'new'; go('level');
  };
  window.openLevelSettings = () => { levelContext = hasProgress() ? 'settings' : 'new'; go('level'); };
  window.openKeeperSettings = () => {
    keeperContext = hasProgress() ? 'settings' : 'new';
    if (!state.level) { levelContext = 'new'; go('level'); }
    else go('character');
  };

  const engineSelectLevel = window.selectLevel;
  window.selectLevel = level => {
    if (levelContext === 'settings') {
      state.level = level; applyLanguage(); save(); go('start');
    } else {
      keeperContext = 'new'; engineSelectLevel(level);
    }
  };
  const engineSelectCharacter = window.selectCharacter;
  window.selectCharacter = protagonist => {
    if (keeperContext === 'settings') {
      state.protagonist = protagonist; renderProtagonist(); save(); go('start');
    } else engineSelectCharacter(protagonist);
  };

  function refreshBook() {
    const en = fullEnglish();
    const translation = document.getElementById('introTranslation');
    translation.hidden = en;
    translation.textContent = 'Ночью городской Архив получил анонимное сообщение. В квартире №17 нашли мёртвую женщину. У неё нет документов, её отпечатков нет ни в одной базе, а соседи говорят, что квартира пустует уже несколько лет.';
    document.querySelector('.chronicle-step-title').textContent = en ? 'Read both pages of the case file' : 'Прочитайте две страницы дела';
    document.querySelector('.chronicle-chapter-label').innerHTML = 'Case 001<br>Apartment 17';
  }

  function renderJournal() {
    const chapters = [
      ['Квартира №17', state.found.length === 4],
      ['Показания соседей', state.analysisStep >= analysisQuestions.length],
      ['Контора смотрительницы', state.hiddenFound.length === 4],
      ['Мара Холт', state.caretakerStep >= caretakerDialogue.length],
      ['Архив невозможных людей', state.longCaseDone],
      ['Её последнее воспоминание', state.deepMemoryDone],
      ['Разговор с Сайласом', state.question >= dialogue.length],
      ['Квартира, которой не было', !!state.caseClosed]
    ];
    const current = chapters.findIndex(c => !c[1]);
    const list = document.getElementById('journalChapters');
    list.replaceChildren();
    chapters.forEach(([title, done], i) => {
      const item = document.createElement('li');
      if (i === current) item.setAttribute('aria-current','step');
      const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2,'0');
      const label = document.createElement('b'); label.textContent = title;
      const status = document.createElement('small'); status.textContent = done ? 'Завершено' : i === current ? 'Текущая глава' : 'Впереди';
      item.append(number, label, status); list.append(item);
    });
  }

  const engineGo = window.go;
  window.go = id => {
    if (!document.getElementById(id)?.classList.contains('screen')) return;
    const result = engineGo(id);
    const active = document.querySelector('.screen.active');
    if (active && playable.has(active.id)) {
      // Appearance's return target lives outside the save; resume its scene.
      state.lastScreen = active.id === 'appearance' ? appearanceNext : active.id;
      save();
    }
    if (id === 'start') refreshHome();
    if (id === 'intro') refreshBook();
    if (id === 'longcaseplan') renderJournal();
    return result;
  };

  const engineContinue = window.continueGame;
  window.continueGame = () => {
    const saved = load();
    if (saved?.lastScreen && playable.has(saved.lastScreen) && saved.lastScreen !== 'appearance' && saved.lastScreen !== 'ending') {
      state = normaliseState(saved); applyLanguage(); renderProtagonist(); go(saved.lastScreen); return;
    }
    engineContinue();
  };

  const engineMusicButtons = window.updateMusicButtons;
  window.updateMusicButtons = () => { engineMusicButtons(); refreshHome(); };
  const engineApplyLanguage = window.applyLanguage;
  window.applyLanguage = () => { engineApplyLanguage(); refreshBook(); refreshHome(); };

  function initialise() {
    document.querySelectorAll('.topbar').forEach(bar => {
      const menu = document.createElement('button');
      menu.type = 'button'; menu.className = 'icon-btn game-menu-button'; menu.textContent = 'Menu';
      menu.setAttribute('aria-label','Главное меню'); menu.addEventListener('click', () => go('start')); bar.append(menu);
    });
    refreshHome(); refreshBook();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
})();
