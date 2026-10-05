import type { ReactNode } from "react";
import { SiteShell } from "@/components/shell/site-shell";
import { ArchitectureIntro } from "@/components/hero/architecture-intro";

/**
 * Route group for the public site. Everything inside `(site)` gets the
 * sidebar shell; `/admin` lives outside this group on purpose and keeps its
 * own layout.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ArchitectureIntro />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
