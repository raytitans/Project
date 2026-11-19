import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Background,
  Caption,
  Counter,
  GlassCard,
  HeroText,
  Scene,
  ThemeProvider,
  Transition,
  Word,
  useTheme,
} from "../design/components";
import { EASE, FONT, GOLD, SPRING } from "../design/tokens";
import VO from "./vo-words.json";

const FPS = 30;
export const AFP_DURATION = 60 * FPS;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** frame absolut saat kata ke-i VO mulai diucapkan */
const at = (i: number) => Math.round(VO[i].start * FPS);

/* ------------------------------------------------------------------ */
/* Batas scene (detik), mengikuti jeda VO                               */
/* ------------------------------------------------------------------ */
const B = [0, 4.45, 10.74, 19.2, 28.65, 38.85, 44.5, 52.0, 60].map((s) => Math.round(s * FPS));
const OV = 10; // overlap transisi (frame)

type SceneDef = { enter: Transition; exit: Transition; body: (from: number) => React.ReactNode };

/* ------------------------------------------------------------------ */
/* Komponen kecil khusus video ini                                      */
/* ------------------------------------------------------------------ */
const useAppear = (f0: number, cfg: { damping: number; stiffness: number; mass: number } = SPRING.soft) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - f0, fps, config: cfg });
};

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; weight?: number }> = ({
  children,
  color,
  size = FONT.label.size,
  weight = 500,
}) => {
  const C = useTheme();
  return (
    <div style={{ fontFamily: FONT.family, fontSize: size, fontWeight: weight, color: color ?? C.blueHighlight }}>
      {children}
    </div>
  );
};

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 76, color }) => {
  const C = useTheme();
  return (
    <div style={{ fontFamily: FONT.family, fontSize: size, fontWeight: 600, color: color ?? C.white, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
      {children}
    </div>
  );
};

/** muncul (fade + naik) mulai frame f0 */
const Appear: React.FC<{ f0: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({
  f0,
  children,
  dy = 40,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f0, f0 + 10], [0, 1], { ...clamp, easing: EASE.out });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: `blur(${(1 - p) * 6}px)`, ...style }}>
      {children}
    </div>
  );
};

/** badge emas seperti "Cuan : +Rp 5.830.000" di konten Raymon */
const GoldBadge: React.FC<{ f0: number; children: React.ReactNode }> = ({ f0, children }) => {
  const C = useTheme();
  const s = useAppear(f0, SPRING.pop);
  const frame = useCurrentFrame();
  const sheen = interpolate(frame - f0, [4, 30], [-0.4, 1.4], clamp);
  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.5),
        transform: `scale(${0.5 + 0.5 * s})`,
        padding: "26px 56px",
        borderRadius: 22,
        background: `linear-gradient(120deg, ${C.blueGlow}, ${C.blue} 30%, ${C.blueHighlight} ${sheen * 100}%, ${C.blue} ${sheen * 100 + 20}%, ${C.blueGlow})`,
        boxShadow: `0 0 70px ${C.blue}88`,
        fontFamily: FONT.family,
        fontWeight: 700,
        fontSize: 64,
        color: C.navy900,
      }}
    >
      {children}
    </div>
  );
};

/** stempel "SCAM?" yang menghantam layar */
const Stamp: React.FC<{ f0: number; text: string; size?: number }> = ({ f0, text, size = 150 }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const s = useAppear(f0, { damping: 9, stiffness: 220, mass: 0.7 });
  const shake = frame >= f0 && frame < f0 + 8 ? Math.sin((frame - f0) * 3) * (8 - (frame - f0)) * 2 : 0;
  return (
    <div
      style={{
        opacity: Math.min(1, s * 2),
        transform: `rotate(-8deg) scale(${2.2 - 1.2 * s}) translateX(${shake}px)`,
        border: `8px solid ${C.blue}`,
        borderRadius: 24,
        padding: "10px 48px",
        fontFamily: FONT.family,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: "nowrap",
        letterSpacing: "0.04em",
        color: C.blue,
        textShadow: `0 0 50px ${C.blue}`,
        boxShadow: `0 0 50px ${C.blue}66, inset 0 0 40px ${C.blue}44`,
      }}
    >
      {text}
    </div>
  );
};

