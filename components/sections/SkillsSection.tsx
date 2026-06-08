"use client";

import { SITE_BACKGROUND } from "@/lib/site-colors";
import SkillsPillsPhysics from "./SkillsPillsPhysics";

type SkillsSectionProps = {
  id?: string;
};

export default function SkillsSection({ id = "skills" }: SkillsSectionProps) {
  return (
    <section
      id={id}
      className="relative flex h-screen w-full snap-none scroll-mt-[clamp(4rem,8vh,5.5rem)] text-foreground"
      style={{ backgroundColor: SITE_BACKGROUND }}
    >
      <SkillsPillsPhysics className="z-[1]" />
      <h2 className="pointer-events-none relative z-10 m-auto font-sans text-center text-[40px] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
        Skills &amp; tools
      </h2>
    </section>
  );
}
