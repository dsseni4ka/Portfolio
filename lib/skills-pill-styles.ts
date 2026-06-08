import type { SkillsPillVariant } from "@/lib/skills-pills-data";

export type SkillsPillStyle = {
  src: string;
  color: string;
};

export const SKILLS_PILL_STYLES: Record<SkillsPillVariant, SkillsPillStyle> = {
  blue: {
    src: "/skills-pills/blue.png",
    color: "#ffffff",
  },
  purple: {
    src: "/skills-pills/purple.png",
    color: "#ffffff",
  },
  yellow: {
    src: "/skills-pills/yellow.png",
    color: "#ffffff",
  },
  pink: {
    src: "/skills-pills/pink.png",
    color: "#ffffff",
  },
};

export function getPillStyle(variant: SkillsPillVariant): SkillsPillStyle {
  return SKILLS_PILL_STYLES[variant];
}
