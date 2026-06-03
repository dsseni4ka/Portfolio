"use client";

import dynamic from "next/dynamic";

const BubblesScene = dynamic(() => import("./BubblesScene"), {
  ssr: false,
  loading: () => null,
});

export default function BubblesCanvas() {
  return (
    <div
      className="pointer-events-auto absolute inset-0 z-20"
      aria-label="Interactive iridescent glass bubbles"
      role="img"
    >
      <BubblesScene />
    </div>
  );
}
