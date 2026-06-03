"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BubbleSettingsProvider } from "@/lib/bubble-settings-store";
import { getHeroContentScale } from "@/lib/hero-bubble-bounds";
import { FIGMA_FRAME } from "@/lib/figma-hero";

const BubblesCanvas = dynamic(() => import("./BubblesCanvas"), {
  ssr: false,
  loading: () => null,
});

type HeroFigmaStageProps = {
  children: ReactNode;
};

/** Full-viewport bubbles; Figma typography scaled and centered on top. */
export default function HeroFigmaStage({ children }: HeroFigmaStageProps) {
  const [contentScale, setContentScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  const updateScale = useCallback(() => {
    setContentScale(getHeroContentScale());
  }, []);

  useEffect(() => {
    setMounted(true);
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <BubbleSettingsProvider>
      <div className="relative h-full w-full overflow-hidden">
        {mounted ? <BubblesCanvas /> : null}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="relative shrink-0"
            suppressHydrationWarning
            style={{
              width: FIGMA_FRAME.width,
              height: FIGMA_FRAME.height,
              transform: mounted ? `scale(${contentScale})` : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </BubbleSettingsProvider>
  );
}
