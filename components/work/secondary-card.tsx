"use client";

import type { Project } from "@/lib/project";
import { SpotlightSurface } from "./spotlight-surface";
import { StackBadge } from "./badges";

interface SecondaryCardProps {
  project: Project;
  onSelect: () => void;
}

export function SecondaryCard({ project, onSelect }: SecondaryCardProps) {
  return (
    <SpotlightSurface
      layoutId={`project-card-${project.id}`}
      onClick={onSelect}
      accentColor={project.accentColor}
      ariaLabel={`Open case study: ${project.title}`}
      className="justify-between p-6"
    >
      <div>
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-ink-500">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="mt-3 font-sans text-xl font-medium leading-tight tracking-tight text-ink-100 sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-[38ch] font-sans text-sm leading-relaxed text-ink-400">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((tech) => (
          <StackBadge key={tech}>{tech}</StackBadge>
        ))}
      </div>
    </SpotlightSurface>
  );
}
