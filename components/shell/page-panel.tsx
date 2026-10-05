"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
      transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`specular-border rounded-[2rem] bg-surface-900/70 p-3 shadow-glass backdrop-blur-xl sm:p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}
