import { FIGMA_FRAME } from "@/lib/figma-hero";

/** Figma artboard aspect (1512×982). */
export const HERO_FRAME_ASPECT = FIGMA_FRAME.width / FIGMA_FRAME.height;

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

  const pad = 0.01;
  const mobileTighten = mobile ? 0.96 : 1;
  const smallScreenTighten =
    viewportScale < 0.4 ? 0.94 : viewportScale < 0.55 ? 0.97 : 1;

  const scale = boundsScale * mobileTighten * smallScreenTighten;
  const boundsY = 1.14 * scale * (1 - pad);
  const boundsX = boundsY * aspect * (1 - pad);

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
