import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileBar } from "./mobile-bar";
import { BackgroundCurves } from "./background-curves";

/**
 * The frame for every public page: persistent sidebar on desktop, compact
 * top bar on smaller screens, and one shared content column. Pages only
 * supply what goes inside <main>.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen lg:flex">
      <Sidebar />
      <MobileBar />
      <div className="relative min-w-0 flex-1">
        <BackgroundCurves />
        <main
          id="top"
          className="relative z-10 mx-auto w-full max-w-[1180px] px-4 pb-16 pt-24 sm:px-8 lg:px-10 lg:pt-14"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
