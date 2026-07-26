"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Volume2 } from "lucide-react";
import type { PlaybackState, RouteMode, Track } from "@/lib/music-engine/types";
import { ROUTE_MODES } from "@/lib/route-dj/constants";
import { formatTime } from "@/lib/route-dj/selectors";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";

interface PlayerBarProps {
  track: Track;
  playback: PlaybackState;
  hasPrevious: boolean;
  hasNext: boolean;
  onTogglePlayback: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (position: number) => void;
  onVolume: (volume: number) => void;
  onRouteMode: (routeMode: RouteMode) => void;
}

const waveform = [
  26, 48, 34, 62, 44, 73, 36, 58, 82, 49, 67, 31, 52, 74, 41, 64, 29, 57, 78,
  45, 61, 37, 70, 53, 33, 66, 42, 76, 51, 63, 35, 55, 72, 46, 60, 39, 68, 43,
  58, 32,
];

export function PlayerBar({
  track,
  playback,
  hasPrevious,
  hasNext,
  onTogglePlayback,
  onPrevious,
  onNext,
  onSeek,
  onVolume,
  onRouteMode,
}: PlayerBarProps) {
  const progress = Math.min(
    100,
    (playback.positionSeconds / track.durationSeconds) * 100,
  );

  return (
    <footer className="player-bar" aria-label="Route DJ player">
      <div className="player-bar__track">
        <TrackArtwork track={track} size="small" />
        <span>
          <strong>{track.title}</strong>
          <small>{track.artist}</small>
          <small>
            {track.bpm} BPM · {track.camelotKey}
          </small>
        </span>
      </div>
      <label className="route-mode">
        <span>AI route mode</span>
        <select
          aria-label="Route mode"
          value={playback.routeMode}
          onChange={(event) => onRouteMode(event.target.value as RouteMode)}
        >
          {ROUTE_MODES.map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
        </select>
      </label>
      <div className="player-progress">
        <div className="player-progress__wave" aria-hidden="true">
          {waveform.map((height, index) => (
            <i
              key={`${height}-${index}`}
              style={{
                height: `${height}%`,
                opacity: index / waveform.length <= progress / 100 ? 1 : 0.18,
              }}
            />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={track.durationSeconds}
          step={1}
          value={Math.min(playback.positionSeconds, track.durationSeconds)}
          aria-label="Seek through current track"
          onChange={(event) => onSeek(Number(event.target.value))}
        />
        <span>
          {formatTime(playback.positionSeconds)} /{" "}
          {formatTime(track.durationSeconds)}
        </span>
      </div>
      <div className="player-controls">
        <button
          type="button"
          aria-label="Previous track"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          <ChevronLeft size={21} />
        </button>
        <button
          type="button"
          className="player-controls__primary"
          aria-label={playback.status === "playing" ? "Pause" : "Play"}
          aria-pressed={playback.status === "playing"}
          onClick={onTogglePlayback}
        >
          {playback.status === "playing" ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
        <button
          type="button"
          aria-label="Next track"
          onClick={onNext}
          disabled={!hasNext}
        >
          <ChevronRight size={21} />
        </button>
      </div>
      <div className="player-details">
        <span>
          <small>Key</small>
          <strong>{track.camelotKey}</strong>
        </span>
        <span>
          <small>Energy</small>
          <strong>{track.energy >= 70 ? "Med-high" : "Balanced"}</strong>
          <i>
            <b style={{ width: `${track.energy}%` }} />
          </i>
        </span>
      </div>
      <label className="volume-control">
        <Volume2 size={17} />
        <span className="sr-only">Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={playback.volume}
          onChange={(event) => onVolume(Number(event.target.value))}
        />
      </label>
    </footer>
  );
}
