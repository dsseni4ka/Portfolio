export type ProjectTag = {
  label: string;
  muted?: boolean;
};

export type MotionClip = {
  label: string;
  image: string;
  width: number;
  height: number;
};

/** Panel widths derived from Figma frame (27584×982); scaled in CSS via --projects-scale. */
export const PROJECTS_DESIGN_WIDTH = 27584;
export const PROJECTS_DESIGN_HEIGHT = 982;

export const AFFILIATE_ARTBOARDS = Array.from({ length: 12 }, (_, i) => ({
  src: `/projects/artboard-${i + 1}.png`,
  alt: `Affiliate campaign visual ${i + 1}`,
}));

export const MOTION_CLIPS: MotionClip[] = [
  { label: "HUG", image: "/projects/filming-drag-2.png", width: 1116, height: 628 },
  { label: "MELTING", image: "/projects/filming-drag-3.png", width: 914, height: 514 },
  { label: "SHOOT", image: "/projects/filming-drag-4.png", width: 645, height: 363 },
  { label: "LUCID", image: "/projects/artboard-5.png", width: 612, height: 344 },
  { label: "Falling", image: "/projects/artboard-8.png", width: 672, height: 378 },
  { label: "GARAGE", image: "/projects/artboard-11.png", width: 672, height: 378 },
];