/** garis waktu vertikal dengan node (seperti slide "Kapan Modalnya Balik?") */
const TimelineNode: React.FC<{ f0: number; title: string; sub: string; value?: React.ReactNode; fValue?: number; last?: boolean }> = ({
  f0,
  title,
  sub,
  value,
  fValue = f0,
  last,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const dot = useAppear(f0, SPRING.pop);
  const line = interpolate(frame, [f0 + 6, f0 + 30], [0, 1], { ...clamp, easing: EASE.out });
  return (
    <div style={{ display: "flex", gap: 44, alignItems: "flex-start", position: "relative", height: last ? 220 : 330 }}>
      <div style={{ position: "relative", width: 64, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            border: `5px solid ${C.blue}`,
            background: `radial-gradient(circle, ${C.blueBright} 40%, transparent 44%)`,
            transform: `scale(${dot})`,
            boxShadow: `0 0 30px ${C.blue}`,
          }}
        />
        {!last && (
          <div
            style={{
              position: "absolute",
              top: 62,
              width: 5,
              height: 260 * line,
              background: `linear-gradient(${C.blue}, ${C.blue}22)`,
            }}
          />
        )}
      </div>
      <div>
        <Appear f0={f0}>
          <Label size={44} weight={600} color={C.white}>
            {title}
          </Label>
          <Label size={36} color={C.gray}>
            {sub}
          </Label>
        </Appear>
        {value && (
          <div style={{ marginTop: 10 }}>
            <PopIn f0={fValue}>{value}</PopIn>
          </div>
        )}
      </div>
    </div>
  );
};

const PopIn: React.FC<{ f0: number; children: React.ReactNode }> = ({ f0, children }) => {
  const s = useAppear(f0, SPRING.pop);
  return (
    <div style={{ opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 50}px) scale(${0.6 + 0.4 * s})`, transformOrigin: "left center" }}>
      {children}
    </div>
  );
};

const Accent: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 110 }) => {
  const C = useTheme();
  return (
    <span style={{ fontFamily: FONT.family, fontWeight: 600, fontSize: size, color: C.blue, textShadow: `0 0 40px ${C.blue}66`, lineHeight: 1.05 }}>
      {children}
    </span>
  );
};

/** kalimat dengan timing kata absolut (frame relatif ke Sequence) */
const cap = (from: number, items: [string, number, Word["style"]?, boolean?][]): Word[] =>
  items.map(([text, i, style, br]) => ({ text, at: at(i) - from, style: style ?? "normal", br, dy: style === "small" ? 10 : 0 }));

/* ------------------------------------------------------------------ */
/* Scene-scene                                                          */
/* ------------------------------------------------------------------ */
const SCENES: SceneDef[] = [
  // 1. HOOK
  {
    enter: "none",
    exit: "pushIn",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 470, gap: 30 }}>
        <Caption words={cap(from, [["Punya aset", 0]])} />
        <PopIn f0={at(2) - from}>
          <Counter
            from={0}
            to={2.5}
            startFrame={at(2) - from}
            duration={30}
            prefix="Rp "
            suffix=" Miliar"
            decimals={1}
            locale="id-ID"
            style={{ fontSize: 140, fontWeight: 600, color: GOLD.blue, textShadow: `0 0 50px ${GOLD.blue}88` }}
          />
        </PopIn>
        <PopIn f0={at(6) - from}>
          <Accent size={104}>‘tanpa biaya’?</Accent>
        </PopIn>
        <Caption words={cap(from, [["Kedengarannya", 8]])} />
        <div style={{ marginTop: 40 }}>
          <Stamp f0={at(9) - from} text="SCAM?" />
        </div>
      </AbsoluteFill>
    ),
  },
  // 2. BUKAN SULAP
  {
    enter: "pushIn",
    exit: "whip",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 440, gap: 20 }}>
        <Caption words={cap(from, [["Tenang.", 11, "small"]])} />
        <Caption words={cap(from, [["Bukan", 13], ["sulap,", 14], ["cuma", 15, undefined, true], ["hitungan", 16, "accent", true], ["sederhana", 17]])} />
        <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 70 }}>
          <GlassCard width={380} height={300} startFrame={at(21) - from}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Label>Polis 1</Label>
              <Big size={80}>New LLP</Big>
            </AbsoluteFill>
          </GlassCard>
          <PopIn f0={at(23) - 6 - from}>
            <Accent size={120}>+</Accent>
          </PopIn>
          <GlassCard width={380} height={300} startFrame={at(23) - from}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Label>Polis 2</Label>
              <Big size={80}>AFP</Big>
            </AbsoluteFill>
          </GlassCard>
        </div>
      </AbsoluteFill>
    ),
  },
  // 3. NEW LLP
  {
    enter: "whip",
    exit: "tilt",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, gap: 24 }}>
        <Caption words={cap(from, [["Polis", 25, "small"], ["pertama", 26, "small"], ["New LLP", 27, "accent", true]])} />
        <GlassCard width={900} height={330} startFrame={at(29) - from} grid={false}>
          <div style={{ padding: "44px 56px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Label>Premi / tahun · bayar 5 tahun</Label>
            <Big size={64}>Rp 57.425.000 × 5</Big>
            <Appear f0={at(33) - from}>
              <Big size={84} color={GOLD.blue}>
                = Rp 287.125.000
              </Big>
            </Appear>
          </div>
        </GlassCard>
        <Appear f0={at(35) - from} style={{ width: 900, marginTop: 30 }}>
          <AgeBar f0={at(35) - from} />
        </Appear>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Appear f0={at(41) - from}>
            <Label size={44} color={GOLD.white}>
              Uang Pertanggungan
            </Label>
          </Appear>
          <HeroText startFrame={at(43) - from}>Rp 2,5 M</HeroText>
        </div>
      </AbsoluteFill>
    ),
  },
  // 4. AFP
  {
    enter: "tilt",
    exit: "zoomOut",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260, gap: 24 }}>
        <Caption words={cap(from, [["Polis", 47, "small"], ["kedua", 48, "small"], ["AFP", 49, "accent", true]])} />
        <GlassCard width={900} height={300} startFrame={at(50) - from} grid={false}>
          <div style={{ padding: "40px 56px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Label>Premi / tahun · bayar 5 tahun</Label>
            <Big size={64}>Rp 71.409.000 × 5</Big>
            <Appear f0={at(53) - from}>
              <Big size={84} color={GOLD.blue}>
                = Rp 357.045.000
              </Big>
            </Appear>
          </div>
        </GlassCard>
        <div style={{ width: 820, marginTop: 70 }}>
          <TimelineNode f0={at(54) - from} title="Akhir tahun ke-15" sub="usia 55 · cair 50% UP" fValue={at(59) - from} value={<Accent size={110}>Rp 325 jt</Accent>} />
          <TimelineNode f0={at(65) - from} title="Akhir tahun ke-25" sub="usia 65 · cair 50% UP" fValue={at(72) - from} value={<Accent size={110}>Rp 325 jt</Accent>} last />
        </div>
      </AbsoluteFill>
    ),
  },
  // 5. HITUNG
  {
    enter: "zoomOut",
    exit: "depthBlur",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 40 }}>
        <Caption words={cap(from, [["Sekarang", 78], ["hitung.", 79, "accent", true]])} />
        <GlassCard width={920} height={560} startFrame={at(80) - from}>
          <div style={{ padding: "50px 60px", display: "flex", flexDirection: "column", gap: 18 }}>
            <Appear f0={at(80) - from}>
              <Label size={40}>Total modal 5 tahun (LLP + AFP)</Label>
            </Appear>
            <Appear f0={at(84) - from}>
              <Counter from={0} to={644170000} startFrame={at(84) - from} duration={36} prefix="Rp " locale="id-ID" style={{ fontSize: 88, fontWeight: 600, color: GOLD.white }} />
            </Appear>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD.blue}, transparent)`, margin: "14px 0" }} />
            <Appear f0={at(90) - from}>
              <Label size={40}>Balik dari AFP (th 15 + th 25)</Label>
            </Appear>
            <Appear f0={at(94) - from}>
              <Counter from={0} to={650000000} startFrame={at(94) - from} duration={36} prefix="Rp " locale="id-ID" style={{ fontSize: 88, fontWeight: 600, color: GOLD.blue }} />
            </Appear>
          </div>
        </GlassCard>
        <Caption words={cap(from, [["Modal", 99], ["balik", 100], ["semua", 101]])} />
        <GoldBadge f0={at(102) - from}>Cuan : +Rp 5.830.000</GoldBadge>
      </AbsoluteFill>
    ),
  },
  // 6. PRAKTIS GRATIS
  {
    enter: "depthBlur",
    exit: "whip",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 520, gap: 24 }}>
        <Caption words={cap(from, [["Artinya,", 108, "small"], ["New", 109], ["LLP", 110]])} />
        <HeroText startFrame={at(111) - from}>Rp 2,5 M</HeroText>
        <Caption words={cap(from, [["yang", 115, "small"], ["cair", 116, "small"], ["di", 117, "small"], ["usia", 118, "small"], ["100", 119, "small"]])} />
        <div style={{ marginTop: 70 }}>
          <Stamp f0={at(120) - from} text="PRAKTIS GRATIS" size={96} />
        </div>
      </AbsoluteFill>
    ),
  },
  // 7. WARISAN
  {
    enter: "whip",
    exit: "pushIn",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, gap: 30 }}>
        <Caption words={cap(from, [["Kalau", 123], ["terjadi", 124], ["risiko,", 125, "accent", true]])} />
        <Caption words={cap(from, [["ahli", 126, "small"], ["waris", 127, "small"], ["menerima:", 128, "small"]])} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 20 }}>
          {[
            ["Tahun 1–15", "Rp 3,15 M", 130],
            ["Tahun 16–25", "Rp 3,475 M", 132],
            ["Tahun 26 dst", "Rp 2,5 M", 134],
          ].map(([t, v, i]) => (
            <GlassRow key={t as string} f0={at(i as number) - from} label={t as string} value={v as string} />
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Caption words={cap(from, [["Keluarga", 139], ["tetap", 140], ["menang.", 141, "accent", true]])} />
        </div>
      </AbsoluteFill>
    ),
  },
  // 8. CTA
  {
    enter: "pushIn",
    exit: "none",
    body: (from) => (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 420, gap: 30 }}>
        <Caption words={cap(from, [["Valid", 142], ["atau", 143], ["Scam?", 144, "accent", true]])} />
        <Caption words={cap(from, [["Tulis", 145, "small"], ["di", 146, "small"], ["komentar 👇", 147, "small"]])} />
        <div style={{ marginTop: 80 }}>
          <GlassCard width={860} height={380} startFrame={at(149) - from} grid={false}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Label size={38}>Konsultasi & ilustrasi resmi</Label>
              <PopIn f0={at(150) - from}>
                <Big size={110} color={GOLD.blue}>
                  Raymon
                </Big>
              </PopIn>
              <Appear f0={at(151) - from}>
                <Big size={72}>0812 8909 0202</Big>
              </Appear>
            </AbsoluteFill>
          </GlassCard>
        </div>
        <Appear f0={at(152) - from}>
          <Label size={40} color={GOLD.white}>
            Ilustrasi resmi sesuai usia Anda
          </Label>
        </Appear>
      </AbsoluteFill>
    ),
  },
];

