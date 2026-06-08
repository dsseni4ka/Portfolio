import type { CSSProperties, ReactNode } from "react";
import { projectsPx } from "@/lib/projects-owow-panel";

type ProjectsDesignBoxProps = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function ProjectsDesignBox({
  x,
  y,
  width,
  height,
  className = "",
  style,
  children,
}: ProjectsDesignBoxProps) {
  const boxStyle: CSSProperties = {
    position: "absolute",
    left: projectsPx(x),
    top: projectsPx(y),
    ...(width != null ? { width: projectsPx(width) } : {}),
    ...(height != null ? { height: projectsPx(height) } : {}),
    ...style,
  };

  return (
    <div className={className} style={boxStyle}>
      {children}
    </div>
  );
}
