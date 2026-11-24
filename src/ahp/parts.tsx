import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, E, FONT, S, clamp } from "./theme";

/* ---------------- Latar ---------------- */

/** design_1.md §6.1: mesh merah bergerak lambat */
export const MeshBg: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const f = useCurrentFrame() + seed * 37;
  const p = (sp: number, ph: number, amp: number) => 50 + Math.sin(f / sp + ph) * amp;
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(60% 45% at ${p(90, 0, 25)}% ${p(110, 1, 20)}%, ${C.crimsonBright} 0%, transparent 70%),
          radial-gradient(55% 40% at ${p(100, 2, 30)}% ${p(80, 3, 25)}%, ${C.nearBlack} 0%, transparent 75%),
          radial-gradient(70% 50% at ${p(120, 4, 20)}% ${p(95, 5, 30)}%, ${C.crimson} 0%, transparent 70%),
          radial-gradient(90% 60% at 50% 110%, ${C.oxblood} 0%, transparent 70%),
          ${C.crimsonDeep}`,
      }}
    />
  );
};

export const WhiteBg: React.FC = () => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 120) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 40% at ${x}% 0%, #FFF5F5 0%, transparent 70%),
          radial-gradient(80% 45% at ${100 - x}% 105%, ${C.offWhite} 0%, transparent 70%), ${C.white}`,
      }}
    />
  );
};

/* ---------------- Teks kinetik ---------------- */

export type WStyle = "statement" | "bold" | "italic" | "small" | "head";
export type WordDef = [text: string, at: number, style?: WStyle];

const STYLE: Record<WStyle, React.CSSProperties> = {
  statement: { fontSize: 66, fontWeight: 600 },
  bold: { fontSize: 72, fontWeight: 700 },
  italic: { fontSize: 72, fontWeight: 700, fontStyle: "italic" },
  small: { fontSize: 44, fontWeight: 500 },
  head: { fontSize: 120, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 },
};

/** design_1.md §6.2: translateY 40→0, opacity, blur 8→0, snapOut 10f */
export const Word: React.FC<{ d: WordDef; color: string; accent?: string }> = ({ d, color, accent }) => {
  const f = useCurrentFrame();
  const [text, at, style = "statement"] = d;
  const t = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: E.snapOut });
  const hi = style === "italic" || style === "bold" || style === "head";
  const rot = style === "italic" ? (1 - t) * -4 : 0;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT,
        color: hi && accent ? accent : color,
        ...STYLE[style],
        transform: `translate(${style === "italic" ? (1 - t) * 30 : 0}px, ${(1 - t) * 40}px) rotate(${rot}deg)`,
        opacity: t,
        filter: `blur(${(1 - t) * 8}px)`,
        whiteSpace: "pre",
      }}
    >
      {text}
    </span>
  );
};

/** Baris kata, rata tengah. `out` = frame mulai blur-swap keluar (T5). */
export const Line: React.FC<{
  words: WordDef[];
  color: string;
  accent?: string;
  gap?: number;
  out?: number;
  style?: React.CSSProperties;
}> = ({ words, color, accent, gap = 18, out, style }) => {
  const f = useCurrentFrame();
  const o = out === undefined ? 0 : interpolate(f, [out, out + 8], [0, 1], { ...clamp, easing: E.snapIn });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: gap,
        rowGap: 4,
        opacity: 1 - o,
        filter: `blur(${o * 20}px)`,
        ...style,
      }}
    >
      {words.map((d, i) => (
        <Word key={i} d={d} color={color} accent={accent} />
      ))}
    </div>
  );
};

/* ---------------- Angka ---------------- */

export const fmtId = (n: number, dec = 0) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const Counter: React.FC<{
  from?: number;
  to: number;
  at: number;
  dur?: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, at, dur = 24, dec = 0, prefix = "", suffix = "", style }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: E.snapOut });
  const v = from + (to - from) * t;
  return (
    <span style={{ fontFamily: FONT, fontVariantNumeric: "tabular-nums", whiteSpace: "pre", ...style }}>
      {prefix}
      {fmtId(v, dec)}
      {suffix}
    </span>
  );
};

