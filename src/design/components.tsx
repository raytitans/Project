import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS as DEFAULT_COLORS, EASE, FONT, Palette, SPRING, TIMING } from "./tokens";

/* Tema: bungkus video dengan <ThemeProvider palette={GOLD}> untuk ganti warna */
const ThemeCtx = React.createContext<Palette>(DEFAULT_COLORS);
export const ThemeProvider: React.FC<{ palette: Palette; children: React.ReactNode }> = ({
  palette,
  children,
}) => <ThemeCtx.Provider value={palette}>{children}</ThemeCtx.Provider>;
export const useTheme = () => React.useContext(ThemeCtx);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* Background: hitam pekat + sinar biru diagonal yang bergeser pelan   */
/* ------------------------------------------------------------------ */
export const Background: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const COLORS = useTheme();
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, -240]); // sinar bergerak pelan
  const streak = (left: number, width: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        top: -600,
        left: left + drift,
        width,
        height: 3200,
        transform: "rotate(28deg)",
        background: `linear-gradient(90deg, transparent, ${COLORS.blueDeep}, transparent)`,
        opacity,
        filter: "blur(60px)",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {streak(-120, 260, 0.55)}
      {streak(620, 180, 0.35)}
      {streak(1250, 320, 0.45)}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* garis tipis biru di tepi atas */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, transparent)`,
          opacity: 0.6,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Caption kata per kata (kinetic typography)                           */
/* ------------------------------------------------------------------ */
export type Word = {
  text: string;
  /** "normal" putih | "accent" biru besar | "small" abu-abu kecil */
  style?: "normal" | "accent" | "small";
  /** geser baseline (px), meniru kata yang "turun" sedikit */
  dy?: number;
  /** pindah ke baris baru sebelum kata ini */
  br?: boolean;
  /** frame muncul (relatif ke Sequence). Jika diisi, mengabaikan stagger -> untuk sinkron VO */
  at?: number;
};

export const Caption: React.FC<{
  words: Word[];
  startFrame?: number;
  stagger?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ words, startFrame = 0, stagger = TIMING.wordStagger, align = "center", style }) => {
  const COLORS = useTheme();
  const frame = useCurrentFrame();
  const lines: Word[][] = [[]];
  words.forEach((w) => {
    if (w.br && lines[lines.length - 1].length) lines.push([]);
    lines[lines.length - 1].push(w);
  });
  let i = -1;
  return (
    <div
      style={{
        fontFamily: FONT.family,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 4,
        width: "100%",
        padding: "0 70px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start" }}>
          {line.map((w) => {
            i++;
            const t0 = w.at ?? startFrame + i * stagger;
            const p = interpolate(frame, [t0, t0 + TIMING.wordIn], [0, 1], {
              ...clamp,
              easing: EASE.out,
            });
            const s = w.style ?? "normal";
            const f = s === "accent" ? FONT.accent : s === "small" ? FONT.small : FONT.caption;
            return (
              <span
                key={i}
                style={{
                  fontSize: f.size,
                  fontWeight: f.weight,
                  color: s === "accent" ? COLORS.blue : s === "small" ? COLORS.gray : COLORS.white,
                  letterSpacing: s === "accent" ? "-0.01em" : 0,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 40 + (w.dy ?? 0)}px) scale(${0.85 + 0.15 * p})`,
                  filter: `blur(${(1 - p) * 8}px)`,
                  display: "inline-block",
                  marginRight: "0.26em",
                  textShadow: s === "accent" ? `0 0 40px ${COLORS.blue}66` : undefined,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Helper: "What if you could|trade" -> Word[] (| = baris baru, *kata* = aksen, _kata_ = kecil) */
export const words = (s: string): Word[] =>
  s.split(" ").flatMap((raw) => {
    const br = raw.startsWith("|");
    let t = br ? raw.slice(1) : raw;
    let style: Word["style"] = "normal";
    if (/^\*.*\*$/.test(t)) {
      style = "accent";
      t = t.slice(1, -1);
    } else if (/^_.*_$/.test(t)) {
      style = "small";
      t = t.slice(1, -1);
    }
    return t ? [{ text: t.replace(/~/g, " "), style, br, dy: style === "small" ? 10 : 0 }] : [];
  });

