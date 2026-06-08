import ProjectsDesignBox from "./ProjectsDesignBox";
import ProjectsVideo from "./ProjectsVideo";
import { MOTION_DESIGN_PANEL } from "@/lib/projects-motion-panel";
import { PROJECTS_IMAGE_RADIUS, projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

const MOTION_VIDEO_RADIUS_PX = 20;

function isMotionVideo(src: string) {
  return src.endsWith(".webm") || src.endsWith(".mov");
}

export default function MotionDesignPanel() {
  const { tag, title, body, project, clips } = MOTION_DESIGN_PANEL;

  return (
    <ProjectPanel width={MOTION_DESIGN_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(MOTION_DESIGN_PANEL.height) }}
      >
        {clips.map((clip) => (
          <ProjectsDesignBox
            key={clip.src}
            x={clip.x}
            y={clip.y}
            width={clip.width}
            height={clip.height}
            parallax="media"
            className="relative overflow-hidden bg-white"
            style={
              isMotionVideo(clip.src)
                ? {
                    borderRadius: `${MOTION_VIDEO_RADIUS_PX}px`,
                    transform: "translateZ(0)",
                  }
                : { borderRadius: projectsPx(PROJECTS_IMAGE_RADIUS) }
            }
          >
            {isMotionVideo(clip.src) ? (
              <ProjectsVideo
                src={clip.src}
                label={clip.alt}
                objectFit="cover"
                clipWidth={clip.width}
                clipHeight={clip.height}
                clipRadiusPx={MOTION_VIDEO_RADIUS_PX}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={clip.src}
                alt={clip.alt}
                className="pointer-events-none h-full w-full object-cover"
                decoding="async"
              />
            )}
          </ProjectsDesignBox>
        ))}

        <ProjectsDesignBox
          x={tag.x}
          y={tag.y}
          parallax="text"
          className="z-10 font-mono font-light leading-normal whitespace-nowrap text-[#828282]"
          style={{ fontSize: projectsPx(16) }}
        >
          {`{${tag.label}}`}
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          parallax="text"
          className="z-10 font-sans font-bold leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(title.fontSize) }}
        >
          Motion Design
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={body.x}
          y={body.y}
          width={body.width}
          parallax="text"
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(body.fontSize) }}
        >
          After Effects kinetic typography animations.
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={project.x}
          y={project.y}
          parallax="text"
          className="z-10 font-year leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(project.fontSize) }}
        >
          Project
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
