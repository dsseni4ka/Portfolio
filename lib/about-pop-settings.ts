function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type AboutPopSettings = {
  popEnabled: boolean;
  /** Global time scale for physics and evaporation. */
  popSpeed: number;
  /** Fixed count; 0 = auto from bubble radius × particlesPerRadius. */
  dropletCount: number;
  dropletMinSize: number;
  dropletMaxSize: number;
  /** Outward snap force (reference ~0.05–0.2). */
  explosiveForce: number;
  /** Particles per px of bubble radius when dropletCount is 0. */
  particlesPerRadius: number;
  opacity: number;
  gravity: number;
  /** Air drag per frame at 60fps (reference 0.96). */
  drag: number;
  evaporateMin: number;
  evaporateMax: number;
  ringEnabled: boolean;
  ringOpacity: number;
  shellRingInset: number;
};

export const DEFAULT_ABOUT_POP_SETTINGS: AboutPopSettings = {
  popEnabled: true,
  popSpeed: 1.5,
  dropletCount: 0,
  dropletMinSize: 0.5,
  dropletMaxSize: 2.5,
  explosiveForce: 0.12,
  particlesPerRadius: 1.15,
  opacity: 1,
  gravity: 0.11,
  drag: 0.975,
  evaporateMin: 0.005,
  evaporateMax: 0.015,
  ringEnabled: true,
  ringOpacity: 0.35,
  shellRingInset: 0.92,
};

export const ABOUT_POP_SETTINGS_STORAGE_KEY = "portfolio-about-pop-settings-v4";

type LegacyAboutPopSettings = Partial<AboutPopSettings> & {
  durationMs?: number;
  speedMin?: number;
  speedMax?: number;
  highlightStrength?: number;
  rimStrength?: number;
  spawnSpacingPx?: number;
};

export function mergeAboutPopSettings(
  partial?: LegacyAboutPopSettings | null,
): AboutPopSettings {
  const merged = { ...DEFAULT_ABOUT_POP_SETTINGS };
  if (!partial) return merged;

  (Object.keys(DEFAULT_ABOUT_POP_SETTINGS) as (keyof AboutPopSettings)[]).forEach(
    (key) => {
      const value = partial[key];
      if (value !== undefined && value !== null) {
        Object.assign(merged, { [key]: value });
      }
    },
  );

  if (
    partial.durationMs != null &&
    Number.isFinite(partial.durationMs) &&
    partial.popSpeed == null
  ) {
    merged.popSpeed = clamp(900 / partial.durationMs, 0.5, 3.5);
  }

  return merged;
}

export function readAboutPopSettingsFromStorage(): AboutPopSettings {
  if (typeof window === "undefined") return DEFAULT_ABOUT_POP_SETTINGS;
  try {
    for (const key of [
      ABOUT_POP_SETTINGS_STORAGE_KEY,
      "portfolio-about-pop-settings-v3",
      "portfolio-about-pop-settings-v2",
      "portfolio-about-pop-settings-v1",
    ]) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      return mergeAboutPopSettings(JSON.parse(raw) as LegacyAboutPopSettings);
    }
    return DEFAULT_ABOUT_POP_SETTINGS;
  } catch {
    return DEFAULT_ABOUT_POP_SETTINGS;
  }
}
