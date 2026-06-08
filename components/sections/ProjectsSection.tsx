"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SITE_BACKGROUND } from "@/lib/site-colors";
import { PROJECTS_DESIGN_HEIGHT } from "@/lib/projects-data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import ProjectsTrack from "./projects/ProjectsTrack";

gsap.registerPlugin(ScrollTrigger);

type ProjectsSectionProps = {
  id?: string;
};

export default function ProjectsSection({ id = "projects" }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!section || !pin || !track || reducedMotion) return;

      const setScale = () => {
        const scale = window.innerHeight / PROJECTS_DESIGN_HEIGHT;
        pin.style.setProperty("--projects-scale", String(scale));
      };

      setScale();

      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
          pin: pin,
          scrub: 0.85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      const onResize = () => {
        setScale();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  if (reducedMotion) {
    return (
      <section
        id={id}
        ref={sectionRef}
        className="relative w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)]"
        style={{ backgroundColor: SITE_BACKGROUND }}
      >
        <div className="overflow-x-auto overflow-y-hidden">
          <div
            ref={trackRef}
            className="h-screen min-w-max"
            style={
              {
                "--projects-scale": "calc(100vh / 982)",
              } as React.CSSProperties
            }
          >
            <ProjectsTrack />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)]"
      style={{ backgroundColor: SITE_BACKGROUND }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
        style={
          {
            "--projects-scale": "calc(100vh / 982)",
          } as React.CSSProperties
        }
      >
        <div ref={trackRef} className="absolute top-0 left-0 h-full will-change-transform">
          <ProjectsTrack />
        </div>
      </div>
    </section>
  );
}
