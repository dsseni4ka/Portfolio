import {
  ABOUT_BUBBLE_META_THRESHOLD,
  mapAboutBubbleCameraDistance,
  mapAboutBubbleRadius,
  mapAboutBubbleViewScale,
} from "@/lib/about-bubble-map";

const BUBBLE_LENS_Z = 1.65;

/** Screen-space circle matching the about metaball at `progress` (center = canvas center). */
export function getAboutBubbleScreenCircle(
  width: number,
  height: number,
  progress: number,
  metaBlend = 0.76,
) {
  const safeW = Math.max(width, 1);
  const safeH = Math.max(height, 1);
  const aspect = safeW / safeH;
  const camDist = mapAboutBubbleCameraDistance(progress);
  const viewScale = Math.max(mapAboutBubbleViewScale(progress), 0.35);
  const blobRadius = mapAboutBubbleRadius(progress);

  const halfY = (camDist * 0.5) / BUBBLE_LENS_Z;
  const isoK = Math.sqrt(1 / ABOUT_BUBBLE_META_THRESHOLD - 1);
  const worldR = blobRadius * metaBlend * isoK;
  const ndcR = worldR / viewScale / halfY;
  const radiusPx = ndcR * (safeH * 0.5);

  return {
    centerX: safeW * 0.5,
    centerY: safeH * 0.5,
    radiusPx: Math.max(8, radiusPx),
    aspect,
    halfX: halfY * aspect,
    halfY,
  };
}
