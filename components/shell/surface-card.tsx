import type { ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
}

/** The light inner card used inside a PagePanel (same look as a bento tile, without the link). */
export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-black/[0.07] bg-surface-950/90 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset] sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
