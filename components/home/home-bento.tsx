"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/lib/project";
import { profile } from "@/lib/profile";
import { STACK_LAYERS } from "@/lib/stack";
import { PagePanel } from "@/components/shell/page-panel";
import { Avatar } from "@/components/shell/avatar";
import { BentoTile } from "./bento-tile";

// Decorative 3D preview: excluded from SSR and the initial bundle.
const TopologyCanvas = dynamic(
  () => import("@/components/hero/topology-canvas").then((mod) => mod.TopologyCanvas),
  { ssr: false }
);

interface HomeBentoProps {
  projects: Project[];
}

export function HomeBento({ projects }: HomeBentoProps) {
  const preview = projects.slice(0, 3);

  return (
    <PagePanel>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-6 lg:grid-cols-12">
        <BentoTile
          href="/projects"
          icon="folder"
          title="Projects"
          description="Apps built end to end, from the schema up."
          className="min-h-[260px] md:col-span-6 lg:col-span-5"
        >
          {preview.length === 0 ? (
            <p className="font-sans text-sm text-ink-500">
              Projects appear here once they are added from the admin dashboard.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/[0.08]">
              {preview.map((project) => (
                <li key={project.id} className="flex items-center gap-3 py-2.5">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accentColor }}
                  />
                  <span className="min-w-0 flex-1 truncate font-sans text-sm font-medium text-ink-100">
                    {project.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    {project.category} · {project.year}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </BentoTile>

        <BentoTile
          href="/stack"
          icon="network"
          title="Database Lab"
          description="A live relational topology. Move fast and the data does too."
          className="min-h-[260px] md:col-span-3 lg:col-span-4"
        >
          <div className="pointer-events-none relative -mx-2 h-44 [&_canvas]:!pointer-events-none">
            <TopologyCanvas />
          </div>
        </BentoTile>

        <BentoTile
          href="/about"
          icon="user"
          title="About"
          description="Who I am and how I work."
          className="min-h-[260px] md:col-span-3 lg:col-span-3"
        >
          <div className="flex items-center gap-3">
            <Avatar size={64} />
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-semibold text-ink-100">{profile.fullName}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                IT · Database Systems
              </p>
            </div>
          </div>
        </BentoTile>

        <BentoTile
          href="/stack"
          icon="layers"
          title="Stack"
          description="What I build with, layer by layer."
          className="min-h-[260px] md:col-span-3 lg:col-span-4"
        >
          <ol className="flex flex-col divide-y divide-white/[0.08]">
            {STACK_LAYERS.map((layer, i) => (
              <li key={layer.id} className="flex items-center justify-between py-2">
                <span className="font-sans text-sm text-ink-100">{layer.tagline}</span>
                <span className="font-mono text-[10px] text-ink-500">0{i + 1}</span>
              </li>
            ))}
          </ol>
        </BentoTile>

        <BentoTile
          href="/contact"
          icon="mail"
          title="Contact"
          description="Have a project or an internship in mind? Write me."
          className="min-h-[260px] md:col-span-3 lg:col-span-4"
        >
          <div className="flex h-full flex-col justify-end">
            <span className="inline-flex w-fit items-center rounded-full bg-ink-100 px-4 py-2 font-sans text-sm font-medium text-surface-950">
              Start a conversation
            </span>
            <p className="mt-3 truncate font-mono text-[11px] text-ink-500">{profile.email}</p>
          </div>
        </BentoTile>

        <BentoTile
          href="/about"
          icon="database"
          title="Availability"
          description="Where I am and what I am open to."
          className="min-h-[260px] md:col-span-6 lg:col-span-4"
        >
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-sans text-sm text-ink-100">{profile.availability}</span>
            </li>
            <li className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
              Based in {profile.location} · {profile.timezone}
            </li>
          </ul>
        </BentoTile>
      </div>
    </PagePanel>
  );
}
