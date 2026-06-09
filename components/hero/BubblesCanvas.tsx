"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import BubbleMotionRunner from "./BubbleMotionRunner";
import {
  useMarkHeroReady,
  useSetHeroLoadProgress,
} from "@/lib/hero-ready-context";
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

const BUBBLES_LOAD_TIMEOUT_MS = 18_000;

export default function BubblesCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { settings } = useBubbleSettings();
  const markHeroReady = useMarkHeroReady();
  const setHeroLoadProgress = useSetHeroLoadProgress();
  const [rayTraceFailed, setRayTraceFailed] = useState(false);
  const readyRef = useRef(false);
  const { visible: heroVisible } = useHeroVisible(rootRef);

  const useRayTrace =
    settings.bubbleRenderer === "bubble2" && !rayTraceFailed;

  const handleProgress = useCallback(
    (percent: number) => {
      setHeroLoadProgress?.(percent);
    },
    [setHeroLoadProgress],
  );

  const handleBubblesReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setHeroLoadProgress?.(100);
    markHeroReady?.();
  }, [markHeroReady, setHeroLoadProgress]);

  useEffect(() => {
    setHeroLoadProgress?.(8);
  }, [setHeroLoadProgress]);

  useEffect(() => {
    readyRef.current = false;
    setHeroLoadProgress?.(12);
  }, [useRayTrace, setHeroLoadProgress]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = true;
        setHeroLoadProgress?.(100);
        markHeroReady?.();
      }
    }, BUBBLES_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [useRayTrace, markHeroReady, setHeroLoadProgress]);

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
          onReady={handleBubblesReady}
          onProgress={handleProgress}
        />
      ) : (
        <BubblesScene
          active={heroVisible}
          onReady={handleBubblesReady}
          onProgress={handleProgress}
        />
      )}
    </div>
  );
}
