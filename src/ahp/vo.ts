/**
 * Naskah VO + timing per kata.
 * Saat ini: PERKIRAAN (draf tanpa VO). Setelah VO ElevenLabs dibuat, `vo-words.json`
 * (hasil transkripsi, urutan kata sama) menggantikan perkiraan ini.
 */
export const FPS = 30;

// [teks, mulai (dtk), selesai (dtk)]
export const PHRASES: [string, number, number][] = [
  ["Tahukah kamu, berapa total biaya asuransi kesehatan, dari usia tiga puluh, sampai delapan puluh empat tahun?", 1.0, 7.4], // P0
  ["Sekitar dua miliar rupiah.", 8.3, 10.0], // P1
  ["Dari usia tiga puluh sampai enam puluh empat, totalnya sekitar lima ratus enam puluh juta.", 10.9, 16.6], // P2
  ["Tapi dari usia enam puluh lima sampai delapan puluh empat, totalnya hampir satu koma lima miliar.", 17.4, 23.6], // P3
  ["Berarti, hampir tujuh puluh lima persen biaya, justru ada di usia pensiun kita.", 24.5, 29.3], // P4
  ["Bagaimana kalau biaya itu, disiapkan sejak sekarang?", 30.3, 33.0], // P5
  ["Sisihkan sekitar sepuluh juta sebulan, selama lima tahun.", 33.6, 36.7], // P6
  ["Di usia enam puluh lima, cair dua koma satu miliar.", 37.4, 40.5], // P7
  ["Cukup untuk mengembalikan semua premi polis, dan membayar biaya kesehatan, sampai usia delapan puluh empat.", 41.1, 46.9], // P8
  ["Dan selama itu, kamu tetap punya proteksi jiwa.", 47.7, 50.5], // P9
  ["Pensiun tenang, tanpa jadi beban.", 51.5, 53.5], // P10
  ["Mulai siapkan dari sekarang.", 54.1, 56.3], // P11
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
