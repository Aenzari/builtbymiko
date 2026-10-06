import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { markInquiryRead } from "@/lib/actions/inquiry-actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  // Same rule as every privileged read: confirm the session here too.
  const admin = await getCurrentAdmin();
  if (!admin) notFound();

  const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
  const unread = inquiries.filter((i) => !i.readAt).length;

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]">
        {inquiries.length} total · {unread} unread
      </span>
      <h1 className="mt-2 font-sans text-2xl font-medium tracking-tight text-ink-100 sm:text-3xl">
        Inquiries
      </h1>

      {inquiries.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-black/[0.1] bg-white/50 p-10 text-center">
          <p className="font-sans text-sm text-[#5A5A52]">
            Nothing yet. Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className={`rounded-2xl border p-5 backdrop-blur-sm ${
                inquiry.readAt ? "border-black/[0.06] bg-white/50" : "border-[#8A9A82]/40 bg-white/80"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-sans text-base font-medium text-[#2B2B26]">
                    {inquiry.name}{" "}
                    {!inquiry.readAt && (
                      <span className="ml-1 rounded-full bg-[#8A9A82]/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#5F6B58]">
                        New
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="font-mono text-[11px] uppercase tracking-widest text-[#5F6B58] underline-offset-4 hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
                <time
                  dateTime={inquiry.createdAt.toISOString()}
                  className="font-mono text-[11px] uppercase tracking-widest text-[#8A8F86]"
                >
                  {inquiry.createdAt.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#2B2B26]">
                {inquiry.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {inquiry.scopeTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#5A5A52]"
                    >
                      {tag}
                    </span>
                  ))}
                  {inquiry.budget && (
                    <span className="rounded-full bg-black/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#5A5A52]">
                      {inquiry.budget}
                    </span>
                  )}
                </div>
                {!inquiry.readAt && (
                  <form action={markInquiryRead.bind(null, inquiry.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-black/[0.08] px-3.5 py-1.5 font-sans text-xs text-[#2B2B26] outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-[#8A9A82]/50"
                    >
                      Mark as read
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
