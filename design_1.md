# design_1.md — "Crimson Brand Reel" Style Guide untuk Remotion

> Sumber analisis: video referensi vertikal 720×1280, 29.97 fps, 50 detik (brand-agency showreel: *"Every Brand Starts as a Blank Space → Clarity → Brands Come Alive → Results → Make Your Brand MOVE"*).
> Gaya: **kinetic typography + UI-mockup motion**, merah-hitam pekat dengan selingan "flash" putih, ritme cepat, setiap aksi visual dikunci ke hit SFX.
> Pakai file ini sebagai **design system** yang bisa dipakai ulang untuk konten apa pun (Livya Kitchen, AXA, produk digital), cukup ganti teks, ikon, dan logo.

---

## 0. Ringkasan DNA Gaya (TL;DR)

| Elemen | Nilai |
|---|---|
| Format | 1080×1920 (9:16), **30 fps** |
| Mood | Bold, premium, agresif, "agency" |
| Palet | Merah crimson + hitam (gradient mesh bergerak) ↔ putih bersih |
| Font | **Poppins** (SemiBold / Bold / ExtraBold / Bold Italic) |
| Durasi per scene | 1.0 – 2.5 detik (rata-rata ±1.7 dtk) |
| Grid ritme | ±120 BPM → **1 beat = 15 frame**, aksen kuat tiap 30 frame |
| Easing utama | Expo-out cepat + spring dengan sedikit overshoot |
| Transisi khas | Liquid wave wipe, tilted card slide, blur swap, hard cut on beat, panel drop |
| Kamera | Virtual: slow push-in 3–6%, zoom-out reveal, parallax 2 layer, micro-shake saat impact |
| SFX | Whoosh, mouse click, pop/bubble, UI tick, riser, impact/boom, glitch, trash drop |

---

## 1. Warna & Kode Hex

Diambil langsung dari piksel frame (bukan perkiraan visual).

### 1.1 Palet Inti

