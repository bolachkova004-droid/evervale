/**
 * Evervale results → Google Sheet.
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Copy the web app URL into `sheet:` in analytics.js.
 *
 * The web app URL is public (it sits in the game's code), so every request is
 * treated as untrusted: only known columns are kept, values are shortened,
 * text that Sheets would run as a formula is stored as plain text, and each
 * player code may add a limited number of rows per hour.
 */
const COLUMNS = [
  'time', 'player', 'event', 'level', 'hero', 'chapter', 'score', 'max', 'accuracy',
  'minutes', 'totalMinutes', 'trust', 'influence', 'mistakes', 'route', 'ending',
  'englishAccuracy', 'englishScore', 'englishMax', 'scenes', 'secrets', 'screen',
  'device', 'language', 'referrer', 'session', 'runId'
];
const NUMBERS = ['score', 'max', 'accuracy', 'minutes', 'totalMinutes', 'trust', 'influence', 'mistakes',
  'englishAccuracy', 'englishScore', 'englishMax', 'scenes', 'secrets'];
const EVENTS = /^(visit|case_started|hero_chosen|case_finished|left the game|chapter: [0-9a-zA-Z ]{1,40})$/;
const MAX_BODY = 4000;          // bytes per request
const MAX_ROWS_PER_HOUR = 120;  // per player code

function doPost(e) {
  const raw = e && e.postData && e.postData.contents || '';
  if (raw.length > MAX_BODY) return reply_('too large');
  let data;
  try { data = JSON.parse(raw); } catch (err) { return reply_('bad json'); }
  if (!data || typeof data !== 'object') return reply_('bad json');

  const player = String(data.player || '');
  if (!/^P-[A-Z0-9]{5}$/.test(player)) return reply_('bad player');
  if (!EVENTS.test(String(data.event || ''))) return reply_('bad event');
  if (!withinLimit_(player)) return reply_('slow down');

  const row = COLUMNS.map(key => {
    if (key === 'time') return new Date();
    const value = data[key];
    if (value === undefined || value === null || value === '') return '';
    if (NUMBERS.indexOf(key) >= 0) {
      const n = Number(value);
      return isFinite(n) ? Math.max(-100000, Math.min(100000, n)) : '';
    }
    return plainText_(value);
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    eventsSheet_().appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return reply_('ok');
}

/** Opening the web app URL in a browser shows that it is working. */
function doGet() {
  return reply_('Evervale analytics is running.');
}

/** Short text only, and never a formula: a leading = + - @ gets an apostrophe. */
function plainText_(value) {
  let text = String(value).replace(/[\u0000-\u001f]/g, ' ').slice(0, 120);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return text;
}

function withinLimit_(player) {
  const cache = CacheService.getScriptCache();
  const key = 'rate:' + player;
  const count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 3600);
  return count <= MAX_ROWS_PER_HOUR;
}

function reply_(text) {
  return ContentService.createTextOutput(text);
}

function eventsSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName('Events');
  if (!sheet) {
    sheet = book.insertSheet('Events');
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}
