"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Site section failed to render:", error);
  }, [error]);

  return (
    <>
      <PageHeader eyebrow="Error" title="Something didn't load." subtitle="This section hit an error. It's been logged." />
      <PagePanel className="flex flex-col items-start gap-4 p-8 sm:p-10">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[48px] items-center rounded-full bg-ink-100 px-6 py-3 font-sans text-sm font-medium text-surface-950 outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
        >
          Try again
        </button>
      </PagePanel>
    </>
  );
}
