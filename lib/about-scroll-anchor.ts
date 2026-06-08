const DEFAULT_TEXT_CENTER_THRESHOLD = 56;
const DEFAULT_STAGE_TOP_THRESHOLD = 14;

/** Scroll Y that aligns a section with scroll-margin / snap padding. */
export function getSectionScrollAnchor(section: HTMLElement) {
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop);
  const scrollMargin = Number.isFinite(margin) ? margin : 0;
  return Math.max(0, section.offsetTop - scrollMargin);
}

export function getAboutStage(section: HTMLElement) {
  return section.querySelector<HTMLElement>("[data-about-stage]");
}

export function getAboutText(section: HTMLElement) {
  return section.querySelector<HTMLElement>("[data-about-text]");
}

/** About copy vertically centered in the viewport. */
export function isAboutTextCentered(
  textEl: HTMLElement,
  threshold = DEFAULT_TEXT_CENTER_THRESHOLD,
) {
  const vh = window.innerHeight || 1;
  const rect = textEl.getBoundingClientRect();
  const textCenter = rect.top + rect.height / 2;
  return Math.abs(textCenter - vh / 2) <= threshold;
}

/** Sticky stage fills the screen (about “covers” the frame). */
export function isAboutStageCoveringViewport(
  stageEl: HTMLElement,
  topThreshold = DEFAULT_STAGE_TOP_THRESHOLD,
) {
  const vh = window.innerHeight || 1;
  const rect = stageEl.getBoundingClientRect();
  return (
    rect.height >= vh * 0.9 &&
    Math.abs(rect.top) <= topThreshold
  );
}

/** Ready for bubble wheel hijack — text centered and stage covers viewport. */
export function isAboutBubbleReady(section: HTMLElement) {
  const stage = getAboutStage(section);
  const text = getAboutText(section);
  if (!stage || !text) return false;
  return (
    isAboutStageCoveringViewport(stage) && isAboutTextCentered(text)
  );
}

export function isAboutInView(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  return rect.bottom > vh * 0.08 && rect.top < vh * 0.92;
}

/** Scroll position that keeps about text vertically centered. */
export function getAboutBubbleLockScrollY(section: HTMLElement) {
  const text = getAboutText(section);
  if (text) {
    const vh = window.innerHeight || 1;
    const rect = text.getBoundingClientRect();
    const textCenterDoc = window.scrollY + rect.top + rect.height / 2;
    return Math.max(0, Math.round(textCenterDoc - vh / 2));
  }
  return getSectionScrollAnchor(section);
}

export function scrollWindowToY(y: number, behavior: ScrollBehavior = "auto") {
  const top = Math.max(0, Math.round(y));
  if (Math.abs(window.scrollY - top) <= 1) return;
  window.scrollTo({ top, behavior });
}

export function scrollToSectionById(
  id: string,
  behavior: ScrollBehavior = "smooth",
) {
  const el = document.getElementById(id);
  if (!el) return false;
  scrollWindowToY(getSectionScrollAnchor(el), behavior);
  return true;
}
