import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: 140,
          fontWeight: 800,
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        Hello
        <br />
        Remotion
      </div>
      <div style={{ position: "absolute", bottom: 160, fontSize: 48, opacity: 0.8 }}>
        Frame {frame} / 1080x1920 @ 30fps
      </div>
    </AbsoluteFill>
  );
};
