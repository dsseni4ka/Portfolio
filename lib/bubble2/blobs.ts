/** Metaball blobs in the XY plane (from bubble2). */

import type { HeroCursor } from "@/lib/bubble2/hero-cursor";

export const MAX_BLOBS = 16;
/** Extra tiny bubbles spawned in addition to main `rayBlobCount`. */
export const SMALL_BLOB_COUNT = 8;
const SMALL_BLOB_RADIUS_RATIO = 1 / 3;
const PLANE_Z = 0;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export type MetaballBlob = {
  pos: [number, number, number];
  vel: [number, number, number];
  radius: number;
};

export function createHeroBlob(radius = 0.5, y = 0.06): MetaballBlob[] {
  return [
    {
      pos: [0, y, PLANE_Z],
      vel: [0, 0, 0],
      radius,
    },
  ];
}

/** Single blob with initial velocity (bubble2 zero-G drift on XY plane). */
export function createDriftingHeroBlob(radius = 0.52, y = 0.06): MetaballBlob[] {
  return [
    {
      pos: [0, y, PLANE_Z],
      vel: [rand(-0.05, 0.05), rand(-0.04, 0.04), 0],
      radius,
    },
  ];
}

/** Random blobs (original bubble2 layout). */
export function createBlobs(count = 6): MetaballBlob[] {
  const n = Math.min(Math.max(2, count), MAX_BLOBS);
  const blobs: MetaballBlob[] = [];
  for (let i = 0; i < n; i++) {
    blobs.push({
      pos: [rand(-1.4, 1.4), rand(-1.0, 1.0), PLANE_Z],
      vel: [rand(-0.06, 0.06), rand(-0.05, 0.05), 0],
      radius: rand(0.32, 0.52),
    });
  }
  return blobs;
}

export function getTotalBlobCount(mainCount: number) {
  const main = Math.min(Math.max(2, mainCount), MAX_BLOBS - SMALL_BLOB_COUNT);
  return Math.min(main + SMALL_BLOB_COUNT, MAX_BLOBS);
}

function spawnSpreadBlob(
  angle: number,
  dist: number,
  radius: number,
  speed = 0.14,
): MetaballBlob {
  const nx = Math.cos(angle);
  const ny = Math.sin(angle) * 0.72;
  return {
    pos: [nx * dist, ny * dist, PLANE_Z],
    vel: [
      nx * speed + rand(-0.08, 0.08),
      ny * speed + rand(-0.07, 0.07),
      0,
    ],
    radius,
  };
}

/**
 * Main ring layout + 8 satellite bubbles at ⅓ radius.
 */
export function createSpreadBlobs(mainCount = 6, baseRadius = 0.32): MetaballBlob[] {
  const n = Math.min(Math.max(2, mainCount), MAX_BLOBS - SMALL_BLOB_COUNT);
  const blobs: MetaballBlob[] = [];
  const radiusScale = baseRadius / 0.32;

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + rand(-0.12, 0.12);
    const dist = rand(0.78, 1.12);
    const radius = rand(0.16, 0.24) * radiusScale;
    const tangent = angle + Math.PI / 2;
    const blob = spawnSpreadBlob(angle, dist, radius, rand(0.22, 0.32));
    blob.vel[0] += Math.cos(tangent) * 0.2;
    blob.vel[1] += Math.sin(tangent) * 0.2 * 0.72;
    blobs.push(blob);
  }

  for (let i = 0; i < SMALL_BLOB_COUNT; i++) {
    const angle = rand(0, Math.PI * 2);
    const dist = rand(0.65, 1.12);
    const mainRadius = rand(0.2, 0.3) * radiusScale;
    const blob = spawnSpreadBlob(
      angle,
      dist,
      mainRadius * SMALL_BLOB_RADIUS_RATIO,
      rand(0.18, 0.28),
    );
    blob.vel[0] += Math.cos(angle) * 0.14;
    blob.vel[1] += Math.sin(angle) * 0.14 * 0.72;
    blobs.push(blob);
  }

  enforceSpeedBand(blobs);

  return blobs;
}

