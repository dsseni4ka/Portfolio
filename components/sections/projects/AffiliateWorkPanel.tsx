import ProjectsDesignBox from "./ProjectsDesignBox";
import { AFFILIATE_WORK_PANEL } from "@/lib/projects-affiliate-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function AffiliateWorkPanel() {
  const { logo, tags, scriptTitle, marketing, techStack, phone } =
    AFFILIATE_WORK_PANEL;

  return (
    <ProjectPanel
      width={AFFILIATE_WORK_PANEL.width}
      className="bg-[#ff5615]"
    >
      <div
        className="relative h-full w-full text-white"
        style={{ height: projectsPx(AFFILIATE_WORK_PANEL.height) }}
      >
        {tags.map((tag) => (
          <ProjectsDesignBox
            key={tag.label}
            x={tag.x}
            y={tag.y}
            className="font-mono font-light leading-normal whitespace-nowrap"
            style={{ fontSize: projectsPx(16) }}
          >
            {`{${tag.label}}`}
          </ProjectsDesignBox>
        ))}

        <ProjectsDesignBox
          x={logo.x}
          y={logo.y}
          width={logo.width}
          height={logo.height}
          className="relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/affiliate-logo.png"
            alt="Affiliate agency brand mark"
            className="pointer-events-none h-full w-full object-contain"
            decoding="async"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={scriptTitle.x}
          y={scriptTitle.y}
          className="z-10 font-year leading-none whitespace-nowrap"
          style={{ fontSize: projectsPx(scriptTitle.fontSize) }}
        >
          work experience
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={marketing.x}
          y={marketing.y}
          width={marketing.width}
          className="font-sans font-medium leading-normal"
          style={{ fontSize: projectsPx(marketing.fontSize) }}
        >
          Marketing and branding content creation
          <br />
          for renowned Affiliate Agency in Ukraine
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={techStack.x}
          y={techStack.y}
          width={techStack.width}
          className="font-sans font-medium leading-normal"
          style={{ fontSize: projectsPx(techStack.fontSize) }}
        >
          Tech Stack I used:
          <br />
          Photoshop, Illustrator, GPT-2, Midjourney
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={phone.x}
          y={phone.y}
          width={phone.width}
          height={phone.height}
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(phone.radius) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/affiliate-phone.png"
            alt="Instagram campaign on mobile"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
