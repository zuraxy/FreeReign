import type { CandidateLabel } from "@/lib/music-engine/types";

export interface CandidatePosition {
  x: number;
  y: number;
  opacity: number;
}

export const CANDIDATE_POSITIONS: Record<CandidateLabel, CandidatePosition> = {
  A: { x: 50, y: 8, opacity: 1 },
  B: { x: 74, y: 21, opacity: 0.5 },
  C: { x: 82, y: 48, opacity: 1 },
  D: { x: 74, y: 76, opacity: 0.42 },
  E: { x: 50, y: 87, opacity: 1 },
  F: { x: 26, y: 76, opacity: 0.42 },
  G: { x: 18, y: 48, opacity: 1 },
  H: { x: 26, y: 21, opacity: 0.5 },
};

export const CENTER_POSITION = { x: 50, y: 49 };
