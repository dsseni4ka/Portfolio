const FALLBACK_FAMILY = '"DM Mono", ui-monospace, monospace';

/**
 * Canvas 2D ignores CSS variables in ctx.font — resolve the real family from :root.
 */
export function getSkillsPillFontFamily(): string {
  if (typeof document === "undefined") return FALLBACK_FAMILY;
  const fromRoot = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-dm-mono")
    .trim();
  return fromRoot || FALLBACK_FAMILY;
}

export function getSkillsPillCanvasFont(sizePx: number): string {
  return `400 ${sizePx}px ${getSkillsPillFontFamily()}`;
}

export async function ensureSkillsPillFontLoaded(sizePx: number): Promise<void> {
  if (typeof document === "undefined" || !document.fonts?.load) return;
  const font = getSkillsPillCanvasFont(sizePx);
  await document.fonts.load(font);
  await document.fonts.ready;
}
