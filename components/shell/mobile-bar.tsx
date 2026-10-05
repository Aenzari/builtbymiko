"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { snappySpring, tapScale } from "@/lib/motion";
import { profile } from "@/lib/profile";
import { Avatar } from "./avatar";
import { Icon } from "./icons";
import { NavList } from "./nav-list";
import { SocialButtons } from "./social-buttons";

/**
 * Compact top bar plus a bottom sheet for navigation, shown below lg.
 * The sheet closes on route change, on Escape, and on backdrop tap; page
 * scroll is locked while it is open.
 */
export function MobileBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
        <div className="specular-border flex items-center justify-between rounded-[1.25rem] bg-surface-900/90 p-2 shadow-glass backdrop-blur-xl">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Avatar size={38} />
            <span className="truncate pr-2 font-sans text-sm font-semibold text-ink-100">
              {profile.displayName}
            </span>
          </Link>
          <motion.button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            whileTap={{ scale: tapScale.button }}
            transition={snappySpring}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-ink-100 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Icon name="menu" size={20} />
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-[45] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : { type: "spring", damping: 26, stiffness: 260, mass: 0.9 }
              }
              className="specular-border fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-surface-950/95 px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-3 shadow-glass-lg backdrop-blur-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/[0.2]" />
              <NavList scope="sheet" onNavigate={() => setOpen(false)} />
              <div className="my-4 h-px bg-white/[0.1]" />
              <div className="flex items-center justify-between">
                <SocialButtons />
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: tapScale.button }}
                  transition={snappySpring}
                  className="rounded-xl border border-white/[0.12] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-400 outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
