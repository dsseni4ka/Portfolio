"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { EXRLoader } from "three-stdlib";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BUBBLE_HDRI_URL } from "@/lib/bubble-env";
import { createRouserBubbleGeometry } from "@/lib/rouser-bubble-geometry";
import {
  ROUSER_BUBBLE_DEFAULTS,
  createRouserBubbleUniforms,
  type RouserBubbleUniformValues,
} from "@/lib/rouser-bubble-uniforms";
import { loadRouserShaders } from "@/lib/rouser-shaders/shaders";
import { useHeroMapTexture } from "@/lib/use-hero-map-texture";

type RouserBubbleProps = {
  values?: RouserBubbleUniformValues;
};

export default function RouserBubble({
  values = ROUSER_BUBBLE_DEFAULTS,
}: RouserBubbleProps) {
  const heroMap = useHeroMapTexture();
  const reflectionMap = useLoader(EXRLoader, BUBBLE_HDRI_URL);
  const [shaders, setShaders] = useState<{ vert: string; frag: string } | null>(
    null,
  );
  const materialRef = useRef<THREE.RawShaderMaterial>(null);
  const geometry = useMemo(
    () => createRouserBubbleGeometry(200, values.radius),
    [values.radius],
  );

  useEffect(() => {
    loadRouserShaders().then(setShaders);
  }, []);

  const uniforms = useMemo(
    () =>
      createRouserBubbleUniforms(heroMap, reflectionMap, values),
    [heroMap, reflectionMap, values],
  );

  const material = useMemo(() => {
    if (!shaders) return null;
    return new THREE.RawShaderMaterial({
      vertexShader: shaders.vert,
      fragmentShader: shaders.frag,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
  }, [shaders, uniforms]);

  useEffect(() => {
    if (!material) return;
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    if (!materialRef.current?.uniforms) return;
    const u = materialRef.current.uniforms;
    if (heroMap) u.uMap.value = heroMap;
    if (reflectionMap) u.uReflectionMap.value = reflectionMap;
    u.uOffset.value.set(values.offsetX, values.offsetY);
    u.chromaticDistance.value = values.chromaticDistance;
    u.chromaticPower.value = values.chromaticPower;
    u.backgroundDistortion.value = values.backgroundDistortion;
    u.edgeDistortion.value = values.edgeDistortion;
    u.cameraRotation.value = values.cameraRotation;
    u.reflectionPower.value = values.reflectionPower;
    u.reflectionHighlights.value = values.reflectionHighlights;
    u.baseRainbow.value = values.baseRainbow;
    u.normalRainbow.value = values.normalRainbow;
  }, [heroMap, reflectionMap, values]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  if (!material || !heroMap) return null;

  return (
    <mesh geometry={geometry} material={material} frustumCulled={false} />
  );
}
