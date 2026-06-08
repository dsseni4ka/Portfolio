/** Figma MacBook Pro 14″ frame — OWOW “Atlas in Motion” panel (node 88:151). */
export const PROJECTS_INTRO_PANEL_WIDTH = 1080;

/** Uniform corner radius for project section images (design px, scaled via --projects-scale). */
export const PROJECTS_IMAGE_RADIUS = 18;

export const OWOW_PANEL = {
  /** Global x=1080 → panel origin; width through image right edge (2903). */
  width: 1823,
  height: 982,
  image: {
    x: 800,
    y: 98,
    width: 1023,
    height: 556,
    radius: PROJECTS_IMAGE_RADIUS,
  },
  body: {
    x: 254,
    y: 352,
    width: 475,
    fontSize: 24.153,
  },
  title: {
    x: 0,
    y: 598,
    fontSize: 120.765,
  },
  subtitle: {
    x: 101,
    y: 694,
    fontSize: 120.765,
  },
  tags: [
    { x: 8, y: 595, label: "GSAP" },
    { x: 84, y: 595, label: "Web Animation" },
  ],
  visit: {
    x: 1710,
    y: 670,
    fontSize: 24,
  },
} as const;

export const PROJECTS_INTRO = {
  width: PROJECTS_INTRO_PANEL_WIDTH,
  title: {
    x: 218,
    y: 439,
    fontSize: 56.986,
    width: 442,
  },
  scrollHint: {
    x: 187,
    y: 513,
    fontSize: 22.795,
  },
} as const;

/** OWOW landing / contest panel — global x=2903 … 6439 (node 88:151). */
export const OWOW_LANDING_PANEL = {
  width: 3536,
  height: 982,
  wireframes: {
    x: 295,
    y: 517,
    width: 338,
    fontSize: 24.153,
  },
  figmaShot: {
    x: 679,
    y: 122,
    width: 728,
    height: 437,
    radius: PROJECTS_IMAGE_RADIUS,
  },
  techStack: {
    x: 842,
    y: 820,
    width: 475,
    fontSize: 24.153,
  },
  laptop: {
    x: 1285,
    y: 376,
    width: 949,
    height: 516,
    radius: PROJECTS_IMAGE_RADIUS,
  },
  contest: {
    x: 2156,
    y: 200,
    width: 475,
    fontSize: 24.153,
  },
  teamPhoto: {
    x: 2653,
    y: 0,
    width: 883,
    height: 981,
  },
} as const;

export function projectsPx(value: number) {
  return `calc(${value}px * var(--projects-scale, 1))`;
}

/** Clips images/videos to the shared project corner radius (works inside GSAP transforms). */
export function projectsImageFrameStyle() {
  const radius = projectsPx(PROJECTS_IMAGE_RADIUS);
  return {
    borderRadius: radius,
    overflow: "hidden" as const,
    transform: "translateZ(0)",
  };
}
