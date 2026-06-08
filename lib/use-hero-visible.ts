"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** True while the hero section intersects the viewport (WebGL may run). */
export function useHeroVisible(
  rootRef: RefObject<HTMLElement | null>,
  threshold = 0.08,
) {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const target = root.closest("section") ?? root;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? false;
        visibleRef.current = next;
        setVisible(next);
      },
      { threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootRef, threshold]);

  return { visible, visibleRef };
}
