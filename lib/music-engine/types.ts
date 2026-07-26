export type CandidateLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type MusicDirection =
  | "higher-energy"
  | "higher-exploratory"
  | "exploratory"
  | "lower-exploratory"
  | "lower-energy"
  | "lower-safer"
  | "safer"
  | "higher-safer";

export type CompatibilityTone = "close" | "moderate" | "noticeable" | "far";

export interface ArtworkPalette {
  from: string;
  to: string;
  accent: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: ArtworkPalette;
  durationSeconds: number;
  bpm: number;
  camelotKey: string;
  genre: string;
  energy: number;
  mood: string;
}

export interface MatchMetric {
  label: "Key" | "BPM" | "Genre";
  value: number;
  tone: CompatibilityTone;
  detail: string;
}

export interface CandidateTrack {
  track: Track;
  label: CandidateLabel;
  direction: MusicDirection;
  metrics: MatchMetric[];
  overallCompatibility: number;
  explorationScore: number;
  energyDelta: number;
  explanation?: string;
}

export interface RouteHistoryItem {
  id: string;
  track: Track;
  playedAt: string;
}

export interface QueueItem {
  id: string;
  track: Track;
  addedAt: string;
  source: "recommendation" | "library" | "wildcard";
}

export type RouteMode = "Focus" | "Discovery" | "Drift";

export interface PlaybackState {
  status: "playing" | "paused";
  positionSeconds: number;
  volume: number;
  routeMode: RouteMode;
}

export interface TransitionPreparationState {
  status: "idle" | "preparing" | "ready" | "error";
  trackId?: string;
  message?: string;
}

export interface RouteDJSession {
  history: RouteHistoryItem[];
  currentTrack: Track;
  queue: QueueItem[];
  candidates: CandidateTrack[];
  playback: PlaybackState;
  transition: TransitionPreparationState;
}

export interface RouteDJState extends RouteDJSession {
  sessionStatus: "loading" | "ready" | "error";
  selectedCandidateId: string | null;
  focusedCandidateId: string | null;
  toast: string | null;
  error: string | null;
  debugVisible: boolean;
  canvasRevision: number;
}

export interface QueueMutationResult {
  queue: QueueItem[];
  added: boolean;
  message: string;
}

export interface RouteExport {
  pastTracks: Track[];
  currentTrack: Track;
  queuedTracks: Track[];
  exportedAt: string;
  routeMode: RouteMode;
}
