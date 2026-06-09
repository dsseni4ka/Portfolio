"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const PREVIEW_WIDTH = 168;
const PREVIEW_HEIGHT = 224;
const CURSOR_GAP = 10;
const VIEWPORT_PADDING = 12;

function readCursorSizePx() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--custom-cursor-size")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
}

type AboutDianaHoverProps = {
  children: ReactNode;
  imageSrc: string;
  side?: "left" | "right";
  vertical?: "center" | "bottom";
};

export default function AboutDianaHover({
  children,
  imageSrc,
  side = "right",
  vertical = "center",
}: AboutDianaHoverProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const cursorHalf = readCursorSizePx() / 2;

      let x =
        side === "left"
          ? clientX - cursorHalf - CURSOR_GAP - PREVIEW_WIDTH
          : clientX + cursorHalf + CURSOR_GAP;

      let y =
        vertical === "bottom"
          ? clientY + cursorHalf + CURSOR_GAP
          : clientY - PREVIEW_HEIGHT / 2;

      if (side === "left" && x < VIEWPORT_PADDING) {
        x = clientX + cursorHalf + CURSOR_GAP;
      } else if (
        side === "right" &&
        x + PREVIEW_WIDTH > viewportWidth - VIEWPORT_PADDING
      ) {
        x = clientX - cursorHalf - CURSOR_GAP - PREVIEW_WIDTH;
      }

      if (
        vertical === "bottom" &&
        y + PREVIEW_HEIGHT > viewportHeight - VIEWPORT_PADDING
      ) {
        y = clientY - cursorHalf - CURSOR_GAP - PREVIEW_HEIGHT;
      }

      const clampedX = Math.min(
        Math.max(x, VIEWPORT_PADDING),
        viewportWidth - PREVIEW_WIDTH - VIEWPORT_PADDING,
      );

      const clampedY = Math.min(
        Math.max(y, VIEWPORT_PADDING),
        viewportHeight - PREVIEW_HEIGHT - VIEWPORT_PADDING,
      );

      setPosition({ x: clampedX, y: clampedY });
    },
    [side, vertical],
  );

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      setActive(true);
      updatePosition(event.clientX, event.clientY);
    },
    [reducedMotion, updatePosition],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (!active || reducedMotion) return;
      updatePosition(event.clientX, event.clientY);
    },
    [active, reducedMotion, updatePosition],
  );

  const handlePointerLeave = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <>
      <span
        data-about-word-hover
        className="relative inline-block cursor-none text-accent"
        style={{
          padding: "0.2em 0.45em",
          margin: "-0.2em -0.35em",
        }}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {"{"}
        <span className="underline decoration-2 underline-offset-[0.18em]">
          {children}
        </span>
        {"}"}
      </span>
      <span
        aria-hidden
        className="pointer-events-none fixed z-[80] overflow-hidden rounded-[0.65rem] shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
        style={{
          left: position.x,
          top: position.y,
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          visibility: active && !reducedMotion ? "visible" : "hidden",
          transform: "translate3d(0,0,0)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          draggable={false}
        />
      </span>
    </>
  );
}
