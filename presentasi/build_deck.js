// Deck: Strategi Bundling New LLP + AFP (tema Navy Gold, sama dengan video)
// Jalankan: node presentasi/build_deck.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(
  "/root/.claude/skills/synced/f1b3a22e-9d60-4c59-8ed2-6ee50c767ed4_349db515-e271-4927-8669-54dfdd50e750/pptx/scripts/apply_theme.js"
);

const OUT = path.join(__dirname, "AFP_NewLLP_Bundling.pptx");
const IMG = (f) => path.join(__dirname, "img", f);

const HEX = {
  navy: "021D3C",
  navy2: "0A2F5C",
  white: "FFFFFF",
  paper: "F6F7FA",
  gold: "CB9A34",
  goldLight: "F5DC9A",
  goldDark: "8A6418",
  blue: "1A4B8C",
  gray: "6B7585",
};

const THEME = {
  name: "Navy Gold",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.navy,
    lt1: HEX.white,
    dk2: HEX.navy2,
    lt2: HEX.paper,
    accent1: HEX.gold,
    accent2: HEX.blue,
    accent3: HEX.goldDark,
    accent4: HEX.goldLight,
    accent5: HEX.gray,
    accent6: "06264C",
    hlink: HEX.gold,
    folHlink: HEX.goldDark,
  },
};

