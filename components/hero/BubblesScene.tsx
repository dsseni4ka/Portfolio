"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import ApplyBubbleEnvironment from "./ApplyBubbleEnvironment";
import { getGlassQuality } from "@/lib/bubble-glass";
import { BUBBLE_PALETTE } from "@/lib/bubble-palette";
import { getBubbleSceneLights } from "@/lib/bubble-scene-lights";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { MAX_BLOBS } from "@/lib/bubble2/blobs";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import { WOBBLE_SPHERE } from "@/lib/wobble-reference";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import GlassBubble from "./GlassBubble";

/** White interior seen through transmission / refraction (HDRI alone tints the bubble). */
function WhiteBubbleBackdrop() {
  return (
    <mesh scale={[40, 40, 40]} renderOrder={-2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={BUBBLE_PALETTE.background} side={THREE.BackSide} />
    </mesh>
  );
}

function SceneContent() {
  const { settings } = useBubbleSettings();
  const { scene, gl } = useThree();
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const quality = useMemo(
    () => getGlassQuality(mobile, reducedMotion),
    [mobile, reducedMotion],
  );

  const runtime = useMemo(
    () => mapBubble2Runtime(settings, mobile),
    [settings, mobile],
  );

  const blobIndices = useMemo(() => {
    const count = Math.min(runtime.blobCount, MAX_BLOBS, mobile ? 6 : 10);
    return Array.from({ length: count }, (_, i) => i);
  }, [runtime.blobCount, mobile]);

  const lights = useMemo(
    () => getBubbleSceneLights(settings),
    [settings],
  );

  useEffect(() => {
    gl.transmissionResolutionScale = mobile ? 0.75 : 1;
  }, [gl, mobile]);

  useEffect(() => {
    const white = new THREE.Color(BUBBLE_PALETTE.background);
    scene.background = white;
    gl.setClearColor(white, 1);
  }, [scene, gl]);

  useEffect(() => {
    gl.toneMappingExposure = settings.toneMappingExposure;
  }, [gl, settings.toneMappingExposure]);

  const animateBubbles =
    settings.animationEnabled && !reducedMotion;

  return (
    <>
      <WhiteBubbleBackdrop />
      <ApplyBubbleEnvironment />

      <ambientLight intensity={settings.ambientLightIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={1.1} color="#ffffff" />

      <hemisphereLight
        args={[
          settings.hemisphereTopColor,
          settings.hemisphereBottomColor,
          settings.hemisphereLightIntensity,
        ]}
      />

      {lights.map((light, i) => (
        <pointLight
          key={i}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
          distance={22}
          decay={2}
        />
      ))}

      {blobIndices.map((index) => (
        <GlassBubble
          key={index}
          motionBlobIndex={index}
          config={{
            position: [0, 0.06, 0],
            scale: 1.5,
            speed: WOBBLE_SPHERE.speed,
            distort: WOBBLE_SPHERE.distort,
            accent: "magenta",
          }}
          quality={quality}
          animate={animateBubbles}
          maxInnerLayers={mobile ? 1 : 2}
        />
      ))}
    </>
  );
}

type BubblesSceneProps = {
  active?: boolean;
};

export default function BubblesScene({ active = true }: BubblesSceneProps) {
  const { settings } = useBubbleSettings();

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.05, 6.2], fov: 42 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: settings.toneMappingExposure,
      }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: BUBBLE_PALETTE.background,
      }}
      onCreated={({ gl, scene }) => {
        const white = new THREE.Color(BUBBLE_PALETTE.background);
        gl.setClearColor(white, 1);
        scene.background = white;
      }}
    >
      <color attach="background" args={[BUBBLE_PALETTE.background]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
