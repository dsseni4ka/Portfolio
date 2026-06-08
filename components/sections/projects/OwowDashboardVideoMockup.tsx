"use client";

import { useCallback, useState } from "react";
import ProjectsDesignBox from "./ProjectsDesignBox";
import ProjectsVideo from "./ProjectsVideo";

/** Fixed screen-pixel radius for the dashboard demo video frame. */
const DASHBOARD_VIDEO_RADIUS_PX = 20;

type MockupFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function fitVideoFrame(
  bounds: MockupFrame,
  videoWidth: number,
  videoHeight: number,
): MockupFrame {
  const aspect = videoWidth / videoHeight;
  let width = bounds.width;
  let height = width / aspect;

  if (height > bounds.height) {
    height = bounds.height;
    width = height * aspect;
  }

  return {
    x: bounds.x + (bounds.width - width) / 2,
    y: bounds.y + (bounds.height - height) / 2,
    width,
    height,
  };
}

type OwowDashboardVideoMockupProps = {
  mockup: MockupFrame;
  src: string;
  label: string;
};

export default function OwowDashboardVideoMockup({
  mockup,
  src,
  label,
}: OwowDashboardVideoMockupProps) {
  const [frame, setFrame] = useState(mockup);

  const onLoadedMetadata = useCallback(
    (video: HTMLVideoElement) => {
      const { videoWidth, videoHeight } = video;
      if (videoWidth > 0 && videoHeight > 0) {
        setFrame(fitVideoFrame(mockup, videoWidth, videoHeight));
      }
    },
    [mockup],
  );

  return (
    <ProjectsDesignBox
      x={frame.x}
      y={frame.y}
      width={frame.width}
      height={frame.height}
      parallax="media"
      className="relative overflow-hidden"
      style={{
        borderRadius: `${DASHBOARD_VIDEO_RADIUS_PX}px`,
        transform: "translateZ(0)",
      }}
    >
      <ProjectsVideo
        src={src}
        label={label}
        objectFit="cover"
        clipWidth={frame.width}
        clipHeight={frame.height}
        onLoadedMetadata={onLoadedMetadata}
      />
    </ProjectsDesignBox>
  );
}
