/** Figma frame: MacBook Pro 14' - 28 (node 142:16). */
export const CONNECT_DESIGN_WIDTH = 1512;

export const CONNECT_CONTENT_LEFT = 263;
/** Scales hero image + title relative to the Figma frame. */
export const CONNECT_HERO_SCALE = 0.82;
export const CONNECT_CONTENT_WIDTH = Math.round(998 * CONNECT_HERO_SCALE);
export const CONNECT_IMAGE_HEIGHT = Math.round(561 * CONNECT_HERO_SCALE);

/** Converts Figma global x into content-local design px. */
function contentX(globalX: number) {
  return (globalX - CONNECT_CONTENT_LEFT) * CONNECT_HERO_SCALE;
}

/** Converts Figma global y into offset below the title block. */
function contentY(globalY: number, titleTop: number, titleFontSize: number) {
  return (globalY - titleTop - titleFontSize) * CONNECT_HERO_SCALE;
}

const FIGMA_TITLE_TOP = 674;
const FIGMA_TITLE_FONT_SIZE = 131.095;

export const CONNECT_SECTION = {
  image: {
    src: "/connect/my-video.webm",
    alt: "Diana working at a creative desk setup",
    y: 109,
    width: CONNECT_CONTENT_WIDTH,
    height: CONNECT_IMAGE_HEIGHT,
    radius: Math.round(18 * CONNECT_HERO_SCALE),
    imageHeightPercent: 115.6,
    imageTopPercent: -10.04,
  },
  title: {
    text: "LET\u2019S CONNECT",
    marginTop: 28,
    fontSize: FIGMA_TITLE_FONT_SIZE * CONNECT_HERO_SCALE,
    lineHeight: 1,
    letterSpacing: 0,
  },
  contact: {
    fontSize: 16 * CONNECT_HERO_SCALE * 1.07,
    marginTop: contentY(845, FIGMA_TITLE_TOP, FIGMA_TITLE_FONT_SIZE),
    row2Y: contentY(887, FIGMA_TITLE_TOP, FIGMA_TITLE_FONT_SIZE),
    personalLabelX: contentX(263),
    personalEmailX: contentX(472),
    studentLabelX: contentX(263),
    studentEmailX: contentX(464),
    linkedInLabelX: contentX(1003),
    linkedInValueX: contentX(1154),
    phoneLabelX: contentX(906),
    phoneValueX: contentX(1096),
  },
  rows: [
    {
      label: "my personal email",
      value: "hello@dianasenik.com",
      href: "mailto:hello@dianasenik.com",
    },
    {
      label: "my student email",
      value: "555298@student.fontys.nl",
      href: "mailto:555298@student.fontys.nl",
    },
  ],
  linkedIn: {
    label: "my LinkedIn",
    value: "Diana Senik",
    href: "https://www.linkedin.com/in/diana-senik-181897329",
  },
  phone: {
    label: "my phone number",
    value: "+380 68 634 17 80",
    href: "tel:+380686341780",
  },
} as const;

export function connectPx(value: number) {
  return `calc(${value}px * var(--connect-scale, 1))`;
}
