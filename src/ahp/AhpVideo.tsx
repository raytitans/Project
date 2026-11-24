import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, E, FONT, S, clamp } from "./theme";
import {
  Check,
  Counter,
  Cursor,
  FadeUp,
  GlassIcon,
  HighlightPill,
  Line,
  MeshBg,
  Pop,
  WhiteBg,
  usePop,
} from "./parts";
import { FPS, HAS_REAL_VO, pend, w } from "./vo";

/* ------------------------------------------------------------------ */
/* Durasi & batas scene                                                 */
/* ------------------------------------------------------------------ */
// durasi = saat "Raymon" diucapkan + 5 dtk kartu CTA, dibulatkan ke atas (maks 60 dtk)
export const CTA_HOLD = 5; // kartu RAYMON tetap di layar ±5 dtk setelah nama disebut
export const AHP_DURATION = Math.min(60, Math.ceil(w(12, 4) / FPS + CTA_HOLD)) * FPS;

type Tr = "zoom" | "tilt" | "wave" | "panel";
const OV = 14; // panjang transisi (frame), sedikit lebih lambat dari referensi agar terasa tenang

const B = [
  0,
  w(1) - 10, // S1→S2 zoom-through
  w(2) - 10, // S2→S3 tilted card
  w(4) - 12, // S3→S4 wave
  w(5) - 12, // S4→S5 panel drop
  w(7) - 12, // S5→S6 wave
  w(9) - 12, // S6→S7 tilted card
  w(10) - 12, // S7→S8 wave
  AHP_DURATION,
];
const TR: Tr[] = ["zoom", "tilt", "wave", "panel", "wave", "tilt", "wave"];

/* ------------------------------------------------------------------ */
/* Layer scene + transisi                                               */
/* ------------------------------------------------------------------ */
const wavePath = (p: number, f: number, amp = 50) => {
  const W = 1080,
    H = 1920;
  const y = H - p * (H + amp * 2) + amp * 0.5;
  let d = `M0 ${H} L0 ${y}`;
  for (let x = 0; x <= W; x += 40) d += ` L${x} ${y + Math.sin(x / 170 + f / 8) * amp}`;
  return d + ` L${W} ${H} Z`;
};

