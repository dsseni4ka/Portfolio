/** Metaball blobs in the XY plane (from bubble2). */

import { getHeroCursor, type HeroCursor } from "@/lib/bubble2/hero-cursor";

export const MAX_BLOBS = 10;

/** Per-blob radius = base × scale in [0.5, 2.0] (−50% … +100%). */
export const BLOB_RADIUS_SCALE_MIN = 0.5;
export const BLOB_RADIUS_SCALE_MAX = 1.6;

const CURSOR_REPEL_RADIUS = 0.72;
const CURSOR_REPEL_STRENGTH = 2.4;
const PLANE_Z = 0;

/** Low-pass on velocity changes (higher = snappier, lower = smoother). */
const VEL_SMOOTH_RATE = 6.5;

let prevVelXY: Float32Array | null = null;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

/** Normalized distance from frame center below this → respawn away from center. */
const CENTER_SPAWN_EXCLUSION = 0.7;

function randomPositionAwayFromCenter(limX: number, limY: number): [number, number] {
  for (let attempt = 0; attempt < 24; attempt++) {
    const x = rand(-limX, limX);
    const y = rand(-limY, limY);
    if (Math.hypot(x / limX, y / limY) >= CENTER_SPAWN_EXCLUSION) {
      return [x, y];
    }
  }

  const theta = rand(0, Math.PI * 2);
  const ring = CENTER_SPAWN_EXCLUSION + rand(0.08, 0.92);
  return [Math.cos(theta) * ring * limX, Math.sin(theta) * ring * limY];
}

function spreadLimits(
  frameBounds: BlobBounds | undefined,
  baseRadius: number,
): { limX: number; limY: number } {
  const boundsX = frameBounds?.boundsX ?? 1.35;
  const boundsY = frameBounds?.boundsY ?? 0.88;
  const spreadX = boundsX * 0.98;
  const spreadY = boundsY * 0.98;
  const maxRadius = baseRadius * BLOB_RADIUS_SCALE_MAX;
  const inset = maxRadius * 0.9;
  return {
    limX: Math.max(spreadX - inset, spreadX * 0.55),
    limY: Math.max(spreadY - inset, spreadY * 0.55),
  };
}

function randomBlobRadius(baseRadius: number) {
  const scale = rand(BLOB_RADIUS_SCALE_MIN, BLOB_RADIUS_SCALE_MAX);
  return baseRadius * scale;
}

export type MetaballBlob = {
  pos: [number, number, number];
  vel: [number, number, number];
  radius: number;
  /** Per-blob phase for smooth ambient wander */
  driftPhase: number;
};

export function createHeroBlob(
  radius = 0.5,
  frameBounds?: BlobBounds,
): MetaballBlob[] {
  const { limX, limY } = spreadLimits(frameBounds, radius);
  const [x, y] = randomPositionAwayFromCenter(limX, limY);
  return [
    {
      pos: [x, y, PLANE_Z],
      vel: [0, 0, 0],
      radius,
      driftPhase: rand(0, Math.PI * 2),
    },
  ];
}

/** Single blob with initial velocity (bubble2 zero-G drift on XY plane). */
export function createDriftingHeroBlob(
  radius = 0.52,
  frameBounds?: BlobBounds,
): MetaballBlob[] {
  const { limX, limY } = spreadLimits(frameBounds, radius);
  const [x, y] = randomPositionAwayFromCenter(limX, limY);
  const len = Math.hypot(x, y) || 1;
  return [
    {
      pos: [x, y, PLANE_Z],
      vel: [
        (x / len) * rand(0.08, 0.14) + rand(-0.04, 0.04),
        (y / len) * rand(0.08, 0.14) + rand(-0.035, 0.035),
        0,
      ],
      radius: randomBlobRadius(radius),
      driftPhase: rand(0, Math.PI * 2),
    },
  ];
}

/** Random blobs (original bubble2 layout). */
export function createBlobs(count = 6, frameBounds?: BlobBounds): MetaballBlob[] {
  const n = Math.min(Math.max(2, count), MAX_BLOBS);
  const { limX, limY } = spreadLimits(frameBounds, 0.52);
  const blobs: MetaballBlob[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y] = randomPositionAwayFromCenter(limX, limY);
    blobs.push({
      pos: [x, y, PLANE_Z],
      vel: [rand(-0.14, 0.14), rand(-0.12, 0.12), 0],
      radius: rand(0.32, 0.52),
      driftPhase: rand(0, Math.PI * 2),
    });
  }
  return blobs;
}

/**
 * Spread blobs across the full hero frame (uniform XY in motion-layer bounds).
 */
