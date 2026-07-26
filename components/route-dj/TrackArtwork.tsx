import type { CSSProperties } from "react";
import type { Track } from "@/lib/music-engine/types";

interface TrackArtworkProps {
  track: Track;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function TrackArtwork({
  track,
  size = "medium",
  className = "",
}: TrackArtworkProps) {
  const style = {
    "--art-from": track.artwork.from,
    "--art-to": track.artwork.to,
    "--art-accent": track.artwork.accent,
  } as CSSProperties;

  return (
    <div
      className={`track-artwork track-artwork--${size} ${className}`}
      style={style}
      role="img"
      aria-label={`Abstract artwork for ${track.title}`}
    >
      <span className="track-artwork__orb" />
      <span className="track-artwork__ridge track-artwork__ridge--back" />
      <span className="track-artwork__ridge track-artwork__ridge--front" />
    </div>
  );
}
