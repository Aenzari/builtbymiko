import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/lib/actions/project-actions";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin"
        className="font-sans text-sm text-ink-500 transition-colors hover:text-ink-100"
      >
        ← Back to projects
      </Link>
      <h1       className="mt-4 font-sans text-2xl font-medium tracking-tight text-ink-100 sm:text-3xl">
        New project
      </h1>
      <div className="mt-8 rounded-3xl border border-white/[0.14] bg-surface-900/80 p-6 backdrop-blur-sm sm:p-8">
        <ProjectForm action={createProject} submitLabel="Create project" />
      </div>
    </div>
  );
}
