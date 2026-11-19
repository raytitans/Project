// Design tokens: "Midnight Electric" style (diambil dari video referensi).
// Semua ukuran untuk kanvas 1080x1920 @ 30fps.
import { Easing } from "remotion";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export const COLORS = {
  // Background
  black: "#000000",
  navy900: "#000C18",
  navy800: "#0C1830",
  navy700: "#0C183C",
  navy600: "#18246C",
  // Aksen biru elektrik
  blue: "#2B54EF", // teks aksen (Skills, $99, 90%)
  blueBright: "#3C66FE", // logo / ikon
  blueHighlight: "#6693FF", // highlight / rim light
  blueDeep: "#1D4CF6",
  blueGlow: "#0000D0", // pusat glow
  // Teks
  white: "#F2F4F6",
  gray: "#A3A7B3", // kata penutup kecil ("to", "on the line")
  // Kaca
  glassStroke: "rgba(255,255,255,0.85)",
  glassFill: "rgba(10,14,28,0.55)",
  grid: "rgba(255,255,255,0.08)",
} as const;

export const FONT = {
  family: "Poppins, sans-serif",
  caption: { size: 76, weight: 500 }, // kalimat utama, kata per kata
  small: { size: 54, weight: 500 }, // kata penutup kecil, abu-abu
  accent: { size: 130, weight: 600 }, // keyword biru
  hero: { size: 200, weight: 600 }, // angka besar (90%, $99)
  label: { size: 30, weight: 500 }, // label di dalam kartu
} as const;

// Easing
export const EASE = {
  // Masuknya teks dan objek: cepat lalu melambat
  out: Easing.bezier(0.16, 1, 0.3, 1), // ~easeOutExpo
  // Transisi kamera (whip / tilt / zoom): lambat-cepat-lambat
  inOut: Easing.bezier(0.83, 0, 0.17, 1), // ~easeInOutExpo
  // Keluar/menghilang
  in: Easing.bezier(0.7, 0, 0.84, 0), // ~easeInExpo
  // Counter angka
  counter: Easing.bezier(0.25, 1, 0.5, 1), // easeOutQuart
} as const;

// Pegas untuk "pop" (angka hero, ikon, checkmark): sedikit overshoot
export const SPRING = {
  pop: { damping: 12, stiffness: 180, mass: 0.6 },
  soft: { damping: 20, stiffness: 120, mass: 1 },
} as const;

// Ritme (dalam frame @30fps)
export const TIMING = {
  wordStagger: 5, // jeda antar-kata (~6 kata/detik, ikuti VO)
  wordIn: 8, // durasi animasi 1 kata
  transition: 10, // durasi transisi kamera (~0.33 dtk)
  transitionLong: 18, // tilt / radial (~0.6 dtk)
  sceneMin: 60, // 2 dtk
  sceneMax: 120, // 4 dtk
  counter: 60, // 2 dtk naik angka
  outroHold: 45, // logo diam 1.5 dtk
} as const;