/* ---------------- Pop-in umum ---------------- */

export const usePop = (at: number, cfg = S.pop) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: cfg });
};

export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; cfg?: typeof S.pop }> = ({
  at,
  children,
  style,
  cfg,
}) => {
  const s = usePop(at, cfg);
  const f = useCurrentFrame();
  const b = interpolate(f, [at, at + 10], [10, 0], clamp);
  return (
    <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), filter: `blur(${b}px)`, ...style }}>
      {children}
    </div>
  );
};

export const FadeUp: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number }> = ({
  at,
  children,
  style,
  dy = 40,
}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 12], [0, 1], { ...clamp, easing: E.snapOut });
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * dy}px)`, filter: `blur(${(1 - t) * 8}px)`, ...style }}>
      {children}
    </div>
  );
};

/* ---------------- Cursor & highlight (design_1.md §6.3) ---------------- */

export const Cursor: React.FC<{ x: number; y: number; at: number; clickAt: number; color?: string; hideAt?: number }> = ({
  x,
  y,
  at,
  clickAt,
  color = C.white,
  hideAt,
}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: E.snapOut });
  const c = f >= clickAt ? Math.min(1, (f - clickAt) / 5) : 0;
  const sc = 1 - 0.15 * Math.sin(c * Math.PI);
  const hide = hideAt === undefined ? 0 : interpolate(f, [hideAt, hideAt + 8], [0, 1], clamp);
  const glow = interpolate(f, [clickAt, clickAt + 10], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: t * (1 - hide), pointerEvents: "none" }}>
      {f >= clickAt && glow < 1 && (
        <div
          style={{
            position: "absolute",
            left: -70 * glow,
            top: -70 * glow,
            width: 140 * glow,
            height: 140 * glow,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            opacity: 0.6 * (1 - glow),
          }}
        />
      )}
      <svg
        width={56}
        height={64}
        viewBox="0 0 28 32"
        style={{
          transform: `translate(${(1 - t) * 160}px, ${(1 - t) * 120}px) scale(${sc})`,
          transformOrigin: "0 0",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))",
        }}
      >
        <path
          d="M2 2 L2 26 L8.5 20 L13 30 L17 28.2 L12.6 18.6 L21.5 18.6 Z"
          fill={color}
          stroke={color === C.white ? "#111" : C.white}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/** Pill putih yang tumbuh dari kiri saat diklik; teks berubah warna */
export const HighlightPill: React.FC<{
  text: string;
  at: number;
  clickAt: number;
  size?: number;
  pill?: string;
  textBefore?: string;
  textAfter?: string;
  dashed?: boolean;
}> = ({ text, at, clickAt, size = 72, pill = C.white, textBefore = C.white, textAfter = C.brandRed, dashed }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: E.snapOut });
  const p = interpolate(f, [clickAt, clickAt + 7], [0, 1], { ...clamp, easing: E.snapOut });
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "6px 30px 12px",
        opacity: t,
        transform: `translateY(${(1 - t) * 40}px)`,
        filter: `blur(${(1 - t) * 8}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          background: pill,
          transform: `scaleX(${p})`,
          transformOrigin: "left center",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          border: dashed ? `2px dashed ${C.nearBlack}` : undefined,
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 700,
          fontStyle: "italic",
          color: p > 0.5 ? textAfter : textBefore,
          whiteSpace: "pre",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ---------------- Ikon kaca (design_1.md §6.5) ---------------- */

export const GlassIcon: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 180, children }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${C.offWhite} 45%, ${C.rosyGrey} 100%)`,
      boxShadow: `inset 0 -10px 24px rgba(145,1,2,.25), 0 14px 34px rgba(0,0,0,.35), 0 0 60px ${C.pinkMist}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{ size?: number; at: number; color?: string }> = ({ size = 60, at, color = C.brandRed }) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [at, at + 10], [1, 0], { ...clamp, easing: E.snapOut });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M4 12.5 L9.5 18 L20 6.5"
        fill="none"
        stroke={color}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={d}
      />
    </svg>
  );
};
