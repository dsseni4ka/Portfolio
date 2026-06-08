/** Start skills interactions once most of the section is on screen. */
export const SKILLS_SECTION_VISIBLE_RATIO = 0.55;

export function isSkillsSectionInView(entry: IntersectionObserverEntry) {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= SKILLS_SECTION_VISIBLE_RATIO) return true;

  const vh = window.innerHeight || 1;
  const rect = entry.boundingClientRect;
  const visibleHeight =
    Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visibleHeight >= vh * SKILLS_SECTION_VISIBLE_RATIO;
}
