import * as THREE from "three";
import type { BubbleSettings } from "@/lib/bubble-settings";

export function getSpectrumColors(settings: BubbleSettings): string[] {
  return [
    settings.spectrumColor1,
    settings.spectrumColor2,
    settings.spectrumColor3,
    settings.spectrumColor4,
  ];
}

const _a = new THREE.Color();
const _b = new THREE.Color();
const _out = new THREE.Color();

/** Smooth blend through spectrum stops (soap-film color shift). */
export function sampleSpectrumColor(
  settings: BubbleSettings,
  time: number,
): THREE.Color {
  const stops = getSpectrumColors(settings);
  if (!settings.spectrumCycleEnabled || stops.length < 2) {
    _out.set(stops[0] ?? settings.spectrumColor1);
    return _out;
  }

  const speed = settings.spectrumCycleSpeed;
  const n = stops.length;
  const t = (time * speed) % n;
  const i = Math.floor(t);
  const f = t - i;
  _a.set(stops[i]!);
  _b.set(stops[(i + 1) % n]!);
  _out.copy(_a).lerp(_b, f);
  return _out;
}

export function applySpectrumToMaterial(
  material: THREE.MeshPhysicalMaterial,
  settings: BubbleSettings,
  time: number,
  spectrumTimeOffset = 0,
) {
  const spectrum = sampleSpectrumColor(
    settings,
    time + spectrumTimeOffset,
  );
  const staticColor = _a.set(settings.spectrumColor1);
  const mix = settings.spectrumBlend;

  _out.copy(staticColor).lerp(spectrum, mix);
  material.sheenColor.copy(_out);
  material.emissive.copy(_out);
  material.emissiveIntensity =
    settings.emissiveIntensity * settings.rimStrength;
}
