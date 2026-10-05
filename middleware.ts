import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Runs on the Edge runtime for every request under `/admin`. The login page
 * and its Server Action are explicitly excluded so an unauthenticated visitor
 * can still reach the login form — everything else under `/admin` requires a
 * valid, unexpired session token.
 *
 * The `/admin` path is intentionally not linked from any public nav (see
 * Phase 1 notes) — this middleware is the actual security boundary, not
 * obscurity.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
