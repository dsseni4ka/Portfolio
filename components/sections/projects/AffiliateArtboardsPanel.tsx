import {
  AFFILIATE_ARTBOARDS_PANEL,
  getAffiliateArtboardRepeatIndices,
  getAffiliateArtboardTileTop,
} from "@/lib/projects-affiliate-panel";
import { projectsPx } from "@/lib/projects-owow-panel";
import { ProjectPanel } from "./ProjectUi";

const COLUMN_DIRECTIONS = ["auto-up", "auto-down", "auto-up", "auto-down"] as const;

export default function AffiliateArtboardsPanel() {
  const { tileWidth, tileHeight, columns } = AFFILIATE_ARTBOARDS_PANEL;
  const repeatIndices = getAffiliateArtboardRepeatIndices();

  return (
    <ProjectPanel
      width={AFFILIATE_ARTBOARDS_PANEL.width}
      className="overflow-hidden bg-white"
    >
      <div
        data-affiliate-artboards-panel
        className="relative h-full w-full overflow-hidden"
        style={{ height: projectsPx(AFFILIATE_ARTBOARDS_PANEL.height) }}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={column.x}
            data-artboard-column
            data-artboard-column-direction={COLUMN_DIRECTIONS[columnIndex]}
            className="absolute top-0 overflow-hidden"
            style={{
              left: projectsPx(column.x),
              width: projectsPx(tileWidth),
              height: "100%",
            }}
          >
            <div
              data-artboard-column-track
              className="relative will-change-transform"
            >
              {repeatIndices.flatMap((repeatIndex) =>
                column.tiles.map((tile) => (
                  <div
                    key={`${column.x}-${repeatIndex}-${tile.src}`}
                    className="absolute left-0 overflow-hidden"
                    style={{
                      top: projectsPx(
                        getAffiliateArtboardTileTop(tile.y, repeatIndex),
                      ),
                      width: projectsPx(tileWidth),
                      height: projectsPx(tileHeight),
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tile.src}
                      alt={tile.alt}
                      className="pointer-events-none h-full w-full object-cover"
                      decoding="async"
                    />
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </ProjectPanel>
  );
}
