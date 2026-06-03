import { FIGMA_FRAME } from "@/lib/figma-hero";

/** Figma artboard aspect (1512×982) — bubble motion uses matching XY limits. */
export const HERO_FRAME_ASPECT = FIGMA_FRAME.width / FIGMA_FRAME.height;

export type HeroBubbleBounds = {
  boundsX: number;
  boundsY: number;
};

/**
 * Metaball XY limits inside the hero frame.
 * `boundsScale` comes from settings (`rayBounds`, default 1).
 */
export function getHeroBubbleBounds(
  boundsScale = 1,
  options?: { mobile?: boolean; viewportScale?: number },
): HeroBubbleBounds {
  const mobile = options?.mobile ?? false;
  const viewportScale = options?.viewportScale ?? 1;

  const pad = 0.08;
  const mobileTighten = mobile ? 0.92 : 1;
  const smallScreenTighten =
    viewportScale < 0.4 ? 0.9 : viewportScale < 0.55 ? 0.95 : 1;

  const scale = boundsScale * mobileTighten * smallScreenTighten;
  const boundsY = 0.88 * scale * (1 - pad);
  const boundsX = boundsY * HERO_FRAME_ASPECT * (1 - pad);

  return { boundsX, boundsY };
}

/** Hero stage scale factor (same math as HeroFigmaStage). */
export function getHeroViewportScale(
  width = typeof window !== "undefined" ? window.innerWidth : FIGMA_FRAME.width,
  height = typeof window !== "undefined" ? window.innerHeight : FIGMA_FRAME.height,
) {
  return Math.min(width / FIGMA_FRAME.width, height / FIGMA_FRAME.height);
}
