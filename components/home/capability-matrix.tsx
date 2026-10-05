import Link from "next/link";
import { STACK_LAYERS } from "@/lib/stack";

export function CapabilityMatrix() {
  return (
    <section className="border-y border-white/10 py-20 sm:py-28" aria-labelledby="capabilities-title">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Capability map / 02</p>
          <h2 id="capabilities-title" className="mt-4 max-w-[9ch] font-sans text-5xl font-medium leading-[0.9] tracking-[-0.07em] text-ink-100 sm:text-7xl">The useful parts are underneath.</h2>
          <Link href="/stack" className="focus-ring mt-8 inline-block font-mono text-[11px] uppercase tracking-widest text-ink-400 underline decoration-white/20 underline-offset-8 hover:text-accent">View the stack ↗</Link>
        </div>
        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {STACK_LAYERS.map((layer, index) => (
            <article key={layer.id} className={`bg-surface-950 p-6 sm:p-8 ${index === 0 ? "sm:col-span-2" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] text-accent">0{index + 1}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{layer.tools.length} systems</span>
              </div>
              <h3 className="mt-10 font-sans text-2xl font-medium tracking-[-0.04em] text-ink-100">{layer.title}</h3>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-ink-400">{layer.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {layer.tools.slice(0, 5).map((item) => <span key={item} className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
