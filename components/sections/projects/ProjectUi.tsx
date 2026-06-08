import type { CSSProperties, ReactNode } from "react";
import type { ProjectTag } from "@/lib/projects-data";

export function ProjectTagPill({ label, muted }: ProjectTag) {
  return (
    <span
      className={`font-mono text-[clamp(0.75rem,1.05vw,1rem)] font-light leading-none ${
        muted ? "text-[#828282]" : "text-foreground"
      }`}
    >
      {`{${label}}`}
    </span>
  );
}

export function ProjectTagRow({ tags }: { tags: ProjectTag[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[clamp(0.75rem,1.8vw,1.75rem)] gap-y-2">
      {tags.map((tag) => (
        <ProjectTagPill key={tag.label} {...tag} />
      ))}
    </div>
  );
}

export function ProjectSansTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`font-sans text-[clamp(3.5rem,7.8vw,7.55rem)] font-bold leading-[0.95] tracking-[-0.02em] ${className}`}
    >
      {children}
    </h3>
  );
}

export function ProjectScriptTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-year text-[clamp(3.5rem,7.8vw,7.55rem)] leading-[0.95] ${className}`}
    >
      {children}
    </p>
  );
}

export function ProjectBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`max-w-[min(30rem,42vw)] font-sans text-[clamp(0.95rem,1.5vw,1.51rem)] font-medium leading-snug ${className}`}
    >
      {children}
    </p>
  );
}

export function ProjectPanel({
  width,
  children,
  className = "",
  style,
}: {
  width: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative h-full shrink-0 ${className}`}
      style={{
        width: `calc(${width}px * var(--projects-scale, 1))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
