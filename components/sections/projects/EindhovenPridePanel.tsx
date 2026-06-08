import ProjectsDesignBox from "./ProjectsDesignBox";
import { EINDHOVEN_PRIDE_PANEL } from "@/lib/projects-pride-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function EindhovenPridePanel() {
  const { motion, subtitle, title, tags, logo, pattern } = EINDHOVEN_PRIDE_PANEL;

  return (
    <ProjectPanel width={EINDHOVEN_PRIDE_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(EINDHOVEN_PRIDE_PANEL.height) }}
      >
        <ProjectsDesignBox
          x={logo.x}
          y={logo.y}
          width={logo.width}
          height={logo.height}
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(logo.radius) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.alt}
            className="pointer-events-none h-full w-full object-cover"
            decoding="async"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={pattern.x}
          y={pattern.y}
          width={pattern.width}
          height={pattern.height}
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(pattern.radius) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pattern.src}
            alt={pattern.alt}
            className="pointer-events-none h-full w-full object-cover"
            decoding="async"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={motion.x}
          y={motion.y}
          width={motion.width}
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(motion.fontSize) }}
        >
          Motion Design and content creation for Official Eindhoven Pride
          Organization
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={subtitle.x}
          y={subtitle.y}
          className="z-10 font-year leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(subtitle.fontSize) }}
        >
          Content Creation
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          className="z-10 font-sans font-bold leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(title.fontSize) }}
        >
          Eindhoven Pride
        </ProjectsDesignBox>

        {tags.map((tag) => (
          <ProjectsDesignBox
            key={tag.label}
            x={tag.x}
            y={tag.y}
            className="z-10 font-mono font-light leading-normal whitespace-nowrap text-[#828282]"
            style={{ fontSize: projectsPx(16) }}
          >
            {`{${tag.label}}`}
          </ProjectsDesignBox>
        ))}
      </div>
    </ProjectPanel>
  );
}
