import { Easing } from "remotion";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/600-italic.css";
import "@fontsource/poppins/700-italic.css";

/** design_1.md §1: palet "Crimson Brand Reel" */
export const C = {
  crimsonBright: "#C50003",
  crimson: "#AB0003",
  brandRed: "#910102",
  crimsonDeep: "#860003",
  maroon: "#650001",
  oxblood: "#520001",
  nearBlack: "#210000",
  white: "#FFFFFF",
  offWhite: "#E3DDDD",
  pinkMist: "#D1A8AB",
  rosyGrey: "#B7989A",
  charcoal: "#4A4A4A",
  mutedGrey: "#8A8A8A",
} as const;

export const FONT = "Poppins, sans-serif";

/** design_1.md §4 */
export const E = {
  snapOut: Easing.bezier(0.16, 1, 0.3, 1),
  snapIn: Easing.bezier(0.7, 0, 0.84, 0),
  swiftInOut: Easing.bezier(0.83, 0, 0.17, 1),
};
export const S = {
  pop: { damping: 12, stiffness: 200, mass: 0.6 },
  soft: { damping: 20, stiffness: 120, mass: 1 },
  drop: { damping: 9, stiffness: 160, mass: 0.8 },
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
