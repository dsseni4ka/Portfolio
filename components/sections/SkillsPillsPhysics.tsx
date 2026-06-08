"use client";

import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  drawSkillsPills,
  preloadSkillsPillImages,
  type PillDrawItem,
} from "@/lib/skills-pills-canvas";
import {
  applyCursorPushToBodies,
  createCursorPushState,
  updateCursorPushState,
} from "@/lib/skills-pills-cursor-push";
import {
  createSkillsPillMouseDrag,
  isDraggingPill,
} from "@/lib/skills-pills-mouse-drag";
import {
  getPillDimensions,
  SKILLS_PILL_HEIGHT_PX,
  SKILLS_PILL_LABELS,
} from "@/lib/skills-pills-data";

const CANVAS_DPR = 1;
/** Start the drop once most of the skills section is on screen. */
const SKILLS_SECTION_VISIBLE_RATIO = 0.55;
const SPAWN_VERTICAL_GAP_PX = 28;
const SPAWN_INTERVAL_MS = 130;
const SIM_GRAVITY_Y = 1.08;
const MAX_FRAME_DT_MS = 33.33;

function isSkillsSectionInView(entry: IntersectionObserverEntry) {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= SKILLS_SECTION_VISIBLE_RATIO) return true;

  const vh = window.innerHeight || 1;
  const rect = entry.boundingClientRect;
  const visibleHeight =
    Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visibleHeight >= vh * SKILLS_SECTION_VISIBLE_RATIO;
}

type SkillsPillsPhysicsProps = {
  className?: string;
};

function buildPillDefs(measureCtx: CanvasRenderingContext2D) {
  return SKILLS_PILL_LABELS.map((pill, index) => {
    const { width, height } = getPillDimensions(pill.label, measureCtx);
    return {
      pill,
      widthPx: width,
      heightPx: height,
      id: index,
    };
  });
}

function spawnXForIndex(index: number, count: number, width: number, pillWidth: number) {
  const usable = Math.max(pillWidth, width - pillWidth);
  const t = (index + 1) / (count + 1);
  return pillWidth / 2 + t * usable + (Math.random() - 0.5) * 12;
}

function spawnYForIndex(index: number) {
  return -SKILLS_PILL_HEIGHT_PX - 32 - index * SPAWN_VERTICAL_GAP_PX;
}

function resizeCanvas(canvas: HTMLCanvasElement, root: HTMLElement) {
  const w = root.clientWidth;
  const h = root.clientHeight;
  if (w === 0 || h === 0) return null;
  const cw = Math.floor(w * CANVAS_DPR);
  const ch = Math.floor(h * CANVAS_DPR);
  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;
  ctx.setTransform(CANVAS_DPR, 0, 0, CANVAS_DPR, 0, 0);
  return { ctx, width: w, height: h };
}

