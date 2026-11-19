import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { StyleDemo } from "./StyleDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={90} // 3 detik @ 30fps
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="StyleDemo"
      component={StyleDemo}
      durationInFrames={376}
      fps={30}
      width={1080}
      height={1920}
    />
    </>
  );
};
