"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ABOUT_POP_SETTINGS_STORAGE_KEY,
  DEFAULT_ABOUT_POP_SETTINGS,
  mergeAboutPopSettings,
  readAboutPopSettingsFromStorage,
  type AboutPopSettings,
} from "@/lib/about-pop-settings";

type AboutPopSettingsContextValue = {
  settings: AboutPopSettings;
  setSetting: <K extends keyof AboutPopSettings>(
    key: K,
    value: AboutPopSettings[K],
  ) => void;
  resetSettings: () => void;
};

const AboutPopSettingsContext = createContext<AboutPopSettingsContextValue | null>(
  null,
);

export function useAboutPopSettings(): AboutPopSettingsContextValue {
  const ctx = useContext(AboutPopSettingsContext);
  if (!ctx) {
    throw new Error("useAboutPopSettings requires AboutPopSettingsProvider");
  }
  return ctx;
}

export function AboutPopSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_ABOUT_POP_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readAboutPopSettingsFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ABOUT_POP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const setSetting = useCallback(
    <K extends keyof AboutPopSettings>(key: K, value: AboutPopSettings[K]) => {
      setSettings((prev) => mergeAboutPopSettings({ ...prev, [key]: value }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ABOUT_POP_SETTINGS);
    localStorage.removeItem(ABOUT_POP_SETTINGS_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ settings, setSetting, resetSettings }),
    [settings, setSetting, resetSettings],
  );

  return (
    <AboutPopSettingsContext.Provider value={value}>
      {children}
    </AboutPopSettingsContext.Provider>
  );
}
