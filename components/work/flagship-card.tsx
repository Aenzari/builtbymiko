"use client";

import type { Project } from "@/lib/project";
import { SpotlightSurface } from "./spotlight-surface";
import { TiltPreview } from "./tilt-preview";
import { StackBadge, MetricStat } from "./badges";

interface FlagshipCardProps {
  project: Project;
  onSelect: () => void;
}

export function FlagshipCard({ project, onSelect }: FlagshipCardProps) {
  return (
    <SpotlightSurface
      layoutId={`project-card-${project.id}`}
      onClick={onSelect}
      accentColor={project.accentColor}
      ariaLabel={`Open case study: ${project.title}`}
      className="p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:h-full lg:flex-row lg:items-stretch lg:gap-10">
        <div className="flex flex-col lg:w-[42%]">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-500">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>

          <h3 className="mt-4 font-sans text-3xl font-medium leading-[1.05] tracking-tight text-ink-100 sm:text-4xl">
            {project.title}
          </h3>

          <p className="mt-4 max-w-[42ch] font-sans text-sm leading-relaxed text-ink-400 sm:text-base">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((tech) => (
              <StackBadge key={tech}>{tech}</StackBadge>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-5 pt-8 sm:grid-cols-3">
            {project.metrics.slice(0, 3).map((metric) => (
              <MetricStat key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <TiltPreview accentColor={project.accentColor} label="Live preview" demoUrl={project.links.demo} />
        </div>
      </div>
    </SpotlightSurface>
  );
}
