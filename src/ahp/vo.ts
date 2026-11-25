/**
 * Naskah VO + timing per kata.
 * Sekarang: timing dari VO ElevenLabs (Mahaputra) yang sudah ditata ulang per frasa.
 * vo-phrases.json = timeline 75 dtk, vo-phrases-65.json = timeline 65 dtk.
 */
export const FPS = 30;

// [teks, mulai (dtk), selesai (dtk)]
export const PHRASES: [string, number, number][] = [
  ["Tahukah kamu, berapa total biaya premi kesehatanmu, di usia tiga puluh sampai delapan puluh empat tahun?", 0.94, 7.62], // P0
  ["Sekitar dua miliar.", 8.3, 9.61], // P1
  ["Usia tiga puluh sampai enam puluh empat, sekitar lima ratus enam puluh juta.", 12.6, 17.28], // P2
  ["Tapi usia enam puluh lima sampai delapan puluh empat, hampir satu koma lima miliar.", 19.5, 25.03], // P3
  ["Hampir tujuh puluh lima persen, justru di usia pensiun.", 26.8, 29.95], // P4
  ["Bagaimana kalau disiapkan sejak sekarang?", 33.2, 35.38], // P5
  ["Sisihkan sekitar sepuluh juta sebulan, selama lima tahun.", 36.7, 39.98], // P6
  ["Di usia enam puluh lima, cair dua koma satu miliar.", 42.8, 46.38], // P7
  ["Cukup untuk kembalikan semua premi, dan bayar biaya kesehatan sampai usia delapan puluh empat.", 47.6, 53.15], // P8
  ["Dan selama itu, kamu tetap punya proteksi jiwa, hingga tiga koma satu lima miliar.", 54.5, 59.76], // P9
  ["Pensiun tenang, tanpa jadi beban.", 60.5, 63.03], // P10
  ["Mulai siapkan dari sekarang.", 63.6, 65.28], // P11
  ["Komen, HITUNG, atau hubungi Raymon.", 65.8, 68.63], // P12 (CTA)
];

export type VoWord = { word: string; start: number; end: number; p: number; k: number };

const estimate = (): VoWord[] => {
  const out: VoWord[] = [];
  PHRASES.forEach(([text, s, e], p) => {
    const ws = text.split(" ");
    const wt = ws.map((w) => w.replace(/[^\p{L}\d]/gu, "").length + 2 + (/[,.?]$/.test(w) ? 3 : 0));
    const tot = wt.reduce((a, b) => a + b, 0);
    let acc = 0;
    ws.forEach((w, k) => {
      const st = s + ((e - s) * acc) / tot;
      acc += wt[k];
      out.push({ word: w, start: st, end: s + ((e - s) * acc) / tot, p, k });
    });
  });
  return out;
};

import REAL75 from "./vo-phrases.json";
import REAL65 from "./vo-phrases-65.json";
type RealPhrase = { text: string; words: { word: string; start: number; end: number }[] };

/** Timeline per kata dari VO asli (per frasa bila teks sama; frasa yang diubah memakai perkiraan). */
const makeTiming = (real: RealPhrase[]) => {
  const est = estimate();
  const WORDS: VoWord[] = est.map((v) => {
    const r = real[v.p];
    return r && r.text === PHRASES[v.p][0] && r.words[v.k] ? { ...v, start: r.words[v.k].start, end: r.words[v.k].end } : v;
  });
  const HAS_REAL_VO = PHRASES.every(([t], p) => !!real[p] && real[p].text === t);
  /** frame saat kata ke-k dari frasa p mulai diucapkan */
  const w = (p: number, k = 0) => {
    const x = WORDS.find((v) => v.p === p && v.k === k);
    if (!x) throw new Error(`no word p${p} k${k}`);
    return Math.round(x.start * FPS);
  };
  /** frame saat frasa p selesai */
  const pend = (p: number) => {
    const xs = WORDS.filter((v) => v.p === p);
    return Math.round(xs[xs.length - 1].end * FPS);
  };
  return { WORDS, HAS_REAL_VO, w, pend };
};

/** Timeline 75 dtk (vo.wav) — dipakai versi merah */
const T75 = makeTiming(REAL75 as RealPhrase[]);
export const { WORDS, HAS_REAL_VO, w, pend } = T75;
/** Timeline 65 dtk (vo65.wav, CTA ±5 dtk) — dipakai versi Navy Gold */
export const T65 = makeTiming(REAL65 as RealPhrase[]);