export function createSpreadBlobs(
  count = 6,
  frameBounds?: BlobBounds,
  baseRadius = 0.62,
): MetaballBlob[] {
  const n = Math.min(Math.max(2, count), MAX_BLOBS);
  const blobs: MetaballBlob[] = [];
  const { limX, limY } = spreadLimits(frameBounds, baseRadius);

  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;

    if (i < 4 && n >= 4) {
      const qx = i % 2 === 0 ? -1 : 1;
      const qy = i < 2 ? -1 : 1;
      x = qx * limX * rand(0.72, 1);
      y = qy * limY * rand(0.72, 1);
    } else {
      [x, y] = randomPositionAwayFromCenter(limX, limY);
    }

    const len = Math.hypot(x, y) || 1;
    const nx = x / len;
    const ny = y / len;
    const speed = rand(0.14, 0.32);
    const swirl = rand(-0.08, 0.08);
    blobs.push({
      pos: [x, y, PLANE_Z],
      vel: [
        nx * speed - ny * swirl + rand(-0.04, 0.04),
        ny * speed + nx * swirl + rand(-0.035, 0.035),
        0,
      ],
      radius: randomBlobRadius(baseRadius),
      driftPhase: rand(0, Math.PI * 2),
    });
  }

  return blobs;
}

export type BlobBounds = {
  boundsX: number;
  boundsY: number;
};

const MIN_DRIFT_SPEED = 0.1;
const MAX_DRIFT_SPEED = 0.42;
const WANDER_ACCEL = 0.16;
const WANDER_PHASE_SPEED = 0.24;
const MIN_SPEED_BLEND = 4.5;

/** Keeps zero-G drift alive without cursor input. */
function applyAmbientDrift(
  blobs: MetaballBlob[],
  dt: number,
  time: number,
) {
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const phase = b.driftPhase + time * (WANDER_PHASE_SPEED + i * 0.035);
    b.vel[0] += Math.cos(phase) * WANDER_ACCEL * dt;
    b.vel[1] += Math.sin(phase * 1.17) * WANDER_ACCEL * dt;

    const speed = Math.hypot(b.vel[0], b.vel[1]);
    if (speed < MIN_DRIFT_SPEED) {
      const heading =
        speed > 1e-5
          ? Math.atan2(b.vel[1], b.vel[0])
          : b.driftPhase;
      const target = MIN_DRIFT_SPEED + (i % 3) * 0.012;
      const blend = Math.min(1, MIN_SPEED_BLEND * dt);
      const tx = Math.cos(heading) * target;
      const ty = Math.sin(heading) * target;
      b.vel[0] += (tx - b.vel[0]) * blend;
      b.vel[1] += (ty - b.vel[1]) * blend;
    } else if (speed > MAX_DRIFT_SPEED) {
      const scale = MAX_DRIFT_SPEED / speed;
      b.vel[0] *= scale;
      b.vel[1] *= scale;
    }
  }
}
function applyCursorRepulsion(
  blobs: MetaballBlob[],
  dt: number,
  cursor: HeroCursor,
) {
  if (!cursor.active) return;

  for (const b of blobs) {
    const dx = b.pos[0] - cursor.x;
    const dy = b.pos[1] - cursor.y;
    const distSq = dx * dx + dy * dy;
    const influence = CURSOR_REPEL_RADIUS + b.radius * 0.55;
    const maxSq = influence * influence;
    if (distSq >= maxSq || distSq < 1e-8) continue;

    const dist = Math.sqrt(distSq);
    const t = 1 - dist / influence;
    const force = CURSOR_REPEL_STRENGTH * t * t;
    b.vel[0] += (dx / dist) * force * dt;
    b.vel[1] += (dy / dist) * force * dt;
  }
}

/** How much radius counts toward the viewport edge (lower = bounce nearer browser edge). */
const WALL_SURFACE_INSET = 0.48;
/** Soft rebound — lower restitution = smoother wall hits */
const BUBBLE_WALL_RESTITUTION = 0.62;
const BUBBLE_WALL_SQUASH = 0.06;
const BUBBLE_WALL_MAX_SQUASH = 0.012;

function blobWallLimit(bounds: number, radius: number) {
  return Math.max(bounds - radius * WALL_SURFACE_INSET, radius * 0.35);
}

/** Reflect velocity off frame edges with a brief squash on contact. */
function resolveBubbleWallBounce(
  b: MetaballBlob,
  axis: 0 | 1,
  limit: number,
) {
  const pos = b.pos[axis];
  let vel = b.vel[axis];

  if (pos > limit) {
    const pen = pos - limit;
    b.pos[axis] = limit - Math.min(pen * BUBBLE_WALL_SQUASH, BUBBLE_WALL_MAX_SQUASH);
    if (vel > 0) b.vel[axis] = -vel * BUBBLE_WALL_RESTITUTION;
  } else if (pos < -limit) {
    const pen = -limit - pos;
    b.pos[axis] = -limit + Math.min(pen * BUBBLE_WALL_SQUASH, BUBBLE_WALL_MAX_SQUASH);
    vel = b.vel[axis];
    if (vel < 0) b.vel[axis] = -vel * BUBBLE_WALL_RESTITUTION;
  }
}

