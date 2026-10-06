import type { ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
}

/** The elevated inner card used inside a PagePanel (same look as a bento tile, without the link). */
export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/[0.14] bg-surface-800/80 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset] sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
