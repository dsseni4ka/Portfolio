import { PROJECTS_IMAGE_RADIUS } from "@/lib/projects-owow-panel";

/** Affiliate “work experience” orange panel — Figma global x=6439, w=2004. */
const AFFILIATE_WORK_PANEL_WIDTH = 2004;
const AFFILIATE_WORK_TEXT_SHIFT_X = Math.round(AFFILIATE_WORK_PANEL_WIDTH * 0.1);
const AFFILIATE_WORK_TAG_SHIFT_X = Math.round(AFFILIATE_WORK_PANEL_WIDTH * 0.05);
const AFFILIATE_WORK_SCRIPT_TITLE_SHIFT_X = Math.round(
  AFFILIATE_WORK_PANEL_WIDTH * 0.08,
);

export const AFFILIATE_WORK_PANEL = {
  width: AFFILIATE_WORK_PANEL_WIDTH,
  height: 982,
  background: "#ff5615",
  logo: {
    x: 106,
    y: 173,
    width: 342,
    height: 342,
  },
  tags: [
    {
      x: 118 + AFFILIATE_WORK_TAG_SHIFT_X,
      y: 224,
      label: "Graphic Design",
    },
    {
      x: 281 + AFFILIATE_WORK_TAG_SHIFT_X,
      y: 224,
      label: "AI Image Creation",
    },
  ],
  /** Figma bbox top-left (6741, 351) — not center-anchored. */
  scriptTitle: {
    x: 302 + AFFILIATE_WORK_SCRIPT_TITLE_SHIFT_X,
    y: 351,
    fontSize: 120.765,
  },
  marketing: {
    x: 337 + AFFILIATE_WORK_TEXT_SHIFT_X,
    y: 560,
    width: 819,
    fontSize: 26,
  },
  techStack: {
    x: 677 + AFFILIATE_WORK_TEXT_SHIFT_X,
    y: 755,
    width: 819,
    fontSize: 26,
  },
  phone: {
    x: 1427,
    y: 86,
    width: 384,
    height: 848,
    radius: PROJECTS_IMAGE_RADIUS,
  },
} as const;

/** Vertical spacing between artboard rows in the white grid (design px). */
export const AFFILIATE_ARTBOARD_ROW_STEP = 311;

/** Top tile offset in the Figma layout (design px). */
export const AFFILIATE_ARTBOARD_FIRST_Y = -137;

/** One full loop of four stacked tiles (design px). */
export const AFFILIATE_ARTBOARD_CYCLE_HEIGHT = AFFILIATE_ARTBOARD_ROW_STEP * 4;

export function getAffiliateArtboardTileTop(tileY: number, repeatIndex: number) {
  const normalizedY = tileY - AFFILIATE_ARTBOARD_FIRST_Y;
  return normalizedY + repeatIndex * AFFILIATE_ARTBOARD_CYCLE_HEIGHT;
}

export function getAffiliateArtboardRepeatIndices() {
  const count =
    AFFILIATE_ARTBOARD_REPEAT_ABOVE + AFFILIATE_ARTBOARD_REPEAT_BELOW + 2;
  return Array.from(
    { length: count },
    (_, index) => index - AFFILIATE_ARTBOARD_REPEAT_ABOVE,
  );
}

/** Extra copies above/below the viewport so the loop never shows empty space. */
export const AFFILIATE_ARTBOARD_REPEAT_ABOVE = 2;
export const AFFILIATE_ARTBOARD_REPEAT_BELOW = 4;

/** Seconds for one auto-scroll loop on every column. */
export const AFFILIATE_ARTBOARD_AUTO_DOWN_DURATION = 100;

export type AffiliateArtboardTile = {
  y: number;
  src: string;
  alt: string;
};

export type AffiliateArtboardColumn = {
  x: number;
  tiles: readonly AffiliateArtboardTile[];
};

/** White artboard grid — Figma global x=8443 … 9693 (after orange block). */
export const AFFILIATE_ARTBOARDS_PANEL = {
  width: 1250,
  height: 982,
  tileWidth: 235,
  tileHeight: 294,
  columns: [
    {
      x: 37,
      tiles: [
        { y: -137, src: "/projects/artboard-13.png", alt: "Campaign 13" },
        { y: 174, src: "/projects/artboard-3.png", alt: "Campaign 3" },
        { y: 485, src: "/projects/artboard-7.png", alt: "Campaign 7" },
        { y: 796, src: "/projects/artboard-9.png", alt: "Campaign 9" },
      ],
    },
    {
      x: 341,
      tiles: [
        { y: -137, src: "/projects/artboard-14.png", alt: "Campaign 14" },
        { y: 174, src: "/projects/artboard-1.png", alt: "Campaign 1" },
        { y: 485, src: "/projects/artboard-6.png", alt: "Campaign 6" },
        { y: 796, src: "/projects/artboard-10.png", alt: "Campaign 10" },
      ],
    },
    {
      x: 646,
      tiles: [
        { y: -137, src: "/projects/artboard-15.png", alt: "Campaign 15" },
        { y: 174, src: "/projects/artboard-2.png", alt: "Campaign 2" },
        { y: 485, src: "/projects/artboard-5.png", alt: "Campaign 5" },
        { y: 796, src: "/projects/artboard-11.png", alt: "Campaign 11" },
      ],
    },
    {
      x: 962,
      tiles: [
        { y: -137, src: "/projects/artboard-16.png", alt: "Campaign 16" },
        { y: 174, src: "/projects/artboard-4.png", alt: "Campaign 4" },
        { y: 485, src: "/projects/artboard-8.png", alt: "Campaign 8" },
        { y: 796, src: "/projects/artboard-12.png", alt: "Campaign 12" },
      ],
    },
  ] satisfies readonly AffiliateArtboardColumn[],
} as const;
