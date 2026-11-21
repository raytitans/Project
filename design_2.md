# design_2.md: Gaya "Ledger Green"

Panduan gaya video vertikal untuk Remotion, dibedah dari video referensi edukasi asuransi jiwa ("life insurance series", 8 bagian, 104 detik).
Tampilannya bersih seperti aplikasi fintech: scene **gelap dan terang bergantian**, aksen **hijau mint**, judul diketik (typewriter) dengan subjudul **serif italic**, caption berbentuk pill dengan efek karaoke blur, dan objek 3D yang muncul dari blur. Cocok untuk konten edukasi angka/finansial (AXA, produk digital), dan bisa diganti warnanya untuk Livya Kitchen.

> Semua angka di bawah diukur dari video (piksel, kecerahan per frame, dan analisis audio). Yang berlabel *(perkiraan)* adalah hasil pengamatan visual, bukan pengukuran.

---

## 1. Spesifikasi teknis

| | Referensi | Untuk proyek Anda |
|---|---|---|
| Resolusi | 720 × 1280 | **1080 × 1920** (semua ukuran di bawah sudah dikali 1,5) |
| FPS | 30 | **30** |
| Durasi | 104,2 dtk (8 segmen) | 30–90 dtk (4–8 segmen) |
| Audio | AAC 44,1 kHz | VO + musik latar (+ SFX halus) |

---

## 2. Warna

Ada dua tema yang dipakai bergantian per segmen. Aksen hijau tetap sama di kedua tema.

### Tema gelap (`dark`)
| Token | Hex | Dipakai untuk |
|---|---|---|
| `bg` | `#000000` | Background (hitam murni) |
| `bgSoft` | `#050505` | Background scene spotlight |
| `surface` | `#0B0D0D` | Kartu, baris checklist, pill caption |
| `surfaceChip` | `#191E1D` | Chip tidak aktif ("usia 35") |
| `border` | `#2E2E2E` | Garis tepi kartu dan pill (1,5 px) |
| `text` | `#FFFFFF` | Judul dan caption |
| `textMuted` | `#B3B6B6` | Header / footer |
| `textFaint` | `#8C8F8F` | Disclaimer kecil |
| `glow` | `#338B47` | Pusat glow hijau di bawah layar |
| `glowMid` | `#13431F` | Tepi glow hijau |

### Tema terang (`light`)
| Token | Hex | Dipakai untuk |
|---|---|---|
| `bg` | `#F7F8FD` | Background (tengah) |
| `bgTop` / `bgBottom` | `#FAF9FC` / `#F2F3F8` | Gradasi vertikal sangat halus |
| `surface` | `#FDFDFD` | Kartu putih + bayangan lembut |
| `divider` | `#E4E5E8` | Garis pemisah di kartu |
| `text` | `#060708` | Judul dan caption (hampir hitam) |
| `textSerif` | `#3A3D3F` | Subjudul serif abu-abu gelap |
| `textMuted` | `#515655` | Header / footer |

### Aksen (dipakai di kedua tema)
| Token | Hex | Dipakai untuk |
|---|---|---|
| `green` | **`#42C28E`** | Chip aktif, tombol CTA (`#52BF91` saat ada glow) |
| `greenSerif` | `#5CC794` (gelap) / `#3BAD7E` (terang) | Subjudul serif positif ("asuransi jiwa: cash liquid") |
| `greenLine` | `#5CC295` | Garis vertikal + titik di kiri judul, kursor ketik |
| `greenCheck` | `#25C58C` | Ikon centang bulat |
| `greenCard` | `#4DCE9D` → `#17A96F` | Kartu hijau gradasi ("Rp1 M") |
| `greenStamp` | `#21AB5F` | Stempel "APPROVED", banner "TOTAL KLAIM" |
| `coral` | `#C9817D` | Subjudul serif negatif ("dibekukan bank…") |
| `red` | `#DB7166` | Angka biaya/kerugian ("±Rp250 jt"), stempel "DIBEKUKAN" (`#D6726C`) |
| `navyCard` | `#1E3458` | Kartu rekening (objek fisik) |
| `tape` | `#F2C230` *(perkiraan)* | Pita kuning "DIBIARKAN" |
| `lamp` | `#FEF9E3` | Lampu sorot (inti) |
| `cone` | `#8A857E` | Kerucut cahaya (kuning hangat yang pudar) |
| `pedestal` | `#282722` | Alas objek di scene spotlight |

