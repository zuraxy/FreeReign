"use client";

import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";

interface WildcardControlProps {
  onSelect: () => void;
  loading: boolean;
}

export function WildcardControl({ onSelect, loading }: WildcardControlProps) {
  return (
    <motion.button
      type="button"
      className="wildcard-control"
      onClick={onSelect}
      disabled={loading}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="wildcard-control__icon">
        <Shuffle size={18} />
      </span>
      <span>
        <strong>{loading ? "Finding a route…" : "Wildcard"}</strong>
        <small>Surprise me</small>
      </span>
    </motion.button>
  );
}
