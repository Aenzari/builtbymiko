"use client";

import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";
import { Icon, type IconName } from "@/components/shell/icons";

interface BentoTileProps {
  href: string;
  icon: IconName;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}

/**
 * One tile on the home bento. The whole tile is a single link (an
 * absolutely-positioned <Link> overlay), so there is exactly one focus stop
 * and one accessible name per tile. Hover lift, tap compression and the
 * mouse-following sage spotlight match the rest of the system; the spotlight
 * position is written straight to CSS variables, never through React state.
 */
export function BentoTile({ href, icon, title, description, className = "", children }: BentoTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onHoverStart={() => {
        if (ref.current) ref.current.style.willChange = "transform";
      }}
      onHoverEnd={() => {
        if (ref.current) ref.current.style.willChange = "auto";
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      whileTap={{ scale: tapScale.card }}
      transition={snappySpring}
      style={{ "--spot-x": "50%", "--spot-y": "50%" } as CSSProperties}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.1] border-t-white/90 bg-surface-850/80 p-5 shadow-sm transition-colors hover:border-accent/50 hover:bg-white hover:shadow-glass ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--spot-x) var(--spot-y), rgba(183,243,107,0.14), transparent 60%)",
        }}
      />

      <Link
        href={href}
        data-cursor="link"
        aria-label={`${title}: ${description}`}
        className="absolute inset-0 z-20 rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Icon name={icon} size={20} />
          </span>
          <h2 className="font-sans text-lg font-semibold tracking-tight text-ink-100">{title}</h2>
        </div>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-500 group-hover:bg-accent/10 group-hover:text-accent"
        >
          <Icon name="arrow" size={15} />
        </span>
      </div>

      <p className="relative z-10 mt-3 max-w-[38ch] font-sans text-sm leading-relaxed text-ink-400">
        {description}
      </p>

      {children && <div className="relative z-10 mt-4 flex-1">{children}</div>}
    </motion.div>
  );
}
