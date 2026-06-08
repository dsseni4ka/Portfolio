"use client";

import { useEffect, useRef } from "react";
import {
  clearHeroCursor,
  setHeroCursorFromClient,
} from "@/lib/bubble2/hero-cursor";
import {
  resetBubbleMotion,
  syncBubbleMotion,
  tickBubbleMotion,
} from "@/lib/bubble2/motion-engine";
import {
  getHeroBubbleBounds,
  getHeroViewportScale,
} from "@/lib/hero-bubble-bounds";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

type BubbleMotionRunnerProps = {
  active?: boolean;
};

/** Runs bubble2 zero-G drift simulation (shared by ray trace + R3F). */
export default function BubbleMotionRunner({ active = true }: BubbleMotionRunnerProps) {
  const { settings } = useBubbleSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const mobile = useIsMobile();
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;
  const reducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    resetBubbleMotion();
    syncBubbleMotion(settingsRef.current, mobileRef.current);

    let animId = 0;
    let lastFrame = 0;
    let firstFrame = true;

    const onResize = () => {
      syncBubbleMotion(settingsRef.current, mobileRef.current);
    };

    window.addEventListener("resize", onResize, { passive: true });

    const motionLayer = document.querySelector("[data-hero-motion]");
    let layerObserver: ResizeObserver | undefined;
    if (motionLayer) {
      layerObserver = new ResizeObserver(() => {
        onResize();
      });
      layerObserver.observe(motionLayer);
    }

    const updateCursor = (clientX: number, clientY: number) => {
      const runtime = mapBubble2Runtime(
        settingsRef.current,
        mobileRef.current,
      );
      const bounds = getHeroBubbleBounds(runtime.bounds, {
        mobile: mobileRef.current,
        viewportScale: getHeroViewportScale(),
      });
      const layer = document.querySelector("[data-hero-motion]");
      const rect = layer?.getBoundingClientRect();
      setHeroCursorFromClient(
        clientX,
        clientY,
        bounds.boundsX,
        bounds.boundsY,
        rect
          ? {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            }
          : null,
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      updateCursor(e.clientX, e.clientY);
    };
    const onPointerLeave = () => clearHeroCursor();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    const frame = (now: number) => {
      animId = requestAnimationFrame(frame);
      if (!activeRef.current) return;
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
      layerObserver?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      clearHeroCursor();
    };
  }, []);

  return null;
}
