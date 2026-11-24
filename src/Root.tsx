import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { StyleDemo } from "./StyleDemo";
import { AfpVideo, AFP_DURATION } from "./afp/AfpVideo";
import { AhpVideo, AHP_DURATION } from "./ahp/AhpVideo";

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
    <Composition
      id="AfpBundling"
      component={AfpVideo}
      durationInFrames={AFP_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="AhpPensiun"
      component={AhpVideo}
      durationInFrames={AHP_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    </>
  );
};
