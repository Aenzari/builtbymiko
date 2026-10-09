"use client";

import { motion } from "framer-motion";
import { gentleSpring } from "@/lib/motion";

export function RobotMascot() {
  return (
    <motion.div
      aria-label="Animated portfolio robot mascot"
      role="img"
      animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
      transition={{ ...gentleSpring, repeat: Infinity, repeatDelay: 1.5 }}
      className="relative mx-auto h-40 w-32"
    >
      <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-accent" />
      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1 rounded-full bg-accent shadow-[0_0_20px_rgba(214,106,74,0.5)]" />
      <div className="absolute inset-x-3 top-5 rounded-[1.4rem] border border-black/10 border-t-white bg-white/80 p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-3 rounded-xl bg-surface-850 px-3 py-5">
          <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_rgba(214,106,74,0.55)]" />
          <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_rgba(214,106,74,0.55)]" />
        </div>
        <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-accent/60" />
      </div>
      <div className="absolute bottom-0 left-1/2 h-14 w-20 -translate-x-1/2 rounded-b-[1.5rem] rounded-t-xl border border-black/10 bg-surface-700 shadow-lg" />
      <div className="absolute bottom-3 left-0 h-px w-5 bg-accent" />
      <div className="absolute bottom-3 right-0 h-px w-5 bg-accent" />
    </motion.div>
  );
}
