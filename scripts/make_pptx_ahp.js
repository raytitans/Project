/**
 * Deck presentasi "Premi Kesehatan di Usia Pensiun" — gaya Navy Gold (sama dengan video).
 * Jalankan: NODE_PATH=<node_modules berisi pptxgenjs, sharp, react-icons, react, react-dom> node scripts/make_pptx_ahp.js <apply_theme.js> <out.pptx> <video.mp4> <poster.png>
 */
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { FaShieldAlt, FaCheck, FaPhoneAlt, FaRegCommentDots, FaHeartbeat, FaCalendarAlt, FaCoins, FaPlayCircle } = require("react-icons/fa");

const [, , APPLY_THEME, OUT, VIDEO, POSTER] = process.argv;
const { applyTheme } = require(APPLY_THEME);
const PREMI = require("./ahp_premium_pria.json");

/* ---------------- Tema (Navy Gold dari design.md §12) ---------------- */
const HEX = {
  bg: "010A16",
  navy: "021D3C",
  navy2: "0A2F5C",
  navyCard: "0B2A4F",
  gold: "D4A23A",
  goldBright: "E8BE5A",
  goldLight: "F5DC9A",
  cream: "FAFAF5",
  gray: "A8B0BE",
  blue: "1A4B8C",
};
const THEME = {
  name: "Navy Gold Raymon",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.bg,
    lt1: HEX.cream,
    dk2: HEX.navy,
    lt2: HEX.goldLight,
    accent1: HEX.gold,
    accent2: HEX.goldBright,
    accent3: HEX.blue,
    accent4: HEX.navy2,
    accent5: HEX.gray,
    accent6: "8A6418",
    hlink: HEX.goldBright,
    folHlink: HEX.goldLight,
  },
};

const DISCLAIMER = "Ilustrasi by Raymon, ketentuan sesuai Polis, AXA berizin & diawasi OJK.";

/* ---------------- Aset gambar ---------------- */
async function background() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="s" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#1A4B8C" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#1A4B8C" stop-opacity="1"/>
        <stop offset="1" stop-color="#1A4B8C" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="v" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.45" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.8"/>
      </radialGradient>
      <filter id="b"><feGaussianBlur stdDeviation="40"/></filter>
    </defs>
    <rect width="1920" height="1080" fill="#021430"/>
    <g filter="url(#b)" transform="rotate(28 960 540)">
      <rect x="150" y="-900" width="420" height="2900" fill="url(#s)" opacity="0.55"/>
      <rect x="1050" y="-900" width="260" height="2900" fill="url(#s)" opacity="0.35"/>
      <rect x="1650" y="-900" width="480" height="2900" fill="url(#s)" opacity="0.45"/>
    </g>
    <rect width="1920" height="1080" fill="url(#v)"/>
    <rect width="1920" height="4" fill="#D4A23A" opacity="0.55"/>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