const DISCLAIMER = "Ilustrasi usia 40 tahun. Bukan penawaran resmi. Nilai aktual sesuai ketentuan polis.";
const CONTACT = "Raymon · 0812 8909 0202";

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = "Strategi Bundling New LLP + AFP";
  pres.author = "Raymon";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const W = 13.333;

  /* ---------------- Layouts ---------------- */
  pres.defineSlideMaster({
    title: "DARK_TITLE",
    background: { color: C.text1 },
    objects: [
      { text: { text: CONTACT, options: { x: 0.6, y: 6.75, w: 6, h: 0.4, fontSize: 14, bold: true, color: C.accent1, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.0, w: 7.4, h: 3.5, fontSize: 48, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 4.7, w: 7.4, h: 1.2, fontSize: 18, color: C.accent4, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.3, y: 6.8, w: 0.5, h: 0.3, fontSize: 10, color: C.accent5 },
  });

  pres.defineSlideMaster({
    title: "LIGHT_CONTENT",
    background: { color: C.background1 },
    objects: [
      { text: { text: DISCLAIMER, options: { x: 0.6, y: 6.95, w: 8.5, h: 0.3, fontSize: 10, italic: true, color: C.accent5, margin: 0 } } },
      { text: { text: CONTACT, options: { x: 8.9, y: 6.95, w: 3.3, h: 0.3, fontSize: 11, bold: true, color: C.accent3, align: "right", margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.45, w: 12.1, h: 0.9, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.35, y: 6.95, w: 0.4, h: 0.3, fontSize: 10, color: C.accent5 },
  });

  pres.defineSlideMaster({
    title: "DARK_CONTENT",
    background: { color: C.text1 },
    objects: [
      { text: { text: DISCLAIMER, options: { x: 0.6, y: 6.95, w: 8.5, h: 0.3, fontSize: 10, italic: true, color: C.accent5, margin: 0 } } },
      { text: { text: CONTACT, options: { x: 8.9, y: 6.95, w: 3.3, h: 0.3, fontSize: 11, bold: true, color: C.accent1, align: "right", margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.45, w: 12.1, h: 0.9, fontSize: 36, bold: true, color: C.background1, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.35, y: 6.95, w: 0.4, h: 0.3, fontSize: 10, color: C.accent5 },
  });

  /* ---------------- Helpers ---------------- */
  const shadow = () => ({ type: "outer", color: "000000", opacity: 0.12, blur: 8, offset: 2, angle: 90 });
  // kartu putih bertepi tipis emas (motif: kartu bersudut bulat + angka emas)
  const card = (s, x, y, w, h, name, fill = C.background1) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: 0.15, fill: { color: fill }, line: { color: C.accent1, width: 1 }, shadow: shadow(), objectName: name,
    });
  const txt = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, ...o });
  const goldPill = (s, text, x, y, w, h, name, size = 24) =>
    s.addText(text, {
      shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x, y, w, h,
      fill: { color: C.accent1 }, color: C.text1, bold: true, fontSize: size, align: "center", valign: "middle",
      margin: 0, objectName: name, isTextBox: true,
    });

  /* ================= SECTION 1: Pembuka ================= */
  pres.addSection({ title: "Pembuka" });

  // 1. Judul
  {
    const s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Pembuka" });
    s.addText(
      [
        { text: "Punya Aset ", options: { color: C.background1 } },
        { text: "Rp 2,5 Miliar ‘tanpa biaya’?", options: { color: C.accent1, breakLine: true } },
        { text: "Kedengarannya scam, kan?", options: { color: C.background1, fontSize: 36 } },
      ],
      { placeholder: "title" }
    );
    s.addText("Strategi bundling New LLP + AFP: bukan sulap, cuma hitungan sederhana. Ilustrasi usia 40 tahun.", { placeholder: "body" });
    s.addImage({ path: IMG("timbangan.jpg"), x: 8.45, y: 1.6, w: 4.3, h: 3.27, rounding: false, objectName: "Ilustrasi timbangan" , altText: "Timbangan emas: uang di satu sisi, perisai proteksi di sisi lain" });
    txt(s, "SCAM?", { x: 8.45, y: 5.05, w: 4.3, h: 0.9, fontSize: 40, bold: true, color: C.accent1, align: "center", fontFace: "Arial", objectName: "Stempel scam" });
    s.addNotes("Punya aset dua koma lima miliar… tanpa biaya? Kedengarannya scam, kan?\n\nPancing rasa penasaran: dua skenario, cuan pasti atau warisan besar. Tegaskan ini ilustrasi usia 40 tahun.");
  }

  // 2. Dua polis
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Pembuka" });
    s.addText("Bukan sulap, cuma gabungan dua polis", { placeholder: "title" });
    const items = [
      ["Polis 1", "New LLP", "Proteksi jiwa seumur hidup sampai usia 100. Bayar premi cuma 5 tahun.", "UP Rp 2,5 M"],
      ["Polis 2", "AFP", "Asuransi jiwa dengan dana tunai bertahap. Bayar premi 5 tahun, cair di tahun 15 dan 25.", "UP awal Rp 650 jt"],
    ];
    items.forEach(([k, n, d, up], i) => {
      const x = 0.6 + i * 6.4;
      card(s, x, 1.75, 5.7, 4.6, `Kartu ${n}`);
      txt(s, k, { x: x + 0.45, y: 2.1, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.accent3 });
      txt(s, n, { x: x + 0.45, y: 2.55, w: 5, h: 0.9, fontSize: 44, bold: true, color: C.text1, fontFace: "Arial" });
      txt(s, d, { x: x + 0.45, y: 3.6, w: 4.95, h: 1.2, fontSize: 18, color: C.text2, valign: "top" });
      goldPill(s, up, x + 0.45, 5.2, 3.4, 0.7, `UP ${n}`, 22);
    });
    txt(s, "+", { x: 6.3, y: 3.6, w: 0.7, h: 0.8, fontSize: 44, bold: true, color: C.accent1, align: "center", objectName: "Tanda tambah" });
    s.addNotes("Tenang. Ini bukan sulap, cuma hitungan sederhana: gabungan dua polis, New LLP dan AFP.");
  }

  /* ================= SECTION 2: Produk ================= */
  pres.addSection({ title: "Produk" });

  // 3. New LLP
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Produk" });
    s.addText("New LLP: bayar 5 tahun, aman sampai usia 100", { placeholder: "title" });
    // kiri: hitungan premi
    card(s, 0.6, 1.75, 5.9, 4.6, "Kartu premi LLP");
    txt(s, "Premi per tahun", { x: 1.0, y: 2.05, w: 5, h: 0.4, fontSize: 16, color: C.accent5 });
    txt(s, "Rp 57.425.000 × 5 tahun", { x: 1.0, y: 2.45, w: 5.2, h: 0.6, fontSize: 26, bold: true, color: C.text1 });
    txt(s, "Total premi", { x: 1.0, y: 3.35, w: 5, h: 0.4, fontSize: 16, color: C.accent5 });
    txt(s, "Rp 287.125.000", { x: 1.0, y: 3.75, w: 5.2, h: 0.9, fontSize: 44, bold: true, color: C.accent1, fontFace: "Arial" });
    // bar usia
    txt(s, "Usia 40", { x: 1.0, y: 5.05, w: 1.5, h: 0.35, fontSize: 14, color: C.accent5 });
    txt(s, "Usia 100", { x: 4.6, y: 5.05, w: 1.5, h: 0.35, fontSize: 14, bold: true, color: C.text1, align: "right" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 5.5, w: 5.1, h: 0.22, rectRadius: 0.11, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Bar proteksi" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 5.5, w: 0.43, h: 0.22, rectRadius: 0.11, fill: { color: C.text1 }, line: { type: "none" }, objectName: "Bar bayar premi" });
    txt(s, "5 th bayar", { x: 1.0, y: 5.8, w: 2, h: 0.35, fontSize: 12, color: C.text1 });
    txt(s, "proteksi berjalan sampai usia 100", { x: 2.6, y: 5.8, w: 3.5, h: 0.35, fontSize: 12, color: C.accent3, align: "right" });
    // kanan: stat besar
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.75, w: 5.85, h: 4.6, rectRadius: 0.15, fill: { color: C.text1 }, line: { type: "none" }, shadow: shadow(), objectName: "Kartu UP LLP" });
    txt(s, "Uang Pertanggungan", { x: 7.3, y: 2.2, w: 5, h: 0.45, fontSize: 20, color: C.accent4 });
    txt(s, "Rp 2,5 M", { x: 7.3, y: 2.75, w: 5, h: 1.4, fontSize: 80, bold: true, color: C.accent1, fontFace: "Arial" });
    txt(
      s,
      [
        { text: "Cair 100% saat usia 100 tahun", options: { bullet: true, breakLine: true } },
        { text: "atau lebih cepat bila terjadi klaim meninggal dunia, diwariskan penuh ke termaslahat", options: { bullet: true } },
      ],
      { x: 7.3, y: 4.35, w: 5, h: 1.6, fontSize: 16, color: C.background1, paraSpaceAfter: 8, valign: "top" }
    );
    s.addNotes("Polis pertama, New LLP. Bayar premi cuma lima tahun, tapi melindungi jiwa sampai usia seratus, dengan uang pertanggungan dua koma lima miliar.\n\nTotal premi 5 tahun New LLP Rp 287.125.000: angka ini penting untuk slide hitungan.");
  }

  // 4. AFP timeline
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Produk" });
    s.addText("AFP: modal balik di tahun 15 dan 25", { placeholder: "title" });
    // header premi
    card(s, 0.6, 1.7, 12.1, 1.15, "Kartu premi AFP", C.background2);
    txt(s, [
      { text: "Premi Rp 71.409.000 × 5 tahun = ", options: { color: C.text1 } },
      { text: "Rp 357.045.000", options: { color: C.accent3, bold: true } },
    ], { x: 1.0, y: 1.85, w: 8.5, h: 0.85, fontSize: 24, bold: true, valign: "middle" });
    txt(s, "Masa proyeksi 25 tahun", { x: 9.3, y: 1.85, w: 3.1, h: 0.85, fontSize: 16, color: C.accent5, align: "right", valign: "middle" });
    // timeline horizontal
    const steps = [
      ["Tahun 1–15", "UP jiwa aktif 100%", "Rp 650 jt", false],
      ["Akhir tahun 15", "usia 55 · cair 50% UP", "Rp 325 jt", true],
      ["Tahun 16–25", "UP jiwa naik jadi 150%", "Rp 975 jt", false],
      ["Akhir tahun 25", "usia 65 · cair 50% UP", "Rp 325 jt", true],
    ];
    s.addShape(pres.shapes.LINE, { x: 1.55, y: 3.55, w: 10.2, h: 0, line: { color: C.accent1, width: 2.5 }, objectName: "Garis waktu" });
    steps.forEach(([t, d, v, cash], i) => {
      const cx = 1.55 + i * 3.4;
      s.addShape(pres.shapes.OVAL, { x: cx - 0.22, y: 3.33, w: 0.44, h: 0.44, fill: { color: cash ? C.accent1 : C.background1 }, line: { color: C.accent1, width: 2.5 }, objectName: `Titik ${t}` });
      const x = cx - 1.45;
      txt(s, t, { x, y: 4.0, w: 2.9, h: 0.45, fontSize: 18, bold: true, color: C.text1, align: "center" });
      txt(s, d, { x, y: 4.45, w: 2.9, h: 0.4, fontSize: 14, color: C.accent5, align: "center" });
      if (cash) goldPill(s, `Cair ${v}`, x + 0.2, 5.0, 2.5, 0.65, `Cair ${t}`, 20);
      else txt(s, `UP ${v}`, { x, y: 5.0, w: 2.9, h: 0.65, fontSize: 22, bold: true, color: C.text2, align: "center", valign: "middle" });
    });
    txt(s, "Polis tetap berjalan dan proteksi tetap aktif setelah pencairan tahun ke-15.", { x: 0.6, y: 6.1, w: 12.1, h: 0.4, fontSize: 14, italic: true, color: C.accent3, align: "center" });
    s.addNotes("Polis kedua, AFP. Juga bayar lima tahun. Di tahun kelima belas cair tiga ratus dua puluh lima juta. Di tahun kedua puluh lima, cair lagi tiga ratus dua puluh lima juta.\n\nTekankan proteksi tetap jalan meski sudah cair.");
  }

  /* ================= SECTION 3: Hitungan ================= */
  pres.addSection({ title: "Hitungan" });

  // 5. Modal vs balik (chart)
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Hitungan" });
    s.addText("Modal kembali semua, plus sisa Rp 5,83 juta", { placeholder: "title" });
    s.addChart(
      pres.charts.BAR,
      [{ name: "Rupiah (juta)", labels: ["Balik dari AFP (th 15 + th 25)", "Total modal 5 th (LLP + AFP)"], values: [650, 644.17] }],
      {
        x: 0.6, y: 1.7, w: 7.3, h: 4.9, barDir: "bar", objectName: "Grafik modal vs balik",
        chartColors: [HEX.gold, HEX.navy], showValue: true, dataLabelPosition: "outEnd",
        dataLabelFormatCode: '"Rp "#,##0.00" jt"', dataLabelFontSize: 16, dataLabelFontBold: true, dataLabelColor: HEX.navy,
        dataLabelFontFace: "+mn-lt", catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", titleFontFace: "+mn-lt",
        catAxisLabelColor: HEX.navy, catAxisLabelFontSize: 14, valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 760,
        valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 60,
        showTitle: true, title: "Rupiah (juta)", titleFontSize: 14, titleColor: HEX.gray,
      }
    );
    // kanan: rincian
    card(s, 8.3, 1.7, 4.4, 3.0, "Kartu rincian modal", C.background2);
    txt(s, [
      { text: "Premi New LLP 5 th", options: { breakLine: true, color: C.accent5, fontSize: 14 } },
      { text: "Rp 287.125.000", options: { breakLine: true, bold: true, color: C.text1, fontSize: 20 } },
      { text: "Premi AFP 5 th", options: { breakLine: true, color: C.accent5, fontSize: 14 } },
      { text: "Rp 357.045.000", options: { breakLine: true, bold: true, color: C.text1, fontSize: 20 } },
      { text: "Total modal", options: { breakLine: true, color: C.accent5, fontSize: 14 } },
      { text: "Rp 644.170.000", options: { bold: true, color: C.accent3, fontSize: 24 } },
    ], { x: 8.7, y: 1.95, w: 3.8, h: 3.0, valign: "top", paraSpaceAfter: 2 });
    goldPill(s, "Cuan : +Rp 5.830.000", 8.3, 5.0, 4.4, 0.95, "Badge cuan", 26);
    s.addNotes("Sekarang hitung. Total modal lima tahun: enam ratus empat puluh empat juta. Yang balik dari AFP: enam ratus lima puluh juta. Modal balik semua, plus lebih lima koma delapan juta.\n\nRp 650.000.000 − Rp 644.170.000 = Rp 5.830.000.");
  }

  // 6. Praktis gratis (dark)
  {
    const s = pres.addSlide({ masterName: "DARK_CONTENT", sectionTitle: "Hitungan" });
    s.addText("Artinya: New LLP Rp 2,5 M praktis gratis", { placeholder: "title" });
    s.addImage({ path: IMG("jalan.jpg"), x: 0.6, y: 1.65, w: 4.1, h: 5.09, objectName: "Ilustrasi perjalanan", altText: "Jalan berkelok menuju peti harta di puncak bukit" });
    txt(s, "Cair 100% di usia 100 tahun", { x: 5.2, y: 1.85, w: 7.4, h: 0.5, fontSize: 22, color: C.accent4 });
    txt(s, "Rp 2,5 M", { x: 5.2, y: 2.35, w: 7.4, h: 1.6, fontSize: 96, bold: true, color: C.accent1, fontFace: "Arial" });
    const rows = [
      ["Tahun ke-15", "usia 55", "Rp 325 jt"],
      ["Tahun ke-25", "usia 65", "Rp 325 jt"],
      ["Pasti cair", "usia 100", "Rp 2,5 M"],
    ];
    rows.forEach(([a, b, v], i) => {
      const y = 4.25 + i * 0.78;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.2, y, w: 7.5, h: 0.62, rectRadius: 0.1, fill: { color: C.text2 }, line: { type: "none" }, objectName: `Baris ${a}` });
      txt(s, [{ text: a, options: { bold: true, color: C.background1 } }, { text: `  ·  ${b}`, options: { color: C.accent4 } }], { x: 5.5, y, w: 4.5, h: 0.62, fontSize: 18, valign: "middle" });
      txt(s, v, { x: 9.9, y, w: 2.5, h: 0.62, fontSize: 22, bold: true, color: C.accent1, align: "right", valign: "middle" });
    });
    s.addNotes("Artinya, New LLP dua koma lima miliar yang cair di usia seratus… praktis gratis.\n\nSampaikan pelan: premi 5 tahun New LLP sudah tertutup oleh pencairan AFP. Angka 'pasti' merujuk pada manfaat kontraktual polis (*no lapsed policy*), bukan janji investasi.");
  }

  /* ================= SECTION 4: Proteksi ================= */
  pres.addSection({ title: "Proteksi" });

  // 7. Warisan
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Proteksi" });
    s.addText("Kalau terjadi risiko, keluarga tetap menang", { placeholder: "title" });
    s.addImage({ path: IMG("keluarga.jpg"), x: 0.6, y: 1.65, w: 4.3, h: 5.2, objectName: "Ilustrasi keluarga", altText: "Keluarga berlindung di bawah payung saat hujan" });
    s.addChart(
      pres.charts.BAR,
      [{ name: "Diterima ahli waris (miliar Rp)", labels: ["Tahun 1–15", "Tahun 16–25", "Tahun 26 dst"], values: [3.15, 3.475, 2.5] }],
      {
        x: 5.3, y: 1.65, w: 7.4, h: 3.6, barDir: "col", objectName: "Grafik warisan",
        chartColors: [HEX.gold], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '"Rp "0.0##" M"',
        dataLabelFontSize: 18, dataLabelFontBold: true, dataLabelColor: HEX.navy, dataLabelFontFace: "+mn-lt",
        catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", titleFontFace: "+mn-lt",
        catAxisLabelColor: HEX.navy, catAxisLabelFontSize: 14, valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 4,
        valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 70,
        showTitle: true, title: "Diterima ahli waris (miliar Rp)", titleFontSize: 14, titleColor: HEX.gray,
      }
    );
    card(s, 5.3, 5.45, 7.4, 1.3, "Kartu rincian warisan", C.background2);
    txt(s, [
      { text: "Th 1–15: AFP 100% (Rp 650 jt) + New LLP (Rp 2,5 M) = Rp 3,15 M", options: { breakLine: true } },
      { text: "Th 16–25: AFP 150% (Rp 975 jt) + New LLP (Rp 2,5 M) = Rp 3,475 M", options: { breakLine: true } },
      { text: "Th 26 dst: New LLP Rp 2,5 M", options: {} },
    ], { x: 5.6, y: 5.55, w: 6.9, h: 1.1, fontSize: 14, color: C.text1, valign: "middle" });
    s.addNotes("Dan kalau terjadi risiko, ahli waris menerima hingga tiga koma empat miliar lebih. Apa pun yang terjadi, keluarga tetap menang.\n\nHidup sampai usia 100: cuan Rp 2,5 M. Meninggal dalam masa proteksi: warisan gabungan Rp 3,15 M sampai Rp 3,475 M.");
  }

  // 8. Ringkasan
  {
    const s = pres.addSlide({ masterName: "LIGHT_CONTENT", sectionTitle: "Proteksi" });
    s.addText("Modal Rp 644 juta, total cair Rp 3,15 M", { placeholder: "title" });
    const stats = [
      ["Total modal 5 tahun", "Rp 644,17 jt", "Premi New LLP + AFP", C.text1],
      ["Total seluruh pencairan", "Rp 3,15 M", "Rp 325 jt + Rp 325 jt + Rp 2,5 M", C.accent3],
      ["Multiplikasi", "±4,89×", "dari total modal yang disetorkan", C.accent3],
    ];
    stats.forEach(([k, v, d, col], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 1.75, 3.8, 2.9, `Stat ${k}`);
      txt(s, k, { x: x + 0.35, y: 2.0, w: 3.1, h: 0.45, fontSize: 16, color: C.accent5 });
      txt(s, v, { x: x + 0.35, y: 2.55, w: 3.3, h: 0.9, fontSize: 32, bold: true, color: col, fontFace: "Arial" });
      txt(s, d, { x: x + 0.35, y: 3.7, w: 3.1, h: 0.7, fontSize: 14, color: C.text2, valign: "top" });
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.95, w: 12.1, h: 1.6, rectRadius: 0.15, fill: { color: C.text1 }, line: { type: "none" }, objectName: "Kartu cocok untuk" });
    txt(s, "Cocok untuk", { x: 1.0, y: 5.1, w: 3, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
    const who = ["Kepala keluarga usia 35–45 dengan penghasilan stabil", "Nyaman komitmen premi 5 tahun untuk manfaat sampai usia 100", "Ingin warisan besar tanpa premi seumur hidup"];
    who.forEach((t, i) => txt(s, t, { x: 1.0 + i * 3.9, y: 5.6, w: 3.6, h: 0.8, fontSize: 14, color: C.background1, valign: "top" }));
    s.addNotes("Rekap angka: modal Rp 644.170.000 vs total pencairan Rp 3.150.000.000 (2× pencairan AFP + New LLP di usia 100). Sampaikan dengan nada edukatif, bukan janji pasti. Termasuk manfaat bebas premi bila sakit kritis (49 kondisi) atau cacat tetap total, sesuai ketentuan polis.");
  }

  /* ================= SECTION 5: Penutup ================= */
  pres.addSection({ title: "Penutup" });
  {
    const s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: "Penutup" });
    s.addText([{ text: "Valid atau ", options: { color: C.background1 } }, { text: "Scam?", options: { color: C.accent1 } }], { placeholder: "title" });
    s.addText("Tulis pendapat Anda di komentar, atau minta ilustrasi resmi sesuai usia dan kebutuhan proteksi Anda.", { placeholder: "body" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.45, y: 2.5, w: 4.3, h: 3.0, rectRadius: 0.15, fill: { color: C.text2 }, line: { color: C.accent1, width: 1.5 }, objectName: "Kartu kontak" });
    txt(s, "Konsultasi & ilustrasi resmi", { x: 8.75, y: 2.8, w: 3.7, h: 0.45, fontSize: 16, color: C.accent4, align: "center" });
    txt(s, "Raymon", { x: 8.75, y: 3.35, w: 3.7, h: 1.0, fontSize: 48, bold: true, color: C.accent1, align: "center", fontFace: "Arial" });
    txt(s, "0812 8909 0202", { x: 8.75, y: 4.4, w: 3.7, h: 0.6, fontSize: 26, bold: true, color: C.background1, align: "center" });
    txt(s, DISCLAIMER, { x: 8.45, y: 5.7, w: 4.3, h: 0.7, fontSize: 11, italic: true, color: C.accent5, align: "center", valign: "top" });
    s.addNotes("Valid atau scam? Tulis di komentar. Atau hubungi Raymon untuk ilustrasi resmi sesuai usia Anda.\n\nSelalu berikan ilustrasi resmi sesuai kebutuhan personal nasabah.");
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
