"use client";

import { useEffect, useRef } from "react";
import { MAX_BLOBS } from "@/lib/bubble2/blobs";
import { createEnvCubemap } from "@/lib/bubble2/env-cubemap";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import { useBubbleSettings } from "@/lib/bubble-settings-store";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import {
  ABOUT_BUBBLE_META_THRESHOLD,
  mapAboutBubbleCameraDistance,
  mapAboutBubbleRadius,
  mapAboutBubbleViewScale,
} from "@/lib/about-bubble-map";

const ABOUT_MAIN = `void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
  vec3 ro = u_camPos;
  mat3 cam = lookAt(ro, u_camTarget, vec3(0.0, 1.0, 0.0));
  float viewScale = max(u_meta.z, 0.35);
  vec3 rd = normalize(cam * vec3(uv * viewScale, -1.65));

  vec3 p, n;
  if (!rayMarchMetaball(ro, rd, p, n)) {
    fragColor = vec4(0.0);
    return;
  }
  vec3 raw = shadeSoapShell(p, n, rd);
  float shellAmount = clamp(length(raw - BG_COLOR) * 12.0, 0.0, 1.0);
  vec3 toned = pow(acesFilm(raw * EXPOSURE), vec3(1.0 / 2.2));
  vec3 col = mix(BG_COLOR, toned, shellAmount);
  fragColor = vec4(col, 1.0);
}`;

function patchAboutFragmentShader(source: string) {
  const patched = source.replace(/void main\(\) \{[\s\S]*?\n\}/, ABOUT_MAIN);
  if (patched === source) {
    throw new Error("Failed to patch about bubble fragment shader");
  }
  return patched;
}

const VERT_SRC = `#version 300 es
precision highp float;
const vec2 pos[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2( 3.0, -1.0),
  vec2(-1.0,  3.0)
);
void main() {
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}
`;

const REQUIRED_UNIFORMS = [
  "u_resolution",
  "u_time",
  "u_camPos",
  "u_camTarget",
  "u_envCube",
  "u_useCubemap",
  "u_envIntensity",
  "u_envRot",
  "u_settings0",
  "u_settings1",
  "u_settings2",
  "u_settings3",
  "u_meta",
] as const;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    throw new Error("Shader compile failed");
  }
  return shader;
}

function envRotationMatrix(angle: number, time: number, animateEnv: boolean) {
  const a = angle + (animateEnv ? time * 0.08 : 0);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const cy = Math.cos(a * 0.6);
  const sy = Math.sin(a * 0.6);
  return new Float32Array([c, 0, s, sy * 0.15, cy, -sy * 0.15, -s, 0, c]);
}

