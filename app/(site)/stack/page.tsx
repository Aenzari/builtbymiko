import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";
import { DatabaseLab } from "@/components/stack/database-lab";
import { LayerCard } from "@/components/stack/layer-card";
import { STACK_LAYERS, techStack } from "@/lib/stack";

export const metadata: Metadata = { title: "Stack" };

export default function StackPage() {
  const lastIsOrphan = STACK_LAYERS.length % 2 === 1;

  return (
    <>
      <PageHeader
        eyebrow="Stack"
        title="Built in layers."
        subtitle="From the table definition to the animation frame. Here is what each layer is made of."
      />
      <PagePanel>
        <div className="flex flex-col gap-3 sm:gap-4">
          <DatabaseLab />
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {STACK_LAYERS.map((layer, i) => (
              <LayerCard
                key={layer.id}
                layer={layer}
                index={i}
                className={lastIsOrphan && i === STACK_LAYERS.length - 1 ? "md:col-span-2" : ""}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {Object.entries(techStack).map(([category, tools]) => (
              <section key={category} className="rounded-[1.75rem] border border-white/[0.14] bg-surface-800/80 p-5 sm:p-6">
                <h2 className="font-sans text-lg font-semibold text-zinc-100">{category}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span key={tool} className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </PagePanel>
    </>
  );
}
