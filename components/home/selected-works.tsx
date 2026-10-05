"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/project";
import { snappySpring, tapScale } from "@/lib/motion";
import { ProjectInspector } from "@/components/work/project-inspector";

export function SelectedWorks({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28" aria-labelledby="selected-works-title">
      <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Archive / 01</p>
          <h2 id="selected-works-title" className="mt-3 font-sans text-4xl font-medium tracking-[-0.06em] text-ink-100 sm:text-6xl">Selected work</h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ink-500 sm:block">{String(projects.length).padStart(2, "0")} entries</span>
      </div>

      {projects.length === 0 ? (
        <p className="border-b border-white/10 py-10 font-mono text-xs uppercase tracking-widest text-ink-500">Archive temporarily offline.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {projects.map((project, index) => (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setSelected(project);
              }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: tapScale.card }}
              transition={snappySpring}
              className="group relative grid w-full grid-cols-[42px_minmax(0,1fr)_auto] items-baseline gap-4 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:grid-cols-[64px_minmax(0,1.4fr)_minmax(150px,0.7fr)_120px_24px] sm:gap-6 sm:py-7"
            >
              <span className="font-mono text-[11px] text-ink-500">[{String(index + 1).padStart(2, "0")}]</span>
              <span className="min-w-0">
                <span className="block truncate font-sans text-xl font-medium tracking-[-0.03em] text-ink-100 group-hover:text-accent sm:text-2xl">{project.title}</span>
                <span className="mt-2 block max-w-[42ch] truncate font-sans text-sm text-ink-500">{project.summary}</span>
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ink-500 sm:block">{project.category}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ink-500 sm:block">{project.year} · {project.stack.slice(0, 2).join(" / ")}</span>
              <span className="text-xl text-ink-500 group-hover:text-accent">↗</span>
              <span className="pointer-events-none absolute inset-x-0 -z-10 h-full scale-y-75 bg-white/[0.035] opacity-0 group-hover:scale-y-100 group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      )}
      <ProjectInspector project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
