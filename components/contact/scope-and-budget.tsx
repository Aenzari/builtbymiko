"use client";

import { motion, useReducedMotion } from "framer-motion";
import { layoutSpring, snappySpring, tapScale } from "@/lib/motion";

const SCOPE_OPTIONS = [
  "Web App",
  "Database Design",
  "Full-Stack Build",
  "UI and Interaction",
  "Internship",
  "Something else",
] as const;

interface ScopeTagSelectorProps {
  selected: string[];
  onToggle: (tag: string) => void;
  error?: string;
}

/**
 * Multi-select scope tags. Each pill toggles independently (no shared
 * layoutId, since more than one can be active at once) — feedback is a
 * background/border swap plus the standard tap-compression spring.
 */
export function ScopeTagSelector({ selected, onToggle, error }: ScopeTagSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-500">
        What is it about?
      </legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Topics">
        {SCOPE_OPTIONS.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <motion.button
              key={tag}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(tag)}
              whileTap={{ scale: tapScale.button }}
              transition={snappySpring}
              className={`focus-ring rounded-full border px-4 py-2 font-sans text-sm transition-colors duration-200 ${
                isActive
                  ? "border-accent/40 bg-accent/15 text-ink-100"
                  : "border-black/[0.08] bg-black/[0.02] text-ink-400 hover:border-black/[0.12]"
              }`}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-sans text-xs text-red-600"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </fieldset>
  );
}

const BUDGET_OPTIONS = ["Freelance project", "Internship", "Collaboration", "Just saying hi"] as const;

interface BudgetSelectorProps {
  selected: string | null;
  onSelect: (value: string) => void;
  error?: string;
}

/**
 * Single-select budget pills sharing a `layoutId` active backdrop — same
 * gliding-pill pattern used by the navbar and skills filter, scoped to its
 * own layoutId so the three never collide.
 */
export function BudgetSelector({ selected, onSelect, error }: BudgetSelectorProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <fieldset>
      <legend className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-500">
        What kind of message?
      </legend>
      <div
        className="specular-border flex w-full flex-wrap items-center gap-1 rounded-2xl bg-surface-900/60 p-1.5 backdrop-blur-md sm:inline-flex sm:w-fit"
        role="radiogroup"
        aria-label="Kind of message"
      >
        {BUDGET_OPTIONS.map((option) => {
          const isActive = option === selected;
          return (
            <motion.button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(option)}
              whileTap={{ scale: tapScale.button }}
              transition={snappySpring}
              className="focus-ring relative rounded-full px-3 py-1.5 font-sans text-sm text-ink-400 transition-colors duration-200"
              style={{ color: isActive ? "#2B2B26" : undefined }}
            >
              {isActive && (
                <motion.span
                  layoutId="budget-active-pill"
                  className="specular-border absolute inset-0 rounded-full bg-accent/15"
                  transition={prefersReducedMotion ? { duration: 0.15 } : layoutSpring}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{option}</span>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-sans text-xs text-red-600"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </fieldset>
  );
}
