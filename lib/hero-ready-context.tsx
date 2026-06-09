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
  markHeroReady: () => void;
};

const HeroReadyContext = createContext<HeroReadyContextValue | null>(null);

export function HeroReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const firedRef = useRef(false);

  const markHeroReady = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    setReady(true);
  }, []);

  return (
    <HeroReadyContext.Provider value={{ ready, markHeroReady }}>
      {children}
    </HeroReadyContext.Provider>
  );
}

export function useHeroEntranceReady() {
  return useContext(HeroReadyContext)?.ready ?? false;
}

export function useMarkHeroReady() {
  return useContext(HeroReadyContext)?.markHeroReady;
}
