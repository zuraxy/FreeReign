"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { KEYBOARD_HELP } from "@/lib/route-dj/constants";

interface KeyboardHelpProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardHelp({ open, onClose }: KeyboardHelpProps) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="panel-backdrop panel-backdrop--centered"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            className="keyboard-help"
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-title"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <header>
              <Keyboard size={20} />
              <h2 id="keyboard-title">Keyboard controls</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close keyboard controls"
                onClick={onClose}
                autoFocus
              >
                <X size={17} />
              </button>
            </header>
            <dl>
              {KEYBOARD_HELP.map(([keys, action]) => (
                <div key={keys}>
                  <dt>{keys}</dt>
                  <dd>{action}</dd>
                </div>
              ))}
            </dl>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
