import Link from "next/link";
import { listProjectsForAdmin } from "@/lib/actions/project-actions";
import { categoryLabel } from "@/lib/admin-categories";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export default async function AdminDashboardPage() {
  const projects = await listProjectsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
          <h1 className="mt-2 font-sans text-2xl font-medium tracking-tight text-ink-100 sm:text-3xl">
            Projects
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-[#2B2B26] px-5 py-3 font-sans text-sm font-medium text-[#FAFAFA] outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-black/[0.1] bg-white/50 p-10 text-center">
          <p className="font-sans text-sm text-[#5A5A52]">
            No projects yet. Create your first one to see it appear on the
            public site immediately.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white/70 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-sans text-base font-medium text-ink-100">
                    {project.title}
                  </h2>
                  {project.isFlagship && (
                    <span className="rounded-full bg-[#8A9A82]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#5F6B58]">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
                  {categoryLabel(project.category)} · {project.year} · /{project.slug}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-full border border-black/[0.08] px-3.5 py-1.5 font-sans text-xs text-[#2B2B26] outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]"
                >
                  Edit
                </Link>
                <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
