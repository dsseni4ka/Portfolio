"use client";

import { useSyncExternalStore } from "react";
import type { BubbleSettings } from "@/lib/bubble-settings";
import {
  getHeroBubbleBounds,
  getHeroViewportScale,
  type HeroBubbleBounds,
} from "@/lib/hero-bubble-bounds";
import { mapBubble2Runtime } from "@/lib/bubble2/map-settings";
import {
  clampBlobsToBounds,
  createDriftingHeroBlob,
  createSpreadBlobs,
  getTotalBlobCount,
  MAX_BLOBS,
  packBlobs,
  updateBlobs,
  type MetaballBlob,
} from "@/lib/bubble2/blobs";
import { getHeroCursor } from "@/lib/bubble2/hero-cursor";

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
    const blobs = createSpreadBlobs(6, 0.6);
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
  });
}

function boundsKey(bounds: HeroBubbleBounds) {
  return `${bounds.boundsX.toFixed(3)}:${bounds.boundsY.toFixed(3)}`;
}

function rebuildBlobs(settings: BubbleSettings, mobile: boolean) {
  const s = ensureSnapshot();
  const runtime = mapBubble2Runtime(settings, mobile);
  const mainCount = runtime.mainBlobCount;
  const frameBounds = resolveBounds(settings, mobile);

  if (mainCount <= 1) {
    s.blobs = createDriftingHeroBlob(runtime.heroBlobRadius);
  } else {
    s.blobs = createSpreadBlobs(mainCount, runtime.heroBlobRadius);
  }

  clampBlobsToBounds(s.blobs, frameBounds);
  packBlobs(s.blobs, s.blobData);
  publish();
}

export function syncBubbleMotion(
  settings: BubbleSettings,
  mobile: boolean,
) {
  const runtime = mapBubble2Runtime(settings, mobile);
  const frameBounds = resolveBounds(settings, mobile);
  const configKey = `spread-v3:${runtime.activeBlobCount}:${runtime.heroBlobRadius}`;
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

  updateBlobs(
    s.blobs,
    dt * runtime.driftSpeed,
    frameBounds,
    getHeroCursor(),
    motionTime,
  );
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