/* ------------------------------------------------------------------ */
/* Kartu kaca (glassmorphism) dengan glow biru di sudut + grid          */
/* ------------------------------------------------------------------ */
export const GlassCard: React.FC<{
  width: number;
  height: number;
  startFrame?: number;
  grid?: boolean;
  children?: React.ReactNode;
}> = ({ width, height, startFrame = 0, grid = true, children }) => {
  const COLORS = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - startFrame, fps, config: SPRING.soft });
  // kilau diagonal yang menyapu kartu
  const sheen = interpolate(frame - startFrame, [6, 40], [-0.6, 1.4], clamp);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 36,
        padding: 3,
        opacity: pop,
        transform: `scale(${0.8 + 0.2 * pop}) rotateX(${(1 - pop) * 25}deg)`,
        background: `linear-gradient(160deg, ${COLORS.glassStroke}, rgba(255,255,255,0.15) 45%, ${COLORS.blueHighlight} 100%)`,
        boxShadow: `0 0 60px ${COLORS.blue}55, -30px 40px 80px ${COLORS.blueDeep}55`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 33,
          overflow: "hidden",
          background: `radial-gradient(circle at 0% 100%, ${COLORS.blueDeep}cc, transparent 45%), ${COLORS.glassFill}`,
          backdropFilter: "blur(12px)",
        }}
      >
        {grid && (
          <AbsoluteFill
            style={{
              backgroundImage: `linear-gradient(${COLORS.grid} 2px, transparent 2px), linear-gradient(90deg, ${COLORS.grid} 2px, transparent 2px)`,
              backgroundSize: "48px 48px",
            }}
          />
        )}
        <AbsoluteFill
          style={{
            background: `linear-gradient(120deg, transparent ${sheen * 100 - 15}%, rgba(255,255,255,0.35) ${sheen * 100}%, transparent ${sheen * 100 + 15}%)`,
          }}
        />
        <AbsoluteFill>{children}</AbsoluteFill>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Angka berjalan (counter): $88,070 -> $100,000, 18% -> 90%           */
