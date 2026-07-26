import type {
  CandidateTrack,
  RouteDJState,
  RouteExport,
} from "@/lib/music-engine/types";

export const getSelectedCandidate = (
  state: RouteDJState,
): CandidateTrack | null =>
  state.candidates.find(
    (candidate) => candidate.track.id === state.selectedCandidateId,
  ) ?? null;

export const isTrackQueued = (
  state: Pick<RouteDJState, "queue">,
  trackId: string,
): boolean => state.queue.some((item) => item.track.id === trackId);

export const serializeRoute = (
  state: Pick<RouteDJState, "history" | "currentTrack" | "queue" | "playback">,
  exportedAt = new Date().toISOString(),
): RouteExport => ({
  pastTracks: state.history.map((item) => item.track),
  currentTrack: state.currentTrack,
  queuedTracks: state.queue.map((item) => item.track),
  exportedAt,
  routeMode: state.playback.routeMode,
});

export const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};
