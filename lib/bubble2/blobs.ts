/** Metaball blobs in the XY plane (from bubble2). */

import { getHeroCursor, type HeroCursor } from "@/lib/bubble2/hero-cursor";

export const MAX_BLOBS = 15;

/** Per-blob radius = base × uniform(scaleMin..scaleMax) */
export const BLOB_RADIUS_SCALE_MIN = 0.55;
export const BLOB_RADIUS_SCALE_MAX = 1.02;

/** Only bubbles within this distance (plus radius) feel the cursor */
const CURSOR_REPEL_RADIUS = 0.82;
const CURSOR_REPEL_STRENGTH = 11.5;
const CURSOR_REPEL_MOVE_BOOST = 0.42;
const CURSOR_MAX_SPEED = 1.85;
const AMBIENT_FORCE = 1.75;
const MIN_DRIFT_SPEED = 0.34;
const MAX_DRIFT_SPEED = 1.25;
const PLANE_Z = 0;

/** How much of the radius counts toward the wall contact line */
const WALL_CONTACT_INSET = 0.38;
/** Soft contact zone thickness (metaball units) — spring engages before hard limit */
const WALL_SOFT_BASE = 0.1;
const WALL_SOFT_PER_RADIUS = 0.24;
const WALL_STIFFNESS = 48;
const WALL_DAMPING = 6.2;
const WALL_RESTITUTION = 0.84;
/** How much penetration is absorbed into position (squash) vs snap */
const WALL_SQUASH = 0.38;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function randomBlobRadius(baseRadius: number) {
  const t = Math.pow(Math.random(), 1.2);
  const scale =
    BLOB_RADIUS_SCALE_MIN +
    t * (BLOB_RADIUS_SCALE_MAX - BLOB_RADIUS_SCALE_MIN);
  return baseRadius * scale;
}

export type MetaballBlob = {
  pos: [number, number, number];
  vel: [number, number, number];
  radius: number;
  /** Per-blob phase for ambient drift */
  phase: number;
};

export function createHeroBlob(radius = 0.5, y = 0.06): MetaballBlob[] {
  return [
    {
      pos: [0, y, PLANE_Z],
      vel: [0, 0, 0],
      radius,
      phase: rand(0, Math.PI * 2),
    },
  ];
}

/** Single blob with initial velocity (bubble2 zero-G drift on XY plane). */
export function createDriftingHeroBlob(radius = 0.52, y = 0.06): MetaballBlob[] {
  const angle = rand(0, Math.PI * 2);
  const speed = rand(MIN_DRIFT_SPEED, MAX_DRIFT_SPEED * 0.7);
  return [
    {
      pos: [0, y, PLANE_Z],
      vel: [Math.cos(angle) * speed, Math.sin(angle) * speed, 0],
      radius,
      phase: rand(0, Math.PI * 2),
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
      phase: rand(0, Math.PI * 2),
    });
  }
  return blobs;
}

/**
 * Spread blobs across the full hero frame (uniform XY + outward drift).
 */
export function createSpreadBlobs(
  count = 8,
  frameBounds?: BlobBounds,
  baseRadius = 0.38,
): MetaballBlob[] {
  const n = Math.min(Math.max(2, count), MAX_BLOBS);
  const blobs: MetaballBlob[] = [];
  const boundsX = frameBounds?.boundsX ?? 1.35;
  const boundsY = frameBounds?.boundsY ?? 0.88;
  const spreadX = boundsX * 0.98;
  const spreadY = boundsY * 0.98;

  for (let i = 0; i < n; i++) {
    const angle = rand(0, Math.PI * 2);
    const radial = 0.45 + Math.random() * 0.55;
    const x = Math.cos(angle) * spreadX * radial;
    const y = Math.sin(angle) * spreadY * radial;
    const len = Math.hypot(x, y) || 1;
    const nx = x / len;
    const ny = y / len;
    const speed = rand(0.55, 1.05);
    const swirl = rand(-0.28, 0.28);
    blobs.push({
      pos: [x, y, PLANE_Z],
      vel: [
        nx * speed - ny * swirl + rand(-0.14, 0.14),
        ny * speed + nx * swirl + rand(-0.12, 0.12),
        0,
      ],
      radius: randomBlobRadius(baseRadius),
      phase: rand(0, Math.PI * 2),
    });
  }

  return blobs;
}

