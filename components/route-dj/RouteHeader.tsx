"use client";

import { useEffect, useRef, useState } from "react";
import { Download, MoreVertical } from "lucide-react";
import type {
  QueueItem,
  RouteHistoryItem,
  Track,
} from "@/lib/music-engine/types";
import { RouteTimeline } from "@/components/route-dj/RouteTimeline";

interface RouteHeaderProps {
  history: RouteHistoryItem[];
  currentTrack: Track;
  queue: QueueItem[];
  onAddNext: () => void;
  onRemove: (trackId: string) => void;
  onMove: (trackId: string, direction: "earlier" | "later") => void;
  onExport: () => void;
  onReset: () => void;
  onToggleDebug: () => void;
  onShowKeyboard: () => void;
}

export function RouteHeader({
  history,
  currentTrack,
  queue,
  onAddNext,
  onRemove,
  onMove,
  onExport,
  onReset,
  onToggleDebug,
  onShowKeyboard,
}: RouteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  return (
    <header className="route-header">
      <a
        className="route-brand"
        href="#recommendations"
        aria-label="Route DJ home"
      >
        <span className="route-brand__mark" aria-hidden="true">
          <i />
        </span>
        <strong>Route DJ</strong>
        <span>AI assisted</span>
      </a>
      <RouteTimeline
        history={history}
        currentTrack={currentTrack}
        queue={queue}
        onAddNext={onAddNext}
        onRemove={onRemove}
        onMove={onMove}
      />
      <div className="route-header__actions">
        <button type="button" className="export-button" onClick={onExport}>
          <Download size={15} />
          Export route
        </button>
        <div className="more-menu" ref={menuRef}>
          <button
            id="more-actions-button"
            type="button"
            className="icon-button"
            aria-label="More prototype actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="more-menu__panel" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onReset();
                  setMenuOpen(false);
                }}
              >
                Reset demo
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggleDebug();
                  setMenuOpen(false);
                }}
              >
                Toggle debug states
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onShowKeyboard();
                  setMenuOpen(false);
                }}
              >
                View keyboard controls
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
