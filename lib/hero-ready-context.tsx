"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type HeroReadyContextValue = {
  ready: boolean;
  progress: number;
  setHeroLoadProgress: (value: number) => void;
  markHeroReady: () => void;
};

const HeroReadyContext = createContext<HeroReadyContextValue | null>(null);

export function HeroReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const firedRef = useRef(false);

  const setHeroLoadProgress = useCallback((value: number) => {
    const next = Math.min(100, Math.max(0, value));
    setProgress((prev) => (next > prev ? next : prev));
  }, []);

  const markHeroReady = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    setProgress(100);
    setReady(true);
  }, []);

  return (
    <HeroReadyContext.Provider
      value={{ ready, progress, setHeroLoadProgress, markHeroReady }}
    >
      {children}
    </HeroReadyContext.Provider>
  );
}

export function useHeroEntranceReady() {
  return useContext(HeroReadyContext)?.ready ?? false;
}

export function useHeroLoadProgress() {
  return useContext(HeroReadyContext)?.progress ?? 0;
}

export function useMarkHeroReady() {
  return useContext(HeroReadyContext)?.markHeroReady;
}

export function useSetHeroLoadProgress() {
  return useContext(HeroReadyContext)?.setHeroLoadProgress;
}
