"use client";

import { useEffect, useState } from "react";
import { useHeroLoadProgress } from "@/lib/hero-ready-context";
import { SITE_BACKGROUND } from "@/lib/site-colors";

type HeroLoadingScreenProps = {
  ready: boolean;
};

export default function HeroLoadingScreen({ ready }: HeroLoadingScreenProps) {
  const reportedProgress = useHeroLoadProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setDisplayProgress((prev) => Math.max(prev, reportedProgress));
  }, [reportedProgress]);

  useEffect(() => {
    if (ready) {
      setDisplayProgress(100);
      return;
    }

    const creep = window.setInterval(() => {
      setDisplayProgress((prev) => {
        const floor = Math.max(prev, reportedProgress);
        if (floor >= 94) return floor;
        return Math.min(94, floor + 0.45);
      });
    }, 40);

    return () => window.clearInterval(creep);
  }, [ready, reportedProgress]);

  useEffect(() => {
    if (!ready) return;
    setFadeOut(true);
    const timer = window.setTimeout(() => setVisible(false), 640);
    return () => window.clearTimeout(timer);
  }, [ready]);

  if (!visible) return null;

  const progressRounded = Math.round(displayProgress);

  return (
    <div
      className={`hero-loading-screen ${fadeOut ? "hero-loading-screen--out" : ""}`}
      style={{ backgroundColor: SITE_BACKGROUND }}
      aria-hidden={ready}
      aria-busy={!ready}
    >
      <div className="hero-loading-screen__content">
        <div className="bubbles-loader" role="status" aria-label="Loading">
          <div className="bubbles-loader__orbit bubbles-loader__orbit--1">
            <span className="bubbles-loader__orb bubbles-loader__orb--1" />
          </div>
          <div className="bubbles-loader__orbit bubbles-loader__orbit--2">
            <span className="bubbles-loader__orb bubbles-loader__orb--2" />
          </div>
          <div className="bubbles-loader__orbit bubbles-loader__orbit--3">
            <span className="bubbles-loader__orb bubbles-loader__orb--3" />
          </div>
        </div>

        <div
          className="bubbles-loader-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressRounded}
          aria-label="Loading progress"
        >
          <div
            className="bubbles-loader-progress__fill"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
