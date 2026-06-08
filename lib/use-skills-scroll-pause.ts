"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  getSkillsSectionLockScrollY,
  scrollWindowToY,
} from "@/lib/about-scroll-anchor";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  isSkillsSectionInView,
  SKILLS_SECTION_VISIBLE_RATIO,
} from "@/lib/skills-section-visibility";

const SKILLS_SCROLL_PAUSE_MS = 2000;

export function useSkillsScrollPause(sectionRef: RefObject<HTMLElement | null>) {
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const lockedRef = useRef(false);
  const pauseStartedRef = useRef(false);
  const lockYRef = useRef(0);
  const pauseTimerRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const releaseScroll = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      setIsScrollLocked(false);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    const startPause = () => {
      if (pauseStartedRef.current || lockedRef.current) return;
      pauseStartedRef.current = true;

      lockYRef.current = getSkillsSectionLockScrollY(section);
      lockedRef.current = true;
      setIsScrollLocked(true);

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      scrollWindowToY(lockYRef.current);

      pauseTimerRef.current = window.setTimeout(() => {
        releaseScroll();
        pauseTimerRef.current = 0;
      }, SKILLS_SCROLL_PAUSE_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || pauseStartedRef.current) return;
        if (!isSkillsSectionInView(entry)) return;
        startPause();
        observer.disconnect();
      },
      { threshold: [0, 0.25, 0.5, SKILLS_SECTION_VISIBLE_RATIO, 1, 1] },
    );

    const onWheel = (event: WheelEvent) => {
      if (!lockedRef.current) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!lockedRef.current) return;
      event.preventDefault();
    };

    const onScroll = () => {
      if (!lockedRef.current) return;
      if (Math.abs(window.scrollY - lockYRef.current) > 2) {
        scrollWindowToY(lockYRef.current);
      }
    };

    observer.observe(section);

    const wheelOptions: AddEventListenerOptions = {
      passive: false,
      capture: true,
    };

    window.addEventListener("wheel", onWheel, wheelOptions);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = 0;
      releaseScroll();
      window.removeEventListener("wheel", onWheel, wheelOptions);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionRef, reducedMotion]);

  return { isScrollLocked };
}
