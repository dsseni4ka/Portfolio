/** Affiliate “work experience” orange panel — Figma global x=6439, w=2004. */
export const AFFILIATE_WORK_PANEL = {
  width: 2004,
  height: 982,
  background: "#ff5615",
  logo: {
    x: 106,
    y: 173,
    width: 342,
    height: 342,
  },
  tags: [
    { x: 118, y: 224, label: "graphic design" },
    { x: 281, y: 224, label: "AI images" },
  ],
  /** Figma bbox top-left (6741, 351) — not center-anchored. */
  scriptTitle: {
    x: 302,
    y: 351,
    fontSize: 120.765,
  },
  marketing: {
    x: 118,
    y: 560,
    width: 819,
    fontSize: 41.645,
  },
  techStack: {
    x: 677,
    y: 755,
    width: 819,
    fontSize: 41.645,
  },
  phone: {
    x: 1509,
    y: 98,
    width: 387,
    height: 839,
    radius: 56,
  },
} as const;

/** White artboard grid — Figma global x=8443 … 9693 (after orange block). */
export const AFFILIATE_ARTBOARDS_PANEL = {
  width: 1250,
  height: 982,
  tileWidth: 235,
  tileHeight: 294,
  /** Rounded join where white grid meets the orange panel. */
  tiles: [
    { x: 37, y: -137, src: "/projects/artboard-13.png", alt: "Campaign 13" },
    { x: 341, y: -137, src: "/projects/artboard-14.png", alt: "Campaign 14" },
    { x: 646, y: -137, src: "/projects/artboard-15.png", alt: "Campaign 15" },
    { x: 962, y: -137, src: "/projects/artboard-16.png", alt: "Campaign 16" },
    { x: 37, y: 174, src: "/projects/artboard-3.png", alt: "Campaign 3" },
    { x: 341, y: 174, src: "/projects/artboard-1.png", alt: "Campaign 1" },
    { x: 646, y: 174, src: "/projects/artboard-2.png", alt: "Campaign 2" },
    { x: 962, y: 174, src: "/projects/artboard-4.png", alt: "Campaign 4" },
    { x: 37, y: 485, src: "/projects/artboard-7.png", alt: "Campaign 7" },
    { x: 341, y: 485, src: "/projects/artboard-6.png", alt: "Campaign 6" },
    { x: 642, y: 485, src: "/projects/artboard-5.png", alt: "Campaign 5" },
    { x: 962, y: 485, src: "/projects/artboard-8.png", alt: "Campaign 8" },
    { x: 37, y: 796, src: "/projects/artboard-9.png", alt: "Campaign 9" },
    { x: 341, y: 796, src: "/projects/artboard-10.png", alt: "Campaign 10" },
    { x: 647, y: 796, src: "/projects/artboard-11.png", alt: "Campaign 11" },
    { x: 962, y: 796, src: "/projects/artboard-12.png", alt: "Campaign 12" },
  ],
} as const;
