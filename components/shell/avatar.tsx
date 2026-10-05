"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

interface AvatarProps {
  size?: number;
  className?: string;
}

/**
 * Shows the portrait at `profile.photo` when it exists, initials otherwise.
 * The image is probed with an off-DOM `Image` first, so a missing file never
 * flashes a broken-image icon (an `onError` on a server-rendered <img> can
 * fire before hydration and be lost).
 */
export function Avatar({ size = 112, className = "" }: AvatarProps) {
  const [status, setStatus] = useState<"loading" | "ok" | "failed">("loading");

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setStatus("ok");
    probe.onerror = () => setStatus("failed");
    probe.src = profile.photo;
    return () => {
      probe.onload = null;
      probe.onerror = null;
    };
  }, []);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-accent/15 ring-1 ring-black/[0.06] ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden={status === "ok"}
        className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-accent-strong"
        style={{ fontSize: Math.round(size * 0.3) }}
      >
        {profile.initials}
      </span>
      {status === "ok" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.photo}
          alt={`Portrait of ${profile.displayName}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
