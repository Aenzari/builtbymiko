"use client";

import dynamic from "next/dynamic";

// Decorative 3D scene: excluded from SSR and the initial bundle.
const TopologyCanvas = dynamic(
  () => import("@/components/hero/topology-canvas").then((mod) => mod.TopologyCanvas),
  { ssr: false }
);

/**
 * The full-size version of the home tile's topology. The caption is
 * literally true of this site: the browser calls Server Actions, auth guards
 * every write, and Prisma talks to Postgres.
 */
export function DatabaseLab() {
  return (
    <div className="grid overflow-hidden rounded-[1.75rem] border border-black/[0.1] border-t-white/90 bg-surface-850/85 shadow-sm lg:grid-cols-12">
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent-strong">
          Database Lab
        </p>
        <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-tight text-ink-100 sm:text-3xl">
          How a request travels.
        </h2>
        <p className="mt-3 max-w-[44ch] font-sans text-sm leading-relaxed text-ink-400 sm:text-base">
          A simplified map of how this portfolio works: the browser calls a Server Action, auth
          guards every write, and Prisma talks to Postgres. The pulses are requests in flight. Move
          the cursor quickly, or scroll, and the system reacts.
        </p>
      </div>

      <div
        role="img"
        aria-label="Animated graph of a client, API layer, auth, database, and the users, projects, and schema tables, with pulses traveling along the connections."
        className="pointer-events-none relative h-[300px] sm:h-[380px] lg:col-span-7 lg:h-[420px] [&_canvas]:!pointer-events-none"
      >
        <TopologyCanvas />
      </div>
    </div>
  );
}
