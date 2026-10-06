import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { PagePanel } from "@/components/shell/page-panel";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send Michael a message about a project, an internship, or a collaboration.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQs / Contact"
        title="Let's build something."
        subtitle="Tell me what you're working on. If I can help, I'll say how; if I can't, I'll say that too."
      />
      <PagePanel>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <ContactFaq />
          <ContactForm />
        </div>
      </PagePanel>
    </>
  );
}
