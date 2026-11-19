# design.md: Gaya "Midnight Electric"

Panduan gaya video vertikal untuk Remotion, dibedah dari video referensi (iklan prop-firm trading, 24,8 detik).
Tampilannya gelap dan premium: hitam pekat, aksen biru elektrik, kartu kaca, teks muncul kata per kata, dan transisi kamera tanpa hard cut.

Kode siap pakai ada di:
- `src/design/tokens.ts`: warna, font, easing, spring, timing
- `src/design/components.tsx`: `Background`, `Caption`, `words()`, `GlassCard`, `Counter`, `RadialProgress`, `HeroText`, `Scene`
- `src/StyleDemo.tsx`: contoh 4 scene lengkap (render: `npx remotion render src/index.ts StyleDemo out/style-demo.mp4`)

---

## 1. Spesifikasi teknis

| | Referensi | Untuk proyek Anda |
|---|---|---|
| Resolusi | 720 × 1280 | **1080 × 1920** (semua ukuran di bawah sudah dikali 1,5) |
| FPS | 24 | **30** |
| Durasi | 24,8 dtk | 15–30 dtk |
| Audio | AAC stereo 44,1 kHz | VO + musik + SFX |

---

## 2. Warna

Diukur dari piksel frame video (median area). Background 80% hitam murni; biru hanya sebagai aksen dan cahaya.

