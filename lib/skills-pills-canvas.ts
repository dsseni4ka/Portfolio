import type { SkillsPillVariant } from "@/lib/skills-pills-data";
import { SKILLS_PILL_FONT_PX } from "@/lib/skills-pills-data";
import {
  ensureSkillsPillFontLoaded,
  getSkillsPillCanvasFont,
} from "@/lib/skills-pills-font";
import { getPillStyle, SKILLS_PILL_STYLES } from "@/lib/skills-pill-styles";

export type PillDrawItem = {
  label: string;
  variant: SkillsPillVariant;
  widthPx: number;
  heightPx: number;
  x: number;
  y: number;
  angle: number;
};

const imageCache = new Map<SkillsPillVariant, HTMLImageElement>();
let loadPromise: Promise<void> | null = null;

function loadImage(variant: SkillsPillVariant) {
  const cached = imageCache.get(variant);
  if (cached?.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = cached ?? new Image();
    if (!cached) {
      imageCache.set(variant, img);
      img.decoding = "async";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load pill image: ${variant}`));
    img.src = getPillStyle(variant).src;
  });
}

export function preloadSkillsPillImages() {
  if (!loadPromise) {
    const variants = Object.keys(SKILLS_PILL_STYLES) as SkillsPillVariant[];
    loadPromise = Promise.all([
      ensureSkillsPillFontLoaded(SKILLS_PILL_FONT_PX),
      ...variants.map(loadImage),
    ]).then(() => undefined);
  }
  return loadPromise;
}

export function drawSkillsPills(
  ctx: CanvasRenderingContext2D,
  pills: PillDrawItem[],
) {
  const font = getSkillsPillCanvasFont(SKILLS_PILL_FONT_PX);

  for (let i = 0; i < pills.length; i++) {
    const pill = pills[i]!;
    const img = imageCache.get(pill.variant);
    if (!img?.complete || img.naturalWidth === 0) continue;

    const style = getPillStyle(pill.variant);
    const w = pill.widthPx;
    const h = pill.heightPx;

    ctx.save();
    ctx.translate(pill.x, pill.y);
    ctx.rotate(pill.angle);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.font = font;
    ctx.fillStyle = style.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pill.label, 0, 0);
    ctx.restore();
  }
}
