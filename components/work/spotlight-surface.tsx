"use client";

import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";

interface SpotlightSurfaceProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  accentColor: string;
  layoutId?: string;
  ariaLabel: string;
}

/**
 * Interactive glass surface shared by all project cards:
 * - Mouse-following radial spotlight, tinted per-project via `accentColor`,
 *   positioned by writing `--spot-x` / `--spot-y` CSS custom properties
 *   directly to the DOM node on pointer move — no React state, no re-render.
 * - Hover lift (`y: -4px`) with the specular border sharpening from
 *   `border-black/[0.08]` to `border-black/[0.16]`.
 * - Tap compression via `snappySpring` for the same tactile feedback as
 *   every other interactive surface in the system.
 */
export function SpotlightSurface({
  children,
  onClick,
  className = "",
  accentColor,
  layoutId,
  ariaLabel,
}: SpotlightSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      data-cursor="view"
      onMouseMove={handleMouseMove}
      onHoverStart={() => {
        if (ref.current) ref.current.style.willChange = "transform";
      }}
      onHoverEnd={() => {
        if (ref.current) ref.current.style.willChange = "auto";
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      initial={false}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      whileTap={{ scale: tapScale.card }}
      transition={snappySpring}
      className={`focus-ring group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/[0.1] border-t-white/25 bg-surface-900/60 backdrop-blur-xl hover:border-accent/40 ${className}`}
      style={
        {
          "--spotlight-color": accentColor,
          "--spot-x": "50%",
          "--spot-y": "50%",
        } as CSSProperties
      }
    >
      {/* Directional specular top edge, independent of the hover border. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70" />

      {/* Mouse-following ambient spotlight, driven purely by the CSS vars
          written imperatively in handleMouseMove above. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(480px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--spotlight-color) 18%, transparent), transparent 55%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.div>
  );
}
