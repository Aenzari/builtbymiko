import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";
import { GetInTouch } from "@/components/shell/get-in-touch";

export default function SiteNotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="Nothing at this address." subtitle="The page you're after may have moved, or the link was mistyped." />
      <PagePanel className="flex flex-col items-start gap-4 p-8 sm:p-10">
        <p className="max-w-[46ch] font-sans text-sm leading-relaxed text-ink-400">
          Try the navigation on the left, or jump back to the projects.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center rounded-full bg-ink-100 px-6 py-3 font-sans text-sm font-medium text-surface-950 outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
          >
            Back home
          </Link>
          <GetInTouch />
        </div>
      </PagePanel>
    </>
  );
}
