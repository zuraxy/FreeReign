import {
  INITIAL_CURRENT_TRACK_ID,
  INITIAL_HISTORY,
  INITIAL_PLAYBACK,
  INITIAL_QUEUE,
  INITIAL_TRANSITION,
} from "@/data/mockSession";
import { getTrackById, MOCK_TRACKS } from "@/data/mockTracks";
import type { MusicEngine } from "@/lib/music-engine/MusicEngine";
import type {
  CandidateLabel,
  CandidateTrack,
  CompatibilityTone,
  MatchMetric,
  PlaybackState,
  QueueMutationResult,
  RouteDJSession,
  RouteMode,
  Track,
  TransitionPreparationState,
} from "@/lib/music-engine/types";
import {
  CANDIDATE_LABELS,
  DIRECTION_BY_LABEL,
  MOCK_DELAYS,
} from "@/lib/route-dj/constants";

type MockOperation =
  "session" | "recommendations" | "search" | "queue" | "prepare" | "advance";

export interface MockMusicEngineOptions {
  delayScale?: number;
  failOnce?: MockOperation[];
}

const clone = <T>(value: T): T => structuredClone(value);

const toneForScore = (score: number): CompatibilityTone => {
  if (score >= 85) return "close";
  if (score >= 70) return "moderate";
  if (score >= 52) return "noticeable";
  return "far";
};

const keyDistance = (first: string, second: string): number => {
  const firstNumber = Number.parseInt(first, 10);
  const secondNumber = Number.parseInt(second, 10);
  const raw = Math.abs(firstNumber - secondNumber);
  return Math.min(raw, 12 - raw);
};

const scoreTrack = (current: Track, candidate: Track) => {
  const keyDelta = keyDistance(current.camelotKey, candidate.camelotKey);
  const keyScore = Math.max(
    28,
    98 -
      keyDelta * 14 -
      (current.camelotKey.slice(-1) === candidate.camelotKey.slice(-1) ? 0 : 8),
  );
  const bpmScore = Math.max(
    24,
    100 - Math.abs(current.bpm - candidate.bpm) * 6,
  );
  const sameGenre = current.genre === candidate.genre;
  const relatedGenre =
    current.genre.includes("House") && candidate.genre.includes("House");
  const genreScore = sameGenre ? 96 : relatedGenre ? 76 : 46;
  const overall = Math.round((keyScore + bpmScore + genreScore) / 3);

  return {
    keyScore,
    bpmScore,
    genreScore,
    overall,
    exploration: 100 - overall,
    energyDelta: candidate.energy - current.energy,
  };
};

const metric = (
  label: MatchMetric["label"],
  value: number,
  detail: string,
): MatchMetric => ({
  label,
  value,
  tone: toneForScore(value),
  detail,
});

const candidateRank = (
  label: CandidateLabel,
  current: Track,
  track: Track,
): number => {
  const score = scoreTrack(current, track);
  switch (label) {
    case "A":
      return score.energyDelta * 4 + score.overall;
    case "B":
      return score.energyDelta * 2 + score.exploration * 2;
    case "C":
      return score.exploration * 3 - Math.abs(score.energyDelta);
    case "D":
      return -score.energyDelta * 2 + score.exploration * 2;
    case "E":
      return -score.energyDelta * 4 + score.overall;
    case "F":
      return -score.energyDelta * 2 + score.overall * 2;
    case "G":
      return score.overall * 3 - Math.abs(score.energyDelta);
    case "H":
      return score.energyDelta * 2 + score.overall * 2;
  }
};

export const buildMockRecommendations = (
  currentTrackId: string,
): CandidateTrack[] => {
  const current = getTrackById(currentTrackId);
  const unused = new Set(
    MOCK_TRACKS.filter((track) => track.id !== currentTrackId).map(
      (track) => track.id,
    ),
  );

  return CANDIDATE_LABELS.map((label) => {
    const track = MOCK_TRACKS.filter((item) => unused.has(item.id)).sort(
      (a, b) =>
        candidateRank(label, current, b) - candidateRank(label, current, a) ||
        a.title.localeCompare(b.title),
    )[0];
    unused.delete(track.id);
    const score = scoreTrack(current, track);
    const direction = DIRECTION_BY_LABEL[label];

    return {
      track,
      label,
      direction,
      metrics: [
        metric(
          "Key",
          score.keyScore,
          `${current.camelotKey} → ${track.camelotKey}`,
        ),
        metric(
          "BPM",
          score.bpmScore,
          `${Math.abs(current.bpm - track.bpm)} BPM apart`,
        ),
        metric(
          "Genre",
          score.genreScore,
          current.genre === track.genre ? "Same genre" : track.genre,
        ),
      ],
      overallCompatibility: score.overall,
      explorationScore: score.exploration,
      energyDelta: score.energyDelta,
      explanation: `${score.energyDelta >= 0 ? "Lifts" : "Eases"} energy by ${Math.abs(score.energyDelta)} points with ${score.overall >= 75 ? "a familiar musical thread" : "a deliberate change of texture"}.`,
    };
  });
};

