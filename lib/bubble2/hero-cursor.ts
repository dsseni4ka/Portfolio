/** Pointer position in metaball XY space (hero viewport). */

export type HeroCursor = {
  x: number;
  y: number;
  active: boolean;
};

let cursor: HeroCursor = { x: 0, y: 0, active: false };

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
  cursor = {
    x: nx * boundsX,
    y: ny * boundsY,
    active: true,
  };
}

export function clearHeroCursor() {
  cursor = { x: cursor.x, y: cursor.y, active: false };
}

export function getHeroCursor(): HeroCursor {
  return cursor;
}
