"use client";

import { useLayoutEffect } from "react";

function isPageReload() {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload";
}

/** On full page reload, return to the hero (top) and ignore restored scroll / hash. */
export function resetScrollOnReload() {
  if (!isPageReload()) return;

  window.scrollTo(0, 0);

  if (window.location.hash) {
    const url = window.location.pathname + window.location.search;
    history.replaceState(null, "", url);
  }
}

export default function ResetScrollOnLoad() {
  useLayoutEffect(() => {
    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }

    resetScrollOnReload();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resetScrollOnReload();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
