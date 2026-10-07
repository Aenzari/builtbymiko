import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before running the seed script.");
  }

  await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { passwordHash: await bcrypt.hash(adminPassword, 12) },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const projects = [
    {
      slug: "baylo", title: "Baylo", category: "WEB_PLATFORM" as const, year: 2026,
      client: "N/A (Independent Venture)", role: "Full Stack Developer / Creator",
      deployment: "Not Deployed (In Development)",
      summary: "A localized, cashless skills marketplace powered by a peer-to-peer time-bank economy.",
      description: "Baylo replaces monetary transactions with a fair time-bank mechanism where 1 hour of service equals 1 credit. Integrated AI matchmaking pairs mentors and learners based on competencies, needs, and schedules.",
      stack: ["React", "Tailwind CSS", "Supabase", "Gemini API", "TypeScript"],
      demoUrl: null, repoUrl: null, isFlagship: true, isFeatured: true, featuredPriority: 0, sortOrder: 0, accentColor: "#9ABF68",
    },
    {
      slug: "the-safehouse", title: "The Safehouse", category: "WEB_PLATFORM" as const, year: 2026,
      client: "Course Major Project (Academic)", role: "Full Stack Developer / Database Architect",
      deployment: "Local / Finished (Unpublished)",
      summary: "A full-stack operations management system for a hybrid computer cafe and community lounge.",
      description: "The Safehouse handles dynamic seat allocations across PC battle stations and lounge areas while concurrently processing real-time bistro orders under high traffic.",
      stack: ["Node.js", "Express.js", "MongoDB", "Tailwind CSS", "EJS"],
      demoUrl: null, repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 1, sortOrder: 1, accentColor: "#B08968",
    },
    {
      slug: "pace", title: "PACE (CareerConnect+)", category: "WEB_PLATFORM" as const, year: 2026,
      client: "University Research / Thesis", role: "Lead Researcher & Full Stack Engineer",
      deployment: "In Development (Thesis R&D)",
      summary: "A localized career guidance and institutional counseling hub.",
      description: "PACE provides a centralized platform linking student competencies with regional labor market intelligence, streamlining institutional guidance and data-backed career paths.",
      stack: ["Next.js", "PostgreSQL", "Supabase", "TypeScript", "Tailwind CSS"],
      demoUrl: null, repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 2, sortOrder: 2, accentColor: "#7A8B99",
    },
    {
      slug: "kusyna", title: "Kusyna (Kusy)", category: "WEB_PLATFORM" as const, year: 2026,
      client: "N/A (Startup Venture)", role: "Full Stack Developer / Founder",
      deployment: "kusyna.netlify.app",
      summary: "A tech-powered student food hub connecting craving analytics with kitchen preparation and online orders.",
      description: "Kusyna captures real-time student food cravings and purchase trends, enabling dynamic preparation schedules that satisfy campus demand while minimizing inventory waste.",
      stack: ["Vue.js", "Node.js", "Express.js", "MongoDB", "Netlify"],
      demoUrl: "https://kusyna.netlify.app", repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 3, sortOrder: 3, accentColor: "#C97B63",
    },
    {
      slug: "wecats", title: "WeCats", category: "WEB_PLATFORM" as const, year: 2026,
      client: "Course Major Project (MSU-IIT)", role: "Full Stack Engineer & Backend Architect",
      deployment: "wecats.netlify.app",
      summary: "An exclusive campus forum secured via institutional email domains and Supabase auth.",
      description: "WeCats provides a verified digital community for academic coordination with real-time message threads and discussion boards built exclusively for MSU-IIT students.",
      stack: ["React", "Supabase", "PostgreSQL", "Tailwind CSS", "Netlify"],
      demoUrl: "https://wecats.netlify.app", repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 4, sortOrder: 4, accentColor: "#8A9A82",
    },
    {
      slug: "pawmise", title: "Pawmise", category: "WEB_PLATFORM" as const, year: 2026,
      client: "N/A (Independent Project)", role: "Product Designer & Full Stack Developer",
      deployment: "pawmise.netlify.app",
      summary: "A private two-player relationship companion app built around shared routines and reflection.",
      description: "Pawmise encourages intentional daily communication using co-op mechanics: completing shared habits, maintaining connection streaks, and unlocking shared milestones.",
      stack: ["React", "Tailwind CSS", "TypeScript", "Supabase", "Netlify"],
      demoUrl: "https://pawmise.netlify.app", repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 5, sortOrder: 5, accentColor: "#C58F9A",
    },
    {
      slug: "epigraph", title: "EpiGraph", category: "DATABASE_SYSTEMS" as const, year: 2026,
      client: "Course Major Project (Academic)", role: "Graph Database Architect & Backend Developer",
      deployment: "Local / Finished (Unpublished)",
      summary: "An epidemiological command dashboard using graph topology to track airborne transmission vectors.",
      description: "EpiGraph models individuals, physical venues, and exposure windows as interconnected nodes and edges in Neo4j, enabling fast multi-hop contact tracing for public health teams.",
      stack: ["Neo4j", "Cypher", "Vis.js", "Node.js", "Express.js"],
      demoUrl: null, repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 6, sortOrder: 6, accentColor: "#91B5C7",
    },
    {
      slug: "golazo", title: "Golazo | Intramural Sports Management", category: "DATABASE_SYSTEMS" as const, year: 2026,
      client: "Course Major Project (Academic)", role: "Backend Developer & Database Engineer",
      deployment: "Local / Finished (Unpublished)",
      summary: "A high-throughput sports management system with live scoreboards, brackets, rosters, and QR checkout.",
      description: "Golazo combines in-memory caching for live match scoring with QR pass verification, preventing equipment bottlenecks and providing live updates across tournament venues.",
      stack: ["Redis", "Node.js", "Express.js", "Tailwind CSS", "HTML5"],
      demoUrl: null, repoUrl: null, isFlagship: false, isFeatured: true, featuredPriority: 7, sortOrder: 7, accentColor: "#D2A679",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`Seeded project: ${project.title}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