export type BlobBounds = {
  boundsX: number;
  boundsY: number;
};

function wallLimit(bounds: number, radius: number) {
  return bounds - radius * WALL_CONTACT_INSET;
}

function wallSoftDepth(radius: number) {
  return WALL_SOFT_BASE + radius * WALL_SOFT_PER_RADIUS;
}

/** Spring + damping toward frame edges (soft-body wall feel). */
function applySoftWallForces(
  b: MetaballBlob,
  boundsX: number,
  boundsY: number,
  dt: number,
) {
  const limX = wallLimit(boundsX, b.radius);
  const limY = wallLimit(boundsY, b.radius);
  const soft = wallSoftDepth(b.radius);
  const k = WALL_STIFFNESS;
  const damp = WALL_DAMPING;

  const gapRight = limX - b.pos[0];
  if (gapRight < soft) {
    const pen = soft - gapRight;
    b.vel[0] -= (k * pen + damp * Math.max(0, b.vel[0])) * dt;
  }

  const gapLeft = b.pos[0] + limX;
  if (gapLeft < soft) {
    const pen = soft - gapLeft;
    b.vel[0] += (k * pen - damp * Math.min(0, b.vel[0])) * dt;
  }

  const gapTop = limY - b.pos[1];
  if (gapTop < soft) {
    const pen = soft - gapTop;
    b.vel[1] -= (k * pen + damp * Math.max(0, b.vel[1])) * dt;
  }

  const gapBottom = b.pos[1] + limY;
  if (gapBottom < soft) {
    const pen = soft - gapBottom;
    b.vel[1] += (k * pen - damp * Math.min(0, b.vel[1])) * dt;
  }
}

/** Resolve penetration with squash + damped rebound (walls only). */
function resolveSoftWallContact(
  b: MetaballBlob,
  boundsX: number,
  boundsY: number,
) {
  const limX = wallLimit(boundsX, b.radius);
  const limY = wallLimit(boundsY, b.radius);
  const soft = wallSoftDepth(b.radius);

  if (b.pos[0] > limX) {
    const pen = b.pos[0] - limX;
    b.pos[0] = limX + pen * (1 - WALL_SQUASH);
    if (b.vel[0] > 0) {
      const t = Math.min(1, pen / soft);
      b.vel[0] = -b.vel[0] * WALL_RESTITUTION * (1 - t * 0.35);
    }
  } else if (b.pos[0] < -limX) {
    const pen = -limX - b.pos[0];
    b.pos[0] = -limX - pen * (1 - WALL_SQUASH);
    if (b.vel[0] < 0) {
      const t = Math.min(1, pen / soft);
      b.vel[0] = -b.vel[0] * WALL_RESTITUTION * (1 - t * 0.35);
    }
  }

  if (b.pos[1] > limY) {
    const pen = b.pos[1] - limY;
    b.pos[1] = limY + pen * (1 - WALL_SQUASH);
    if (b.vel[1] > 0) {
      const t = Math.min(1, pen / soft);
      b.vel[1] = -b.vel[1] * WALL_RESTITUTION * (1 - t * 0.35);
    }
  } else if (b.pos[1] < -limY) {
    const pen = -limY - b.pos[1];
    b.pos[1] = -limY - pen * (1 - WALL_SQUASH);
    if (b.vel[1] < 0) {
      const t = Math.min(1, pen / soft);
      b.vel[1] = -b.vel[1] * WALL_RESTITUTION * (1 - t * 0.35);
    }
  }
}

/** Gentle perpetual motion — independent of cursor. */
function applyAmbientDrift(
  blobs: MetaballBlob[],
  dt: number,
  simTime: number,
) {
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    const p = b.phase;
    const ax =
      Math.sin(simTime * 0.85 + p) * AMBIENT_FORCE +
      Math.cos(simTime * 0.52 + i * 1.17) * (AMBIENT_FORCE * 0.55);
    const ay =
      Math.cos(simTime * 0.78 + p * 1.31) * AMBIENT_FORCE +
      Math.sin(simTime * 0.61 + i * 0.93) * (AMBIENT_FORCE * 0.55);
    b.vel[0] += ax * dt;
    b.vel[1] += ay * dt;
  }
}

