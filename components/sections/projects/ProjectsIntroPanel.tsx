import ProjectsDesignBox from "./ProjectsDesignBox";
import { PROJECTS_INTRO, projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function ProjectsIntroPanel() {
  const { title, scrollHint } = PROJECTS_INTRO;

  return (
    <ProjectPanel width={PROJECTS_INTRO.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(982) }}
      >
        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          width={title.width}
          className="font-sans font-bold leading-normal whitespace-nowrap text-black uppercase"
          style={{ fontSize: projectsPx(title.fontSize) }}
        >
          MY EXPERIENCE
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={scrollHint.x}
          y={scrollHint.y}
          className="font-mono font-medium leading-normal whitespace-nowrap text-accent"
          style={{ fontSize: projectsPx(scrollHint.fontSize) }}
        >
          {"{Scroll this way to see my projects}"}
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
