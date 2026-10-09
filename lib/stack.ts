import type { IconName } from "@/components/shell/icons";

export interface StackLayer {
  id: string;
  icon: IconName;
  title: string;
  /** Very short phrase used on the home tile. */
  tagline: string;
  summary: string;
  tools: string[];
}

export const techStack = {
  Data: ["PostgreSQL", "MySQL", "Supabase", "MongoDB", "Prisma", "Redis", "Neo4j (Cypher)", "SQL"],
  Server: ["Node.js", "Next.js", "Express.js", "RESTful APIs", "Zod", "TypeScript", "Socket Architecture"],
  Interface: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "Figma"],
  Security: ["bcrypt", "JWT (jose)", "Middleware", "Input validation", "Signed sessions"],
  Motion: ["Framer Motion", "Three.js", "React Three Fiber", "Lenis", "WebGL", "Gemini API", "GitHub Copilot"],
} as const;

/**
 * The layers of a database-backed web app, each described the way this very
 * site uses it. Edit freely; the home tile and the /stack page both read
 * from here.
 */
export const STACK_LAYERS: StackLayer[] = [
  {
    id: "data",
    icon: "database",
    title: "Data",
    tagline: "Relational schema design",
    summary:
      "I start from the model: the entities, their keys and relationships, and the indexes that keep the common queries fast.",
    tools: ["PostgreSQL", "Prisma", "SQL"],
  },
  {
    id: "server",
    icon: "network",
    title: "Server",
    tagline: "Server Actions and APIs",
    summary:
      "Server Components read the data and Server Actions change it, with every input validated before it reaches the database.",
    tools: ["Next.js", "Node.js", "Zod", "TypeScript"],
  },
  {
    id: "interface",
    icon: "code",
    title: "Interface",
    tagline: "React and Next.js",
    summary:
      "Component-driven UI that works from a phone up to a desktop, with keyboard focus and reduced-motion handled from the start.",
    tools: ["React", "Tailwind CSS", "TypeScript"],
  },
  {
    id: "security",
    icon: "lock",
    title: "Security",
    tagline: "Auth and security",
    summary:
      "Hashed passwords, signed session cookies, and every write re-checking who is asking instead of trusting the route it came from.",
    tools: ["bcrypt", "JWT (jose)", "Middleware"],
  },
  {
    id: "motion",
    icon: "sparkle",
    title: "Motion",
    tagline: "Motion and interaction",
    summary:
      "Spring-based interaction rather than fixed easing, and small WebGL scenes only where a visual explains something.",
    tools: ["Framer Motion", "Three.js", "React Three Fiber", "Lenis"],
  },
];
