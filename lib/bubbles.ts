export type BubbleConfig = {
  id: number;
  radius: number;
  rest: [number, number, number];
  phase: number;
  driftAmp: number;
};

const DESKTOP_BUBBLES: BubbleConfig[] = [
  { id: 0, radius: 0.55, rest: [-1.2, 0.8, 0], phase: 0, driftAmp: 0.06 },
  { id: 1, radius: 0.42, rest: [-0.4, 1.1, 0.2], phase: 0.8, driftAmp: 0.05 },
  { id: 2, radius: 0.68, rest: [0.5, 0.6, -0.1], phase: 1.2, driftAmp: 0.07 },
  { id: 3, radius: 0.35, rest: [1.1, 0.9, 0.15], phase: 2.1, driftAmp: 0.04 },
  { id: 4, radius: 0.5, rest: [-0.8, -0.2, 0], phase: 0.4, driftAmp: 0.05 },
  { id: 5, radius: 0.38, rest: [0.1, -0.5, 0.1], phase: 1.6, driftAmp: 0.06 },
  { id: 6, radius: 0.72, rest: [0.9, -0.3, -0.05], phase: 2.8, driftAmp: 0.08 },
  { id: 7, radius: 0.3, rest: [-1.5, -0.6, 0.2], phase: 0.2, driftAmp: 0.04 },
  { id: 8, radius: 0.45, rest: [1.4, 0.2, 0], phase: 3.2, driftAmp: 0.05 },
  { id: 9, radius: 0.58, rest: [-0.2, 0.3, -0.15], phase: 1.9, driftAmp: 0.06 },
];

const MOBILE_BUBBLES: BubbleConfig[] = DESKTOP_BUBBLES.filter((_, i) =>
  [0, 2, 4, 5, 6, 9].includes(i),
);

export function getBubbleConfigs(mobile: boolean): BubbleConfig[] {
  return mobile ? MOBILE_BUBBLES : DESKTOP_BUBBLES;
}

export const BUBBLE_MATERIAL = {
  transmission: 1,
  roughness: 0.05,
  thickness: 1.2,
  ior: 1.45,
  iridescence: 1,
  iridescenceIOR: 1.3,
  chromaticAberration: 0.04,
  distortion: 0.12,
  anisotropy: 0.15,
} as const;

export const DRAG_PLANE_Z = 0;
export const SPRING_STRENGTH = 0.06;
export const POINTER_INFLUENCE = 1.4;
export const IDLE_SPEED = 0.35;