/* ------------------------------------------------------------------ */
export const Counter: React.FC<{
  from: number;
  to: number;
  startFrame?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** jumlah desimal (mis. 1 untuk "2,5") */
  decimals?: number;
  /** "id-ID" -> 644.170.000 ; "en-US" -> 644,170,000 */
  locale?: string;
  style?: React.CSSProperties;
}> = ({ from, to, startFrame = 0, duration = TIMING.counter, prefix = "", suffix = "", decimals = 0, locale = "en-US", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [startFrame, startFrame + duration], [from, to], {
    ...clamp,
    easing: EASE.counter,
  });
  return (
    <span style={{ fontFamily: FONT.family, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Ring progress (dipakai di "You keep up to 90%")                      */
/* ------------------------------------------------------------------ */
export const RadialProgress: React.FC<{
  to: number; // 0..100
  size?: number;
  startFrame?: number;
  duration?: number;
}> = ({ to, size = 260, startFrame = 0, duration = TIMING.counter }) => {
  const COLORS = useTheme();
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + duration], [0, to / 100], {
    ...clamp,
    easing: EASE.counter,
  });
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={COLORS.blue}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${c * p} ${c}`}
        style={{ filter: `drop-shadow(0 0 12px ${COLORS.blueBright})` }}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Angka hero: muncul dari bawah dengan overshoot (90%, $99)            */
/* ------------------------------------------------------------------ */
export const HeroText: React.FC<{ children: React.ReactNode; startFrame?: number }> = ({
  children,
  startFrame = 0,
}) => {
  const COLORS = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: SPRING.pop });
  return (
    <div
      style={{
        fontFamily: FONT.family,
        fontSize: FONT.hero.size,
        fontWeight: FONT.hero.weight,
        color: COLORS.blue,
        lineHeight: 1,
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 120}px) scale(${0.6 + 0.4 * s})`,
        textShadow: `0 0 60px ${COLORS.blue}88`,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene: kamera + transisi masuk/keluar                                */
/* ------------------------------------------------------------------ */
export type Transition = "none" | "pushIn" | "whip" | "tilt" | "zoomOut" | "depthBlur";

const transform = (type: Transition, p: number, dir: "in" | "out") => {
  // p: 0 = di luar layar/tidak terlihat, 1 = posisi normal
  const q = 1 - p;
  switch (type) {
    case "pushIn": // kamera maju lalu gelap
      return dir === "out"
        ? { transform: `scale(${1 + q * 0.6}) translateX(${-q * 200}px)`, opacity: p, filter: `blur(${q * 10}px)` }
        : { transform: `scale(${0.9 + p * 0.1})`, opacity: p, filter: "none" };
    case "whip": // whip pan ke kiri dengan motion blur
      return {
        transform: `translateX(${(dir === "out" ? -1 : 1) * q * 1100}px) skewX(${(dir === "out" ? 1 : -1) * q * 8}deg)`,
        opacity: 1,
        filter: `blur(${Math.sin(q * Math.PI) * 18}px)`,
      };
    case "tilt": { // masuk miring 3D dari kanan bawah, keluar ke kiri atas
      const k = dir === "out" ? -1 : 1;
      return {
        transform: `perspective(1600px) translate(${k * q * 500}px, ${k * q * 400}px) rotateZ(${-k * q * 30}deg) rotateY(${-k * q * 40}deg)`,
        opacity: Math.min(1, p * 2),
        filter: `blur(${q * 8}px)`,
      };
    }
    case "zoomOut": // mengecil ke tengah, seperti kamera mundur
      return {
        transform: `scale(${dir === "out" ? 0.3 + p * 0.7 : 1.6 - p * 0.6}) rotate(${(dir === "out" ? -1 : 1) * q * 12}deg)`,
        opacity: p,
        filter: "none",
      };
    case "depthBlur": // mundur ke belakang + defocus
      return dir === "out"
        ? { transform: `scale(${0.85 + p * 0.15})`, opacity: 0.35 + p * 0.65, filter: `blur(${q * 14}px)` }
        : { transform: `scale(${1.15 - p * 0.15})`, opacity: Math.sqrt(p), filter: `blur(${q * 14}px)` };
    default:
      return { transform: "", opacity: 1, filter: "none" };
  }
};

/**
 * Bungkus setiap scene dengan <Scene>. Taruh di dalam <Sequence from durationInFrames>.
 * Scene saling overlap sebanyak TIMING.transition frame supaya transisinya mulus.
 */
export const Scene: React.FC<{
  duration: number;
  enter?: Transition;
  exit?: Transition;
  enterFrames?: number;
  exitFrames?: number;
  /** kamera drift pelan sepanjang scene (Ken Burns) */
  drift?: boolean;
  children: React.ReactNode;
}> = ({
  duration,
  enter = "none",
  exit = "none",
  enterFrames = TIMING.transition,
  exitFrames = TIMING.transition,
  drift = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const pIn = interpolate(frame, [0, enterFrames], [0, 1], { ...clamp, easing: EASE.inOut });
  const pOut = interpolate(frame, [duration - exitFrames, duration], [1, 0], {
    ...clamp,
    easing: EASE.inOut,
  });
  const a = enter === "none" ? transform("none", 1, "in") : transform(enter, pIn, "in");
  const b = exit === "none" ? transform("none", 1, "out") : transform(exit, pOut, "out");
  const zoom = drift ? interpolate(frame, [0, duration], [1, 1.06]) : 1;
  return (
    <AbsoluteFill style={{ opacity: a.opacity * b.opacity, filter: [a.filter, b.filter].filter((f) => f !== "none").join(" ") || undefined }}>
      <AbsoluteFill style={{ transform: `${b.transform} ${a.transform} scale(${zoom})` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
