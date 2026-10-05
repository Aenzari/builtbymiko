"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";
import { Icon } from "./icons";

export function GetInTouch() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={{ scale: tapScale.button }}
      transition={snappySpring}
    >
      <Link
        href="/contact"
        data-cursor="link"
        className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink-100 px-6 py-3 font-sans text-sm font-medium text-surface-950 shadow-glass outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      >
        Get in touch
        <Icon name="arrow" size={15} />
      </Link>
    </motion.div>
  );
}
