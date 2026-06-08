import Matter from "matter-js";

export type SkillsPillMouseDrag = {
  mouse: Matter.Mouse;
  mouseConstraint: Matter.MouseConstraint;
  destroy: () => void;
};

type MatterMouseApi = typeof Matter.Mouse & {
  _getRelativeMousePosition: (
    event: MouseEvent | TouchEvent,
    element: HTMLElement,
    pixelRatio: number,
  ) => { x: number; y: number };
  clearSource?: (target: Matter.Mouse) => void;
};

type MatterMouseRuntime = Matter.Mouse & {
  mousewheel: (event: WheelEvent) => void;
  mousemove: (event: MouseEvent) => void;
  mousedown: (event: MouseEvent) => void;
  mouseup: (event: MouseEvent) => void;
  mousedownPosition: { x: number; y: number };
  mouseupPosition: { x: number; y: number };
  sourceEvents: {
    mousemove: MouseEvent | null;
    mousedown: MouseEvent | null;
    mouseup: MouseEvent | null;
    mousewheel: WheelEvent | null;
  };
};

/** Matter.Mouse blocks wheel + touch scrolling on the canvas — patch it. */
function enableCanvasScrollWhileDragging(
  mouse: Matter.Mouse,
  canvas: HTMLCanvasElement,
  pillBodies: Matter.Body[],
) {
  const pillSet = new Set(pillBodies);
  const mouseApi = Matter.Mouse as MatterMouseApi;
  let touchDragging = false;

  const syncPosition = (event: MouseEvent | TouchEvent) => {
    const position = mouseApi._getRelativeMousePosition(
      event,
      canvas,
      mouse.pixelRatio,
    );
    mouse.absolute.x = position.x;
    mouse.absolute.y = position.y;
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
  };

  const hitsPill = (x: number, y: number) => {
    const hits = Matter.Query.point(pillBodies, { x, y });
    for (let i = 0; i < hits.length; i++) {
      if (pillSet.has(hits[i]!)) return true;
    }
    return false;
  };

  const mouseRuntime = mouse as MatterMouseRuntime;
  const asListener = (handler: unknown) => handler as EventListener;
  canvas.removeEventListener("wheel", asListener(mouseRuntime.mousewheel));
  canvas.removeEventListener("touchmove", asListener(mouseRuntime.mousemove));
  canvas.removeEventListener("touchstart", asListener(mouseRuntime.mousedown));
  canvas.removeEventListener("touchend", asListener(mouseRuntime.mouseup));

  const onTouchStart = (event: TouchEvent) => {
    syncPosition(event);
    touchDragging = hitsPill(mouse.position.x, mouse.position.y);
    if (touchDragging) {
      mouse.button = 0;
      mouseRuntime.mousedownPosition.x = mouse.position.x;
      mouseRuntime.mousedownPosition.y = mouse.position.y;
      mouseRuntime.sourceEvents.mousedown = event as unknown as MouseEvent;
      event.preventDefault();
    } else {
      mouse.button = -1;
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!touchDragging) return;
    syncPosition(event);
    mouseRuntime.sourceEvents.mousemove = event as unknown as MouseEvent;
    event.preventDefault();
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchDragging) {
      syncPosition(event);
      mouse.button = -1;
      mouseRuntime.mouseupPosition.x = mouse.position.x;
      mouseRuntime.mouseupPosition.y = mouse.position.y;
      mouseRuntime.sourceEvents.mouseup = event as unknown as MouseEvent;
      event.preventDefault();
    }
    touchDragging = false;
  };

  canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  canvas.addEventListener("touchend", onTouchEnd, { passive: false });
  canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });

  return () => {
    canvas.removeEventListener("touchstart", onTouchStart);
    canvas.removeEventListener("touchmove", onTouchMove);
    canvas.removeEventListener("touchend", onTouchEnd);
    canvas.removeEventListener("touchcancel", onTouchEnd);
  };
}

export function createSkillsPillMouseDrag(
  engine: Matter.Engine,
  canvas: HTMLCanvasElement,
  pillBodies: Matter.Body[],
  pixelRatio = 1,
): SkillsPillMouseDrag {
  const mouse = Matter.Mouse.create(canvas);
  mouse.pixelRatio = pixelRatio;

  const removeScrollPatch = enableCanvasScrollWhileDragging(
    mouse,
    canvas,
    pillBodies,
  );

  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.42,
      damping: 0.07,
      length: 0,
    },
  });

  const pillSet = new Set(pillBodies);

  const onStartDrag = (event: Matter.IEvent<Matter.MouseConstraint>) => {
    const body = event.source.body;
    if (body && !pillSet.has(body)) {
      (mouseConstraint as { body: Matter.Body | null }).body = null;
      return;
    }
    if (body) {
      Matter.Sleeping.set(body, false);
    }
  };

  Matter.Events.on(mouseConstraint, "startdrag", onStartDrag);
  Matter.Composite.add(engine.world, mouseConstraint);

  return {
    mouse,
    mouseConstraint,
    destroy: () => {
      Matter.Events.off(mouseConstraint, "startdrag", onStartDrag);
      Matter.Composite.remove(engine.world, mouseConstraint);
      removeScrollPatch();
      const mouseApi = Matter.Mouse as MatterMouseApi;
      mouseApi.clearSource?.(mouse);
    },
  };
}

export function isDraggingPill(
  mouseConstraint: Matter.MouseConstraint,
): boolean {
  return mouseConstraint.body != null;
}
