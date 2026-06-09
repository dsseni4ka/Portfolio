"use client";

import { type ReactNode } from "react";
import HeroLoadingScreen from "./HeroLoadingScreen";
import {
  HeroReadyProvider,
  useHeroEntranceReady,
} from "@/lib/hero-ready-context";

type HeroEntranceShellProps = {
  children: ReactNode;
};

function HeroLoadingGate({ children }: { children: ReactNode }) {
  const ready = useHeroEntranceReady();
  return (
    <>
      {children}
      <HeroLoadingScreen ready={ready} />
    </>
  );
}

/** Full-screen loader until bubbles are ready; children reveal individually. */
export default function HeroEntranceShell({ children }: HeroEntranceShellProps) {
  return (
    <HeroReadyProvider>
      <HeroLoadingGate>{children}</HeroLoadingGate>
    </HeroReadyProvider>
  );
}
