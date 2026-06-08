import type { AboutPopSettings } from "@/lib/about-pop-settings";

/** Burst droplet — matches reference Bubble Burst simulator physics. */
export type PopParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
};

const RING_DURATION_MS = 160;
const MAX_POP_SAFETY_MS = 16000;
/** Fixed physics step for stable motion across variable frame deltas. */
const PHYSICS_STEP_MS = 1000 / 60;

/**
 * Spawn particles inside the bubble disk; velocity snaps outward from center
 * (reference createBurst).
 */
export function createBubbleBurst(
  centerX: number,
  centerY: number,
  bubbleRadius: number,
  settings: AboutPopSettings,
): PopParticle[] {
  const count =
    settings.dropletCount > 0
      ? Math.min(320, settings.dropletCount)
      : Math.min(
          320,
          Math.max(40, Math.floor(bubbleRadius * settings.particlesPerRadius)),
        );

  const particles: PopParticle[] = [];
  const forceBase = settings.explosiveForce * settings.popSpeed;

  for (let i = 0; i < count; i++) {
    const r = bubbleRadius * Math.sqrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const px = centerX + r * Math.cos(theta);
    const py = centerY + r * Math.sin(theta);
    const explosiveForce = (Math.random() * 0.15 + 0.05) * forceBase;
    const vx = (px - centerX) * explosiveForce;
    const vy = (py - centerY) * explosiveForce;
    const radius =
      settings.dropletMinSize +
      Math.random() * (settings.dropletMaxSize - settings.dropletMinSize);

    particles.push({
      x: px,
      y: py,
      vx,
      vy,
      radius,
      alpha: 1,
      decay:
        (settings.evaporateMin +
          Math.random() * (settings.evaporateMax - settings.evaporateMin)) *
        settings.popSpeed,
    });
  }

  return particles;
}

function stepPopParticles(
  particles: PopParticle[],
  settings: AboutPopSettings,
  stepMs: number,
  width: number,
  height: number,
) {
  const scale = (stepMs / 16.67) * settings.popSpeed;
  let alive = 0;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!;
    if (p.alpha <= 0) continue;

    p.vy += settings.gravity * scale;
    const drag = Math.pow(settings.drag, scale);
    p.vx *= drag;
    p.vy *= drag;
    p.x += p.vx * scale;
    p.y += p.vy * scale;
    p.alpha -= p.decay * scale;

    if (
      p.alpha > 0 &&
      p.y > -40 &&
      p.y < height + 40 &&
      p.x > -40 &&
      p.x < width + 40
    ) {
      alive++;
    }
  }

  return alive;
}

export function updatePopParticles(
  particles: PopParticle[],
  settings: AboutPopSettings,
  dtMs: number,
  width: number,
  height: number,
) {
  let remaining = Math.min(48, Math.max(0, dtMs));
  let alive = 0;

  while (remaining > 0.25) {
    const step = Math.min(remaining, PHYSICS_STEP_MS);
    remaining -= step;
    alive = stepPopParticles(particles, settings, step, width, height);
  }

  return alive;
}

/** Droplet tuned for #E7E7E7 — grey fill, dark grey rim, white specular. */
export function drawPopParticle(
  ctx: CanvasRenderingContext2D,
  p: PopParticle,
  settings: AboutPopSettings,
) {
  if (p.alpha <= 0) return;

  const a = p.alpha * settings.opacity;
  const r = p.radius;

  ctx.globalAlpha = a;

  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(168, 172, 178, 0.78)";
  ctx.fill();

  ctx.lineWidth = Math.max(0.65, r * 0.28);
  ctx.strokeStyle = "rgba(88, 92, 100, 0.9)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    p.x - r * 0.34,
    p.y - r * 0.38,
    Math.max(0.35, r * 0.28),
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fill();

  ctx.globalAlpha = 1;
}

export function drawPopParticles(
  ctx: CanvasRenderingContext2D,
  particles: PopParticle[],
  settings: AboutPopSettings,
) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!;
    if (p.alpha > 0) drawPopParticle(ctx, p, settings);
  }
}

export function getRingDurationMs(settings: AboutPopSettings) {
  return RING_DURATION_MS / Math.max(0.5, settings.popSpeed);
}

export function isPopSafetyTimeout(elapsedMs: number) {
  return elapsedMs > MAX_POP_SAFETY_MS;
}

export function isPopFinished(
  particles: PopParticle[],
  elapsedMs: number,
  settings: AboutPopSettings,
) {
  if (isPopSafetyTimeout(elapsedMs)) return true;
  const ringDone =
    !settings.ringEnabled || elapsedMs >= getRingDurationMs(settings);
  if (!ringDone) return false;

  for (let i = 0; i < particles.length; i++) {
    if (particles[i]!.alpha > 0) return false;
  }
  return true;
}

export function simulateAndDrawBurst(
  ctx: CanvasRenderingContext2D,
  particles: PopParticle[],
  settings: AboutPopSettings,
  dtMs: number,
  width: number,
  height: number,
) {
  const alive = updatePopParticles(particles, settings, dtMs, width, height);
  drawPopParticles(ctx, particles, settings);
  return alive;
}
