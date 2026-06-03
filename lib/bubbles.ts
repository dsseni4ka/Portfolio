import type { BubbleAccent } from "@/lib/bubble-palette";
import { WOBBLE_SPHERE } from "@/lib/wobble-reference";

export type BubbleConfig = {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  accent: BubbleAccent;
};

/** Single hero bubble with pmndrs-style wobble */
export const BUBBLE_BLOBS: BubbleConfig[] = [
  {
    position: [0, 0.06, 0],
    scale: 1.58,
    speed: WOBBLE_SPHERE.speed,
    distort: WOBBLE_SPHERE.distort,
    accent: "magenta",
  },
];

export const BUBBLE_BLOBS_MOBILE: BubbleConfig[] = [
  {
    position: [0, 0.04, 0],
    scale: 1.32,
    speed: 1.6,
    distort: 0.34,
    accent: "magenta",
  },
];