**Aturan warna**
- **Gelap ↔ terang bergantian setiap segmen.** Segmen "masalah" gelap, segmen "solusi/data" terang, dan penutup gelap.
- **Hijau = solusi / positif** (centang, manfaat, CTA). **Coral/merah = masalah / biaya** (dibekukan, ±Rp250 jt). Jangan pakai keduanya di subjudul yang sama.
- Glow hijau di bawah layar **hanya di tema gelap** dan hanya di segmen yang sudah mengarah ke solusi (04, 06).
- Objek nyata (rumah, bank, mobil, uang) tampil dengan warna aslinya; UI-nya tetap monokrom + hijau.

---

## 3. Tipografi

Tiga peran font. Nama font adalah *(perkiraan)* berdasarkan bentuk huruf; semuanya ada di Google Fonts.

| Peran | Font | Ukuran @1080 | Weight | Contoh |
|---|---|---|---|---|
| Judul | **Inter** (alternatif: Plus Jakarta Sans) | 72 px | 500 Medium | "2. Deposito Rp10 M?" |
| Subjudul aksen | **Instrument Serif Italic** | 60 px | 400 | *dibekukan bank terlebih dahulu.* |
| Caption pill | Inter | 34 px | 600 SemiBold | "Bank akan membekukan deposito" |
| Header / footer | Inter | 26 px / 28 px | 400 | "life insurance series", "03 / 08", "@handle" |
| Label kartu kecil | Inter, huruf kapital | 16 px, letter-spacing 0,12em | 600 | "REKENING DEPOSITO" |
| Angka di kartu | Inter `tabular-nums` | 30–48 px | 700 | "Rp1 M", "±Rp250 jt" |
| Disclaimer | Inter | 17 px | 400 | "*ilustrasi · tarif bisa berbeda per daerah" |

**Ciri khas teks**
1. **Judul diketik** huruf per huruf (±1 huruf/frame) dengan **kursor hijau** di ujungnya. Subjudul serif ikut diketik, mulai ±6 frame setelah judul.
2. Judul selalu **kiri atas** (x = 105, y = 230), dengan **garis hijau vertikal + titik** di kirinya (x = 58, tinggi ±230 px).
3. Caption **satu frasa per pill**, rata tengah di y ≈ 1150 (60% tinggi layar). Kata yang belum diucapkan sudah tampak tapi **blur + transparan**; kata yang diucapkan menjadi tajam (efek karaoke).
4. Nomor list ("1.", "2.") dipakai untuk menyusun argumen per segmen.
5. Header (judul seri + "03 / 08") dan footer (handle + hashtag) **tetap diam**, tidak ikut animasi.

Instal font di Remotion:
```bash
npm i @remotion/google-fonts
```
```ts
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
export const SANS = loadInter().fontFamily;
export const SERIF = loadSerif("italic").fontFamily;
```

---

## 4. Tata letak (grid @1080 × 1920)

```
┌──────────────────────────────────────┐ y 88   header: seri (kiri) · "03 / 08" (kanan), margin x 80
│ ●                                     │
│ │  Judul ketik 72px                    │ y 230
│ │  subjudul serif italic 60px          │ y 330
│                                        │
│        [ objek utama / kartu ]         │ y 480–900  (lebar 840)
│        [ kartu data / checklist ]      │ y 840–1050
│                                        │
│          ( caption pill )              │ y 1150
│        *disclaimer kecil 17px          │ y 1300
│                                        │
│  ░░░░░ glow hijau (tema gelap) ░░░░░  │ y 1500–1920
│ @handle                     #hashtag   │ y 1857 footer
└──────────────────────────────────────┘
```

