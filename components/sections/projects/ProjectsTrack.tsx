import Image from "next/image";
import { MOTION_CLIPS } from "@/lib/projects-data";
import OwowAtlasPanel from "./OwowAtlasPanel";
import AffiliateArtboardsPanel from "./AffiliateArtboardsPanel";
import AffiliateWorkPanel from "./AffiliateWorkPanel";
import EindhovenPrideFilmingPanel from "./EindhovenPrideFilmingPanel";
import EindhovenPridePanel from "./EindhovenPridePanel";
import OwowDashboardContinuationPanel from "./OwowDashboardContinuationPanel";
import OwowDashboardPanel from "./OwowDashboardPanel";
import OwowLandingPanel from "./OwowLandingPanel";
import ProjectsIntroPanel from "./ProjectsIntroPanel";
import {
  ProjectBody,
  ProjectGap,
  ProjectPanel,
  ProjectSansTitle,
  ProjectScriptTitle,
  ProjectTagRow,
} from "./ProjectUi";

export default function ProjectsTrack() {
  return (
    <div className="flex h-full w-max items-stretch">
      <ProjectsIntroPanel />
      <ProjectGap />
      <OwowAtlasPanel />
      <ProjectGap />
      <OwowLandingPanel />
      <ProjectGap />

      <AffiliateWorkPanel />
      <AffiliateArtboardsPanel />
      <ProjectGap />

      <OwowDashboardPanel />
      <OwowDashboardContinuationPanel />
      <ProjectGap />

      <EindhovenPridePanel />
      <EindhovenPrideFilmingPanel />
      <ProjectGap />

      {/* Motion Design */}
      <ProjectPanel width={4200} className="px-[clamp(1rem,2vw,2rem)]">
        <div className="relative flex h-full flex-col justify-center">
          <div className="mb-[clamp(1.5rem,3vh,2.5rem)] pl-[4%]">
            <ProjectSansTitle>Motion Design</ProjectSansTitle>
            <ProjectTagRow
              tags={[{ label: "Adobe After Effects", muted: true }]}
            />
            <ProjectBody className="mt-4">
              After Effects kinetic typography animations.
            </ProjectBody>
          </div>
          <div className="flex items-end gap-[clamp(0.75rem,1.5vw,1.5rem)] overflow-x-visible px-[4%] pb-[6%]">
            {MOTION_CLIPS.map((clip) => (
              <div
                key={clip.label}
                className="relative shrink-0 overflow-hidden rounded-[clamp(0.75rem,1.6vw,1.6rem)] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
                style={{
                  width: `calc(${clip.width}px * var(--projects-scale, 1) * 0.42)`,
                  height: `calc(${clip.height}px * var(--projects-scale, 1) * 0.42)`,
                }}
              >
                <Image
                  src={clip.image}
                  alt={`${clip.label} motion design`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
                <span className="absolute inset-x-0 bottom-[10%] text-center font-sans text-[clamp(1.75rem,3.5vw,4rem)] font-bold uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                  {clip.label}
                </span>
              </div>
            ))}
            <ProjectScriptTitle className="shrink-0 self-center pl-[4%]">
              Project
            </ProjectScriptTitle>
          </div>
        </div>
      </ProjectPanel>
    </div>
  );
}