| Token | Hex | Peran |
|---|---|---|
| `crimsonBright` | `#C50003` | Highlight terang di gradient (titik "cahaya") |
| `crimson` | `#AB0003` | Merah utama gradient |
| `brandRed` | `#910102` | Merah solid UI: kotak "Clarity", teks merah di bg putih |
| `crimsonDeep` | `#860003` | Mid-tone gradient |
| `maroon` | `#650001` | Bayangan gradient |
| `oxblood` | `#520001` | Bayangan dalam |
| `nearBlack` | `#210000` | Area tergelap gradient (hitam kemerahan, **bukan** #000) |
| `white` | `#FFFFFF` | Flash scene, teks di atas merah, pill, wave |
| `offWhite` | `#E3DDDD` | Shadow lembut di card/pill putih |
| `pinkMist` | `#D1A8AB` | Glow/feather di tepi wave putih & icon glass |
| `rosyGrey` | `#B7989A` | Highlight kaca pada lingkaran ikon |
| `charcoal` | `#4A4A4A` | Teks abu-abu ("Blank Space", logo outro) |
| `mutedGrey` | `#8A8A8A` | Teks sekunder outro ("Designs") |

### 1.2 Warna Latar "Client Card" (opsional, untuk segmen portofolio/logo)
Di referensi, setiap logo klien muncul di bidang warna khas brand-nya — tiru polanya dengan warna brand Anda sendiri:

| Contoh | Hex |
|---|---|
| Navy | `#0A2339` |
| Teal | `#125D69` |
| Light grey | `#EDEBEC` |
| Pure black | `#000000` |

### 1.3 Aturan Pemakaian
- **70%** durasi di latar gradient merah-hitam, **25%** flash putih, **5%** warna client card.
- Di latar merah → teks **putih**. Di latar putih → teks **`#910102`** (kata kunci Bold) + kata pengantar Medium/Regular warna sama.
- Tidak pernah memakai gradient linear biasa: latar merah selalu **mesh/blob radial yang bergerak** (lihat §6.1).

```ts
// theme.ts
export const C = {
  crimsonBright: '#C50003',
  crimson: '#AB0003',
  brandRed: '#910102',
  crimsonDeep: '#860003',
  maroon: '#650001',
  oxblood: '#520001',
  nearBlack: '#210000',
  white: '#FFFFFF',
  offWhite: '#E3DDDD',
  pinkMist: '#D1A8AB',
  rosyGrey: '#B7989A',
  charcoal: '#4A4A4A',
  mutedGrey: '#8A8A8A',
} as const;
```

---

## 2. Tipografi

**Font: Poppins** (geometric sans — terlihat dari "y", "g", "a" dan titik bulat). Untuk wordmark outro tampak Montserrat/Poppins ExtraBold + Light.

| Peran | Weight | Ukuran @1080w | Contoh di referensi |
|---|---|---|---|
| Hero 1 kata | 800 ExtraBold | 300–360 px, line-height 0.85, tracking -2% | "MO / VE" |
| Headline besar | 700 Bold | 110–150 px | "BRANDS", "WORLDWIDE" |
| Headline 2 kata | 600 + 700 | 60–75 px | "More **Trust**", "Make Your **Brand**" |
| Statement | 600 SemiBold | 60–70 px | "This is where", "Come alive" |
| Kata highlight | 700 Bold *Italic* | 55–75 px | "*Starts*", "*Enters*", "*impressions*" |
| Angka statistik | 700 Bold | 80–95 px | "+2500", "+10000" |
| Label stat | 600 SemiBold Italic | 40–45 px | "*Followers*" |
| Pill UI | 600 SemiBold | 30–36 px | "Unclear Message" |
| Caption ikon | 500 Medium | 22–26 px | "Identity", "Story" |

**Pola khas:** kombinasi *Regular/SemiBold + Bold* dalam satu baris ("More **Retention**"), dan *Italic* untuk kata kerja/aksi ("*Starts*", "*Enters*").

```ts
// fonts.ts
import { loadFont } from '@remotion/google-fonts/Poppins';
export const { fontFamily } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});
loadFont('italic', { weights: ['600', '700'], subsets: ['latin'] });
```

---

## 3. Ritme & Timing

### 3.1 Grid
- Musik terdeteksi **±120 BPM** (hit kuat berulang tepat tiap 1.00 dtk di 22.5 → 27.5 dtk; aksen tambahan tiap 0.5 dtk).
- @30fps: **beat = 15f**, **bar-half = 30f**, **bar = 60f**.
- Semua *in-point* animasi dan cut diletakkan di kelipatan 15f. Micro-animasi (pop, klik) boleh di 7–8f (setengah beat).

```ts
export const FPS = 30;
export const BEAT = 15;            // 0.5 s
export const b = (n: number) => Math.round(n * BEAT);
```

### 3.2 Struktur Naratif (template 50 dtk ≈ 1500f)

| # | Waktu | Frame | Babak | Isi visual | Latar |
|---|---|---|---|---|---|
| 1 | 0.0–2.0 | 0–60 | **Hook** | "Every Brand" + "*Starts*" diklik cursor → masuk pill putih | Merah |
| 2 | 2.0–3.0 | 60–90 | Hook lanjut | "as a" → "Blank *Space*" zoom-out dari close-up | Putih |
| 3 | 3.0–7.7 | 90–232 | **Problem** | Tempat sampah, pill masalah jatuh satu per satu & menumpuk | Merah |
| 4 | 7.7–9.7 | 232–292 | **Turn** | "Then **Clarity** *Enters*" — teks berjalan horizontal, kotak seleksi + klik | Putih |
| 5 | 9.7–15.6 | 292–468 | **Solution** | Mata berkedip, 4 ikon glass pop-in (Identity, Movement, Story, Recognition) | Merah |
| 6 | 15.6–19.0 | 468–570 | Statement | "This is where" → "**BRANDS**" → "Come alive" | Merah |
| 7 | 19.0–25.0 | 570–750 | **Proof (klien)** | Logo per logo di warna brand-nya, mockup website melayang | Client cards |
| 8 | 25.0–32.2 | 750–966 | **Proof (angka)** | Wave putih naik, ikon bulat + stat: +2500, 3.3x, +10000, +400 | Merah + wave |
| 9 | 32.2–35.2 | 966–1056 | Benefit | "More Reach / More Retention / More Trust" | Putih |
| 10 | 35.2–39.2 | 1056–1176 | Authority | Cloud kartu logo zoom-out "Trusted by Brands" → "WORLDWIDE" | Merah |
| 11 | 39.2–42.7 | 1176–1281 | **CTA** | "If You Want to Grow in 2026" → "Make Your Brand" (blur swap) | Putih |
| 12 | 42.7–44.5 | 1281–1335 | Climax | "MOVE" glitch-assemble | Merah (panel drop) |
| 13 | 44.5–50.0 | 1335–1500 | Outro | Logo + cursor klik, bounce, hold diam; audio fade | Putih |

**Hukum ritme:**
1. Ganti informasi setiap **1–2 beat** di babak cepat (problem, stats), **3–4 beat** di statement.
2. Selang-seling **merah ↔ putih** tiap 2–6 detik = "napas" visual.
3. Klimaks (MOVE) paling singkat (±1.8 dtk) dan paling keras secara audio.
4. Outro paling panjang & paling tenang (±5 dtk, musik meredam ke -40 dB lalu senyap).

---

## 4. Easing & Spring Presets

| Nama | Kurva | Dipakai untuk |
|---|---|---|
| `snapOut` | `bezier(0.16, 1, 0.3, 1)` (expo-out) | Teks masuk, slide, zoom-out reveal |
| `snapIn` | `bezier(0.7, 0, 0.84, 0)` (expo-in) | Elemen keluar (cepat menghilang) |
| `swiftInOut` | `bezier(0.83, 0, 0.17, 1)` | Wipe, panel drop, card tilt |
| `popSpring` | spring `{damping: 12, stiffness: 200, mass: 0.6}` | Ikon glass, pill, stat bubble (overshoot ±8%) |
| `softSpring` | spring `{damping: 20, stiffness: 120}` | Wave putih, logo cards |
| `dropSpring` | spring `{damping: 9, stiffness: 160, mass: 0.8}` | Pill jatuh ke tempat sampah (pantul kecil) |
| `linear` | — | Ticker teks horizontal ("Clarity Enters"), background drift |

```ts
// easing.ts
import { Easing, spring, SpringConfig } from 'remotion';
export const E = {
  snapOut: Easing.bezier(0.16, 1, 0.3, 1),
  snapIn: Easing.bezier(0.7, 0, 0.84, 0),
  swiftInOut: Easing.bezier(0.83, 0, 0.17, 1),
};
export const S: Record<string, Partial<SpringConfig>> = {
  pop: { damping: 12, stiffness: 200, mass: 0.6 },
  soft: { damping: 20, stiffness: 120 },
  drop: { damping: 9, stiffness: 160, mass: 0.8 },
};
```

**Durasi standar:** masuk 8–12f, keluar 5–8f, transisi scene 8–15f. Tidak ada animasi > 20f kecuali background & ticker.

---

## 5. Transisi (katalog)

| Kode | Nama | Deskripsi | Durasi | Contoh |
|---|---|---|---|---|
| T1 | **Hard cut on beat** | Potong langsung tepat di beat + SFX impact | 0f | Merah → mata, putih → "More Reach" |
| T2 | **Tilted card slide** | Scene putih jadi "kartu", miring -6°, meluncur ke atas-kanan memperlihatkan scene merah | 10f, `swiftInOut` | Blank Space → trash |
| T3 | **Liquid wave wipe** | Bidang putih dengan tepi bergelombang (sinus) naik dari bawah menutup layar | 12f, `swiftInOut` | Trash → "Then Clarity" |
| T4 | **Zoom-through** | Scene berikut mulai scale 2.5→1 + blur 12→0 | 10f, `snapOut` | "Blank Space", logo cards |
| T5 | **Blur swap** | Teks lama blur 0→20 + opacity 1→0, teks baru blur 20→0 di posisi sama | 8f + 8f | "If You Want…" → "Make Your Brand" |
| T6 | **Push slide** | Scene lama terdorong keluar (atas/kiri), scene baru masuk dari arah berlawanan | 10f, `snapOut` | Antar logo klien, "WORLD" → "WIDE" |
| T7 | **Panel drop / lift** | Panel merah turun dari atas menutupi putih; lalu naik lagi memperlihatkan putih | 8f, `swiftInOut` | MOVE in/out |
| T8 | **Radial glow flash** | Lingkaran putih semi-transparan (opacity 0.6) meledak dari titik klik lalu hilang | 6f | Klik "Starts" |

```tsx
// Transisi bawaan Remotion yang paling dekat:
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';
// T6 → slide({ direction: 'from-right' }) + springTiming({ config: S.soft, durationInFrames: 10 })
// T3 → custom (lihat §6.4) atau wipe({ direction: 'from-bottom' })
```

---

## 6. Komponen Motion (siap pakai)

### 6.1 `CrimsonMeshBg` — latar merah bergerak (WAJIB di semua scene merah)
3–4 blob radial (crimsonBright, crimson, nearBlack) melayang lambat, ditambah grain halus. Gerakan sangat lambat (1 siklus ±6–8 detik) supaya terasa "hidup" tanpa mengganggu teks.

```tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from './theme';

export const CrimsonMeshBg: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const f = useCurrentFrame() + seed * 37;
  const p = (sp: number, ph: number, amp: number) => 50 + Math.sin(f / sp + ph) * amp;
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(60% 45% at ${p(70, 0, 25)}% ${p(90, 1, 20)}%, ${C.crimsonBright} 0%, transparent 70%),
          radial-gradient(55% 40% at ${p(80, 2, 30)}% ${p(60, 3, 25)}%, ${C.nearBlack} 0%, transparent 75%),
          radial-gradient(70% 50% at ${p(100, 4, 20)}% ${p(75, 5, 30)}%, ${C.crimson} 0%, transparent 70%),
          ${C.crimsonDeep}`,
        filter: 'saturate(1.1)',
      }}
    />
  );
};
```

### 6.2 `KineticWord` — teks masuk khas
Masuk: translateY 40→0 + opacity 0→1 + blur 8→0, `snapOut` 10f. Untuk kata kedua (highlight) masuk dari kanan bawah dengan sedikit rotasi (-4°→0).

```tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { E } from './easing';

