"use client";

import { toCanvas } from "html-to-image";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useHeroCaptureElement } from "@/lib/hero-capture-context";

function createFallbackMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 332;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0e0e0f";
  ctx.font = "bold 120px Georgia, serif";
  ctx.fillText("D", 40, 200);
  ctx.font = "bold 72px system-ui";
  ctx.fillText("IANA", 160, 140);
  ctx.fillText("SENIK", 160, 240);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function useHeroMapTexture() {
  const { captureEl } = useHeroCaptureElement();
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (!captureEl) return;

    let disposed = false;
    let frame = 0;

    const capture = async () => {
      try {
        const canvas = await toCanvas(captureEl, {
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          cacheBust: true,
          backgroundColor: "#ffffff",
        });
        if (disposed) return;

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;

        setTexture((prev) => {
          prev?.dispose();
          return tex;
        });
      } catch {
        if (!disposed) {
          setTexture((prev) => prev ?? createFallbackMap());
        }
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(capture);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(captureEl);
    window.addEventListener("resize", schedule);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [captureEl]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}
