"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Search, X } from "lucide-react";
import type { Track } from "@/lib/music-engine/types";
import { TrackArtwork } from "@/components/route-dj/TrackArtwork";

interface AddNextPanelProps {
  open: boolean;
  queuedTrackIds: Set<string>;
  currentTrackId: string;
  onClose: () => void;
  onSearch: (query: string) => Promise<Track[]>;
  onAdd: (trackId: string) => Promise<void>;
}

export function AddNextPanel({
  open,
  queuedTrackIds,
  currentTrackId,
  onClose,
  onSearch,
  onAdd,
}: AddNextPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void Promise.resolve()
      .then(() => {
        setLoading(true);
        return onSearch(query);
      })
      .then((tracks) => {
        if (!cancelled) setResults(tracks);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      cancelled = true;
      window.clearTimeout(focusTimer);
    };
  }, [open, onSearch, query]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="panel-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            className="add-next-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-next-title"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <header>
              <div>
                <span className="eyebrow">Mock library</span>
                <h2 id="add-next-title">Add a track next</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close Add Next"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </header>
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search mock tracks</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, artist, mood, or genre"
              />
            </label>
            <div className="add-next-panel__results" aria-live="polite">
              {loading ? (
                <div className="panel-state">Searching the local library…</div>
              ) : results.length === 0 ? (
                <div className="panel-state">
                  <strong>No tracks found</strong>
                  <span>Try a broader mood, artist, or genre.</span>
                </div>
              ) : (
                results.map((track) => {
                  const unavailable =
                    track.id === currentTrackId || queuedTrackIds.has(track.id);
                  return (
                    <article key={track.id} className="library-track">
                      <TrackArtwork track={track} size="small" />
                      <span className="library-track__copy">
                        <strong>{track.title}</strong>
                        <span>
                          {track.artist} · {track.genre}
                        </span>
                        <small>
                          {track.bpm} BPM · {track.camelotKey} · {track.mood}
                        </small>
                      </span>
                      <button
                        type="button"
                        onClick={() => void onAdd(track.id)}
                        disabled={unavailable}
                        aria-label={`${unavailable ? "Already on route" : "Add"} ${track.title}`}
                      >
                        {unavailable ? <Check size={15} /> : <Plus size={15} />}
                        {unavailable ? "On route" : "Add"}
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
