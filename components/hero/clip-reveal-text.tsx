"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

interface ClipRevealTextProps {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  /** Delay, in seconds, before the first character starts revealing. */
  startDelay?: number;
  /** Seconds between each character's reveal start. */
  staggerStep?: number;
}

const container: Variants = {
  hidden: {},
  visible: {},
};

/**
 * Reveals text one character at a time via an animated `clip-path` wipe
 * (bottom-to-top), rather than opacity/translate, so each glyph looks like
 * it is being physically uncovered.
 *
 * Words are kept intact (`whitespace-nowrap` per word, wrapping only between
 * words) so a line break never lands mid-word.
 */
export function ClipRevealText({
  text,
  as = "h1",
  className,
  startDelay = 0,
  staggerStep = 0.028,
}: ClipRevealTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const Tag = motion[as];

  let charIndex = 0;

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span key={`${word}-${wordIdx}`} className="inline-block whitespace-nowrap">
          {word.split("").map((char, i) => {
            const delay = startDelay + charIndex * staggerStep;
            charIndex += 1;
            return (
              <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
                <motion.span
                  className="inline-block"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { clipPath: "inset(0 0 100% 0)", y: "0.15em" }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { clipPath: "inset(0 0 0% 0)", y: "0em" }
                  }
                  transition={{
                    delay,
                    duration: prefersReducedMotion ? 0.3 : 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {wordIdx < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