const Layer: React.FC<{ i: number; dark: boolean; disclaimer?: boolean; children: React.ReactNode }> = ({
  i,
  dark,
  disclaimer = true,
  children,
}) => {
  const f = useCurrentFrame();
  const start = B[i];
  const end = i + 1 < B.length - 1 ? B[i + 1] + OV : B[i + 1];
  if (f < start || f >= end) return null;

  const enter: Tr | null = i > 0 ? TR[i - 1] : null;
  const exit: Tr | null = i < TR.length ? TR[i] : null;
  const pin = enter ? interpolate(f, [start, start + OV], [0, 1], { ...clamp, easing: E.swiftInOut }) : 1;
  const pout = exit ? interpolate(f, [B[i + 1], B[i + 1] + OV], [0, 1], { ...clamp, easing: E.swiftInOut }) : 0;

  // Ken Burns pelan sepanjang scene (design_1 §7: slow push-in)
  const drift = interpolate(f, [start, end], [1, 1.04], clamp);
  let transform = `scale(${drift})`;
  let filter: string | undefined;
  let opacity = 1;
  let clipPath: string | undefined;
  let z = i * 2;

  if (enter === "zoom" && pin < 1) {
    transform = `scale(${drift * (1 + 1.5 * (1 - pin))})`;
    filter = `blur(${(1 - pin) * 14}px)`;
    opacity = pin;
  }
  if (enter === "tilt" && pin < 1) transform = `scale(${drift * (1.08 - 0.08 * pin)})`;
  if (enter === "wave" && pin < 1) clipPath = `path('${wavePath(pin, f)}')`;
  if (enter === "panel" && pin < 1) clipPath = `inset(0 0 ${(1 - pin) * 100}% 0)`;

  if (exit === "tilt" && pout > 0) {
    transform = `translate(${pout * 900}px, ${-pout * 2200}px) rotate(${-8 * pout}deg) scale(${drift * (1 - 0.15 * pout)})`;
    z = (i + 1) * 2 + 1; // scene lama di atas, meluncur pergi
  }
  if (exit === "zoom" && pout > 0) {
    filter = `blur(${pout * 10}px)`;
    transform = `scale(${drift * (1 - 0.1 * pout)})`;
  }

  return (
    <AbsoluteFill style={{ zIndex: z, clipPath, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform,
          filter,
          opacity,
          borderRadius: exit === "tilt" && pout > 0 ? 48 * Math.min(1, pout * 4) : 0,
          overflow: "hidden",
          boxShadow: exit === "tilt" && pout > 0 ? "0 30px 80px rgba(0,0,0,.45)" : undefined,
        }}
      >
        {dark ? <MeshBg seed={i} /> : <WhiteBg />}
        {children}
        {disclaimer && <Disclaimer dark={dark} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Glow tepi gelombang putih (design_1 §6.4) di atas scene lama */
const WaveEdges: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {TR.map((t, k) => {
        if (t !== "wave") return null;
        const s = B[k + 1];
        if (f < s || f > s + OV) return null;
        const p = interpolate(f, [s, s + OV], [0, 1], { ...clamp, easing: E.swiftInOut });
        return (
          <AbsoluteFill key={k} style={{ zIndex: 100 }}>
            <svg width={1080} height={1920} style={{ filter: `drop-shadow(0 -20px 40px ${C.pinkMist})` }}>
              <path d={wavePath(p, f)} fill="none" stroke={C.white} strokeWidth={10} opacity={0.9} />
            </svg>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const Disclaimer: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      bottom: 150,
      textAlign: "center",
      fontFamily: FONT,
      fontSize: 21,
      fontWeight: 500,
      whiteSpace: "nowrap",
      color: dark ? "rgba(255,255,255,0.62)" : C.mutedGrey,
    }}
  >
    Ilustrasi by Raymon, ketentuan sesuai Polis, AXA berizin & diawasi OJK.
  </div>
);

const Center: React.FC<{ top?: number; children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  top,
  children,
  gap = 24,
  style,
}) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: top === undefined ? "center" : "flex-start",
      paddingTop: top,
      paddingLeft: 80,
      paddingRight: 80,
      gap,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* S1 — Hook                                                            */
/* ------------------------------------------------------------------ */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const lineStart = w(0, 7);
  const lineEnd = w(0, 14);
  const draw = interpolate(f, [lineStart, lineEnd], [0, 1], { ...clamp, easing: E.snapOut });
  const q = usePop(w(0, 14));
  const pulse = 1 + 0.03 * Math.sin((f - w(0, 14)) / 6);
  return (
    <>
      <Center top={420} gap={10}>
        <Line
          color={C.white}
          words={[
            ["Tahukah kamu,", w(0, 0), "small"],
          ]}
          style={{ opacity: 0.85 }}
        />
        <Line
          color={C.white}
          words={[
            ["Berapa", w(0, 2)],
            ["total premi", w(0, 3)],
          ]}
        />
        <HighlightPill text="asuransi kesehatan" at={w(0, 5)} clickAt={w(0, 6) + 4} size={78} />
      </Center>
      <Cursor x={760} y={700} at={w(0, 5) - 2} clickAt={w(0, 6) + 4} hideAt={w(0, 9)} />

      {/* Garis waktu usia 30 → 84 */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 1150, height: 8 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(255,255,255,0.18)" }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${draw * 100}%`,
            borderRadius: 4,
            background: C.white,
            boxShadow: `0 0 24px ${C.pinkMist}`,
          }}
        />
        {[
          { x: 0, label: "30", at: w(0, 9) },
          { x: 100, label: "84", at: w(0, 12) },
        ].map((n) => (
          <div key={n.label} style={{ position: "absolute", left: `${n.x}%`, top: -46, width: 0 }}>
            <Pop at={n.at}>
              <div style={{ transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: C.white,
                    color: C.brandRed,
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                  }}
                >
                  {n.label}
                </div>
                <div style={{ marginTop: 16, fontFamily: FONT, fontSize: 30, fontWeight: 500, color: C.white, opacity: 0.85 }}>
                  usia
                </div>
              </div>
            </Pop>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 180,
          color: C.white,
          transform: `scale(${q * pulse})`,
          opacity: Math.min(1, q * 1.5),
          textShadow: "0 10px 30px rgba(0,0,0,.35)",
        }}
      >
        Rp ?
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S2 — "Sekitar dua miliar rupiah"                                     */
/* ------------------------------------------------------------------ */
const S2: React.FC = () => (
  <Center gap={10} style={{ paddingBottom: 120 }}>
    <FadeUp at={w(1, 0)}>
      <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 600, color: C.charcoal }}>Total premi kesehatan</div>
    </FadeUp>
    <Pop at={w(1, 1)}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.brandRed, letterSpacing: "-0.03em", lineHeight: 1.05, whiteSpace: "nowrap" }}>
        <Counter to={2.04} dec={2} at={w(1, 1)} dur={30} prefix="Rp" />
        <span style={{ fontSize: 120 }}> M</span>
      </div>
    </Pop>
    <FadeUp at={w(1, 2)}>
      <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 700, fontStyle: "italic", color: C.brandRed }}>usia 30 – 84 tahun</div>
    </FadeUp>
  </Center>
);

