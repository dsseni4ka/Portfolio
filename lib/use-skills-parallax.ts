"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type UseSkillsParallaxOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLElement | null>;
  mediaRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  onProgressChange?: () => void;
};

const SKILLS_TITLE_PARALLAX_Y = () => window.innerHeight * 0.14;
const SKILLS_MEDIA_PARALLAX_Y = () => window.innerHeight * 0.05;

export function getSkillsPillParallaxOffset(
  index: number,
  progress: number,
): number {
  const centered = progress - 0.5;
  const depth = 0.32 + (index % 4) * 0.07;
  const stagger = ((index % 6) - 2.5) * 0.012;
  return (centered + stagger) * window.innerHeight * depth * 0.2;
}

export function useSkillsParallax({
  sectionRef,
  titleRef,
  mediaRef,
  reducedMotion,
  onProgressChange,
}: UseSkillsParallaxOptions) {
  const progressRef = useRef(0.5);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const media = mediaRef.current;
      if (!section || reducedMotion) return;

      const tweens: gsap.core.Tween[] = [];

      const handleProgress = (self: ScrollTrigger) => {
        progressRef.current = self.progress;
        onProgressChange?.();
      };

      if (title) {
        tweens.push(
          gsap.fromTo(
            title,
            { y: () => -SKILLS_TITLE_PARALLAX_Y() },
            {
              y: () => SKILLS_TITLE_PARALLAX_Y(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: handleProgress,
              },
            },
          ),
        );
      }

      if (media) {
        tweens.push(
          gsap.fromTo(
            media,
            { y: () => -SKILLS_MEDIA_PARALLAX_Y() },
            {
              y: () => SKILLS_MEDIA_PARALLAX_Y(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          ),
        );
      }

      return () => {
        for (const tween of tweens) {
          tween.scrollTrigger?.kill();
          tween.kill();
        }
      };
    },
    {
      scope: sectionRef,
      dependencies: [reducedMotion, onProgressChange],
      revertOnUpdate: true,
    },
  );

  return { progressRef };
}