const GlassRow: React.FC<{ f0: number; label: string; value: string }> = ({ f0, label, value }) => {
  const C = useTheme();
  const s = useAppear(f0, SPRING.pop);
  return (
    <div
      style={{
        width: 880,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "30px 48px",
        borderRadius: 28,
        border: `2px solid rgba(255,255,255,0.5)`,
        background: `linear-gradient(100deg, ${C.blueDeep}aa, ${C.glassFill})`,
        boxShadow: `0 0 40px ${C.blueDeep}88`,
        opacity: Math.min(1, s * 1.5),
        transform: `translateX(${(1 - s) * 300}px)`,
      }}
    >
      <Label size={42} color={C.white}>
        {label}
      </Label>
      <Accent size={76}>{value}</Accent>
    </div>
  );
};

/** bar usia 40 -> 100 untuk New LLP */
const AgeBar: React.FC<{ f0: number }> = ({ f0 }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f0, f0 + 40], [0, 1], { ...clamp, easing: EASE.inOut });
  const age = Math.round(40 + 60 * p);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <Label size={36} color={C.gray}>
          Usia 40
        </Label>
        <Label size={36} color={C.white} weight={600}>
          Proteksi sampai usia {age}
        </Label>
      </div>
      <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div
          style={{
            width: `${p * 100}%`,
            height: "100%",
            borderRadius: 11,
            background: `linear-gradient(90deg, ${C.blueGlow}, ${C.blue}, ${C.blueHighlight})`,
            boxShadow: `0 0 24px ${C.blue}`,
          }}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Disclaimer + kontak kecil yang menetap                              */
