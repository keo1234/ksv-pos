/*************************************************************
 * KSV POS — Google Apps Script Backend (Code.gs)
 * ໃຊ້ Google Sheets ເປັນຖານຂໍ້ມູນ (database)
 *
 * ວິທີໃຊ້ (ສັ້ນໆ):
 *  1) ສ້າງ Google Sheet ໃໝ່ → ເມນູ Extensions → Apps Script
 *  2) ວາງໂຄ້ດນີ້ໃສ່ ແລ້ວ Save
 *  3) Deploy → New deployment → ປະເພດ "Web app"
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  4) ກັອບ URL (.../exec) ໄປໃສ່ໃນ index.html (CONFIG.APPS_SCRIPT_URL)
 *       ຫຼື ໃສ່ໃນໜ້າ "ຕັ້ງຄ່າລະບົບ" ຂອງແອັບ
 *  5) ໃຫ້ TOKEN ກົງກັນທັງສອງບ່ອນ
 *************************************************************/

var TOKEN = "ksv-71be638f-9a14cb-2026"; // ⚠ ໃຫ້ກົງກັບ CONFIG.TOKEN ໃນ index.html

// ບັນຊີຜູ້ໃຊ້ (ກວດ login ຝັ່ງ server — ລະຫັດບໍ່ຢູ່ໃນ client)
var USERS = [
  { username: "ksv", password: "k1987", name: "ksv", role: "Admin", perms: "all" }
];

// ໂຄງສ້າງຖັນ (headers) ຂອງແຕ່ລະຕາຕະລາງ
var SCHEMA = {
  products:  ["id","barcode","image","name","unit","unitBig","bigRatio","priceBig","costBig","description","category","vendor","cost","price","price2","price3","price4","price5","points","zone","trackstock","stock","lowstock","weight","vat","size","color","linkParent","linkRatio","linkType"],
  units:     ["id","name","note"],
  prodcats:  ["id","name","note"],
  sizes:     ["id","name","note"],
  colors:    ["id","name","note"],
  zones:     ["id","name","note"],
  stockmoves:["id","date","product","type","qty","balance","by","note"],
  returns:   ["id","runno","ref","date","cashier","customer","items","total","lines"],
  customers: ["id","code","name","group","phone","email","address","birthday"],
  cusgroups: ["id","name","discount","note"],
  cuslevels: ["id","name","min","note"],
  contacts:  ["id","date","customer","channel","reason","note","status"],
  sales:     ["id","runno","date","cashier","customer","items","subtotal","discount","total","paid","paytype","branch","note","lines","status"],
  users:     ["id","name","role","branch","username","password","perms"],
  employees: ["id","name","position","phone","salary"],
  purchase:  ["id","no","ref","vendor","items","total","tax","note","date","recorded","imported"],
  vendors:   ["id","name","phone","address","note"],
  repair:    ["id","runno","name","phone","address","product","brand","model","color","sn","condition","symptom","accessories","cost","duedate","status","recorded"],
  pawn:      ["id","no","date","customer","item","amount","interest","status"],
  produce:   ["id","date","product","qty","note"],
  printjob:  ["id","runno","name","phone","orderdate","pickupdate","content","bgcolor","textcolor","size","price","note","status","recorded"],
  settings:  ["id","storename","currency","phone","addr","acct","email","logo","qr","brand","bg"]
};