export default function SkillsPillsPhysics({ className = "" }: SkillsPillsPhysicsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rafRef = useRef(0);
  const simReadyRef = useRef(false);
  const drawItemsRef = useRef<PillDrawItem[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const section = root.closest("section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (simReadyRef.current || !entry) return;
        if (!isSkillsSectionInView(entry)) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: [0, 0.25, 0.5, SKILLS_SECTION_VISIBLE_RATIO, 0.75, 1] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !rootRef.current || !canvasRef.current) return;

    const root = rootRef.current;
    const canvas = canvasRef.current;
    let disposed = false;

    const start = async () => {
      if (disposed || simReadyRef.current) return;

      const sized = resizeCanvas(canvas, root);
      if (!sized) return;

      const { ctx, width, height } = sized;
      await preloadSkillsPillImages();
      if (disposed) return;

      simReadyRef.current = true;
      const pills = buildPillDefs(ctx);

      const toDrawItem = (
        item: (typeof pills)[number],
        x: number,
        y: number,
        angle: number,
      ): PillDrawItem => ({
        label: item.pill.label,
        variant: item.pill.variant,
        widthPx: item.widthPx,
        heightPx: item.heightPx,
        x,
        y,
        angle,
      });

      if (reducedMotion) {
        drawItemsRef.current = pills.map((item, i) => {
          const cols = 3;
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cellW = width / cols;
          return toDrawItem(
            item,
            cellW * col + cellW * 0.5,
            height * 0.52 + row * (SKILLS_PILL_HEIGHT_PX + 20),
            0,
          );
        });
        ctx.clearRect(0, 0, width, height);
        drawSkillsPills(ctx, drawItemsRef.current);
        return;
      }

      const initial = pills.map((item, index) =>
        toDrawItem(
          item,
          spawnXForIndex(index, pills.length, width, item.widthPx),
          spawnYForIndex(index),
          0,
        ),
      );
      drawItemsRef.current = initial;

      const engine = Matter.Engine.create({ enableSleeping: true });
      engine.gravity.y = SIM_GRAVITY_Y;
      engine.positionIterations = 10;
      engine.velocityIterations = 6;
      engineRef.current = engine;

      const wallThickness = 120;
      const floor = Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2 - 6,
        width + wallThickness * 2,
        wallThickness,
        { isStatic: true, friction: 0.55, restitution: 0.22 },
      );
      const leftWall = Matter.Bodies.rectangle(
        -wallThickness / 2 + 16,
        height / 2,
        wallThickness,
        height * 3,
        { isStatic: true, friction: 0.15 },
      );
      const rightWall = Matter.Bodies.rectangle(
        width + wallThickness / 2 - 16,
        height / 2,
        wallThickness,
        height * 3,
        { isStatic: true, friction: 0.15 },
      );

      const bodyById = new Map<number, Matter.Body>();
      const spawnTimers: number[] = [];

      pills.forEach((item, index) => {
        const init = initial[index]!;
        const body = Matter.Bodies.rectangle(
          init.x,
          init.y,
          item.widthPx,
          item.heightPx,
          {
            chamfer: { radius: item.heightPx / 2 },
            restitution: 0.3,
            friction: 0.4,
            frictionAir: 0.02,
            density: 0.002,
            angle: 0,
          },
        );
        bodyById.set(item.id, body);
        spawnTimers.push(
          window.setTimeout(() => {
            if (disposed) return;
            Matter.Composite.add(engine.world, body);
            Matter.Sleeping.set(body, false);
          }, index * SPAWN_INTERVAL_MS),
        );
      });

      Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

      const pillBodies = pills.map((item) => bodyById.get(item.id)!);
      const mouseDrag = createSkillsPillMouseDrag(
        engine,
        canvas,
        pillBodies,
        CANVAS_DPR,
      );
      const { mouse, mouseConstraint } = mouseDrag;
      const cursor = createCursorPushState();
      let idleFrames = 0;
      let loopActive = true;
      let lastFrameMs = performance.now();

      const ensureLoop = () => {
        if (!loopActive && !disposed) {
          loopActive = true;
          idleFrames = 0;
          lastFrameMs = performance.now();
          rafRef.current = requestAnimationFrame(sync);
        }
      };

      const syncCursorFromMouse = (pointerActive: boolean) => {
        updateCursorPushState(
          cursor,
          mouse.position.x,
          mouse.position.y,
          pointerActive,
        );
      };

      const onPointerEnter = () => {
        syncCursorFromMouse(true);
        ensureLoop();
      };

      const onPointerLeave = () => {
        syncCursorFromMouse(false);
        cursor.vx = 0;
        cursor.vy = 0;
      };

      const wakeOnInteraction = () => ensureLoop();

      canvas.addEventListener("pointerenter", onPointerEnter);
      canvas.addEventListener("pointerleave", onPointerLeave);
      Matter.Events.on(mouseConstraint, "mousedown", wakeOnInteraction);
      Matter.Events.on(mouseConstraint, "startdrag", wakeOnInteraction);
      Matter.Events.on(mouseConstraint, "mouseup", wakeOnInteraction);

      const paint = () => {
        const drawList: PillDrawItem[] = pills.map((item) => {
          const body = bodyById.get(item.id)!;
          return toDrawItem(
            item,
            body.position.x,
            body.position.y,
            body.angle,
          );
        });
        drawItemsRef.current = drawList;
        ctx.clearRect(0, 0, width, height);
        drawSkillsPills(ctx, drawList);
      };

      const sync = (frameTime: number) => {
        if (disposed || !engineRef.current) return;

        const dragging = isDraggingPill(mouseConstraint);
        const pointerIn =
          mouse.position.x >= 0 &&
          mouse.position.x <= width &&
          mouse.position.y >= 0 &&
          mouse.position.y <= height;

        syncCursorFromMouse(pointerIn && !dragging);

        const dt = Math.min(
          MAX_FRAME_DT_MS,
          Math.max(8, frameTime - lastFrameMs),
        );
        lastFrameMs = frameTime;

        applyCursorPushToBodies(pillBodies, cursor, { disabled: dragging });
        Matter.Engine.update(engine, dt);
        paint();

        const allSleeping = pills.every((item) => {
          const body = bodyById.get(item.id);
          if (!body || !engine.world.bodies.includes(body)) return true;
          return body.isSleeping;
        });

        if (allSleeping && !cursor.active && !dragging) {
          idleFrames += 1;
          if (idleFrames > 90) {
            loopActive = false;
            return;
          }
        } else {
          idleFrames = 0;
        }

        rafRef.current = requestAnimationFrame(sync);
      };

      paint();
      rafRef.current = requestAnimationFrame((frameTime) => {
        lastFrameMs = frameTime;
        sync(frameTime);
      });

      const onResize = () => {
        const next = resizeCanvas(canvas, root);
        if (!next) return;
        const { width: w, height: h } = next;
        mouse.pixelRatio = CANVAS_DPR;
        Matter.Body.setPosition(floor, { x: w / 2, y: h + wallThickness / 2 - 6 });
        Matter.Body.setPosition(leftWall, { x: -wallThickness / 2 + 16, y: h / 2 });
        Matter.Body.setPosition(rightWall, {
          x: w + wallThickness / 2 - 16,
          y: h / 2,
        });
        paint();
      };

      window.addEventListener("resize", onResize);

      const removeInteraction = () => {
        canvas.removeEventListener("pointerenter", onPointerEnter);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        Matter.Events.off(mouseConstraint, "mousedown", wakeOnInteraction);
        Matter.Events.off(mouseConstraint, "startdrag", wakeOnInteraction);
        Matter.Events.off(mouseConstraint, "mouseup", wakeOnInteraction);
        mouseDrag.destroy();
      };

      return () => {
        window.removeEventListener("resize", onResize);
        removeInteraction();
        for (const timer of spawnTimers) window.clearTimeout(timer);
      };
    };

    let resizeCleanup: (() => void) | undefined;

    start().then((teardown) => {
      if (typeof teardown === "function") resizeCleanup = teardown;
    });

    const ro = new ResizeObserver(() => {
      if (!simReadyRef.current) start();
    });
    ro.observe(root);

    return () => {
      disposed = true;
      ro.disconnect();
      resizeCleanup?.();
      cancelAnimationFrame(rafRef.current);
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.World.clear(engineRef.current.world, false);
        engineRef.current = null;
      }
      simReadyRef.current = false;
    };
  }, [active, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 touch-pan-y overflow-hidden ${className}`}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-pan-y cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