function applyWallBounces(
  blobs: MetaballBlob[],
  boundsX: number,
  boundsY: number,
) {
  for (const b of blobs) {
    const limX = blobWallLimit(boundsX, b.radius);
    const limY = blobWallLimit(boundsY, b.radius);
    resolveBubbleWallBounce(b, 0, limX);
    resolveBubbleWallBounce(b, 1, limY);
    b.pos[2] = PLANE_Z;
    b.vel[2] = 0;
  }
}

function enforceWallLimits(
  blobs: MetaballBlob[],
  boundsX: number,
  boundsY: number,
) {
  for (const b of blobs) {
    const limX = blobWallLimit(boundsX, b.radius);
    const limY = blobWallLimit(boundsY, b.radius);
    if (b.pos[0] > limX) b.pos[0] = limX;
    if (b.pos[0] < -limX) b.pos[0] = -limX;
    if (b.pos[1] > limY) b.pos[1] = limY;
    if (b.pos[1] < -limY) b.pos[1] = -limY;
    b.pos[2] = PLANE_Z;
  }
}

export function clampBlobsToBounds(
  blobs: MetaballBlob[],
  { boundsX, boundsY }: BlobBounds,
) {
  enforceWallLimits(blobs, boundsX, boundsY);
}

export function resetBlobVelocitySmoothing() {
  prevVelXY = null;
}

/** Match smoothing buffer to current blob velocities (after respawn). */
export function syncBlobVelocitySmoothing(blobs: MetaballBlob[]) {
  const prev = ensurePrevVel();
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const o = i * 2;
    prev[o] = b.vel[0];
    prev[o + 1] = b.vel[1];
  }
}

function ensurePrevVel() {
  if (!prevVelXY || prevVelXY.length < MAX_BLOBS * 2) {
    prevVelXY = new Float32Array(MAX_BLOBS * 2);
  }
  return prevVelXY;
}

/** Exponential low-pass so velocity changes ease in frame to frame. */
function smoothVelocities(blobs: MetaballBlob[], dt: number) {
  const prev = ensurePrevVel();
  const k = 1 - Math.exp(-VEL_SMOOTH_RATE * dt);

  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const o = i * 2;
    const px = prev[o]!;
    const py = prev[o + 1]!;
    const vx = px + (b.vel[0] - px) * k;
    const vy = py + (b.vel[1] - py) * k;
    b.vel[0] = vx;
    b.vel[1] = vy;
    prev[o] = vx;
    prev[o + 1] = vy;
  }

  for (let i = blobs.length; i < MAX_BLOBS; i++) {
    const o = i * 2;
    prev[o] = 0;
    prev[o + 1] = 0;
  }
}

export type BlobUpdateOptions = BlobBounds & {
  damping?: number;
  cursor?: HeroCursor;
  time?: number;
};

export function updateBlobs(
  blobs: MetaballBlob[],
  dt: number,
  {
    boundsX,
    boundsY,
    damping = 0.994,
    cursor = getHeroCursor(),
    time = 0,
  }: BlobUpdateOptions = { boundsX: 1.35, boundsY: 0.88 },
) {
  applyAmbientDrift(blobs, dt, time);
  applyCursorRepulsion(blobs, dt, cursor);

  for (const b of blobs) {
    b.pos[0] += b.vel[0] * dt;
    b.pos[1] += b.vel[1] * dt;
    b.pos[2] = PLANE_Z;
    b.vel[2] = 0;
  }

  const n = blobs.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = blobs[i]!;
      const b = blobs[j]!;
      const dx = b.pos[0] - a.pos[0];
      const dy = b.pos[1] - a.pos[1];
      const dist = Math.hypot(dx, dy) || 0.001;
      const minD = (a.radius + b.radius) * 0.78;
      if (dist < minD) {
        const push = ((minD - dist) / dist) * 0.24;
        a.vel[0] -= dx * push;
        a.vel[1] -= dy * push;
        b.vel[0] += dx * push;
        b.vel[1] += dy * push;
      }
    }
  }

  applyWallBounces(blobs, boundsX, boundsY);
  enforceWallLimits(blobs, boundsX, boundsY);

  for (const b of blobs) {
    b.vel[0] *= damping;
    b.vel[1] *= damping;
    b.vel[2] = 0;
  }

  smoothVelocities(blobs, dt);
}

export function packBlobs(blobs: MetaballBlob[], out?: Float32Array) {
  const data = out ?? new Float32Array(MAX_BLOBS * 4);
  for (let i = 0; i < MAX_BLOBS; i++) {
    const b = blobs[i];
    if (b) {
      data[i * 4] = b.pos[0];
      data[i * 4 + 1] = b.pos[1];
      data[i * 4 + 2] = b.pos[2];
      data[i * 4 + 3] = b.radius;
    } else {
      data[i * 4] = 0;
      data[i * 4 + 1] = 0;
      data[i * 4 + 2] = 0;
      data[i * 4 + 3] = 0;
    }
  }
  return data;
}
