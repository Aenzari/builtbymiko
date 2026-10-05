"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

/** Admin-only. Re-checks the session itself, like every mutation in this app. */
export async function markInquiryRead(id: string): Promise<void> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Not authenticated.");

  await prisma.contactInquiry.update({ where: { id }, data: { readAt: new Date() } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
