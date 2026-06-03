"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { forwardRef } from "react";
import type { Mesh } from "three";
import { BUBBLE_MATERIAL, type BubbleConfig } from "@/lib/bubbles";

type BubbleProps = {
  config: BubbleConfig;
  mobile: boolean;
  enableDrag: boolean;
  onPointerDown: (event: ThreeEvent<PointerEvent>, id: number) => void;
};

const Bubble = forwardRef<Mesh, BubbleProps>(function Bubble(
  { config, mobile, enableDrag, onPointerDown },
  ref,
) {
  return (
    <mesh
      ref={ref}
      position={config.rest}
      onPointerDown={(event) => {
        if (!enableDrag) return;
        event.stopPropagation();
        onPointerDown(event, config.id);
      }}
    >
      <sphereGeometry args={[config.radius, mobile ? 32 : 48, mobile ? 32 : 48]} />
      <MeshTransmissionMaterial
        transmission={BUBBLE_MATERIAL.transmission}
        roughness={BUBBLE_MATERIAL.roughness}
        thickness={BUBBLE_MATERIAL.thickness}
        ior={BUBBLE_MATERIAL.ior}
        iridescence={BUBBLE_MATERIAL.iridescence}
        iridescenceIOR={BUBBLE_MATERIAL.iridescenceIOR}
        chromaticAberration={BUBBLE_MATERIAL.chromaticAberration}
        distortion={BUBBLE_MATERIAL.distortion}
        anisotropy={BUBBLE_MATERIAL.anisotropy}
        samples={mobile ? 4 : 8}
        resolution={mobile ? 256 : 512}
        color="#ffffff"
        attenuationColor="#f6f8fb"
        attenuationDistance={0.75}
      />
    </mesh>
  );
});

export default Bubble;
