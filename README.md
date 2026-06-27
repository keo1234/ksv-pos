# KSV POS — ລະບົບຂາຍໜ້າຮ້ານ (Web App)

ລະບົບ POS ໜ້າຮ້ານແບບໄຟລ໌ HTML ດຽວ. ໃຊ້ **Google Sheets ເປັນຖານຂໍ້ມູນ** (ຜ່ານ Google Apps Script).
ມີ **ໂໝດ Demo** ໃນຕົວ — ເປີດໄຟລ໌ແລ້ວທົດລອງໄດ້ທັນທີ.

## ໄຟລ໌ໃນຊຸດ
- `index.html` — ໂຕແອັບທັງໝົດ (ເປີດໄດ້ເລີຍໃນ browser)
- `Code.gs` — backend Google Apps Script ສຳລັບເຊື່ອມ Google Sheets
- `SETUP.md` — ຄູ່ມືຕິດຕັ້ງລະອຽດ

## ເລີ່ມໄວ (ໂໝດ Demo)
ເປີດ `index.html` ດ້ວຍ browser → login:
- ຊື່ຜູ້ໃຊ້: **admin**
- ລະຫັດຜ່ານ: **1234**

> ໝາຍເຫດ: ໂໝດ Demo ຂໍ້ມູນບໍ່ບັນທຶກຖາວອນ. ໃຊ້ງານຈິງໃຫ້ເຊື່ອມ Google Sheets ກ່ອນ (ເບິ່ງ `SETUP.md`).

## ໃຊ້ງານຈິງ (ເຊື່ອມ Google Sheets)
ສະຫຼຸບຂັ້ນຕອນ (ລະອຽດໃນ `SETUP.md`):
1. ສ້າງ Google Sheet ໃໝ່ → Extensions → Apps Script → ວາງ `Code.gs` → Save
2. Deploy → New deployment → Web app → Execute as **Me**, Who has access **Anyone** → Deploy
3. ກັອບ Web app URL (ລົງທ້າຍ `/exec`)
4. ເປີດແອັບ → ໜ້າ **ຕັ້ງຄ່າລະບົບ** → ວາງ URL → "ທົດສອບການເຊື່ອມ" → "ບັນທຶກ & ເຊື່ອມຕໍ່"

ການເຊື່ອມ ແລະ Token ຈະຖືກບັນທຶກໄວ້ໃນ browser (ບໍ່ຫາຍຕອນໂຫຼດໃໝ່).

## Host ຜ່ານ GitHub Pages
1. push ໂຟນເດີນີ້ຂຶ້ນ GitHub
2. Settings → Pages → Source: branch `main`, folder `/ (root)` → Save
3. ໄດ້ລິ້ງ `https://<username>.github.io/<repo>/`

> GitHub Pages host ໜ້າແອັບເທົ່ານັ້ນ. ຖານຂໍ້ມູນຍັງເປັນ Google Sheets ຕາມຂ້າງເທິງ.
