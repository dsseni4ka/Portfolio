"use client";

import { useEffect, useState } from "react";
import { SITE_BACKGROUND } from "@/lib/site-colors";

type HeroLoadingScreenProps = {
  ready: boolean;
};

export default function HeroLoadingScreen({ ready }: HeroLoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setFadeOut(true);
    const timer = window.setTimeout(() => setVisible(false), 640);
    return () => window.clearTimeout(timer);
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      className={`hero-loading-screen ${fadeOut ? "hero-loading-screen--out" : ""}`}
      style={{ backgroundColor: SITE_BACKGROUND }}
      aria-hidden={ready}
      aria-busy={!ready}
    >
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
    </div>
  );
}
