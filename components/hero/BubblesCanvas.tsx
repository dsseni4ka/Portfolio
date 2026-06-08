"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import BubbleMotionRunner from "./BubbleMotionRunner";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { useHeroVisible } from "@/lib/use-hero-visible";

const Bubble2Scene = dynamic(() => import("./Bubble2Scene"), {
  ssr: false,
  loading: () => null,
});

const BubblesScene = dynamic(() => import("./BubblesScene"), {
  ssr: false,
  loading: () => null,
});

export default function BubblesCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { settings } = useBubbleSettings();
  const [rayTraceFailed, setRayTraceFailed] = useState(false);
  const { visible: heroVisible } = useHeroVisible(rootRef);

  const useRayTrace =
    settings.bubbleRenderer === "bubble2" && !rayTraceFailed;

  return (
    <div
      ref={rootRef}
      data-hero-motion
      className="absolute inset-0 z-[1] h-full w-full bg-background"
      aria-hidden
    >
      <BubbleMotionRunner active={heroVisible} />
      {useRayTrace ? (
        <Bubble2Scene
          active={heroVisible}
          onError={() => setRayTraceFailed(true)}
        />
      ) : (
        <BubblesScene active={heroVisible} />
      )}
    </div>
  );
}
