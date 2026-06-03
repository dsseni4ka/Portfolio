export type BubbleSettings = {
  animationEnabled: boolean;
  wobbleSpeedMultiplier: number;
  wobbleDistortMultiplier: number;
  wobbleRadius: number;

  bodyColor: string;

  /** Four-stop soap-film spectrum (like reference image) */
  spectrumColor1: string;
  spectrumColor2: string;
  spectrumColor3: string;
  spectrumColor4: string;
  spectrumCycleEnabled: boolean;
  spectrumCycleSpeed: number;
  /** How much animated spectrum vs static color 1 */
  spectrumBlend: number;
  rimStrength: number;

  transparency: number;

  /** Nested shells inside the outer bubble (0–5) */
  innerGlassLayers: number;
  innerLayerSpacing: number;
  innerLayerTransparencyBoost: number;
  /** Minimum outer transmission when inner layers are enabled */
  innerLayerMinOuterTransmission: number;
  innerLayerThicknessFalloff: number;
  innerLayerGlareFalloff: number;
  innerLayerFilmShift: number;
  innerLayerSpectrumPhase: number;
  innerLayerWobbleOffset: number;

  soapiness: number;
  thickness: number;
  ior: number;
  sheen: number;
  sheenRoughness: number;

  iridescence: number;
  iridescenceIOR: number;
  iridescenceThicknessMin: number;
  iridescenceThicknessMax: number;

  glare: number;
  clearcoat: number;
  gloss: number;
  reflectivity: number;

  roughness: number;
  metalness: number;
  emissiveIntensity: number;

  hemisphereTopColor: string;
  hemisphereBottomColor: string;
  lightColor1: string;
  lightColor2: string;
  lightColor3: string;
  lightColor4: string;
  lightIntensity1: number;
  lightIntensity2: number;
  lightIntensity3: number;
  lightIntensity4: number;

  environmentIntensity: number;
  toneMappingExposure: number;
  ambientLightIntensity: number;
  hemisphereLightIntensity: number;
  pointLightMultiplier: number;

  /** Hero bubble renderer */
  bubbleRenderer: "bubble2" | "r3f";
  /** bubble2 ray-traced holographic effect */
  rayRenderScale: number;
  rayMaxDpr: number;
  rayDispersion: number;
  rayExposureScale: number;
  rayEnvRotation: number;
  rayUseCubemap: boolean;
  rayAnimateEnv: boolean;
  rayThinFilm: boolean;
  rayFilmStrengthScale: number;
  rayFilmIOR: number;
  rayShellThick: number;
  rayHollowPower: number;
  rayWobbleAmp: number;
  rayWobbleSpeed: number;
  rayChromaticRim: number;
  rayFresnelBoost: number;
  rayBlobCount: number;
  rayMetaThreshold: number;
  rayMetaBlend: number;
  rayDriftSpeed: number;
  rayBounds: number;
  rayHeroBlobRadius: number;
  rayAutoRotate: boolean;
  rayAutoRotateSpeed: number;

  /** @deprecated use spectrumColor1 — migrated on load */
  rimColor?: string;
};

export const DEFAULT_BUBBLE_SETTINGS: BubbleSettings = {
  animationEnabled: true,
  wobbleSpeedMultiplier: 2.3,
  wobbleDistortMultiplier: 0.82,
  wobbleRadius: 0.71,

  bodyColor: "#ffffff",

  spectrumColor1: "#cd6df8",
  spectrumColor2: "#22d3ee",
  spectrumColor3: "#8b5cf6",
  spectrumColor4: "#fde047",
  spectrumCycleEnabled: true,
  spectrumCycleSpeed: 0.4,
  spectrumBlend: 0.85,
  rimStrength: 0.55,

  transparency: 0,

  innerGlassLayers: 2,
  innerLayerSpacing: 0.86,
  innerLayerTransparencyBoost: 0.14,
  innerLayerMinOuterTransmission: 0.08,
  innerLayerThicknessFalloff: 0.22,
  innerLayerGlareFalloff: 0.18,
  innerLayerFilmShift: 45,
  innerLayerSpectrumPhase: 0.35,
  innerLayerWobbleOffset: 0.12,

  soapiness: 0.86,
  thickness: 1.72,
  ior: 1.26,
  sheen: 1,
  sheenRoughness: 0.93,

  iridescence: 0.64,
  iridescenceIOR: 2,
  iridescenceThicknessMin: 580,
  iridescenceThicknessMax: 820,

  glare: 13.8,
  clearcoat: 1,
  gloss: 1,
  reflectivity: 1,

  roughness: 0.14,
  metalness: 0,
  emissiveIntensity: 0.09,

  hemisphereTopColor: "#e879f9",
  hemisphereBottomColor: "#22d3ee",
  lightColor1: "#d946ef",
  lightColor2: "#22d3ee",
  lightColor3: "#60a5fa",
  lightColor4: "#fde047",
  lightIntensity1: 3.6,
  lightIntensity2: 3.2,
  lightIntensity3: 2.4,
  lightIntensity4: 2,

  environmentIntensity: 1.35,
  toneMappingExposure: 1.22,
  ambientLightIntensity: 0.45,
  hemisphereLightIntensity: 0.7,
  pointLightMultiplier: 1,

  bubbleRenderer: "bubble2",
  rayRenderScale: 0.85,
  rayMaxDpr: 1.25,
  rayDispersion: 0.018,
  rayExposureScale: 0.7,
  rayEnvRotation: 0.35,
  rayUseCubemap: true,
  rayAnimateEnv: true,
  rayThinFilm: true,
  rayFilmStrengthScale: 1.15,
  rayFilmIOR: 1.33,
  rayShellThick: 0.01,
  rayHollowPower: 2.0,
  rayWobbleAmp: 0.045,
  rayWobbleSpeed: 0.85,
  rayChromaticRim: 0.22,
  rayFresnelBoost: 1.15,
  rayBlobCount: 13,
  rayMetaThreshold: 1.03,
  rayMetaBlend: 0.84,
  rayDriftSpeed: 1.55,
  /** Multiplier on hero-frame bounds (see lib/hero-bubble-bounds.ts) */
  rayBounds: 1.08,
  rayHeroBlobRadius: 0.45,
  rayAutoRotate: false,
  rayAutoRotateSpeed: 0.25,
};