export type BlobBounds = {
  boundsX: number;
  boundsY: number;
};

/** Push blob velocities away from the pointer (metaball XY). */
export function applyCursorRepulsion(
  blobs: MetaballBlob[],
  cursor: HeroCursor,
  dt: number,
  {
    radius = 0.75,
    strength = 5.2,
  }: { radius?: number; strength?: number } = {},
) {
  if (!cursor.active) return;

  for (const b of blobs) {
    const dx = b.pos[0] - cursor.x;
    const dy = b.pos[1] - cursor.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1e-5 || dist > radius + b.radius * 0.5) continue;

    const falloff = 1 - dist / (radius + b.radius * 0.5);
    const push = strength * falloff * falloff * dt;
    b.vel[0] += (dx / dist) * push;
    b.vel[1] += (dy / dist) * push;
  }
}

export function clampBlobsToBounds(
  blobs: MetaballBlob[],
  { boundsX, boundsY }: BlobBounds,
) {
  for (const b of blobs) {
    const limX = boundsX - b.radius * 0.45;
    const limY = boundsY - b.radius * 0.45;
    b.pos[0] = Math.max(-limX, Math.min(limX, b.pos[0]));
    b.pos[1] = Math.max(-limY, Math.min(limY, b.pos[1]));
    b.pos[2] = PLANE_Z;
  }
}

const MIN_SPEED = 0.3;
const MAX_SPEED = 0.68;
const CENTER_KEEP_OUT = 0.58;

/** Per-bubble wander so nothing settles and merges in the middle. */
function applyWanderForce(blobs: MetaballBlob[], dt: number, time: number) {
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const phase = i * 2.173 + b.radius * 4.2;
    b.vel[0] +=
      Math.cos(time * 1.35 + phase) * 0.72 * dt +
      Math.sin(time * 0.65 + phase * 0.7) * 0.28 * dt;
    b.vel[1] +=
      Math.sin(time * 1.18 + phase * 1.3) * 0.68 * dt +
      Math.cos(time * 0.8 + phase) * 0.24 * dt;
  }
}

/** Keep blobs from clustering on the logo / origin. */
function applyCenterRepulsion(blobs: MetaballBlob[], dt: number) {
  for (const b of blobs) {
    const d = Math.hypot(b.pos[0], b.pos[1]);
    if (d < CENTER_KEEP_OUT && d > 1e-4) {
      const push = ((CENTER_KEEP_OUT - d) / CENTER_KEEP_OUT) * 3.2 * dt;
      b.vel[0] += (b.pos[0] / d) * push;
      b.vel[1] += (b.pos[1] / d) * push;
    }
  }
}

/** Push away from the group centroid so the swarm stays spread out. */
function applyOutwardSpread(blobs: MetaballBlob[], dt: number) {
  const n = blobs.length;
  if (n < 2) return;

  let cx = 0;
  let cy = 0;
  for (const b of blobs) {
    cx += b.pos[0];
    cy += b.pos[1];
  }
  cx /= n;
  cy /= n;

  for (let i = 0; i < n; i++) {
    const b = blobs[i]!;
    let dx = b.pos[0] - cx;
    let dy = b.pos[1] - cy;
    let d = Math.hypot(dx, dy);
    if (d < 0.12) {
      const a = i * 2.399963;
      dx = Math.cos(a);
      dy = Math.sin(a);
      d = 1;
    }
    const spread = (0.45 + (1 - Math.min(d, 1))) * dt;
    b.vel[0] += (dx / d) * spread;
    b.vel[1] += (dy / d) * spread;
  }
}

