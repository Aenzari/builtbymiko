"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyNewInquiry } from "@/lib/notify";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(20).max(4000),
  scopeTags: z.array(z.string().trim().min(1).max(40)).min(1).max(6),
  /** Holds the inquiry type. Column keeps its original name to avoid a migration. */
  budget: z.string().trim().min(1).max(40),
  /** Honeypot: real visitors never see or fill this. */
  company: z.string().max(200).optional(),
});

export type SubmitInquiryResult = { ok: true } | { ok: false; error: string };

/**
 * Public Server Action (no auth: anyone may write to Miko). Input is
 * re-validated here even though the form validates too, because a Server
 * Action is reachable directly and client-side checks prove nothing.
 */
export async function submitContactInquiry(input: unknown): Promise<SubmitInquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some details look invalid. Please check the form and try again." };
  }

  const { company, ...data } = parsed.data;

  // A filled honeypot means a bot. Report success so it learns nothing,
  // and store nothing.
  if (company && company.trim().length > 0) {
    return { ok: true };
  }

  try {
    await prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        message: data.message,
        scopeTags: data.scopeTags,
        budget: data.budget,
      },
    });

    // Awaited, not fire-and-forget: a serverless function can be frozen or
    // torn down the instant this action returns, which would silently drop
    // an un-awaited email send. notifyNewInquiry() never throws (see its
    // own try/catch), so awaiting it adds a small delay but no new failure
    // mode for the visitor.
    await notifyNewInquiry({
      name: data.name,
      email: data.email,
      message: data.message,
      budget: data.budget,
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to save contact inquiry:", error);
    return { ok: false, error: "Could not send your message right now. Please try again in a moment." };
  }
}
