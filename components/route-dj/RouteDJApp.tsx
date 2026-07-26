"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { AlertTriangle, LoaderCircle, RotateCcw } from "lucide-react";
import type { MusicEngine } from "@/lib/music-engine/MusicEngine";
import { MockMusicEngine } from "@/lib/music-engine/MockMusicEngine";
import type { RouteMode } from "@/lib/music-engine/types";
import { createLoadingState, routeDJReducer } from "@/lib/route-dj/reducer";
import { getSelectedCandidate, serializeRoute } from "@/lib/route-dj/selectors";
import { AddNextPanel } from "@/components/route-dj/AddNextPanel";
import { KeyboardHelp } from "@/components/route-dj/KeyboardHelp";
import { PlayerBar } from "@/components/route-dj/PlayerBar";
import { RecommendationCanvas } from "@/components/route-dj/RecommendationCanvas";
import { RouteHeader } from "@/components/route-dj/RouteHeader";
import { StatusToast } from "@/components/route-dj/StatusToast";

interface RouteDJAppProps {
  engine?: MusicEngine;
}

const focusAddNextButton = () => {
  window.setTimeout(
    () => document.getElementById("add-next-button")?.focus(),
    20,
  );
};

export function RouteDJApp({ engine: suppliedEngine }: RouteDJAppProps) {
  const engine = useMemo(
    () => suppliedEngine ?? new MockMusicEngine(),
    [suppliedEngine],
  );
  const [state, dispatch] = useReducer(
    routeDJReducer,
    undefined,
    createLoadingState,
  );
  const [addNextOpen, setAddNextOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [wildcardLoading, setWildcardLoading] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const session = await engine.getInitialSession();
      dispatch({ type: "sessionLoaded", session });
    } catch (error) {
      dispatch({
        type: "sessionFailed",
        message:
          error instanceof Error
            ? error.message
            : "The mock route could not be loaded",
      });
    }
  }, [engine]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(
      () => dispatch({ type: "toast", message: null }),
      2600,
    );
    return () => window.clearTimeout(timer);
  }, [state.toast]);

  const handleAdvance = useCallback(async () => {
    if (state.queue.length === 0) {
      dispatch({
        type: "toast",
        message: "Queue a track to continue the route",
      });
      return;
    }
    dispatch({ type: "recommendationsLoading" });
    try {
      const session = await engine.advanceToNextTrack();
      dispatch({
        type: "routeAdvanced",
        session,
        message: `${session.currentTrack.title} is now at the center`,
      });
    } catch (error) {
      dispatch({
        type: "sessionFailed",
        message:
          error instanceof Error
            ? error.message
            : "Could not advance the route",
      });
    }
  }, [engine, state.queue.length]);

  useEffect(() => {
    if (state.playback.status !== "playing") return;
    const timer = window.setTimeout(() => {
      const nextPosition = state.playback.positionSeconds + 1;
      if (nextPosition >= state.currentTrack.durationSeconds) {
        if (state.queue.length > 0) {
          void handleAdvance();
        } else {
          void engine
            .seek(state.currentTrack.durationSeconds)
            .then(() => engine.pause())
            .then((playback) =>
              dispatch({ type: "playbackUpdated", playback }),
            );
        }
        return;
      }
      void engine.seek(nextPosition).then((playback) => {
        dispatch({ type: "playbackUpdated", playback });
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [
    engine,
    handleAdvance,
    state.currentTrack.durationSeconds,
    state.playback.positionSeconds,
    state.playback.status,
    state.queue.length,
  ]);

  const handleQueue = useCallback(
    async (
      trackId: string,
      source: "recommendation" | "library" | "wildcard" = "recommendation",
    ) => {
      try {
        const result = await engine.queueTrack(trackId, source);
        dispatch({
          type: "queueUpdated",
          queue: result.queue,
          message: result.message,
        });
        if (result.added) {
          dispatch({
            type: "transitionUpdated",
            transition: {
              status: "preparing",
              trackId,
              message: "Preparing the next mock transition",
            },
          });
          const transition = await engine.prepareNextTrack();
          dispatch({ type: "transitionUpdated", transition });
        }
      } catch (error) {
        dispatch({
          type: "transitionUpdated",
          transition: {
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "The mock transition could not be prepared",
          },
        });
        dispatch({
          type: "toast",
          message:
            error instanceof Error
              ? error.message
              : "Could not update the queue",
        });
      }
    },
    [engine],
  );

  const handleRemove = async (trackId: string) => {
    const result = await engine.removeQueuedTrack(trackId);
    dispatch({
      type: "queueUpdated",
      queue: result.queue,
      message: result.message,
    });
  };

  const handleMove = async (
    trackId: string,
    direction: "earlier" | "later",
  ) => {
    const result = await engine.reorderQueuedTrack(trackId, direction);
    dispatch({
      type: "queueUpdated",
      queue: result.queue,
      message: result.message,
    });
  };

  const handleWildcard = useCallback(async () => {
    setWildcardLoading(true);
    try {
      const candidate = await engine.selectWildcard();
      dispatch({ type: "focusCandidate", trackId: candidate.track.id });
      dispatch({ type: "selectCandidate", trackId: candidate.track.id });
      dispatch({
        type: "toast",
        message: `Surprise route selected: ${candidate.track.title}`,
      });
      window.setTimeout(
        () =>
          document.getElementById(`candidate-${candidate.track.id}`)?.focus(),
        30,
      );
    } finally {
      setWildcardLoading(false);
    }
  }, [engine]);

  const handleTogglePlayback = useCallback(async () => {
    const playback =
      state.playback.status === "playing"
        ? await engine.pause()
        : await engine.play();
    dispatch({ type: "playbackUpdated", playback });
  }, [engine, state.playback.status]);

  const handlePrevious = async () => {
    const session = await engine.returnToPreviousTrack();
    dispatch({
      type: "routeAdvanced",
      session,
      message: `${session.currentTrack.title} returned to the center`,
    });
  };

  const handleReset = async () => {
    const session = await engine.reset();
    dispatch({
      type: "routeAdvanced",
      session,
      message: "Demo route reset",
    });
  };

  const handleSearch = useCallback(
    (query: string) => engine.searchLibrary(query),
    [engine],
  );

  const handleExport = () => {
    const data = serializeRoute(state);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `route-dj-${state.currentTrack.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    dispatch({ type: "toast", message: "Mock route exported as JSON" });
  };

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;
      const isEditing =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        target.isContentEditable;
      const isInteractive =
        isEditing || tagName === "BUTTON" || tagName === "A";

      if (event.key === "?") {
        if (!isEditing) {
          event.preventDefault();
          setKeyboardOpen(true);
        }
        return;
      }
      if (addNextOpen || keyboardOpen || isEditing) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const currentId =
          state.focusedCandidateId ??
          state.selectedCandidateId ??
          state.candidates[0]?.track.id;
        const currentIndex = state.candidates.findIndex(
          (candidate) => candidate.track.id === currentId,
        );
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex =
          (currentIndex + delta + state.candidates.length) %
          state.candidates.length;
        const next = state.candidates[nextIndex];
        if (next) {
          dispatch({ type: "focusCandidate", trackId: next.track.id });
          document.getElementById(`candidate-${next.track.id}`)?.focus();
        }
      } else if (event.key === "Enter" && !isInteractive) {
        if (state.focusedCandidateId) {
          dispatch({
            type: "selectCandidate",
            trackId: state.focusedCandidateId,
          });
        }
      } else if (event.key.toLowerCase() === "q" && !isEditing) {
        const selected = getSelectedCandidate(state);
        if (selected) {
          event.preventDefault();
          void handleQueue(selected.track.id);
        }
      } else if (event.key === " " && !isInteractive) {
        event.preventDefault();
        void handleTogglePlayback();
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [addNextOpen, handleQueue, handleTogglePlayback, keyboardOpen, state]);

  if (state.sessionStatus === "loading") {
    return (
      <main className="app-state" aria-live="polite">
        <LoaderCircle className="spin" size={28} />
        <strong>Mapping your first route</strong>
        <span>Loading deterministic recommendations…</span>
      </main>
    );
  }

  if (state.sessionStatus === "error") {
    return (
      <main className="app-state app-state--error">
        <AlertTriangle size={28} />
        <strong>The mock route paused unexpectedly</strong>
        <span>{state.error}</span>
        <button type="button" onClick={() => void loadSession()}>
          <RotateCcw size={15} />
          Retry demo
        </button>
      </main>
    );
  }

  return (
    <div className="route-dj-app">
      <RouteHeader
        history={state.history}
        currentTrack={state.currentTrack}
        queue={state.queue}
        onAddNext={() => setAddNextOpen(true)}
        onRemove={(trackId) => void handleRemove(trackId)}
        onMove={(trackId, direction) => void handleMove(trackId, direction)}
        onExport={handleExport}
        onReset={() => void handleReset()}
        onToggleDebug={() => dispatch({ type: "toggleDebug" })}
        onShowKeyboard={() => setKeyboardOpen(true)}
      />
      <RecommendationCanvas
        state={state}
        onFocusCandidate={(trackId) =>
          dispatch({ type: "focusCandidate", trackId })
        }
        onSelectCandidate={(trackId) =>
          dispatch({ type: "selectCandidate", trackId })
        }
        onQueueCandidate={(trackId) => void handleQueue(trackId)}
        onWildcard={() => void handleWildcard()}
        wildcardLoading={wildcardLoading}
      />
      <PlayerBar
        track={state.currentTrack}
        playback={state.playback}
        hasPrevious={state.history.length > 0}
        hasNext={state.queue.length > 0}
        onTogglePlayback={() => void handleTogglePlayback()}
        onPrevious={() => void handlePrevious()}
        onNext={() => void handleAdvance()}
        onSeek={(position) =>
          void engine
            .seek(position)
            .then((playback) => dispatch({ type: "playbackUpdated", playback }))
        }
        onVolume={(volume) =>
          void engine
            .setVolume(volume)
            .then((playback) => dispatch({ type: "playbackUpdated", playback }))
        }
        onRouteMode={(routeMode: RouteMode) =>
          void engine
            .setRouteMode(routeMode)
            .then((playback) => dispatch({ type: "playbackUpdated", playback }))
        }
      />
      <AddNextPanel
        open={addNextOpen}
        queuedTrackIds={new Set(state.queue.map((item) => item.track.id))}
        currentTrackId={state.currentTrack.id}
        onClose={() => {
          setAddNextOpen(false);
          focusAddNextButton();
        }}
        onSearch={handleSearch}
        onAdd={(trackId) => handleQueue(trackId, "library")}
      />
      <KeyboardHelp
        open={keyboardOpen}
        onClose={() => {
          setKeyboardOpen(false);
          window.setTimeout(
            () => document.getElementById("more-actions-button")?.focus(),
            20,
          );
        }}
      />
      <StatusToast message={state.toast} />
    </div>
  );
}
