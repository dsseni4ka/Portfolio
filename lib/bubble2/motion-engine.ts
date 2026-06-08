"use client";

import { useSyncExternalStore } from "react";
import type { BubbleSettings } from "@/lib/bubble-settings";
import {
  getHeroBubbleBounds,
  getHeroMotionLayerAspect,
  getHeroViewportScale,
  type HeroBubbleBounds,
} from "@/lib/hero-bubble-bounds";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import {
  clampBlobsToBounds,
  createDriftingHeroBlob,
  createSpreadBlobs,
  MAX_BLOBS,
  packBlobs,
  resetBlobVelocitySmoothing,
  syncBlobVelocitySmoothing,
  updateBlobs,
  type MetaballBlob,
} from "@/lib/bubble2/blobs";

export type BubbleMotionSnapshot = {
  blobs: MetaballBlob[];
  blobData: Float32Array;
  revision: number;
};

let snapshot: BubbleMotionSnapshot | null = null;
let lastBlobConfigKey = "";
let lastBoundsKey = "";
let motionTime = 0;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function ensureSnapshot() {
  if (!snapshot) {
    const frameBounds = getHeroBubbleBounds(1, {
      layerAspect: getHeroMotionLayerAspect(),
    });
    const blobs = createSpreadBlobs(9, frameBounds);
    snapshot = {
      blobs,
      blobData: packBlobs(blobs),
      revision: 0,
    };
  }
  return snapshot;
}

function getSnapshot() {
  return ensureSnapshot();
}

function publish() {
  ensureSnapshot().revision += 1;
  listeners.forEach((listener) => listener());
}

function resolveBounds(
  settings: BubbleSettings,
  mobile: boolean,
): HeroBubbleBounds {
  const runtime = mapBubble2Runtime(settings, mobile);
  return getHeroBubbleBounds(runtime.bounds, {
    mobile,
    viewportScale: getHeroViewportScale(),
    layerAspect: getHeroMotionLayerAspect(),
  });
}

function boundsKey(bounds: HeroBubbleBounds) {
  return `${bounds.boundsX.toFixed(3)}:${bounds.boundsY.toFixed(3)}`;
}

function rebuildBlobs(settings: BubbleSettings, mobile: boolean) {
  const s = ensureSnapshot();
  const runtime = mapBubble2Runtime(settings, mobile);
  const count = runtime.blobCount;
  const frameBounds = resolveBounds(settings, mobile);

  if (count <= 1) {
    s.blobs = createDriftingHeroBlob(runtime.heroBlobRadius);
  } else {
    s.blobs = createSpreadBlobs(count, frameBounds, runtime.heroBlobRadius);
  }

  clampBlobsToBounds(s.blobs, frameBounds);
  syncBlobVelocitySmoothing(s.blobs);
  packBlobs(s.blobs, s.blobData);
  publish();
}

/** Clears cached blobs (e.g. after settings migration or layout change). */
export function resetBubbleMotion() {
  snapshot = null;
  lastBlobConfigKey = "";
  lastBoundsKey = "";
  motionTime = 0;
  resetBlobVelocitySmoothing();
}

export function syncBubbleMotion(
  settings: BubbleSettings,
  mobile: boolean,
) {
  const runtime = mapBubble2Runtime(settings, mobile);
  const frameBounds = resolveBounds(settings, mobile);
  const configKey = `${runtime.blobCount}:${runtime.heroBlobRadius}:${runtime.metaBlend}:${runtime.metaThreshold}`;
  const bKey = boundsKey(frameBounds);

  if (configKey !== lastBlobConfigKey) {
    lastBlobConfigKey = configKey;
    lastBoundsKey = bKey;
    rebuildBlobs(settings, mobile);
    return;
  }

  if (bKey !== lastBoundsKey) {
    lastBoundsKey = bKey;
    clampBlobsToBounds(ensureSnapshot().blobs, frameBounds);
    packBlobs(ensureSnapshot().blobs, ensureSnapshot().blobData);
    publish();
  }
}

export function tickBubbleMotion(
  dt: number,
  settings: BubbleSettings,
  mobile: boolean,
  reducedMotion: boolean,
) {
  syncBubbleMotion(settings, mobile);

  if (!settings.animationEnabled || reducedMotion) return;

  const runtime = mapBubble2Runtime(settings, mobile);
  const frameBounds = resolveBounds(settings, mobile);
  const s = ensureSnapshot();

  motionTime += dt;
  const stepDt = (dt * runtime.driftSpeed) / 2;
  updateBlobs(s.blobs, stepDt, { ...frameBounds, time: motionTime });
  updateBlobs(s.blobs, stepDt, { ...frameBounds, time: motionTime });
  packBlobs(s.blobs, s.blobData);
  publish();
}

export function getBubbleMotionSnapshot() {
  return ensureSnapshot();
}

export function getBubbleMotionBlobData() {
  return ensureSnapshot().blobData;
}

export function useBubble2Motion() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
