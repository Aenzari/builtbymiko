"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { gentleSpring } from "@/lib/motion";

interface TiltPreviewProps {
  accentColor: string;
  label: string;
}

/**
 * A stylized "live preview" panel that tilts toward the pointer, standing in
 * for an embedded product screenshot without pulling in an iframe or a
 * remote image. rotateX/rotateY are motion values driven by a spring so the
 * tilt settles with the same physical weight as everything else in the
 * system, and resets smoothly (not instantly) on pointer leave.
 */
export function TiltPreview({ accentColor, label }: TiltPreviewProps) {
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
        className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.1] bg-surface-950"
      >
        {/* Faux browser chrome so the tile reads as a live product, not a
            decorative gradient block. */}
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
        <span className="relative z-10 mt-6 font-mono text-[11px] uppercase tracking-widest text-ink-500">
          {label}
        </span>
      </motion.div>
    </div>
  );
}