- Margin samping **80 px**; kartu lebar **840–870 px**, radius **28 px**.
- Pill caption: tinggi 78 px, padding 0 36 px, radius penuh, border 1,5 px.
- Satu scene = **1 judul + 1 objek utama + 1 kartu data + 1 pill**. Jangan lebih.

---

## 5. Ritme dan struktur

Diukur dari perubahan kecerahan per frame. Setiap pergantian segmen adalah pergantian tema.

| Segmen | Waktu | Durasi | Tema | Isi | Transisi masuk |
|---|---|---|---|---|---|
| 01 Hook | 0,0–7,0 | 7,0 dtk | Gelap + spotlight | "Asset Rp16 miliar *buat keluarga & anak?*" + 3 objek di bawah lampu sorot | — |
| 02 Masalah | 7,0–18,9 | 11,9 dtk | Gelap + spotlight | "Apalagi kalau kamu *sudah tiada…*" + gembok di tiap objek → "Rp0" | **Flash putih** |
| 03 Poin 1 | 18,9–35,0 | 16,1 dtk | Terang | "1. Asset rumah Rp5 M" + kartu biaya + pita "DIBIARKAN" | Blur-dissolve |
| 04 Poin 2 | 35,0–53,8 | 18,8 dtk | Gelap + glow | "2. Deposito Rp10 M?" + kartu rekening + stempel + checklist | Blur-dissolve |
| 05 Solusi | 53,8–68,0 | 14,2 dtk | Terang | "That's why minimal punya *asuransi jiwa*" + banner hijau + 4 centang | Blur-dissolve |
| 06 Angka | 68,0–82,7 | 14,7 dtk | Gelap + glow | "Pria 30 · ±Rp155 rb/hari" + 2 kartu (hijau vs gelap) | Blur-dissolve |
| 07 Bukti | 82,7–93,0 | 10,3 dtk | Terang | "Jangankan 1 M, 40 M pun…" + dokumen klaim + stempel | Blur-dissolve |
| 08 CTA | 93,0–104,2 | 11,2 dtk | Gelap + hujan uang | "Keluarga tenang & rukun." + kartu profil + chip usia + tombol DM | Blur-dissolve |

**Aturan ritme**
- Segmen **10–19 detik** (rata-rata 13 dtk), panjangnya mengikuti VO. Penanda "0X / 08" naik setiap segmen.
- Di dalam segmen, **pill caption berganti setiap 1,5–2,5 dtk** dan **elemen baru masuk setiap ±2–3 dtk** (stempel, baris checklist, kartu kedua). Layar tidak boleh "kosong" lebih dari 3 detik.
- Transisi segmen hanya **9–10 frame (0,3 dtk)**. Flash putih hanya sekali, di pergantian hook → masalah.
- Pola naskah: **Hook angka besar → "apalagi kalau…" (masalah emosional) → poin 1 & 2 dengan biaya nyata → "That's why…" (solusi) → hitungan premi per hari → bukti klaim → penutup emosional + CTA DM kata kunci**.

---

## 6. Transisi

### A. Blur-dissolve tema (dipakai 6×)
Scene lama **blur dan memudar**, scene baru **muncul dari blur**, dan warna background bergeser gelap ↔ terang.

| Parameter | Nilai |
|---|---|
| Durasi | **10 frame** (gelap → terang), **9 frame** (terang → gelap) |
| Blur | 0 → **24 px** (puncak di tengah) → 0 |
| Kurva | S-curve (ease-in-out): kecerahan terukur 39 → 47 → 59 → 77 → 103 → 138 → 170 → 192 → 208 → 217 |
| Judul baru | Langsung mulai diketik di frame terakhir transisi |

### B. Flash putih (dipakai 1×, pindah babak)
Frame 1: **langsung putih** (kecerahan 36 → 205), lalu **turun linear selama 14 frame** kembali ke gelap. Selama memudar, gambar terlihat abu-abu pucat (desaturasi), lalu warnanya kembali. Musik ikut "teredam" sekitar 0,4 dtk.

