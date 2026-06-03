import type { BubbleSettings } from "@/lib/bubble-settings";

export type BubbleGlassLayer = {
  /** 0 = outer shell, 1+ = inner glass */
  depth: number;
  scale: number;
  renderOrder: number;
  spectrumTimeOffset: number;
  wobbleSpeedFactor: number;
  wobbleDistortFactor: number;
  wobbleRadiusOffset: number;
};

/** Outer shell + nested inner glass layers */
export function getBubbleGlassLayers(settings: BubbleSettings): BubbleGlassLayer[] {
  const count = Math.max(0, Math.min(5, Math.round(settings.innerGlassLayers)));
  const layers: BubbleGlassLayer[] = [
    {
      depth: 0,
      scale: 1,
      renderOrder: count,
      spectrumTimeOffset: 0,
      wobbleSpeedFactor: 1,
      wobbleDistortFactor: 1,
      wobbleRadiusOffset: 0,
    },
  ];

  for (let i = 1; i <= count; i++) {
    layers.push({
      depth: i,
      scale: Math.pow(settings.innerLayerSpacing, i),
      renderOrder: count - i,
      spectrumTimeOffset: i * settings.innerLayerSpectrumPhase,
      wobbleSpeedFactor: 1 + i * settings.innerLayerWobbleOffset,
      wobbleDistortFactor: 1 - i * settings.innerLayerWobbleOffset * 0.35,
      wobbleRadiusOffset: i * 0.04,
    });
  }

  return layers;
}

/** Maps panel settings → MeshDistortMaterial props (per shell depth) */
export function getBubbleMaterialProps(
  settings: BubbleSettings,
  depth = 0,
) {
  const soap = settings.soapiness;
  const inner = depth > 0;
  const depthFactor = depth;

  const transmissionBoost =
    depthFactor * settings.innerLayerTransparencyBoost;
  let transmission = Math.min(
    1,
    settings.transparency + transmissionBoost,
  );
  if (
    depth === 0 &&
    settings.innerGlassLayers > 0 &&
    transmission < settings.innerLayerMinOuterTransmission
  ) {
    transmission = settings.innerLayerMinOuterTransmission;
  }

  const thickness =
    (settings.thickness + soap * 0.4) *
    (inner ? 1 - depthFactor * settings.innerLayerThicknessFalloff : 1);

  const glare =
    settings.glare *
    (inner
      ? Math.max(0.2, 1 - depthFactor * settings.innerLayerGlareFalloff)
      : 1);

  const filmShift = depthFactor * settings.innerLayerFilmShift;

  return {
    color: settings.bodyColor,
    transmission,
    thickness,
    ior: settings.ior + soap * 0.1 + (inner ? depthFactor * 0.03 : 0),
    sheen: Math.min(1, settings.sheen + soap * 0.2),
    sheenRoughness: settings.sheenRoughness,
    sheenColor: settings.spectrumColor1,
    emissive: settings.spectrumColor1,
    emissiveIntensity:
      settings.emissiveIntensity *
      settings.rimStrength *
      (inner ? Math.max(0.35, 1 - depthFactor * 0.2) : 1),
    iridescence: settings.iridescence,
    iridescenceIOR: settings.iridescenceIOR,
    iridescenceThicknessRange: [
      settings.iridescenceThicknessMin + filmShift,
      settings.iridescenceThicknessMax + filmShift,
    ] as [number, number],
    clearcoat: settings.clearcoat,
    clearcoatRoughness: Math.max(0, 1 - settings.gloss),
    envMapIntensity: glare,
    reflectivity: settings.reflectivity,
    roughness: settings.roughness + (inner ? depthFactor * 0.02 : 0),
    metalness: settings.metalness,
  };
}
