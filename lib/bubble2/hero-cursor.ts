/** Pointer position in metaball XY space (hero viewport). */

export type HeroCursor = {
  x: number;
  y: number;
  active: boolean;
};

let cursor: HeroCursor = { x: 0, y: 0, active: false };

function getBubbleLayerRect(): DOMRect | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector("[data-bubble-layer]");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return null;
  return r;
}

/** Map pointer client coords → metaball plane using the bubble layer rect. */
export function setHeroCursorFromClient(
  clientX: number,
  clientY: number,
  boundsX: number,
  boundsY: number,
) {
  const r = getBubbleLayerRect();
  if (!r) {
    cursor = { x: 0, y: 0, active: false };
    return;
  }

  const nx = ((clientX - r.left) / r.width) * 2 - 1;
  const ny = -(((clientY - r.top) / r.height) * 2 - 1);
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
