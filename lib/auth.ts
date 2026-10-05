import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random string of at least 32 characters in your environment."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  sub: string; // AdminUser.id
  email: string;
}

/**
 * Issues a signed, httpOnly session cookie after a successful login. Uses
 * `jose` (rather than `jsonwebtoken`) specifically because `jose` runs on
 * the Edge runtime — this same verification logic is reused unmodified in
 * `middleware.ts`, which Next.js always executes on the Edge runtime.
 */
export async function createSession(payload: AdminSessionPayload): Promise<void> {
  const token = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifies a raw token string. Deliberately takes the token as a plain
 * argument (rather than reading `next/headers` internally) so the exact
 * same function works inside `middleware.ts`, which reads cookies from the
 * incoming `NextRequest` instead of the `cookies()` helper.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    // Expired, malformed, or signed with a different secret.
    return null;
  }
}

/** Reads and verifies the session cookie from within a Server Component or Server Action. */
export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };
