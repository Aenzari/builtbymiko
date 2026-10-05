import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";
import { DatabaseLab } from "@/components/stack/database-lab";
import { LayerCard } from "@/components/stack/layer-card";
import { STACK_LAYERS } from "@/lib/stack";

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
        </div>
      </PagePanel>
    </>
  );
}
