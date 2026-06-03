/** Map bubble2 XY metaball space → R3F hero coordinates. */

const SCALE_PER_RADIUS = 3.05;

export function metaballToScene(
  pos: [number, number, number],
  radius: number,
): { position: [number, number, number]; scale: number } {
  return {
    position: [pos[0] * 0.72, pos[1] * 0.72 + 0.02, pos[2]],
    scale: radius * SCALE_PER_RADIUS,
  };
}
