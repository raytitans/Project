/**
 * Versi "Midnight Electric" (design.md) dari video AHP Pensiun.
 * Isi, angka dan timing sama dengan AhpVideo (design_1). Timing kata dari vo.ts.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, Caption, Counter, GlassCard, RadialProgress, Word, useTheme } from "../design/components";
import { COLORS, EASE, FONT, SPRING } from "../design/tokens";
import { Check, Cursor } from "./parts";
import { w } from "./vo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const F = FONT.family;
export const MIDNIGHT_DURATION = 75 * 30;
const withVo = false; // draf tanpa VO

/* ------------------------------------------------------------------ */
/* Scene & transisi kamera (design.md §6): tanpa hard cut                */
/* ------------------------------------------------------------------ */
type Tr = "pushIn" | "whip" | "tilt" | "zoomOut" | "depthBlur";
const TR: Tr[] = ["pushIn", "whip", "depthBlur", "tilt", "zoomOut", "whip", "depthBlur"];
const OVF: Record<Tr, number> = { whip: 10, pushIn: 18, tilt: 18, zoomOut: 18, depthBlur: 18 };
const B = [0, w(1) - 10, w(2) - 10, w(4) - 12, w(5) - 12, w(7) - 12, w(9) - 12, w(10) - 12, MIDNIGHT_DURATION];

const tf = (type: Tr, p: number, dir: "in" | "out") => {
  const q = 1 - p;
  switch (type) {
    case "pushIn":
      return dir === "out"
        ? { t: `scale(${1 + q * 0.6}) translateX(${-q * 200}px)`, o: p, f: q * 10 }
        : { t: `scale(${0.9 + p * 0.1})`, o: p, f: 0 };
    case "whip":
      return {
        t: `translateX(${(dir === "out" ? -1 : 1) * q * 1100}px) skewX(${(dir === "out" ? 1 : -1) * q * 8}deg)`,
        o: 1,
        f: Math.sin(q * Math.PI) * 18,
      };
    case "tilt": {
      const k = dir === "out" ? -1 : 1;
      return {
        t: `perspective(1600px) translate(${k * q * 500}px, ${k * q * 400}px) rotateZ(${-k * q * 30}deg) rotateY(${-k * q * 40}deg)`,
        o: Math.min(1, p * 2),
        f: q * 8,
      };
    }
    case "zoomOut":
      return {
        t: `scale(${dir === "out" ? 0.3 + p * 0.7 : 1.6 - p * 0.6}) rotate(${(dir === "out" ? -1 : 1) * q * 12}deg)`,
        o: p,
        f: 0,
      };
    case "depthBlur":
      return dir === "out"
        ? { t: `scale(${0.85 + p * 0.15})`, o: 0.35 * p + 0.65 * p * p, f: q * 14 }
        : { t: `scale(${1.15 - p * 0.15})`, o: Math.sqrt(p), f: q * 14 };
  }
};

const Layer: React.FC<{ i: number; disclaimer?: boolean; children: React.ReactNode }> = ({ i, disclaimer = true, children }) => {
  const f = useCurrentFrame();
  const start = B[i];
  const exit = i < TR.length ? TR[i] : null;
  const enter = i > 0 ? TR[i - 1] : null;
  const end = exit ? B[i + 1] + OVF[exit] : B[i + 1];
  if (f < start || f >= end) return null;
  const pIn = enter ? interpolate(f, [start, start + OVF[enter]], [0, 1], { ...clamp, easing: EASE.inOut }) : 1;
  const pOut = exit ? interpolate(f, [B[i + 1], B[i + 1] + OVF[exit]], [1, 0], { ...clamp, easing: EASE.inOut }) : 1;
  const a = enter ? tf(enter, pIn, "in") : { t: "", o: 1, f: 0 };
  const b = exit ? tf(exit, pOut, "out") : { t: "", o: 1, f: 0 };
  const zoom = interpolate(f, [start, end], [1, 1.06]); // drift konstan
  const blur = a.f + b.f;
  return (
    <AbsoluteFill style={{ opacity: a.o * b.o, filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
      <AbsoluteFill style={{ transform: `${b.t} ${a.t} scale(${zoom})` }}>
        {children}
        {disclaimer && <Disclaimer />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Disclaimer: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      bottom: 150,
      textAlign: "center",
      fontFamily: F,
      fontSize: 21,
      fontWeight: 500,
      color: "rgba(163,167,179,0.75)",
      whiteSpace: "nowrap",
    }}
  >
    Ilustrasi by Raymon, ketentuan sesuai Polis, AXA berizin & diawasi OJK.
  </div>
);

/* ------------------------------------------------------------------ */
/* Helper kecil                                                         */
/* ------------------------------------------------------------------ */
const Abs: React.FC<{ top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, children, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
    {children}
  </div>
);

const W = (text: string, at: number, style: Word["style"] = "normal", br = false): Word => ({
  text,
  at,
  style,
  br,
  dy: style === "small" ? 10 : 0,
});

const usePop = (at: number, cfg: { damping: number; stiffness: number; mass: number } = SPRING.pop) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: cfg });
};

