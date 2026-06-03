"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BubbleSettingsProvider } from "@/lib/bubble-settings-store";
import { FIGMA_FRAME } from "@/lib/figma-hero";

const BubblesCanvas = dynamic(() => import("./BubblesCanvas"), {
  ssr: false,
  loading: () => null,
});

type HeroFigmaStageProps = {
  children: ReactNode;
};

/** Scales the 1512×982 Figma artboard to fit the viewport. */
export default function HeroFigmaStage({ children }: HeroFigmaStageProps) {
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  const updateScale = useCallback(() => {
    const s = Math.min(
      window.innerWidth / FIGMA_FRAME.width,
      window.innerHeight / FIGMA_FRAME.height,
    );
    setScale(s);
  }, []);

  useEffect(() => {
    setMounted(true);
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <BubbleSettingsProvider>
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="relative shrink-0"
          suppressHydrationWarning
          style={{
            width: FIGMA_FRAME.width,
            height: FIGMA_FRAME.height,
            transform: mounted ? `scale(${scale})` : undefined,
          }}
        >
          {mounted ? <BubblesCanvas /> : null}
          <div className="relative z-10 pointer-events-none bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </BubbleSettingsProvider>
  );
}