### C. Masuk objek
- **Blur-in**: blur 20 → 0 px, scale 0,92 → 1, opacity 0 → 1, selama **12–15 frame** (ease-out).
- **Stempel** ("DIBEKUKAN", "APPROVED"): scale 1,6 → 1 dengan overshoot (spring), rotasi −8°, opacity 0 → 1 dalam 8 frame.
- **Checklist / baris**: muncul satu per satu dengan selang **±20–30 frame**, masing-masing slide-up 24 px + fade.
- **Pita kuning**: masuk menyapu dari kiri ke kanan (clip-path), rotasi −6°, 12 frame.
- **Kartu hijau**: blur-in + scale; kartu kedua menyusul dari kanan.
- **Hujan uang** (segmen 08): lembaran uang jatuh dengan rotasi 3D acak dan motion blur, terus-menerus sampai akhir.

---

## 7. Gerakan kamera

Kamera hampir diam. Ini gaya "UI/infografis", bukan sinematik.

1. **Push-in sangat pelan**: layer konten zoom 1,00 → **1,03** sepanjang segmen (titik pusat di tengah atas, jadi judul tampak naik sedikit). Header/footer **tidak ikut**.
2. **Lampu sorot** (segmen 01–02): cahaya kerucut sedikit "bernapas" (opacity 0,9 ↔ 1, siklus 3 dtk).
3. **Objek melayang**: ikon 3D kecil (dompet, kalkulator, gembok) melayang naik-turun ±6 px, siklus 2,5 dtk.
4. Tidak ada whip pan, tidak ada rotasi kamera, dan tidak ada hard cut.

---

## 8. Easing dan spring

| Nama | Kurva | Dipakai untuk |
|---|---|---|
| `EASE.out` | `bezier(0.22, 1, 0.36, 1)` (≈ easeOutQuint) | Blur-in objek, slide-up baris |
| `EASE.inOut` | `bezier(0.65, 0, 0.35, 1)` (≈ easeInOutCubic) | Transisi blur-dissolve |
| `EASE.linear` | linear | Pengetikan, fade flash putih |
| `EASE.breath` | `sin` | Lampu sorot, objek melayang |
| `SPRING.stamp` | damping 11, stiffness 220, mass 0,7 | Stempel, centang, chip aktif |
| `SPRING.card` | damping 18, stiffness 140, mass 1 | Kartu masuk |

**Kursor ketik**: kedip 15 frame nyala / 15 frame mati; selama mengetik selalu menyala.

---

## 9. Audio dan SFX

> Audio referensi sudah tercampur, jadi bagian ini hasil analisis level dan onset (bukan daftar file asli).

- **Voiceover**: bahasa Indonesia campur Inggris ("That's why"), gaya ngobrol santai, tempo sedang-cepat. Caption pill mengikuti VO kata per kata. VO langsung mulai di 0,18 dtk (tanpa intro).
- **Musik**: bed lembut yang **jalan terus** dari awal sampai akhir. Rata-rata ±−25 dBFS saat VO diam, sedangkan VO memuncak di −10 sampai −12 dBFS, jadi musik **±13–15 dB di bawah VO**.
- **SFX**: **tidak terdeteksi SFX yang menonjol**. Hampir semua onset adalah suku kata VO. Yang terukur:
  - Saat flash putih (7,0 dtk) frekuensi tinggi musik hilang ±0,4 dtk, yaitu efek **low-pass / duck sesaat**.
  - Transisi blur-dissolve tidak memakai whoosh yang terdengar jelas.

Jadi gayanya adalah **"VO-first"**: suara bersih, efek minimal. Kalau mau sedikit SFX, pakai versi halus ini:

