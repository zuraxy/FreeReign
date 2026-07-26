"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { CandidateTrack } from "@/lib/music-engine/types";
import { MatchIndicator } from "@/components/route-dj/MatchIndicator";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";

interface CandidateTrackCardProps {
  candidate: CandidateTrack;
  selected: boolean;
  focused: boolean;
  subdued: boolean;
  queued: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: () => void;
  onQueue: () => void;
}

export function CandidateTrackCard({
  candidate,
  selected,
  focused,
  subdued,
  queued,
  onFocus,
  onBlur,
  onSelect,
  onQueue,
}: CandidateTrackCardProps) {
  return (
    <motion.article
      className="candidate-card"
      data-selected={selected}
      data-focused={focused}
      data-subdued={subdued}
      layout
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{
        opacity: subdued ? 0.42 : 1,
        scale: selected ? 1.035 : 1,
        y: 0,
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28 }}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      <span className="candidate-card__label" aria-hidden="true">
        {candidate.label}
      </span>
      <button
        type="button"
        id={`candidate-${candidate.track.id}`}
        data-candidate-id={candidate.track.id}
        className="candidate-card__select"
        aria-pressed={selected}
        aria-label={`${selected ? "Selected" : "Select"} ${candidate.track.title} by ${candidate.track.artist}, ${candidate.explanation}`}
        onClick={onSelect}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <TrackArtwork track={candidate.track} size="medium" />
        <span className="candidate-card__content">
          <strong>{candidate.track.title}</strong>
          <span>{candidate.track.artist}</span>
          <span className="candidate-card__meta">
            {candidate.track.bpm} BPM · {candidate.track.camelotKey}
          </span>
          <span className="candidate-card__genre">{candidate.track.genre}</span>
          <span className="candidate-card__direction">
            {candidate.direction.replaceAll("-", " ")}
          </span>
        </span>
      </button>
      <div className="candidate-card__metrics">
        {candidate.metrics.map((item) => (
          <MatchIndicator key={item.label} metric={item} compact />
        ))}
      </div>
      <motion.div
        className="candidate-card__explanation"
        initial={false}
        animate={{
          height: selected || focused ? "auto" : 0,
          opacity: selected || focused ? 1 : 0,
        }}
      >
        <p>{candidate.explanation}</p>
        {selected && (
          <button
            type="button"
            className="candidate-card__queue"
            onClick={onQueue}
            disabled={queued}
          >
            {queued ? <Check size={14} /> : <Plus size={14} />}
            {queued ? "Queued" : "Queue next"}
          </button>
        )}
      </motion.div>
    </motion.article>
  );
}
