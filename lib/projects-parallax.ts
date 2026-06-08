import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const PROJECTS_PARALLAX_TEXT_X = () => window.innerWidth * 0.08;
export const PROJECTS_PARALLAX_MEDIA_X = () => window.innerWidth * 0.03;

type ContainerAnimation = gsap.core.Tween | gsap.core.Timeline;

function collectMediaParallaxTargets(root: ParentNode): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-projects-parallax="media"]'),
  );
}

function createParallaxTween(
  target: HTMLElement,
  trigger: HTMLElement,
  containerAnimation: ContainerAnimation,
  getX: () => number,
) {
  return gsap.to(target, {
    x: getX,
    ease: "none",
    scrollTrigger: {
      containerAnimation,
      trigger,
      start: "left right",
      end: "right left",
      scrub: true,
    },
  });
}

export function applyProjectsParallax(
  root: ParentNode,
  containerAnimation: ContainerAnimation,
) {
  const textElements = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll('[data-projects-parallax="text"]'),
  );
  const mediaTargets = collectMediaParallaxTargets(root);

  const tweens: gsap.core.Tween[] = [];

  for (const element of textElements) {
    tweens.push(
      createParallaxTween(
        element,
        element,
        containerAnimation,
        () => -PROJECTS_PARALLAX_TEXT_X(),
      ),
    );
  }

  for (const element of mediaTargets) {
    tweens.push(
      createParallaxTween(
        element,
        element,
        containerAnimation,
        () => -PROJECTS_PARALLAX_MEDIA_X(),
      ),
    );
  }

  return () => {
    for (const tween of tweens) {
      tween.scrollTrigger?.kill();
      tween.kill();
    }
  };
}
