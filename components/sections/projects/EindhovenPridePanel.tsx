import ProjectsDesignBox from "./ProjectsDesignBox";
import ProjectsVideo from "./ProjectsVideo";
import { EINDHOVEN_PRIDE_PANEL } from "@/lib/projects-pride-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

const PRIDE_VIDEO_RADIUS_PX = 20;

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
          parallax="media"
          className="relative overflow-hidden"
          style={{
            borderRadius: `${PRIDE_VIDEO_RADIUS_PX}px`,
            transform: "translateZ(0)",
          }}
        >
          <ProjectsVideo
            src={logo.src}
            label={logo.alt}
            objectFit="cover"
            clipWidth={logo.width}
            clipHeight={logo.height}
            clipRadiusPx={PRIDE_VIDEO_RADIUS_PX}
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={pattern.x}
          y={pattern.y}
          width={pattern.width}
          height={pattern.height}
          parallax="media"
          className="relative overflow-hidden"
          style={{
            borderRadius: `${PRIDE_VIDEO_RADIUS_PX}px`,
            transform: "translateZ(0)",
          }}
        >
          <ProjectsVideo
            src={pattern.src}
            label={pattern.alt}
            objectFit="cover"
            clipWidth={pattern.width}
            clipHeight={pattern.height}
            clipRadiusPx={PRIDE_VIDEO_RADIUS_PX}
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={motion.x}
          y={motion.y}
          width={motion.width}
          parallax="text"
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(motion.fontSize) }}
        >
          Motion Design and content creation for Official Eindhoven Pride
          Organization
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={subtitle.x}
          y={subtitle.y}
          parallax="text"
          className="z-10 font-year leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(subtitle.fontSize) }}
        >
          Content Creation
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          parallax="text"
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
            parallax="text"
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
