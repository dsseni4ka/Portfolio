export type SkillsPillVariant = "blue" | "purple" | "yellow" | "pink";

export type SkillsPillDef = {
  label: string;
  variant: SkillsPillVariant;
};

/** Source PNG size (all variants share this frame). */
export const SKILLS_PILL_IMAGE_WIDTH = 296;
export const SKILLS_PILL_IMAGE_HEIGHT = 99;

/** Width ÷ height — keep draw + physics in sync with assets. */
export const SKILLS_PILL_ASPECT =
  SKILLS_PILL_IMAGE_WIDTH / SKILLS_PILL_IMAGE_HEIGHT;

/** Display height (2× reference). */
export const SKILLS_PILL_HEIGHT_PX = 96;
export const SKILLS_PILL_PAD_X_PX = 32;
export const SKILLS_PILL_FONT_PX = 24;
export const SKILLS_PILL_CHAMFER_RADIUS = SKILLS_PILL_HEIGHT_PX / 2;

const VARIANT_CYCLE: SkillsPillVariant[] = ["blue", "purple", "yellow", "pink"];

export const SKILLS_PILL_LABELS: SkillsPillDef[] = [
  "UI/UX",
  "Creative Coading",
  "Web Animation",
  "After Effects",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Figma",
  "GSAP",
  "Design Sysytem",
  "Graphic Design",
  "Motion Design",
  "Web Design",
].map((label, index) => ({
  label,
  variant: VARIANT_CYCLE[index % VARIANT_CYCLE.length]!,
}));

import { getSkillsPillCanvasFont } from "@/lib/skills-pills-font";

/** Width at fixed height that matches PNG aspect ratio. */
export function getPillAspectWidth(heightPx = SKILLS_PILL_HEIGHT_PX) {
  return Math.round(heightPx * SKILLS_PILL_ASPECT);
}

export function measurePillLabelWidth(
  label: string,
  ctx: CanvasRenderingContext2D,
) {
  ctx.font = getSkillsPillCanvasFont(SKILLS_PILL_FONT_PX);
  return ctx.measureText(label).width;
}

/** Height fixed; width ≥ aspect width, grows for longer labels. */
export function getPillDimensions(
  label: string,
  measureCtx?: CanvasRenderingContext2D,
) {
  const height = SKILLS_PILL_HEIGHT_PX;
  const aspectWidth = getPillAspectWidth(height);
  const textWidth = measureCtx
    ? measurePillLabelWidth(label, measureCtx)
    : label.length * (SKILLS_PILL_FONT_PX * 0.62);
  const width = Math.max(
    aspectWidth,
    Math.ceil(textWidth + SKILLS_PILL_PAD_X_PX * 2),
  );
  return { width, height };
}
