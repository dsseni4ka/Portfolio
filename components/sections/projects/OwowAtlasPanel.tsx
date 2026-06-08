import ProjectsDesignBox from "./ProjectsDesignBox";
import { OWOW_PANEL, projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function OwowAtlasPanel() {
  const { image: mockup, body, title, subtitle, tags, visit } = OWOW_PANEL;

  return (
    <ProjectPanel width={OWOW_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(OWOW_PANEL.height) }}
      >
        {/* Laptop mockup — Figma image 11 */}
        <ProjectsDesignBox
          x={mockup.x}
          y={mockup.y}
          width={mockup.width}
          height={mockup.height}
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(mockup.radius) }}
        >
          {/* Native img — Figma crop; next/image fill cannot set custom height */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/owow-laptop.png"
            alt="OWOW Atlas in Motion — Animation Library"
            className="pointer-events-none absolute left-0 max-w-none"
            style={{
              width: "100%",
              height: "119.63%",
              top: "-19.63%",
            }}
            decoding="async"
            fetchPriority="high"
          />
        </ProjectsDesignBox>

        {/* Description */}
        <ProjectsDesignBox
          x={body.x}
          y={body.y}
          width={body.width}
          className="font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(body.fontSize) }}
        >
          I created a full stack Animation Library for the OWOW company in the
          Netherlands
        </ProjectsDesignBox>

        {/* Tags */}
        {tags.map((tag) => (
          <ProjectsDesignBox
            key={tag.label}
            x={tag.x}
            y={tag.y}
            className="font-mono font-light leading-normal whitespace-nowrap text-[#828282]"
            style={{ fontSize: projectsPx(16) }}
          >
            {`{${tag.label}}`}
          </ProjectsDesignBox>
        ))}

        {/* OWOW */}
        <ProjectsDesignBox
          x={title.x}
          y={title.y}
          className="font-sans font-bold leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(title.fontSize) }}
        >
          OWOW
        </ProjectsDesignBox>

        {/* Atlas in Motion */}
        <ProjectsDesignBox
          x={subtitle.x}
          y={subtitle.y}
          className="font-year leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(subtitle.fontSize) }}
        >
          Atlas in Motion
        </ProjectsDesignBox>

        {/* Visit */}
        <ProjectsDesignBox
          x={visit.x}
          y={visit.y}
          className="font-mono font-light leading-normal whitespace-nowrap text-black"
          style={{ fontSize: projectsPx(visit.fontSize) }}
        >
          <a href="#" className="hover:opacity-60">
            {"{visit}"}
          </a>
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