const Hero: React.FC<{ at: number; children: React.ReactNode; size?: number; color?: string }> = ({ at, children, size = 200, color }) => {
  const C = useTheme();
  const s = usePop(at);
  const c = color ?? C.blue;
  return (
    <div
      style={{
        fontFamily: F,
        fontSize: size,
        fontWeight: 600,
        color: c,
        lineHeight: 1,
        whiteSpace: "nowrap",
        opacity: Math.min(1, s * 1.5),
        transform: `translateY(${(1 - s) * 120}px) scale(${0.6 + 0.4 * s})`,
        textShadow: `0 0 60px ${c}88`,
      }}
    >
      {children}
    </div>
  );
};

const Fade: React.FC<{ at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, out, children, style }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: EASE.out });
  const o = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], { ...clamp, easing: EASE.in });
  return (
    <div style={{ opacity: t * (1 - o), transform: `translateY(${(1 - t) * 30}px)`, filter: `blur(${(1 - t) * 8 + o * 14}px)`, ...style }}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* S1 — Hook                                                            */
/* ------------------------------------------------------------------ */
const S1: React.FC = () => {
  const C = useTheme();
  const f = useCurrentFrame();
  const draw = interpolate(f, [w(0, 7), w(0, 14)], [0, 1], { ...clamp, easing: EASE.out });
  const pulse = 1 + 0.03 * Math.sin((f - w(0, 14)) / 6);
  return (
    <>
      <Abs top={380}>
        <Caption
          words={[
            W("Tahukah", w(0, 0), "small"),
            W("kamu,", w(0, 1), "small"),
            W("berapa", w(0, 2), "normal", true),
            W("total", w(0, 3)),
            W("premi", w(0, 4)),
            W("asuransi", w(0, 5), "accent", true),
            W("kesehatan?", w(0, 6), "accent", true),
          ]}
        />
      </Abs>
      <Abs top={1010}>
        <GlassCard width={900} height={300} startFrame={w(0, 7) - 6}>
          <div style={{ position: "absolute", left: 120, right: 120, top: 120, height: 8 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(255,255,255,0.12)" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${draw * 100}%`,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${C.blueDeep}, ${C.blueBright})`,
                boxShadow: `0 0 24px ${C.blueBright}`,
              }}
            />
            {[
              { x: 0, label: "30", at: w(0, 9) },
              { x: 100, label: "84", at: w(0, 12) },
            ].map((n) => (
              <Node key={n.label} x={n.x} label={n.label} at={n.at} />
            ))}
          </div>
        </GlassCard>
      </Abs>
      <Abs top={1400}>
        <div style={{ transform: `scale(${pulse})` }}>
          <Hero at={w(0, 14)} size={180}>
            Rp ?
          </Hero>
        </div>
      </Abs>
    </>
  );
};

const Node: React.FC<{ x: number; label: string; at: number }> = ({ x, label, at }) => {
  const C = useTheme();
  const s = usePop(at);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: -46, width: 0 }}>
      <div
        style={{
          transform: `translateX(-50%) scale(${s})`,
          opacity: Math.min(1, s * 1.5),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 140,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${C.blueHighlight}, ${C.blueBright} 45%, ${C.blueDeep} 100%)`,
            boxShadow: `0 0 40px ${C.blueBright}aa`,
            color: C.white,
            fontFamily: F,
            fontWeight: 600,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {label}
        </div>
        <div style={{ marginTop: 14, fontFamily: F, fontSize: 30, fontWeight: 500, color: C.blueHighlight }}>usia</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* S2 — Rp2,04 M                                                        */
/* ------------------------------------------------------------------ */
const S2: React.FC = () => (
  <Abs top={640}>
    <Caption words={[W("Total", w(1, 0) - 4), W("premi", w(1, 0) - 1), W("kesehatan", w(1, 0) + 2)]} />
    <div style={{ marginTop: 50 }}>
      <Hero at={w(1, 1)} size={210}>
        <Counter from={0} to={2.04} decimals={2} locale="id-ID" startFrame={w(1, 1)} duration={36} prefix="Rp" />
        <span style={{ fontSize: 130 }}> M</span>
      </Hero>
    </div>
    <div style={{ marginTop: 40 }}>
      <Caption words={[W("usia", w(1, 2)), W("30", w(1, 2) + 3), W("–", w(1, 2) + 5, "small"), W("84", w(1, 2) + 7), W("tahun", w(1, 2) + 9, "small")]} />
    </div>
  </Abs>
);

/* ------------------------------------------------------------------ */
/* S3 — 30–64 vs 65–84                                                  */
/* ------------------------------------------------------------------ */
const Bar: React.FC<{ x: number; h: number; at: number; valAt: number; value: React.ReactNode; label: string; strong?: boolean }> = ({
  x,
  h,
  at,
  valAt,
  value,
  label,
  strong,
}) => {
  const C = useTheme();
  const f = useCurrentFrame();
  const g = usePop(at, SPRING.soft);
  const base = 720;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          width: 230,
          top: base - h * g,
          height: h * g,
          opacity: g > 0.02 ? 1 : 0,
          borderRadius: "22px 22px 6px 6px",
          background: strong
            ? `linear-gradient(180deg, ${C.blueHighlight}, ${C.blueBright} 40%, ${C.blueDeep})`
            : `linear-gradient(180deg, ${C.navy600}, ${C.navy800})`,
          border: `2px solid ${strong ? C.blueHighlight : "rgba(255,255,255,0.25)"}`,
          boxShadow: strong ? `0 0 60px ${C.blueBright}88` : undefined,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 80,
          width: 390,
          top: base - h * g - 90,
          textAlign: "center",
          opacity: interpolate(f, [valAt, valAt + 8], [0, 1], clamp),
          fontFamily: F,
          fontWeight: 600,
          fontSize: 60,
          color: strong ? C.blue : C.white,
          textShadow: strong ? `0 0 40px ${C.blue}88` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 60,
          width: 350,
          top: base + 22,
          textAlign: "center",
          fontFamily: F,
          fontSize: 34,
          fontWeight: 500,
          color: strong ? C.blueHighlight : C.gray,
          opacity: interpolate(f, [at - 6, at + 6], [0, 1], clamp),
        }}
      >
        {label}
      </div>
    </>
  );
};

const S3: React.FC = () => {
  const C = useTheme();
  const f = useCurrentFrame();
  const swap = w(3, 0) - 4;
  const hMax = 520;
  return (
    <>
      <Abs top={300}>
        <div style={{ position: "relative", width: "100%", height: 170 }}>
          <Fade at={0} out={swap} style={{ position: "absolute", left: 0, right: 0 }}>
            <Caption words={[W("Usia", w(2, 0)), W("30–64", w(2, 1), "accent")]} />
          </Fade>
          <div style={{ position: "absolute", left: 0, right: 0 }}>
            <Caption words={[W("Usia", w(3, 1)), W("65–84", w(3, 2), "accent")]} />
          </div>
        </div>
      </Abs>
      <Abs top={560}>
        <GlassCard width={900} height={900} startFrame={w(2, 0)}>
          <Bar
            x={150}
            h={(hMax * 558.9) / 1482.3}
            at={w(2, 7)}
            valAt={w(2, 8)}
            label="usia 30–64"
            value={<Counter from={0} to={558.9} decimals={1} locale="id-ID" startFrame={w(2, 8)} duration={30} prefix="Rp" suffix=" jt" />}
          />
          <Bar
            x={520}
            h={hMax}
            at={w(3, 9)}
            valAt={w(3, 10)}
            strong
            label="usia 65–84"
            value={<Counter from={0} to={1.48} decimals={2} locale="id-ID" startFrame={w(3, 10)} duration={36} prefix="Rp" suffix=" M" />}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 50,
              textAlign: "center",
              fontFamily: F,
              fontSize: 32,
              fontWeight: 500,
              color: C.gray,
              opacity: interpolate(f, [w(3, 6), w(3, 6) + 12], [0, 1], clamp),
            }}
          >
            Premi/tahun: Rp38,4 jt → <span style={{ color: C.white }}>Rp118 jt</span>
          </div>
        </GlassCard>
      </Abs>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S4 — 72,6%                                                           */
/* ------------------------------------------------------------------ */
const S4: React.FC = () => {
  const C = useTheme();
  const s = usePop(w(4, 0) - 4, SPRING.soft);
  return (
    <>
      <Abs top={330}>
        <Caption words={[W("Hampir", w(4, 0)), W("¾", w(4, 1)), W("biaya", w(4, 1) + 4)]} />
      </Abs>
      <Abs top={560}>
        <div style={{ position: "relative", width: 600, height: 600, transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}>
          <svg width={600} height={600} style={{ position: "absolute", inset: 0 }}>
            <circle cx={300} cy={300} r={286} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
          </svg>
          <div style={{ position: "absolute", inset: 0 }}>
            <RadialProgress to={72.6} size={600} startFrame={w(4, 0)} duration={45} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: 160, color: C.blue, textShadow: `0 0 60px ${C.blue}88`, lineHeight: 1 }}>
              <Counter from={0} to={72.6} decimals={1} locale="id-ID" startFrame={w(4, 0)} duration={45} suffix="%" />
            </div>
            <div style={{ fontFamily: F, fontSize: 34, fontWeight: 500, color: C.blueHighlight, marginTop: 10 }}>usia 65–84</div>
          </div>
        </div>
      </Abs>
      <Abs top={1250}>
        <Caption words={[W("justru", w(4, 5), "small"), W("di", w(4, 6), "small"), W("usia", w(4, 7), "accent", true), W("pensiun", w(4, 8), "accent")]} />
      </Abs>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S5 — Disiapkan sejak sekarang, Rp10 jt × 5 tahun                     */
/* ------------------------------------------------------------------ */
const S5: React.FC = () => {
  const C = useTheme();
  const f = useCurrentFrame();
  const swap = w(6, 0) - 8;
  return (
    <>
      <Fade at={0} out={swap} style={{ position: "absolute", left: 0, right: 0, top: 640 }}>
        <Caption
          words={[
            W("Bagaimana", w(5, 0)),
            W("kalau", w(5, 1)),
            W("disiapkan", w(5, 2), "normal", true),
            W("sejak", w(5, 3), "accent", true),
            W("sekarang?", w(5, 4), "accent"),
          ]}
        />
      </Fade>
      {f >= swap && (
        <>
          <Abs top={360}>
            <Caption words={[W("Sisihkan", w(6, 0)), W("sekitar", w(6, 1), "small")]} />
          </Abs>
          <Abs top={530}>
            <GlassCard width={820} height={380} startFrame={w(6, 2) - 4}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: F, fontSize: 150, fontWeight: 600, color: C.blue, textShadow: `0 0 50px ${C.blue}88`, lineHeight: 1 }}>
                  <Counter from={0} to={10} startFrame={w(6, 2)} duration={24} prefix="Rp" suffix=" jt" locale="id-ID" />
                </div>
                <div style={{ fontFamily: F, fontSize: 44, fontWeight: 500, color: C.blueHighlight, marginTop: 16 }}>per bulan</div>
              </div>
            </GlassCard>
          </Abs>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 22 }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <YearBlock key={k} n={k + 1} at={w(6, 5) + k * 6} />
            ))}
          </div>
          <Abs top={1230}>
            <Caption words={[W("selama", w(6, 5)), W("5", w(6, 6), "accent"), W("tahun", w(6, 7), "small")]} />
          </Abs>
        </>
      )}
    </>
  );
};

const YearBlock: React.FC<{ n: number; at: number }> = ({ n, at }) => {
  const C = useTheme();
  const s = usePop(at);
  return (
    <div
      style={{
        width: 140,
        height: 150,
        borderRadius: 24,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 1.5),
        background: `radial-gradient(circle at 0% 100%, ${C.blueDeep}aa, transparent 60%), ${C.glassFill}`,
        border: `2px solid ${C.blueHighlight}aa`,
        boxShadow: `0 0 30px ${C.blue}55`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, color: C.gray }}>tahun</div>
      <div style={{ fontSize: 64, fontWeight: 600, color: C.white, lineHeight: 1 }}>{n}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* S6 — Cair Rp2,1 M → Cukup                                            */
/* ------------------------------------------------------------------ */
const S6: React.FC = () => {
  const C = useTheme();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = spring({ frame: f - w(8, 0), fps, config: SPRING.soft });
  const seg = (at: number) => interpolate(f, [at, at + 24], [0, 1], { ...clamp, easing: EASE.out });
  const s1 = seg(w(8, 2));
  const s2 = seg(w(8, 7));
  const BW = 760;
  const w1 = (BW * 603.54) / 2100;
  const w2 = (BW * 1482.31) / 2100;
  const ok = usePop(w(8, 11));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380 - up * 120, transform: `scale(${1 - up * 0.25})` }}>
        <Caption words={[W("Di", w(7, 0)), W("usia", w(7, 1)), W("65,", w(7, 2)), W("cair", w(7, 5), "small")]} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Hero at={w(7, 6)} size={230}>
            <Counter from={0} to={2.1} decimals={1} locale="id-ID" startFrame={w(7, 6)} duration={36} prefix="Rp" />
            <span style={{ fontSize: 140 }}> M</span>
          </Hero>
        </div>
      </div>

      <Abs top={800}>
        <GlassCard width={900} height={660} startFrame={w(8, 0)} grid>
          <div style={{ position: "absolute", left: 70, top: 70, width: BW, height: 70 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(255,255,255,0.08)" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: w1 * s1,
                borderRadius: "16px 0 0 16px",
                background: `linear-gradient(180deg, ${C.blueHighlight}, ${C.blueBright})`,
                boxShadow: `0 0 30px ${C.blueBright}88`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: w1 + 4,
                top: 0,
                bottom: 0,
                width: w2 * s2,
                borderRadius: s2 > 0.99 ? "0 16px 16px 0" : 0,
                background: `linear-gradient(180deg, ${C.blueDeep}, ${C.navy600})`,
                border: `2px solid ${C.blue}`,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 190, display: "flex", flexDirection: "column", gap: 34 }}>
            {[
              { at: w(8, 3), color: C.blueHighlight, title: "Semua premi polis kembali", val: "Rp603,5 jt" },
              { at: w(8, 8), color: C.blueDeep, title: "Biaya kesehatan s.d. usia 84", val: "Rp1,48 M" },
            ].map((r) => (
              <Fade key={r.title} at={r.at}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: r.color, flexShrink: 0, boxShadow: `0 0 14px ${r.color}` }} />
                  <div style={{ flex: 1, fontFamily: F, fontSize: 32, fontWeight: 500, color: C.white, whiteSpace: "nowrap" }}>{r.title}</div>
                  <div style={{ fontFamily: F, fontSize: 38, fontWeight: 600, color: C.blueHighlight, whiteSpace: "nowrap" }}>{r.val}</div>
                  <Check at={r.at + 6} size={46} color={C.blueBright} />
                </div>
              </Fade>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div
              style={{
                transform: `scale(${ok})`,
                opacity: Math.min(1, ok * 1.5),
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 50px",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${C.blueDeep}, ${C.blueBright})`,
                boxShadow: `0 0 40px ${C.blueBright}aa`,
              }}
            >
              <Check at={w(8, 11) + 4} size={52} color={C.white} />
              <span style={{ fontFamily: F, fontSize: 56, fontWeight: 600, color: C.white }}>Cukup</span>
            </div>
            <Fade at={w(8, 11) + 10}>
              <div style={{ fontFamily: F, fontSize: 28, fontWeight: 500, color: C.gray }}>masih tersisa ±Rp14 jt</div>
            </Fade>
          </div>
        </GlassCard>
      </Abs>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S7 — Proteksi jiwa hingga Rp3,15 M (orb biru 3D, design.md §4.3)     */
