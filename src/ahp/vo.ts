/**
 * Naskah VO + timing per kata.
 * Saat ini: PERKIRAAN (draf tanpa VO). Setelah VO ElevenLabs dibuat, `vo-words.json`
 * (hasil transkripsi, urutan kata sama) menggantikan perkiraan ini.
 */
export const FPS = 30;

// [teks, mulai (dtk), selesai (dtk)]
export const PHRASES: [string, number, number][] = [
  ["Tahukah kamu, berapa total premi asuransi kesehatan, dari usia tiga puluh sampai delapan puluh empat?", 1.0, 6.6], // P0
  ["Sekitar dua miliar.", 7.4, 8.8], // P1
  ["Usia tiga puluh sampai enam puluh empat, sekitar lima ratus enam puluh juta.", 9.5, 14.6], // P2
  ["Tapi usia enam puluh lima sampai delapan puluh empat, hampir satu koma lima miliar.", 15.3, 20.8], // P3
  ["Hampir tujuh puluh lima persen, justru di usia pensiun.", 21.6, 25.4], // P4
  ["Bagaimana kalau disiapkan sejak sekarang?", 26.3, 28.5], // P5
  ["Sisihkan sekitar sepuluh juta sebulan, selama lima tahun.", 29.1, 32.2], // P6
  ["Di usia enam puluh lima, cair dua koma satu miliar.", 32.9, 36.0], // P7
  ["Cukup untuk kembalikan semua premi, dan bayar biaya kesehatan sampai usia delapan puluh empat.", 36.6, 42.0], // P8
  ["Dan selama itu, kamu tetap punya proteksi jiwa.", 42.8, 45.6], // P9
  ["Pensiun tenang, tanpa jadi beban.", 46.5, 48.5], // P10
  ["Mulai siapkan dari sekarang.", 49.0, 50.8], // P11
  ["Komen, HITUNG, atau hubungi Raymon.", 51.4, 53.6], // P12 (CTA)
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

import REAL from "./vo-words.json";
const real = REAL as { word: string; start: number; end: number }[];

const est = estimate();
export const WORDS: VoWord[] =
  real.length === est.length ? est.map((w, i) => ({ ...w, start: real![i].start, end: real![i].end })) : est;

export const HAS_REAL_VO = WORDS !== est;

/** frame saat kata ke-k dari frasa p mulai diucapkan */
export const w = (p: number, k = 0) => {
  const x = WORDS.find((v) => v.p === p && v.k === k);
  if (!x) throw new Error(`no word p${p} k${k}`);
  return Math.round(x.start * FPS);
};
/** frame saat frasa p selesai */
export const pend = (p: number) => {
  const xs = WORDS.filter((v) => v.p === p);
  return Math.round(xs[xs.length - 1].end * FPS);
};
