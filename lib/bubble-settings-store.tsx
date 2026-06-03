"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  BUBBLE_SETTINGS_STORAGE_KEY,
  DEFAULT_BUBBLE_SETTINGS,
  mergeBubbleSettings,
  readBubbleSettingsFromStorage,
  type BubbleSettings,
} from "@/lib/bubble-settings";

export type BubbleSettingsContextValue = {
  settings: BubbleSettings;
  setSetting: <K extends keyof BubbleSettings>(
    key: K,
    value: BubbleSettings[K],
  ) => void;
  resetSettings: () => void;
};

export const BubbleSettingsContext =
  createContext<BubbleSettingsContextValue | null>(null);

const noop = () => {};

let bubbleSettingsSnapshot: BubbleSettingsContextValue = {
  settings: DEFAULT_BUBBLE_SETTINGS,
  setSetting: noop,
  resetSettings: noop,
};

const bubbleSettingsListeners = new Set<() => void>();

function subscribeBubbleSettings(listener: () => void) {
  bubbleSettingsListeners.add(listener);
  return () => bubbleSettingsListeners.delete(listener);
}

function getBubbleSettingsSnapshot() {
  return bubbleSettingsSnapshot;
}

function publishBubbleSettings(value: BubbleSettingsContextValue) {
  bubbleSettingsSnapshot = value;
  bubbleSettingsListeners.forEach((listener) => listener());
}

/** Readable inside R3F Canvas (separate React root) and in the DOM tree. */
export function useBubbleSettings(): BubbleSettingsContextValue {
  const context = useContext(BubbleSettingsContext);
  const synced = useSyncExternalStore(
    subscribeBubbleSettings,
    getBubbleSettingsSnapshot,
    getBubbleSettingsSnapshot,
  );
  const value = context ?? synced;
  if (value?.setSetting && value.setSetting !== noop) {
    return value;
  }
  return {
    settings: DEFAULT_BUBBLE_SETTINGS,
    setSetting: noop,
    resetSettings: noop,
  };
}

export function BubbleSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_BUBBLE_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readBubbleSettingsFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(BUBBLE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const setSetting = useCallback(
    <K extends keyof BubbleSettings>(key: K, value: BubbleSettings[K]) => {
      setSettings((prev) => mergeBubbleSettings({ ...prev, [key]: value }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_BUBBLE_SETTINGS);
    localStorage.removeItem(BUBBLE_SETTINGS_STORAGE_KEY);
  }, []);

  const storeValue = useMemo(
    () => ({ settings, setSetting, resetSettings }),
    [settings, setSetting, resetSettings],
  );

  publishBubbleSettings(storeValue);

  return (
    <BubbleSettingsContext.Provider value={storeValue}>
      {children}
    </BubbleSettingsContext.Provider>
  );
}
