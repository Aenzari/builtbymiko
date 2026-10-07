"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/project";
import { layoutSpring, snappySpring, tapScale } from "@/lib/motion";
import { StackBadge, MetricStat } from "./badges";
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
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              key="inspector-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              layoutId={`project-card-${project.id}`}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`inspector-title-${project.id}`}
              transition={prefersReducedMotion ? { duration: 0.2 } : layoutSpring}
              className="specular-border relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface-900/95 p-4 shadow-glass-lg backdrop-blur-2xl sm:p-6"
            >
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                whileTap={{ scale: tapScale.button }}
                transition={snappySpring}
                className="focus-ring specular-border absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-850 text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800 sm:right-5 sm:top-5"
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                className="flex min-h-0 flex-1 flex-col"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <div className="flex items-center gap-2 pr-14 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>

                <h2
                  id={`inspector-title-${project.id}`}
                  className="mt-3 pr-10 font-sans text-3xl font-medium leading-tight tracking-tight text-zinc-100 sm:text-4xl"
                >
                  {project.title}
                </h2>

                <div className="mt-5 grid min-h-0 flex-1 gap-5 overflow-y-auto pr-1 lg:grid-cols-[1.05fr_0.95fr] lg:overflow-hidden">
                  <HeroMedia project={project} />
                  <div className="min-w-0 lg:overflow-y-auto lg:pr-2">
                    {(project.client || project.role || project.deployment) && (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {project.client && <InspectorMeta label="Client" value={project.client} />}
                        {project.role && <InspectorMeta label="Role" value={project.role} />}
                        {project.deployment && (
                          <InspectorMeta
                            label="Deploy"
                            value={project.deployment}
                            href={project.links.demo}
                          />
                        )}
                      </div>
                    )}
                    <p className="mt-5 max-w-[64ch] font-sans text-sm leading-relaxed text-zinc-300 sm:text-base">
                      {project.description}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 sm:grid-cols-3">
                      {project.metrics.map((metric) => (
                        <MetricStat key={metric.label} label={metric.label} value={metric.value} />
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <StackBadge key={tech}>{tech}</StackBadge>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.links.demo && <LinkButton href={project.links.demo} label="Live demo"><ExternalLinkIcon /></LinkButton>}
                      {project.links.repo && <LinkButton href={project.links.repo} label="GitHub"><GithubIcon /></LinkButton>}
                    </div>
                  </div>
                </div>
                <div className="mt-5 min-h-0 shrink-0 overflow-y-auto border-t border-zinc-800 pt-4 lg:max-h-[32vh]">
                  <CaseStudyNarrative project={project} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function HeroMedia({ project }: { project: Project }) {
  const asset = project.mediaAssets[0];
  return (
    <div className="relative aspect-video w-full self-start overflow-hidden rounded-xl border border-zinc-800 bg-surface-950">
      {asset ? (
        <Image src={asset} alt={`${project.title} preview`} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wider text-zinc-400">
          Project preview
        </div>
      )}
    </div>
  );
}

function InspectorMeta({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="font-sans text-sm text-zinc-100">{value}</p>
        {href && <LinkButton href={href} label={`Open ${label}`}><ExternalLinkIcon /></LinkButton>}
      </div>
    </div>
  );
}

function LinkButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor="link"
      className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white">
      {children}
    </a>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.75 1.75 12.25 12.25M12.25 1.75 1.75 12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M8 2h4v4M12 2 7 7M11 8.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function GithubIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6a4.7 4.7 0 0 1 1.2-3.3c-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.3a11.7 11.7 0 0 1 6.2 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.7.2 3 .1 3.3a4.7 4.7 0 0 1 1.2 3.3c0 4.6-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .7Z" /></svg>;
}