| Momen | SFX (opsional) | Volume |
|---|---|---|
| Flash putih | Low-pass sweep / "riser terbalik" pendek | −12 dB |
| Blur-dissolve | Air whoosh sangat halus (200 ms) | −20 dB |
| Pengetikan judul | Tik keyboard lembut (acak, 1 per 2–3 huruf) | −24 dB |
| Stempel | Thud kertas / stamp | −10 dB |
| Centang / chip aktif | UI click / soft pop | −16 dB |
| Hujan uang | Kertas berdesir (loop) | −22 dB |

```tsx
import { Audio, Sequence, staticFile, interpolate } from "remotion";
// Musik: jalan terus, fade-in 10 frame, fade-out 30 frame
<Audio src={staticFile("music.wav")}
  volume={(f) => interpolate(f, [0, 10, total - 30, total], [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
<Sequence from={stampFrame}><Audio src={staticFile("sfx/stamp.wav")} volume={0.3} /></Sequence>
```

---

## 10. Kode siap pakai

Salin blok ini ke `src/ledger/` (misalnya `tokens.ts` dan `components.tsx`). Ukuran sudah untuk 1080 × 1920 @ 30 fps.

### `tokens.ts`
```ts
import { Easing } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

export const SANS = loadInter().fontFamily;
export const SERIF = loadSerif("italic").fontFamily;

export const THEME = {
  dark: {
    bg: "#000000", surface: "#0B0D0D", chip: "#191E1D", border: "#2E2E2E",
    text: "#FFFFFF", muted: "#B3B6B6", faint: "#8C8F8F", serif: "#5CC794",
    glow: "#338B47", glowMid: "#13431F",
  },
  light: {
    bg: "#F7F8FD", bgTop: "#FAF9FC", bgBottom: "#F2F3F8", surface: "#FDFDFD",
    chip: "#EEF0F3", border: "#E4E5E8", text: "#060708", muted: "#515655",
    faint: "#9A9EA3", serif: "#3BAD7E",
  },
} as const;
export type ThemeName = keyof typeof THEME;

export const ACCENT = {
  green: "#42C28E", greenLine: "#5CC295", check: "#25C58C",
  cardFrom: "#4DCE9D", cardTo: "#17A96F", stamp: "#21AB5F",
  coral: "#C9817D", red: "#DB7166", navy: "#1E3458", tape: "#F2C230",
  lamp: "#FEF9E3", cone: "#8A857E", pedestal: "#282722",
};

export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  linear: Easing.linear,
};
export const SPRING = {
  stamp: { damping: 11, stiffness: 220, mass: 0.7 },
  card: { damping: 18, stiffness: 140, mass: 1 },
};
export const TIMING = {
  dissolve: 10,     // frame transisi blur antar-segmen
  flash: 14,        // frame fade flash putih
  blurIn: 14,       // frame objek muncul dari blur
  charsPerFrame: 1, // kecepatan ketik
  serifDelay: 6,    // subjudul mulai diketik sekian frame setelah judul
  rowGap: 24,       // jeda antar baris checklist
};
```

