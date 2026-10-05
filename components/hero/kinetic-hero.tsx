"use client";

import { useRef, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GetInTouch } from "@/components/shell/get-in-touch";
import { TopologyCanvas } from "@/components/hero/topology-canvas";
import { snappySpring, tapScale } from "@/lib/motion";

export function KineticHero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    const element = ref.current;
    if (!element || prefersReducedMotion) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
  }

  return (
    <section
      ref={ref}
      onPointerMove={handlePointerMove}
      style={{ "--hero-x": "50%", "--hero-y": "40%" } as CSSProperties}
      className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/10 border-t-white/25 bg-surface-900/75 p-6 shadow-glass-lg backdrop-blur-xl sm:p-10 lg:p-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-80"
        style={{
          background:
            "radial-gradient(520px circle at var(--hero-x) var(--hero-y), rgba(183,243,107,0.14), transparent 62%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grain opacity-[0.035]" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={snappySpring}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Miko / systems online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.08 }}
            className="mt-6 max-w-[9ch] font-sans text-6xl font-medium leading-[0.86] tracking-[-0.085em] text-ink-100 sm:text-8xl lg:text-[8.5rem]"
          >
            Systems
            <span className="block text-accent">with a pulse.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.16 }}
            className="mt-8 max-w-[46ch] font-sans text-base leading-relaxed text-ink-400 sm:text-lg"
          >
            I&apos;m Miko — a database-minded developer shaping sharp interfaces,
            resilient products, and the invisible systems that make them feel effortless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <GetInTouch />
            <Link
              href="/projects"
              data-cursor="link"
              className="focus-ring inline-flex min-h-[48px] items-center rounded-full border border-white/15 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-ink-400 hover:border-accent/50 hover:text-accent"
            >
              Explore the archive
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...snappySpring, delay: 0.18 }}
          className="relative min-h-[310px] overflow-hidden rounded-[1.5rem] border border-white/10 border-t-white/25 bg-surface-950/70 lg:col-span-5"
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-500">
            <span>Live topology</span>
            <span className="text-accent">01 / 04</span>
          </div>
          <div className="absolute inset-4 top-12">
            <TopologyCanvas />
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between border-t border-white/10 pt-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Current state</p>
              <p className="mt-1 font-sans text-sm text-ink-100">Shipping useful things.</p>
            </div>
            <motion.span
              whileTap={{ scale: tapScale.button }}
              transition={snappySpring}
              className="rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-surface-950"
            >
              Stable
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-ink-500 sm:grid-cols-4">
        <span>01 / data models</span>
        <span>02 / interface systems</span>
        <span>03 / full-stack craft</span>
        <span className="text-right text-accent">Manila · GMT+8</span>
      </div>
    </section>
  );
}
