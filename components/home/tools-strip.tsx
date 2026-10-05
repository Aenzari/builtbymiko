const TOOLS = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "React",
  "Tailwind CSS",
  "Node.js",
  "Framer Motion",
  "Three.js",
  "Git & GitHub",
  "VS Code",
];

/**
 * "Daily drivers" strip: a slow, seamless marquee of the real stack.
 * The list is rendered twice and the track slides by exactly 50%, so the
 * loop has no visible seam. Hover pauses it; reduced-motion users get a
 * static, wrapped list instead of movement.
 */
export function ToolsStrip() {
  return (
    <section
      aria-label="Tools I work with"
      className="specular-border mb-4 flex flex-col gap-3 rounded-[1.75rem] bg-surface-900/80 p-3 shadow-glass backdrop-blur-xl sm:flex-row sm:items-center sm:gap-5 sm:pl-6"
    >
      <div className="shrink-0 px-2 sm:px-0">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent-strong">
          Daily drivers
        </p>
        <p className="font-sans text-base font-semibold text-ink-100">Tools I work with</p>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-white/[0.04] py-3 [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[-webkit-mask-image:none] motion-reduce:[mask-image:none]">
        <ul className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:gap-2 motion-reduce:px-3">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <li
              key={`${tool}-${i}`}
              aria-hidden={i >= TOOLS.length ? true : undefined}
              className={`pr-3 ${i >= TOOLS.length ? "motion-reduce:hidden" : ""}`}
            >
              <span className="inline-flex items-center rounded-full border border-white/[0.12] bg-surface-950 px-4 py-2 font-sans text-sm font-medium text-ink-100">
                {tool}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