export class MockMusicEngine implements MusicEngine {
  private session: RouteDJSession;
  private readonly delayScale: number;
  private readonly failures: Set<MockOperation>;
  private eventIndex = 0;

  constructor(options: MockMusicEngineOptions = {}) {
    this.delayScale = options.delayScale ?? 1;
    this.failures = new Set(options.failOnce ?? []);
    this.session = this.createInitialSession();
  }

  private createInitialSession(): RouteDJSession {
    return {
      history: clone(INITIAL_HISTORY),
      currentTrack: clone(getTrackById(INITIAL_CURRENT_TRACK_ID)),
      queue: clone(INITIAL_QUEUE),
      candidates: buildMockRecommendations(INITIAL_CURRENT_TRACK_ID),
      playback: clone(INITIAL_PLAYBACK),
      transition: clone(INITIAL_TRANSITION),
    };
  }

  private async delay(
    duration: number,
    operation: MockOperation,
  ): Promise<void> {
    if (this.failures.delete(operation)) {
      throw new Error(`Mock ${operation} failure`);
    }
    const wait = Math.round(duration * this.delayScale);
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }

  private timestamp(): string {
    this.eventIndex += 1;
    return new Date(
      Date.UTC(2026, 6, 26, 9, 10, this.eventIndex),
    ).toISOString();
  }

  async getInitialSession(): Promise<RouteDJSession> {
    await this.delay(MOCK_DELAYS.session, "session");
    this.session = this.createInitialSession();
    return clone(this.session);
  }

  async reset(): Promise<RouteDJSession> {
    this.session = this.createInitialSession();
    await this.delay(MOCK_DELAYS.mutation, "session");
    return clone(this.session);
  }

  async getRecommendations(currentTrackId: string): Promise<CandidateTrack[]> {
    await this.delay(MOCK_DELAYS.recommendations, "recommendations");
    const candidates = buildMockRecommendations(currentTrackId);
    if (this.session.currentTrack.id === currentTrackId) {
      this.session.candidates = candidates;
    }
    return clone(candidates);
  }

  async searchLibrary(query: string): Promise<Track[]> {
    await this.delay(MOCK_DELAYS.search, "search");
    const normalized = query.trim().toLowerCase();
    if (!normalized) return clone(MOCK_TRACKS);

    return clone(
      MOCK_TRACKS.filter((track) =>
        [track.title, track.artist, track.album, track.genre, track.mood].some(
          (value) => value.toLowerCase().includes(normalized),
        ),
      ),
    );
  }

  async queueTrack(
    trackId: string,
    source: "recommendation" | "library" | "wildcard" = "recommendation",
  ): Promise<QueueMutationResult> {
    await this.delay(MOCK_DELAYS.mutation, "queue");
    if (
      this.session.currentTrack.id === trackId ||
      this.session.queue.some((item) => item.track.id === trackId)
    ) {
      return {
        queue: clone(this.session.queue),
        added: false,
        message: "That track is already on this route",
      };
    }

    const track = getTrackById(trackId);
    this.session.queue.push({
      id: `queue-${trackId}-${this.eventIndex + 1}`,
      track,
      addedAt: this.timestamp(),
      source,
    });
    return {
      queue: clone(this.session.queue),
      added: true,
      message: `${track.title} added next`,
    };
  }

  async removeQueuedTrack(trackId: string): Promise<QueueMutationResult> {
    await this.delay(MOCK_DELAYS.mutation, "queue");
    const before = this.session.queue.length;
    this.session.queue = this.session.queue.filter(
      (item) => item.track.id !== trackId,
    );
    return {
      queue: clone(this.session.queue),
      added: false,
      message:
        before === this.session.queue.length
          ? "Track was not in the queue"
          : "Track removed from the route",
    };
  }

