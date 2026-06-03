"use client";

import { useEffect, useRef } from "react";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import {
  clearHeroCursor,
  setHeroCursorFromClient,
} from "@/lib/bubble2/hero-cursor";
import { syncBubbleMotion, tickBubbleMotion } from "@/lib/bubble2/motion-engine";
import { getHeroBubbleBounds, getHeroViewportScale } from "@/lib/hero-bubble-bounds";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

/** Runs bubble2 zero-G drift simulation (shared by ray trace + R3F). */
export default function BubbleMotionRunner() {
  const { settings } = useBubbleSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const mobile = useIsMobile();
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;
  const reducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  useEffect(() => {
    syncBubbleMotion(settingsRef.current, mobileRef.current);

    const updateCursor = (clientX: number, clientY: number) => {
      const runtime = mapBubble2Runtime(
        settingsRef.current,
        mobileRef.current,
      );
      const { boundsX, boundsY } = getHeroBubbleBounds(runtime.bounds, {
        mobile: mobileRef.current,
        viewportScale: getHeroViewportScale(),
      });
      setHeroCursorFromClient(clientX, clientY, boundsX, boundsY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (reducedRef.current || !settingsRef.current.animationEnabled) return;
      updateCursor(e.clientX, e.clientY);
    };

    const onPointerLeave = () => clearHeroCursor();

    let animId = 0;
    let lastFrame = 0;
    let firstFrame = true;

    const onResize = () => {
      syncBubbleMotion(settingsRef.current, mobileRef.current);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener(
      "pointerleave",
      onPointerLeave,
      { passive: true },
    );

    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);
      if (firstFrame) {
        lastFrame = now;
        firstFrame = false;
        return;
      }
      const dt = Math.min((now - lastFrame) * 0.001, 0.033);
      lastFrame = now;
      tickBubbleMotion(
        dt,
        settingsRef.current,
        mobileRef.current,
        reducedRef.current,
      );
    };

    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      clearHeroCursor();
    };
  }, []);

  return null;
}