export const KineticWord: React.FC<{ text: string; delay?: number; italic?: boolean; weight?: number; size?: number; color?: string }> =
({ text, delay = 0, italic, weight = 600, size = 64, color = '#fff' }) => {
  const f = useCurrentFrame() - delay;
  const t = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.snapOut });
  return (
    <span style={{
      display: 'inline-block', fontSize: size, fontWeight: weight, color,
      fontStyle: italic ? 'italic' : 'normal',
      transform: `translateY(${(1 - t) * 40}px)`, opacity: t, filter: `blur(${(1 - t) * 8}px)`,
    }}>{text}</span>
  );
};
```

### 6.3 `HighlightPill` + `Cursor` — efek "klik untuk menyorot"
Urutan (total ±24f):
1. Cursor panah (putih/hitam, 36px) meluncur ke kata, `snapOut` 8f.
2. **Klik**: cursor scale 1→0.85→1 (4f) + SFX click + radial glow flash (T8).
3. Pill putih (radius 10px) tumbuh dari kiri `scaleX 0→1` 6f, warna teks ikut berubah ke `#910102`.
4. Varian bg putih: kotak `#910102` + border dashed 2px hitam (seperti selection box di Canva/Figma), teks putih.

```tsx
const click = spring({ frame: f - CLICK_AT, fps, config: S.pop });
const pillScaleX = interpolate(f, [CLICK_AT, CLICK_AT + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.snapOut });
// pill: transformOrigin 'left center', transform `scaleX(${pillScaleX})`
// cursor: transform `scale(${1 - 0.15 * Math.sin(Math.min(1, (f - CLICK_AT) / 4) * Math.PI)})`
```

