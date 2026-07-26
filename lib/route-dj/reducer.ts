import type {
  CandidateTrack,
  PlaybackState,
  QueueItem,
  RouteDJSession,
  RouteDJState,
  TransitionPreparationState,
} from "@/lib/music-engine/types";

export const createLoadingState = (): RouteDJState => ({
  sessionStatus: "loading",
  history: [],
  currentTrack: {
    id: "loading",
    title: "Loading route",
    artist: "Route DJ",
    album: "Preparing session",
    artwork: { from: "#efe8df", to: "#d8cec1", accent: "#e87524" },
    durationSeconds: 1,
    bpm: 0,
    camelotKey: "—",
    genre: "—",
    energy: 0,
    mood: "Preparing your recommendation space",
  },
  queue: [],
  candidates: [],
  playback: {
    status: "paused",
    positionSeconds: 0,
    volume: 0.72,
    routeMode: "Focus",
  },
  transition: { status: "idle" },
  selectedCandidateId: null,
  focusedCandidateId: null,
  toast: null,
  error: null,
  debugVisible: false,
  canvasRevision: 0,
});

export type RouteDJAction =
  | { type: "sessionLoaded"; session: RouteDJSession }
  | { type: "sessionFailed"; message: string }
  | { type: "selectCandidate"; trackId: string | null }
  | { type: "focusCandidate"; trackId: string | null }
  | { type: "queueUpdated"; queue: QueueItem[]; message: string }
  | { type: "playbackUpdated"; playback: PlaybackState }
  | { type: "progressTick"; positionSeconds: number }
  | { type: "recommendationsLoading" }
  | { type: "recommendationsUpdated"; candidates: CandidateTrack[] }
  | { type: "transitionUpdated"; transition: TransitionPreparationState }
  | { type: "routeAdvanced"; session: RouteDJSession; message: string }
  | { type: "toast"; message: string | null }
  | { type: "toggleDebug" };

export const routeDJReducer = (
  state: RouteDJState,
  action: RouteDJAction,
): RouteDJState => {
  switch (action.type) {
    case "sessionLoaded":
      return {
        ...state,
        ...action.session,
        sessionStatus: "ready",
        error: null,
        selectedCandidateId: null,
        focusedCandidateId: null,
      };
    case "sessionFailed":
      return {
        ...state,
        sessionStatus: "error",
        error: action.message,
      };
    case "selectCandidate":
      return { ...state, selectedCandidateId: action.trackId };
    case "focusCandidate":
      return { ...state, focusedCandidateId: action.trackId };
    case "queueUpdated":
      return {
        ...state,
        queue: action.queue,
        toast: action.message,
      };
    case "playbackUpdated":
      return { ...state, playback: action.playback };
    case "progressTick":
      return {
        ...state,
        playback: {
          ...state.playback,
          positionSeconds: action.positionSeconds,
        },
      };
    case "recommendationsLoading":
      return {
        ...state,
        transition: {
          status: "preparing",
          message: "Mapping fresh directions",
        },
      };
    case "recommendationsUpdated":
      return {
        ...state,
        candidates: action.candidates,
        focusedCandidateId: null,
        transition: { status: "idle" },
      };
    case "transitionUpdated":
      return { ...state, transition: action.transition };
    case "routeAdvanced":
      return {
        ...state,
        ...action.session,
        selectedCandidateId: null,
        focusedCandidateId: null,
        canvasRevision: state.canvasRevision + 1,
        toast: action.message,
        sessionStatus: "ready",
        error: null,
      };
    case "toast":
      return { ...state, toast: action.message };
    case "toggleDebug":
      return {
        ...state,
        debugVisible: !state.debugVisible,
        toast: state.debugVisible
          ? "Debug states hidden"
          : "Debug states visible",
      };
    default:
      return state;
  }
};
