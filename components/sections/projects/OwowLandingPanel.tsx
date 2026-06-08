import ProjectsDesignBox from "./ProjectsDesignBox";
import {
  OWOW_LANDING_PANEL,
  PROJECTS_IMAGE_RADIUS,
  projectsPx,
} from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

function FigmaCroppedImage({
  src,
  alt,
  crop,
}: {
  src: string;
  alt: string;
  crop: "cover" | "laptop" | "media";
}) {
  const style =
    crop === "media"
      ? {
          width: "206.55%",
          height: "104.67%",
          left: "-46.53%",
          top: "-4.69%",
        }
      : crop === "laptop"
        ? {
            width: "100%",
            height: "119.63%",
            top: "-19.63%",
            left: 0,
          }
        : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`pointer-events-none absolute max-w-none ${
        crop === "cover" ? "inset-0 h-full w-full object-cover" : ""
      }`}
      style={style}
      decoding="async"
    />
  );
}

export default function OwowLandingPanel() {
  const {
    wireframes,
    figmaShot,
    techStack,
    laptop,
    contest,
    teamPhoto,
  } = OWOW_LANDING_PANEL;

  return (
    <ProjectPanel width={OWOW_LANDING_PANEL.width} className="bg-[#e7e7e7]">
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(OWOW_LANDING_PANEL.height) }}
      >
        <ProjectsDesignBox
          x={wireframes.x}
          y={wireframes.y}
          width={wireframes.width}
          parallax="text"
          className="font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(wireframes.fontSize) }}
        >
          From wireframes in Figma to a fully deployed landing page
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={figmaShot.x}
          y={figmaShot.y}
          width={figmaShot.width}
          height={figmaShot.height}
          parallax="media"
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(PROJECTS_IMAGE_RADIUS) }}
        >
          <FigmaCroppedImage
            src="/projects/landing-page.png"
            alt="Figma wireframes for OWOW landing page"
            crop="cover"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={techStack.x}
          y={techStack.y}
          width={techStack.width}
          parallax="text"
          className="font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(techStack.fontSize) }}
        >
          Tech stack I used:
          <br />
          Figma, Next.JS, React, GSAP library
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={laptop.x}
          y={laptop.y}
          width={laptop.width}
          height={laptop.height}
          parallax="media"
          className="relative overflow-hidden"
          style={{ borderRadius: projectsPx(PROJECTS_IMAGE_RADIUS) }}
        >
          <FigmaCroppedImage
            src="/projects/owow-laptop.png"
            alt="Deployed OWOW Atlas landing page"
            crop="laptop"
          />
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={contest.x}
          y={contest.y}
          width={contest.width}
          parallax="text"
          className="font-sans font-medium leading-normal text-black"
          style={{ fontSize: projectsPx(contest.fontSize) }}
        >
          #1 First Place Design Out of 50+ Contestants
        </ProjectsDesignBox>

        <ProjectsDesignBox
          x={teamPhoto.x}
          y={teamPhoto.y}
          width={teamPhoto.width}
          height={teamPhoto.height}
          parallax="media"
          className="relative overflow-hidden"
        >
          <FigmaCroppedImage
            src="/projects/contest-media.png"
            alt="Contest team photo"
            crop="media"
          />
        </ProjectsDesignBox>
      </div>
    </ProjectPanel>
  );
}
