"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type HeroCaptureContextValue = {
  captureEl: HTMLDivElement | null;
  setCaptureEl: (el: HTMLDivElement | null) => void;
};

const HeroCaptureContext = createContext<HeroCaptureContextValue | null>(null);

export function HeroCaptureProvider({ children }: { children: ReactNode }) {
  const [captureEl, setCaptureEl] = useState<HTMLDivElement | null>(null);

  const stableSet = useCallback((el: HTMLDivElement | null) => {
    setCaptureEl(el);
  }, []);

  return (
    <HeroCaptureContext.Provider
      value={{ captureEl, setCaptureEl: stableSet }}
    >
      {children}
    </HeroCaptureContext.Provider>
  );
}

export function useHeroCaptureElement() {
  const ctx = useContext(HeroCaptureContext);
  if (!ctx) {
    throw new Error(
      "useHeroCaptureElement must be used within HeroCaptureProvider",
    );
  }
  return ctx;
}
