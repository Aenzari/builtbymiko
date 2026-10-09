"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/profile";
import { snappySpring, tapScale } from "@/lib/motion";
import { RobotMascot } from "./robot-mascot";

function formatTime() {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  }).format(new Date());
}

export function EditorialHero() {
  const [time, setTime] = useState(formatTime);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatTime()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative py-10 sm:py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={snappySpring}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
          >
            [ 4TH YEAR IT · DATABASE SYSTEMS · AI WEB DEVELOPER ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.08 }}
            className="mt-7 max-w-[10ch] font-sans text-[clamp(4.5rem,12vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.085em] text-ink-100"
          >
            Data is the
            <span className="block text-accent">design.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...snappySpring, delay: 0.16 }}
            className="mt-9 flex max-w-[52ch] flex-col gap-6 sm:flex-row sm:items-end"
          >
            <p className="font-sans text-base leading-relaxed text-ink-400 sm:text-lg">
              I build database-first web applications where the architecture is
              clear, the interface is calm, and every interaction earns its place.
            </p>
            <motion.div whileTap={{ scale: tapScale.button }} transition={snappySpring} className="shrink-0">
              <Link
                href="/contact"
                data-cursor="link"
                className="focus-ring font-mono text-[11px] font-semibold uppercase tracking-widest text-accent underline decoration-accent/30 underline-offset-8 hover:decoration-accent"
              >
                Start a conversation ↗
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...snappySpring, delay: 0.2 }}
          className="self-end border-l border-black/10 pl-5"
        >
          <RobotMascot />
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            Available for contracts & collabs
          </p>
          <dl className="mt-6 space-y-5">
            <Meta label="Local time" value={`${time} / ${profile.timezone}`} />
            <Meta label="Location" value={profile.location} />
            <Meta label="Status" value="Building quietly" accent />
            <Meta label="Availability" value={profile.availability} />
          </dl>
        </motion.aside>
      </div>
      <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-ink-500">
        <span>Scroll to inspect the work</span>
        <span>© {new Date().getFullYear()} / MQ</span>
      </div>
    </section>
  );
}

function Meta({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{label}</dt>
      <dd className={`mt-1 font-sans text-sm leading-snug ${accent ? "text-accent" : "text-ink-100"}`}>{value}</dd>
    </div>
  );
}
