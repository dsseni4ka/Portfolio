import ProjectsDesignBox from "./ProjectsDesignBox";
import { OWOW_DASHBOARD_CONTINUATION_PANEL } from "@/lib/projects-dashboard-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

function DashboardShot({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      decoding="async"
    />
  );
}

export default function OwowDashboardContinuationPanel() {
  const { techStack, screens, workspace, body, designSystem } =
    OWOW_DASHBOARD_CONTINUATION_PANEL;

  return (
    <ProjectPanel
      width={OWOW_DASHBOARD_CONTINUATION_PANEL.width}
      className="bg-[#e7e7e7]"
    >
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(OWOW_DASHBOARD_CONTINUATION_PANEL.height) }}
      >
        <ProjectsDesignBox
          x={techStack.x}
          y={techStack.y}
          width={techStack.width}
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(techStack.fontSize) }}
        >
          Tech Stack I used:
          <br />
          Figma, Next.JS, React, Claude Code, Vercel
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={screens.x}
          y={screens.y}
          width={screens.width}
          height={screens.height}
          className="relative overflow-hidden"
        >
          <DashboardShot src={screens.src} alt={screens.alt} />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={workspace.x}
          y={workspace.y}
          width={workspace.width}
          height={workspace.height}
          className="relative overflow-hidden"
        >
          <DashboardShot src={workspace.src} alt={workspace.alt} />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={designSystem.x}
          y={designSystem.y}
          width={designSystem.width}
          height={designSystem.height}
          className="relative z-0 overflow-hidden"
        >
          <DashboardShot src={designSystem.src} alt={designSystem.alt} />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={body.x}
          y={body.y}
          width={body.width}
          className="z-10 font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(body.fontSize) }}
        >
          Created a full Design System from scratch.
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
