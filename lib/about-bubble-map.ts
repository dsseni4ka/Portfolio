function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Slightly lower than hero — single blob, stable ray march. */
export const ABOUT_BUBBLE_META_THRESHOLD = 0.84;

function mapAboutBubbleEased(progress: number) {
  const p = clamp(progress, 0, 1);
  if (p <= 0) return 0;
  return 1 - Math.pow(1 - p, 1.35);
}

/** Metaball radius — keep ≤ ~1.0 so ray march stays stable. */
export function mapAboutBubbleRadius(progress: number) {
  const eased = mapAboutBubbleEased(progress);
  if (eased <= 0) return 0;
  const minRadius = 0.18;
  const maxRadius = 1.02;
  return minRadius + (maxRadius - minRadius) * eased;
}

/** Pull camera in as the bubble grows (bigger on screen). */
export function mapAboutBubbleCameraDistance(progress: number) {
  const eased = mapAboutBubbleEased(progress);
  return 4.2 - eased * 1.92;
}

/** < 1 zooms the ray fan — bubble fills more of the viewport at full progress. */
export function mapAboutBubbleViewScale(progress: number) {
  const eased = mapAboutBubbleEased(progress);
  return 1 - eased * 0.52;
}

export function mapAboutBubbleVisibility(progress: number) {
  return progress > 0.001;
}
