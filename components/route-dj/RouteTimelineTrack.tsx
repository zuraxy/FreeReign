"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Track } from "@/lib/music-engine/types";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";

interface RouteTimelineTrackProps {
  track: Track;
  kind: "past" | "current" | "queued";
  onRemove?: () => void;
  onMoveEarlier?: () => void;
  onMoveLater?: () => void;
  canMoveEarlier?: boolean;
  canMoveLater?: boolean;
}

export function RouteTimelineTrack({
  track,
  kind,
  onRemove,
  onMoveEarlier,
  onMoveLater,
  canMoveEarlier,
  canMoveLater,
}: RouteTimelineTrackProps) {
  return (
    <motion.article
      className="timeline-track"
      data-kind={kind}
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      aria-label={`${kind} track: ${track.title} by ${track.artist}`}
    >
      <TrackArtwork track={track} size="small" />
      <span className="timeline-track__copy">
        <strong>{track.title}</strong>
        <small>{track.artist}</small>
        <small>
          {track.bpm} BPM · {track.camelotKey}
        </small>
      </span>
      {kind === "queued" && (
        <span className="timeline-track__controls">
          <button
            type="button"
            onClick={onMoveEarlier}
            disabled={!canMoveEarlier}
            aria-label={`Move ${track.title} earlier`}
          >
            <ArrowLeft size={12} />
          </button>
          <button
            type="button"
            onClick={onMoveLater}
            disabled={!canMoveLater}
            aria-label={`Move ${track.title} later`}
          >
            <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${track.title} from queue`}
          >
            <X size={12} />
          </button>
        </span>
      )}
    </motion.article>
  );
}
