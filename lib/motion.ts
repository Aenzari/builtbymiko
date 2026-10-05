import type { Transition } from "framer-motion";

/**
 * Snappy micro-interactions: buttons, pills, badges, toggles.
 * Critically-damped-adjacent, fast settle. No overshoot.
 */
export const snappySpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
} as const satisfies Transition;

/**
 * Fluid morphing & expansion: modals, layoutId tabs, expanding cards.
 */
export const layoutSpring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
} as const satisfies Transition;

/**
 * Gentle ambient motion: floating elements, tooltips, cursor trailing.
 */
export const gentleSpring = {
  type: "spring",
  stiffness: 120,
  damping: 14,
} as const satisfies Transition;

/**
 * Momentum / flick spring: only for gesture-released motion that carried velocity
 * (drag-release, throw, swipe-dismiss). Slight bounce is earned by the gesture.
 */
export const momentumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 1,
} as const satisfies Transition;

export const tapScale = {
  button: 0.97,
  card: 0.98,
} as const;

export const reducedMotionTransition: Transition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut",
};
