/**
 * Evervale results → Google Sheet.
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Copy the web app URL into `sheet:` in analytics.js.
 */
const COLUMNS = [
  'time', 'player', 'event', 'level', 'hero', 'chapter', 'score', 'max', 'accuracy',
  'minutes', 'totalMinutes', 'trust', 'influence', 'mistakes', 'route', 'ending',
  'englishAccuracy', 'englishScore', 'englishMax', 'scenes', 'secrets', 'screen',
  'device', 'language', 'referrer', 'session', 'runId'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = eventsSheet_();
    const row = COLUMNS.map(key => key === 'time' ? new Date() : (data[key] === undefined || data[key] === null ? '' : data[key]));
    sheet.appendRow(row);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

/** Opening the web app URL in a browser shows that it is working. */
function doGet() {
  return ContentService.createTextOutput('Evervale analytics is running.');
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
