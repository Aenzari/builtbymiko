"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { layoutSpring, snappySpring } from "@/lib/motion";

const nodes = [
  { id: "data", label: "DATA", detail: "relational model", x: "8%", y: "50%" },
  { id: "api", label: "API", detail: "contracts", x: "30%", y: "28%" },
  { id: "ai", label: "AI", detail: "reasoning layer", x: "54%", y: "50%" },
  { id: "ui", label: "UI", detail: "human surface", x: "80%", y: "28%" },
];

export function ArchitectureIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("miko-intro-seen") === "1") return;
    setVisible(true);
    const timeout = window.setTimeout(() => {
      window.sessionStorage.setItem("miko-intro-seen", "1");
      setVisible(false);
    }, prefersReducedMotion ? 700 : 2600);
    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  function dismiss() {
    window.sessionStorage.setItem("miko-intro-seen", "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0.12 } : layoutSpring}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-surface-950 px-5"
          role="dialog"
          aria-label="Architecture introduction"
        >
          <div className="absolute inset-0 bg-grain opacity-[0.035]" aria-hidden="true" />
          <div className="relative w-full max-w-5xl">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">
              <span>miko.system / boot sequence</span>
              <button type="button" onClick={dismiss} className="text-ink-400 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70">
                Skip intro
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 border-t-white/25 bg-surface-900/70 p-5 shadow-glass-lg backdrop-blur-xl sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Architecture before aesthetics</p>
                  <h1 className="mt-4 max-w-[10ch] font-sans text-5xl font-medium leading-[0.9] tracking-[-0.07em] text-ink-100 sm:text-7xl">
                    From data to intelligence.
                  </h1>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ink-500 sm:block">01—04</span>
              </div>

              <div className="relative mt-16 h-44 sm:h-56">
                <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                  {nodes.slice(0, -1).map((node, index) => {
                    const next = nodes[index + 1];
                    return (
                      <motion.line
                        key={`${node.id}-${next.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={next.x}
                        y2={next.y}
                        pathLength="1"
                        stroke="rgba(183,243,107,0.35)"
                        strokeWidth="1"
                        strokeDasharray="0.04 0.02"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ ...snappySpring, delay: index * 0.16 }}
                      />
                    );
                  })}
                </svg>
                {nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...snappySpring, delay: index * 0.18 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${node.id === "ai" ? "border-accent bg-accent text-surface-950" : "border-white/20 bg-surface-950 text-accent"} font-mono text-xs font-semibold shadow-glass sm:h-20 sm:w-20`}>
                      {node.label}
                    </div>
                    <p className="mt-3 whitespace-nowrap text-center font-mono text-[9px] uppercase tracking-widest text-ink-500">{node.detail}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                <span>Web application / database / AI</span>
                <motion.span animate={prefersReducedMotion ? undefined : { opacity: [0.45, 1, 0.45] }} transition={{ ...snappySpring, repeat: Infinity, repeatDelay: 0.6 }} className="text-accent">
                  Ready
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
