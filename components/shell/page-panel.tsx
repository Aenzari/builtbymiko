"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { snappySpring } from "@/lib/motion";

interface PagePanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * The large rounded container every page's content sits in. A faint sage
 * wash in the corner gives it depth without adding another color.
 */
export function PagePanel({ children, className = "" }: PagePanelProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ ...snappySpring, delay: 0.15 }}
      className={`specular-border rounded-3xl bg-surface-900/70 p-4 shadow-glass backdrop-blur-xl sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
