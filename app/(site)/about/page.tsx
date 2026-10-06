import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { AboutPanel } from "@/components/about/about-panel";

export const metadata: Metadata = {
  title: "About",
  description:
    "Michael Angelou C. Quinit (Miko), an IT student majoring in Database Systems and Full-Stack Web Development.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Hi, I'm Michael."
        subtitle="An IT student who likes the part of a project nobody sees first: the data model."
      />
      <AboutPanel />
    </>
  );
}
