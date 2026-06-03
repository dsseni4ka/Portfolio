"use client";

import { Environment } from "@react-three/drei";
import { BUBBLE_HDRI_URL } from "@/lib/bubble-env";
import { useBubbleSettings } from "@/lib/bubble-settings-store";

/** Loads the Ferndale studio EXR and applies it as scene.environment. */
export default function ApplyBubbleEnvironment() {
  const { settings } = useBubbleSettings();

  return (
    <Environment
      files={BUBBLE_HDRI_URL}
      background={false}
      environmentIntensity={settings.environmentIntensity}
    />
  );
}
