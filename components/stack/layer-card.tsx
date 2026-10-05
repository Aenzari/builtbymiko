"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/shell/icons";
import type { StackLayer } from "@/lib/stack";

interface LayerCardProps {
  layer: StackLayer;
  index: number;
  className?: string;
}

export function LayerCard({ layer, index, className = "" }: LayerCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col rounded-[1.75rem] border border-black/[0.07] bg-surface-950/90 p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
          <Icon name={layer.icon} size={20} />
        </span>
        <span className="font-mono text-[11px] text-ink-500">0{index + 1}</span>
      </div>

      <h3 className="mt-4 font-sans text-lg font-semibold tracking-tight text-ink-100">
        {layer.title}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-400">{layer.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${layer.title} tools`}>
        {layer.tools.map((tool) => (
          <li
            key={tool}
            className="rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400"
          >
            {tool}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
