import Matter from "matter-js";

export type CursorPushState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
};

export const SKILLS_PILL_CURSOR_RADIUS_PX = 100;

const MOVE_FORCE_SCALE = 0.000038;
const REPEL_FORCE_SCALE = 0.00009;
const MIN_MOVE_SPEED = 1.4;
const MAX_MOVE_SPEED = 18;
/** Damp raw pointer delta so fast flicks don’t launch pills. */
const POINTER_VELOCITY_SMOOTH = 0.22;

export function createCursorPushState(): CursorPushState {
  return { x: 0, y: 0, vx: 0, vy: 0, active: false };
}

export function updateCursorPushState(
  state: CursorPushState,
  x: number,
  y: number,
  active: boolean,
) {
  const rawVx = x - state.x;
  const rawVy = y - state.y;
  const blend = POINTER_VELOCITY_SMOOTH;
  state.vx = state.vx * (1 - blend) + rawVx * blend;
  state.vy = state.vy * (1 - blend) + rawVy * blend;
  state.x = x;
  state.y = y;
  state.active = active;
}

export function applyCursorPushToBodies(
  bodies: Matter.Body[],
  cursor: CursorPushState,
  options?: { disabled?: boolean },
) {
  if (options?.disabled || !cursor.active) return;

  const speed = Math.hypot(cursor.vx, cursor.vy);
  const moving = speed > MIN_MOVE_SPEED;
  const moveFactor = moving
    ? MOVE_FORCE_SCALE * Math.min(speed, MAX_MOVE_SPEED)
    : 0;
  const radius = SKILLS_PILL_CURSOR_RADIUS_PX;
  const radiusSq = radius * radius;

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i]!;
    if (body.isStatic) continue;

    const dx = body.position.x - cursor.x;
    const dy = body.position.y - cursor.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > radiusSq || distSq < 16) continue;

    const dist = Math.sqrt(distSq);
    const falloff = 1 - dist / radius;
    const strength = falloff * falloff * falloff;
    const nx = dx / dist;
    const ny = dy / dist;

    let fx = nx * REPEL_FORCE_SCALE * strength;
    let fy = ny * REPEL_FORCE_SCALE * strength;

    if (moving) {
      fx += cursor.vx * moveFactor * strength;
      fy += cursor.vy * moveFactor * strength;
    }

    Matter.Body.applyForce(body, body.position, {
      x: fx * body.mass,
      y: fy * body.mass,
    });

    if (moving || strength > 0.35) {
      Matter.Sleeping.set(body, false);
    }
  }
}
