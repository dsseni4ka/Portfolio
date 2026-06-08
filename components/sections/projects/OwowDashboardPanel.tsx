import ProjectsDesignBox from "./ProjectsDesignBox";
import { OWOW_DASHBOARD_PANEL } from "@/lib/projects-dashboard-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import OwowDashboardVideoMockup from "./OwowDashboardVideoMockup";
import { ProjectPanel } from "./ProjectUi";

export default function OwowDashboardPanel() {
  const { tags, title, subtitle, body, mockup } = OWOW_DASHBOARD_PANEL;

  return (
    <ProjectPanel width={OWOW_DASHBOARD_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(OWOW_DASHBOARD_PANEL.height) }}
      >
        {tags.map((tag) => (
          <ProjectsDesignBox
            key={tag.label}
            x={tag.x}
            y={tag.y}
            parallax="text"
            className="font-mono font-light leading-normal whitespace-nowrap text-[#828282]"
            style={{ fontSize: projectsPx(16) }}
          >
            {`{${tag.label}}`}
          </ProjectsDesignBox>
        ))}

        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          parallax="text"
          className="font-sans font-bold leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(title.fontSize) }}
        >
          OWOW
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={subtitle.x}
          y={subtitle.y}
          parallax="text"
          className="font-year leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(subtitle.fontSize) }}
        >
          Dashboard
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={body.x}
          y={body.y}
          width={body.width}
          parallax="text"
          className="font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(body.fontSize) }}
        >
          Full stack client success and monitoring dashboard for OWOW clients
        </ProjectsDesignBox>

        <OwowDashboardVideoMockup
          mockup={mockup}
          src="/projects/owow-dashboard-demo.webm"
          label="OWOW client success dashboard demo"
        />
      </div>
    </ProjectPanel>
  );
}
