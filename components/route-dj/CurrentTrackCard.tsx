"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Track } from "@/lib/music-engine/types";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";

interface CurrentTrackCardProps {
  track: Track;
  revision: number;
}

export function CurrentTrackCard({ track, revision }: CurrentTrackCardProps) {
  return (
    <motion.article
      key={`${track.id}-${revision}`}
      className="current-track-card"
      initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 170, damping: 22 }}
      aria-label={`Centered current track: ${track.title} by ${track.artist}`}
    >
      <span className="current-track-card__eyebrow">
        <Sparkles size={11} aria-hidden="true" />
        Current
      </span>
      <TrackArtwork track={track} size="large" />
      <h2>{track.title}</h2>
      <p>{track.artist}</p>
      <p className="current-track-card__meta">
        {track.bpm} BPM · {track.camelotKey}
      </p>
      <p className="current-track-card__genre">{track.genre}</p>
      <div className="current-track-card__facts" aria-label="Track details">
        <span>
          <small>Key</small>
          {track.camelotKey}
        </span>
        <span>
          <small>BPM</small>
          {track.bpm}
        </span>
        <span>
          <small>Energy</small>
          {track.energy}
        </span>
      </div>
    </motion.article>
  );
}