/* ------------------------------------------------------------------ */
/* S3 — 30–64 vs 65–84                                                  */
/* ------------------------------------------------------------------ */
const Bar: React.FC<{
  x: number;
  h: number;
  at: number;
  valAt: number;
  value: React.ReactNode;
  label: string;
  strong?: boolean;
}> = ({ x, h, at, valAt, value, label, strong }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = spring({ frame: f - at, fps, config: S.soft });
  const lab = interpolate(f, [at - 6, at + 6], [0, 1], clamp);
  const base = 1480;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          width: 330,
          top: base - h * g,
          height: h * g,
          opacity: g > 0.02 ? 1 : 0,
          borderRadius: "28px 28px 10px 10px",
          background: strong
            ? `linear-gradient(180deg, #FFFFFF 0%, ${C.offWhite} 100%)`
            : "linear-gradient(180deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,.18) 100%)",
          border: "2px solid rgba(255,255,255,.6)",
          boxShadow: strong ? `0 20px 60px rgba(0,0,0,.35), 0 0 80px ${C.pinkMist}66` : "0 10px 30px rgba(0,0,0,.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 60,
          width: 450,
          top: base - h * g - 110,
          textAlign: "center",
          opacity: interpolate(f, [valAt, valAt + 8], [0, 1], clamp),
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 72,
          color: C.white,
          textShadow: "0 8px 24px rgba(0,0,0,.35)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 40,
          width: 410,
          top: base + 24,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 600,
          fontStyle: strong ? "italic" : "normal",
          color: C.white,
          opacity: lab,
        }}
      >
        {label}
      </div>
    </>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const hMax = 700;
  const h1 = (hMax * 558.9) / 1482.3;
  const swap = w(3, 0) - 4;
  return (
    <>
      <Center top={300} gap={0}>
        <div style={{ position: "relative", width: "100%", height: 160 }}>
          <Line
            color={C.white}
            out={swap}
            style={{ position: "absolute", left: 0, right: 0, top: 0 }}
            words={[
              ["Usia", w(2, 0)],
              ["30 – 64", w(2, 1), "bold"],
            ]}
          />
          <Line
            color={C.white}
            style={{ position: "absolute", left: 0, right: 0, top: 0 }}
            words={[
              ["Usia", w(3, 1)],
              ["65 – 84", w(3, 2), "italic"],
            ]}
          />
        </div>
      </Center>
      <Bar
        x={150}
        h={h1}
        at={w(2, 7)}
        valAt={w(2, 8)}
        label="usia 30–64"
        value={<Counter to={558.9} dec={1} at={w(2, 8)} dur={26} prefix="Rp" suffix=" jt" />}
      />
      <Bar
        x={600}
        h={hMax}
        at={w(3, 9)}
        valAt={w(3, 10)}
        strong
        label="usia 65–84"
        value={<Counter to={1.48} dec={2} at={w(3, 10)} dur={30} prefix="Rp" suffix=" M" />}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1610,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 500,
          color: C.white,
          opacity: interpolate(f, [w(3, 6), w(3, 6) + 12], [0, 0.9], clamp),
        }}
      >
        Premi/tahun: Rp38,4 jt → Rp118 jt
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S4 — hampir 75% di usia pensiun                                      */
/* ------------------------------------------------------------------ */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const R = 250;
  const L = 2 * Math.PI * R;
  const p = interpolate(f, [w(4, 0), w(4, 0) + 40], [0, 0.726], { ...clamp, easing: E.snapOut });
  return (
    <>
      <Center top={330} gap={0}>
        <Line
          color={C.brandRed}
          accent={C.brandRed}
          words={[
            ["Hampir", w(4, 0)],
            ["¾ biaya", w(4, 1), "bold"],
          ]}
        />
      </Center>
      <div style={{ position: "absolute", left: 540 - R - 40, top: 560, width: 2 * R + 80, height: 2 * R + 80 }}>
        <Pop at={w(4, 0)} cfg={S.soft}>
          <svg width={2 * R + 80} height={2 * R + 80}>
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={C.offWhite} strokeWidth={40} />
            <circle
              cx={R + 40}
              cy={R + 40}
              r={R}
              fill="none"
              stroke={C.brandRed}
              strokeWidth={40}
              strokeLinecap="round"
              strokeDasharray={`${L * p} ${L}`}
              transform={`rotate(-90 ${R + 40} ${R + 40})`}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.brandRed, letterSpacing: "-0.03em" }}>
              <Counter to={72.6} dec={1} at={w(4, 0)} dur={40} suffix="%" />
            </div>
            <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 500, color: C.charcoal }}>usia 65–84</div>
          </div>
        </Pop>
      </div>
      <Center top={1230} gap={4}>
        <Line color={C.brandRed} words={[["justru di", w(4, 5)]]} />
        <Line color={C.brandRed} accent={C.brandRed} words={[["usia pensiun", w(4, 7), "italic"]]} style={{ transform: "scale(1.25)" }} />
      </Center>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S5 — Disiapkan sejak sekarang, 10 jt/bulan × 5 tahun                 */
