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
  displayName: "Miko Quinit",
  role: "Database & Full-Stack Developer",
  initials: "MQ",
  /** Put your portrait at public/miko.jpg. Until it exists, initials are shown. */
  photo: "/miko.jpg",
  location: "Philippines",
  timezone: "GMT+8",
  /** Replace with your real address. */
  email: "michaelangeloucquinit@gmail.com",
  availability: "Open to internships and freelance work",
  education:
    "4th year IT Student, Major in Database Systems. <b> Mindanao State University - Iligan Institute of Technology </b> ",
  socials: {
    github: siteConfig.social.github,
    linkedin: siteConfig.social.linkedin,
    facebook: siteConfig.social.facebook,
  },

  about: {
    statement:
      "Get the tables, keys and relationships right, and the rest of the app gets easier.",
    paragraphs: [
      "I'm an IT student majoring in Database Systems. I like starting with the schema: what the entities are, how they relate, and what needs to stay fast as the data grows.",
      "From there I build the server logic and the interface, with the same care for both. I want an app to be correct underneath and pleasant on top.",
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
        description: "Next.js, Server Actions and PostgreSQL, end to end.",
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
