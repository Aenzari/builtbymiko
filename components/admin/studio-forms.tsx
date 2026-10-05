"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { StudioActionState } from "@/lib/actions/studio-actions";

export function ProfileEditor({
  action,
  initial,
}: {
  action: (state: StudioActionState, formData: FormData) => Promise<StudioActionState>;
  initial: {
    displayName: string;
    fullName: string;
    headline: string;
    roles: string[];
    bio: string;
    location: string;
    timezone: string;
    availability: string;
    availabilityState: string;
    email: string;
    avatarUrl: string | null;
    socials: unknown;
  } | null;
}) {
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <StudioField label="Display name" name="displayName" defaultValue={initial?.displayName} />
        <StudioField label="Full name" name="fullName" defaultValue={initial?.fullName} />
        <StudioField label="Headline" name="headline" defaultValue={initial?.headline} />
        <StudioField label="Email" name="email" type="email" defaultValue={initial?.email} />
        <StudioField label="Location" name="location" defaultValue={initial?.location} />
        <StudioField label="Timezone" name="timezone" defaultValue={initial?.timezone} />
        <StudioField label="Roles (comma-separated)" name="roles" defaultValue={initial?.roles.join(", ")} />
        <StudioField label="Avatar URL" name="avatarUrl" defaultValue={initial?.avatarUrl ?? ""} />
      </div>
      <StudioField label="Availability" name="availability" defaultValue={initial?.availability} />
      <label className="block">
        <span className="studio-label">Availability state</span>
        <select name="availabilityState" defaultValue={initial?.availabilityState ?? "available"} className="studio-input">
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </label>
      <StudioTextArea label="Bio" name="bio" defaultValue={initial?.bio} />
      <StudioTextArea label="Social links JSON" name="socials" rows={5} defaultValue={JSON.stringify(initial?.socials ?? [], null, 2)} />
      <ActionButton label="Save profile" />
      {state.error && <p role="alert" className="text-sm text-rose-300">{state.error}</p>}
      {state.success && <p className="text-sm text-accent">Profile saved.</p>}
    </form>
  );
}

export function ExperienceEditor({ action }: { action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <StudioField label="Company" name="company" />
      <StudioField label="Role" name="role" />
      <StudioField label="Location" name="location" />
      <StudioField label="Started" name="startedAt" type="date" />
      <StudioField label="Ended" name="endedAt" type="date" />
      <StudioField label="Stack (comma-separated)" name="stack" />
      <StudioTextArea label="Summary" name="summary" />
      <StudioTextArea label="Highlights (one per line)" name="highlights" />
      <label className="flex items-center gap-3 text-sm text-ink-400"><input name="isCurrent" type="checkbox" className="accent-accent" /> Current role</label>
      <div><ActionButton label="Add experience" /></div>
    </form>
  );
}

export function SkillEditor({ action }: { action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <StudioField label="Skill" name="name" />
      <StudioField label="Category" name="category" placeholder="engineering, data, design" />
      <StudioField label="Level" name="level" />
      <StudioField label="Proof / context" name="proof" />
      <div><ActionButton label="Add skill" /></div>
    </form>
  );
}

function StudioField({ label, name, defaultValue, type = "text", placeholder }: { label: string; name: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return <label className="block"><span className="studio-label">{label}</span><input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={name !== "avatarUrl" && name !== "location" && name !== "timezone"} className="studio-input" /></label>;
}

function StudioTextArea({ label, name, defaultValue, rows = 3 }: { label: string; name: string; defaultValue?: string; rows?: number }) {
  return <label className="block sm:col-span-2"><span className="studio-label">{label}</span><textarea name={name} rows={rows} defaultValue={defaultValue} required className="studio-input resize-y" /></label>;
}

function ActionButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-surface-950 outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:opacity-60">{pending ? "Saving..." : label}</button>;
}
