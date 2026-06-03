import type { IUniform } from "three";
import * as THREE from "three";

/** Defaults extracted from rouserlab.com theme bundle */
export const ROUSER_BUBBLE_DEFAULTS = {
  offsetX: -0.2,
  offsetY: 0.05,
  radius: 0.34,
  chromaticDistance: 0.025,
  chromaticPower: 0.85,
  backgroundDistortion: 0.1,
  edgeDistortion: 4.5,
  cameraRotation: 4,
  reflectionPower: 0.83,
  reflectionHighlights: 3.123,
  baseRainbow: 0.018,
  normalRainbow: 0.07,
} as const;

export type RouserBubbleUniformValues = typeof ROUSER_BUBBLE_DEFAULTS;

export function createRouserBubbleUniforms(
  map: THREE.Texture | null,
  reflection: THREE.Texture | null,
  values: RouserBubbleUniformValues = ROUSER_BUBBLE_DEFAULTS,
): Record<string, IUniform> {
  return {
    uMap: { value: map },
    uReflectionMap: { value: reflection },
    uTime: { value: 0 },
    uOffset: { value: new THREE.Vector2(values.offsetX, values.offsetY) },
    chromaticDistance: { value: values.chromaticDistance },
    chromaticPower: { value: values.chromaticPower },
    backgroundDistortion: { value: values.backgroundDistortion },
    edgeDistortion: { value: values.edgeDistortion },
    cameraRotation: { value: values.cameraRotation },
    reflectionPower: { value: values.reflectionPower },
    reflectionHighlights: { value: values.reflectionHighlights },
    aboutToBurst: { value: 0 },
    baseRainbow: { value: values.baseRainbow },
    normalRainbow: { value: values.normalRainbow },
    popProgress: { value: 0 },
    popPos: { value: new THREE.Vector2(0.5, 0.5) },
  };
}
