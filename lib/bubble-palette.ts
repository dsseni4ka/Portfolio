export type BubbleAccent =
  | "pearl"
  | "pink"
  | "magenta"
  | "fuchsia"
  | "violet"
  | "cyan"
  | "blue"
  | "yellow"
  | "gold";

import { SITE_BACKGROUND } from "@/lib/site-colors";

/** Page + scene background */
export const BUBBLE_PALETTE = {
  background: SITE_BACKGROUND,
  pearl: "#ffffff",
  pink: "#f9a8d4",
  magenta: "#e879f9",
  fuchsia: "#d946ef",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  blue: "#60a5fa",
  yellow: "#fde047",
  gold: "#facc15",
} as const;