  async reorderQueuedTrack(
    trackId: string,
    direction: "earlier" | "later",
  ): Promise<QueueMutationResult> {
    await this.delay(MOCK_DELAYS.mutation, "queue");
    const index = this.session.queue.findIndex(
      (item) => item.track.id === trackId,
    );
    const target = direction === "earlier" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= this.session.queue.length) {
      return {
        queue: clone(this.session.queue),
        added: false,
        message: "Track is already at the route edge",
      };
    }
    [this.session.queue[index], this.session.queue[target]] = [
      this.session.queue[target],
      this.session.queue[index],
    ];
    return {
      queue: clone(this.session.queue),
      added: false,
      message: "Queued route reordered",
    };
  }

  async selectWildcard(): Promise<CandidateTrack> {
    await this.delay(MOCK_DELAYS.mutation, "recommendations");
    const exploratory = [...this.session.candidates]
      .filter(
        (candidate) =>
          candidate.direction.includes("exploratory") ||
          candidate.direction === "exploratory",
      )
      .sort(
        (a, b) =>
          b.explorationScore - a.explorationScore ||
          a.label.localeCompare(b.label),
      );
    return clone(exploratory[0] ?? this.session.candidates[2]);
  }

  async prepareNextTrack(): Promise<TransitionPreparationState> {
    const next = this.session.queue[0];
    if (!next) {
      this.session.transition = {
        status: "idle",
        message: "Queue a track to prepare the route",
      };
      return clone(this.session.transition);
    }
    this.session.transition = {
      status: "preparing",
      trackId: next.track.id,
      message: "Preparing the next mock transition",
    };
    await this.delay(MOCK_DELAYS.preparation, "prepare");
    this.session.transition = {
      status: "ready",
      trackId: next.track.id,
      message: "Next route prepared",
    };
    return clone(this.session.transition);
  }

  async advanceToNextTrack(): Promise<RouteDJSession> {
    await this.delay(MOCK_DELAYS.mutation, "advance");
    const next = this.session.queue.shift();
    if (!next) {
      this.session.playback.status = "paused";
      return clone(this.session);
    }
    this.session.history.push({
      id: `history-${this.session.currentTrack.id}-${this.eventIndex + 1}`,
      track: this.session.currentTrack,
      playedAt: this.timestamp(),
    });
    this.session.currentTrack = next.track;
    this.session.candidates = buildMockRecommendations(next.track.id);
    this.session.playback = {
      ...this.session.playback,
      positionSeconds: 0,
    };
    this.session.transition = this.session.queue[0]
      ? {
          status: "ready",
          trackId: this.session.queue[0].track.id,
          message: "Next route prepared",
        }
      : { status: "idle" };
    return clone(this.session);
  }

  async returnToPreviousTrack(): Promise<RouteDJSession> {
    await this.delay(MOCK_DELAYS.mutation, "advance");
    const previous = this.session.history.pop();
    if (!previous) return clone(this.session);
    this.session.queue.unshift({
      id: `queue-${this.session.currentTrack.id}-${this.eventIndex + 1}`,
      track: this.session.currentTrack,
      addedAt: this.timestamp(),
      source: "recommendation",
    });
    this.session.currentTrack = previous.track;
    this.session.candidates = buildMockRecommendations(previous.track.id);
    this.session.playback.positionSeconds = 0;
    return clone(this.session);
  }

  async play(): Promise<PlaybackState> {
    this.session.playback.status = "playing";
    return clone(this.session.playback);
  }

  async pause(): Promise<PlaybackState> {
    this.session.playback.status = "paused";
    return clone(this.session.playback);
  }

  async seek(positionSeconds: number): Promise<PlaybackState> {
    this.session.playback.positionSeconds = Math.max(
      0,
      Math.min(positionSeconds, this.session.currentTrack.durationSeconds),
    );
    return clone(this.session.playback);
  }

  async setVolume(volume: number): Promise<PlaybackState> {
    this.session.playback.volume = Math.max(0, Math.min(volume, 1));
    return clone(this.session.playback);
  }

  async setRouteMode(routeMode: RouteMode): Promise<PlaybackState> {
    this.session.playback.routeMode = routeMode;
    return clone(this.session.playback);
  }
}
