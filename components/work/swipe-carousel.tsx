"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { momentumSpring, snappySpring } from "@/lib/motion";

interface SwipeCarouselProps {
  children: ReactNode[];
}

const SWIPE_VELOCITY_THRESHOLD = 400;
const SWIPE_DISTANCE_THRESHOLD = 60;

/**
 * Full touch-swipe carousel for small viewports.
 *
 * Follows Apple's direct-manipulation guidance: the card tracks the finger
 * 1:1 during the drag (no threshold-gated "commit" animation), and on
 * release the decision to advance is made from gesture velocity, not just
 * final position — a fast short flick advances the same as a slow long
 * drag. The settle animation is a spring that carries real values (never a
 * fixed-duration tween), so a mid-drag interruption is always possible.
 */
export function SwipeCarousel({ children }: SwipeCarouselProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const count = children.length;

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    const shouldAdvance =
      Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD || Math.abs(offset.x) > SWIPE_DISTANCE_THRESHOLD;

    if (!shouldAdvance) return;

    if (offset.x < 0 && index < count - 1) {
      setIndex((i) => i + 1);
    } else if (offset.x > 0 && index > 0) {
      setIndex((i) => i - 1);
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        animate={{ x: `calc(${-index * 100}% - ${index * 16}px)` }}
        transition={prefersReducedMotion ? { duration: 0.2 } : momentumSpring}
      >
        {children.map((child, i) => (
          <div key={i} className="mr-4 w-full shrink-0">
            {child}
          </div>
        ))}
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {children.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to project ${i + 1}`}
            onClick={() => setIndex(i)}
            className="focus-ring relative h-2 w-2 rounded-full bg-black/[0.12]"
          >
            {i === index && (
              <motion.span
                layoutId="carousel-dot"
                className="absolute inset-0 rounded-full bg-[#2B2B26]/70"
                transition={snappySpring}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
