"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  getAboutBubbleLockScrollY,
  isAboutBubbleReady,
  isAboutInView,
  scrollWindowToY,
} from "@/lib/about-scroll-anchor";
import { usePrefersReducedMotion } from "@/lib/hooks";

export {
  ABOUT_BUBBLE_META_THRESHOLD,
  mapAboutBubbleCameraDistance,
  mapAboutBubbleRadius,
  mapAboutBubbleViewScale,
  mapAboutBubbleVisibility,
} from "@/lib/about-bubble-map";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeWheelDelta(event: WheelEvent) {
  let delta = event.deltaY;
  if (event.deltaMode === 1) delta *= 16;
  if (event.deltaMode === 2) delta *= window.innerHeight;
  return delta;
}

/** More distance = slower growth; less = faster. */
const WHEEL_DISTANCE_FOR_FULL = 2000;
const WHEEL_SENSITIVITY = 0.96;
/** Time for smoothed value to close half the gap to target (ms). */
const SMOOTH_HALF_LIFE_MS = 96;
const POP_PROGRESS_THRESHOLD = 0.88;
const POST_POP_SNAP_FREE_MS = 3600;

type AboutBubbleScrollOptions = {
  popEnabled?: boolean;
};

export function useAboutBubbleScroll(
  sectionRef: RefObject<HTMLElement | null>,
  options: AboutBubbleScrollOptions = {},
) {
  const [bubbleProgress, setBubbleProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [bubbleHasPopped, setBubbleHasPopped] = useState(false);
  const [aboutSectionCompact, setAboutSectionCompact] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const pinnedRef = useRef(false);
  const lockYRef = useRef(0);
  /** Kept for cleanup only — per-frame scroll lock removed. */
  const lockRafRef = useRef(0);
  const smoothRafRef = useRef(0);
  const stabilizeAnchorRef = useRef<number | null>(null);
  const smoothLastTimeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const wasBubbleReadyRef = useRef(false);
  const popPlayingRef = useRef(false);
  const popCompletedRef = useRef(false);
  const bubbleHasPoppedRef = useRef(false);
  const completePopRef = useRef<() => void>(() => {});
  const popEnabledRef = useRef(options.popEnabled ?? true);
  const postPopSnapTimerRef = useRef(0);
  const aboutSectionCompactRef = useRef(false);

  useEffect(() => {
    popEnabledRef.current = options.popEnabled ?? true;
  }, [options.popEnabled]);

  useEffect(() => {
    progressRef.current = bubbleProgress;
  }, [bubbleProgress]);

  useEffect(() => {
    pinnedRef.current = isPinned;
  }, [isPinned]);

  useEffect(() => {
    aboutSectionCompactRef.current = aboutSectionCompact;
  }, [aboutSectionCompact]);

  useLayoutEffect(() => {
    if (!aboutSectionCompact) return;
    const maxY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    if (window.scrollY > maxY + 1) {
      scrollWindowToY(maxY, "auto");
    }
  }, [aboutSectionCompact]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (isPinned && section) {
      const anchor = getAboutBubbleLockScrollY(section);
      lockYRef.current = anchor;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.scrollBehavior = "auto";
      if (Math.abs(window.scrollY - anchor) > 8) {
        scrollWindowToY(anchor);
      }
      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (!popCompletedRef.current) {
          document.documentElement.style.scrollBehavior = "";
        }
      };
    }

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if (!popCompletedRef.current) {
      document.documentElement.style.scrollBehavior = "";
    }

    const pending = stabilizeAnchorRef.current;
    if (pending != null && section) {
      stabilizeAnchorRef.current = null;
      lockYRef.current = pending;
      scrollWindowToY(pending);
    }
  }, [isPinned, sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const publishProgress = (value: number) => {
      const clamped = clamp(value, 0, 1);
      progressRef.current = clamped;
      setBubbleProgress(clamped);
    };

    const setTargetProgress = (next: number) => {
      targetProgressRef.current = clamp(next, 0, 1);
    };

    const stopSmoothLoop = () => {
      if (smoothRafRef.current) {
        cancelAnimationFrame(smoothRafRef.current);
        smoothRafRef.current = 0;
      }
      smoothLastTimeRef.current = 0;
    };

    const startSmoothLoop = () => {
      if (smoothRafRef.current) return;

      const tick = (now: number) => {
        const last = smoothLastTimeRef.current;
        smoothLastTimeRef.current = now;
        const dt = last > 0 ? Math.min(48, now - last) : 16;
        const alpha =
          1 - Math.pow(0.5, dt / Math.max(1, SMOOTH_HALF_LIFE_MS));

        const target = targetProgressRef.current;
        const current = progressRef.current;
        const next =
          Math.abs(target - current) < 0.0004
            ? target
            : current + (target - current) * alpha;

        publishProgress(next);

        const stillAnimating = Math.abs(target - next) > 0.0004;

        if (stillAnimating) {
          smoothRafRef.current = requestAnimationFrame(tick);
        } else {
          smoothRafRef.current = 0;
          smoothLastTimeRef.current = 0;
        }
      };

      smoothRafRef.current = requestAnimationFrame(tick);
    };

    const stopScrollLockLoop = () => {
      if (!lockRafRef.current) return;
      cancelAnimationFrame(lockRafRef.current);
      lockRafRef.current = 0;
    };

    const startScrollLockLoop = () => {
      stopScrollLockLoop();
    };

    const releasePageScroll = () => {
      stopScrollLockLoop();
      if (pinnedRef.current) {
        pinnedRef.current = false;
        setIsPinned(false);
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollBehavior = "auto";
    };

    const beginPostPopScrollExit = () => {
      const main = document.querySelector("main");
      main?.classList.add("snap-none");

      window.clearTimeout(postPopSnapTimerRef.current);
      postPopSnapTimerRef.current = window.setTimeout(() => {
        main?.classList.remove("snap-none");
        postPopSnapTimerRef.current = 0;
      }, POST_POP_SNAP_FREE_MS);
    };

    const finishAboutSequence = () => {
      popPlayingRef.current = false;
      popCompletedRef.current = true;
      bubbleHasPoppedRef.current = true;
      setBubbleHasPopped(true);
      setIsPopping(false);
      setTargetProgress(0);
      publishProgress(0);
      stopSmoothLoop();
      stabilizeAnchorRef.current = null;
      releasePageScroll();
      beginPostPopScrollExit();

      requestAnimationFrame(() => {
        if (!aboutSectionCompactRef.current) {
          aboutSectionCompactRef.current = true;
          setAboutSectionCompact(true);
        }
      });
    };

    const isBubbleEngaged = () =>
      pinnedRef.current ||
      popPlayingRef.current ||
      targetProgressRef.current > 0.002 ||
      progressRef.current > 0.002;

    const canHijackScroll = () => {
      if (popCompletedRef.current) return false;
      if (isBubbleEngaged()) return isAboutInView(section);
      return isAboutBubbleReady(section);
    };

    const pinSection = () => {
      if (pinnedRef.current) return;
      if (!canHijackScroll()) return;
      lockYRef.current = getAboutBubbleLockScrollY(section);
      pinnedRef.current = true;
      setIsPinned(true);
    };

    const unpinSection = (stabilize = false) => {
      if (!pinnedRef.current) return;
      stopScrollLockLoop();
      const anchor = getAboutBubbleLockScrollY(section);
      lockYRef.current = anchor;
      pinnedRef.current = false;
      if (stabilize) {
        stabilizeAnchorRef.current = anchor;
      }
      setIsPinned(false);
    };

    const nudgeTarget = (delta: number) => {
      const scaled = delta * WHEEL_SENSITIVITY;
      setTargetProgress(
        targetProgressRef.current + scaled / WHEEL_DISTANCE_FOR_FULL,
      );
      startSmoothLoop();
    };

    const canLeaveAboutDown = () => {
      if (popCompletedRef.current) return true;
      if (reducedMotionRef.current) return targetProgressRef.current >= 1;
      if (!popEnabledRef.current) {
        return (
          targetProgressRef.current >= 1 &&
          progressRef.current >= POP_PROGRESS_THRESHOLD
        );
      }
      return false;
    };

    const handleScrollInput = (delta: number, event: Event) => {
      if (!canHijackScroll()) {
        if (popCompletedRef.current || !popPlayingRef.current) {
          releasePageScroll();
        }
        return false;
      }

      if (reducedMotionRef.current) {
        const target = targetProgressRef.current;
        if (delta > 0 && target < 1) {
          event.preventDefault();
          pinSection();
          publishProgress(1);
          setTargetProgress(1);
          return true;
        }
        if (delta > 0 && target >= 1 && !popCompletedRef.current) {
          unpinSection(true);
          finishAboutSequence();
          return false;
        }
        if (delta > 0 && popCompletedRef.current) {
          return false;
        }
        return false;
      }

      const target = targetProgressRef.current;
      const progress = progressRef.current;

      if (popPlayingRef.current) {
        event.preventDefault();
        event.stopImmediatePropagation();
        pinSection();
        return true;
      }

      if (delta > 0) {
        if (popCompletedRef.current) {
          return false;
        }

        if (target < 1) {
          event.preventDefault();
          event.stopImmediatePropagation();
          pinSection();
          nudgeTarget(delta);
          return true;
        }

        pinSection();

        if (progress < POP_PROGRESS_THRESHOLD) {
          event.preventDefault();
          event.stopImmediatePropagation();
          startSmoothLoop();
          return true;
        }

        if (popEnabledRef.current) {
          event.preventDefault();
          event.stopImmediatePropagation();
          popPlayingRef.current = true;
          setIsPopping(true);
          return true;
        }

        if (canLeaveAboutDown()) {
          unpinSection(true);
          return false;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }

      if (delta < 0) {
        if (bubbleHasPoppedRef.current) {
          unpinSection(true);
          return false;
        }
        if (target > 0) {
          event.preventDefault();
          event.stopImmediatePropagation();
          pinSection();
          nudgeTarget(delta);
          return true;
        }
        unpinSection(true);
        return false;
      }

      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (popCompletedRef.current) return;
      if (popPlayingRef.current) {
        handleScrollInput(normalizeWheelDelta(event), event);
        return;
      }
      if (!isAboutInView(section) && !isBubbleEngaged()) {
        releasePageScroll();
        return;
      }
      handleScrollInput(normalizeWheelDelta(event), event);
    };

    let touchLastY = 0;

    const onTouchStart = (event: TouchEvent) => {
      touchLastY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (popCompletedRef.current) return;
      if (!isAboutInView(section) && !isBubbleEngaged()) {
        releasePageScroll();
        return;
      }
      const y = event.touches[0]?.clientY ?? touchLastY;
      const delta = touchLastY - y;
      touchLastY = y;
      handleScrollInput(delta, event);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = section.offsetTop;
      const bubbleReady = isAboutBubbleReady(section);
      const wasReady = wasBubbleReadyRef.current;

      if (popCompletedRef.current) {
        wasBubbleReadyRef.current = bubbleReady;
        lastScrollYRef.current = scrollY;
        return;
      }

      const sequenceActive = isBubbleEngaged();

      if (!isAboutInView(section) && !popPlayingRef.current && !sequenceActive) {
        releasePageScroll();
      }

      if (
        bubbleReady &&
        sequenceActive &&
        !popCompletedRef.current &&
        !pinnedRef.current
      ) {
        pinSection();
      }

      if (
        pinnedRef.current &&
        Math.abs(scrollY - lockYRef.current) > 16
      ) {
        scrollWindowToY(lockYRef.current);
      }

      if (bubbleReady && !wasReady && !pinnedRef.current) {
        const fromBelow = lastScrollYRef.current > scrollY + 4;
        if (!fromBelow && !sequenceActive) {
          setTargetProgress(0);
          publishProgress(0);
          stopSmoothLoop();
          popCompletedRef.current = false;
          bubbleHasPoppedRef.current = false;
          setBubbleHasPopped(false);
          aboutSectionCompactRef.current = false;
          setAboutSectionCompact(false);
          lockYRef.current = getAboutBubbleLockScrollY(section);
        } else if (fromBelow) {
          popPlayingRef.current = false;
          setIsPopping(false);
        }
      }

      if (!bubbleReady && !sequenceActive && scrollY < sectionTop - window.innerHeight * 0.2) {
        setTargetProgress(0);
        publishProgress(0);
        stopSmoothLoop();
        popPlayingRef.current = false;
        popCompletedRef.current = false;
        bubbleHasPoppedRef.current = false;
        setBubbleHasPopped(false);
        aboutSectionCompactRef.current = false;
        setAboutSectionCompact(false);
        setIsPopping(false);
      }

      wasBubbleReadyRef.current = bubbleReady;
      lastScrollYRef.current = scrollY;
    };

    const wheelOptions: AddEventListenerOptions = {
      passive: false,
      capture: true,
    };

    lastScrollYRef.current = window.scrollY;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, wheelOptions);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    completePopRef.current = finishAboutSequence;

    return () => {
      stopSmoothLoop();
      stopScrollLockLoop();
      releasePageScroll();
      window.clearTimeout(postPopSnapTimerRef.current);
      postPopSnapTimerRef.current = 0;
      document.querySelector("main")?.classList.remove("snap-none");
      completePopRef.current = () => {};
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel, wheelOptions);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [sectionRef]);

  return {
    bubbleProgress,
    bubbleHasPopped,
    aboutSectionCompact,
    isPinned,
    isPopping,
    completeBubblePop: () => completePopRef.current(),
  };
}
