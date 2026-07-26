"use client";

import { useEffect, useMemo, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { LocateFixed } from "lucide-react";
import type { RouteDJState } from "@/lib/music-engine/types";
import { MAX_CANVAS_PAN } from "@/lib/route-dj/constants";
import { CANDIDATE_POSITIONS } from "@/lib/route-dj/positioning";
import { isTrackQueued } from "@/lib/route-dj/selectors";
import { CandidateTrackCard } from "@/components/route-dj/CandidateTrackCard";
import { ConnectorLayer } from "@/components/route-dj/ConnectorLayer";
import { CurrentTrackCard } from "@/components/route-dj/CurrentTrackCard";
import { DirectionAxis } from "@/components/route-dj/DirectionAxis";
import { RoutingGuide } from "@/components/route-dj/RoutingGuide";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";
import { WildcardControl } from "@/components/route-dj/WildcardControl";

interface RecommendationCanvasProps {
  state: RouteDJState;
  onFocusCandidate: (trackId: string | null) => void;
  onSelectCandidate: (trackId: string) => void;
  onQueueCandidate: (trackId: string) => void;
  onWildcard: () => void;
  wildcardLoading: boolean;
}

export function RecommendationCanvas({
  state,
  onFocusCandidate,
  onSelectCandidate,
  onQueueCandidate,
  onWildcard,
  wildcardLoading,
}: RecommendationCanvasProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [panned, setPanned] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    void Promise.all([
      animate(x, 0, { duration: reduceMotion ? 0 : 0.42 }),
      animate(y, 0, { duration: reduceMotion ? 0 : 0.42 }),
    ]).then(() => setPanned(false));
  }, [state.canvasRevision, reduceMotion, x, y]);

  const activeCandidate = useMemo(
    () =>
      state.candidates.find(
        (candidate) =>
          candidate.track.id ===
          (state.focusedCandidateId ?? state.selectedCandidateId),
      ) ?? null,
    [state.candidates, state.focusedCandidateId, state.selectedCandidateId],
  );

  const resetCanvas = () => {
    animate(x, 0, { duration: reduceMotion ? 0 : 0.35 });
    animate(y, 0, { duration: reduceMotion ? 0 : 0.35 });
    setPanned(false);
  };

  return (
    <main
      id="recommendations"
      className="recommendation-canvas"
      aria-label="Music direction recommendations"
    >
      <p className="canvas-instruction">
        Choose a direction for where the music should go next
      </p>
      <DirectionAxis />
      <RoutingGuide />
      <WildcardControl onSelect={onWildcard} loading={wildcardLoading} />
      <div className="peripheral peripheral--left" aria-hidden="true">
        <TrackArtwork
          track={state.candidates[7]?.track ?? state.currentTrack}
        />
      </div>
      <div className="peripheral peripheral--right" aria-hidden="true">
        <TrackArtwork
          track={state.candidates[3]?.track ?? state.currentTrack}
        />
      </div>
      <motion.div
        className="constellation-stage"
        style={{ x, y }}
        drag={isCompact ? "x" : true}
        dragConstraints={{
          left: -MAX_CANVAS_PAN,
          right: MAX_CANVAS_PAN,
          top: -MAX_CANVAS_PAN / 2,
          bottom: MAX_CANVAS_PAN / 2,
        }}
        dragElastic={0.08}
        onDrag={(_, info) =>
          setPanned(Math.abs(info.offset.x) + Math.abs(info.offset.y) > 8)
        }
      >
        <ConnectorLayer activeLabel={activeCandidate?.label ?? null} />
        <div className="current-position">
          <CurrentTrackCard
            track={state.currentTrack}
            revision={state.canvasRevision}
          />
        </div>
        <div className="candidate-rail">
          {state.candidates.map((candidate, index) => {
            const position = CANDIDATE_POSITIONS[candidate.label];
            const activeId =
              state.focusedCandidateId ?? state.selectedCandidateId;
            return (
              <div
                className="candidate-position"
                data-label={candidate.label}
                key={candidate.track.id}
                style={
                  {
                    "--candidate-x": `${position.x}%`,
                    "--candidate-y": `${position.y}%`,
                    "--candidate-opacity": position.opacity,
                    "--entrance-delay": `${index * 45}ms`,
                  } as React.CSSProperties
                }
              >
                <CandidateTrackCard
                  candidate={candidate}
                  selected={state.selectedCandidateId === candidate.track.id}
                  focused={state.focusedCandidateId === candidate.track.id}
                  subdued={Boolean(activeId && activeId !== candidate.track.id)}
                  queued={isTrackQueued(state, candidate.track.id)}
                  onFocus={() => onFocusCandidate(candidate.track.id)}
                  onBlur={() => onFocusCandidate(null)}
                  onSelect={() => onSelectCandidate(candidate.track.id)}
                  onQueue={() => onQueueCandidate(candidate.track.id)}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
      {panned && (
        <button type="button" className="return-center" onClick={resetCanvas}>
          <LocateFixed size={15} />
          Return to center
        </button>
      )}
      {state.transition.status === "preparing" && (
        <div className="canvas-loading" role="status">
          <span />
          {state.transition.message}
        </div>
      )}
      {state.debugVisible && (
        <aside className="debug-panel" aria-label="Prototype debug state">
          <strong>Mock engine</strong>
          <span>Session: {state.sessionStatus}</span>
          <span>Transition: {state.transition.status}</span>
          <span>Revision: {state.canvasRevision}</span>
          <span>Selected: {state.selectedCandidateId ?? "none"}</span>
        </aside>
      )}
    </main>
  );
}
