import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Background, Caption, Counter, GlassCard, HeroText, RadialProgress, Scene, words } from "./design/components";
import { COLORS, EASE, FONT, TIMING } from "./design/tokens";

const T = TIMING.transition;

const Bars: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 36, paddingBottom: 40 }}>
      {[0.35, 0.55, 0.75, 0.95].map((h, i) => {
        const p = interpolate(frame, [start + i * 4, start + i * 4 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
        return (
          <div key={i} style={{ width: 70, height: 300 * h * p, borderRadius: 10, background: `linear-gradient(${COLORS.blueBright}, ${COLORS.blueGlow})`, boxShadow: `0 0 30px ${COLORS.blue}` }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const StyleDemo: React.FC = () => (
  <Background>
    {/* Scene 1 */}
    <Sequence durationInFrames={100}>
      <Scene duration={100} exit="whip">
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 420, gap: 60 }}>
          <Caption words={words("What if you could trade with")} />
          <GlassCard width={700} height={200} startFrame={20} grid={false}>
            <div style={{ padding: "34px 44px", fontFamily: FONT.family }}>
              <div style={{ color: COLORS.blueHighlight, fontSize: FONT.label.size, fontWeight: 500 }}>Balance</div>
              <Counter from={88070} to={100000} startFrame={24} prefix="$" style={{ color: COLORS.white, fontSize: 72, fontWeight: 600 }} />
            </div>
          </GlassCard>
          <Caption startFrame={45} words={words("without putting your |*own~money* _on_ _the_ _line_")} />
        </AbsoluteFill>
      </Scene>
    </Sequence>
    {/* Scene 2 */}
    <Sequence from={100 - T} durationInFrames={90}>
      <Scene duration={90} enter="whip" exit="tilt" exitFrames={TIMING.transitionLong}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 480, gap: 40 }}>
          <Caption words={words("You got the |*Skills*")} />
          <GlassCard width={760} height={440} startFrame={12}>
            <Bars start={22} />
          </GlassCard>
        </AbsoluteFill>
      </Scene>
    </Sequence>
    {/* Scene 3 */}
    <Sequence from={190 - TIMING.transitionLong} durationInFrames={110}>
      <Scene duration={110} enter="tilt" enterFrames={TIMING.transitionLong} exit="depthBlur" exitFrames={20}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 520, gap: 40 }}>
          <Caption words={words("You keep up _to_")} />
          <GlassCard width={420} height={420} startFrame={6}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <RadialProgress to={90} size={300} startFrame={10} />
              <Counter from={0} to={90} startFrame={10} suffix="%" style={{ position: "absolute", color: COLORS.white, fontSize: 64, fontWeight: 600 }} />
            </AbsoluteFill>
          </GlassCard>
          <HeroText startFrame={40}>90%</HeroText>
          <Caption startFrame={55} words={words("_of_ _the_ _profits_")} />
        </AbsoluteFill>
      </Scene>
    </Sequence>
    {/* Scene 4 */}
    <Sequence from={300 - 20} durationInFrames={96}>
      <Scene duration={96} enter="depthBlur" enterFrames={20}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
          <Caption words={words("All starting from")} />
          <HeroText startFrame={18}>$99</HeroText>
        </AbsoluteFill>
      </Scene>
    </Sequence>
  </Background>
);