| Token | Hex | Dipakai untuk |
|---|---|---|
| `black` | `#000000` | Background utama (dominan) |
| `navy900` | `#000C18` | Bayangan / area gelap kebiruan |
| `navy800` | `#0C1830` | Gradasi sinar background |
| `navy700` | `#0C183C` | Gradasi sinar background |
| `navy600` | `#18246C` | Inti sinar diagonal |
| `blue` | **`#2B54EF`** | **Teks aksen** ("Skills", "90%", "$99") |
| `blueBright` | `#3C66FE` | Logo, ikon, batang grafik |
| `blueHighlight` | `#6693FF` | Rim light, sisi terang logo, label "Balance" |
| `blueDeep` | `#1D4CF6` | Glow di sudut kartu, sinar |
| `blueGlow` | `#0000D0` | Pusat glow paling pekat |
| `white` | `#F2F4F6` | Teks utama (putih sedikit dingin, bukan #FFF) |
| `gray` | `#A3A7B3` | Kata penutup kecil ("to", "on the line") *(perkiraan)* |
| `glassStroke` | `rgba(255,255,255,0.85)` | Garis tepi kartu kaca |
| `grid` | `rgba(255,255,255,0.08)` | Grid di dalam kartu |

**Aturan warna**
- Maksimal 1 kata atau frasa biru per kalimat. Biru adalah keyword yang diucapkan VO dengan penekanan.
- Biru selalu diberi glow halus (`text-shadow: 0 0 40px #2B54EF66`).
- Tidak ada warna lain (tidak ada merah, hijau, atau kuning). Status "berhasil" (centang) juga biru.

---

## 3. Tipografi

**Font: Poppins** (geometric sans; terlihat dari "y", "k", "g" dan "%"). Sudah terpasang lewat `@fontsource/poppins`, jadi aman di-render offline.

| Peran | Ukuran @1080 | Weight | Warna | Contoh |
|---|---|---|---|---|
| Caption | 76 px | 500 Medium | `white` | "What if you could trade with" |
| Aksen | 130 px | 600 SemiBold | `blue` | "Skills", "The funds" |
| Hero angka | 200 px | 600 SemiBold | `blue` | "90%", "$99" |
| Kata kecil | 54 px | 500 | `gray` | "to", "on the line", "of the profits" |
| Label kartu | 30 px | 500 | `blueHighlight` | "Balance" |

**Ciri khas kinetic typography**
1. **Kata per kata**, sinkron dengan VO (bukan kalimat sekaligus).
2. Struktur 2 tingkat: baris kecil putih di atas, lalu **keyword besar biru** di bawahnya ("You got the" → **Skills**).
3. Kata terakhir sering **lebih kecil, abu-abu, dan turun sedikit dari baseline** ("You keep up `to`"). Di kode: `_kata_`.
4. Teks rata tengah, berada di sepertiga atas layar, di atas objek/kartu.

Sintaks helper `words()`:
```tsx
words("You got the |*Skills*")              // | = baris baru, *x* = aksen biru
words("without putting your |*own~money* _on_ _the_ _line_") // ~ = spasi dalam 1 kata, _x_ = kecil abu-abu
```

---

## 4. Elemen visual

1. **Background**: hitam + 2–3 **sinar biru diagonal (~28°)** yang blur dan bergeser pelan ke kiri, vignette di tepi, dan garis biru tipis di tepi atas.
2. **Kartu kaca (glassmorphism)**: sudut bulat 36 px, stroke gradasi putih ke biru, **glow biru di sudut kiri-bawah**, grid halus di dalamnya, dan **kilau diagonal yang menyapu sekali** saat kartu muncul.
3. **Objek 3D sederhana**: orb/avatar biru bercahaya, batang grafik dengan ikon koin, candlestick, ring progress.
4. **Angka hidup**: counter ($88,070 → $100,000; 18% → 90%) dengan `tabular-nums`.
5. **Outro**: logo biru 3D + harga besar ("$99") + ikon kecil yang berayun (price tag).

---

## 5. Ritme dan struktur

Hasil deteksi gerak frame-per-frame. Tidak ada hard cut sama sekali; semua pergantian scene memakai gerakan kamera.

| Waktu | Scene | Isi | Transisi keluar |
|---|---|---|---|
| 0,0–4,2 | Hook | "What if you could trade with **$100,000**…" + counter saldo | Push-in + fade hitam |
| 4,4–8,2 | Masalah/solusi | "You got the **Skills** / **Prop Firms** come in" + kartu grafik batang | Whip pan kiri |
| 8,5–11,0 | Manfaat 1 | "They give you **The funds**" | Tilt 3D |
| 11,7–14,4 | Cara kerja | "All you do is pass a simple challenge…" + garis kurva dan centang | Zoom-out + sapuan arc biru |
| 15,0–17,2 | Bukti | "You're trading a real **funded account**" + candlestick | Depth blur |
| 17,3–20,9 | Klimaks | "And the best part… You keep up to **90%**" + ring progress | Zoom ke logo |
| 21,0–24,8 | CTA | Logo + "All starting from **$99**" | Hold, audio fade-out |

**Aturan ritme**
- Durasi scene **2–4 detik** (rata-rata ±2,7 dtk); 7–9 scene per 25 detik.
- Kata muncul setiap **5 frame** (±6 kata/dtk, ikuti tempo VO).
- Transisi pendek **10 frame (0,33 dtk)**, transisi besar **18 frame (0,6 dtk)**.
- Setiap scene punya **1 objek utama dan 1 keyword biru**.
- Pola naskah: **Hook pertanyaan → masalah → solusi → cara → bukti → "the best part" → angka besar → CTA harga**.

---

## 6. Gerakan kamera

1. **Drift konstan**: setiap scene zoom pelan 1,00 → 1,06 (Ken Burns). Layar tidak pernah benar-benar diam.
2. **Sinar background** bergeser terus, terpisah dari konten (efek parallax).
3. **Push-in**: kamera maju ke objek (scale 1 → 1,6) sambil bergeser ke kiri dan menggelap.
4. **Whip pan**: konten meluncur ±1100 px dengan motion blur dan sedikit skew.
5. **Tilt 3D**: kartu masuk dari kanan-bawah dengan rotasi Z −30° dan Y −40°, lalu tegak.
6. **Orbit/zoom-out**: konten mengecil ke tengah, dan cincin tipis serta arc biru menyapu.
7. **Depth-of-field**: scene lama mundur (scale 0,85), blur 14 px dan meredup; teks baru muncul di depannya.

Di kode: `<Scene enter="whip" exit="tilt">`. Pilihan: `pushIn | whip | tilt | zoomOut | depthBlur | none`.

---

## 7. Easing dan spring

| Nama | Kurva | Dipakai untuk |
|---|---|---|
| `EASE.out` | `bezier(0.16, 1, 0.3, 1)` (≈ easeOutExpo) | Masuknya kata dan objek: cepat, lalu "mendarat" halus |
| `EASE.inOut` | `bezier(0.83, 0, 0.17, 1)` (≈ easeInOutExpo) | Semua transisi kamera (whip, tilt, zoom) |
| `EASE.in` | `bezier(0.7, 0, 0.84, 0)` (≈ easeInExpo) | Objek keluar |
| `EASE.counter` | `bezier(0.25, 1, 0.5, 1)` (≈ easeOutQuart) | Counter angka dan ring progress |
| `SPRING.pop` | damping 12, stiffness 180, mass 0,6 | Angka hero, ikon, centang (sedikit overshoot) |
| `SPRING.soft` | damping 20, stiffness 120, mass 1 | Kartu kaca muncul |

**Animasi masuk 1 kata** (8 frame): opacity 0 → 1, translateY 40 → 0 px, scale 0,85 → 1, blur 8 → 0 px.

---

## 8. Audio dan SFX

> Catatan: audio referensi sudah tercampur (VO + musik + SFX), jadi bagian ini hasil analisis level dan onset. Ini perkiraan, bukan daftar file asli.

- **Voiceover**: bahasa Inggris, laki-laki, tempo cepat dan percaya diri. Caption 100% mengikuti VO.
- **Musik**: elektronik/corporate tech minimal, **±109 BPM** (estimasi autokorelasi). Level stabil sekitar −15 dB RMS, lalu **fade-out 1,5 detik** di akhir.
- **SFX** (onset terdeteksi di titik transisi):

| Momen | SFX yang disarankan |
|---|---|
| Whip pan / tilt / zoom (±0,3–0,6 dtk) | **Whoosh** pendek, mulai 2–3 frame sebelum transisi |
| Kartu kaca muncul | **Glass shimmer / soft swoosh** |
| Kata aksen biru | **Soft pop** atau **click** halus |
| Counter berjalan | **Digital tick** (rapat, volume kecil) |
| Centang / angka hero mendarat | **Ding / UI confirm** |
| Logo outro | **Impact low boom + shimmer** |

Mixing: VO 0 dB (patokan), musik −18 dB di bawah VO, SFX −10 sampai −6 dB.

```tsx
import { Audio, Sequence, staticFile } from "remotion";
<Sequence from={transitionFrame - 3}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} /></Sequence>
```
Taruh file SFX dan musik di folder `public/`.

---

## 9. Template scene (copy-paste)

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { Background, Caption, GlassCard, HeroText, Scene, words } from "./design/components";
import { TIMING } from "./design/tokens";

const T = TIMING.transition; // overlap antar-scene

export const MyVideo = () => (
  <Background>
    <Sequence durationInFrames={90}>
      <Scene duration={90} exit="whip">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 480, gap: 40 }}>
          <Caption words={words("Kamu punya |*Skill*")} />
          <GlassCard width={760} height={440} startFrame={12}>{/* objek */}</GlassCard>
        </AbsoluteFill>
      </Scene>
    </Sequence>

    <Sequence from={90 - T} durationInFrames={90}>
      <Scene duration={90} enter="whip">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
          <Caption words={words("Mulai dari")} />
          <HeroText startFrame={18}>Rp99rb</HeroText>
        </AbsoluteFill>
      </Scene>
    </Sequence>
  </Background>
);
```

Aturan overlap: scene berikutnya mulai `exitFrames` frame sebelum scene sebelumnya selesai, dan `enter` di scene baru harus sama dengan `exit` di scene lama.

---

## 10. Checklist sebelum render

- [ ] Background hitam; biru hanya untuk aksen dan cahaya
- [ ] 1 keyword biru per scene
- [ ] Caption muncul kata per kata dan sinkron VO
- [ ] Ada drift kamera; tidak ada frame yang benar-benar diam
- [ ] Tidak ada hard cut; semua lewat `<Scene enter/exit>`
- [ ] Scene 2–4 detik
- [ ] Whoosh di setiap transisi; musik fade-out di akhir
- [ ] Penutup: logo + angka/harga besar biru (CTA)

---

## 11. Adaptasi cepat untuk bisnis Anda

| Bisnis | Hook | Keyword biru | Angka hero |
|---|---|---|---|
| AXA (asuransi) | "Bagaimana kalau biaya rumah sakit…" | **Terlindungi** | Rp1 M uang pertanggungan |
| Livya Kitchen | "Lapar tengah malam?" | **Livya Kitchen** | Rp25rb / porsi |
| Produk digital | "Bayangkan kerja 2 jam sehari…" | **Template** | 90% lebih cepat |

> Untuk Livya Kitchen, warna `blue` bisa diganti dengan warna brand (misalnya oranye) cukup di `tokens.ts`. Seluruh gaya lain tetap sama.

---

## 12. Tema warna dan sinkron VO (tambahan)

**Ganti tema** tanpa mengubah komponen:
```tsx
import { ThemeProvider } from "./design/components";
import { GOLD } from "./design/tokens";
<ThemeProvider palette={GOLD}>...</ThemeProvider>
```
Palet `GOLD` (brand Raymon / AXA): background `#010A16` / navy `#021D3C`, aksen emas `#D4A23A`, highlight `#F5DC9A`, teks krem `#FAFAF5`. Key `blue*` berarti "warna aksen".

**Sinkron kata dengan VO:** setiap `Word` bisa diberi `at` (frame). Alur yang dipakai di `src/afp/`:
1. Buat VO di ElevenLabs → transkripsi (Scribe) untuk timestamp per kata.
2. Rapatkan jeda dan sesuaikan tempo dengan ffmpeg; timestamp ikut dipetakan → `vo-words.json`.
3. Di scene: `cap(from, [["Rp 2,5 M", 43, "accent"]])` → kata muncul tepat saat kata ke-43 diucapkan.
4. SFX ditaruh di frame `at(i)` (pop, ding, impact) dan `batas_scene - OV - 3` (whoosh).

SFX dan musik dibuat oleh `scripts/make_audio.py` (sintesis lokal, bebas royalti).
