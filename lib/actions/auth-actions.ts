"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export interface LoginActionState {
  error?: string;
}

// Best-effort in-memory throttle. Note: this resets on every cold start /
// serverless instance recycle, so it is a speed bump against casual brute
// force, not a hard guarantee — use a durable rate limiter for production
// deployments (for example, an edge-compatible Redis-backed limiter).
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key: string): boolean {
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttempt > WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = failedAttempts.get(key);
  if (!entry || Date.now() - entry.firstAttempt > WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAttempt: Date.now() });
  } else {
    entry.count += 1;
  }
}

function clearFailures(key: string): void {
  failedAttempts.delete(key);
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password } = parsed.data;
  const rateLimitKey = email.toLowerCase();

  if (isRateLimited(rateLimitKey)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: rateLimitKey } });

  // Always run bcrypt.compare, even when no user was found, against a fixed
  // dummy hash — this keeps the response time constant so a timing
  // difference can't be used to enumerate which emails exist.
  const hashToCompare =
    admin?.passwordHash ?? "$2a$12$CwTycUXWue0Thq9StjUM0uJ8vC0ZQ1z1Y2QwK6xJ0i1ZQ3z3X8g5S";
  const passwordMatches = await bcrypt.compare(password, hashToCompare);

  if (!admin || !passwordMatches) {
    recordFailure(rateLimitKey);
    return { error: "Incorrect email or password." };
  }

  clearFailures(rateLimitKey);
  await createSession({ sub: admin.id, email: admin.email });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
