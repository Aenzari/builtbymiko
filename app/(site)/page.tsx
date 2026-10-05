import { EditorialHero } from "@/components/home/editorial-hero";
import { SelectedWorks } from "@/components/home/selected-works";
import { CapabilityMatrix } from "@/components/home/capability-matrix";
import { getPublicProjectsSafe } from "@/lib/projects-data";

// Re-read the roster at most once a minute, so a page built before the
// database was reachable heals itself. Admin edits also revalidate on demand.
export const revalidate = 60;

export default async function HomePage() {
  const projects = await getPublicProjectsSafe();

  return (
    <>
      <EditorialHero />
      <SelectedWorks projects={projects} />
      <CapabilityMatrix />
    </>
  );
}