/** Gentle push toward frame edges so bubbles use the full hero area. */
function applyEdgeRoaming(
  blobs: MetaballBlob[],
  { boundsX, boundsY }: BlobBounds,
  dt: number,
) {
  for (const b of blobs) {
    const limX = boundsX - b.radius * 0.5;
    const limY = boundsY - b.radius * 0.5;
    const nx = b.pos[0] / limX;
    const ny = b.pos[1] / limY;
    const edgePull = 0.22 * dt;
    if (Math.abs(nx) < 0.55) {
      b.vel[0] += (nx >= 0 ? 1 : -1) * edgePull;
    }
    if (Math.abs(ny) < 0.55) {
      b.vel[1] += (ny >= 0 ? 1 : -1) * edgePull;
    }
  }
}

function enforceSpeedBand(blobs: MetaballBlob[]) {
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    let sp = Math.hypot(b.vel[0], b.vel[1]);
    if (sp < MIN_SPEED) {
      const angle = i * 2.399 + b.pos[0] * 3.1 + b.pos[1] * 2.7;
      b.vel[0] = Math.cos(angle) * MIN_SPEED;
      b.vel[1] = Math.sin(angle) * MIN_SPEED;
    } else if (sp > MAX_SPEED) {
      const s = MAX_SPEED / sp;
      b.vel[0] *= s;
      b.vel[1] *= s;
    }
  }
}

function separateBlobs(blobs: MetaballBlob[], dt: number) {
  const n = blobs.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = blobs[i]!;
      const b = blobs[j]!;
      const dx = b.pos[0] - a.pos[0];
      const dy = b.pos[1] - a.pos[1];
      const dist = Math.hypot(dx, dy) || 0.001;
      const minD = (a.radius + b.radius) * 1.4;
      if (dist >= minD) continue;

      const overlap = minD - dist;
      const push = (overlap / dist) * (0.65 + 2.2 * dt);
      const nx = dx / dist;
      const ny = dy / dist;
      const sep = overlap * 0.35;

      a.vel[0] -= nx * push;
      a.vel[1] -= ny * push;
      b.vel[0] += nx * push;
      b.vel[1] += ny * push;
      a.pos[0] -= nx * sep * 0.5;
      a.pos[1] -= ny * sep * 0.5;
      b.pos[0] += nx * sep * 0.5;
      b.pos[1] += ny * sep * 0.5;
    }
  }
}

export function updateBlobs(
  blobs: MetaballBlob[],
  dt: number,
  { boundsX, boundsY }: BlobBounds,
  cursor?: HeroCursor,
  time = 0,
) {
  if (cursor) {
    applyCursorRepulsion(blobs, cursor, dt);
  }

  applyWanderForce(blobs, dt, time);
  applyCenterRepulsion(blobs, dt);
  applyOutwardSpread(blobs, dt);
  applyEdgeRoaming(blobs, { boundsX, boundsY }, dt);
  separateBlobs(blobs, dt);

  for (const b of blobs) {
    b.pos[0] += b.vel[0] * dt;
    b.pos[1] += b.vel[1] * dt;
    b.pos[2] = PLANE_Z;
    b.vel[2] = 0;

    const limX = boundsX - b.radius * 0.45;
    if (b.pos[0] > limX) {
      b.pos[0] = limX;
      b.vel[0] = -Math.max(Math.abs(b.vel[0]), MIN_SPEED) * 0.95;
    } else if (b.pos[0] < -limX) {
      b.pos[0] = -limX;
      b.vel[0] = Math.max(Math.abs(b.vel[0]), MIN_SPEED) * 0.95;
    }

    const limY = boundsY - b.radius * 0.45;
    if (b.pos[1] > limY) {
      b.pos[1] = limY;
      b.vel[1] = -Math.max(Math.abs(b.vel[1]), MIN_SPEED) * 0.95;
    } else if (b.pos[1] < -limY) {
      b.pos[1] = -limY;
      b.vel[1] = Math.max(Math.abs(b.vel[1]), MIN_SPEED) * 0.95;
    }
  }

  separateBlobs(blobs, dt);
  enforceSpeedBand(blobs);
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
