"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SITE_BACKGROUND } from "@/lib/site-colors";
import { useSkillsParallax } from "@/lib/use-skills-parallax";
import { useSkillsScrollPause } from "@/lib/use-skills-scroll-pause";
import SkillsPillsPhysics from "./SkillsPillsPhysics";

type SkillsSectionProps = {
  id?: string;
};

export default function SkillsSection({ id = "skills" }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const repaintRef = useRef<(() => void) | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { isScrollLocked } = useSkillsScrollPause(sectionRef);

  const handleParallaxProgress = useCallback(() => {
    repaintRef.current?.();
  }, []);

  const { progressRef } = useSkillsParallax({
    sectionRef,
    titleRef,
    mediaRef,
    reducedMotion,
    onProgressChange: handleParallaxProgress,
  });

  const handlePillsReady = useCallback((repaint: () => void) => {
    repaintRef.current = repaint;
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative flex h-screen w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)] text-foreground ${
        isScrollLocked ? "overscroll-none" : ""
      }`}
      style={{ backgroundColor: SITE_BACKGROUND }}
    >
      <div ref={mediaRef} className="absolute inset-0 z-[1] will-change-transform">
        <SkillsPillsPhysics
          className="h-full w-full"
          parallaxProgressRef={reducedMotion ? undefined : progressRef}
          onReady={handlePillsReady}
        />
      </div>
      <h2
        ref={titleRef}
        data-skills-parallax="title"
        className="pointer-events-none relative z-10 m-auto font-sans text-center text-[40px] font-bold uppercase leading-[0.95] tracking-[-0.02em] will-change-transform"
      >
        Skills &amp; tools
      </h2>
    </section>
  );
}
