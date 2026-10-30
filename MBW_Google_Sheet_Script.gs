// MBW Billing -> Google Sheet receiver
// Paste in Extensions > Apps Script of your Google Sheet, then Deploy > New deployment > Web app
// Execute as: Me | Who has access: Anyone

const BILL_HEAD = ['Invoice No','Date','Customer','Address','Vehicle No','Phone','Payment Mode','Total (Rs)','Advance (Rs)','Paid (Rs)','Balance (Rs)'];
const ITEM_HEAD = ['Invoice No','Date','Customer','Vehicle No','Phone','Sl.No','Item','Type','Volt / Capacity','Warranty','Serial No','Barcode','Qty','Rate (Rs)','Amount (Rs)'];

function sheet_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1,1,1,head.length).setFontWeight('bold'); }
  return sh;
}

function removeInvoice_(sh, inv) {
  const last = sh.getLastRow();
  if (last < 2) return;
  const vals = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) {
    if (String(vals[i][0]) === inv) sh.deleteRow(i + 2);
  }
}

function dmy_(s) { const p = (s || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : ''; }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const bills = data.bills || [];
    const sb = sheet_('Bills', BILL_HEAD), si = sheet_('Items', ITEM_HEAD);
    bills.forEach(b => {
      removeInvoice_(sb, b.n); removeInvoice_(si, b.n);
      const bal = Math.max(0, b.t - b.ad - b.pd);
      sb.appendRow([b.n, dmy_(b.d), b.c, b.a, b.v, b.p, b.pm, b.t, b.ad, b.pd, bal]);
      (b.it || []).forEach((i, k) => si.appendRow([b.n, dmy_(b.d), b.c, b.v, b.p, k + 1, i.x, i.ty, i.sp, i.w, i.sn, i.bc, i.q, i.r, i.m]));
    });
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}

function doGet() { return ContentService.createTextOutput('MBW sheet is ready'); }