### 6.4 `WaveWipe` — liquid wave transition / stat wave
SVG path dengan tepi atas sinusoidal, tinggi animasi `soft` spring. Tepinya diberi glow `pinkMist` (drop-shadow 0 -20px 40px).

```tsx
export const WaveWipe: React.FC<{ progress: number; amp?: number; color?: string }> = ({ progress, amp = 60, color = '#fff' }) => {
  const f = useCurrentFrame();
  const H = 1920, W = 1080, y = H - progress * (H + amp * 2);
  let d = `M0 ${H} L0 ${y}`;
  for (let x = 0; x <= W; x += 40) d += ` L${x} ${y + Math.sin(x / 180 + f / 8) * amp}`;
  d += ` L${W} ${H} Z`;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', filter: 'drop-shadow(0 -20px 40px #D1A8AB)' }}>
      <path d={d} fill={color} />
    </svg>
  );
};
```
- **Sebagai transisi (T3):** progress 0→1 dalam 12f.
- **Sebagai panggung statistik (scene 8):** progress berhenti di ~0.35 (wave di sepertiga bawah), lalu bergeser naik-turun ±30px tiap ganti stat.

### 6.5 `GlassIcon` — ikon bulat kaca
Lingkaran 150–190px, `radial-gradient(circle at 35% 30%, #FFFFFF, #E3DDDD 45%, #B7989A 100%)`, inner shadow merah, ikon line-art merah `#910102` di tengah, caption 24px di bawah.
Masuk: scale 0→1 `popSpring` + blur 10→0 + opacity; stagger antar ikon **15f (1 beat)**; posisi zig-zag di sekitar objek tengah (kanan-atas → kiri-atas → kiri-bawah → kanan-bawah).

