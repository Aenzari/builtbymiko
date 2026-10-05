"use client";

import { memo } from "react";

/**
 * Full-viewport tactile grain overlay.
 *
 * The overlay is deliberately quiet: it adds tactile depth to the dark
 * database/editorial surfaces without competing with text or interaction.
 * Fixed + pointer-events-none so it never intercepts input and never affects
 * layout. Respects prefers-reduced-motion by disabling the subtle
 * grain-shift animation (the static texture remains, since it carries no
 * vestibular risk).
 */
function NoiseOverlayImpl() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999] mix-blend-overlay opacity-[0.035] motion-safe:animate-grain motion-reduce:animate-none"
      style={{ width: "100vw", height: "100vh" }}
    >
      <svg
        className="h-full w-full scale-125"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" fill="#F1F5ED" />
      </svg>
    </div>
  );
}

export const NoiseOverlay = memo(NoiseOverlayImpl);
