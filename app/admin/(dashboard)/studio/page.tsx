import Link from "next/link";
import { createExperience, createSkill, deleteExperience, deleteSkill, getStudioData, saveProfile } from "@/lib/actions/studio-actions";
import { ExperienceEditor, ProfileEditor, SkillEditor } from "@/components/admin/studio-forms";

export default async function StudioPage() {
  const { profile, experiences, skills } = await getStudioData();
  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin" className="font-mono text-[10px] uppercase tracking-widest text-ink-500 hover:text-accent">← Back to project manager</Link>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Content control / 04</p>
        <h1 className="mt-3 max-w-[10ch] font-sans text-6xl font-medium leading-[0.9] tracking-[-0.07em] text-ink-100 sm:text-7xl">Studio.</h1>
        <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ink-400">Shape the public identity, working history, and capability graph without touching source code.</p>
      </div>

      <section className="studio-panel">
        <SectionHeading index="01" title="Profile signal" description="The identity layer used across the public experience." />
        <ProfileEditor action={saveProfile} initial={profile} />
      </section>

      <section className="studio-panel">
        <SectionHeading index="02" title="Experience log" description="A chronological record of the systems and teams you have shaped." />
        <ExperienceEditor action={createExperience} />
        <div className="mt-8 space-y-3">
          {experiences.map((experience) => (
            <div key={experience.id} className="flex items-start justify-between gap-4 border-t border-white/10 pt-4">
              <div><p className="text-sm font-medium text-ink-100">{experience.role} · {experience.company}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">{experience.startedAt.toISOString().slice(0, 10)} {experience.isCurrent ? "→ now" : experience.endedAt?.toISOString().slice(0, 10)}</p></div>
              <form action={deleteExperience}><input type="hidden" name="id" value={experience.id} /><button className="font-mono text-[10px] uppercase tracking-widest text-rose-300 hover:text-rose-200">Remove</button></form>
            </div>
          ))}
        </div>
      </section>

      <section className="studio-panel">
        <SectionHeading index="03" title="Capability graph" description="Small, composable signals for the skills and tools behind the work." />
        <SkillEditor action={createSkill} />
        <div className="mt-8 flex flex-wrap gap-2">
          {skills.map((skill) => <form key={skill.id} action={deleteSkill}><input type="hidden" name="id" value={skill.id} /><button className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-400 hover:border-accent/50 hover:text-accent">{skill.name} ×</button></form>)}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return <div className="mb-7 border-b border-white/10 pb-5"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">{index}</p><h2 className="mt-2 font-sans text-2xl font-medium tracking-tight text-ink-100">{title}</h2><p className="mt-2 text-sm text-ink-400">{description}</p></div>;
}
