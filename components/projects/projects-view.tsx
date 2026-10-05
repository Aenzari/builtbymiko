"use client";

import { useState } from "react";
import type { Project } from "@/lib/project";
import { FlagshipCard } from "@/components/work/flagship-card";
import { SecondaryCard } from "@/components/work/secondary-card";
import { ProjectInspector } from "@/components/work/project-inspector";
import { SwipeCarousel } from "@/components/work/swipe-carousel";

interface ProjectsViewProps {
  projects: Project[];
}

/*
 * Tailwind only generates classes it can see as complete literals, so every
 * span is spelled out here rather than built from a number.
 *
 * Desktop grid (12 cols): flagship takes 8 and two rows; the first two
 * secondary cards stack beside it. Any further cards sit in their own row
 * below and share it evenly: 1 card = full width, 2 = halves, 3+ = thirds.
 */
function secondaryClass(index: number, total: number): string {
  const lg =
    index < 2
      ? total === 1
        ? "lg:col-span-4 lg:row-span-2"
        : "lg:col-span-4"
      : (() => {
          const remaining = total - 2;
          if (remaining === 1) return "lg:col-span-12";
          if (remaining === 2) return "lg:col-span-6";
          return "lg:col-span-4";
        })();

  // Tablet (12 cols): pairs of halves; an odd last card takes the full row.
  const sm = index === total - 1 && total % 2 === 1 ? "sm:col-span-12" : "sm:col-span-6";

  return `${sm} ${lg}`;
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [selected, setSelected] = useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/[0.16] bg-surface-950/70 p-10 text-center">
        <p className="font-sans text-sm text-ink-400">
          Projects appear here once they are added from the admin dashboard.
        </p>
      </div>
    );
  }

  const flagship = projects.find((p) => p.isFlagship) ?? projects[0];
  const secondary = projects.filter((p) => p.id !== flagship.id);

  return (
    <>
      <div className="hidden gap-4 sm:grid sm:auto-rows-[280px] sm:grid-cols-12 lg:auto-rows-[300px]">
        <div
          className={`sm:col-span-12 sm:row-span-2 ${
            secondary.length === 0 ? "lg:col-span-12" : "lg:col-span-8"
          }`}
        >
          <FlagshipCard project={flagship} onSelect={() => setSelected(flagship)} />
        </div>
        {secondary.map((project, i) => (
          <div key={project.id} className={secondaryClass(i, secondary.length)}>
            <SecondaryCard project={project} onSelect={() => setSelected(project)} />
          </div>
        ))}
      </div>

      <div className="sm:hidden">
        <SwipeCarousel>
          {[flagship, ...secondary].map((project) =>
            project.id === flagship.id ? (
              <div key={project.id} className="h-[560px]">
                <FlagshipCard project={project} onSelect={() => setSelected(project)} />
              </div>
            ) : (
              <div key={project.id} className="h-[420px]">
                <SecondaryCard project={project} onSelect={() => setSelected(project)} />
              </div>
            )
          )}
        </SwipeCarousel>
      </div>

      <ProjectInspector project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
