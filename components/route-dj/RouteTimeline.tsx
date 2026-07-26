"use client";

import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import type {
  QueueItem,
  RouteHistoryItem,
  Track,
} from "@/lib/music-engine/types";
import { RouteTimelineTrack } from "@/components/route-dj/RouteTimelineTrack";

interface RouteTimelineProps {
  history: RouteHistoryItem[];
  currentTrack: Track;
  queue: QueueItem[];
  onAddNext: () => void;
  onRemove: (trackId: string) => void;
  onMove: (trackId: string, direction: "earlier" | "later") => void;
}

export function RouteTimeline({
  history,
  currentTrack,
  queue,
  onAddNext,
  onRemove,
  onMove,
}: RouteTimelineProps) {
  return (
    <section className="route-timeline" aria-label="Current music route">
      <div className="route-timeline__group route-timeline__group--past">
        <span className="route-timeline__label">Past</span>
        <div className="route-timeline__tracks">
          {history.slice(-2).map((item) => (
            <RouteTimelineTrack key={item.id} track={item.track} kind="past" />
          ))}
        </div>
      </div>
      <div className="route-timeline__group route-timeline__group--current">
        <span className="route-timeline__label">Current</span>
        <RouteTimelineTrack track={currentTrack} kind="current" />
      </div>
      <div className="route-timeline__group route-timeline__group--queued">
        <span className="route-timeline__label">Queued</span>
        <div className="route-timeline__tracks">
          <AnimatePresence initial={false}>
            {queue.map((item, index) => (
              <RouteTimelineTrack
                key={item.id}
                track={item.track}
                kind="queued"
                onRemove={() => onRemove(item.track.id)}
                onMoveEarlier={() => onMove(item.track.id, "earlier")}
                onMoveLater={() => onMove(item.track.id, "later")}
                canMoveEarlier={index > 0}
                canMoveLater={index < queue.length - 1}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <button
        id="add-next-button"
        type="button"
        className="route-timeline__add"
        onClick={onAddNext}
      >
        <Plus size={18} />
        <span>
          <strong>Add next</strong>
          <small>Search library</small>
        </span>
      </button>
    </section>
  );
}
