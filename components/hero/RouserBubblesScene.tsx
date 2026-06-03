"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import RouserBubble from "./RouserBubble";
import { ROUSER_BUBBLE_DEFAULTS } from "@/lib/rouser-bubble-uniforms";

export default function RouserBubblesScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      orthographic
      frameloop="always"
      camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
      gl={{
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <RouserBubble values={ROUSER_BUBBLE_DEFAULTS} />
      </Suspense>
    </Canvas>
  );
}
