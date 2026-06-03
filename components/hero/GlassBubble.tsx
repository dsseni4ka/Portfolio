"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, MeshPhysicalMaterial } from "three";
import { metaballToScene } from "@/lib/bubble2/coords";
import { useBubble2Motion } from "@/lib/bubble2/motion-engine";
import {
  getBubbleGlassLayers,
  getBubbleMaterialProps,
} from "@/lib/bubble-material";
import { applySpectrumToMaterial } from "@/lib/bubble-spectrum";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import type { BubbleConfig } from "@/lib/bubbles";
import type { GlassQuality } from "@/lib/bubble-glass";
import { WOBBLE_SPHERE } from "@/lib/wobble-reference";

type GlassBubbleProps = {
  config: BubbleConfig;
  quality: GlassQuality;
  animate: boolean;
  maxInnerLayers?: number;
  /** Index into bubble2 motion engine (enables zero-G drift) */
  motionBlobIndex?: number;
};

export default function GlassBubble({
  config,
  quality,
  animate,
  maxInnerLayers,
  motionBlobIndex,
}: GlassBubbleProps) {
  const { settings } = useBubbleSettings();
  const motion = useBubble2Motion();
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<(Mesh | null)[]>([]);

  const layers = useMemo(() => {
    const all = getBubbleGlassLayers(settings);
    if (maxInnerLayers === undefined) return all;
    const cap = Math.max(0, Math.min(maxInnerLayers, 5));
    return all.slice(0, cap + 1);
  }, [settings, maxInnerLayers]);

  const wobbleOn = animate && settings.animationEnabled;
  const wobbleSpeed = wobbleOn
    ? config.speed * settings.wobbleSpeedMultiplier
    : 0;
  const wobbleDistort =
    config.distort * settings.wobbleDistortMultiplier;
  const wobbleRadius =
    settings.wobbleRadius ?? WOBBLE_SPHERE.radius;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    let basePos = config.position;
    let baseScale = config.scale;

    if (motionBlobIndex !== undefined) {
      const blob = motion.blobs[motionBlobIndex];
      if (blob) {
        const mapped = metaballToScene(blob.pos, blob.radius);
        basePos = mapped.position;
        baseScale = mapped.scale;
      }
    }

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const layer = layers[i];
      if (!layer) return;
      const mat = mesh.material as MeshPhysicalMaterial;
      applySpectrumToMaterial(
        mat,
        settings,
        time,
        layer.spectrumTimeOffset,
      );
      const shellScale = baseScale * layer.scale;
      mesh.scale.setScalar(shellScale);
    });

    if (!wobbleOn) {
      group.position.set(...basePos);
      return;
    }
    const t = time * wobbleSpeed * 0.35;
    group.position.set(
      basePos[0] + Math.cos(t * 0.9) * 0.02,
      basePos[1] + Math.sin(t) * 0.03 + Math.sin(t * 1.7) * 0.015,
      basePos[2],
    );
  });

  return (
    <group ref={groupRef} position={config.position}>
      {layers.map((layer, index) => {
        const materialProps = getBubbleMaterialProps(settings, layer.depth);
        const layerSpeed = wobbleSpeed * layer.wobbleSpeedFactor;
        const layerDistort =
          wobbleDistort * layer.wobbleDistortFactor;
        const layerRadius = wobbleRadius + layer.wobbleRadiusOffset;
        const isOuter = layer.depth === 0;

        return (
          <mesh
            key={layer.depth}
            ref={(el) => {
              meshRefs.current[index] = el;
            }}
            renderOrder={layer.renderOrder}
            scale={[config.scale, config.scale, config.scale]}
          >
            <sphereGeometry
              args={[1, quality.segments, quality.segments]}
            />
            <MeshDistortMaterial
              speed={layerSpeed}
              distort={layerDistort}
              radius={layerRadius}
              depthWrite={isOuter}
              depthTest
              transparent={!isOuter || materialProps.transmission > 0}
              {...materialProps}
            />
          </mesh>
        );
      })}
    </group>
  );
}
