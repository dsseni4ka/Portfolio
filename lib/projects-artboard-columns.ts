import gsap from "gsap";
import {
  AFFILIATE_ARTBOARD_AUTO_DOWN_DURATION,
  AFFILIATE_ARTBOARD_CYCLE_HEIGHT,
} from "@/lib/projects-affiliate-panel";

const AFFILIATE_ARTBOARDS_DESIGN_HEIGHT = 982;

function getProjectsScale(node: Element) {
  const panel = node.closest<HTMLElement>("[data-affiliate-artboards-panel]");
  if (panel) {
    const height = panel.getBoundingClientRect().height;
    if (height > 0) return height / AFFILIATE_ARTBOARDS_DESIGN_HEIGHT;
  }

  return window.innerHeight / AFFILIATE_ARTBOARDS_DESIGN_HEIGHT;
}

function scaledPx(node: Element, designPx: number) {
  return designPx * getProjectsScale(node);
}

function createSeamlessLoopTween(
  track: HTMLElement,
  panel: HTMLElement,
  direction: "up" | "down",
) {
  const cycleHeight = scaledPx(panel, AFFILIATE_ARTBOARD_CYCLE_HEIGHT);

  if (direction === "down") {
    gsap.set(track, { y: -cycleHeight });

    return gsap.to(track, {
      y: 0,
      duration: AFFILIATE_ARTBOARD_AUTO_DOWN_DURATION,
      ease: "none",
      repeat: -1,
    });
  }

  gsap.set(track, { y: 0 });

  return gsap.to(track, {
    y: -cycleHeight,
    duration: AFFILIATE_ARTBOARD_AUTO_DOWN_DURATION,
    ease: "none",
    repeat: -1,
  });
}

export function applyAffiliateArtboardColumns(root: ParentNode) {
  const panel = root.querySelector<HTMLElement>("[data-affiliate-artboards-panel]");
  if (!panel) return () => {};

  const columns = gsap.utils.toArray<HTMLElement>(
    panel.querySelectorAll("[data-artboard-column]"),
  );
  const tweens: gsap.core.Tween[] = [];

  for (const column of columns) {
    const direction = column.dataset.artboardColumnDirection;
    const track = column.querySelector<HTMLElement>("[data-artboard-column-track]");
    if (!track || !direction) continue;

    if (direction === "auto-up") {
      tweens.push(createSeamlessLoopTween(track, panel, "up"));
      continue;
    }

    if (direction === "auto-down") {
      tweens.push(createSeamlessLoopTween(track, panel, "down"));
    }
  }

  return () => {
    for (const tween of tweens) {
      tween.kill();
    }
  };
}
