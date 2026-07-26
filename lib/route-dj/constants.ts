import type { CandidateLabel, MusicDirection } from "@/lib/music-engine/types";

export const MOCK_DELAYS = {
  session: 180,
  recommendations: 240,
  search: 140,
  mutation: 120,
  preparation: 480,
} as const;

export const CANDIDATE_LABELS: CandidateLabel[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
];

export const DIRECTION_BY_LABEL: Record<CandidateLabel, MusicDirection> = {
  A: "higher-energy",
  B: "higher-exploratory",
  C: "exploratory",
  D: "lower-exploratory",
  E: "lower-energy",
  F: "lower-safer",
  G: "safer",
  H: "higher-safer",
};

export const KEYBOARD_HELP = [
  ["← / →", "Browse recommendations"],
  ["Enter", "Select focused recommendation"],
  ["Q", "Queue selected recommendation"],
  ["Space", "Play or pause"],
  ["Esc", "Close an open panel"],
  ["?", "Show keyboard controls"],
] as const;

export const ROUTE_MODES = ["Focus", "Discovery", "Drift"] as const;

export const MAX_CANVAS_PAN = 76;
