"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/project";
import type { CaseStudyBlock } from "@/types/portfolio";
import { layoutSpring, snappySpring, tapScale } from "@/lib/motion";

type NarrativeTab = "overview" | "architecture" | "impact";

const tabs: { id: NarrativeTab; label: string; index: string }[] = [
  { id: "overview", label: "Overview", index: "01" },
  { id: "architecture", label: "Architecture", index: "02" },
  { id: "impact", label: "Impact", index: "03" },
];

interface CaseStudyNarrativeProps {
  project: Project;
}

export function CaseStudyNarrative({ project }: CaseStudyNarrativeProps) {
  const [activeTab, setActiveTab] = useState<NarrativeTab>("overview");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setActiveTab("overview");
  }, [project.id]);

  const blocks = useMemo(() => project.caseStudy ?? [], [project.caseStudy]);
  const tabBlocks = blocks.filter((block) => {
    if (activeTab === "architecture") return block.type === "architecture" || block.type === "code";
    if (activeTab === "impact") return block.type === "metric" || block.type === "quote";
    return block.type !== "architecture" && block.type !== "code" && block.type !== "metric" && block.type !== "quote";
  });

  const visibleBlocks =
    tabBlocks.length > 0 ? tabBlocks : fallbackBlocks(project, activeTab);

  return (
    <section className="border-t border-zinc-800 pt-4" aria-label={`${project.title} case study`}>
      <div
        role="tablist"
        aria-label="Case study sections"
        className="flex flex-wrap gap-1 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-1"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${project.id}-${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: tapScale.button }}
              transition={snappySpring}
              className={`relative flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 font-mono text-[10px] uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:flex-none sm:px-4 ${
                isActive ? "text-surface-950" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`active-pill-${project.id}`}
                  transition={prefersReducedMotion ? { duration: 0.1 } : layoutSpring}
                  className="absolute inset-0 rounded-xl bg-accent"
                />
              )}
              <span className="relative z-10">{tab.index}</span>
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          id={`${project.id}-${activeTab}-panel`}
          role="tabpanel"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={snappySpring}
          className="mt-8"
        >
          {activeTab === "architecture" ? (
            <ArchitecturePanel blocks={visibleBlocks} accentColor={project.accentColor} />
          ) : (
            <div className="space-y-5">
              {visibleBlocks.map((block, index) => (
                <NarrativeBlock key={block.id || `${block.type}-${index}`} block={block} accentColor={project.accentColor} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ArchitecturePanel({ blocks, accentColor }: { blocks: CaseStudyBlock[]; accentColor: string }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] border-t-white/25 bg-surface-950/80 p-5">
          <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at 30% 20%, ${accentColor}, transparent 60%)` }} />
          <div className="relative">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-500">
              <span>System map</span>
              <span className="text-accent">Live</span>
            </div>
            <div className="mt-8 space-y-3">
              {["Interface", "API boundary", "Relational core", "Observability"].map((layer, index) => (
                <div key={layer} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">{layer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {blocks.map((block, index) => (
          <NarrativeBlock key={block.id || `${block.type}-${index}`} block={block} accentColor={accentColor} />
        ))}
      </div>
    </div>
  );
}

function NarrativeBlock({ block, accentColor }: { block: CaseStudyBlock; accentColor: string }) {
  if (block.type === "image" && block.src) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/[0.1] bg-surface-950">
        <div
          role="img"
          aria-label={block.alt ?? block.title ?? "Case study image"}
          className="aspect-[16/9] w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${block.src}")` }}
        />
        {block.title && <figcaption className="border-t border-white/[0.1] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-500">{block.title}</figcaption>}
      </figure>
    );
  }

  if (block.type === "code") {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080908]">
        <div className="flex items-center justify-between border-b border-white/[0.1] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-ink-500">
          <span>{block.title ?? "Implementation note"}</span>
          <span className="text-accent">{block.language ?? "code"}</span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-ink-400"><code>{block.code ?? block.body}</code></pre>
      </div>
    );
  }

  const isQuote = block.type === "quote";
  const isMetric = block.type === "metric";
  return (
    <article className={`rounded-2xl border border-white/[0.1] border-t-white/20 p-5 ${isQuote ? "bg-accent/[0.08]" : "bg-white/[0.03]"}`}>
      {block.eyebrow && <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{block.eyebrow}</p>}
      {block.title && <h3 className="mt-2 font-sans text-xl font-medium tracking-tight text-ink-100">{block.title}</h3>}
      {isMetric && block.value && <p className="mt-3 font-sans text-4xl font-medium tracking-[-0.06em]" style={{ color: accentColor }}>{block.value}</p>}
      {block.body && <p className={`mt-3 max-w-[64ch] font-sans text-sm leading-relaxed ${isQuote ? "text-ink-100" : "text-ink-400"}`}>{isQuote ? `“${block.body}”` : block.body}</p>}
      {block.items && <ul className="mt-4 space-y-2">{block.items.map((item) => <li key={item} className="flex gap-2 font-sans text-sm text-ink-400"><span className="text-accent">↳</span>{item}</li>)}</ul>}
    </article>
  );
}

function fallbackBlocks(project: Project, activeTab: NarrativeTab): CaseStudyBlock[] {
  if (activeTab === "architecture") {
    return [{ id: "fallback-architecture", type: "architecture", eyebrow: "System intent", title: "A structure that keeps the product legible.", body: "The interface, API boundary, and relational model are treated as one system. Each layer has a clear responsibility, so the experience can move quickly without becoming fragile." }];
  }
  if (activeTab === "impact") {
    return project.metrics.map((metric, index) => ({ id: `fallback-metric-${index}`, type: "metric", eyebrow: metric.label, value: metric.value, body: "A signal captured from the project brief." }));
  }
  return [{ id: "fallback-overview", type: "text", eyebrow: "The brief", title: "From schema to surface.", body: project.description }];
}
