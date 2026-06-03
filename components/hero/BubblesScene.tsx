"use client";

import { Environment } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import {
  DRAG_PLANE_Z,
  getBubbleConfigs,
  IDLE_SPEED,
  POINTER_INFLUENCE,
  SPRING_STRENGTH,
} from "@/lib/bubbles";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { colors } from "@/lib/theme";
import Bubble from "./Bubble";

type BubblesInnerProps = {
  reducedMotion: boolean;
  mobile: boolean;
};

function BubblesInner({ reducedMotion, mobile }: BubblesInnerProps) {
  const configs = useMemo(() => getBubbleConfigs(mobile), [mobile]);
  const meshRefs = useRef<(Mesh | null)[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), -DRAG_PLANE_Z));
  const raycaster = useRef(new THREE.Raycaster());
  const pointerNDC = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const lastDragPos = useRef(new THREE.Vector3());
  const time = useRef(0);

  const { camera, pointer, gl } = useThree();
  const enableInteraction = !reducedMotion;
  const enableDrag = enableInteraction && !mobile;

  const endDrag = useCallback(() => {
    setDraggingId((current) => {
      if (current !== null) {
        gl.domElement.style.cursor = enableDrag ? "grab" : "default";
      }
      return null;
    });
  }, [enableDrag, gl.domElement.style]);

  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    return () => window.removeEventListener("pointerup", endDrag);
  }, [endDrag]);

  const projectPointerToPlane = useCallback(() => {
    pointerNDC.current.set(pointer.x, pointer.y);
    raycaster.current.setFromCamera(pointerNDC.current, camera);
    const hit = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(dragPlane.current, hit);
    return hit;
  }, [camera, pointer]);

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>, id: number) => {
      if (!enableDrag) return;
      setDraggingId(id);
      lastDragPos.current.copy(event.point);
      velocity.current.set(0, 0, 0);
      gl.domElement.style.cursor = "grabbing";
    },
    [enableDrag, gl.domElement.style],
  );

  useFrame((_, delta) => {
    time.current += delta;
    const pointerHit = projectPointerToPlane();

    configs.forEach((config, index) => {
      const mesh = meshRefs.current[index];
      if (!mesh) return;

      if (draggingId === config.id) {
        mesh.position.copy(pointerHit);
        velocity.current.subVectors(mesh.position, lastDragPos.current).divideScalar(
          Math.max(delta, 0.001),
        );
        lastDragPos.current.copy(mesh.position);
        return;
      }

      const [rx, ry, rz] = config.rest;
      const driftX = Math.sin(time.current * IDLE_SPEED + config.phase) * config.driftAmp;
      const driftY =
        Math.cos(time.current * IDLE_SPEED * 0.85 + config.phase * 1.3) * config.driftAmp;

      target.current.set(rx + driftX, ry + driftY, rz);

      if (enableInteraction) {
        const dx = pointerHit.x - rx;
        const dy = pointerHit.y - ry;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = POINTER_INFLUENCE / (1 + dist * 1.8);
        target.current.x += dx * influence * 0.35;
        target.current.y += dy * influence * 0.35;
      }

      if (draggingId === null && velocity.current.lengthSq() > 0.0001) {
        target.current.addScaledVector(velocity.current, 0.02);
        velocity.current.multiplyScalar(0.92);
      }

      const smooth = reducedMotion ? 1 : SPRING_STRENGTH;
      easing.damp3(mesh.position, target.current, smooth, delta);
    });
  });

  return (
    <>
      <color attach="background" args={[colors.bg]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />
      <Environment preset="studio" />

      {configs.map((config, index) => (
        <Bubble
          key={config.id}
          ref={(node) => {
            meshRefs.current[index] = node;
          }}
          config={config}
          mobile={mobile}
          enableDrag={enableDrag}
          onPointerDown={handlePointerDown}
        />
      ))}

      {!reducedMotion && (
        <EffectComposer multisampling={mobile ? 0 : 4}>
          <DepthOfField
            focusDistance={0.02}
            focalLength={0.015}
            bokehScale={mobile ? 1.5 : 2.5}
            height={480}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function BubblesScene() {
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useIsMobile();

  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{
        width: "100%",
        height: "100%",
        cursor: reducedMotion || mobile ? "default" : "grab",
      }}
    >
      <BubblesInner reducedMotion={reducedMotion} mobile={mobile} />
    </Canvas>
  );
}
