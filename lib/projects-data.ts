import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Project as PrismaProject, ProjectCategory as PrismaCategory } from "@prisma/client";
import type { Project, ProjectCategory, ProjectMetric } from "@/lib/project";
import type { CaseStudyBlock } from "@/types/portfolio";

const CATEGORY_LABELS: Record<PrismaCategory, ProjectCategory> = {
  PRODUCT_DESIGN: "Product Design",
  WEB_PLATFORM: "Web Platform",
  DESIGN_ENGINEERING: "Design Engineering",
  DATABASE_SYSTEMS: "Database Systems",
  EXPERIMENT: "Experiment",
  OPEN_SOURCE: "Open Source",
};

function toPublicProject(row: PrismaProject): Project {
  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    category: CATEGORY_LABELS[row.category],
    year: row.year,
    client: row.client ?? undefined,
    role: row.role ?? undefined,
    deployment: row.deployment ?? undefined,
    summary: row.summary,
    description: row.description,
    metrics: (row.metrics as unknown as ProjectMetric[]) ?? [],
    caseStudy: (row.caseStudy as unknown as CaseStudyBlock[]) ?? [],
    mediaAssets: row.mediaAssets,
    stack: row.stack,
    links: {
      demo: row.demoUrl ?? undefined,
      repo: row.repoUrl ?? undefined,
    },
    isFlagship: row.isFlagship,
    isFeatured: row.isFeatured,
    featuredPriority: row.featuredPriority,
    isArchived: row.isArchived,
    accentColor: row.accentColor,
  };
}

/**
 * `cache()` deduplicates this call within a single request/render pass — if
 * both the flagship-picking logic and the grid-rendering logic in
 * `WorkSection` call this, Prisma only actually queries once.
 *
 * Consumed by the same `WorkSection` / `FlagshipCard` / `SecondaryCard`
 * components built in the earlier phases — those components only ever
 * imported from `@/lib/project` and `@/data/projects`, so swapping
 * `data/projects.ts`'s static array for this function is the only change
 * needed anywhere in the front end.
 */
export const getPublicProjects = cache(async (): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { isArchived: false },
    orderBy: [{ isFeatured: "desc" }, { featuredPriority: "asc" }, { sortOrder: "asc" }],
  });
  return rows.map(toPublicProject);
});

/**
 * Same as `getPublicProjects`, but a database failure degrades to an empty
 * roster (and is logged) instead of crashing the page, so the site still
 * renders before the database is configured.
 */
export async function getPublicProjectsSafe(): Promise<Project[]> {
  try {
    return await getPublicProjects();
  } catch (error) {
    console.error("Could not load projects:", error);
    return [];
  }
}
