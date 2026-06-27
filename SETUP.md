# KSV POS — ຄູ່ມືຕິດຕັ້ງ ແລະ ການນຳໃຊ້

ລະບົບຂາຍໜ້າຮ້ານ (POS) ແບບ web app ໄຟລ໌ດຽວ ສ້າງຕາມຮູບແບບ SABAIPOS ແຕ່ປັບໂສມໃໝ່ໃຫ້ທັນສະໄໝ
ໃຊ້ຊື່ **KSV POS** (ບໍ່ມີໂລໂກ້ SABAIPOS) ແລະ ໃຊ້ **Google Sheets ເປັນຖານຂໍ້ມູນ**.

## ໄຟລ໌ໃນຊຸດນີ້
- `index.html` — ໂຕແອັບທັງໝົດ (ເປີດໄດ້ເລີຍໃນ browser, ມີໂໝດ Demo ໃນຕົວ)
- `Code.gs` — backend Google Apps Script ສຳລັບເຊື່ອມ Google Sheets
- `SETUP.md` — ໄຟລ໌ນີ້

---

## 1. ທົດລອງໃຊ້ທັນທີ (ໂໝດ Demo)
ເປີດ `index.html` ດ້ວຍ browser → ເຂົ້າສູ່ລະບົບດ້ວຍ:
- ຊື່ຜູ້ໃຊ້: **admin**
- ລະຫັດຜ່ານ: **1234**

ໃນໂໝດ Demo ຈະມີຂໍ້ມູນຕົວຢ່າງ (ສິນຄ້າ, ລູກຄ້າ, ການຂາຍ) ໃຫ້ລອງເລີຍ.
> ໝາຍເຫດ: ໂໝດ Demo ຂໍ້ມູນຍັງ **ບໍ່ບັນທຶກຖາວອນ** — ໂຫຼດໃໝ່ແລ້ວກັບໄປຄ່າເລີ່ມຕົ້ນ.

ໜ້າທີ່ໃຊ້ໄດ້: ໜ້າຫຼັກ (Dashboard), ໜ້າຈ່າຍຂາຍ (POS + ຄິດເງິນ + ເງິນທອນ),
ສິນຄ້າ/ສະຕັອກ, ລາຄາພື້ນຖານ, ສ້າງບາໂຄດ, ລູກຄ້າ, ເຄຣດິດຄ້າງ, ຈັດຊື້, ລາຍງານ,
ຜູ້ໃຊ້ງານ, ພະນັກງານ, ຕັ້ງຄ່າລະບົບ.

---

## 2. ເຊື່ອມກັບ Google Sheets (ໃຊ້ງານຈິງ)

### ຂັ້ນຕອນ
1. ໄປ [sheets.new](https://sheets.new) ສ້າງ Google Sheet ໃໝ່ (ນີ້ຄືຖານຂໍ້ມູນ)
2. ໃນ Sheet → ເມນູ **Extensions → Apps Script**
3. ລຶບໂຄ້ດເກົ່າ ແລ້ວວາງເນື້ອໃນຂອງ `Code.gs` ໃສ່ → ກົດ **Save** (💾)
4. (ທາງເລືອກ) ແລ່ນຟັງຊັນ `seedDemo` ເທື່ອດຽວ ເພື່ອສ້າງ sheet + ຂໍ້ມູນຕົວຢ່າງ
5. ກົດ **Deploy → New deployment**
   - ປະເພດ (gear ⚙): **Web app**
   - **Execute as:** Me
   - **Who has access:** **Anyone**
   - ກົດ **Deploy** → ອະນຸຍາດສິດ (Authorize) ຕາມ pop-up
6. ກັອບ **Web app URL** (ລົງທ້າຍດ້ວຍ `/exec`)

### ໃສ່ URL ເຂົ້າແອັບ — ມີ 2 ວິທີ
**ວິທີ A (ງ່າຍ):** ເປີດແອັບ → ໜ້າ **ຕັ້ງຄ່າລະບົບ** → ວາງ URL ໃນຊ່ອງ "Apps Script Web App URL"
→ ກົດ "ທົດສອບການເຊື່ອມ" → ຖ້າຂຶ້ນ ✓ ໃຫ້ກົດ "ບັນທຶກ & ເຊື່ອມຕໍ່"

**ວິທີ B (ຖາວອນ):** ເປີດ `index.html` ດ້ວຍ text editor → ໃນສ່ວນ `CONFIG` ໃສ່:
```js
const CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  STORE_NAME: "ຊື່ຮ້ານຂອງເຈົ້າ",
  CURRENCY: "ກີບ",
  TOKEN: "ksv-secret-2026"   // ໃຫ້ກົງກັບ TOKEN ໃນ Code.gs
};
```

> ⚠ **ສຳຄັນ:** `TOKEN` ໃນ `index.html` ຕ້ອງກົງກັບ `TOKEN` ໃນ `Code.gs` ສະເໝີ.
> ຖ້າແກ້ Code.gs ພາຍຫຼັງ ຕ້ອງ **Deploy → Manage deployments → Edit → New version** ໃໝ່.

---

## 3. ໂຄງສ້າງຂໍ້ມູນ (ແຕ່ລະ tab = 1 ຕາຕະລາງ)
ລະບົບຈະສ້າງ tab ໃຫ້ອັດຕະໂນມັດເມື່ອມີການໃຊ້ງານ. ຖັນຫຼັກ:

| Tab | ຖັນ |
|---|---|
| products | id, barcode, name, category, price, cost, stock, unit, vendor |
| customers | id, code, name, group, phone, email, address, birthday |
| sales | id, runno, date, cashier, customer, items, subtotal, discount, total, paid, paytype, status |
| users | id, name, role, branch, username |
| employees | id, name, position, phone, salary |
| purchase | id, no, date, vendor, items, total, note, status |

---

## 4. ການ host (ໃຫ້ໃຊ້ໄດ້ຫຼາຍເຄື່ອງ)
ເພາະເປັນໄຟລ໌ HTML ດຽວ, host ໄດ້ງ່າຍຜ່ານ:
- **GitHub Pages** (ຟຣີ): push `index.html` → ເປີດ Pages
- **Netlify / Vercel**: ລາກໄຟລ໌ໃສ່ ກໍ deploy ໄດ້ເລີຍ
- ຫຼື ເປີດໂດຍກົງຈາກໄຟລ໌ໃນເຄື່ອງ

---

## 5. ການຕໍ່ຍອດ (ສຳລັບນັກພັດທະນາ)
- ເພີ່ມໂມດູນໃໝ່: ເພີ່ມ entry ໃນ `NAV`, ສ້າງ view ໃນ `App.views`, ໃຊ້ `tableView()` + `formModal()` ທີ່ມີຢູ່ແລ້ວ
- ການອ່ານ/ຂຽນຂໍ້ມູນທັງໝົດຜ່ານ `Store.list / create / update / remove` (ໂຕມັນເລືອກເອງລະຫວ່າງ Demo ກັບ Google Sheets)
- ບາໂຄດໃນ `index.html` ເປັນພາບປະກອບ — ຖ້າຕ້ອງການບາໂຄດ Code128/EAN ແທ້ ໃຫ້ເພີ່ມ library `JsBarcode`
- ໂໝດສີ (ສະຫວ່າງ/ມືດ) ປ່ຽນຜ່ານປຸ່ມໃນ topbar ຫຼື ໜ້າຕັ້ງຄ່າ

---

ສ້າງໂດຍ **KSV POS** · ປັບແຕ່ງໄດ້ຕາມຕ້ອງການ
