import { siteConfig } from "@/lib/site-config";
import type { IconName } from "@/components/shell/icons";

/**
 * Single source of truth for personal details and page copy. Everything the
 * sidebar, home tiles, /about and /contact show comes from here. The prose
 * below is a first draft written from what the site knows about you: read
 * it, and rewrite anything that isn't true or doesn't sound like you.
 */
export const profile = {
  fullName: "Michael Angelou C. Quinit",
  displayName: "Michael Quinit",
  role: "Aspiring Full Stack Web Developer & AI Web Developer",
  initials: "MQ",
  /** Put your portrait at public/miko.jpg. Until it exists, initials are shown. */
  photo: "/miko.jpg",
  location: "Philippines",
  timezone: "GMT+8",
  /** Replace with your real address. */
  email: "michaelangeloucquinit@gmail.com",
  availability: "Open to internships and freelance work",
  education:
    "4th Year IT Student, Major in Database Systems · Mindanao State University – Iligan Institute of Technology (MSU-IIT)",
  socials: {
    github: siteConfig.social.github,
    linkedin: siteConfig.social.linkedin,
    facebook: siteConfig.social.facebook,
  },

  about: {
    statement:
      "Get the tables, keys and relationships right, and the rest of the app gets easier.",
    paragraphs: [
      "I'm a 4th Year IT student at Mindanao State University – Iligan Institute of Technology, majoring in Database Systems. I build full-stack and AI-powered web applications from a strong data foundation.",
      "I care about the connection between a reliable database, useful AI integrations, and interfaces that make complex workflows feel simple.",
    ],
    focus: [
      {
        icon: "database" as IconName,
        title: "Database design",
        description: "Relational schemas, normalization and indexing.",
      },
      {
        icon: "network" as IconName,
        title: "Full-stack web apps",
        description: "Full-stack web apps with modern frontend and backend tools.",
      },
      {
        icon: "layers" as IconName,
        title: "Interfaces with feel",
        description:
          "Motion, accessibility and layouts that hold up on a phone.",
      },
    ],
  },
} as const;
