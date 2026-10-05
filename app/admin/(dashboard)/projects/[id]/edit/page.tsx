import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "@/lib/actions/project-actions";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Defense in depth: this page is already behind middleware + the layout's
  // session check, but the direct Prisma read below is a privileged query,
  // so it re-confirms a session exists before touching the database, same
  // as every Server Action in lib/actions/project-actions.ts.
  const admin = await getCurrentAdmin();
  if (!admin) notFound();

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const boundUpdateProject = updateProject.bind(null, project.id);

  return (
    <div>
      <Link
        href="/admin"
        className="font-sans text-sm text-[#8A8F86] transition-colors hover:text-[#2B2B26]"
      >
        ← Back to projects
      </Link>
      <h1 className="mt-4 font-sans text-2xl font-medium tracking-tight text-[#2B2B26] sm:text-3xl">
        Edit {project.title}
      </h1>
      <div className="mt-8 rounded-3xl border border-black/[0.06] bg-white/70 p-6 backdrop-blur-sm sm:p-8">
        <ProjectForm
          action={boundUpdateProject}
          initialProject={project}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
