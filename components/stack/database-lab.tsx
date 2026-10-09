"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timeout = window.setTimeout(() => setRunning(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [running]);
  const stages = ["Browser / Client", "Server Action (Zod)", "Auth & JWT Guard", "Prisma ORM", "PostgreSQL / Cache"];

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] border border-white/[0.08] border-t-white/15 bg-surface-850/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] lg:grid-cols-12">
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-emerald-400">
          Database Lab / EXPLAIN
        </p>
        <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-tight text-ink-100 sm:text-3xl">
          How a request travels.
        </h2>
        <p className="mt-3 max-w-[44ch] font-sans text-sm leading-relaxed text-ink-400 sm:text-base">
          A simplified map of how this portfolio works: the browser calls a Server Action, auth
          guards every write, and Prisma talks to Postgres. Trigger a packet and watch each boundary react.
        </p>
        <button type="button" onClick={() => { setRunning(true); window.dispatchEvent(new CustomEvent("simulate-query")); }} className="mt-6 w-fit rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-accent transition-colors hover:border-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
          [ Run Query: EXPLAIN ANALYZE ]
        </button>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["0.84ms", "8 rows", "idx_project_slug"].map((value, index) => (
            <div key={value} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{["Execution", "Returned", "Plan"][index]}</p>
              <p className="mt-1 font-mono text-xs text-zinc-200">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        role="img"
        aria-label="Animated graph of a client, API layer, auth, database, and the users, projects, and schema tables, with pulses traveling along the connections."
        className="relative h-[420px] overflow-hidden p-5 sm:h-[480px] lg:col-span-7 lg:h-[420px]"
      >
        <div className="pointer-events-none absolute inset-x-6 top-6 z-10 flex flex-wrap gap-2">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <span className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${running ? "border-accent/60 bg-accent/15 text-accent" : "border-white/10 bg-black/20 text-zinc-400"}`}>{stage}</span>
              {index < stages.length - 1 && <span className="text-zinc-600">→</span>}
            </div>
          ))}
        </div>
        <TopologyCanvas />
      </div>
    </div>
  );
}