/* ------------------------------------------------------------------ */
const S5: React.FC = () => {
  const swap = w(6, 0) - 6;
  const f = useCurrentFrame();
  const qOut = interpolate(f, [swap, swap + 8], [0, 1], clamp);
  return (
    <>
      <Center top={560} gap={10} style={{ opacity: 1 - qOut, filter: `blur(${qOut * 20}px)` }}>
        <Line
          color={C.white}
          words={[
            ["Bagaimana kalau", w(5, 0)],
          ]}
        />
        <Line color={C.white} words={[["disiapkan", w(5, 2), "bold"]]} />
        <HighlightPill text="sejak sekarang?" at={w(5, 3)} clickAt={w(5, 4) + 3} size={84} />
      </Center>
      {f < swap + 8 && <Cursor x={720} y={900} at={w(5, 3) - 2} clickAt={w(5, 4) + 3} hideAt={swap} />}

      {f >= swap && (
        <>
          <Center top={420} gap={0}>
            <Line color={C.white} words={[["Sisihkan sekitar", w(6, 0)]]} />
          </Center>
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
            <Pop at={w(6, 2)}>
              <div
                style={{
                  padding: "40px 70px",
                  borderRadius: 36,
                  background: "linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,.08))",
                  border: "2px solid rgba(255,255,255,.55)",
                  boxShadow: `0 20px 60px rgba(0,0,0,.35)`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.white, lineHeight: 1 }}>
                  <Counter to={10} at={w(6, 2)} dur={20} prefix="Rp" suffix=" jt" />
                </div>
                <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 600, fontStyle: "italic", color: C.white, marginTop: 14 }}>
                  per bulan
                </div>
              </div>
            </Pop>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 22 }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <Pop key={k} at={w(6, 5) + k * 6}>
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 24,
                    background: `linear-gradient(180deg, #FFFFFF, ${C.offWhite})`,
                    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    color: C.brandRed,
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 500 }}>tahun</div>
                  <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{k + 1}</div>
                </div>
              </Pop>
            ))}
          </div>
          <Center top={1290} gap={0}>
            <Line color={C.white} words={[["selama", w(6, 5)], ["5 tahun", w(6, 6), "italic"]]} />
          </Center>
          <FadeUp at={w(6, 7) + 8} style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 500, color: C.white, opacity: 0.85 }}>
              Total premi ±Rp603,5 jt
            </div>
          </FadeUp>
        </>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S6 — Cair 2,1 M di usia 65: cukup                                    */
