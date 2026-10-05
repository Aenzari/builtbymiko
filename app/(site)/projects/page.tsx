import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";
import { ProjectsView } from "@/components/projects/projects-view";
import { getPublicProjects } from "@/lib/projects-data";
import type { Project } from "@/lib/project";

export const metadata: Metadata = { title: "Projects" };

// Re-read the roster at most once a minute, so a page built before the
// database was reachable heals itself. Admin edits also revalidate on demand.
export const revalidate = 60;

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await getPublicProjects();
  } catch (error) {
    console.error("Could not load projects:", error);
  }

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Real apps you can open."
        subtitle="Each one starts as a schema. Open a card to see the stack, the numbers and the links."
      />
      <PagePanel>
        <ProjectsView projects={projects} />
      </PagePanel>
    </>
  );
}