### 6.6 `StatBubble` — angka hasil
Lingkaran putih besar (Ø 280px, setengah keluar dari tepi kiri layar) berisi ikon merah + angka Bold + label Italic di kanannya.
- Angka **counter**: `Math.round(interpolate(f, [0, 20], [0, target], { easing: E.snapOut }))`.
- Ganti stat setiap **30–45f**: bubble lama `slide` keluar kiri, baru masuk dari kiri + rotasi ikon 90°→0.

### 6.7 `DropPill` — masalah jatuh ke tempat sampah
Pill putih (gradient `#FFFFFF→#E3DDDD`, radius 14px, shadow `0 8px 20px rgba(0,0,0,.35)`) masuk dari atas, `dropSpring`, rotasi acak ±5°, menumpuk 8–10px tiap pill. Stagger 15–30f. Tempat sampah: siluet hitam `#000` 60% opacity, tutup terbuka (rotasi -25°) saat pill pertama masuk.

### 6.8 `LogoCloud` — "Trusted by Brands"
Grid 3×3 kartu (radius 18px, bg `#650001`→`#AB0003`, border 1px `rgba(255,255,255,.15)`), masing-masing berisi logo putih. Kamera **zoom-out** scale 2.6→1 (20f, `snapOut`), lalu drift rotasi -3°→0 & scale 1→0.96 lambat. Teks "Trusted by" / "Brands" di slot tengah.

### 6.9 `GlitchWord` — klimaks "MOVE"
Teks 800 ExtraBold putih dipecah per huruf/irisan horizontal (4–6 slice via `clip-path: inset()`), tiap slice offset X acak ±40px & warna terpisah (RGB split merah `#C50003` / putih). Dalam 10f offset menuju 0 → huruf rapi. Tambah 2–3 frame "flicker" (opacity 0.6) + micro-shake (§7).

```tsx
const settle = interpolate(f, [0, 10], [1, 0], { extrapolateRight: 'clamp', easing: E.snapOut });
const jitter = (i: number) => (random(`g${i}-${Math.floor(f / 2)}`) - 0.5) * 80 * settle; // random() dari 'remotion'
```

### 6.10 `TickerLine` — "Then Clarity Enters"
Baris teks lebih lebar dari layar bergerak horizontal **linear** (±250px/detik) ke kiri, sementara kata kunci di-klik (6.3). Memberi kesan kamera *pan*.

---

## 7. Gerakan Kamera (virtual)

Tidak ada footage kamera asli; "kamera" dibuat dengan transform pada container scene.

