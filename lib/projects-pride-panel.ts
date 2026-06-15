import { PROJECTS_IMAGE_RADIUS } from "@/lib/projects-owow-panel";

/** Eindhoven Pride intro — Figma global x=16307 … 18484 (node 88:151). */
const EINDHOVEN_PRIDE_LOGO_X = 1314;
const EINDHOVEN_PRIDE_LOGO_Y = 119;
const EINDHOVEN_PRIDE_LOGO_WIDTH = 396;
const EINDHOVEN_PRIDE_LOGO_HEIGHT = 703;
const EINDHOVEN_PRIDE_PATTERN_X = 1768;
const EINDHOVEN_PRIDE_PATTERN_WIDTH = 409;
const PRIDE_VIDEO_GAP =
  EINDHOVEN_PRIDE_PATTERN_X -
  (EINDHOVEN_PRIDE_LOGO_X + EINDHOVEN_PRIDE_LOGO_WIDTH);

export const EINDHOVEN_PRIDE_PANEL = {
  width:
    EINDHOVEN_PRIDE_PATTERN_X +
    EINDHOVEN_PRIDE_PATTERN_WIDTH +
    PRIDE_VIDEO_GAP +
    EINDHOVEN_PRIDE_LOGO_WIDTH,
  height: 982,
  motion: {
    x: 799,
    y: 307,
    width: 475,
    fontSize: 24.153,
  },
  subtitle: {
    x: 603,
    y: 594,
    fontSize: 120.765,
  },
  title: {
    x: 0,
    y: 665,
    fontSize: 120.765,
  },
  tags: [
    { x: 0, y: 821, label: "Adobe After Effects" },
    { x: 213, y: 821, label: "Davinci Resolve" },
  ],
  logo: {
    x: EINDHOVEN_PRIDE_LOGO_X,
    y: EINDHOVEN_PRIDE_LOGO_Y,
    width: EINDHOVEN_PRIDE_LOGO_WIDTH,
    height: EINDHOVEN_PRIDE_LOGO_HEIGHT,
    radius: PROJECTS_IMAGE_RADIUS,
    src: "/projects/pride-logo.webm",
    alt: "Eindhoven Pride logo animation",
  },
  pattern: {
    x: EINDHOVEN_PRIDE_PATTERN_X,
    y: 207,
    width: EINDHOVEN_PRIDE_PATTERN_WIDTH,
    height: 727,
    radius: PROJECTS_IMAGE_RADIUS,
    src: "/projects/pride-theme-reveal.webm",
    alt: "Eindhoven Pride theme reveal animation",
  },
  outside: {
    x:
      EINDHOVEN_PRIDE_PATTERN_X +
      EINDHOVEN_PRIDE_PATTERN_WIDTH +
      PRIDE_VIDEO_GAP,
    y: EINDHOVEN_PRIDE_LOGO_Y,
    width: EINDHOVEN_PRIDE_LOGO_WIDTH,
    height: EINDHOVEN_PRIDE_LOGO_HEIGHT,
    radius: PROJECTS_IMAGE_RADIUS,
    src: "/projects/pride-outside.webm",
    alt: "Eindhoven Pride outdoor filming",
  },
} as const;

/** Eindhoven Pride filming — Figma global x=18484 … 20327 (node 88:151). */
export const EINDHOVEN_PRIDE_FILMING_PANEL = {
  width: 1843,
  height: 982,
  experience: {
    x: 101,
    y: 609,
    width: 475,
    fontSize: 24.153,
  },
  stills: [
    {
      x: 576,
      y: 129,
      width: 317,
      height: 423,
      src: "/projects/filming-drag-2.png",
      alt: "Pride content filming",
    },
    {
      x: 933,
      y: 443,
      width: 249,
      height: 332,
      src: "/projects/filming-drag-3.png",
      alt: "Pride campaign camera monitor",
    },
    {
      x: 685,
      y: 671,
      width: 191,
      height: 254,
      src: "/projects/filming-drag-4.png",
      alt: "Pride behind-the-scenes filming",
    },
  ],
  patternWide: {
    x: 1291,
    y: 1,
    width: 552,
    height: 981,
    src: "/projects/pride-filming-wide.webm",
    alt: "Eindhoven Pride filming screen recording",
  },
} as const;
