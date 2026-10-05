"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";
import { deleteProject } from "@/lib/actions/project-actions";

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

/**
 * A two-step "arm, then confirm" control rather than a blocking
 * `window.confirm()` — stays inside the app's own visual language and gives
 * a 4-second window to back out before the armed state auto-resets.
 */
export function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const [isArmed, setIsArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFirstTap() {
    setIsArmed(true);
    setError(null);
    window.setTimeout(() => setIsArmed(false), 4000);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.error) {
        setError(result.error);
        setIsArmed(false);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <AnimatePresence mode="wait">
        {isArmed ? (
          <motion.button
            key="confirm"
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: tapScale.button }}
            transition={snappySpring}
            className="rounded-full bg-red-600 px-3.5 py-1.5 font-sans text-xs font-medium text-white outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] disabled:opacity-60"
          >
            {isPending ? "Deleting…" : `Confirm delete "${projectTitle}"`}
          </motion.button>
        ) : (
          <motion.button
            key="arm"
            type="button"
            onClick={handleFirstTap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: tapScale.button }}
            transition={snappySpring}
            className="rounded-full border border-black/[0.08] px-3.5 py-1.5 font-sans text-xs text-[#8A2E2E] outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
          >
            Delete
          </motion.button>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-xs text-red-600"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