/** Localized cursor push — only bubbles near the pointer. */
function applyCursorRepulsion(
  blobs: MetaballBlob[],
  dt: number,
  cursor: HeroCursor,
) {
  if (!cursor.active) return;

  const moveBoost =
    1 + Math.min(2.5, cursor.speed * CURSOR_REPEL_MOVE_BOOST);

  for (const b of blobs) {
    const dx = b.pos[0] - cursor.x;
    const dy = b.pos[1] - cursor.y;
    const distSq = dx * dx + dy * dy;
    const influence = CURSOR_REPEL_RADIUS + b.radius * 0.68;
    const maxSq = influence * influence;
    if (distSq >= maxSq || distSq < 1e-8) continue;

    const dist = Math.sqrt(distSq);
    const t = 1 - dist / influence;
    const force = CURSOR_REPEL_STRENGTH * t * t * moveBoost;
    b.vel[0] += (dx / dist) * force * dt;
    b.vel[1] += (dy / dist) * force * dt;

    if (t > 0.55) {
      const kick = force * dt * 0.35;
      b.pos[0] += (dx / dist) * kick;
      b.pos[1] += (dy / dist) * kick;
    }
  }
}

function maintainDriftSpeed(
  blobs: MetaballBlob[],
  simTime: number,
  cursor: HeroCursor,
) {
  const maxSpeed = cursor.active ? CURSOR_MAX_SPEED : MAX_DRIFT_SPEED;
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]!;
    let vx = b.vel[0];
    let vy = b.vel[1];
    let speed = Math.hypot(vx, vy);

    if (speed < MIN_DRIFT_SPEED) {
      const angle = b.phase + simTime * 0.35 + i * 0.61;
      vx = Math.cos(angle) * MIN_DRIFT_SPEED;
      vy = Math.sin(angle) * MIN_DRIFT_SPEED;
      speed = MIN_DRIFT_SPEED;
    }

    if (speed > maxSpeed) {
      const s = maxSpeed / speed;
      vx *= s;
      vy *= s;
    }

    b.vel[0] = vx;
    b.vel[1] = vy;
  }
}

export function clampBlobsToBounds(
  blobs: MetaballBlob[],
  { boundsX, boundsY }: BlobBounds,
) {
  for (const b of blobs) {
    resolveSoftWallContact(b, boundsX, boundsY);
    b.pos[2] = PLANE_Z;
  }
}

export function updateBlobs(
  blobs: MetaballBlob[],
  dt: number,
  {
    boundsX,
    boundsY,
    damping = 0.994,
    cursor = getHeroCursor(),
    simTime = 0,
  } = { boundsX: 1.35, boundsY: 0.88 },
) {
  const n = blobs.length;

  applyAmbientDrift(blobs, dt, simTime);
  applyCursorRepulsion(blobs, dt, cursor);

  for (const b of blobs) {
    applySoftWallForces(b, boundsX, boundsY, dt);
    b.pos[0] += b.vel[0] * dt;
    b.pos[1] += b.vel[1] * dt;
    b.pos[2] = PLANE_Z;
    b.vel[2] = 0;
    resolveSoftWallContact(b, boundsX, boundsY);
  }

  applyCursorRepulsion(blobs, dt * 0.65, cursor);

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = blobs[i]!;
      const b = blobs[j]!;
      const dx = b.pos[0] - a.pos[0];
      const dy = b.pos[1] - a.pos[1];
      const dist = Math.hypot(dx, dy) || 0.001;
      const minD = (a.radius + b.radius) * 0.85;
      if (dist < minD) {
        const push = ((minD - dist) / dist) * 0.62;
        a.vel[0] -= dx * push;
        a.vel[1] -= dy * push;
        b.vel[0] += dx * push;
        b.vel[1] += dy * push;
      }
    }
  }

  for (const b of blobs) {
    b.vel[0] *= damping;
    b.vel[1] *= damping;
    b.vel[2] = 0;
  }

  maintainDriftSpeed(blobs, simTime, cursor);
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