### `components.tsx`
```tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, EASE, SANS, SERIF, SPRING, THEME, ThemeName, TIMING } from "./tokens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Background per tema + glow hijau (gelap) + header/footer diam */
export const Frame: React.FC<{
  theme: ThemeName; index: number; total: number; series?: string;
  handle: string; hashtag: string; glow?: boolean; children: React.ReactNode;
}> = ({ theme, index, total, series = "life insurance series", handle, hashtag, glow = true, children }) => {
  const t = THEME[theme];
  const bg = theme === "light"
    ? `linear-gradient(180deg, ${THEME.light.bgTop}, ${THEME.light.bgBottom})`
    : t.bg;
  const chrome: React.CSSProperties = { position: "absolute", left: 80, right: 80, display: "flex",
    justifyContent: "space-between", fontFamily: SANS, color: t.muted, letterSpacing: "0.01em" };
  return (
    <AbsoluteFill style={{ background: bg }}>
      {theme === "dark" && glow && (
        <AbsoluteFill style={{ background: `radial-gradient(70% 28% at 50% 100%, ${THEME.dark.glow} 0%, ${THEME.dark.glowMid} 45%, transparent 100%)` }} />
      )}
      {children}
      <div style={{ ...chrome, top: 70, fontSize: 26 }}>
        <span>{series}</span><span>{String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <div style={{ ...chrome, bottom: 40, fontSize: 28 }}><span>{handle}</span><span>{hashtag}</span></div>
    </AbsoluteFill>
  );
};

/** Layer konten dengan push-in pelan 1 -> 1.03 */
export const Drift: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, duration], [1, 1.03], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 25%" }}>{children}</AbsoluteFill>;
};

const Typed: React.FC<{ text: string; start: number; style: React.CSSProperties }> = ({ text, start, style }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - start) * TIMING.charsPerFrame));
  const typing = n > 0 && n < text.length;
  const cursorOn = f >= start && (typing || Math.floor(f / 15) % 2 === 0);
  return (
    <div style={style}>
      {text.slice(0, n)}
      {cursorOn && <span style={{ display: "inline-block", width: 4, height: "0.95em", marginLeft: 4,
        verticalAlign: "-0.1em", background: ACCENT.greenLine }} />}
    </div>
  );
};

/** Judul ketik + subjudul serif + garis hijau vertikal */
export const TitleBlock: React.FC<{
  theme: ThemeName; title: string; serif?: string; tone?: "positive" | "negative" | "neutral"; start?: number;
}> = ({ theme, title, serif, tone = "neutral", start = 0 }) => {
  const t = THEME[theme];
  const serifColor = tone === "positive" ? t.serif : tone === "negative" ? ACCENT.coral : theme === "dark" ? "#E9E9E9" : "#3A3D3F";
  const titleDone = start + title.length / TIMING.charsPerFrame;
  return (
    <div style={{ position: "absolute", left: 58, top: 195, right: 60 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: 230, background: `linear-gradient(${ACCENT.greenLine}, ${ACCENT.greenLine}55)` }} />
      <div style={{ position: "absolute", left: -5, top: 20, width: 13, height: 13, borderRadius: 7, background: ACCENT.greenLine }} />
      <div style={{ paddingLeft: 47, paddingTop: 30 }}>
        <Typed text={title} start={start} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 72, color: t.text, lineHeight: 1.15 }} />
        {serif && <Typed text={serif} start={Math.min(titleDone, start + TIMING.serifDelay + title.length * 0.6)}
          style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: serifColor, marginTop: 12, lineHeight: 1.1 }} />}
      </div>
    </div>
  );
};

/** Pill caption karaoke: kata yang belum diucapkan tampak blur */
export type CapWord = { w: string; at: number }; // at = frame relatif saat kata diucapkan
export const CaptionPill: React.FC<{ theme: ThemeName; words: CapWord[]; from: number; to: number; y?: number }> = ({ theme, words, from, to, y = 1150 }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const t = THEME[theme];
  const appear = interpolate(f, [from, from + 6], [0, 1], { ...clamp, easing: EASE.out });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center",
      opacity: appear, transform: `translateY(${(1 - appear) * 12}px)` }}>
      <div style={{ height: 78, padding: "0 36px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12,
        background: t.surface, border: `1.5px solid ${t.border}`,
        boxShadow: theme === "light" ? "0 10px 30px rgba(20,30,40,0.08)" : "none",
        fontFamily: SANS, fontWeight: 600, fontSize: 34, color: t.text }}>
        {words.map((x, i) => {
          const k = interpolate(f, [from + x.at - 2, from + x.at + 3], [0, 1], clamp);
          return <span key={i} style={{ filter: `blur(${(1 - k) * 7}px)`, opacity: 0.35 + 0.65 * k }}>{x.w}</span>;
        })}
      </div>
    </div>
  );
};

/** Objek muncul dari blur */
export const BlurIn: React.FC<{ start: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ start, dur = TIMING.blurIn, style, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: EASE.out });
  return <div style={{ ...style, opacity: p, filter: `blur(${(1 - p) * 20}px)`, transform: `${style?.transform ?? ""} scale(${0.92 + 0.08 * p})` }}>{children}</div>;
};

/** Stempel pop (DIBEKUKAN / APPROVED) */
export const Stamp: React.FC<{ start: number; label: string; color?: string; rotate?: number; style?: React.CSSProperties }> = ({ start, label, color = ACCENT.red, rotate = -8, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - start, fps, config: SPRING.stamp });
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", ...style, transform: `rotate(${rotate}deg) scale(${1.6 - 0.6 * s})`, opacity: Math.min(1, s * 1.5),
      padding: "8px 22px", border: `4px solid ${color}`, borderRadius: 10, color, background: "rgba(255,255,255,0.92)",
      fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: "0.12em" }}>{label}</div>
  );
};

/** Baris checklist (nomor atau centang) yang masuk berurutan */
export const ChecklistRow: React.FC<{ theme: ThemeName; start: number; label: string; num?: number; check?: boolean }> = ({ theme, start, label, num, check }) => {
  const f = useCurrentFrame(); const t = THEME[theme];
  const p = interpolate(f, [start, start + 10], [0, 1], { ...clamp, easing: EASE.out });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, width: 870, height: 72, borderRadius: 20,
      background: t.surface, border: `1.5px solid ${t.border}`, display: "flex", alignItems: "center", gap: 22, padding: "0 26px",
      fontFamily: SANS, fontWeight: 600, fontSize: 28, color: t.text }}>
      {check
        ? <div style={{ width: 44, height: 44, borderRadius: 22, background: ACCENT.check, color: "#fff", display: "grid", placeItems: "center", fontSize: 28 }}>✓</div>
        : <div style={{ width: 40, height: 40, borderRadius: 20, border: `2px solid ${ACCENT.green}`, color: ACCENT.green, display: "grid", placeItems: "center", fontSize: 22 }}>{num}</div>}
      {label}
    </div>
  );
};

/** Pembungkus segmen dengan transisi blur-dissolve atau flash putih */
export const Segment: React.FC<{ duration: number; enter?: "dissolve" | "flash" | "none"; exit?: boolean; children: React.ReactNode }> = ({ duration, enter = "dissolve", exit = true, children }) => {
  const f = useCurrentFrame(); const D = TIMING.dissolve;
  let blur = 0, opacity = 1, flash = 0, sat = 1;
  if (enter === "dissolve") {
    const p = interpolate(f, [0, D], [0, 1], { ...clamp, easing: EASE.inOut });
    blur += (1 - p) * 24; opacity *= p;
  }
  if (enter === "flash") {
    flash = interpolate(f, [0, TIMING.flash], [0.8, 0], clamp);
    sat = interpolate(f, [0, TIMING.flash], [0, 1], clamp);
  }
  if (exit) {
    const q = interpolate(f, [duration - D, duration], [0, 1], { ...clamp, easing: EASE.inOut });
    blur += q * 24; opacity *= 1 - q;
  }
  return (
    <AbsoluteFill style={{ opacity, filter: `blur(${blur}px) saturate(${sat})` }}>
      {children}
      {flash > 0 && <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />}
    </AbsoluteFill>
  );
};
```

