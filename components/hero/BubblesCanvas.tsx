"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import BubbleMotionRunner from "./BubbleMotionRunner";
import { useBubbleSettings } from "@/lib/bubble-settings-store";

const Bubble2Scene = dynamic(() => import("./Bubble2Scene"), {
  ssr: false,
  loading: () => null,
});

const BubblesScene = dynamic(() => import("./BubblesScene"), {
  ssr: false,
  loading: () => null,
});

export default function BubblesCanvas() {
  const { settings } = useBubbleSettings();
  const [rayTraceFailed, setRayTraceFailed] = useState(false);

  const useRayTrace =
    settings.bubbleRenderer === "bubble2" && !rayTraceFailed;

  return (
    <div
      data-hero-motion
      className="absolute inset-0 z-[1] min-h-full min-w-full bg-background"
      aria-hidden
    >
      <BubbleMotionRunner />
      {useRayTrace ? (
        <Bubble2Scene onError={() => setRayTraceFailed(true)} />
      ) : (
        <BubblesScene />
      )}
    </div>
  );
}
