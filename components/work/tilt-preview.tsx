"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { gentleSpring } from "@/lib/motion";

interface TiltPreviewProps {
  accentColor: string;
  label: string;
  demoUrl?: string;
}

/**
 * A live demo iframe with a lightweight fallback when a project has no demo
 * URL. The iframe is pointer-transparent so the surrounding project card
 * remains the single click target.
 */
export function TiltPreview({ accentColor, label, demoUrl }: TiltPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, gentleSpring);
  const rotateY = useSpring(rotateYRaw, gentleSpring);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * 10);
    rotateXRaw.set(-py * 10);
  }

  function handleMouseLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  }

  return (
    <div className="[perspective:1200px]" onMouseLeave={handleMouseLeave}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800/80 bg-surface-950"
      >
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-white/[0.1] bg-white/[0.03] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-accent/60" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${accentColor}, transparent 60%)`,
          }}
        />
        {demoUrl ? (
          <iframe
            src={demoUrl}
            title={`${label}: ${demoUrl}`}
            loading="lazy"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            className="absolute inset-x-0 bottom-0 top-8 h-[calc(100%-2rem)] w-full border-0 bg-surface-950 pointer-events-none"
          />
        ) : (
          <span className="relative z-10 mt-6 font-mono text-[11px] uppercase tracking-widest text-ink-500">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
