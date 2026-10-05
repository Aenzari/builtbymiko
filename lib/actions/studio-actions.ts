"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  if (!(await getCurrentAdmin())) throw new Error("Not authenticated.");
}

const profileSchema = z.object({
  displayName: z.string().min(2).max(80),
  fullName: z.string().min(2).max(120),
  headline: z.string().min(2).max(160),
  roles: z.string().min(2).max(500),
  bio: z.string().min(20).max(4000),
  location: z.string().min(2).max(80),
  timezone: z.string().min(2).max(40),
  availability: z.string().min(2).max(160),
  availabilityState: z.enum(["available", "limited", "unavailable"]),
  email: z.string().email(),
  avatarUrl: z.string().url().or(z.literal("")),
  socials: z.string().max(2000),
});

export type StudioActionState = { error?: string; success?: boolean };

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveProfile(
  _previous: StudioActionState,
  formData: FormData
): Promise<StudioActionState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse({
    displayName: value(formData, "displayName"),
    fullName: value(formData, "fullName"),
    headline: value(formData, "headline"),
    roles: value(formData, "roles"),
    bio: value(formData, "bio"),
    location: value(formData, "location"),
    timezone: value(formData, "timezone"),
    availability: value(formData, "availability"),
    availabilityState: value(formData, "availabilityState"),
    email: value(formData, "email"),
    avatarUrl: value(formData, "avatarUrl"),
    socials: value(formData, "socials") || "[]",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid profile input." };

  let socials: unknown;
  try {
    socials = JSON.parse(parsed.data.socials);
  } catch {
    return { error: "Social links must be valid JSON." };
  }
  if (!Array.isArray(socials)) return { error: "Social links must be a JSON array." };

  await prisma.profile.upsert({
    where: { id: "default" },
    update: { ...parsed.data, roles: parsed.data.roles.split(",").map((role) => role.trim()).filter(Boolean), socials, avatarUrl: parsed.data.avatarUrl || null },
    create: { id: "default", ...parsed.data, roles: parsed.data.roles.split(",").map((role) => role.trim()).filter(Boolean), socials, avatarUrl: parsed.data.avatarUrl || null },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/studio");
  return { success: true };
}

const experienceSchema = z.object({
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  location: z.string().max(80),
  startedAt: z.string().min(4),
  endedAt: z.string(),
  summary: z.string().min(10).max(1000),
  highlights: z.string().max(2000),
  stack: z.string().max(500),
  isCurrent: z.boolean(),
});

export async function createExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = experienceSchema.parse({
    company: value(formData, "company"),
    role: value(formData, "role"),
    location: value(formData, "location"),
    startedAt: value(formData, "startedAt"),
    endedAt: value(formData, "endedAt"),
    summary: value(formData, "summary"),
    highlights: value(formData, "highlights"),
    stack: value(formData, "stack"),
    isCurrent: formData.get("isCurrent") === "on",
  });
  await prisma.experience.create({
    data: {
      company: data.company,
      role: data.role,
      location: data.location || null,
      startedAt: new Date(data.startedAt),
      endedAt: data.endedAt ? new Date(data.endedAt) : null,
      summary: data.summary,
      highlights: data.highlights.split("\n").map((item) => item.trim()).filter(Boolean),
      stack: data.stack.split(",").map((item) => item.trim()).filter(Boolean),
      isCurrent: data.isCurrent,
    },
  });
  revalidatePath("/about");
  revalidatePath("/admin/studio");
}

export async function deleteExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  await prisma.experience.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/about");
  revalidatePath("/admin/studio");
}

const skillSchema = z.object({
  name: z.string().min(2).max(80),
  category: z.string().min(2).max(40),
  level: z.string().max(80),
  proof: z.string().max(240),
});

export async function createSkill(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = skillSchema.parse({
    name: value(formData, "name"),
    category: value(formData, "category"),
    level: value(formData, "level"),
    proof: value(formData, "proof"),
  });
  await prisma.skill.create({ data: { ...data, level: data.level || null, proof: data.proof || null } });
  revalidatePath("/about");
  revalidatePath("/stack");
  revalidatePath("/admin/studio");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  await requireAdmin();
  await prisma.skill.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/about");
  revalidatePath("/stack");
  revalidatePath("/admin/studio");
}

export async function getStudioData() {
  await requireAdmin();
  const [profile, experiences, skills] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "default" } }),
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
  ]);
  return { profile, experiences, skills };
}
