/** OWOW Dashboard panel — Figma global x=9693 … 11930 (node 88:151). */
export const OWOW_DASHBOARD_PANEL = {
  width: 2237,
  height: 982,
  tags: [
    { x: 204, y: 411, label: "Next.js" },
    { x: 301, y: 411, label: "Fullstack" },
    { x: 417, y: 411, label: "Design System" },
  ],
  title: {
    x: 191,
    y: 415,
    fontSize: 120.765,
  },
  subtitle: {
    x: 378,
    y: 511,
    fontSize: 120.765,
  },
  body: {
    x: 616,
    y: 708,
    width: 475,
    fontSize: 24.153,
  },
  mockup: {
    x: 1172,
    y: 56,
    width: 1065,
    height: 741,
  },
} as const;

/**
 * OWOW dashboard continuation — single Figma canvas x=11930 … 15949 (node 88:151).
 * Tech stack, Figma screenshots, copy, and design-system artboard share one panel.
 */
export const OWOW_DASHBOARD_CONTINUATION_PANEL = {
  width: 4099,
  height: 982,
  techStack: {
    x: 203,
    y: 213,
    width: 504,
    fontSize: 24.153,
  },
  /** image 17 — dashboard screen artboards. */
  screens: {
    x: 506,
    y: 385,
    width: 815,
    height: 530,
    src: "/projects/dashboard-screens.jpg",
    alt: "OWOW dashboard Figma design workspace",
  },
  /** image 18 — Figma workspace view. */
  workspace: {
    x: 1194,
    y: 98,
    width: 815,
    height: 530,
    src: "/projects/dashboard-figma.png",
    alt: "OWOW dashboard Figma design file",
  },
  body: {
    x: 2147,
    y: 650,
    width: 475,
    fontSize: 24.153,
  },
  /** image 19 — Technological Brutalism design system. */
  designSystem: {
    x: 2663,
    y: 151,
    width: 1436,
    height: 737,
    src: "/projects/owow-design-system.png",
    alt: "OWOW Technological Brutalism design system",
  },
} as const;