export const BUBBLE_SETTINGS_STORAGE_KEY = "portfolio-bubble-settings-v14";

const LEGACY_STORAGE_KEYS = [
  "portfolio-bubble-settings-v13",
  "portfolio-bubble-settings-v12",
  "portfolio-bubble-settings-v11",
  "portfolio-bubble-settings-v10",
  "portfolio-bubble-settings-v9",
  "portfolio-bubble-settings-v8",
] as const;

type LegacySaved = Partial<BubbleSettings> & {
  transmission?: number;
  envMapIntensity?: number;
  clearcoatRoughness?: number;
  rimColor?: string;
};

/** Fills missing keys; ignores null/undefined so partial localStorage never breaks sliders. */
export function mergeBubbleSettings(partial?: LegacySaved | null): BubbleSettings {
  const merged: BubbleSettings = { ...DEFAULT_BUBBLE_SETTINGS };
  if (!partial) return merged;

  (Object.keys(DEFAULT_BUBBLE_SETTINGS) as (keyof BubbleSettings)[]).forEach(
    (key) => {
      const value = partial[key];
      if (value !== undefined && value !== null) {
        Object.assign(merged, { [key]: value });
      }
    },
  );

  const legacyRim = partial.rimColor;
  if (legacyRim && !partial.spectrumColor1) {
    merged.spectrumColor1 = legacyRim;
  }

  if (partial.transmission !== undefined && partial.transparency === undefined) {
    merged.transparency = partial.transmission;
  }

  if (partial.envMapIntensity !== undefined && partial.glare === undefined) {
    merged.glare = partial.envMapIntensity;
  }

  if (
    partial.clearcoatRoughness !== undefined &&
    partial.gloss === undefined
  ) {
    merged.gloss = 1 - partial.clearcoatRoughness;
  }

  const count = merged.rayBlobCount;
  if (!Number.isFinite(count) || count < 2) {
    merged.rayBlobCount = DEFAULT_BUBBLE_SETTINGS.rayBlobCount;
  } else if (count < 11) {
    merged.rayBlobCount = DEFAULT_BUBBLE_SETTINGS.rayBlobCount;
  }

  if (
    !Number.isFinite(merged.rayHeroBlobRadius) ||
    merged.rayHeroBlobRadius < 0.36 ||
    merged.rayHeroBlobRadius > 0.58
  ) {
    merged.rayHeroBlobRadius = DEFAULT_BUBBLE_SETTINGS.rayHeroBlobRadius;
  }

  if (
    !Number.isFinite(merged.rayDriftSpeed) ||
    merged.rayDriftSpeed > 2.5 ||
    merged.rayDriftSpeed < 0.35
  ) {
    merged.rayDriftSpeed = DEFAULT_BUBBLE_SETTINGS.rayDriftSpeed;
  }

  if (!Number.isFinite(merged.rayBounds) || merged.rayBounds > 1.6) {
    merged.rayBounds = DEFAULT_BUBBLE_SETTINGS.rayBounds;
  }

  return merged;
}

export function readBubbleSettingsFromStorage(): BubbleSettings {
  if (typeof window === "undefined") return DEFAULT_BUBBLE_SETTINGS;

  try {
    let raw = localStorage.getItem(BUBBLE_SETTINGS_STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return DEFAULT_BUBBLE_SETTINGS;
    return mergeBubbleSettings(JSON.parse(raw) as LegacySaved);
  } catch {
    return DEFAULT_BUBBLE_SETTINGS;
  }
}
