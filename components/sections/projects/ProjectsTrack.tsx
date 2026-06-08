import Image from "next/image";
import { MOTION_CLIPS } from "@/lib/projects-data";
import OwowAtlasPanel from "./OwowAtlasPanel";
import AffiliateArtboardsPanel from "./AffiliateArtboardsPanel";
import AffiliateWorkPanel from "./AffiliateWorkPanel";
import OwowDashboardPanel from "./OwowDashboardPanel";
import OwowLandingPanel from "./OwowLandingPanel";
import ProjectsIntroPanel from "./ProjectsIntroPanel";
import {
  ProjectBody,
  ProjectPanel,
  ProjectSansTitle,
  ProjectScriptTitle,
  ProjectTagRow,
} from "./ProjectUi";

export default function ProjectsTrack() {
  return (
    <div className="flex h-full w-max items-stretch">
      <ProjectsIntroPanel />
      <OwowAtlasPanel />
      <OwowLandingPanel />

      <AffiliateWorkPanel />
      <AffiliateArtboardsPanel />

      <OwowDashboardPanel />

      {/* Design system */}
      <ProjectPanel width={3200} className="px-[clamp(1rem,2vw,2rem)]">
        <div className="relative h-full">
          <div className="absolute top-[10%] left-[4%] h-[50%] w-[46%]">
            <Image
              src="/projects/design-system-1.png"
              alt="OWOW design system components"
              fill
              className="object-contain object-left"
              sizes="46vw"
            />
          </div>
          <div className="absolute top-[8%] right-[4%] h-[48%] w-[44%]">
            <Image
              src="/projects/design-system-1.png"
              alt="Design system documentation"
              fill
              className="object-contain object-right"
              sizes="44vw"
            />
          </div>
          <div className="absolute bottom-[14%] left-[8%] w-[40%]">
            <ProjectSansTitle>OWOW</ProjectSansTitle>
            <ProjectBody className="mt-6">
              Created a full Design System from scratch.
            </ProjectBody>
          </div>
          <div className="absolute right-[4%] bottom-[8%] h-[42%] w-[52%]">
            <Image
              src="/projects/pride-wide.png"
              alt="Design system in product context"
              fill
              className="object-contain object-bottom"
              sizes="52vw"
            />
          </div>
        </div>
      </ProjectPanel>

      {/* Eindhoven Pride */}
      <ProjectPanel width={3600} className="px-[clamp(1rem,2vw,2rem)]">
        <div className="relative h-full">
          <div className="absolute top-[15%] left-[4%]">
            <ProjectSansTitle>Eindhoven Pride</ProjectSansTitle>
            <ProjectScriptTitle className="mt-4">Content Creation</ProjectScriptTitle>
            <ProjectBody className="mt-8">
              Motion Design and content creation
              <br />
              for Official Eindhoven Pride Organization
            </ProjectBody>
            <ProjectBody className="mt-8">
              Experience with:
              <br />
              Film-grade cameras, studio lighting, story boarding and scripting
            </ProjectBody>
            <div className="mt-8">
              <ProjectTagRow
                tags={[
                  { label: "Adobe After Effects", muted: true },
                  { label: "Davinci Resolve", muted: true },
                ]}
              />
            </div>
          </div>
          <div className="absolute top-[12%] right-[28%] h-[72%] w-[14%] overflow-hidden rounded-[clamp(0.75rem,1.2vw,1.2rem)]">
            <Image
              src="/projects/filming-drag-2.png"
              alt="Pride content filming"
              fill
              className="object-cover"
              sizes="14vw"
            />
          </div>
          <div className="absolute top-[21%] right-[16%] h-[74%] w-[14%] overflow-hidden rounded-[clamp(1rem,1.6vw,2.2rem)]">
            <Image
              src="/projects/filming-drag-3.png"
              alt="Pride campaign still"
              fill
              className="object-cover"
              sizes="14vw"
            />
          </div>
          <div className="absolute top-[13%] right-[4%] h-[85%] w-[10%] overflow-hidden rounded-[clamp(0.75rem,1.2vw,1.2rem)]">
            <Image
              src="/projects/filming-drag-4.png"
              alt="Pride motion still"
              fill
              className="object-cover"
              sizes="10vw"
            />
          </div>
          <div className="absolute right-[2%] bottom-[8%] left-[42%] h-[38%]">
            <Image
              src="/projects/pride-wide.png"
              alt="Eindhoven Pride brand visuals"
              fill
              className="object-contain object-bottom"
              sizes="50vw"
            />
          </div>
        </div>
      </ProjectPanel>

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
