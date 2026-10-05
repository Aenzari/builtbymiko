"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ClipRevealText } from "@/components/hero/clip-reveal-text";

interface PageHeaderProps {
  /** Small uppercase label above the headline, e.g. "Projects". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional element aligned to the right on wide screens (a CTA, usually). */
  action?: ReactNode;
  /** Use the per-character clip reveal for the headline. Reserve for the home page. */
  reveal?: boolean;
}

const TITLE_CLASS =
  "mt-3 max-w-[14ch] font-sans text-5xl font-medium leading-[0.94] tracking-[-0.07em] text-ink-100 sm:text-7xl lg:text-8xl";

/**
 * The header every page shares: eyebrow, large headline, muted subline, and
 * an optional action. Inner pages differ only in what they put below it.
 */
export function PageHeader({ eyebrow, title, subtitle, action, reveal = false }: PageHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <header className="relative mb-12 flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <motion.span
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-accent"
        >
          {eyebrow}
        </motion.span>

        {reveal ? (
          <ClipRevealText as="h1" text={title} startDelay={0.1} className={TITLE_CLASS} />
        ) : (
          <motion.h1 {...fadeUp} transition={{ duration: 0.5, delay: 0.05 }} className={TITLE_CLASS}>
            {title}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: reveal ? 0.6 : 0.12 }}
            className="mt-6 max-w-[48ch] font-sans text-base leading-relaxed text-ink-400 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shrink-0 sm:pt-2"
        >
          {action}
        </motion.div>
      )}
    </header>
  );
}