/* ------------------------------------------------------------------ */
const Orb: React.FC<{ at: number }> = ({ at }) => {
  const C = useTheme();
  const f = useCurrentFrame();
  const s = usePop(at);
  const d = interpolate(f, [at + 4, at + 24], [1, 0], { ...clamp, easing: EASE.out });
  const float = Math.sin(f / 22) * 10;
  return (
    <div
      style={{
        width: 360,
        height: 360,
        borderRadius: "50%",
        transform: `translateY(${float}px) scale(${s})`,
        opacity: Math.min(1, s * 1.5),
        background: `radial-gradient(circle at 35% 28%, ${C.blueHighlight} 0%, ${C.blueBright} 30%, ${C.blueDeep} 65%, ${C.navy900} 100%)`,
        boxShadow: `0 0 120px ${C.blueBright}88, inset -20px -30px 60px ${C.blueGlow}aa, inset 10px 14px 30px rgba(255,255,255,0.35)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={170} height={170} viewBox="0 0 48 48">
        <path
          d="M24 5 L39 11 V23 C39 32 32.5 39.5 24 43 C15.5 39.5 9 32 9 23 V11 Z"
          fill="none"
          stroke={C.white}
          strokeWidth={2.6}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={d}
        />
        <path
          d="M24 31 C24 31 16.5 26.5 16.5 21.5 C16.5 18.8 18.6 17 20.8 17 C22.3 17 23.4 17.8 24 19 C24.6 17.8 25.7 17 27.2 17 C29.4 17 31.5 18.8 31.5 21.5 C31.5 26.5 24 31 24 31 Z"
          fill={C.white}
          opacity={1 - d}
        />
      </svg>
    </div>
  );
};

const S7: React.FC = () => (
  <>
    <Abs top={330}>
      <Caption words={[W("Dan", w(9, 0), "small"), W("selama", w(9, 1), "small"), W("itu,", w(9, 2), "small"), W("kamu", w(9, 3), "normal", true), W("tetap", w(9, 4)), W("punya", w(9, 5))]} />
    </Abs>
    <Abs top={640}>
      <Orb at={w(9, 2)} />
    </Abs>
    <Abs top={1100}>
      <Caption words={[W("proteksi", w(9, 6)), W("jiwa,", w(9, 7))]} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 20 }}>
        <Caption words={[W("hingga", w(9, 8), "small")]} style={{ width: "auto", padding: 0 }} />
        <Hero at={w(9, 9)} size={150}>
          <Counter from={0} to={3.15} decimals={2} locale="id-ID" startFrame={w(9, 9)} duration={36} prefix="Rp" />
          <span style={{ fontSize: 90 }}> M</span>
        </Hero>
      </div>
    </Abs>
  </>
);

/* ------------------------------------------------------------------ */
/* S8 — Penutup + CTA                                                   */
/* ------------------------------------------------------------------ */
const Bubble: React.FC<{ color: string }> = ({ color }) => (
  <svg width={60} height={60} viewBox="0 0 24 24">
    <path
      d="M4 5.5 C4 4.7 4.7 4 5.5 4 H18.5 C19.3 4 20 4.7 20 5.5 V14.5 C20 15.3 19.3 16 18.5 16 H10 L6 20 V16 H5.5 C4.7 16 4 15.3 4 14.5 Z"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <circle cx={8.5} cy={10} r={1.2} fill={color} />
    <circle cx={12} cy={10} r={1.2} fill={color} />
    <circle cx={15.5} cy={10} r={1.2} fill={color} />
  </svg>
);

const CommentButton: React.FC<{ at: number; clickAt: number }> = ({ at, clickAt }) => {
  const C = useTheme();
  const f = useCurrentFrame();
  const s = usePop(at);
  const fill = interpolate(f, [clickAt, clickAt + 7], [0, 1], { ...clamp, easing: EASE.out });
  const press = f >= clickAt ? 1 - 0.08 * Math.sin(Math.min(1, (f - clickAt) / 6) * Math.PI) : 1;
  const ring = interpolate(f, [clickAt, clickAt + 18], [0, 1], clamp);
  return (
    <div style={{ position: "relative", transform: `scale(${s * press})`, opacity: Math.min(1, s * 1.5) }}>
      {f >= clickAt && ring < 1 && (
        <div style={{ position: "absolute", inset: -24 * ring, borderRadius: 999, border: `4px solid ${C.blueHighlight}`, opacity: 1 - ring }} />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "26px 60px",
          borderRadius: 999,
          border: `3px solid ${C.blueBright}`,
          background: `linear-gradient(90deg, ${C.blueBright} ${fill * 100}%, ${C.glassFill} ${fill * 100}%)`,
          boxShadow: `0 0 ${30 + fill * 40}px ${C.blueBright}${fill > 0.5 ? "cc" : "66"}`,
        }}
      >
        <Bubble color={C.white} />
        <span style={{ fontFamily: F, fontSize: 62, fontWeight: 500, color: C.white }}>Komen</span>
        <span style={{ fontFamily: F, fontSize: 70, fontWeight: 700, color: C.white, letterSpacing: "0.02em" }}>HITUNG</span>
      </div>
    </div>
  );
};

const Phone: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={40} viewBox="0 0 24 24">
    <path
      d="M6.6 3.5 L9.4 3.2 L11 7.6 L9 9.2 C9.9 11.4 12.6 14.1 14.8 15 L16.4 13 L20.8 14.6 L20.5 17.4 C20.4 18.6 19.4 19.5 18.2 19.4 C10.8 18.9 5.1 13.2 4.6 5.8 C4.5 4.6 5.4 3.6 6.6 3.5 Z"
      fill={color}
    />
  </svg>
);

const ContactCard: React.FC<{ at: number }> = ({ at }) => {
  const C = useTheme();
  const f = useCurrentFrame();
  const float = f > at + 20 ? Math.sin((f - at) / 22) * 6 : 0;
  return (
    <div style={{ transform: `translateY(${float}px)` }}>
      <GlassCard width={880} height={300} startFrame={at} grid={false}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F, fontSize: 96, fontWeight: 700, color: C.white, letterSpacing: "0.08em", lineHeight: 1 }}>RAYMON</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20 }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${C.blueHighlight}, ${C.blueBright} 50%, ${C.blueDeep})`,
                boxShadow: `0 0 24px ${C.blueBright}aa`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone color={C.white} />
            </div>
            <div style={{ fontFamily: F, fontSize: 62, fontWeight: 600, color: C.blueHighlight, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              0812 8909 0202
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const S8: React.FC = () => {
  const f = useCurrentFrame();
  const swap = w(11, 0) - 8;
  const qOut = interpolate(f, [swap, swap + 12], [0, 1], { ...clamp, easing: EASE.out });
  const cta = w(12, 0) - 8;
  const qCta = interpolate(f, [cta, cta + 14], [0, 1], { ...clamp, easing: EASE.out });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          transform: `translateY(${-qOut * 320}px) scale(${1 - qOut * 0.35})`,
          opacity: (1 - qOut * 0.6) * (1 - qCta),
          filter: `blur(${qOut * 4}px)`,
        }}
      >
        <Caption words={[W("Pensiun", w(10, 0)), W("tenang,", w(10, 1), "accent"), W("tanpa", w(10, 2), "small", true), W("jadi", w(10, 3), "small"), W("beban.", w(10, 4), "small")]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, transform: `translateY(${-qCta * 600}px) scale(${1 - qCta * 0.25})` }}>
        <Caption words={[W("Mulai", w(11, 0)), W("siapkan", w(11, 1)), W("dari", w(11, 2), "accent", true), W("sekarang", w(11, 3), "accent")]} />
      </div>
      <Abs top={830}>
        <CommentButton at={w(12, 0)} clickAt={w(12, 1)} />
      </Abs>
      <Cursor x={760} y={910} at={w(12, 0) + 2} clickAt={w(12, 1)} color={COLORS.white} hideAt={w(12, 4) - 4} />
      <Abs top={1100}>
        <ContactCard at={w(12, 4)} />
      </Abs>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Audio (design.md §8)                                                 */
/* ------------------------------------------------------------------ */
type Sfx = { at: number; src: string; vol: number };
const ticks = (at: number, dur: number, vol = 0.16): Sfx[] =>
  Array.from({ length: Math.floor(dur / 3) }, (_, k) => ({ at: at + k * 3, src: "tick", vol: vol * (1 - (k * 3) / dur / 1.6) }));

const SFX: Sfx[] = [
  ...TR.map((t, k) => ({ at: B[k + 1] - 3, src: t === "whip" ? "whoosh" : "whoosh_long", vol: 0.45 })),
  // S1
  { at: w(0, 5), src: "pop", vol: 0.3 },
  { at: w(0, 7) - 6, src: "shimmer", vol: 0.3 },
  { at: w(0, 9), src: "pop", vol: 0.35 },
  { at: w(0, 12), src: "pop", vol: 0.4 },
  { at: w(0, 14), src: "chime", vol: 0.3 },
  // S2
  ...ticks(w(1, 1), 36),
  { at: w(1, 1) + 34, src: "chime", vol: 0.35 },
  // S3
  { at: w(2, 0), src: "shimmer", vol: 0.3 },
  { at: w(2, 7), src: "rise_soft", vol: 0.3 },
  ...ticks(w(2, 8), 30),
  { at: w(3, 2), src: "pop", vol: 0.3 },
  { at: w(3, 9), src: "rise_soft", vol: 0.35 },
  ...ticks(w(3, 10), 36),
  { at: w(3, 10) + 34, src: "chime", vol: 0.3 },
  // S4
  ...ticks(w(4, 0), 45, 0.13),
  { at: w(4, 0) + 44, src: "chime", vol: 0.35 },
  { at: w(4, 7), src: "pop", vol: 0.3 },
  // S5
  { at: w(5, 3), src: "pop", vol: 0.35 },
  { at: w(6, 2) - 4, src: "shimmer", vol: 0.3 },
  ...ticks(w(6, 2), 24),
  ...[0, 1, 2, 3, 4].map((k) => ({ at: w(6, 5) + k * 6, src: `pop${k}`, vol: 0.38 })),
  // S6
  { at: w(7, 6) - 45, src: "riser", vol: 0.3 },
  ...ticks(w(7, 6), 36),
  { at: w(7, 6), src: "boom", vol: 0.45 },
  { at: w(8, 0), src: "shimmer", vol: 0.3 },
  { at: w(8, 3) + 6, src: "chime", vol: 0.28 },
  { at: w(8, 8) + 6, src: "chime", vol: 0.28 },
  { at: w(8, 11), src: "pop", vol: 0.45 },
  { at: w(8, 11) + 4, src: "chime", vol: 0.35 },
  // S7
  { at: w(9, 2), src: "pop", vol: 0.4 },
  { at: w(9, 2) + 4, src: "shimmer", vol: 0.3 },
  ...ticks(w(9, 9), 36),
  { at: w(9, 9) + 34, src: "chime", vol: 0.3 },
  // S8
  { at: w(10, 1), src: "pop", vol: 0.3 },
  { at: w(11, 2), src: "pop", vol: 0.3 },
  { at: w(12, 0) - 3, src: "whoosh", vol: 0.35 },
  { at: w(12, 0), src: "pop", vol: 0.4 },
  { at: w(12, 1), src: "click", vol: 0.9 },
  { at: w(12, 1) + 2, src: "pop1", vol: 0.35 },
  { at: w(12, 4) - 2, src: "whoosh_long", vol: 0.4 },
  { at: w(12, 4), src: "boom", vol: 0.35 },
  { at: w(12, 4) + 6, src: "shimmer", vol: 0.45 },
];

const Soundtrack: React.FC = () => {
  const end = MIDNIGHT_DURATION;
  const mv = withVo ? 0.22 : 0.4;
  return (
    <>
      <Audio src={staticFile("ahp/music.wav")} volume={(f) => interpolate(f, [0, 20, end - 60, end - 5], [0, mv, mv, 0], clamp)} />
      {withVo && <Audio src={staticFile("ahp/vo.wav")} />}
      {SFX.filter((s) => s.at >= 0 && s.at < end).map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={Math.min(90, end - s.at)}>
          <Audio src={staticFile(`ahp/sfx/${s.src}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </>
  );
};

export const AhpMidnight: React.FC = () => (
  <Background>
    <Layer i={0} disclaimer={false}>
      <S1 />
    </Layer>
    <Layer i={1}>
      <S2 />
    </Layer>
    <Layer i={2}>
      <S3 />
    </Layer>
    <Layer i={3}>
      <S4 />
    </Layer>
    <Layer i={4}>
      <S5 />
    </Layer>
    <Layer i={5}>
      <S6 />
    </Layer>
    <Layer i={6}>
      <S7 />
    </Layer>
    <Layer i={7}>
      <S8 />
    </Layer>
    <Soundtrack />
  </Background>
);