/* ------------------------------------------------------------------ */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const up = spring({ frame: f - w(8, 0), fps, config: S.soft });
  const seg = (at: number) => interpolate(f, [at, at + 22], [0, 1], { ...clamp, easing: E.snapOut });
  const s1 = seg(w(8, 2));
  const s2 = seg(w(8, 7));
  const W = 900;
  const w1 = (W * 603.54) / 2100;
  const w2 = (W * 1482.31) / 2100;
  const ok = usePop(w(8, 11));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440 - up * 160, transform: `scale(${1 - up * 0.3})` }}>
        <Line
          color={C.brandRed}
          accent={C.brandRed}
          words={[
            ["Di usia", w(7, 0)],
            ["65,", w(7, 2), "bold"],
            ["cair", w(7, 5), "italic"],
          ]}
        />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <Pop at={w(7, 6)}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 250, color: C.brandRed, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              <Counter to={2.1} dec={1} at={w(7, 6)} dur={30} prefix="Rp" />
              <span style={{ fontSize: 150 }}> M</span>
            </div>
          </Pop>
        </div>
      </div>

      {/* Bar komposisi dana 2,1 M */}
      <div style={{ position: "absolute", left: 90, top: 900, width: W, height: 110, opacity: up }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.offWhite }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: w1 * s1,
            borderRadius: "22px 0 0 22px",
            background: C.crimsonBright,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: w1 + 4,
            top: 0,
            bottom: 0,
            width: w2 * s2,
            borderRadius: s2 > 0.99 ? "0 22px 22px 0" : 0,
            background: C.maroon,
          }}
        />
      </div>

      {/* Rincian */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1080, display: "flex", flexDirection: "column", gap: 34 }}>
        {[
          { at: w(8, 3), color: C.crimsonBright, title: "Semua premi polis kembali", val: "Rp603,5 jt" },
          { at: w(8, 8), color: C.maroon, title: "Biaya kesehatan s.d. usia 84", val: "Rp1,48 M" },
        ].map((r) => (
          <FadeUp key={r.title} at={r.at}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.charcoal, whiteSpace: "nowrap" }}>{r.title}</div>
              <div style={{ fontFamily: FONT, fontSize: 40, whiteSpace: "nowrap", fontWeight: 700, color: C.brandRed }}>{r.val}</div>
              <Check at={r.at + 6} size={52} />
            </div>
          </FadeUp>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${ok})`,
            opacity: Math.min(1, ok * 1.5),
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "22px 56px",
            borderRadius: 999,
            background: C.brandRed,
            boxShadow: "0 14px 40px rgba(145,1,2,.35)",
          }}
        >
          <Check at={w(8, 11) + 4} size={58} color={C.white} />
          <span style={{ fontFamily: FONT, fontSize: 60, fontWeight: 700, fontStyle: "italic", color: C.white }}>Cukup</span>
        </div>
      </div>
      <FadeUp at={w(8, 11) + 10} style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 500, color: C.mutedGrey }}>masih tersisa ±Rp14 jt</div>
      </FadeUp>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S7 — Proteksi jiwa                                                   */
/* ------------------------------------------------------------------ */
const Shield: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [at, at + 20], [1, 0], { ...clamp, easing: E.snapOut });
  return (
    <svg width={170} height={170} viewBox="0 0 48 48">
      <path
        d="M24 5 L39 11 V23 C39 32 32.5 39.5 24 43 C15.5 39.5 9 32 9 23 V11 Z"
        fill="none"
        stroke={C.brandRed}
        strokeWidth={2.6}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={d}
      />
      <path
        d="M24 31 C24 31 16.5 26.5 16.5 21.5 C16.5 18.8 18.6 17 20.8 17 C22.3 17 23.4 17.8 24 19 C24.6 17.8 25.7 17 27.2 17 C29.4 17 31.5 18.8 31.5 21.5 C31.5 26.5 24 31 24 31 Z"
        fill={C.brandRed}
        opacity={1 - d}
      />
    </svg>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const float = Math.sin(f / 20) * 10;
  return (
    <>
      <Center top={380} gap={8}>
        <Line color={C.white} words={[["Dan selama itu,", w(9, 0), "small"]]} style={{ opacity: 0.9 }} />
        <Line color={C.white} words={[["kamu tetap punya", w(9, 3)]]} />
      </Center>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", transform: `translateY(${float}px)` }}>
        <Pop at={w(9, 2)}>
          <GlassIcon size={380}>
            <Shield at={w(9, 2) + 4} />
          </GlassIcon>
        </Pop>
      </div>
      <Center top={1170} gap={10}>
        <Line color={C.white} words={[["proteksi jiwa", w(9, 6), "italic"]]} style={{ transform: "scale(1.35)" }} />
        <FadeUp at={w(9, 7) + 6}>
          <div style={{ marginTop: 40, fontFamily: FONT, fontSize: 34, fontWeight: 500, color: C.white, opacity: 0.85, textAlign: "center" }}>
            Manfaat meninggal dunia Rp2,1 M – Rp3,15 M
          </div>
        </FadeUp>
      </Center>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* S8 — Penutup                                                         */
/* ------------------------------------------------------------------ */
const Bubble: React.FC<{ color: string; size?: number }> = ({ color, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
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

const Phone: React.FC<{ color: string; size?: number }> = ({ color, size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6.6 3.5 L9.4 3.2 L11 7.6 L9 9.2 C9.9 11.4 12.6 14.1 14.8 15 L16.4 13 L20.8 14.6 L20.5 17.4 C20.4 18.6 19.4 19.5 18.2 19.4 C10.8 18.9 5.1 13.2 4.6 5.8 C4.5 4.6 5.4 3.6 6.6 3.5 Z"
      fill={color}
    />
  </svg>
);

/** Tombol "Komen HITUNG": outline → diklik → terisi merah */
const CommentButton: React.FC<{ at: number; clickAt: number }> = ({ at, clickAt }) => {
  const f = useCurrentFrame();
  const s = usePop(at);
  const fill = interpolate(f, [clickAt, clickAt + 7], [0, 1], { ...clamp, easing: E.snapOut });
  const press = f >= clickAt ? 1 - 0.08 * Math.sin(Math.min(1, (f - clickAt) / 6) * Math.PI) : 1;
  const ring = interpolate(f, [clickAt, clickAt + 16], [0, 1], clamp);
  const fg = fill > 0.5 ? C.white : C.brandRed;
  return (
    <div style={{ position: "relative", transform: `scale(${s * press})`, opacity: Math.min(1, s * 1.5) }}>
      {f >= clickAt && ring < 1 && (
        <div
          style={{
            position: "absolute",
            inset: -20 * ring,
            borderRadius: 999,
            border: `4px solid ${C.crimsonBright}`,
            opacity: 1 - ring,
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "26px 60px",
          borderRadius: 999,
          border: `4px solid ${C.brandRed}`,
          background: `linear-gradient(90deg, ${C.brandRed} ${fill * 100}%, ${C.white} ${fill * 100}%)`,
          boxShadow: fill > 0.5 ? "0 16px 40px rgba(145,1,2,.35)" : "0 10px 24px rgba(0,0,0,.08)",
        }}
      >
        <Bubble color={fg} />
        <span style={{ fontFamily: FONT, fontSize: 64, fontWeight: 600, color: fg }}>Komen</span>
        <span style={{ fontFamily: FONT, fontSize: 72, fontWeight: 800, color: fg, letterSpacing: "0.02em" }}>HITUNG</span>
      </div>
    </div>
  );
};

/** Kartu kontak: muncul saat "Raymon" diucapkan, tetap sampai akhir video */
const ContactCard: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: S.soft });
  const sweep = interpolate(f, [at + 6, at + 30], [-0.4, 1.4], clamp);
  const float = f > at + 20 ? Math.sin((f - at) / 22) * 6 : 0;
  return (
    <div
      style={{
        width: 900,
        transform: `translateY(${(1 - s) * 120 + float}px) rotate(${(1 - s) * -6}deg)`,
        opacity: Math.min(1, s * 1.4),
        borderRadius: 36,
        overflow: "hidden",
        position: "relative",
        background: `radial-gradient(80% 120% at 20% 0%, ${C.crimsonBright} 0%, ${C.crimson} 45%, ${C.oxblood} 100%)`,
        boxShadow: `0 30px 70px rgba(82,0,1,.45), 0 0 80px ${C.pinkMist}88`,
        border: "2px solid rgba(255,255,255,.25)",
        padding: "46px 56px",
        display: "flex",
        alignItems: "center",
        gap: 34,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 220,
          left: `${sweep * 100}%`,
          background: "linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent)",
          transform: "skewX(-18deg)",
        }}
      />
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${C.offWhite} 55%, ${C.rosyGrey} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 10px 24px rgba(0,0,0,.3)",
        }}
      >
        <Phone color={C.brandRed} />
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 800, color: C.white, letterSpacing: "0.04em", lineHeight: 1 }}>
          RAYMON
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 600,
            color: C.white,
            marginTop: 12,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          0812 8909 0202
        </div>
      </div>
    </div>
  );
};

const S8: React.FC = () => {
  const f = useCurrentFrame();
  const swap = w(11, 0) - 6;
  const qOut = interpolate(f, [swap, swap + 10], [0, 1], { ...clamp, easing: E.snapOut });
  const cta = w(12, 0) - 6;
  const qCta = interpolate(f, [cta, cta + 12], [0, 1], { ...clamp, easing: E.snapOut });
  const hitung = w(12, 1);
  return (
    <>
      <Center
        top={700}
        gap={6}
        style={{
          transform: `translateY(${-qOut * 300}px) scale(${1 - qOut * 0.35})`,
          opacity: (1 - qOut * 0.55) * (1 - qCta),
        }}
      >
        <Line
          color={C.brandRed}
          accent={C.brandRed}
          words={[
            ["Pensiun", w(10, 0), "bold"],
            ["tenang,", w(10, 1), "italic"],
          ]}
          style={{ transform: "scale(1.3)" }}
        />
        <Line color={C.brandRed} words={[["tanpa jadi beban.", w(10, 2)]]} />
      </Center>
      <Center top={980} gap={14} style={{ transform: `translateY(${-qCta * 560}px) scale(${1 - qCta * 0.25})` }}>
        <Line color={C.charcoal} words={[["Mulai siapkan", w(11, 0)]]} />
        <HighlightPill
          text="dari sekarang"
          at={w(11, 2)}
          clickAt={w(11, 3)}
          size={92}
          pill={C.brandRed}
          textBefore={C.brandRed}
          textAfter={C.white}
          dashed
        />
      </Center>

      {/* CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
        <CommentButton at={w(12, 0)} clickAt={hitung} />
      </div>
      <Cursor x={760} y={900} at={w(12, 0) + 2} clickAt={hitung} color={C.nearBlack} hideAt={w(12, 4) - 4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center" }}>
        <ContactCard at={w(12, 4)} />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Audio                                                                */
/* ------------------------------------------------------------------ */
type Sfx = { at: number; src: string; vol: number };
const ticks = (at: number, dur: number, vol = 0.18): Sfx[] =>
  Array.from({ length: Math.floor(dur / 3) }, (_, k) => ({ at: at + k * 3, src: "tick", vol: vol * (1 - (k * 3) / dur / 1.6) }));

export const SFX: Sfx[] = [
  // transisi
  ...TR.map((t, k) => ({ at: B[k + 1] - 3, src: t === "wave" ? "whoosh_long" : "whoosh", vol: 0.45 })),
  // S1
  { at: w(0, 5), src: "pop", vol: 0.35 },
  { at: w(0, 6) + 4, src: "click", vol: 0.8 },
  { at: w(0, 9), src: "pop", vol: 0.4 },
  { at: w(0, 12), src: "pop", vol: 0.45 },
  { at: w(0, 14), src: "chime", vol: 0.3 },
  // S2
  ...ticks(w(1, 1), 30),
  { at: w(1, 1) + 28, src: "boom", vol: 0.35 },
  // S3
  { at: w(2, 7), src: "rise_soft", vol: 0.3 },
  ...ticks(w(2, 8), 26),
  { at: w(3, 9), src: "rise_soft", vol: 0.35 },
  ...ticks(w(3, 10), 30),
  { at: w(3, 10) + 28, src: "pop", vol: 0.45 },
  // S4
  ...ticks(w(4, 0), 40, 0.14),
  { at: w(4, 0) + 38, src: "chime", vol: 0.35 },
  // S5
  { at: w(5, 3), src: "pop", vol: 0.35 },
  { at: w(5, 4) + 3, src: "click", vol: 0.8 },
  { at: w(6, 2), src: "pop", vol: 0.45 },
  ...[0, 1, 2, 3, 4].map((k) => ({ at: w(6, 5) + k * 6, src: `pop${k}`, vol: 0.4 })),
  // S6
  { at: w(7, 6) - 45, src: "riser", vol: 0.3 },
  ...ticks(w(7, 6), 30),
  { at: w(7, 6), src: "boom", vol: 0.5 },
  { at: w(8, 3) + 6, src: "chime", vol: 0.3 },
  { at: w(8, 8) + 6, src: "chime", vol: 0.3 },
  { at: w(8, 11), src: "pop", vol: 0.5 },
  { at: w(8, 11) + 4, src: "shimmer", vol: 0.35 },
  // S7
  { at: w(9, 2), src: "pop", vol: 0.45 },
  { at: w(9, 2) + 4, src: "shimmer", vol: 0.3 },
  // S8
  { at: w(11, 2), src: "pop", vol: 0.35 },
  { at: w(11, 3), src: "chime", vol: 0.25 },
  // CTA
  { at: w(12, 0) - 3, src: "whoosh", vol: 0.35 },
  { at: w(12, 0), src: "pop", vol: 0.45 },
  { at: w(12, 1), src: "click", vol: 0.9 },
  { at: w(12, 1) + 2, src: "pop1", vol: 0.35 },
  { at: w(12, 4) - 2, src: "whoosh", vol: 0.4 },
  { at: w(12, 4) + 6, src: "shimmer", vol: 0.45 },
  { at: w(12, 4) + 4, src: "boom", vol: 0.25 },
];

const Soundtrack: React.FC = () => {
  const end = AHP_DURATION;
  return (
    <>
      <Audio
        src={staticFile("ahp/music.wav")}
        volume={(f) =>
          interpolate(f, [0, 20, end - 60, end - 5], [0, HAS_REAL_VO ? 0.22 : 0.4, HAS_REAL_VO ? 0.22 : 0.4, 0], clamp)
        }
      />
      {HAS_REAL_VO && (
        <Sequence from={0}>
          <Audio src={staticFile("ahp/vo.wav")} />
        </Sequence>
      )}
      {SFX.filter((s) => s.at >= 0 && s.at < end).map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={Math.min(90, end - s.at)}>
          <Audio src={staticFile(`ahp/sfx/${s.src}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
export const AhpVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.white, fontFamily: FONT }}>
    <Layer i={0} dark disclaimer={false}>
      <S1 />
    </Layer>
    <Layer i={1} dark={false}>
      <S2 />
    </Layer>
    <Layer i={2} dark>
      <S3 />
    </Layer>
    <Layer i={3} dark={false}>
      <S4 />
    </Layer>
    <Layer i={4} dark>
      <S5 />
    </Layer>
    <Layer i={5} dark={false}>
      <S6 />
    </Layer>
    <Layer i={6} dark>
      <S7 />
    </Layer>
    <Layer i={7} dark={false}>
      <S8 />
    </Layer>
    <WaveEdges />
    <Soundtrack />
  </AbsoluteFill>
);
