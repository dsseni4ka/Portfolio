/** Pointer position in metaball XY space (hero viewport). */

export type HeroCursor = {
  x: number;
  y: number;
  active: boolean;
  /** Metaball units per second (for motion-based repulsion) */
  vx: number;
  vy: number;
  speed: number;
};

let cursor: HeroCursor = {
  x: 0,
  y: 0,
  active: false,
  vx: 0,
  vy: 0,
  speed: 0,
};

let lastCursorSampleMs = 0;

export type HeroMotionRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Map pointer inside the hero bubble layer → metaball XY. */
export function setHeroCursorFromClient(
  clientX: number,
  clientY: number,
  boundsX: number,
  boundsY: number,
  rect?: HeroMotionRect | null,
) {
  const w =
    rect && rect.width > 0
      ? rect.width
      : typeof window !== "undefined"
        ? window.innerWidth
        : 1;
  const h =
    rect && rect.height > 0
      ? rect.height
      : typeof window !== "undefined"
        ? window.innerHeight
        : 1;
  const left = rect?.left ?? 0;
  const top = rect?.top ?? 0;

  const nx = ((clientX - left) / w) * 2 - 1;
  const ny = -(((clientY - top) / h) * 2 - 1);
  const x = nx * boundsX;
  const y = ny * boundsY;

  const now =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  let vx = 0;
  let vy = 0;
  if (lastCursorSampleMs > 0) {
    const dt = Math.min((now - lastCursorSampleMs) * 0.001, 0.05);
    if (dt > 1e-4) {
      vx = (x - cursor.x) / dt;
      vy = (y - cursor.y) / dt;
    }
  }
  lastCursorSampleMs = now;

  cursor = {
    x,
    y,
    active: true,
    vx,
    vy,
    speed: Math.hypot(vx, vy),
  };
}

export function clearHeroCursor() {
  cursor = {
    x: cursor.x,
    y: cursor.y,
    active: false,
    vx: 0,
    vy: 0,
    speed: 0,
  };
  lastCursorSampleMs = 0;
}

export function getHeroCursor(): HeroCursor {
  return cursor;
}
