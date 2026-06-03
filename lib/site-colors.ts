/** Neutral matte gray — sampled from mockup flat areas (#E7E7E7) */
export const SITE_BACKGROUND = "#E7E7E7";

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ];
}

/** sRGB 0–1 for WebGL / shaders */
export const SITE_BACKGROUND_RGB = hexToRgb01(SITE_BACKGROUND);

/** GLSL vec3 literal — keep in sync with bubble2.frag BG_COLOR */
export const SITE_BACKGROUND_GLSL = `vec3(${SITE_BACKGROUND_RGB.map((c) => c.toFixed(4)).join(", ")})`;
