import { FIGMA_FRAME } from "@/lib/figma-hero";

/** Figma artboard aspect (1512×982). */
export const HERO_FRAME_ASPECT = FIGMA_FRAME.width / FIGMA_FRAME.height;

/** bubble2.frag camera (u_camPos.z ≈ 4.2, ray lens z = 1.65). */
const BUBBLE_TRACE_CAM_Z = 4.2;
const BUBBLE_TRACE_LENS_Z = 1.65;

/** Visible XY half-extents at the metaball plane for a given layer aspect. */
export function getShaderFrustumHalfExtents(aspect: number) {
  return {
    halfX: (BUBBLE_TRACE_CAM_Z * (aspect * 0.5)) / BUBBLE_TRACE_LENS_Z,
    halfY: (BUBBLE_TRACE_CAM_Z * 0.5) / BUBBLE_TRACE_LENS_Z,
  };
}

export type HeroBubbleBounds = {
  boundsX: number;
  boundsY: number;
};

/** Aspect ratio of the live bubble layer (`[data-hero-motion]`). */
export function getHeroMotionLayerAspect(
  width = typeof window !== "undefined" ? window.innerWidth : FIGMA_FRAME.width,
  height = typeof window !== "undefined" ? window.innerHeight : FIGMA_FRAME.height,
): number {
  if (typeof document !== "undefined") {
    const el = document.querySelector("[data-hero-motion]");
    const rect = el?.getBoundingClientRect();
    if (rect && rect.width > 8 && rect.height > 8) {
      return rect.width / rect.height;
    }
  }
  if (height > 0) return width / height;
  return HERO_FRAME_ASPECT;
}

/**
 * Metaball XY limits — fills the bubble layer (viewport-sized hero canvas).
 * `boundsScale` comes from settings (`rayBounds`, default 1).
 */
export function getHeroBubbleBounds(
  boundsScale = 1,
  options?: {
    mobile?: boolean;
    viewportScale?: number;
    layerAspect?: number;
  },
): HeroBubbleBounds {
  const mobile = options?.mobile ?? false;
  const viewportScale = options?.viewportScale ?? 1;
  const aspect = options?.layerAspect ?? getHeroMotionLayerAspect();

  const mobileTighten = mobile ? 0.98 : 1;
  const smallScreenTighten =
    viewportScale < 0.4 ? 0.96 : viewportScale < 0.55 ? 0.98 : 1;

  const scale = boundsScale * mobileTighten * smallScreenTighten;
  const { halfX, halfY } = getShaderFrustumHalfExtents(aspect);
  // Match visible canvas edges (bubble2.frag frustum at z = 0).
  const boundsY = halfY * scale;
  const boundsX = halfX * scale;

  return { boundsX, boundsY };
}

/** Hero stage scale factor for typography (Figma artboard fit). */
export function getHeroViewportScale(
  width = typeof window !== "undefined" ? window.innerWidth : FIGMA_FRAME.width,
  height = typeof window !== "undefined" ? window.innerHeight : FIGMA_FRAME.height,
) {
  return Math.min(width / FIGMA_FRAME.width, height / FIGMA_FRAME.height);
}

/** Scale for centered Figma typography overlay. */
export function getHeroContentScale(
  width = typeof window !== "undefined" ? window.innerWidth : FIGMA_FRAME.width,
  height = typeof window !== "undefined" ? window.innerHeight : FIGMA_FRAME.height,
) {
  return getHeroViewportScale(width, height);
}
