import {
  DEFAULT_BUBBLE_SETTINGS,
  type BubbleSettings,
} from "@/lib/bubble-settings";

/** Runtime uniforms for bubble2 ray-tracer (from panel + bubble2 defaults). */
export type Bubble2Runtime = {
  renderScale: number;
  maxDpr: number;
  ior: number;
  dispersion: number;
  exposure: number;
  envIntensity: number;
  envRotation: number;
  useCubemap: number;
  animateEnv: number;
  thinFilm: number;
  filmStrength: number;
  filmThickness: number;
  filmIOR: number;
  shellThick: number;
  hollowPower: number;
  wobble: number;
  wobbleAmp: number;
  wobbleSpeed: number;
  rimStrength: number;
  chromaticRim: number;
  fresnelBoost: number;
  blobCount: number;
  metaThreshold: number;
  metaBlend: number;
  driftSpeed: number;
  bounds: number;
  heroBlobRadius: number;
  autoRotate: number;
  autoRotateSpeed: number;
};

const RAY_DEFAULTS = {
  renderScale: DEFAULT_BUBBLE_SETTINGS.rayRenderScale,
  maxDpr: DEFAULT_BUBBLE_SETTINGS.rayMaxDpr,
  dispersion: DEFAULT_BUBBLE_SETTINGS.rayDispersion,
  exposureScale: DEFAULT_BUBBLE_SETTINGS.rayExposureScale,
  envRotation: DEFAULT_BUBBLE_SETTINGS.rayEnvRotation,
  useCubemap: DEFAULT_BUBBLE_SETTINGS.rayUseCubemap,
  animateEnv: DEFAULT_BUBBLE_SETTINGS.rayAnimateEnv,
  thinFilm: DEFAULT_BUBBLE_SETTINGS.rayThinFilm,
  filmStrengthScale: DEFAULT_BUBBLE_SETTINGS.rayFilmStrengthScale,
  filmIOR: DEFAULT_BUBBLE_SETTINGS.rayFilmIOR,
  shellThick: DEFAULT_BUBBLE_SETTINGS.rayShellThick,
  hollowPower: DEFAULT_BUBBLE_SETTINGS.rayHollowPower,
  wobbleAmp: DEFAULT_BUBBLE_SETTINGS.rayWobbleAmp,
  wobbleSpeed: DEFAULT_BUBBLE_SETTINGS.rayWobbleSpeed,
  chromaticRim: DEFAULT_BUBBLE_SETTINGS.rayChromaticRim,
  fresnelBoost: DEFAULT_BUBBLE_SETTINGS.rayFresnelBoost,
  blobCount: DEFAULT_BUBBLE_SETTINGS.rayBlobCount,
  metaThreshold: DEFAULT_BUBBLE_SETTINGS.rayMetaThreshold,
  metaBlend: DEFAULT_BUBBLE_SETTINGS.rayMetaBlend,
  driftSpeed: DEFAULT_BUBBLE_SETTINGS.rayDriftSpeed,
  bounds: DEFAULT_BUBBLE_SETTINGS.rayBounds,
  heroBlobRadius: DEFAULT_BUBBLE_SETTINGS.rayHeroBlobRadius,
  autoRotate: DEFAULT_BUBBLE_SETTINGS.rayAutoRotate,
  autoRotateSpeed: DEFAULT_BUBBLE_SETTINGS.rayAutoRotateSpeed,
};

function num(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? value! : fallback;
}

export function mapBubble2Runtime(
  settings: BubbleSettings,
  mobile: boolean,
): Bubble2Runtime {
  const filmMin = num(
    settings.iridescenceThicknessMin,
    DEFAULT_BUBBLE_SETTINGS.iridescenceThicknessMin,
  );
  const filmMax = num(
    settings.iridescenceThicknessMax,
    DEFAULT_BUBBLE_SETTINGS.iridescenceThicknessMax,
  );
  const filmThickness = (filmMin + filmMax) * 0.5;
  const renderScale = num(settings.rayRenderScale, RAY_DEFAULTS.renderScale);

  return {
    renderScale: mobile ? renderScale * 0.85 : renderScale,
    maxDpr: mobile ? 1.1 : num(settings.rayMaxDpr, RAY_DEFAULTS.maxDpr),
    ior: num(settings.ior, DEFAULT_BUBBLE_SETTINGS.ior),
    dispersion: num(settings.rayDispersion, RAY_DEFAULTS.dispersion),
    exposure:
      num(settings.toneMappingExposure, DEFAULT_BUBBLE_SETTINGS.toneMappingExposure) *
      num(settings.rayExposureScale, RAY_DEFAULTS.exposureScale),
    envIntensity:
      num(
        settings.environmentIntensity,
        DEFAULT_BUBBLE_SETTINGS.environmentIntensity,
      ) * 1.1,
    envRotation: num(settings.rayEnvRotation, RAY_DEFAULTS.envRotation),
    useCubemap: settings.rayUseCubemap === false ? 0 : 1,
    animateEnv: settings.rayAnimateEnv === false ? 0 : 1,
    thinFilm: settings.rayThinFilm === false ? 0 : 1,
    filmStrength: Math.max(
      0.45,
      num(settings.iridescence, DEFAULT_BUBBLE_SETTINGS.iridescence) *
        num(settings.rayFilmStrengthScale, RAY_DEFAULTS.filmStrengthScale),
    ),
    filmThickness,
    filmIOR: num(settings.rayFilmIOR, RAY_DEFAULTS.filmIOR),
    shellThick: num(settings.rayShellThick, RAY_DEFAULTS.shellThick),
    hollowPower: num(settings.rayHollowPower, RAY_DEFAULTS.hollowPower),
    wobble: settings.animationEnabled === false ? 0 : 1,
    wobbleAmp:
      num(settings.rayWobbleAmp, RAY_DEFAULTS.wobbleAmp) *
      (0.6 +
        num(
          settings.wobbleDistortMultiplier,
          DEFAULT_BUBBLE_SETTINGS.wobbleDistortMultiplier,
        ) *
          0.35),
    wobbleSpeed:
      num(settings.rayWobbleSpeed, RAY_DEFAULTS.wobbleSpeed) *
      num(
        settings.wobbleSpeedMultiplier,
        DEFAULT_BUBBLE_SETTINGS.wobbleSpeedMultiplier,
      ) *
      0.4,
    rimStrength: num(settings.rimStrength, DEFAULT_BUBBLE_SETTINGS.rimStrength),
    chromaticRim: num(settings.rayChromaticRim, RAY_DEFAULTS.chromaticRim),
    fresnelBoost: num(settings.rayFresnelBoost, RAY_DEFAULTS.fresnelBoost),
    blobCount: Math.max(
      2,
      Math.min(15, Math.round(num(settings.rayBlobCount, RAY_DEFAULTS.blobCount))),
    ),
    metaThreshold: num(settings.rayMetaThreshold, RAY_DEFAULTS.metaThreshold),
    metaBlend: num(settings.rayMetaBlend, RAY_DEFAULTS.metaBlend),
    driftSpeed: num(settings.rayDriftSpeed, RAY_DEFAULTS.driftSpeed),
    bounds: num(settings.rayBounds, RAY_DEFAULTS.bounds),
    heroBlobRadius: num(settings.rayHeroBlobRadius, RAY_DEFAULTS.heroBlobRadius),
    autoRotate: settings.rayAutoRotate ? 1 : 0,
    autoRotateSpeed: num(
      settings.rayAutoRotateSpeed,
      RAY_DEFAULTS.autoRotateSpeed,
    ),
  };
}
