"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  createBubbleBurst,
  getRingDurationMs,
  isPopFinished,
  isPopSafetyTimeout,
  simulateAndDrawBurst,
  type PopParticle,
} from "@/lib/about-bubble-pop-draw";
import { getAboutBubbleScreenCircle } from "@/lib/about-bubble-screen-circle";
import type { AboutPopSettings } from "@/lib/about-pop-settings";
import { useAboutPopSettings } from "@/lib/about-pop-settings-store";

const POP_CANVAS_DPR = 1;

type AboutBubblePopProps = {
  active: boolean;
  metaBlend?: number;
  onComplete: () => void;
};

function PopCanvas({
  metaBlend,
  settings,
  onComplete,
}: {
  metaBlend: number;
  settings: AboutPopSettings;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);
  const onCompleteRef = useRef(onComplete);
  settingsRef.current = settings;

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    } as CanvasRenderingContext2DSettings);
    if (!ctx) return;

    let viewW = 0;
    let viewH = 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === viewW && h === viewH && canvas.width > 0) return;
      viewW = w;
      viewH = h;
      canvas.width = Math.floor(w * POP_CANVAS_DPR);
      canvas.height = Math.floor(h * POP_CANVAS_DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(POP_CANVAS_DPR, 0, 0, POP_CANVAS_DPR, 0, 0);
    };

    let particles: PopParticle[] = [];
    let ringCx = 0;
    let ringCy = 0;
    let spawnR = 0;
    let lastFrame = 0;
    let smoothDt = 16.67;

    const start = () => {
      resize();
      const s = settingsRef.current;
      const circle = getAboutBubbleScreenCircle(viewW, viewH, 1, metaBlend);
      ringCx = circle.centerX;
      ringCy = circle.centerY;
      spawnR = circle.radiusPx * s.shellRingInset;
      particles = createBubbleBurst(ringCx, ringCy, spawnR, s);
      lastFrame = performance.now();
      smoothDt = 16.67;
    };

    const t0 = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const s = settingsRef.current;
      const elapsed = now - t0;
      const rawDt = Math.min(36, Math.max(6, now - lastFrame));
      lastFrame = now;
      smoothDt = smoothDt * 0.4 + rawDt * 0.6;
      const dt = smoothDt;

      ctx.clearRect(0, 0, viewW, viewH);

      const ringDuration = getRingDurationMs(s);
      if (s.ringEnabled && spawnR > 4 && elapsed < ringDuration) {
        const ringT = elapsed / ringDuration;
        const ringAlpha = (1 - ringT) * s.ringOpacity;
        if (ringAlpha > 0.02) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
          ctx.lineWidth = 1.5 + ringT * 2;
          ctx.beginPath();
          ctx.arc(
            ringCx,
            ringCy,
            spawnR * (1 + ringT * 0.2),
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }

      simulateAndDrawBurst(ctx, particles, s, dt, viewW, viewH);

      if (isPopFinished(particles, elapsed, s) || isPopSafetyTimeout(elapsed)) {
        onCompleteRef.current();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    requestAnimationFrame(() => {
      if (disposed) return;
      start();
      raf = requestAnimationFrame(tick);
    });

    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [metaBlend]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 60, width: "100vw", height: "100vh" }}
      aria-hidden
    />
  );
}

export default function AboutBubblePop({
  active,
  metaBlend = 0.76,
  onComplete,
}: AboutBubblePopProps) {
  const [mounted, setMounted] = useState(false);
  const { settings } = useAboutPopSettings();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !active) return null;

  return createPortal(
    <PopCanvas
      metaBlend={metaBlend}
      settings={settings}
      onComplete={() => onCompleteRef.current()}
    />,
    document.body,
  );
}
