import OwowAtlasPanel from "./OwowAtlasPanel";
import AffiliateArtboardsPanel from "./AffiliateArtboardsPanel";
import AffiliateWorkPanel from "./AffiliateWorkPanel";
import EindhovenPrideFilmingPanel from "./EindhovenPrideFilmingPanel";
import EindhovenPridePanel from "./EindhovenPridePanel";
import MotionDesignPanel from "./MotionDesignPanel";
import OwowDashboardContinuationPanel from "./OwowDashboardContinuationPanel";
import OwowDashboardPanel from "./OwowDashboardPanel";
import OwowLandingPanel from "./OwowLandingPanel";
import ProjectsIntroPanel from "./ProjectsIntroPanel";
import { ProjectGap } from "./ProjectUi";

export default function ProjectsTrack() {
  return (
    <div className="flex h-full w-max items-stretch">
      <ProjectsIntroPanel />
      <OwowAtlasPanel />
      <OwowLandingPanel />

      <AffiliateWorkPanel />
      <AffiliateArtboardsPanel />

      <OwowDashboardPanel />
      <OwowDashboardContinuationPanel />
      <ProjectGap />

      <EindhovenPridePanel />
      <EindhovenPrideFilmingPanel />
      <ProjectGap />

      <MotionDesignPanel />
    </div>
  );
}
