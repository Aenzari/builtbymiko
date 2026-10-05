"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import type { Project as PrismaProject, ProjectCategory } from "@prisma/client";

const CATEGORY_VALUES = [
  "PRODUCT_DESIGN",
  "WEB_PLATFORM",
  "DESIGN_ENGINEERING",
  "DATABASE_SYSTEMS",
  "EXPERIMENT",
  "OPEN_SOURCE",
] as const satisfies readonly ProjectCategory[];

const metricSchema = z.object({
  label: z.string().min(1).max(40),
  value: z.string().min(1).max(24),
});

const projectInputSchema = z.object({
  title: z.string().min(2, "Title is required.").max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  category: z.enum(CATEGORY_VALUES),
  year: z.coerce.number().int().min(2000).max(2100),
  summary: z.string().min(10, "Summary is too short.").max(280),
  description: z.string().min(20, "Description is too short.").max(4000),
  metrics: z.array(metricSchema).max(6).default([]),
  stack: z.array(z.string().min(1).max(40)).min(1, "Add at least one technology.").max(16),
  demoUrl: z.string().url().or(z.literal("")).optional(),
  repoUrl: z.string().url().or(z.literal("")).optional(),
  isFlagship: z.coerce.boolean().default(false),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Accent color must be a hex value like #8A9A82.")
    .default("#8A9A82"),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export interface ProjectActionState {
  error?: string;
  fieldErrors?: Partial<Record<keyof ProjectInput, string>>;
  success?: boolean;
}

/**
 * Every action below re-checks the session itself rather than trusting that
 * the request came from a page behind `middleware.ts`. Server Actions are
 * reachable as their own network endpoint by anyone who has loaded the
 * client bundle referencing them, independent of which page rendered the
 * form — the middleware protects *pages*, this guard protects the
 * *mutation*.
 */
async function requireAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Not authenticated.");
  }
}

function parseFormInput(formData: FormData): unknown {
  const rawStack = String(formData.get("stack") ?? "");
  const rawMetricLabels = formData.getAll("metricLabel");
  const rawMetricValues = formData.getAll("metricValue");

  const metrics = rawMetricLabels
    .map((label, i) => ({ label: String(label).trim(), value: String(rawMetricValues[i] ?? "").trim() }))
    .filter((m) => m.label.length > 0 && m.value.length > 0);

  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    year: formData.get("year"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    metrics,
    stack: rawStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    demoUrl: formData.get("demoUrl") ?? "",
    repoUrl: formData.get("repoUrl") ?? "",
    isFlagship: formData.get("isFlagship") === "on",
    accentColor: formData.get("accentColor"),
    sortOrder: formData.get("sortOrder") ?? 0,
  };
}

function toFieldErrors(error: z.ZodError<ProjectInput>): Partial<Record<keyof ProjectInput, string>> {
  const fieldErrors: Partial<Record<keyof ProjectInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ProjectInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Revalidates every public path that reads from the projects table. */
function revalidatePublicProjectPages(): void {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
}

export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await requireAdmin();

  const parsed = projectInputSchema.safeParse(parseFormInput(formData));
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return {
      error: "That slug is already in use.",
      fieldErrors: { slug: "Choose a unique slug." },
    };
  }

  await prisma.project.create({
    data: {
      ...parsed.data,
      demoUrl: parsed.data.demoUrl || null,
      repoUrl: parsed.data.repoUrl || null,
    },
  });

  revalidatePublicProjectPages();
  return { success: true };
}

export async function updateProject(
  id: string,
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  await requireAdmin();

  const parsed = projectInputSchema.safeParse(parseFormInput(formData));
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const conflict = await prisma.project.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflict) {
    return {
      error: "That slug is already in use by another project.",
      fieldErrors: { slug: "Choose a unique slug." },
    };
  }

  await prisma.project.update({
    where: { id },
    data: {
      ...parsed.data,
      demoUrl: parsed.data.demoUrl || null,
      repoUrl: parsed.data.repoUrl || null,
    },
  });

  revalidatePublicProjectPages();
  return { success: true };
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    revalidatePublicProjectPages();
    return {};
  } catch {
    return { error: "Could not delete project." };
  }
}

/** Read path used by the admin dashboard (all projects, most recent sortOrder first). */
export async function listProjectsForAdmin(): Promise<PrismaProject[]> {
  await requireAdmin();
  return prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
}
