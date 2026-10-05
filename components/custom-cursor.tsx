"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { gentleSpring } from "@/lib/motion";

type CursorVariant = "default" | "link" | "view" | "drag" | "text";

interface CursorConfig {
  label?: string;
  variant: CursorVariant;
}

const VARIANT_SIZE: Record<CursorVariant, number> = {
  default: 12,
  link: 56,
  view: 84,
  drag: 72,
  text: 4,
};

const VARIANT_LABEL: Record<CursorVariant, string | undefined> = {
  default: undefined,
  link: undefined,
  view: "View",
  drag: "Drag",
  text: undefined,
};

function readCursorConfig(el: Element | null): CursorConfig {
  const target = el?.closest<HTMLElement>("[data-cursor]");
  if (!target) return { variant: "default" };
  const variant = (target.dataset.cursor as CursorVariant) ?? "default";
  const label = target.dataset.cursorLabel ?? VARIANT_LABEL[variant];
  return { variant, label };
}

/**
 * Magnetic custom cursor, desktop (fine pointer) only.
 *
 * - Position is tracked with `useMotionValue` + `useSpring`, entirely outside
 *   React render cycles, so 60fps pointer movement never triggers a re-render.
 * - Only the discrete `variant`/`label` state (which changes rarely, on hover
 *   enter/exit) lives in React state.
 * - On touch/coarse-pointer devices the component renders nothing and never
 *   attaches listeners or hides the native cursor — zero cost, zero risk of a
 *   stuck invisible cursor on mobile.
 * - Under `prefers-reduced-motion`, position tracking is instant (no spring
 *   lag) and the magnetic scale/morph animations are skipped.
 */
export function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [config, setConfig] = useState<CursorConfig>({ variant: "default" });
  const prefersReducedMotion = useReducedMotion();

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  // The cursor should feel attached to the hand, not like an ambient object.
  // A high-response spring removes the perceptible pointer delay.
  const springConfig = prefersReducedMotion
    ? { stiffness: 1400, damping: 100, mass: 0.05 }
    : { stiffness: 1200, damping: 55, mass: 0.08 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    document.documentElement.classList.add("cursor-none-desktop");

    function handlePointerMove(e: PointerEvent) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        setConfig(readCursorConfig(document.elementFromPoint(e.clientX, e.clientY)));
      });
    }

    function handlePointerDown() {
      document.documentElement.setAttribute("data-cursor-pressed", "true");
    }

    function handlePointerUp() {
      document.documentElement.removeAttribute("data-cursor-pressed");
    }

    function handleLeave() {
      document.documentElement.setAttribute("data-cursor-hidden", "true");
    }

    function handleEnter() {
      document.documentElement.removeAttribute("data-cursor-hidden");
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isFinePointer, cursorX, cursorY]);

  if (!isFinePointer) return null;

  const size = VARIANT_SIZE[config.variant];

  return (
    <motion.div
      id="custom-cursor-root"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1000] flex items-center justify-center rounded-full mix-blend-screen will-change-transform"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-accent"
        animate={{
          width: size,
          height: size,
          scale: 1,
        }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
        transition={prefersReducedMotion ? reducedTransition : gentleSpring}
      >
        <AnimatePresence>
          {config.label && (
            <motion.span
              key={config.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={gentleSpring}
              className="font-mono text-[10px] font-semibold uppercase tracking-widest text-black"
            >
              {config.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const reducedTransition = { type: "tween" as const, duration: 0.1 };