function waitForCanvasSize(canvas: HTMLCanvasElement) {
  return new Promise<void>((resolve) => {
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
      resolve();
      return;
    }
    const observer = new ResizeObserver(() => {
      if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(canvas);
  });
}

type AboutScrollBubbleProps = {
  scrollProgress: number;
};

export default function AboutScrollBubble({
  scrollProgress,
}: AboutScrollBubbleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  const { settings } = useBubbleSettings();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const mobile = useIsMobile();
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;
  const reducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvasNode = canvasEl;

    const gl = canvasNode.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.error("WebGL2 unavailable for about scroll bubble");
      return;
    }

    const gl2 = gl;
    gl2.enable(gl2.BLEND);
    gl2.blendFunc(gl2.SRC_ALPHA, gl2.ONE_MINUS_SRC_ALPHA);
    let disposed = false;
    let prog: WebGLProgram | null = null;
    let envCube: WebGLTexture | null = null;
    let animId = 0;
    const t0 = performance.now();
    const blobData = new Float32Array(MAX_BLOBS * 4);

    const u: Record<string, WebGLUniformLocation | null> = {};
    const blobUniforms: (WebGLUniformLocation | null)[] = [];

    function refreshCubemap(
      runtime: ReturnType<typeof mapBubble2Runtime>,
      time = 0,
    ) {
      if (envCube) gl2.deleteTexture(envCube);
      envCube = createEnvCubemap(gl2, {
        size: 128,
        time,
        intensity: runtime.envIntensity,
      });
    }

    function applyUniforms(
      runtime: ReturnType<typeof mapBubble2Runtime>,
      time: number,
      width: number,
      height: number,
      progress: number,
    ) {
      if (!prog) return;
      gl2.useProgram(prog);

      gl2.uniform4f(
        u.u_settings0!,
        runtime.ior,
        runtime.dispersion,
        runtime.filmStrength,
        runtime.filmThickness,
      );
      gl2.uniform4f(
        u.u_settings1!,
        runtime.wobbleAmp,
        runtime.wobbleSpeed,
        runtime.rimStrength,
        runtime.chromaticRim,
      );
      gl2.uniform4f(
        u.u_settings2!,
        runtime.fresnelBoost,
        runtime.thinFilm,
        runtime.wobble,
        runtime.exposure,
      );
      gl2.uniform4f(
        u.u_settings3!,
        runtime.filmIOR,
        runtime.shellThick,
        runtime.hollowPower,
        0,
      );
      gl2.uniform1f(u.u_useCubemap!, runtime.useCubemap);
      gl2.uniform1f(u.u_envIntensity!, runtime.envIntensity);
      gl2.uniform4f(
        u.u_meta!,
        ABOUT_BUBBLE_META_THRESHOLD,
        runtime.metaBlend,
        mapAboutBubbleViewScale(progress),
        1,
      );

      const dist = mapAboutBubbleCameraDistance(progress);
      gl2.uniformMatrix3fv(
        u.u_envRot!,
        false,
        envRotationMatrix(
          runtime.envRotation,
          time,
          runtime.animateEnv > 0.5,
        ),
      );
      gl2.uniform2f(u.u_resolution!, width, height);
      gl2.uniform1f(u.u_time!, time);
      gl2.uniform3fv(u.u_camPos!, [0, 0, dist]);
      gl2.uniform3fv(u.u_camTarget!, [0, 0, 0]);

      for (let i = 0; i < MAX_BLOBS; i++) {
        const loc = blobUniforms[i];
        if (!loc) continue;
        const o = i * 4;
        gl2.uniform4f(
          loc,
          blobData[o]!,
          blobData[o + 1]!,
          blobData[o + 2]!,
          blobData[o + 3]!,
        );
      }

      if (envCube) {
        gl2.activeTexture(gl2.TEXTURE0);
        gl2.bindTexture(gl2.TEXTURE_CUBE_MAP, envCube);
      }
    }

    let width = 1;
    let height = 1;
    let lastRuntimeKey = "";

    function resize(runtime: ReturnType<typeof mapBubble2Runtime>) {
      const scale = Math.max(1, runtime.renderScale);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(canvasNode.clientWidth * dpr * scale));
      height = Math.max(1, Math.floor(canvasNode.clientHeight * dpr * scale));
      if (canvasNode.width !== width || canvasNode.height !== height) {
        canvasNode.width = width;
        canvasNode.height = height;
        gl2.viewport(0, 0, width, height);
      }
    }

    async function init() {
      await waitForCanvasSize(canvasNode);
      if (disposed) return;

      const fragRes = await fetch("/shaders/bubble2.frag?v=16");
      if (!fragRes.ok) throw new Error(`Shader fetch failed: ${fragRes.status}`);
      const fragSrc = patchAboutFragmentShader(await fragRes.text());
      if (disposed) return;

      const vs = compileShader(gl2, gl2.VERTEX_SHADER, VERT_SRC);
      const fs = compileShader(gl2, gl2.FRAGMENT_SHADER, fragSrc);
      prog = gl2.createProgram();
      if (!prog) throw new Error("Failed to create program");
      gl2.attachShader(prog, vs);
      gl2.attachShader(prog, fs);
      gl2.linkProgram(prog);
      if (!gl2.getProgramParameter(prog, gl2.LINK_STATUS)) {
        console.error(gl2.getProgramInfoLog(prog));
        throw new Error("Program link failed");
      }
      gl2.useProgram(prog);

      for (const name of REQUIRED_UNIFORMS) {
        u[name] = gl2.getUniformLocation(prog, name);
        if (!u[name]) throw new Error(`Missing uniform: ${name}`);
      }

      for (let i = 0; i < MAX_BLOBS; i++) {
        blobUniforms[i] = gl2.getUniformLocation(prog, `u_blobs[${i}]`);
      }

      gl2.activeTexture(gl2.TEXTURE0);
      gl2.uniform1i(u.u_envCube, 0);

      const runtime = mapBubble2Runtime(
        settingsRef.current,
        mobileRef.current,
      );
      refreshCubemap(runtime, 0);
      resize(runtime);
    }

    init().catch((err) => {
      console.error("About scroll bubble init failed:", err);
    });

    const frame = (now: number) => {
      if (disposed) return;
      animId = requestAnimationFrame(frame);

      const runtime = mapBubble2Runtime(
        settingsRef.current,
        mobileRef.current,
      );
      const runtimeKey = JSON.stringify(runtime);
      if (runtimeKey !== lastRuntimeKey) {
        lastRuntimeKey = runtimeKey;
        if (runtime.useCubemap > 0.5) {
          refreshCubemap(runtime, (now - t0) * 0.001);
        }
      }

      resize(runtime);
      const time = (now - t0) * 0.001;
      const progress = progressRef.current;
      const radius = mapAboutBubbleRadius(progress);
      const wobbleScale = reducedMotionRef.current ? 0 : progress;

      blobData.fill(0);
      blobData[0] = Math.sin(time * 0.75) * 0.025 * wobbleScale;
      blobData[1] = Math.cos(time * 0.55) * 0.02 * wobbleScale;
      blobData[2] = 0;
      blobData[3] = radius;

      gl2.clearColor(0, 0, 0, 0);
      gl2.clear(gl2.COLOR_BUFFER_BIT);

      if (!prog || width < 2 || height < 2) return;
      applyUniforms(runtime, time, width, height, progress);
      gl2.drawArrays(gl2.TRIANGLES, 0, 3);
    };

    animId = requestAnimationFrame(frame);

    const resizeObserver = new ResizeObserver(() => {
      resize(mapBubble2Runtime(settingsRef.current, mobileRef.current));
    });
    resizeObserver.observe(canvasNode);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (envCube) gl2.deleteTexture(envCube);
      if (prog) gl2.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      style={{ touchAction: "none" }}
      aria-hidden
    />
  );
}
