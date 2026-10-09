import type { ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
}

/** The elevated inner card used inside a PagePanel (same look as a bento tile, without the link). */
export function SurfaceCard({ children, className = "" }: SurfaceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.1] border-t-white/[0.18] bg-surface-900/80 p-6 shadow-glass backdrop-blur-md sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