### Contoh pemakaian (1 segmen)
```tsx
import { Sequence } from "remotion";
import { Frame, Drift, TitleBlock, CaptionPill, BlurIn, Stamp, ChecklistRow, Segment } from "./ledger/components";
import { TIMING } from "./ledger/tokens";

const D = TIMING.dissolve;
const BRAND = { handle: "@akunanda", hashtag: "#hashtaganda", total: 6 };

// Segmen 2 dimulai D frame sebelum segmen 1 selesai (overlap)
<Sequence from={300 - D} durationInFrames={420}>
  <Segment duration={420}>
    <Frame theme="dark" index={2} {...BRAND}>
      <Drift duration={420}>
        <TitleBlock theme="dark" title="2. Deposito Rp10 M?" serif="dibekukan bank terlebih dahulu." tone="negative" start={D} />
        <BlurIn start={D + 10} style={{ position: "absolute", left: 140, top: 480 }}>
          <div style={{ width: 760, height: 300, borderRadius: 28, background: "#1E3458" }} />{/* ganti: kartu rekening */}
        </BlurIn>
        <Stamp start={90} label="DIBEKUKAN" style={{ left: 500, top: 700 }} />
        <div style={{ position: "absolute", top: 860, left: 105, display: "flex", flexDirection: "column", gap: 14 }}>
          <ChecklistRow theme="dark" start={150} num={1} label="Surat keterangan ahli waris" />
          <ChecklistRow theme="dark" start={180} num={2} label="Biaya notaris" />
          <ChecklistRow theme="dark" start={210} num={3} label="Kadang sampai pengadilan" />
        </div>
      </Drift>
      <CaptionPill theme="dark" from={20} to={80} words={[{ w: "Bank", at: 0 }, { w: "akan", at: 8 }, { w: "membekukan", at: 14 }, { w: "deposito", at: 30 }]} />
    </Frame>
  </Segment>
</Sequence>
```

