import type {
  CandidateTrack,
  PlaybackState,
  QueueMutationResult,
  RouteDJSession,
  RouteMode,
  Track,
  TransitionPreparationState,
} from "@/lib/music-engine/types";

export interface MusicEngine {
  getInitialSession(): Promise<RouteDJSession>;
  getRecommendations(currentTrackId: string): Promise<CandidateTrack[]>;
  searchLibrary(query: string): Promise<Track[]>;
  queueTrack(
    trackId: string,
    source?: "recommendation" | "library" | "wildcard",
  ): Promise<QueueMutationResult>;
  removeQueuedTrack(trackId: string): Promise<QueueMutationResult>;
  reorderQueuedTrack(
    trackId: string,
    direction: "earlier" | "later",
  ): Promise<QueueMutationResult>;
  selectWildcard(): Promise<CandidateTrack>;
  prepareNextTrack(): Promise<TransitionPreparationState>;
  advanceToNextTrack(): Promise<RouteDJSession>;
  returnToPreviousTrack(): Promise<RouteDJSession>;
  play(): Promise<PlaybackState>;
  pause(): Promise<PlaybackState>;
  seek(positionSeconds: number): Promise<PlaybackState>;
  setVolume(volume: number): Promise<PlaybackState>;
  setRouteMode(routeMode: RouteMode): Promise<PlaybackState>;
  reset(): Promise<RouteDJSession>;
}