| Gerakan | Nilai | Kapan |
|---|---|---|
| **Slow push-in** | scale 1.00→1.05 sepanjang scene (linear) | Semua scene teks statement |
| **Zoom-out reveal** | scale 2.5–3.0→1.0, 10–20f, `snapOut`, + blur 12→0 | "Blank Space", logo cloud, "WORLD" |
| **Pan horizontal** | translateX linear ±250 px/dtk | Ticker "Clarity Enters", "WORLDWIDE" |
| **Parallax** | foreground 1.0×, background mesh 0.3× | Scene ikon & stats |
| **Micro-shake** | ±6px X/Y, 4–6f, decay eksponensial | Impact SFX (MOVE, hard cut, pill jatuh) |
| **Tilt** | rotate -6°→0 saat card masuk/keluar | T2 |

```tsx
export const useShake = (hitFrame: number, strength = 6, dur = 6) => {
  const f = useCurrentFrame() - hitFrame;
  if (f < 0 || f > dur) return 'translate(0,0)';
  const k = strength * Math.exp(-f / 2);
  return `translate(${Math.sin(f * 9) * k}px, ${Math.cos(f * 7) * k}px)`;
};
```

---

## 8. Sound Design (SFX & Musik)

### 8.1 Musik
- Genre: **trap/hip-hop corporate atau "hype" elektronik**, ±120 BPM (half-time feel), sub-bass dan kick tebal (energi dominan < 300 Hz).
- Level: musik di -18 s/d -22 dB (LUFS-ish), SFX 3–6 dB di atasnya.
- **Riser** (sweep naik 2.7 → 5.4 kHz, terlihat di spektrum) dipakai 2× untuk membangun ketegangan: menjelang segmen klien (±17–19 dtk) dan menjelang MOVE (±41–45 dtk).
- **Drop-out / silence 3–6f** tepat sebelum momen besar (±18.8 dtk sebelum logo pertama).
- Outro: musik fade -40 dB dalam 1 dtk setelah logo muncul, lalu hening.

### 8.2 Peta SFX → Aksi Visual

| Aksi visual | SFX | Catatan |
|---|---|---|
| Teks masuk (per kata) | **Soft whoosh / swish** pendek (150–250 ms) | Volume rendah, pan mengikuti arah gerak |
| Cursor klik | **Mouse click** (crisp, 2-layer) | Tepat di frame klik |
| Pill / ikon pop-in | **Pop / bubble** atau **UI tick** | Pitch naik tiap ikon berikutnya (+1 semitone) |
| Pill jatuh ke tong | **Thud / paper drop** + metal clang kecil | Sinkron dengan pantulan spring |
| Hard cut / ganti latar | **Impact / boom** + sub drop | Di beat kuat (kelipatan 30f) |
| Wave wipe | **Liquid whoosh / swoosh panjang** (400 ms) | |
| Counter angka | **Tick-tick** cepat / digital counter | Berhenti tepat saat angka final |
| Kedipan mata | **Blink swish** halus | |
| Glitch MOVE | **Glitch / digital stutter** + **big impact** | Paling keras di video |
| Logo outro | **Click** + **shimmer / chime** pendek | Lalu hening |
| Menjelang klimaks | **Riser** 1.5–3 dtk | Berakhir tepat di impact |

```tsx
import { Audio, Sequence, staticFile } from 'remotion';
// <Sequence from={CLICK_AT}><Audio src={staticFile('sfx/click.mp3')} volume={0.9} /></Sequence>
// Musik dengan fade-out outro:
// <Audio src={staticFile('music/bed.mp3')}
//   volume={(f) => interpolate(f, [1370, 1400], [0.8, 0.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
```

Struktur folder aset yang disarankan:
```
public/
  music/bed.mp3
  sfx/whoosh_short.mp3  sfx/whoosh_long.mp3  sfx/click.mp3   sfx/pop.mp3
  sfx/tick.mp3          sfx/impact.mp3       sfx/riser.mp3   sfx/glitch.mp3
  sfx/thud.mp3          sfx/shimmer.mp3
  logos/…               icons/…
```

---

## 9. Layout & Komposisi