Aturan: segmen berikutnya mulai **`D` frame sebelum** segmen sebelumnya selesai, tema harus **berselang-seling**, dan hanya segmen ke-2 yang memakai `enter="flash"`. Header/footer sengaja ditaruh di `Frame` (di luar `Drift`) supaya diam, tetapi tetap ikut blur saat transisi seperti di referensi.

**Sinkron caption dengan VO**: pakai alur yang sama seperti `design.md` bagian 12 (ElevenLabs → timestamp per kata → `at` di `CaptionPill`).

---

## 11. Checklist sebelum render

- [ ] Tema gelap/terang bergantian tiap segmen; glow hijau hanya di tema gelap
- [ ] Hijau untuk solusi, coral/merah untuk masalah; tidak dicampur di satu subjudul
- [ ] Judul diketik dengan kursor hijau, dan garis + titik hijau ada di kiri
- [ ] Caption pill karaoke (kata berikutnya blur) dan sinkron dengan VO
- [ ] Header "0X / 0N" dan footer handle/hashtag diam
- [ ] Transisi blur-dissolve 9–10 frame; flash putih hanya sekali
- [ ] Ada elemen baru setiap 2–3 detik (stempel, baris, kartu)
- [ ] Ada disclaimer kecil di bawah pill untuk angka/ilustrasi
- [ ] Musik bed ±13–15 dB di bawah VO; SFX minimal
- [ ] Penutup: kartu profil + pilihan (chip) + tombol CTA hijau "DM 'KATA' ke @akun"

---

## 12. Adaptasi cepat untuk bisnis Anda

| Bisnis | Seri / header | Hook (segmen 01) | Poin masalah | Solusi hijau | CTA |
|---|---|---|---|---|---|
| AXA (asuransi) | "health insurance series" | "Tabungan Rp200 jt *cukup buat rawat inap?*" | 1. Biaya ICU / hari, 2. Kamar naik kelas | "That's why minimal punya *asuransi kesehatan*" | DM "CEK" + chip usia |
| Livya Kitchen | "dapur livya series" | "Masak sendiri tiap hari *beneran lebih hemat?*" | 1. Belanja + gas, 2. Waktu 2 jam | "Makanya ada *Livya Kitchen*" | DM "MENU" + chip paket |
| Produk digital | "creator toolkit series" | "100 konten sebulan *tanpa tim?*" | 1. Ide habis, 2. Editing lama | "Pakai *template siap edit*" | DM "TEMPLATE" |

> **AXA**: referensi ini menampilkan bukti klaim dan nama perusahaan asuransi lain. Untuk konten Anda, pakai data dan materi resmi AXA yang boleh dipublikasikan, samarkan data nasabah, dan selalu sertakan disclaimer ("*ilustrasi · manfaat sesuai ketentuan polis*"), sama seperti referensinya.
>
> **Livya Kitchen**: ganti `ACCENT.green*` dengan warna brand (misalnya oranye `#F08A3C`). Seluruh gaya lain tetap sama.
