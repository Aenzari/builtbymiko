import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/db";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // The badge is a convenience: a failed count must never take the admin down.
  let unread = 0;
  if (admin) {
    try {
      unread = await prisma.contactInquiry.count({ where: { readAt: null } });
    } catch {
      unread = 0;
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 text-ink-100">
      <header className="sticky top-0 z-40 border-b border-white/[0.1] bg-surface-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-semibold text-accent">
              MQ
            </span>
            <span className="hidden font-sans text-sm font-medium text-ink-100 sm:inline">
              Portfolio studio
            </span>
          </Link>

          <nav aria-label="Admin" className="flex items-center gap-1">
            <Link
              href="/admin"
              className="rounded-full px-3.5 py-2 font-sans text-sm text-ink-400 outline-none hover:bg-white/[0.05] hover:text-ink-100 focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Projects
            </Link>
            <Link
              href="/admin/studio"
              className="rounded-full px-3.5 py-2 font-sans text-sm text-ink-400 outline-none hover:bg-white/[0.05] hover:text-ink-100 focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Studio
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-2 rounded-full px-3.5 py-2 font-sans text-sm text-ink-400 outline-none hover:bg-white/[0.05] hover:text-ink-100 focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Inquiries
              {unread > 0 && (
                <span className="rounded-full bg-[#8A9A82] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {admin && (
              <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-500 sm:inline">
                {admin.email}
              </span>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 font-sans text-sm text-ink-100 outline-none hover:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
