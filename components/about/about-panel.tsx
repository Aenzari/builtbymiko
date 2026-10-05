import { profile } from "@/lib/profile";
import { Avatar } from "@/components/shell/avatar";
import { Icon } from "@/components/shell/icons";
import { PagePanel } from "@/components/shell/page-panel";
import { SurfaceCard } from "@/components/shell/surface-card";
import { Reveal } from "@/components/shell/reveal";

const FACTS: { label: string; value: string }[] = [
  { label: "Studying", value: profile.education },
  { label: "Based in", value: `${profile.location} · ${profile.timezone}` },
  { label: "Open to", value: profile.availability },
];

/**
 * The About page body. All copy lives in lib/profile.ts, so editing what
 * this page says never means touching a component.
 */
export function AboutPanel() {
  return (
    <PagePanel>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <SurfaceCard className="h-full">
            <p className="font-sans text-2xl font-semibold leading-snug tracking-tight text-ink-100 sm:text-3xl">
              {profile.about.statement}
            </p>

            <div className="mt-5 flex max-w-[60ch] flex-col gap-3">
              {profile.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="font-sans text-[15px] leading-relaxed text-ink-400">
                  {paragraph}
                </p>
              ))}
            </div>

            <ol className="mt-7 divide-y divide-black/[0.06] border-t border-black/[0.06]">
              {profile.about.focus.map((item, i) => (
                <li key={item.title} className="flex items-center gap-4 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[15px] font-semibold text-ink-100">{item.title}</p>
                    <p className="font-sans text-sm text-ink-400">{item.description}</p>
                  </div>
                  <span className="font-mono text-[11px] text-ink-500">0{i + 1}</span>
                </li>
              ))}
            </ol>
          </SurfaceCard>
        </Reveal>

        <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5">
          <Reveal delay={0.06}>
            <SurfaceCard className="flex flex-col items-center text-center">
              <Avatar size={144} />
              <h2 className="mt-4 font-sans text-xl font-semibold tracking-tight text-ink-100">
                {profile.fullName}
              </h2>
              <p className="mt-1 font-sans text-sm text-ink-400">{profile.role}</p>
            </SurfaceCard>
          </Reveal>

          <Reveal delay={0.12} className="flex-1">
            <SurfaceCard className="h-full">
              <dl className="divide-y divide-black/[0.06]">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="py-3 first:pt-0 last:pb-0">
                    <dt className="font-mono text-[11px] font-medium uppercase tracking-widest text-accent-strong">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-sans text-sm leading-relaxed text-ink-100">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </SurfaceCard>
          </Reveal>
        </div>
      </div>
    </PagePanel>
  );
}
