"use client";

import { AnimatePresence, motion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface SubmitButtonProps {
  status: SubmitStatus;
}

const LABELS: Record<SubmitStatus, string> = {
  idle: "Send inquiry",
  submitting: "Sending…",
  success: "Sent — talk soon",
  error: "Something went wrong",
};

/**
 * A single button that morphs its internal content across four states
 * rather than swapping in a separate success/error banner component. The
 * label crossfades with a slight vertical slide (`AnimatePresence mode="wait"`)
 * and the button itself plays a spring-driven pop on success versus a short
 * shake on error, so the feedback reads as one continuous object reacting,
 * not a new element appearing.
 */
export function SubmitButton({ status }: SubmitButtonProps) {
  const isDisabled = status === "submitting";

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileTap={status === "idle" ? { scale: tapScale.button } : undefined}
      animate={
        status === "success"
          ? { scale: [1, 1.04, 1] }
          : status === "error"
          ? { x: [0, -5, 5, -3, 3, 0] }
          : { scale: 1, x: 0 }
      }
      transition={status === "error" ? { duration: 0.4 } : snappySpring}
      className={`focus-ring specular-border flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 font-sans text-sm font-medium transition-colors duration-300 sm:w-auto ${
        status === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
          : status === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-700"
          : "border-black/[0.08] bg-surface-800/80 text-ink-100 hover:border-black/[0.16]"
      } ${isDisabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
    >
      <StatusIcon status={status} />
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {LABELS[status]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function StatusIcon({ status }: { status: SubmitStatus }) {
  if (status === "submitting") {
    return (
      <motion.span
        aria-hidden="true"
        className="block h-3.5 w-3.5 rounded-full border-2 border-black/[0.12] border-t-[#2B2B26]/70"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      />
    );
  }
  if (status === "success") {
    return (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <motion.path
          d="M2.5 7.2 5.6 10.3 11.5 3.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
    );
  }
  if (status === "error") {
    return (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3.5v4M7 10v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}
