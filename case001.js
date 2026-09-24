/* CASE 001 · THE FACELESS WOMAN
   The story of the first case, told in three acts:
     I   The Woman Who Isn't There — Apartment 17, the neighbours, Mara Holt;
     II  The Archive of Impossible People — the Unwritten, Silas, the Queen;
     III Your Name Is Missing — your own file, Irene's signature, the woman's
         last memory, and an apartment that was never there.
   Every answer changes the meaning of an earlier one instead of closing it.
   The engine (game.js) keeps the mechanics; this file supplies the case.
   Text may use {female|male} to follow the chosen hero. */
(() => {
  const EN = () => isEnglishLevel(state.level);
  const A2 = () => state.level === 'A2';
  const ENA = () => EN() || A2(); // A2 reads English first, translation on request
  const beginner = () => state.level === 'A1' || state.level === 'A0';
  const replace = (arr, items) => arr.splice(0, arr.length, ...items);

  /* ---------- Opening, scene and verdict texts ---------- */
  Object.assign(UI.A1, {
    introK: 'Дело 001', introT: 'Женщина без лица',
    intro1: 'At night, the City Archive received an anonymous message. A woman was found dead in Apartment 17.',
    intro2: 'Ночью городской Архив получил анонимное сообщение. В квартире №17 нашли мёртвую женщину. У неё нет документов, её отпечатков нет ни в одной базе, а соседи говорят, что квартира пустует уже несколько лет.',
    introB: 'Войти в квартиру', memory: 'Поговорить с соседями',
    investK: 'Осмотр квартиры', progress: 'Акт I · найдите четыре странности',
    scene: 'The apartment looks lived in, but there are no documents. Two cups stand on the table. The clock stopped one minute before midnight.',
    sceneRu: 'Квартира выглядит жилой, но документов нет. На столе стоят две чашки. Часы остановились за минуту до полуночи.',
    lead: 'Читайте описания на английском. Перевод и слова — ниже.',
    verdictT: 'Что вы напишете в отчёте?',
    verdictC: 'The Ministry wants the file closed tonight. Министерство хочет закрыть дело сегодня: неизвестная женщина, естественная смерть, никакой квартиры №17. Ваш отчёт решит, что запомнит Архив.',
    endK: 'Дело 001 · закрыто'
  });
  Object.assign(UI.A2, {
    introK: 'CASE 001', introT: 'The Faceless Woman',
    intro1: 'At night, the City Archive received an anonymous message. A woman was found dead in Apartment 17.',
    intro2: 'She has no documents. Her fingerprints are in no database. The neighbours say the apartment has been empty for years.',
    investK: 'Apartment 17', progress: 'Act I · find four strange things', memory: 'Talk to the neighbours',
    scene: 'The apartment looks lived in, but there are no documents and no personal photos—except one. Two cups stand on the table. The clock stopped one minute before midnight.',
    sceneRu: 'Квартира выглядит жилой, но в ней нет документов и личных фотографий — кроме одной. На столе стоят две чашки. Часы остановились за минуту до полуночи.',
    verdictT: 'What will you write in your report?',
    verdictC: 'The Ministry wants the file closed tonight: an unknown woman, natural causes, no Apartment 17. Your report decides what the Archive will remember.',
    endK: 'Case 001 · closed'
  });
  Object.assign(UI.B1, {
    introK: 'CASE 001', introT: 'The Faceless Woman',
    intro1: 'Shortly after midnight, the City Archive received an anonymous message: a woman had been found dead in Apartment 17.',
    intro2: 'She carried no documents, her fingerprints matched no database, and the neighbours insisted that the apartment had stood empty for years.',
    investK: 'Apartment 17', progress: 'Act I · find four things that should not be here', memory: 'Question the neighbours',
    scene: 'The apartment is clearly lived in, yet every document has been removed. Two cups stand on the table, one of them still warm, and the clock has stopped one minute before midnight.',
    sceneRu: '',
    verdictT: 'What will your report say?',
    verdictC: 'The Ministry has asked for the file to be closed tonight: an unidentified woman, natural causes, and no such place as Apartment 17. Your report decides what the Archive will remember—and what it will be allowed to forget.',
    endK: 'Case 001 · closed'
  });

  /* ---------- Act I · Apartment 17 ---------- */
  replace(clues, [
    { en: 'Two cups on the table', desc: 'One cup is empty. The other is full and still warm.', ru: 'Две чашки на столе · одна пустая, другая полная и ещё тёплая.', words: 'cup — чашка · still warm — ещё тёплая' },
    { en: 'A photograph with a cut-out face', desc: 'The woman’s face has been cut out. The person next to her looks like you.', ru: 'Фотография с вырезанным лицом · лицо женщины вырезано, а человек рядом с ней похож на вас.', words: 'cut out — вырезать · look like — быть похожим' },
    { en: 'A notebook with one sentence', desc: '“If you are reading this, they erased me again.”', ru: 'Записная книжка с одной фразой · «Если вы это читаете, меня снова стёрли».', words: 'erase — стирать · again — снова' },
    { en: 'An old silver key', desc: 'It opens no door in the apartment. You know this key. You don’t know how.', ru: 'Старый серебряный ключ · он не подходит ни к одной двери в квартире. Вы знаете этот ключ. Не знаете откуда.', words: 'silver — серебряный · open a door — открыть дверь' }
  ]);
  const clueFound = {
    en: ['Someone was here with her. Recently.', 'The person in the photograph is wearing your coat.', '“Again” means this has happened before.', 'You have seen this key before. You don’t remember where.'],
    ru: ['С ней кто-то был. Совсем недавно.', 'На человеке с фотографии — ваше пальто.', '«Again» значит, что это уже случалось.', 'Вы уже видели этот ключ. Не помните где.']
  };
  window.findEvidence = function (n) {
    clickSfx();
    if (state.found.includes(n)) return;
    state.found.push(n);
    toast((ENA() ? clueFound.en : clueFound.ru)[n - 1]);
    renderEvidence(); updateUI(); save();
    if (state.found.length === 2 && !state.morwenSeen) {
      state.morwenSeen = true; save();
      setTimeout(() => showAppearance('morwen', 'investigation'), 700); return;
    }
    if (state.found.length === 4 && !state.ireneKeySeen) {
      state.ireneKeySeen = true; save();
      setTimeout(() => showAppearance('irene_key', 'investigation'), 900);
    }
  };

  /* ---------- Act I · What the neighbours say ---------- */
  replace(analysisQuestions, [
    { q: 'One neighbour says: “No one lived there.” Another says: “She moved in last winter.” What is the best conclusion?',
      qRu: 'Один сосед говорит: «No one lived there». Другой: «She moved in last winter». Какой вывод лучше всего?',
      context: 'Both neighbours seem honest. Neither of them is nervous.',
      contextRu: 'Оба соседа кажутся честными. Никто из них не нервничает.',
      options: [['One of them is lying for money.', 'Один из них лжёт ради денег.', false],
                ['They remember two different pasts of the same apartment.', 'Они помнят два разных прошлых одной и той же квартиры.', true],
                ['The woman lived in another building.', 'Женщина жила в другом доме.', false]],
      feedback: 'Two honest people remember two different pasts. In Evervale this is not a mistake. It is a symptom.' },
    { q: 'The building manager says: “Apartment 17 does not exist.” The official plan shows room 16, then room 18. You are standing inside 17. What is true?',
      qRu: 'Управляющий говорит: «Apartment 17 does not exist». На официальном плане — комната 16, потом 18. Вы стоите внутри №17. Что правда?',
      context: '“Does not exist” is present simple: it states the official fact now—not what you can see.',
      contextRu: '«Does not exist» — Present Simple: это официальный факт сейчас, а не то, что вы видите.',
      options: [['The apartment was removed from the records, not from the building.', 'Квартиру убрали из документов, а не из здания.', true],
                ['The plan is wrong by accident.', 'План случайно ошибочен.', false],
                ['You are actually in apartment 18.', 'На самом деле вы в квартире 18.', false]],
      feedback: 'The door is real. The record is not. Someone erased Apartment 17 from paper.' },
    { q: 'The notebook says: “If you are reading this, they erased me again.” Which word tells you this is not the first time?',
      qRu: 'В записной книжке: «If you are reading this, they erased me again». Какое слово говорит, что это не в первый раз?',
      context: 'One small word changes the whole sentence.',
      contextRu: 'Одно маленькое слово меняет всё предложение.',
      options: [['“again”', '«again» — снова', true], ['“they”', '«they» — они', false], ['“reading”', '«reading» — читаете', false]],
      feedback: '“Again” means it happened before. She was erased more than once—and she knew it would happen.' },
    { q: 'A voice in your head says: “You have seen this key before.” What does the present perfect “have seen” tell you?',
      qRu: 'Голос в голове говорит: «You have seen this key before». Что сообщает Present Perfect «have seen»?',
      context: 'Present perfect connects the past with now, but it does not say when.',
      contextRu: 'Present Perfect связывает прошлое с настоящим, но не говорит, когда это было.',
      options: [['You saw it at some unknown time, and it matters now.', 'Вы видели его когда-то, неизвестно когда, и это важно сейчас.', true],
                ['You saw it five minutes ago.', 'Вы видели его пять минут назад.', false],
                ['You will see it tomorrow.', 'Вы увидите его завтра.', false]],
      feedback: 'Your memory knows this key. Your records do not.' }
  ]);
  const wrapAfter = (name, after) => {
    const engine = window[name];
    window[name] = function (...args) { const r = engine.apply(this, args); after(...args); return r; };
  };
  const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  wrapAfter('renderAnalysisBoard', () => {
    setText('analysisTitle', EN() || A2() ? 'What the Neighbours Say' : 'Показания соседей');
    setText('analysisIntro', EN() || A2()
      ? 'The people around Apartment 17 do not agree about anything. Read carefully: one small word can change a whole testimony.'
      : 'Люди вокруг квартиры №17 ни в чём не согласны друг с другом. Читайте внимательно: одно маленькое слово может изменить всё показание.');
  });
  wrapAfter('renderEvidence', () => {
    if (beginner()) setText('investHint', 'Подсказка: осмотрите стену у зеркала, стол, пол и место у окна.');
  });

  /* ---------- Act I · The caretaker's office ---------- */
  replace(hiddenClues, [
    { en: 'The official floor plan', desc: 'Room 16, then room 18. There is a fresh white line where 17 should be.', ru: 'Официальный план этажа · комната 16, потом 18. Там, где должна быть 17, — свежая белая линия.', words: 'floor plan — план этажа · fresh — свежий' },
    { en: 'The tenant ledger', desc: 'One line is empty, but the pen pressed so hard that you can still read the first letter: “E—”.', ru: 'Журнал жильцов · одна строка пустая, но ручка давила так сильно, что видна первая буква: «Э—».', words: 'ledger — журнал · press — давить' },
    { en: 'The key board', desc: 'Every hook has a number except one. On it hangs a violet ribbon without a key.', ru: 'Доска с ключами · у каждого крючка есть номер, кроме одного. На нём висит фиолетовая лента без ключа.', words: 'hook — крючок · ribbon — лента' },
    { en: 'A note in Mara’s handwriting', desc: '“Remember: her name was ______. Don’t let them take it again.”', ru: 'Записка почерком Мары · «Помни: её звали ______. Не дай им снова это забрать».', words: 'handwriting — почерк · take — забрать' }
  ]);
  const officeFound = {
    en: ['Apartment 17 was painted out of the plan.', 'Someone wrote her name. The ink is gone.', 'The same violet thread is tied to your silver key.', 'Mara tried to warn herself.'],
    ru: ['Квартиру №17 закрасили на плане.', 'Кто-то написал её имя. Чернила исчезли.', 'Такая же фиолетовая нить привязана к вашему серебряному ключу.', 'Мара пыталась предупредить сама себя.']
  };
  window.findHiddenEvidence = function (n) {
    clickSfx();
    if (state.hiddenFound.includes(n)) return;
    state.hiddenFound.push(n);
    toast((ENA() ? officeFound.en : officeFound.ru)[n - 1]);
    save(); renderHiddenStudy();
    if (state.hiddenFound.length === 4) showIrene(ENA()
      ? 'Mara knew the woman. She writes notes to her own memory. Talk to her—gently.'
      : 'Мара знала эту женщину. Она пишет записки собственной памяти. Поговорите с ней — бережно.');
  };
  wrapAfter('renderHiddenStudy', () => {
    const en = EN(), a2 = A2();
    setText('hiddenEvidenceLabel', en || a2 ? 'Clues' : 'Улики');
    setText('studyKicker', en || a2 ? 'ACT I · THE CARETAKER' : 'АКТ I · СМОТРИТЕЛЬНИЦА');
    setText('studyTitle', en || a2 ? 'The Caretaker’s Office' : 'Контора смотрительницы');
    setText('studyIntro', en || a2
      ? 'Mara Holt’s small office is on the ground floor. The building’s official papers are here—and something that is not official at all.'
      : 'Маленькая контора Мары Холт — на первом этаже. Здесь официальные бумаги дома — и кое-что совсем неофициальное.');
    setText('studyDescription', en || a2
      ? 'Keys hang on a board. Every hook has a number. One hook has no number, but it has a ribbon.'
      : 'На доске висят ключи. У каждого крючка есть номер. У одного номера нет, зато есть лента.');
    setText('studyMaterials', en || a2 ? 'Office papers' : 'Бумаги конторы');
    setText('studyLead', en || a2 ? 'Find four things that show how Apartment 17 was removed from the building.' : 'Найдите четыре вещи, которые показывают, как квартиру №17 убрали из дома.');
    setText('studyProgress', en || a2 ? 'Find four clues' : 'Найдите четыре улики');
    setText('caretakerBtn', en || a2 ? 'Talk to Mara Holt' : 'Поговорить с Марой Холт');
    const hint = document.getElementById('studyHint');
    if (hint && beginner()) hint.textContent = 'Подсказка: осмотрите стену, полку, стол и место у окна.';
  });

  /* ---------- Act I · Mara Holt ---------- */
  replace(caretakerDialogue, [
    { speech: 'Her name was Elara. She always made two cups of tea—one for herself and one for someone who never came.',
      ru: 'Её звали Элара. Она всегда заваривала две чашки чая — себе и кому-то, кто так и не пришёл.',
      context: 'Mara looks at the photograph for a long time—not at the missing face, but at the person next to it. {The name is yours too.|The name means nothing to you. Then why are your hands cold?}',
      contextRu: 'Мара долго смотрит на фотографию — не на вырезанное лицо, а на человека рядом. {Это имя — и ваше тоже.|Это имя вам ничего не говорит. Тогда почему у вас похолодели руки?}',
      vocab: ['always — всегда', 'someone — кто-то', 'never came — так и не пришёл'],
      choices: [
        { tone: 'GENTLE', en: 'Take your time. What else do you remember about her?', ru: 'Не торопитесь. Что ещё вы о ней помните?', trust: 2, influence: 0, fb: 'An open, gentle question gives a frightened witness room to speak.' },
        { tone: 'DETAIL', en: 'Who was the second cup for?', ru: 'Для кого была вторая чашка?', trust: 1, influence: 1, fb: 'A precise question follows the most unusual detail.' },
        { tone: 'PRESSURE', en: 'You knew her well. Why did you say nothing?', ru: 'Вы хорошо её знали. Почему вы молчали?', trust: -1, influence: 2, fb: 'Pressure can bring quick answers, but a scared witness closes up.' }] },
    { speech: 'Whose name? I’m sorry, Investigator… who are we talking about?',
      ru: 'Чьё имя? Простите, следователь… о ком мы говорим?',
      context: 'Two minutes ago Mara said a name. Now it is gone from her face, like a word wiped off a board.',
      contextRu: 'Две минуты назад Мара назвала имя. Теперь оно исчезло с её лица, как слово, стёртое с доски.',
      vocab: ['whose — чей', 'wipe off — стереть', 'a minute ago — минуту назад'],
      choices: [
        { tone: 'REPEAT', en: 'You said her name was Elara. Two minutes ago.', ru: 'Вы сказали, что её звали Элара. Две минуты назад.', trust: 0, influence: 1, fb: 'Repeating a fact cannot bring back an erased memory. Evervale does not work like that.' },
        { tone: 'ASSOCIATION', en: 'Show her the silver key without a word.', ru: 'Молча показать ей серебряный ключ.', trust: 3, influence: 0, fb: 'An object can reach a memory that words cannot. In Evervale, associations survive erasure.' },
        { tone: 'PHOTOGRAPH', en: 'Show her the photograph again.', ru: 'Снова показать ей фотографию.', trust: 1, influence: 1, fb: 'The photograph helped once. But the face is missing—and so is the memory attached to it.' }] },
    { speech: 'That key… she wore it on a violet ribbon. She said it opened a door that isn’t there anymore.',
      ru: 'Этот ключ… она носила его на фиолетовой ленте. Она говорила, что он открывает дверь, которой больше нет.',
      context: 'Whatever you showed her, Mara’s eyes stop on the silver key. Something comes back—not the whole memory, only its edges.',
      contextRu: 'Что бы вы ей ни показали, взгляд Мары останавливается на серебряном ключе. Что-то возвращается — не всё воспоминание, только его края.',
      vocab: ['wear — носить', 'ribbon — лента', 'not… anymore — больше не'],
      choices: [
        { tone: 'CLARIFY', en: 'Which door? Where was it?', ru: 'Какая дверь? Где она была?', trust: 1, influence: 1, fb: 'A follow-up question keeps the memory open a little longer.' },
        { tone: 'INFERENCE', en: 'A door that isn’t there anymore—like Apartment 17.', ru: 'Дверь, которой больше нет, — как квартира №17.', trust: 2, influence: 1, fb: '“Isn’t there anymore” means it existed before. You connect her words to the evidence.' },
        { tone: 'PERSONAL', en: 'Did she ever talk about me?', ru: 'Она когда-нибудь говорила обо мне?', trust: 2, influence: 0, fb: 'A personal question is risky—but the photograph already asked it for you.' }] },
    { speech: 'She told me: if someone comes asking, tell them to look for the ones who were never written.',
      ru: 'Она сказала мне: если кто-то придёт с вопросами, пусть ищет тех, кого никогда не записывали.',
      context: 'Mara holds her own note so tightly that the paper tears. She is already starting to forget again.',
      contextRu: 'Мара сжимает свою записку так сильно, что бумага рвётся. Она уже начинает забывать снова.',
      vocab: ['come asking — прийти с вопросами', 'look for — искать', 'never written — никогда не записанные'],
      choices: [
        { tone: 'PROMISE', en: 'I will find them. And I will come back for you.', ru: 'Я найду их. И вернусь за вами.', trust: 3, influence: 0, fb: '“Will” makes a promise. Mara may forget you—but perhaps not that someone promised.' },
        { tone: 'PRACTICAL', en: 'Write it down, Mara. Right now, in your own words.', ru: 'Запишите это, Мара. Прямо сейчас, своими словами.', trust: 2, influence: 1, fb: 'An imperative with a practical goal. Writing is how Mara fights erasure.' },
        { tone: 'LANGUAGE', en: '“Never written”… that sounds like an Archive term.', ru: '«Никогда не записанные»… похоже на архивный термин.', trust: 1, influence: 2, fb: 'You notice unusual wording. In this case, unusual phrases are clues.' }] }
  ]);

  /* ---------- Acts II–III · The Archive investigation ---------- */
  const opt = (en, ru) => ({ en, ru, tag: '' });
  replace(longCaseSegments, [
    { k: 'ACT II · THE UNWRITTEN', kRu: 'АКТ II · НЕЗАПИСАННЫЕ', title: 'The Archive of Impossible People', titleRu: 'Архив невозможных людей', symbol: '▤',
      desc: 'Mara’s words lead you to a closed section of the Archive. The woman from Apartment 17 is not the only person missing from every register.',
      descRu: 'Слова Мары приводят вас в закрытый отдел Архива. Женщина из квартиры №17 — не единственная, кого нет ни в одном реестре.' },
    { k: 'ACT II · SILAS VANE', kRu: 'АКТ II · САЙЛАС ВЕЙН', title: 'The Man Who Lost His Case', titleRu: 'Человек, потерявший дело', symbol: '◉',
      desc: 'A former investigator is waiting in the reading room. Years ago he worked on a case like this one—and lost his job because of it.',
      descRu: 'В читальном зале ждёт бывший следователь. Много лет назад он вёл похожее дело — и потерял из-за него работу.' },
    { k: 'ACT II · THE NAMELESS QUEEN', kRu: 'АКТ II · БЕЗЫМЯННАЯ КОРОЛЕВА', title: 'Three Stories About One Woman', titleRu: 'Три истории об одной женщине', symbol: '♛',
      desc: 'One phrase repeats in the letters of the Unwritten: “the Queen”. Everyone you ask gives you a different answer.',
      descRu: 'В письмах незаписанных повторяется одно слово: «Королева». Каждый, кого вы спрашиваете, отвечает по-своему.' },
    { k: 'ACT III · YOUR NAME IS MISSING', kRu: 'АКТ III · ВАШЕГО ИМЕНИ НЕТ', title: 'The Registration Archive', titleRu: 'Регистрационный архив', symbol: '◇',
      desc: 'To test the Queen theory, you open the old registration archive. You find a file you did not expect: your own.',
      descRu: 'Чтобы проверить версию о Королеве, вы открываете старый регистрационный архив. И находите дело, которого не ждали: ваше собственное.' },
    { k: 'ACT III · OREN’S LAB', kRu: 'АКТ III · ЛАБОРАТОРИЯ ОРЕНА', title: 'What Was Taken', titleRu: 'Что было взято', symbol: '✧',
      desc: 'Oren Thale examines what is left of the woman’s memory. He warns you that some answers change the meaning of old ones.',
      descRu: 'Орен Тейл изучает то, что осталось от памяти женщины. Он предупреждает: некоторые ответы меняют смысл старых.' },
    { k: 'ACT III · THE FALSE ANSWER', kRu: 'АКТ III · ЛОЖНЫЙ ОТВЕТ', title: 'Was She the Queen?', titleRu: 'Была ли она Королевой?', symbol: '∞',
      desc: 'Everything points to one beautiful idea: the faceless woman was the Queen. It is a beautiful answer. It is also too easy.',
      descRu: 'Всё указывает на одну красивую идею: женщина без лица была Королевой. Это красивый ответ. И слишком простой.' }
  ]);
  replace(longCaseNodes, [
    // I · The Unwritten
    { seg: 0, loc: 'Closed Archive · 04:10', title: 'Letters to Nobody', titleRu: 'Письма никому', doc: 1,
      body: 'In a sealed drawer you find forty old letters. They are written to a teacher, a baker, a doctor, a sister. None of these people are in any register—but some of the letters were answered.',
      bodyRu: 'В запечатанном ящике — сорок старых писем. Они адресованы учителю, пекарю, врачу, сестре. Ни одного из этих людей нет в реестрах, но на некоторые письма пришли ответы.',
      task: 'What do the letters prove?', taskRu: 'Что доказывают письма?', correct: 0,
      opts: [opt('These people existed; only their records are gone.', 'Эти люди существовали, исчезли только записи о них.'), opt('One person wrote all the letters as a story.', 'Все письма написал один человек, как рассказ.'), opt('The registers burned in a fire.', 'Реестры сгорели при пожаре.')],
      vocab: ['register — реестр', 'answer — отвечать', 'sealed — запечатанный'] },
    { seg: 0, loc: 'Closed Archive · 04:35', title: 'Empty Places in Photographs', titleRu: 'Пустые места на фотографиях', fact: 1,
      body: 'In old group photographs some faces are not blurred or damaged. They are simply empty, as if the painter never finished them. The people next to them are smiling at someone.',
      bodyRu: 'На старых групповых снимках некоторые лица не размыты и не повреждены. Они просто пустые, будто художник их не дорисовал. Люди рядом кому-то улыбаются.',
      task: 'Why does the smiling matter?', taskRu: 'Почему важны улыбки?', correct: 0,
      opts: [opt('The others saw a real person there when the photo was taken.', 'Остальные видели там живого человека, когда делали снимок.'), opt('People always smile in photographs.', 'На фотографиях всегда улыбаются.'), opt('The empty places are a printing error.', 'Пустые места — ошибка печати.')],
      vocab: ['blurred — размытый', 'damaged — повреждённый', 'as if — как будто'] },
    { seg: 0, loc: 'Card index · 05:00', title: 'Not Dead. Not Missing.', titleRu: 'Не мёртвые. Не пропавшие.', doc: 1,
      body: 'An old archivist’s card index has a special word for these people: THE UNWRITTEN. A note explains: “Do not file as dead. Do not file as missing. Officially, they were never born.”',
      bodyRu: 'В картотеке старого архивиста для этих людей есть особое слово: НЕЗАПИСАННЫЕ. Пояснение: «Не оформлять как умерших. Не оформлять как пропавших. Официально они никогда не рождались».',
      task: 'What is the difference between “missing” and “unwritten”?', taskRu: 'Чем «пропавший» отличается от «незаписанного»?', correct: 0,
      opts: [opt('A missing person is still in the records; an unwritten person was removed from them.', 'Пропавший всё ещё есть в записях, а незаписанного из них удалили.'), opt('There is no difference; they are synonyms.', 'Разницы нет, это синонимы.'), opt('Unwritten people are living secretly in the city.', 'Незаписанные тайно живут в городе.')],
      vocab: ['file as — оформить как', 'missing — пропавший', 'officially — официально'] },
    { seg: 0, loc: 'Card index · 05:20', title: 'Card Seventeen', titleRu: 'Карточка семнадцать', fact: 1,
      body: 'Card seventeen has no name. It has a drawing of a silver key and one date: the night you entered Apartment 17. The ink is years old.',
      bodyRu: 'На карточке семнадцать нет имени. На ней нарисован серебряный ключ и стоит одна дата — ночь, когда вы вошли в квартиру №17. Чернилам много лет.',
      task: 'What is the most careful conclusion?', taskRu: 'Какой вывод самый осторожный?', correct: 0,
      opts: [opt('Someone knew about this night long before it happened.', 'Кто-то знал об этой ночи задолго до неё.'), opt('A thief added the date tonight.', 'Дату дописал вор этой ночью.'), opt('The key on the card is a different key.', 'На карточке другой ключ.')],
      vocab: ['careful — осторожный', 'long before — задолго до', 'ink — чернила'] },
    // II · Silas
    { seg: 1, loc: 'Reading room · 06:00', title: 'Worse Than Hiding Crimes', titleRu: 'Хуже, чем скрывать преступления', witness: 1,
      body: 'Silas speaks quietly: “You think the Ministry erases memories to hide crimes. It’s worse. They erase crimes by erasing the people they happened to.”',
      bodyRu: 'Сайлас говорит тихо: «Вы думаете, Министерство стирает память, чтобы скрыть преступления. Всё хуже. Они стирают преступления, стирая людей, с которыми те случились».',
      task: 'What does Silas mean?', taskRu: 'Что имеет в виду Сайлас?', correct: 0,
      opts: [opt('If the victim never existed, no one can investigate the crime.', 'Если жертвы не существовало, преступление нельзя расследовать.'), opt('The Ministry never commits crimes.', 'Министерство никогда не совершает преступлений.'), opt('People forget crimes naturally with time.', 'Люди со временем сами забывают преступления.')],
      vocab: ['happen to — случиться с', 'worse — хуже', 'hide — скрывать'] },
    { seg: 1, loc: 'Reading room · 06:25', title: 'Green Eyes', titleRu: 'Зелёные глаза', witness: 1,
      body: 'Silas describes the woman from Apartment 17: “Tall, green eyes, a scar on her left hand.” The autopsy report says: brown eyes, no scars. Silas does not seem to be lying.',
      bodyRu: 'Сайлас описывает женщину из квартиры №17: «Высокая, зелёные глаза, шрам на левой руке». В протоколе вскрытия: карие глаза, шрамов нет. Сайлас не похож на лжеца.',
      task: 'How should you treat his description?', taskRu: 'Как отнестись к его описанию?', correct: 0,
      opts: [opt('As a real memory that may belong to a different version of events.', 'Как к настоящему воспоминанию, которое может относиться к другой версии событий.'), opt('As proof that Silas is the killer.', 'Как к доказательству, что Сайлас — убийца.'), opt('As useless, because witnesses are always wrong.', 'Как к бесполезному: свидетели всегда ошибаются.')],
      vocab: ['describe — описывать', 'scar — шрам', 'seem — казаться'] },
    { seg: 1, loc: 'File room · 06:50', title: 'The Report He Never Wrote', titleRu: 'Отчёт, которого он не писал', doc: 1,
      body: 'Silas says he wrote a full report on his old case. The Archive has the file: every page is signed by him, but every page is blank.',
      bodyRu: 'Сайлас говорит, что написал полный отчёт по своему старому делу. В Архиве есть эта папка: каждая страница подписана им, но все страницы пустые.',
      task: 'What is the most reasonable explanation?', taskRu: 'Какое объяснение самое разумное?', correct: 0,
      opts: [opt('The text was erased, but his signatures were left.', 'Текст стёрли, а подписи оставили.'), opt('Silas never wrote anything.', 'Сайлас ничего не писал.'), opt('The paper is simply very old.', 'Бумага просто очень старая.')],
      vocab: ['sign — подписывать', 'blank — пустой', 'reasonable — разумный'] },
    { seg: 1, loc: 'File room · 07:15', title: 'Two Versions of Silas', titleRu: 'Две версии Сайласа', doc: 1,
      body: 'An Archive clerk remembers Silas as “a kind old man who fed the pigeons.” A Ministry file calls him “dangerous, unstable, dismissed.” Both documents are official.',
      bodyRu: 'Служащий Архива помнит Сайласа как «доброго старика, который кормил голубей». Папка Министерства называет его «опасным, нестабильным, уволенным». Оба документа официальные.',
      task: 'What question should you keep open?', taskRu: 'Какой вопрос стоит оставить открытым?', correct: 0,
      opts: [opt('Which version of Silas is real—or were both edited?', 'Какая версия Сайласа настоящая — или обе отредактированы?'), opt('Why does Silas like pigeons?', 'Почему Сайлас любит голубей?'), opt('Which document has nicer handwriting?', 'В каком документе почерк красивее?')],
      vocab: ['dismissed — уволенный', 'unstable — нестабильный', 'edit — редактировать'] },
    // III · The Queen
    { seg: 2, loc: 'Public hall · 08:00', title: 'The Ministry’s Answer', titleRu: 'Ответ Министерства', doc: 1,
      body: 'A Ministry leaflet on the Archive wall says: “There was never a Queen in Evervale. Stories about her are a symptom of memory illness. Report them.”',
      bodyRu: 'Листовка Министерства на стене Архива: «В Эвервейле никогда не было Королевы. Рассказы о ней — симптом болезни памяти. Сообщайте о них».',
      task: 'What does the leaflet tell you about the Ministry?', taskRu: 'Что листовка говорит о Министерстве?', correct: 0,
      opts: [opt('It treats memories of the Queen as something dangerous.', 'Оно считает воспоминания о Королеве опасными.'), opt('It proves the Queen never existed.', 'Это доказывает, что Королевы не было.'), opt('It is an invitation to a festival.', 'Это приглашение на праздник.')],
      vocab: ['leaflet — листовка', 'symptom — симптом', 'report — сообщать'] },
    { seg: 2, loc: 'Reading room · 08:25', title: 'Silas’s Answer', titleRu: 'Ответ Сайласа', witness: 1,
      body: 'Silas says: “She was the last Queen of Evervale. The Ministry took her crown, then her name, then her face.”',
      bodyRu: 'Сайлас говорит: «Она была последней королевой Эвервейла. Министерство забрало у неё корону, потом имя, потом лицо».',
      task: 'Is his story proven?', taskRu: 'Доказана ли его история?', correct: 0,
      opts: [opt('No. It is a strong claim without evidence yet.', 'Нет. Это сильное утверждение, но пока без доказательств.'), opt('Yes. Silas is always right.', 'Да. Сайлас всегда прав.'), opt('Yes, because he said it with emotion.', 'Да, потому что он говорил с чувством.')],
      vocab: ['crown — корона', 'claim — утверждение', 'evidence — доказательства'] },
    { seg: 2, loc: 'Card index · 08:50', title: 'The Archive’s Answer', titleRu: 'Ответ Архива', doc: 1,
      body: 'An old index card reads: “THE QUEEN — possibly not a person. See also: city, memory, foundations.”',
      bodyRu: 'Старая карточка каталога: «КОРОЛЕВА — возможно, не человек. См. также: город, память, основание».',
      task: 'What does “possibly not a person” suggest?', taskRu: 'На что намекает «возможно, не человек»?', correct: 0,
      opts: [opt('“The Queen” may be a title, a place or an idea—not one woman.', '«Королева» может быть титулом, местом или идеей, а не одной женщиной.'), opt('The Queen was an animal.', 'Королева была животным.'), opt('The card is a joke.', 'Карточка — это шутка.')],
      vocab: ['possibly — возможно', 'see also — см. также', 'foundations — основание'] },
    { seg: 2, loc: 'Oren’s clinic · 09:30', title: 'A Face Nobody Can Describe', titleRu: 'Лицо, которое никто не может описать', fact: 1,
      body: 'Oren Thale has studied the oldest memories of hundreds of citizens. In every one there is a woman whose face they cannot describe. “Not forgotten,” Oren says. “Removed—very carefully.”',
      bodyRu: 'Орен Тейл изучил самые ранние воспоминания сотен горожан. В каждом есть женщина, чьё лицо они не могут описать. «Не забыто, — говорит Орен. — Удалено. Очень аккуратно».',
      task: 'What connection now looks possible?', taskRu: 'Какая связь теперь кажется возможной?', correct: 0,
      opts: [opt('The faceless woman from Apartment 17 may be linked to the Queen.', 'Женщина без лица из квартиры №17 может быть связана с Королевой.'), opt('All citizens have bad eyesight.', 'У всех горожан плохое зрение.'), opt('Oren invented these memories.', 'Орен придумал эти воспоминания.')],
      vocab: ['describe — описать', 'remove — удалить', 'carefully — аккуратно'] },
    // IV · Your file
    { seg: 3, loc: 'Registration archive · 10:15', title: 'A File With Your Face', titleRu: 'Дело с вашим лицом', doc: 1,
      body: 'The photograph in the file is yours. The name is not: “Quinn Ashdown”. The date of birth is eleven years before your official birthday.',
      bodyRu: 'Фотография в деле — ваша. Имя — нет: «Квинн Эшдаун». Дата рождения на одиннадцать лет раньше вашего официального дня рождения.',
      task: 'What does the file show, carefully?', taskRu: 'Что осторожно можно сказать о деле?', correct: 0,
      opts: [opt('You may have had a different identity before this one.', 'Возможно, до нынешней личности у вас была другая.'), opt('The Archive simply mixed up two files.', 'Архив просто перепутал две папки.'), opt('Your photograph was stolen by a stranger.', 'Вашу фотографию украл незнакомец.')],
      vocab: ['identity — личность', 'date of birth — дата рождения', 'official — официальный'] },
    { seg: 3, loc: 'Registration archive · 10:40', title: 'Identity Reassignment Complete', titleRu: 'Переназначение личности завершено', doc: 1,
      body: 'At the bottom of the file there is a red stamp: IDENTITY REASSIGNMENT COMPLETE. Below it: Original identity: SEALED.',
      bodyRu: 'Внизу дела — красный штамп: IDENTITY REASSIGNMENT COMPLETE. Ниже: Original identity: SEALED.',
      task: 'What does “reassignment” mean here?', taskRu: 'Что здесь значит «reassignment»?', correct: 0,
      opts: [opt('Your identity was officially replaced with a new one.', 'Вашу личность официально заменили новой.'), opt('You were moved to a new job.', 'Вас перевели на новую работу.'), opt('You moved to a new apartment.', 'Вы переехали в новую квартиру.')],
      vocab: ['reassign — переназначить', 'complete — завершённый', 'sealed — запечатанный'] },
    { seg: 3, loc: 'Registration archive · 11:05', title: 'The Signature', titleRu: 'Подпись', doc: 1, ireneDoubt: true,
      body: 'The procedure was authorised by one person. The signature is elegant and very familiar: Irene Vale, Language Curator.',
      bodyRu: 'Процедуру разрешил один человек. Подпись изящная и очень знакомая: Ирен Вейл, куратор языка.',
      task: 'How should you treat Irene now?', taskRu: 'Как теперь относиться к Ирен?', correct: 0,
      opts: [opt('As someone who may protect me—or control me. I need more evidence.', 'Как к человеку, который, возможно, меня защищает — или контролирует. Нужны ещё доказательства.'), opt('As an enemy who must be arrested now.', 'Как к врагу, которого нужно немедленно арестовать.'), opt('As completely trustworthy; nothing has changed.', 'Как к полностью надёжному человеку: ничего не изменилось.')],
      vocab: ['authorise — разрешить', 'signature — подпись', 'familiar — знакомый'] },
    { seg: 3, loc: 'Registration archive · 11:30', title: 'The Subject Remembers', titleRu: 'Субъект помнит', fact: 1,
      ireneSays: 'Испытуемый помнит королеву.',
      body: 'A small note is clipped to your file: “The subject remembers the Queen.” As always, Irene’s translation appears next to it.',
      bodyRu: 'К вашему делу приколота записка: «The subject remembers the Queen». Как всегда, рядом появляется перевод Ирен.',
      task: 'Read the note again. Which word might Irene have translated too simply?', taskRu: 'Перечитайте записку. Какое слово Ирен могла перевести слишком просто?', correct: 0,
      opts: [opt('“subject”', '«subject»'), opt('“remembers”', '«remembers»'), opt('“note”', '«note»')],
      vocab: ['subject — (здесь) субъект, объект процедуры', 'clip — прикрепить', 'as always — как всегда'] },
    // V · Oren's lab
    { seg: 4, loc: 'Oren’s lab · 12:20', title: 'The Ministry Glossary', titleRu: 'Словарь Министерства', doc: 1,
      body: 'In Oren’s lab there is an old Ministry glossary. SUBJECT: a person whose identity has been rewritten. Not a patient. Not a volunteer.',
      bodyRu: 'В лаборатории Орена лежит старый словарь Министерства. SUBJECT: человек, чья личность была переписана. Не пациент. Не доброволец.',
      task: 'So what did the note on your file really say?', taskRu: 'Так что на самом деле говорила записка?', correct: 0,
      opts: [opt('A person with a rewritten identity—you—still remembers the Queen.', 'Человек с переписанной личностью — вы — всё ещё помнит Королеву.'), opt('A test volunteer remembers a queen from a book.', 'Доброволец помнит королеву из книги.'), opt('Nothing important; it was a medical note.', 'Ничего важного, это медицинская пометка.')],
      vocab: ['glossary — словарь терминов', 'rewrite — переписать', 'volunteer — доброволец'] },
    { seg: 4, loc: 'Oren’s lab · 12:45', title: 'No Signs of a Struggle', titleRu: 'Никаких следов борьбы', fact: 1,
      body: 'Oren examines the body again. No wounds, no poison, no struggle. The procedure chair in Apartment 17 has no straps.',
      bodyRu: 'Орен снова осматривает тело. Ни ран, ни яда, ни следов борьбы. У кресла для процедур в квартире №17 нет ремней.',
      task: 'What does “no straps” suggest?', taskRu: 'На что указывает «нет ремней»?', correct: 0,
      opts: [opt('Nobody held her down; she may have chosen the procedure.', 'Её никто не удерживал; возможно, она сама выбрала процедуру.'), opt('Someone stole the straps later.', 'Ремни кто-то позже украл.'), opt('The chair was only decoration.', 'Кресло было просто украшением.')],
      vocab: ['struggle — борьба', 'strap — ремень', 'hold down — удерживать'] },
    { seg: 4, loc: 'Oren’s lab · 13:10', title: 'A Complete Erasure', titleRu: 'Полное стирание', fact: 1,
      body: 'Oren’s tests show a full identity removal—not a correction, not a partial wipe. “People do not survive this as themselves,” he says. “Unless they send themselves somewhere first.”',
      bodyRu: 'Анализы Орена показывают полное удаление личности — не правку и не частичное стирание. «Так не выживают собой, — говорит он. — Если только сначала не отправить себя куда-то ещё».',
      task: 'What might “send themselves somewhere” mean?', taskRu: 'Что может значить «отправить себя куда-то»?', correct: 0,
      opts: [opt('Her memories could have been moved into another person first.', 'Её воспоминания могли сначала перенести в другого человека.'), opt('She went on a journey.', 'Она уехала путешествовать.'), opt('She posted a letter.', 'Она отправила письмо.')],
      vocab: ['removal — удаление', 'partial — частичный', 'unless — если только не'] },
    { seg: 4, loc: 'Oren’s lab · 13:35', title: 'A Drop of Your Blood', titleRu: 'Капля вашей крови', fact: 1,
      body: 'Oren asks for a drop of your blood. The woman’s memory residue reacts at once—bright and certain, like a lock that recognises its key.',
      bodyRu: 'Орен просит каплю вашей крови. Остаток памяти женщины реагирует мгновенно — ярко и уверенно, как замок, узнавший свой ключ.',
      task: 'What does the reaction suggest?', taskRu: 'На что указывает реакция?', correct: 0,
      opts: [opt('Something from the victim is connected to your own mind.', 'Что-то от погибшей связано с вашим собственным сознанием.'), opt('You are allergic to the residue.', 'У вас аллергия на этот остаток.'), opt('The test is broken.', 'Тест сломан.')],
      vocab: ['residue — остаток', 'react — реагировать', 'recognise — узнавать'] },
    // VI · The false answer
    { seg: 5, loc: 'Archive gate · 14:30', title: 'The Easy Theory', titleRu: 'Простая версия', witness: 1,
      body: 'Silas is sure: “She was the Queen. That’s why they erased her.” Morwen’s office sends you one line: “Stop inventing queens.”',
      bodyRu: 'Сайлас уверен: «Она была Королевой. Поэтому её и стёрли». Из канцелярии Морвен приходит одна строка: «Прекратите выдумывать королев».',
      task: 'Why should you be careful with the Queen theory?', taskRu: 'Почему с версией о Королеве нужно быть осторожнее?', correct: 0,
      opts: [opt('It explains a lot, but nothing proves it directly yet.', 'Она многое объясняет, но пока ничто её прямо не доказывает.'), opt('Because Morwen said so.', 'Потому что так сказала Морвен.'), opt('Because queens cannot exist in any city.', 'Потому что королев не бывает ни в одном городе.')],
      vocab: ['theory — версия', 'invent — выдумывать', 'directly — прямо'] },
    { seg: 5, loc: 'Oren’s lab · 15:10', title: 'Two Faces That Don’t Match', titleRu: 'Два лица, которые не совпадают', fact: 1,
      body: 'Oren compares the woman’s residue with the faceless woman in the citizens’ memories. The patterns are close—but not the same. The victim knew the Queen. She was not the Queen.',
      bodyRu: 'Орен сравнивает остаток памяти погибшей с женщиной без лица из воспоминаний горожан. Узоры похожи, но не одинаковы. Погибшая знала Королеву. Она не была Королевой.',
      task: 'What is the correct new conclusion?', taskRu: 'Какой новый вывод верен?', correct: 0,
      opts: [opt('The victim was connected to the Queen, but was not the Queen.', 'Погибшая была связана с Королевой, но не была ею.'), opt('The victim was definitely the Queen.', 'Погибшая точно была Королевой.'), opt('The Queen and the victim never met.', 'Королева и погибшая никогда не встречались.')],
      vocab: ['compare — сравнивать', 'pattern — узор', 'match — совпадать'] },
    { seg: 5, loc: 'Apartment 17 · 16:00', title: 'The Chair Faces the Mirror', titleRu: 'Кресло повёрнуто к зеркалу', fact: 1,
      body: 'Back in Apartment 17, you notice that the chair faces the mirror. In the mirror you can see the photograph on the wall: the woman, and the person who looks like you.',
      bodyRu: 'Вернувшись в квартиру №17, вы замечаете, что кресло повёрнуто к зеркалу. В зеркале видна фотография на стене: женщина и человек, похожий на вас.',
      task: 'What was the last thing she chose to look at?', taskRu: 'На что она решила смотреть в последний момент?', correct: 0,
      opts: [opt('The photograph of herself with you.', 'На фотографию, где она вместе с вами.'), opt('The window and the city.', 'На окно и город.'), opt('The door, waiting for a killer.', 'На дверь, в ожидании убийцы.')],
      vocab: ['face (v.) — быть повёрнутым к', 'notice — заметить', 'choose — выбирать'] },
    { seg: 5, loc: 'Archive · 16:40', title: 'Why She Called You', titleRu: 'Почему она позвала вас', doc: 1,
      body: 'The anonymous message that started the case was prepared in Apartment 17 days before. It asked for one investigator by name—yours. It was set to send itself after the procedure.',
      bodyRu: 'Анонимное сообщение, с которого началось дело, подготовили в квартире №17 за несколько дней. Оно просило одного следователя по имени — вас. И было настроено отправиться само после процедуры.',
      task: 'What does this change?', taskRu: 'Что это меняет?', correct: 0,
      opts: [opt('She wanted you to find her—not the Ministry.', 'Она хотела, чтобы её нашли вы, а не Министерство.'), opt('It was a random message.', 'Это было случайное сообщение.'), opt('The Ministry wrote it to trap her.', 'Министерство написало его, чтобы поймать её.')],
      vocab: ['prepare — подготовить', 'by name — по имени', 'set to — настроено на'] }
  ]);
  // Before and during the investigation: Silas and Oren step in at their chapters.
  const beats = [
    { step: 4, key: 'silas_archive', flag: 'silasArchiveSeen' },
    { step: 11, key: 'oren', flag: 'orenLabSeen' }
  ];
  wrapAfter('renderLongCase', () => {
    const node = longCaseNodes[state.longCaseStep];
    setText('longCaseEstimate', EN() || A2() ? 'Case 001 · about one hour' : 'Дело 001 · около часа');
    const seg = node && longCaseSegments[node.seg];
    if (seg && A2()) {
      setText('longCaseKicker', seg.k); setText('longCaseHeading', seg.title);
      setText('longCaseChapter', seg.title); setText('longCaseChapterDesc', seg.desc);
    }
    if (node && node.ireneSays) {
      const body = document.getElementById('longCaseBody');
      const box = document.createElement('div');
      box.className = 'ev-irene-says';
      box.innerHTML = '<small>' + (EN() || A2() ? 'Irene’s translation' : 'Перевод Ирен') + '</small>';
      box.append('«' + node.ireneSays + '»');
      document.querySelector('.ev-irene-says')?.remove();
      body?.after(box);
    } else document.querySelector('.ev-irene-says')?.remove();
    const beat = beats.find(b => b.step === state.longCaseStep && !state[b.flag]);
    if (beat) { state[beat.flag] = true; save(); setTimeout(() => showAppearance(beat.key, 'longcase'), 400); }
  });
  wrapAfter('answerLongCase', () => {
    const prev = longCaseNodes[state.longCaseStep - 1];
    if (prev && prev.ireneDoubt && !state.ireneDoubt) { state.ireneDoubt = true; save(); }
  });
  // After Irene's signature, her help is no longer automatic: translation becomes a request.
  const relabel = () => {
    if (!state.ireneDoubt) return;
    document.querySelectorAll('.tool-btn, #appearanceTranslateBtn, #memoryHintBtn').forEach(b => {
      if (/^(Show translation|Показать перевод)$/i.test(b.textContent.trim())) b.textContent = EN() || A2() ? 'Ask Irene for translation' : 'Попросить Ирен перевести';
    });
  };
  new MutationObserver(relabel).observe(document.documentElement, { childList: true, subtree: true });

  /* ---------- Act III · Her memory ---------- */
  const SENTENCE = ['I', 'did', 'not', 'hide', 'the', 'truth', 'from', 'them', '—', 'I', 'hid', 'it', 'from', 'you'];
  window.CASE_SENTENCE = SENTENCE.join(' ');
  window.setupWords = function () {
    state.words = [];
    const bank = document.getElementById('wordbank'); bank.innerHTML = '';
    [...SENTENCE].sort(() => Math.random() - 0.5).forEach(w => {
      const b = document.createElement('button'); b.className = 'word'; b.textContent = w;
      b.onclick = () => chooseWord(w, b); bank.appendChild(b);
    });
    setText('sentence', t().sentence);
    const tr = document.getElementById('memoryTranslation');
    tr.textContent = EN() ? '' : beginner()
      ? 'Я не скрывала правду от них — я скрыла её от вас. Подсказка: did not + hide; hid — прошедшее время от hide.'
      : 'Translation: Я не скрывала правду от них — я скрыла её от вас.';
    tr.classList.toggle('hidden', !beginner());
  };
  window.chooseWord = function (w, el) {
    clickSfx(840, 0.02, 0.05);
    state.words.push(w); el.classList.add('used');
    const current = state.words.join(' ');
    setText('sentence', current);
    if (!window.CASE_SENTENCE.startsWith(current)) {
      state.stability = Math.max(55, state.stability - 5); updateUI();
      showIrene(ENA() ? 'Not quite. The first half is negative: I did not + verb. The second half uses the past form of “hide”: hid.'
                     : 'Почти. Первая половина — отрицание: I did not + глагол. Во второй — прошедшее время от «hide»: hid.');
      setTimeout(setupWords, 900);
    } else if (current === window.CASE_SENTENCE) {
      showIrene(ENA() ? 'The sentence is complete. She did not hide the truth from the Ministry. She hid it from you.'
                     : 'Фраза восстановлена. Она скрыла правду не от Министерства. Она скрыла её от вас.');
      state.memoryStage = 1; save();
      setTimeout(() => go('memorytrace'), 1400);
    }
  };
  wrapAfter('renderMemoryTrace', () => {
    const q = memoryTraceQuestions[state.memoryTraceStep];
    if (q && A2()) { setText('memoryTraceTitle', q.title); setText('memoryTraceContext', q.context); }
  });
  replace(memoryTraceQuestions, [
    { title: 'Hidden From Whom?', titleRu: 'От кого скрыто?',
      context: 'Her voice is calm. Choose the meaning that matches the sentence exactly.',
      contextRu: 'Её голос спокоен. Выберите смысл, который точно совпадает с фразой.',
      fragment: 'I didn’t hide the truth from them. I hid it from you.', fragmentRu: 'Я не скрывала правду от них. Я скрыла её от вас.',
      options: [['She kept the truth away from you, not from the Ministry.', 'Она скрыла правду от вас, а не от Министерства.', true],
                ['She told you the truth and hid it from the Ministry.', 'Она рассказала правду вам и скрыла её от Министерства.', false],
                ['She hid herself from you and from them.', 'Она пряталась и от вас, и от них.', false]],
      feedback: '“Hide something from someone” = keep it away from that person. The truth was hidden from you—perhaps inside you.' },
    { title: 'The Moment You Remember', titleRu: 'В тот миг, когда вы вспомните',
      context: 'Here “the moment” works like a conjunction. Choose the equivalent meaning.',
      contextRu: 'Здесь «the moment» работает как союз. Выберите равнозначный смысл.',
      fragment: 'Because the moment you remember who you are, they will know where to find her.',
      fragmentRu: 'Потому что как только вы вспомните, кто вы, они узнают, где её найти.',
      options: [['As soon as you remember, they will be able to find her.', 'Как только вы вспомните, они смогут её найти.', true],
                ['While you are remembering, they will look for her.', 'Пока вы вспоминаете, они будут её искать.', false],
                ['If you forget, they will find her.', 'Если вы забудете, они её найдут.', false]],
      feedback: '“The moment (that)…” = “as soon as”. Your memory is a lock. Opening it opens it for everyone.' },
    { title: 'Who Is “Her”?', titleRu: 'Кто такая «она»?',
      context: 'The woman in Apartment 17 is already gone. Who can “her” refer to?',
      contextRu: 'Женщины из квартиры №17 уже нет. К кому может относиться «her»?',
      fragment: '…they will know where to find her.', fragmentRu: '…они узнают, где её найти.',
      options: [['Someone else—a woman who is still hidden.', 'К кому-то другому — к женщине, которая всё ещё скрыта.', true],
                ['The woman in Apartment 17 herself.', 'К самой женщине из квартиры №17.', false],
                ['Lady Morwen.', 'К леди Морвен.', false]],
      feedback: 'Nobody hides a memory to protect someone who is already gone. “Her” is someone else. The case does not say who.' }
  ]);

  /* ---------- Act III · Silas ---------- */
  const line = (tone, en, ru, trust, influence, fbEn, fbRu) => ({ tone, en, ru, trust, influence, fbEn, fbRu });
  replace(dialogue, [
    { speech: 'I told you her eyes were green. Your report says brown. I’m not lying. I just don’t know which of my memories are mine.',
      ru: 'Я сказал вам, что у неё зелёные глаза. В вашем отчёте — карие. Я не лгу. Я просто не знаю, какие из моих воспоминаний — мои.',
      context: 'Rain runs down the Archive windows. Silas keeps turning his old badge in his fingers.', contextRu: 'По окнам Архива течёт дождь. Сайлас вертит в пальцах свой старый жетон.',
      vocab: ['lie — лгать', 'report — отчёт', 'mine — мои'],
      choices: [
        line('Clarify', 'When did you first see her?', 'Когда вы впервые её увидели?', 1, 1, '“When did you first…” asks for a starting point—useful when memories disagree.', '«When did you first…» просит точку отсчёта — полезно, когда воспоминания расходятся.'),
        line('Pressure', 'Then why should I trust anything you say?', 'Тогда почему я должен верить хоть чему-то из ваших слов?', -1, 2, 'Direct doubt. It is honest—but it may close the door.', 'Прямое сомнение. Честно, но может закрыть разговор.'),
        line('Empathy', 'Maybe both memories are real. Maybe she changed.', 'Может, оба воспоминания настоящие. Может, она менялась.', 2, 0, '“Maybe” keeps two versions open at once. In Evervale, that is often the truth.', '«Maybe» оставляет открытыми обе версии. В Эвервейле это часто и есть правда.')] },
    { speech: 'I met her three nights ago. She knew my name, my old case—even my dog’s name. I never had a dog. Or I don’t remember one.',
      ru: 'Я встретил её три ночи назад. Она знала моё имя, моё старое дело — даже кличку моей собаки. У меня никогда не было собаки. Или я её не помню.',
      context: 'For a second Silas smiles, as if at a dog that is not there.', contextRu: 'На секунду Сайлас улыбается — будто собаке, которой здесь нет.',
      vocab: ['three nights ago — три ночи назад', 'even — даже', 'remember — помнить'],
      choices: [
        line('Inference', 'She knew a version of you that you don’t remember.', 'Она знала версию вас, которую вы не помните.', 2, 1, 'A careful inference: you connect his words to the Unwritten.', 'Осторожный вывод: вы связываете его слова с незаписанными.'),
        line('Procedure', 'Did anyone see you two together?', 'Кто-нибудь видел вас вместе?', 1, 1, 'A procedural question looks for an independent witness.', 'Процедурный вопрос ищет независимого свидетеля.'),
        line('Scepticism', 'Or you are making things up now.', 'Или вы сейчас просто выдумываете.', -1, 2, '“Make things up” = invent. Sharp, and not wrong to consider.', '«Make things up» — выдумывать. Резко, но не лишено смысла.')] },
    { speech: 'She asked me to tell you this if she was gone: “You were not chosen by the Archive. You were chosen by me.”',
      ru: 'Она попросила передать вам это, если её не станет: «Вас выбрал не Архив. Вас выбрала я».',
      context: 'The passive “were chosen” hides who chose. Her second sentence puts the agent back: “by me”.', contextRu: 'Пассив «were chosen» скрывает, кто выбрал. Вторая фраза возвращает исполнителя: «by me».',
      vocab: ['be chosen — быть выбранным', 'by me — мной', 'be gone — исчезнуть'],
      choices: [
        line('Clarify', 'Chosen for what?', 'Выбран для чего?', 1, 1, 'Short and precise. The key question.', 'Коротко и точно. Главный вопрос.'),
        line('Personal', 'Did she know me? Before all this?', 'Она знала меня? До всего этого?', 3, 0, 'A personal question. Silas’s answer is a long silence.', 'Личный вопрос. Ответ Сайласа — долгое молчание.'),
        line('Control', 'Her exact words, Silas. Nothing else.', 'Её точные слова, Сайлас. Ничего больше.', 0, 2, 'Control: you protect the wording from his interpretation.', 'Контроль: вы защищаете формулировку от его толкований.')] },
    { speech: 'You saw your file, didn’t you? Irene signed it. I know. I saw her signature on mine, too.',
      ru: 'Вы видели своё дело, да? Его подписала Ирен. Я знаю. Я видел её подпись и на своём.',
      context: 'A tag question: “You saw…, didn’t you?” He is not asking. He is checking how much you know.', contextRu: 'Разделительный вопрос «You saw…, didn’t you?». Он не спрашивает — он проверяет, сколько вы знаете.',
      vocab: ['file — дело', 'signature — подпись', 'too — тоже'],
      choices: [
        line('Confront', 'You knew, and you said nothing?', 'Вы знали и молчали?', 0, 2, 'Confrontation. Fair—but Silas has his own reasons for silence.', 'Прямое обвинение. Справедливо, но у Сайласа свои причины молчать.'),
        line('Inference', 'So you are a “subject” too.', 'Значит, вы тоже «subject».', 2, 1, 'You use the Ministry’s own word against it. Language as evidence.', 'Вы используете слово самого Министерства. Язык как улика.'),
        line('Caution', 'Irene is my mentor. I need more than a signature.', 'Ирен — моя наставница. Мне нужно больше, чем подпись.', 1, 1, 'Caution keeps the question open instead of choosing an enemy too early.', 'Осторожность оставляет вопрос открытым и не назначает врага раньше времени.')] },
    { speech: 'She didn’t die in a fight. She sat down in that chair herself. I think she wanted to disappear—completely.',
      ru: 'Она не погибла в драке. Она сама села в это кресло. Думаю, она хотела исчезнуть — полностью.',
      context: 'Oren’s tests said the same: no struggle, no straps.', contextRu: 'Анализы Орена говорили то же: ни борьбы, ни ремней.',
      vocab: ['fight — драка', 'herself — сама', 'disappear — исчезнуть'],
      choices: [
        line('Motive', 'Why would anyone choose to be erased?', 'Зачем кому-то выбирать стирание?', 1, 1, '“Would” asks about a hypothetical motive.', '«Would» спрашивает о предполагаемом мотиве.'),
        line('Authority', 'Who performed the procedure?', 'Кто провёл процедуру?', 0, 2, '“Perform a procedure” is formal medical language.', '«Perform a procedure» — формальный медицинский язык.'),
        line('Insight', 'She disappeared so that something else could survive.', 'Она исчезла, чтобы выжило что-то другое.', 2, 1, '“So that… could” expresses purpose. You are close.', '«So that… could» выражает цель. Вы близко.')] },
    { speech: 'Here is what I think: she hid a memory in someone else’s head. Somewhere the Ministry can’t search. Somewhere like… you.',
      ru: 'Вот что я думаю: она спрятала воспоминание в чужой голове. Там, где Министерство не может искать. Например… в вас.',
      context: 'Your blood test. The key. The photograph. The message sent to you by name.', contextRu: 'Анализ крови. Ключ. Фотография. Сообщение, адресованное вам по имени.',
      vocab: ['someone else’s — чужой', 'search — обыскивать', 'somewhere like — где-нибудь вроде'],
      choices: [
        line('Method', 'Then we check every memory against physical evidence.', 'Тогда мы проверяем каждое воспоминание по вещественным уликам.', 2, 1, 'A disciplined answer protects the case from manufactured memories.', 'Дисциплинированный ответ защищает дело от поддельных воспоминаний.'),
        line('Denial', 'That’s impossible. I would know.', 'Это невозможно. Я бы знал{а|}.', 0, 1, '“I would know” is a conditional of certainty—exactly what she expected you to say.', '«I would know» — условие уверенности. Именно этого она от вас и ждала.'),
        line('Direct', 'What memory? What did she hide?', 'Какое воспоминание? Что она спрятала?', 1, 2, 'Direct questions. Silas has no answer.', 'Прямые вопросы. У Сайласа нет ответа.')] },
    { speech: 'I don’t know what she hid. But if you start to remember, don’t tell anyone. Not Morwen. Not me. Not Irene.',
      ru: 'Я не знаю, что она спрятала. Но если вы начнёте вспоминать, никому не говорите. Ни Морвен. Ни мне. Ни Ирен.',
      context: 'He says “not me” quietly, as if he does not trust his own memory either.', contextRu: '«Ни мне» он говорит тихо — будто не доверяет и собственной памяти.',
      vocab: ['start to — начать', 'anyone — никому', 'either — тоже (не)'],
      choices: [
        line('Alliance', 'Then we find out together—carefully.', 'Тогда выясним вместе — осторожно.', 3, 0, '“Find out” = discover. An alliance with conditions.', '«Find out» — выяснить. Союз, но с условиями.'),
        line('Distance', 'Then I work alone from now on.', 'Тогда с этого момента я работаю один{а|}.', 0, 2, 'Distance protects you—and isolates you.', 'Дистанция защищает — и изолирует.'),
        line('Question', 'And what if I already remember something?', 'А если я уже что-то помню?', 2, 1, '“What if…?” opens a possibility without admitting it.', '«What if…?» открывает возможность, ничего не признавая.')] }
  ]);

  /* ---------- Appearances ---------- */
  Object.assign(appearanceData.irene, {
    context: 'Irene opens the file and marks three words in violet ink: empty, again, erased. “In this case,” she says, “every word can be evidence.”',
    ru: '«Прежде чем задавать вопросы мёртвым, научитесь сомневаться в словах, которые они оставили». Ирен открывает дело и отмечает фиолетовыми чернилами три слова: empty, again, erased. «В этом деле, — говорит она, — любое слово может оказаться уликой».',
    vocab: ['evidence — улика', 'erase — стирать', 'leave behind — оставлять после себя'],
    button: { A1: 'Войти в квартиру', A2: 'Enter the apartment', B1: 'Enter the apartment' }
  });
  Object.assign(appearanceData.morwen, {
    badge: 'Ministry transmission',
    quote: '“There is no Apartment 17 in our records. There is no woman. Close the file before morning.”',
    context: 'A violet Ministry seal lights up above the mirror. Lady Morwen speaks through the projection. She does not ask what you have found. She already knows.',
    ru: '«В наших записях нет квартиры №17. Нет и женщины. Закройте дело до утра». Над зеркалом загорается фиолетовая печать Министерства. Леди Морвен не спрашивает, что вы нашли. Она уже знает.',
    vocab: ['record — запись', 'close the file — закрыть дело', 'before morning — до утра']
  });
  appearanceData.irene_key = {
    name: 'Irene Vale', role: 'Language Curator', badge: 'A strange reaction', cls: 'irene-scene', img: 'irene',
    quote: '“Your hands are shaking. It is a normal stress reaction. Put the key down.”',
    context: 'You said nothing about your hands. You said nothing about the key.',
    ru: '«У вас дрожат руки. Это обычная реакция на стресс. Положите ключ». Вы ничего не говорили ни о руках, ни о ключе.',
    vocab: ['shake — дрожать', 'stress reaction — реакция на стресс', 'put down — положить'],
    button: { A1: '“How do you know what I’m feeling?” · Откуда вы знаете, что я чувствую?', A2: '“How do you know what I’m feeling?”', B1: '“How do you know what I’m feeling?”' }
  };
  appearanceData.silas_archive = {
    name: 'Silas Vane', role: 'Former Royal Investigator', badge: 'The reading room', cls: 'silas-scene', img: 'silas',
    quote: '“You found the Unwritten. Then you found my old case, too. Sit down.”',
    context: 'An old man in a rain-soaked coat is waiting among the shelves. He looks at you as if he is trying to remember your face—and failing.',
    ru: '«Вы нашли незаписанных. Значит, нашли и моё старое дело. Садитесь». Среди полок ждёт старик в промокшем пальто. Он смотрит на вас так, будто пытается вспомнить ваше лицо — и не может.',
    vocab: ['reading room — читальный зал', 'rain-soaked — промокший', 'fail — не суметь'],
    button: { A1: 'Выслушать Сайласа', A2: 'Listen to Silas', B1: 'Listen to Silas' }
  };
  Object.assign(appearanceData.oren, {
    badge: 'The memory physician',
    quote: '“Everybody forgets. But nobody forgets the same face in the same way. That is not forgetting. That is surgery.”',
    context: 'Oren Thale receives you among glass shelves of bottled memories. He is interested in your case—a little too interested.',
    ru: '«Забывают все. Но никто не забывает одно и то же лицо одинаково. Это не забвение. Это хирургия». Орен Тейл принимает вас среди стеклянных полок с воспоминаниями в бутылках. Ваше дело его интересует — даже слишком.',
    vocab: ['surgery — хирургия', 'the same way — одинаково', 'bottled — в бутылках'],
    button: { A1: 'Продолжить расследование', A2: 'Continue the investigation', B1: 'Continue the investigation' }
  });
  Object.assign(appearanceData.silas, {
    badge: 'At the Archive gate',
    quote: '“If she hid something inside you, don’t open it here. The walls in this city have ears.”',
    context: 'Silas is waiting in the rain outside the Archive. Now you know what she did. He wants to know what you will do.',
    ru: '«Если она что-то спрятала в вас, не открывайте это здесь. У стен в этом городе есть уши». Сайлас ждёт под дождём у ворот Архива. Теперь вы знаете, что она сделала. Он хочет знать, что сделаете вы.',
    vocab: ['inside — внутри', 'the walls have ears — у стен есть уши', 'gate — ворота'],
    button: { A1: 'Поговорить с Сайласом', A2: 'Talk to Silas', B1: 'Talk to Silas' }
  });
  Object.assign(appearanceData.queen, {
    badge: 'A reflection',
    quote: '“You are looking for a dead woman. I am looking for the one who will remember me.”',
    context: 'For one second the Archive mirror shows a crowned figure without a face. Then it shows only you.',
    ru: '«Вы ищете мёртвую женщину. А я ищу ту, кто меня вспомнит». На одну секунду зеркало Архива показывает коронованную фигуру без лица. Потом — только вас.',
    vocab: ['crowned — коронованный', 'reflection — отражение', 'remember — вспомнить'],
    button: { A1: 'Написать отчёт', A2: 'Write the report', B1: 'Write the report' }
  });
  wrapAfter('continueAppearance', () => {
    if (appearanceKey !== 'irene_key') return;
    setTimeout(() => showIrene(ENA()
      ? '… Irene is silent for one second too long. “I read your file,” she says. “That is all.”'
      : '… Ирен молчит на секунду дольше, чем нужно. «Я читала ваше дело, — говорит она. — Вот и всё».'), 500);
  });

  /* ---------- The report and the ending ---------- */
  verdicts.A1 = [
    ['Порядок', 'Закрыть дело, как хочет Министерство', 'Unknown woman, natural causes. Неизвестная женщина, естественная смерть, никакой квартиры №17.', 'order'],
    ['Правда', 'Написать полный отчёт', 'Report the Unwritten. Рассказать о незаписанных, пустых фотографиях и переписанных делах.', 'truth'],
    ['Личное', 'Оставить себе ключ и дело', 'Ничего не писать официально и тайно расследовать собственное прошлое.', 'personal']];
  verdicts.A2 = [
    ['Order', 'Close the file as the Ministry wants', 'An unknown woman, natural causes, no Apartment 17.', 'order'],
    ['Truth', 'Write the full report', 'Report the Unwritten, the empty photographs and the rewritten files.', 'truth'],
    ['Personal', 'Keep the key and the file', 'Write nothing official and investigate your own past in secret.', 'personal']];
  verdicts.B1 = [
    ['Order', 'Close the file as the Ministry demands', 'Record an unidentified woman, natural causes, and no such place as Apartment 17.', 'order'],
    ['Truth', 'File the full report', 'Document the Unwritten, the empty photographs and the reassigned identities—and let the Archive decide.', 'truth'],
    ['Personal', 'Keep the key and your file', 'Submit nothing, and investigate your own sealed identity in secret.', 'personal']];
  wrapAfter('renderVerdict', () => setText('evidenceFinal', EN() || A2() ? 'Case 001' : 'Дело 001'));

  const endings = {
    en: {
      order: 'You close the file as ordered. Morwen’s office thanks you in one short line.',
      truth: 'You send the full report to the Archive. Nobody answers.',
      personal: 'You put the file in your coat, next to the silver key.',
      common: 'The next morning you return to the building. Between rooms 16 and 18 there is only a wall—not a sealed door, but a wall that has always been there. Mara does not remember you. The police do not remember a body. Case 001 is not in the system. Only one thing is left: the silver key in your pocket.',
      folder: 'Back at the Archive, a new folder is waiting on your desk.',
      note: 'Someone has written on it by hand:'
    },
    ru: {
      order: 'Вы закрываете дело, как приказано. Канцелярия Морвен благодарит вас одной короткой строкой.',
      truth: 'Вы отправляете в Архив полный отчёт. Никто не отвечает.',
      personal: 'Вы убираете дело во внутренний карман пальто — рядом с серебряным ключом.',
      common: 'Наутро вы возвращаетесь в дом. Между комнатами 16 и 18 — только стена. Не опечатанная дверь, а стена, которая всегда здесь была. Мара вас не помнит. Полиция не помнит тела. Дела 001 нет в системе. Осталось только одно — серебряный ключ в вашем кармане.',
      folder: 'В Архиве на вашем столе ждёт новая папка.',
      note: 'На ней кто-то написал от руки:'
    }
  };
  window.finish = function (type) {
    clickSfx();
    state.route = type; state.caseClosed = true; state.campaignNode = null; save();
    const en = EN() || A2(), e = en ? endings.en : endings.ru;
    setText('endingKicker', t().endK);
    setText('endingTitle', en ? 'The Apartment That Was Never There' : 'Квартира, которой никогда не было');
    setText('endingText', e[type] + ' ' + e.common);
    const names = en ? { order: 'Order', truth: 'Truth', personal: 'Personal' } : { order: 'Порядок', truth: 'Правда', personal: 'Личное' };
    setText('endingResult', (en ? 'Your report: ' : 'Ваш отчёт: ') + names[type] + ' · ' + (en ? 'Silas’s trust: ' : 'Доверие Сайласа: ') + state.trust + ' · ' + (en ? 'Mara’s trust: ' : 'Доверие Мары: ') + state.caretakerTrust);
    let next = document.getElementById('nextCase');
    if (!next) {
      next = document.createElement('div'); next.id = 'nextCase'; next.className = 'ev-next-case';
      document.getElementById('endingText').after(next);
    }
    next.innerHTML = '<p class="ev-next-lead"></p><div class="ev-folder"><small>CASE 002</small><b>The Man Who Remembered Tomorrow</b></div><p class="ev-next-lead"></p><p class="ev-handwriting">Don’t trust your memories.<br>Especially the ones that feel like yours.</p>';
    const leads = next.querySelectorAll('.ev-next-lead');
    leads[0].textContent = e.folder; leads[1].textContent = e.note;
    if (!en) next.insertAdjacentHTML('beforeend', '<p class="ev-next-ru">«Не доверяйте своим воспоминаниям. Особенно тем, что кажутся вашими».</p>');
    const pc = document.getElementById('postCreditsBtn'); if (pc) pc.hidden = true;
    go('ending');
  };

  /* ---------- Saves from the earlier version of the case ---------- */
  const engineContinue = window.continueGame;
  window.continueGame = function () {
    try {
      const raw = localStorage.getItem('evervale-v11');
      const s = raw && JSON.parse(raw);
      if (s && s.campaignNode) { s.campaignNode = null; localStorage.setItem('evervale-v11', JSON.stringify(s)); }
    } catch (e) {}
    return engineContinue.apply(this, arguments);
  };

  /* ---------- Text that follows the hero: {female|male} ---------- */
  const templates = [];
  (function collect(obj, seen) {
    if (!obj || typeof obj !== 'object' || seen.has(obj)) return; seen.add(obj);
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      if (typeof v === 'string' && /\{[^{}|]*\|[^{}]*\}/.test(v)) templates.push([obj, k, v]);
      else if (v && typeof v === 'object') collect(v, seen);
    });
  })([clues, analysisQuestions, hiddenClues, caretakerDialogue, longCaseNodes, memoryTraceQuestions, dialogue, appearanceData], new Set());
  window.resolveHeroText = function () {
    const male = state.protagonist === 'male';
    templates.forEach(([obj, k, tpl]) => { obj[k] = tpl.replace(/\{([^{}|]*)\|([^{}]*)\}/g, (_, f, m) => male ? m : f); });
  };
  window.resolveHeroText();
  ['renderEvidence', 'renderCaretaker', 'renderQuestion', 'renderLongCase', 'renderMemoryTrace', 'showAppearance'].forEach(name => {
    const engine = window[name];
    window[name] = function (...args) { window.resolveHeroText(); return engine.apply(this, args); };
  });
})();