/* ---------------- Deck ---------------- */
(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 × 5.625 in
  pres.author = "Raymon";
  pres.title = "Premi Kesehatan di Usia Pensiun";
  pres.subject = "Ilustrasi AXA Health Protector & AXA Future Protector";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const BG = await background();

  pres.defineSlideMaster({
    title: "Judul",
    background: { data: BG },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.2, w: 6.2, h: 1.85, fontSize: 36, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.2, w: 6.2, h: 0.8, fontSize: 18, color: C.accent1, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "Konten",
    background: { data: BG },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 9, h: 0.75, fontSize: 28, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
      { text: { text: DISCLAIMER, options: { x: 0.5, y: 5.2, w: 7.6, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
    ],
    slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
  });
  pres.defineSlideMaster({
    title: "Penutup",
    background: { data: BG },
    objects: [{ text: { text: DISCLAIMER, options: { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 10, color: C.accent5, align: "center", margin: 0 } } }],
  });

  const shadow = () => ({ type: "outer", color: "000000", opacity: 0.45, blur: 8, offset: 3, angle: 90 });
  const card = (slide, x, y, w, h, name) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: 0.12,
      fill: { color: C.text2, transparency: 15 },
      line: { color: C.accent1, width: 1, transparency: 35 },
      shadow: shadow(),
      objectName: name,
    });
  const circleIcon = async (slide, Comp, x, y, d, name) => {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.accent1 }, line: { type: "none" }, shadow: shadow(), objectName: name + " lingkaran" });
    slide.addImage({ data: await icon(Comp, HEX.bg), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, altText: name, objectName: name });
  };
  const stat = (slide, value, label, x, y, w, size = 54, name = "Angka") => {
    slide.addText(value, { x, y, w, h: size / 72 + 0.15, fontFace: THEME.headFontFace, fontSize: size, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name });
    if (label) slide.addText(label, { x, y: y + size / 72 + 0.15, w, h: 0.55, fontSize: 14, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: name + " label" });
  };
  const chartText = { catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", dataLabelFontFace: "+mn-lt", titleFontFace: "+mn-lt", legendFontFace: "+mn-lt" };

  /* 1 — Judul */
  pres.addSection({ title: "Pembuka" });
  let s = pres.addSlide({ masterName: "Judul", sectionTitle: "Pembuka" });
  s.addText("Premi Kesehatan Termahal Justru di Usia Pensiun", { placeholder: "title" });
  s.addText("…dan biayanya bisa disiapkan sejak sekarang", { placeholder: "body", italic: true });
  s.addShape(pres.shapes.OVAL, { x: 7.15, y: 1.3, w: 2.3, h: 2.3, fill: { color: C.accent1 }, line: { color: C.accent4, width: 6 }, shadow: shadow(), objectName: "Orb emas" });
  s.addImage({ data: await icon(FaShieldAlt, HEX.bg), x: 7.75, y: 1.9, w: 1.1, h: 1.1, altText: "Ikon perisai", objectName: "Ikon perisai" });
  s.addText([{ text: "RAYMON", options: { bold: true, color: C.accent1, charSpacing: 4 } }, { text: "   ·   0812 8909 0202", options: { color: C.background1 } }], { x: 0.6, y: 4.55, w: 6, h: 0.4, fontSize: 16, margin: 0, isTextBox: true, objectName: "Kontak" });
  s.addNotes("Tahukah kamu, berapa total biaya premi kesehatanmu, di usia tiga puluh sampai delapan puluh empat tahun?");

  /* 2 — Total & kenaikan premi */
  pres.addSection({ title: "Masalah" });
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Masalah" });
  s.addText("Total premi kesehatan usia 30–84: ±Rp2 M", { placeholder: "title" });
  stat(s, "Rp2,04 M", "Total premi AXA Health Protector Premium, usia 30–84", 0.5, 1.45, 3.4, 54, "Total premi");
  card(s, 0.5, 2.95, 3.4, 1.9, "Kartu premi per tahun");
  s.addText(
    [
      { text: "Premi per tahun", options: { bold: true, color: C.accent1, breakLine: true } },
      { text: "Usia 30   Rp7,7 jt", options: { breakLine: true } },
      { text: "Usia 65   Rp38,4 jt", options: { breakLine: true } },
      { text: "Usia 84   Rp118 jt", options: {} },
    ],
    { x: 0.75, y: 3.1, w: 3.0, h: 1.6, fontSize: 16, color: C.background1, paraSpaceAfter: 4, margin: 0, valign: "top", isTextBox: true, objectName: "Daftar premi" },
  );
  const ages = Object.keys(PREMI);
  s.addChart(
    pres.charts.LINE,
    [{ name: "Premi per tahun (Rp juta)", labels: ages, values: ages.map((a) => Math.round(PREMI[a] / 1e5) / 10) }],
    {
      x: 4.2, y: 1.25, w: 5.3, h: 3.6, ...chartText, catAxisLabelRotate: 0,
      showTitle: true, title: "Premi per tahun naik ±15× (Rp juta)", titleColor: HEX.cream, titleFontSize: 14,
      chartColors: [HEX.gold], lineSize: 3, lineDataSymbol: "none",
      catAxisLabelColor: HEX.gray, valAxisLabelColor: HEX.gray, catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
      catAxisLabelFrequency: 5, valGridLine: { color: "1E3557", size: 0.5 }, catGridLine: { style: "none" },
      catAxisLineShow: false, valAxisLineShow: false, showLegend: false, valAxisMinVal: 0,
      objectName: "Grafik premi per usia",
    },
  );
  s.addText("Sumber: Tabel Premi AXA Health Protector (per 15 Sep 2026), plan Premium, pria, premi tanpa diskon", { x: 4.2, y: 4.85, w: 5.3, h: 0.3, fontSize: 10, color: C.accent5, margin: 0, isTextBox: true, objectName: "Sumber" });
  s.addNotes("Sekitar dua miliar. Premi naik dari sekitar 7,7 juta per tahun di usia 30, menjadi 38,4 juta di usia 65, dan 118 juta di usia 84.");

  /* 3 — Hampir 3/4 di usia pensiun */
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Masalah" });
  s.addText("Hampir ¾ biaya justru jatuh di usia pensiun", { placeholder: "title" });
  s.addChart(
    pres.charts.BAR,
    [{ name: "Total premi (Rp juta)", labels: ["Usia 30–64: Rp558,9 jt", "Usia 65–84: Rp1.482,3 jt"], values: [558.9, 1482.3] }],
    {
      x: 0.5, y: 1.25, w: 5.2, h: 3.8, barDir: "col", ...chartText,
      chartColors: [HEX.blue, HEX.gold], invertedColors: [HEX.blue, HEX.gold],
      showValue: false,
      catAxisLabelColor: HEX.cream, catAxisLabelFontSize: 14, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, barGapWidthPct: 60, valAxisMinVal: 0, valAxisMaxVal: 1700,
      objectName: "Grafik perbandingan usia",
    },
  );
  card(s, 6.1, 1.35, 3.4, 3.55, "Kartu persentase");
  s.addChart(
    pres.charts.DOUGHNUT,
    [{ name: "Porsi biaya", labels: ["Usia 65–84", "Usia 30–64"], values: [72.6, 27.4] }],
    { x: 6.55, y: 1.45, w: 2.5, h: 2.5, ...chartText, chartColors: [HEX.gold, "1E3557"], holeSize: 70, showLegend: false, showValue: false, showPercent: false, showLabel: false, dataBorder: { pt: 0, color: HEX.navy }, objectName: "Donat 72,6%" },
  );
  s.addText("72,6%", { x: 6.55, y: 2.35, w: 2.5, h: 0.7, align: "center", fontFace: THEME.headFontFace, fontSize: 24, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "Angka 72,6%" });
  s.addText("total premi jatuh di usia 65–84", { x: 6.35, y: 4.0, w: 2.9, h: 0.6, align: "center", fontSize: 14, color: C.background1, margin: 0, isTextBox: true, objectName: "Label persentase" });
  s.addNotes("Usia 30 sampai 64, sekitar 560 juta. Tapi usia 65 sampai 84, hampir 1,5 miliar. Hampir 75 persen, justru di usia pensiun.");

  /* 4 — Solusi */
  pres.addSection({ title: "Solusi" });
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Solusi" });
  s.addText("Siapkan sejak sekarang: ±Rp10 jt/bulan, 5 tahun", { placeholder: "title" });
  for (let k = 0; k < 5; k++) {
    const x = 0.5 + k * 1.42;
    card(s, x, 1.55, 1.22, 1.45, `Tahun ${k + 1}`);
    s.addText([{ text: "Tahun", options: { fontSize: 12, color: C.accent5, breakLine: true } }, { text: String(k + 1), options: { fontSize: 32, bold: true, color: C.background1, fontFace: THEME.headFontFace } }], { x, y: 1.62, w: 1.22, h: 0.95, align: "center", margin: 0, isTextBox: true, objectName: `Label tahun ${k + 1}` });
    s.addText("Rp120,7 jt", { x, y: 2.55, w: 1.22, h: 0.35, align: "center", fontSize: 13, color: C.accent1, margin: 0, isTextBox: true, objectName: `Premi tahun ${k + 1}` });
  }
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 7.65, y: 2.05, w: 0.55, h: 0.45, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Panah" });
  s.addText([{ text: "Usia 65", options: { fontSize: 14, color: C.background1, breakLine: true } }, { text: "Rp2,1 M", options: { fontSize: 28, bold: true, color: C.accent1, fontFace: THEME.headFontFace } }], { x: 8.25, y: 1.7, w: 1.4, h: 1.1, margin: 0, valign: "middle", isTextBox: true, objectName: "Dana cair" });
  await circleIcon(s, FaCoins, 0.5, 3.55, 0.7, "Ikon koin");
  s.addText([{ text: "Total premi AFP: Rp603,5 jt", options: { bold: true, color: C.accent1, breakLine: true } }, { text: "Rp120.708.000 per tahun selama 5 tahun (≈ Rp10 jt per bulan)", options: { color: C.background1 } }], { x: 1.4, y: 3.5, w: 3.9, h: 0.85, fontSize: 14, margin: 0, valign: "middle", isTextBox: true, objectName: "Ringkasan premi AFP" });
  await circleIcon(s, FaCalendarAlt, 5.4, 3.55, 0.7, "Ikon kalender");
  s.addText([{ text: "Cair di usia 65", options: { bold: true, color: C.accent1, breakLine: true } }, { text: "Manfaat Akhir Polis AXA Future Protector, masa pertanggungan 35 tahun", options: { color: C.background1 } }], { x: 6.3, y: 3.5, w: 3.2, h: 0.85, fontSize: 14, margin: 0, valign: "middle", isTextBox: true, objectName: "Ringkasan manfaat akhir" });
  s.addText("Sumber: Proposal AXA Future Protector, pria 30 th, UP Rp2,1 M, masa bayar 5 tahun", { x: 0.5, y: 4.75, w: 9, h: 0.25, fontSize: 10, color: C.accent5, margin: 0, isTextBox: true, objectName: "Sumber" });
  s.addNotes("Bagaimana kalau disiapkan sejak sekarang? Sisihkan sekitar sepuluh juta sebulan, selama lima tahun.");

  /* 5 — Dana cair cukup */
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Solusi" });
  s.addText("Di usia 65, cair Rp2,1 M — dan itu cukup", { placeholder: "title" });
  stat(s, "Rp2,1 M", "Dana cair di usia 65", 0.5, 1.4, 3.2, 54, "Dana cair");
  s.addChart(
    pres.charts.BAR,
    [
      { name: "Premi AFP kembali", labels: ["Dana Rp2,1 M"], values: [603.5] },
      { name: "Premi kesehatan 65–84", labels: ["Dana Rp2,1 M"], values: [1482.3] },
      { name: "Sisa", labels: ["Dana Rp2,1 M"], values: [14.2] },
    ],
    {
      x: 0.4, y: 3.0, w: 9.2, h: 1.0, barDir: "bar", barGrouping: "stacked", ...chartText,
      chartColors: [HEX.goldBright, HEX.blue, HEX.gray], showValue: false, catAxisHidden: true, valAxisHidden: true,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 20, valAxisMaxVal: 2100, valAxisMinVal: 0,
      objectName: "Komposisi dana",
    },
  );
  const rows = [
    [FaCheck, "Semua premi AFP kembali", "Rp603,5 jt", HEX.goldBright],
    [FaCheck, "Premi kesehatan usia 65–84", "Rp1.482,3 jt", HEX.blue],
  ];
  for (let i = 0; i < rows.length; i++) {
    const [Ic, t, v, col] = rows[i];
    const y = 1.45 + i * 0.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.2, y: y + 0.12, w: 0.22, h: 0.22, rectRadius: 0.04, fill: { color: col }, line: { type: "none" }, objectName: "Warna " + t });
    s.addText(t, { x: 4.55, y, w: 3.0, h: 0.45, fontSize: 16, color: C.background1, margin: 0, valign: "middle", isTextBox: true, objectName: t });
    s.addText(v, { x: 7.5, y, w: 1.5, h: 0.45, fontSize: 16, bold: true, color: C.accent1, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Nilai " + t });
    s.addImage({ data: await icon(Ic, HEX.goldBright), x: 9.1, y: y + 0.09, w: 0.27, h: 0.27, altText: "Centang", objectName: "Centang " + (i + 1) });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.25, w: 1.9, h: 0.55, rectRadius: 0.27, fill: { color: C.accent1 }, line: { type: "none" }, shadow: shadow(), objectName: "Badge cukup" });
  s.addText("✓  Cukup", { x: 0.5, y: 4.25, w: 1.9, h: 0.55, align: "center", valign: "middle", fontSize: 18, bold: true, color: C.text1, margin: 0, isTextBox: true, objectName: "Teks cukup" });
  s.addText("Rp603,5 jt + Rp1.482,3 jt = Rp2.085,8 jt, masih tersisa ±Rp14 jt", { x: 2.6, y: 4.25, w: 6.9, h: 0.55, fontSize: 14, color: C.background1, margin: 0, valign: "middle", isTextBox: true, objectName: "Perhitungan" });
  s.addNotes("Di usia enam puluh lima, cair dua koma satu miliar. Cukup untuk kembalikan semua premi, dan bayar biaya kesehatan sampai usia delapan puluh empat.");

  /* 6 — Proteksi jiwa */
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Solusi" });
  s.addText("Tetap ada proteksi jiwa hingga Rp3,15 M", { placeholder: "title" });
  const prot = [
    ["Rp2,1 M", "Tahun polis 1–25", "usia 31–55 · 100% Uang Pertanggungan"],
    ["Rp3,15 M", "Tahun polis 26–35", "usia 56–65 · 150% Uang Pertanggungan"],
  ];
  for (let i = 0; i < 2; i++) {
    const x = 0.5 + i * 3.25;
    card(s, x, 1.4, 3.0, 3.3, "Kartu proteksi " + (i + 1));
    await circleIcon(s, i ? FaShieldAlt : FaHeartbeat, x + 0.3, 1.65, 0.75, "Ikon proteksi " + (i + 1));
    s.addText(prot[i][0], { x: x + 0.3, y: 2.6, w: 2.5, h: 0.9, fontFace: THEME.headFontFace, fontSize: 40, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: "Nilai proteksi " + (i + 1) });
    s.addText([{ text: prot[i][1], options: { bold: true, breakLine: true } }, { text: prot[i][2], options: { color: C.accent5 } }], { x: x + 0.3, y: 3.5, w: 2.5, h: 0.9, fontSize: 14, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Keterangan proteksi " + (i + 1) });
  }
  s.addText(
    [
      { text: "Manfaat meninggal dunia", options: { bold: true, color: C.accent1, breakLine: true } },
      { text: "Dibayarkan bila tertanggung meninggal dunia selama masa pertanggungan, sesuai ketentuan polis.", options: { color: C.background1 } },
    ],
    { x: 7.1, y: 1.4, w: 2.4, h: 3.3, fontSize: 14, margin: 0, valign: "middle", isTextBox: true, objectName: "Penjelasan manfaat" },
  );
  s.addNotes("Dan selama itu, kamu tetap punya proteksi jiwa, hingga tiga koma satu lima miliar.");

  /* 7 — Ringkasan angka */
  pres.addSection({ title: "Ringkasan" });
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Ringkasan" });
  s.addText("Ringkasan: kebutuhan vs dana di usia 65", { placeholder: "title" });
  const hdr = (t, al = "left") => ({ text: t, options: { bold: true, color: HEX.bg, fill: { color: HEX.gold }, align: al } });
  const cell = (t, o = {}) => ({ text: t, options: { color: HEX.cream, fill: { color: HEX.navy }, ...o } });
  s.addTable(
    [
      [hdr("Komponen"), hdr("Nilai", "right")],
      [cell("Premi kesehatan usia 65–84 (AHP Premium)"), cell("Rp1.482,3 jt", { align: "right" })],
      [cell("Pengembalian semua premi AFP (5 × Rp120,7 jt)"), cell("Rp603,5 jt", { align: "right" })],
      [cell("Total kebutuhan", { bold: true }), cell("Rp2.085,8 jt", { align: "right", bold: true })],
      [cell("Dana cair AFP di usia 65", { bold: true, color: HEX.goldLight }), cell("Rp2.100,0 jt", { align: "right", bold: true, color: HEX.goldLight })],
      [cell("Sisa"), cell("±Rp14,2 jt", { align: "right" })],
    ],
    { x: 0.5, y: 1.35, w: 6.0, colW: [4.3, 1.7], fontSize: 14, rowH: 0.48, border: { type: "solid", pt: 0.75, color: "1E3557" }, margin: [0, 0.12, 0, 0.12], valign: "middle", objectName: "Tabel ringkasan" },
  );
  card(s, 6.9, 1.35, 2.6, 2.88, "Kartu kesimpulan");
  s.addImage({ data: await icon(FaCheck, HEX.gold), x: 7.15, y: 1.6, w: 0.45, h: 0.45, altText: "Centang", objectName: "Ikon kesimpulan" });
  s.addText([{ text: "Dana cukup", options: { bold: true, fontSize: 20, color: C.accent1, breakLine: true } }, { text: "Biaya kesehatan usia pensiun tertutup, dan semua premi AFP kembali.", options: { fontSize: 14, color: C.background1 } }], { x: 7.15, y: 2.15, w: 2.15, h: 1.9, margin: 0, valign: "top", isTextBox: true, objectName: "Teks kesimpulan" });
  s.addText("Asumsi: pria usia 30, premi AHP Premium tanpa diskon (tabel per 15 Sep 2026), premi dapat berubah", { x: 0.5, y: 4.55, w: 9, h: 0.3, fontSize: 10, color: C.accent5, margin: 0, isTextBox: true, objectName: "Asumsi" });
  s.addNotes("Ringkasan angka untuk diskusi. Tekankan bahwa ini ilustrasi; premi kesehatan dapat berubah sesuai ketentuan polis.");

  /* 8 — Penutup + CTA */
  pres.addSection({ title: "Penutup" });
  s = pres.addSlide({ masterName: "Penutup", sectionTitle: "Penutup" });
  s.addText([{ text: "Pensiun ", options: { color: C.background1 } }, { text: "tenang", options: { color: C.accent1, italic: true } }, { text: ", tanpa jadi beban", options: { color: C.background1 } }], { x: 0.5, y: 0.7, w: 9, h: 0.8, align: "center", fontFace: THEME.headFontFace, fontSize: 36, bold: true, margin: 0, isTextBox: true, objectName: "Judul penutup" });
  s.addText("Mulai siapkan dari sekarang", { x: 0.5, y: 1.5, w: 9, h: 0.5, align: "center", fontSize: 20, color: C.accent2, margin: 0, isTextBox: true, objectName: "Subjudul penutup" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.35, y: 2.35, w: 3.3, h: 0.75, rectRadius: 0.37, fill: { color: C.accent1 }, line: { type: "none" }, shadow: shadow(), objectName: "Tombol komen" });
  s.addImage({ data: await icon(FaRegCommentDots, HEX.bg), x: 3.65, y: 2.5, w: 0.45, h: 0.45, altText: "Ikon komentar", objectName: "Ikon komentar" });
  s.addText([{ text: "Komen ", options: { bold: false } }, { text: "HITUNG", options: { bold: true } }], { x: 4.25, y: 2.35, w: 2.3, h: 0.75, fontSize: 22, color: C.text1, valign: "middle", margin: 0, isTextBox: true, objectName: "Teks tombol komen" });
  card(s, 2.6, 3.4, 4.8, 1.45, "Kartu kontak");
  s.addText("RAYMON", { x: 2.6, y: 3.5, w: 4.8, h: 0.65, align: "center", fontFace: THEME.headFontFace, fontSize: 32, bold: true, color: C.background1, charSpacing: 6, margin: 0, isTextBox: true, objectName: "Nama" });
  s.addImage({ data: await icon(FaPhoneAlt, HEX.gold), x: 3.75, y: 4.25, w: 0.35, h: 0.35, altText: "Ikon telepon", objectName: "Ikon telepon" });
  s.addText("0812 8909 0202", { x: 4.2, y: 4.15, w: 3.0, h: 0.55, fontSize: 24, bold: true, color: C.accent1, margin: 0, valign: "middle", isTextBox: true, objectName: "Nomor telepon" });
  s.addNotes("Pensiun tenang, tanpa jadi beban. Mulai siapkan dari sekarang. Komen, hitung, atau hubungi Raymon.");

  /* 9 — Video */
  s = pres.addSlide({ masterName: "Konten", sectionTitle: "Penutup" });
  s.addText("Video ringkasan (65 detik)", { placeholder: "title" });
  const vh = 3.75, vw = (vh * 9) / 16;
  s.addMedia({ type: "video", path: VIDEO, cover: "image/png;base64," + fs.readFileSync(POSTER).toString("base64"), x: 0.9, y: 1.25, w: vw, h: vh, objectName: "Video AHP Pensiun" });
  await circleIcon(s, FaPlayCircle, 3.6, 1.45, 0.7, "Ikon putar");
  s.addText(
    [
      { text: "Klik video untuk memutar", options: { bold: true, color: C.accent1, breakLine: true } },
      { text: "Format vertikal 9:16 untuk Reels, TikTok, dan Shorts. Voiceover, animasi, dan musik sudah lengkap.", options: { color: C.background1 } },
    ],
    { x: 4.5, y: 1.4, w: 5.0, h: 1.2, fontSize: 16, margin: 0, valign: "top", isTextBox: true, objectName: "Petunjuk video" },
  );
  s.addNotes("Putar video ringkasan 65 detik di akhir presentasi.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
