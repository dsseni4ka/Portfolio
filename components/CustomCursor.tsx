"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

function readCursorSizePx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--custom-cursor-size")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    let visible = false;

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      dot.style.opacity = next ? "1" : "0";
    };

    const onMove = (event: PointerEvent) => {
      const half = readCursorSizePx() / 2;
      dot.style.transform = `translate3d(${event.clientX - half}px, ${event.clientY - half}px, 0)`;
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="custom-cursor-dot"
      style={{ opacity: 0 }}
    />
  );
}
