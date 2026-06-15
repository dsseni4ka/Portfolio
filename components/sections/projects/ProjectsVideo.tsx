"use client";

import { useId } from "react";
import { PROJECTS_IMAGE_RADIUS } from "@/lib/projects-owow-panel";

type ProjectsVideoProps = {
  src: string;
  label: string;
  objectFit?: "contain" | "cover";
  /** Design-frame width used to derive uniform corner radius in the clip path. */
  clipWidth: number;
  /** Design-frame height used to derive uniform corner radius in the clip path. */
  clipHeight: number;
  /** Fixed screen-pixel corner radius (overrides design-scale radius). */
  clipRadiusPx?: number;
  onLoadedMetadata?: (video: HTMLVideoElement) => void;
};

export default function ProjectsVideo({
  src,
  label,
  objectFit = "contain",
  clipWidth,
  clipHeight,
  clipRadiusPx,
  onLoadedMetadata,
}: ProjectsVideoProps) {
  const clipId = `projects-video-clip-${useId().replace(/:/g, "")}`;
  const rx = PROJECTS_IMAGE_RADIUS / clipWidth;
  const ry = PROJECTS_IMAGE_RADIUS / clipHeight;
  const fixedRadiusClip =
    clipRadiusPx != null ? `inset(0 round ${clipRadiusPx}px)` : undefined;

  return (
    <>
      {fixedRadiusClip == null ? (
        <svg
          className="pointer-events-none absolute h-0 w-0"
          aria-hidden
          focusable="false"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <rect width="1" height="1" rx={rx} ry={ry} />
            </clipPath>
          </defs>
        </svg>
      ) : null}
      <video
        src={src}
        className="pointer-events-none absolute inset-0 block h-full w-full"
        style={{
          objectFit,
          clipPath: fixedRadiusClip ?? `url(#${clipId})`,
        }}
        loop
        muted
        playsInline
        aria-label={label}
        onLoadedMetadata={(event) => onLoadedMetadata?.(event.currentTarget)}
      />
    </>
  );
}
