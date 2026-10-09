"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/profile";
import { snappySpring } from "@/lib/motion";

export function DirectContact() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5">
      <a href={`mailto:${profile.email}`} className="font-mono text-xs tracking-wide text-zinc-200 underline decoration-accent/40 underline-offset-4 hover:text-accent">
        {profile.email}
      </a>
      <motion.button type="button" whileTap={{ scale: 0.97 }} transition={snappySpring} onClick={copyEmail} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:border-accent/50 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
        {copyState === "copied" ? "✓ Copied" : copyState === "error" ? "Copy unavailable" : "Copy email"}
      </motion.button>
    </div>
  );
}
