"use client";

import { useEffect, useRef } from "react";
import {
  clearHeroCursor,
  setHeroCursorFromClient,
} from "@/lib/bubble2/hero-cursor";
import { syncBubbleMotion, tickBubbleMotion } from "@/lib/bubble2/motion-engine";
import {
  getHeroBubbleBounds,
  getHeroMotionLayerAspect,
  getHeroViewportScale,
} from "@/lib/hero-bubble-bounds";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";

function getHeroMotionRect() {
  const layer =
    document.querySelector("[data-hero-motion]") ??
    document.getElementById("hero");
  const rect = layer?.getBoundingClientRect();
  if (!rect || rect.width < 2 || rect.height < 2) return null;
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function isPointerInHero(clientX: number, clientY: number) {
  const rect = getHeroMotionRect();
  if (!rect) return false;
  return (
    clientX >= rect.left &&
    clientX <= rect.left + rect.width &&
    clientY >= rect.top &&
    clientY <= rect.top + rect.height
  );
}

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

    let animId = 0;
    let lastFrame = 0;
    let firstFrame = true;

    const onResize = () => {
      syncBubbleMotion(settingsRef.current, mobileRef.current);
    };

    window.addEventListener("resize", onResize, { passive: true });

    const updateCursor = (clientX: number, clientY: number) => {
      const runtime = mapBubble2Runtime(
        settingsRef.current,
        mobileRef.current,
      );
      const bounds = getHeroBubbleBounds(runtime.bounds, {
        mobile: mobileRef.current,
        viewportScale: getHeroViewportScale(),
        layerAspect: getHeroMotionLayerAspect(),
      });
      const rect = getHeroMotionRect();
      setHeroCursorFromClient(
        clientX,
        clientY,
        bounds.boundsX,
        bounds.boundsY,
        rect,
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerInHero(e.clientX, e.clientY)) {
        clearHeroCursor();
        return;
      }
      updateCursor(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

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
      clearHeroCursor();
    };
  }, []);

  return null;
}