- **Safe area:** margin 80px kiri/kanan, 220px atas, 320px bawah (UI Reels/TikTok).
- Teks satu baris selalu **center horizontal**; posisi vertikal bergantian: tengah (statement), sepertiga atas (pill/ikon), sepertiga bawah (outro "If You Want…").
- Objek utama (mata, tong sampah, bubble stat) **besar & sering keluar frame** (cropped) → kesan dekat & dinamis.
- Maksimal **4 kata** di layar sekaligus.
- Shadow: lembut & lebar (`0 10px 30px rgba(0,0,0,.35)`) di atas merah; hampir tanpa shadow di atas putih.

---

## 10. Template Struktur Remotion

```tsx
// Root.tsx
import { Composition } from 'remotion';
import { CrimsonReel } from './CrimsonReel';
export const RemotionRoot = () => (
  <Composition id="CrimsonReel" component={CrimsonReel}
    width={1080} height={1920} fps={30} durationInFrames={1500}
    defaultProps={{ /* isi teks & aset di sini */ }} />
);
```

```tsx
// CrimsonReel.tsx (kerangka)
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { b } from './timing';

export const CrimsonReel = (p: Props) => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: '#FFFFFF' }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={b(4)}><HookScene {...p.hook} /></TransitionSeries.Sequence>
      {/* hard cut = tanpa Transition di antaranya */}
      <TransitionSeries.Sequence durationInFrames={b(2)}><BlankSpaceScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={linearTiming({ durationInFrames: 10 })} />
      <TransitionSeries.Sequence durationInFrames={b(9.5)}><ProblemScene items={p.problems} /></TransitionSeries.Sequence>
      {/* … Turn → Solution → Statement → Proof → Benefit → Authority → CTA → Climax → Outro */}
    </TransitionSeries>
    <SoundTrack />
  </AbsoluteFill>
);
```

### Props yang bisa diganti per proyek
```ts
type Props = {
  hook: { line1: string; clickWord: string; line2: string; highlight: string }; // "Every Brand" / "Starts" / "as a" / "Blank Space"
  problems: string[];                 // 3 pill masalah
  turnWord: string;                   // "Clarity"
  pillars: { label: string; icon: string }[]; // 4 ikon glass
  statement: [string, string, string];        // "This is where" / "BRANDS" / "Come alive"
  clients: { logo: string; bg: string }[];
  stats: { value: number; prefix?: string; suffix?: string; label: string; icon: string }[];
  benefits: string[];                 // "Reach", "Retention", "Trust"
  cta: [string, string];              // "If You Want to Grow in 2026" / "Make Your Brand"
  climaxWord: string;                 // "MOVE"
  logo: string;
};
```

---

## 11. Contoh Adaptasi Cepat

| Bisnis | Hook | Problem pills | Turn | Climax |
|---|---|---|---|---|
| **Livya Kitchen** | "Every Meal *Starts* as a Simple Recipe" | Bland taste · Inconsistent portion · Late delivery | **Freshness** *Enters* | "TASTE" |
| **AXA (asuransi)** | "Every Family *Starts* with a Plan" | Hidden risk · No savings · Medical cost | **Protection** *Enters* | "SAFE" |
| **Produk digital** | "Every Creator *Starts* from Zero" | No system · Low reach · No sales | **Strategy** *Enters* | "GROW" |

> Catatan: untuk AXA, gunakan aset logo/merek resmi sesuai pedoman brand AXA, atau tampilkan nama Anda sebagai konsultan saja; jangan memodifikasi logo resmi.

---

## 12. Checklist QA Sebelum Render

- [ ] Semua cut & in-point di kelipatan 15f (cek dengan musik).
- [ ] Tiap aksi visual besar punya SFX; tidak ada SFX tanpa aksi.
- [ ] Merah ↔ putih bergantian minimal tiap 6 detik.
- [ ] Latar merah selalu mesh bergerak, bukan flat.
- [ ] Kata kunci = Bold/Italic; maksimal 4 kata di layar.
- [ ] Elemen masuk ≤12f, keluar ≤8f.
- [ ] Riser + jeda hening 3–6f sebelum klimaks.
- [ ] Outro hold ≥4 dtk, musik fade.
- [ ] Render: `npx remotion render CrimsonReel out.mp4 --codec=h264 --crf=18`
