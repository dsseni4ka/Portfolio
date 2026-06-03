import type { BubbleSettings } from "@/lib/bubble-settings";

export type BubbleSceneLight = {
  position: [number, number, number];
  color: string;
  intensity: number;
};

export function getBubbleSceneLights(
  settings: BubbleSettings,
): BubbleSceneLight[] {
  const m = settings.pointLightMultiplier;
  return [
    {
      position: [-2.5, 1.8, 3.5],
      color: settings.lightColor1,
      intensity: settings.lightIntensity1 * m,
    },
    {
      position: [2.8, 1.2, 3],
      color: settings.lightColor2,
      intensity: settings.lightIntensity2 * m,
    },
    {
      position: [1.5, -1.5, 2.8],
      color: settings.lightColor3,
      intensity: settings.lightIntensity3 * m,
    },
    {
      position: [-1.8, -0.4, 4],
      color: settings.lightColor4,
      intensity: settings.lightIntensity4 * m,
    },
  ];
}
