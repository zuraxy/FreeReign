import type { CandidateLabel } from "@/lib/music-engine/types";
import {
  CANDIDATE_POSITIONS,
  CENTER_POSITION,
} from "@/lib/route-dj/positioning";

interface ConnectorLayerProps {
  activeLabel: CandidateLabel | null;
}

export function ConnectorLayer({ activeLabel }: ConnectorLayerProps) {
  return (
    <svg
      className="connector-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="49" r="24" />
      <circle cx="50" cy="49" r="38" />
      {(
        Object.entries(CANDIDATE_POSITIONS) as [
          CandidateLabel,
          (typeof CANDIDATE_POSITIONS)[CandidateLabel],
        ][]
      ).map(([label, position]) => (
        <line
          key={label}
          x1={CENTER_POSITION.x}
          y1={CENTER_POSITION.y}
          x2={position.x}
          y2={position.y}
          data-active={activeLabel === label}
        />
      ))}
    </svg>
  );
}
