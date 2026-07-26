import { getTrackById } from "@/data/mockTracks";
import type {
  PlaybackState,
  QueueItem,
  RouteHistoryItem,
  TransitionPreparationState,
} from "@/lib/music-engine/types";

export const INITIAL_CURRENT_TRACK_ID = "golden-horizon";

export const INITIAL_HISTORY: RouteHistoryItem[] = [
  {
    id: "history-two-choes",
    track: getTrackById("two-choes"),
    playedAt: "2026-07-26T09:00:00.000Z",
  },
  {
    id: "history-into-light",
    track: getTrackById("into-the-light"),
    playedAt: "2026-07-26T09:04:00.000Z",
  },
];

export const INITIAL_QUEUE: QueueItem[] = [
  {
    id: "queue-nightfall",
    track: getTrackById("nightfall"),
    addedAt: "2026-07-26T09:08:00.000Z",
    source: "recommendation",
  },
  {
    id: "queue-floating-point",
    track: getTrackById("floating-point"),
    addedAt: "2026-07-26T09:09:00.000Z",
    source: "recommendation",
  },
];

export const INITIAL_PLAYBACK: PlaybackState = {
  status: "paused",
  positionSeconds: 168,
  volume: 0.72,
  routeMode: "Focus",
};

export const INITIAL_TRANSITION: TransitionPreparationState = {
  status: "ready",
  trackId: "nightfall",
  message: "Next route prepared",
};
