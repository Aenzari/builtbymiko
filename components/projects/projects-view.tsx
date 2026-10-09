"use client";

import { useState } from "react";
import type { Project } from "@/lib/project";
import { SecondaryCard } from "@/components/work/secondary-card";
import { ProjectInspector } from "@/components/work/project-inspector";
import { SwipeCarousel } from "@/components/work/swipe-carousel";

interface ProjectsViewProps {
  projects: Project[];
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [selected, setSelected] = useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-black/[0.14] bg-surface-950/70 p-10 text-center">
        <p className="font-sans text-sm text-ink-400">
          Projects appear here once they are added from the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden gap-5 sm:grid sm:grid-cols-12 lg:gap-6">
        {projects.map((project, index) => (
          <div key={project.id} className={`min-h-[360px] sm:col-span-6 ${index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}>
            <SecondaryCard project={project} onSelect={() => setSelected(project)} />
          </div>
        ))}
      </div>

      <div className="sm:hidden">
        <SwipeCarousel>
          {projects.map((project) => (
            <div key={project.id} className="h-[420px]">
              <SecondaryCard project={project} onSelect={() => setSelected(project)} />
            </div>
          ))}
        </SwipeCarousel>
      </div>

      <ProjectInspector project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
