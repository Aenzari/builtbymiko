"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { cancelFrame, frame } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app in a Lenis smooth-scroll instance for momentum-decayed,
 * native-feeling scroll on desktop and touch devices alike.
 *
 * - Driven by Framer Motion's `frame` scheduler instead of a raw
 *   requestAnimationFrame loop, so Lenis and any scroll-linked Framer Motion
 *   values (useScroll, layout animations) stay on the same tick and never
 *   fight for a frame.
 * - Fully disabled under `prefers-reduced-motion: reduce`: Lenis is never
 *   constructed, so the browser's native scroll (instant, no momentum
 *   overshoot) takes over, matching Apple's reduced-motion guidance.
 * - Cleans up the Lenis instance and frame subscription on unmount to avoid
 *   leaking listeners across route changes.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    function update(frameData: { timestamp: number }) {
      lenis.raf(frameData.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
