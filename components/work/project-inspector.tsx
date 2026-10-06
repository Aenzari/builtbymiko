"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/project";
import { layoutSpring, snappySpring, tapScale } from "@/lib/motion";
import { StackBadge, MetricStat } from "./badges";
import { TiltPreview } from "./tilt-preview";
import { CaseStudyNarrative } from "./case-study-narrative";

interface ProjectInspectorProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Full case-study inspector. Reuses the same `layoutId` as the originating
 * card (`project-card-${id}`) so Framer Motion morphs the card's bounds and
 * border-radius into the inspector's bounds, rather than cross-fading two
 * unrelated elements.
 */
export function ProjectInspector({ project, onClose }: ProjectInspectorProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="inspector-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8">
            <motion.div
              layoutId={`project-card-${project.id}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`inspector-title-${project.id}`}
              transition={prefersReducedMotion ? { duration: 0.2 } : layoutSpring}
              className="specular-border relative w-full max-w-3xl rounded-3xl bg-surface-900/95 p-6 shadow-glass-lg backdrop-blur-2xl sm:p-9"
            >
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                whileTap={{ scale: tapScale.button }}
                transition={snappySpring}
                className="focus-ring specular-border absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05]"
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <div className="flex items-center gap-2 pr-12 font-mono text-[11px] uppercase tracking-widest text-ink-500">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>

                <h2
                  id={`inspector-title-${project.id}`}
                  className="mt-4 pr-8 font-sans text-3xl font-medium leading-[1.05] tracking-tight text-ink-100 sm:text-4xl"
                >
                  {project.title}
                </h2>

                <div className="mt-6">
                  <TiltPreview
                    accentColor={project.accentColor}
                    label="Live preview"
                    demoUrl={project.links.demo}
                  />
                </div>

                {(project.client || project.role || project.deployment) && (
                  <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/[0.1] py-4 sm:grid-cols-3">
                    {project.client && <InspectorMeta label="Client" value={project.client} />}
                    {project.role && <InspectorMeta label="Role" value={project.role} />}
                    {project.deployment && <InspectorMeta label="Deploy" value={project.deployment} />}
                  </div>
                )}

                <p className="mt-6 max-w-[64ch] font-sans text-sm leading-relaxed text-ink-400 sm:text-base">
                  {project.description}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/[0.1] pt-6 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <MetricStat key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <StackBadge key={tech}>{tech}</StackBadge>
                  ))}
                </div>

                <CaseStudyNarrative project={project} />

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="focus-ring specular-border rounded-full bg-white/[0.06] px-5 py-3 font-sans text-sm font-medium text-ink-100"
                    >
                      View live demo
                    </a>
                  )}
                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="focus-ring rounded-full px-5 py-3 font-sans text-sm text-ink-400 hover:text-ink-100"
                    >
                      View repository
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function InspectorMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{label}</p>
      <p className="mt-1 font-sans text-sm text-ink-100">{value}</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.75 1.75 12.25 12.25M12.25 1.75 1.75 12.25"
        stroke="#B7F36B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
