/** Zero-G metaball blobs — motion constrained to the XY plane (z = 0). */

export const MAX_BLOBS = 8;
const PLANE_Z = 0;

function rand(a, b) {
  return a + Math.random() * (b - a);
}

export function createBlobs(count = 6) {
  const n = Math.min(Math.max(2, count), MAX_BLOBS);
  const blobs = [];
  for (let i = 0; i < n; i++) {
    const radius = rand(0.32, 0.52);
    blobs.push({
      pos: [rand(-1.4, 1.4), rand(-1.0, 1.0), PLANE_Z],
      vel: [rand(-0.4, 0.4), rand(-0.35, 0.35), 0],
      radius,
    });
  }
  return blobs;
}

export function updateBlobs(blobs, dt, { bounds = 2.0, damping = 0.999 } = {}) {
  const n = blobs.length;

  for (const b of blobs) {
    b.pos[0] += b.vel[0] * dt;
    b.pos[1] += b.vel[1] * dt;
    b.pos[2] = PLANE_Z;
    b.vel[2] = 0;

    for (let axis = 0; axis < 2; axis++) {
      const lim = bounds - b.radius * 0.5;
      if (b.pos[axis] > lim) {
        b.pos[axis] = lim;
        b.vel[axis] *= -1;
      } else if (b.pos[axis] < -lim) {
        b.pos[axis] = -lim;
        b.vel[axis] *= -1;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = blobs[i];
      const b = blobs[j];
      const dx = b.pos[0] - a.pos[0];
      const dy = b.pos[1] - a.pos[1];
      const dist = Math.hypot(dx, dy) || 0.001;
      const minD = (a.radius + b.radius) * 0.85;
      if (dist < minD) {
        const push = ((minD - dist) / dist) * 0.35;
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
}

export function packBlobs(blobs, out = null) {
  const data = out ?? new Float32Array(MAX_BLOBS * 4);
  for (let i = 0; i < MAX_BLOBS; i++) {
    const b = blobs[i];
    if (b) {
      data[i * 4] = b.pos[0];
      data[i * 4 + 1] = b.pos[1];
      data[i * 4 + 2] = b.pos[2];
      data[i * 4 + 3] = b.radius;
    } else {
      data[i * 4 + 3] = 0;
    }
  }
  return data;
}
