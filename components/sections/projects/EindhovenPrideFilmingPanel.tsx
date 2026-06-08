import ProjectsDesignBox from "./ProjectsDesignBox";
import { EINDHOVEN_PRIDE_FILMING_PANEL } from "@/lib/projects-pride-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function EindhovenPrideFilmingPanel() {
  const { experience, stills, patternWide } = EINDHOVEN_PRIDE_FILMING_PANEL;

  return (
    <ProjectPanel width={EINDHOVEN_PRIDE_FILMING_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(EINDHOVEN_PRIDE_FILMING_PANEL.height) }}
      >
        {stills.map((still) => (
          <ProjectsDesignBox
            key={still.src}
            x={still.x}
            y={still.y}
            width={still.width}
            height={still.height}
            className="relative overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={still.src}
              alt={still.alt}
              className="pointer-events-none h-full w-full object-cover"
              decoding="async"
            />
          </ProjectsDesignBox>
        ))}

        <ProjectsDesignBox
          x={patternWide.x}
          y={patternWide.y}
          width={patternWide.width}
          height={patternWide.height}
          className="relative overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={patternWide.src}
            alt={patternWide.alt}
            className="pointer-events-none h-full w-full object-cover"
            decoding="async"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={experience.x}
          y={experience.y}
          width={experience.width}
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(experience.fontSize) }}
        >
          Experience with:
          <br />
          Film-grade cameras, studio lighting, story boarding and scripting
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
