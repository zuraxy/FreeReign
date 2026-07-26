"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface StatusToastProps {
  message: string | null;
}

export function StatusToast({ message }: StatusToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="status-toast"
          role="status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
        >
          <CheckCircle2 size={16} />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
