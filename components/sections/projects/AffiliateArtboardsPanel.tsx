import ProjectsDesignBox from "./ProjectsDesignBox";
import {
  AFFILIATE_ARTBOARDS_PANEL,
} from "@/lib/projects-affiliate-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

export default function AffiliateArtboardsPanel() {
  const { tileWidth, tileHeight, tiles } = AFFILIATE_ARTBOARDS_PANEL;

  return (
    <ProjectPanel
      width={AFFILIATE_ARTBOARDS_PANEL.width}
      className="overflow-hidden bg-white"
    >
      <div
        className="relative h-full w-full"
        style={{ height: projectsPx(AFFILIATE_ARTBOARDS_PANEL.height) }}
      >
        {tiles.map((tile) => (
          <ProjectsDesignBox
            key={tile.src}
            x={tile.x}
            y={tile.y}
            width={tileWidth}
            height={tileHeight}
            className="overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tile.src}
              alt={tile.alt}
              className="pointer-events-none h-full w-full object-cover"
              decoding="async"
            />
          </ProjectsDesignBox>
        ))}
      </div>
    </ProjectPanel>
  );
}