/* ------------------------------------------------------------------ */
const Footer: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 15], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90, opacity: o }}>
      <div style={{ fontFamily: FONT.family, fontSize: 26, color: GOLD.gray, textAlign: "center", lineHeight: 1.45 }}>
        Ilustrasi usia 40 tahun. Bukan penawaran resmi.
        <br />
        Nilai aktual sesuai ketentuan polis.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Audio: VO + musik + SFX (frame absolut)                              */
/* ------------------------------------------------------------------ */
type Sfx = [name: string, frame: number, volume: number];
const s = (sec: number) => Math.round(sec * FPS);
const SFX: Sfx[] = [
  // hook
  ["pop", at(2), 0.5],
  ["pop", at(6), 0.4],
  ["impact", at(9), 0.6],
  // transisi (whoosh mulai 3 frame sebelum batas)
  ...B.slice(1, -1).map((b): Sfx => ["whoosh", b - OV - 3, 0.45]),
  // kartu
  ["shimmer", at(21), 0.3],
  ["shimmer", at(23), 0.3],
  ["pop", at(23), 0.4],
  ["pop", at(27), 0.4],
  ["shimmer", at(29), 0.25],
  ["ding", at(43), 0.45],
  ["shimmer", at(50), 0.25],
  ["ding", at(59), 0.45],
  ["ding", at(72), 0.45],
  ["pop", at(79), 0.4],
  ["cash", at(102), 0.55],
  ["ding", at(102), 0.35],
  ["pop", at(111), 0.45],
  ["riser", at(120) - s(1.6), 0.35],
  ["impact", at(120), 0.6],
  ["pop", at(125), 0.35],
  ["pop", at(130), 0.4],
  ["pop", at(132), 0.4],
  ["pop", at(134), 0.4],
  ["ding", at(141), 0.4],
  ["pop", at(144), 0.4],
  ["impact", at(150), 0.5],
  ["shimmer", at(150), 0.3],
];
// tick untuk counter
const TICKS: number[] = [];
[at(2), at(84), at(94)].forEach((f0, k) => {
  const len = k === 0 ? 30 : 36;
  for (let f = f0; f < f0 + len; f += 3) TICKS.push(f);
});

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("vo.wav")} />
    <Audio
      src={staticFile("music.wav")}
      volume={(f) => interpolate(f, [0, 20, AFP_DURATION - 60, AFP_DURATION], [0, 0.16, 0.16, 0], clamp)}
    />
    {SFX.map(([name, f, v], i) => (
      <Sequence key={`s${i}`} from={Math.max(0, f)}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={v} />
      </Sequence>
    ))}
    {TICKS.map((f, i) => (
      <Sequence key={`t${i}`} from={f} durationInFrames={4}>
        <Audio src={staticFile("sfx/tick.wav")} volume={0.18} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------------------------------------------ */
export const AfpVideo: React.FC = () => (
  <ThemeProvider palette={GOLD}>
    <Background>
      {SCENES.map((sc, i) => {
        const from = Math.max(0, B[i] - (i === 0 ? 0 : OV));
        const dur = B[i + 1] - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Scene duration={dur} enter={sc.enter} exit={sc.exit} enterFrames={OV} exitFrames={OV}>
              {sc.body(from)}
            </Scene>
          </Sequence>
        );
      })}
      <Sequence from={B[2] - OV}>
        <Footer />
      </Sequence>
      <SoundTrack />
    </Background>
  </ThemeProvider>
);