function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.payload) {
      body = JSON.parse(e.parameter.payload);
    }
    if (TOKEN && body.token !== TOKEN) return out({ error: "Unauthorized token" });

    if (body.action === "login") {
      var lu = String((body.data || {}).username || ""), lp = String((body.data || {}).password || "");
      var hit = null;
      // 1) ກວດຈາກຕາຕະລາງ users ໃນ Sheet (ຈັດການຜ່ານແອັບ — ຕັ້ງລະຫັດເອງໄດ້)
      try {
        var urows = listRows(getSheet("users"), "users");
        hit = urows.filter(function (x) { return String(x.username) === lu && String(x.password) === lp && lp !== ""; })[0];
      } catch (e) {}
      // 2) ສຳຮອງ: ບັນຊີ admin ໃນໂຄ້ດ (ເຂົ້າໄດ້ສະເໝີ)
      if (!hit) hit = USERS.filter(function (x) { return x.username === lu && x.password === lp; })[0];
      if (hit) {
        var prm = hit.perms;
        if (!prm && /Admin|ຜູ້ຈັດການ/.test(String(hit.role || ""))) prm = "all";
        return out({ data: { ok: true, name: hit.name, role: hit.role, perms: prm || "" } });
      }
      return out({ data: { ok: false } });
    }

    var table = body.table;
    if (!SCHEMA[table]) return out({ error: "Unknown table: " + table });
    var sheet = getSheet(table);

    switch (body.action) {
      case "list":   return out({ data: listRows(sheet, table) });
      case "create": return out({ data: createRow(sheet, table, body.data) });
      case "update": return out({ data: updateRow(sheet, table, body.data) });
      case "delete": return out({ data: deleteRow(sheet, body.data.id) });
      default:       return out({ error: "Unknown action: " + body.action });
    }
  } catch (err) {
    return out({ error: String(err) });
  }
}

function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(table) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(table);
  if (!sh) {
    sh = ss.insertSheet(table);
    sh.appendRow(SCHEMA[table]);
    sh.setFrozenRows(1);
  }
  // ຮັບປະກັນວ່າ header ມີ
  if (sh.getLastRow() === 0) sh.appendRow(SCHEMA[table]);
  ensureColumns(sh, table); // ເພີ່ມຖັນທີ່ຂາດອັດຕະໂນມັດ (ເຊັ່ນ image, linkParent...)
  return sh;
}

// ເພີ່ມຫົວຖັນທີ່ມີໃນ SCHEMA ແຕ່ຍັງບໍ່ມີໃນ Sheet (ສຳລັບ Sheet ເກົ່າ)
function ensureColumns(sh, table) {
  var schema = SCHEMA[table]; if (!schema) return;
  var lastCol = sh.getLastColumn();
  var headers = lastCol > 0 ? sh.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var missing = [];
  for (var i = 0; i < schema.length; i++) {
    if (headers.indexOf(schema[i]) === -1) missing.push(schema[i]);
  }
  if (missing.length) {
    sh.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
  }
}

function listRows(sheet, table) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) obj[headers[j]] = values[i][j];
    rows.push(obj);
  }
  return rows.reverse(); // ໃໝ່ສຸດຂຶ້ນກ່ອນ
}

function createRow(sheet, table, data) {
  var headers = sheet.getDataRange().getValues()[0];
  if (!data.id) data.id = table.slice(0, 2) + Date.now();
  var row = headers.map(function (h) { return data[h] != null ? data[h] : ""; });
  sheet.appendRow(row);
  return data;
}

function updateRow(sheet, table, data) {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf("id");
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(data.id)) {
      var row = headers.map(function (h, j) {
        return data[h] != null ? data[h] : values[i][j];
      });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      return data;
    }
  }
  throw "id not found: " + data.id;
}

function deleteRow(sheet, id) {
  var values = sheet.getDataRange().getValues();
  var idCol = values[0].indexOf("id");
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

/** (ທາງເລືອກ) ແລ່ນເທື່ອດຽວ ເພື່ອສ້າງ sheet + ໃສ່ຂໍ້ມູນຕົວຢ່າງ */
function seedDemo() {
  var demo = {
    products: [
      ["p1","566948","ຄອມ","ຄອມພິວເຕີ",29000,22000,12,"ໜ່ວຍ","Vendor A"],
      ["p5","900112","ເມົາສ໌ໄຮ້ສາຍ","ອຸປະກອນ",85000,55000,40,"ໜ່ວຍ","Vendor C"]
    ],
    users: [["u1","admin","Admin ຮ້ານ","KSV ສຳນັກງານໃຫຍ່","admin"]]
  };
  for (var t in demo) {
    var sh = getSheet(t);
    demo[t].forEach(function (r) { sh.appendRow(r); });
  }
}
