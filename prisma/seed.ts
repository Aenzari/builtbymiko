import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin account -------------------------------------------------
  // Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before seeding.
  // The password is hashed here and only the hash is ever stored.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before running the seed script."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { passwordHash },
    create: { email: adminEmail.toLowerCase(), passwordHash },
  });

  console.log(`Admin account ready: ${adminEmail}`);

  // --- Projects --------------------------------------------------------
  // Placeholder copy below — edit summary/description/metrics/stack/links
  // for each to match the real project details, then re-run `npm run seed`
  // (upsert means it's safe to run repeatedly).
  const projects = [
    {
      slug: "swiftdo",
      title: "SwiftDo",
      category: "WEB_PLATFORM" as const,
      year: 2025,
      summary: "A fast, keyboard-first task manager built to disappear into a daily workflow.",
      description:
        "SwiftDo is a task and productivity app focused on speed: every core action — adding a task, marking it done, rescheduling — is reachable without touching the mouse. Built as a full-stack project to practice relational data modeling (users, tasks, tags, and recurring schedules) alongside a responsive front end.",
      metrics: [
        { label: "Stack", value: "Full-stack" },
        { label: "Status", value: "Active" },
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      demoUrl: null,
      repoUrl: null,
      isFlagship: true,
      accentColor: "#8A9A82",
      sortOrder: 0,
    },
    {
      slug: "the-safehouse",
      title: "The Safehouse",
      category: "DATABASE_SYSTEMS" as const,
      year: 2025,
      summary: "A community safety and reporting platform backed by a normalized relational schema.",
      description:
        "The Safehouse lets community members log and look up safety reports for their area. The project's core challenge was database design: modeling reports, locations, categories, and verification status in a normalized schema that stays fast to query as report volume grows, with attention to indexing on the fields used for filtering and search.",
      metrics: [
        { label: "Focus", value: "DB Design" },
        { label: "Status", value: "In progress" },
      ],
      stack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
      demoUrl: null,
      repoUrl: null,
      isFlagship: false,
      accentColor: "#B08968",
      sortOrder: 1,
    },
    {
      slug: "glaze-and-gaze",
      title: "Glaze & Gaze",
      category: "PRODUCT_DESIGN" as const,
      year: 2024,
      summary: "An ordering and menu-browsing experience for a small dessert business.",
      description:
        "Glaze & Gaze is a customer-facing ordering site for a small dessert brand — a menu with categories and add-ons, a cart, and an order-summary flow. Built with an emphasis on a warm, appetite-appealing visual design paired with a straightforward, low-friction checkout path.",
      metrics: [
        { label: "Focus", value: "UX / UI" },
        { label: "Type", value: "Client project" },
      ],
      stack: ["React", "Tailwind CSS", "Node.js"],
      demoUrl: null,
      repoUrl: null,
      isFlagship: false,
      accentColor: "#C97B63",
      sortOrder: 2,
    },
    {
      slug: "careercenter-plus",
      title: "CareerCenter+",
      category: "WEB_PLATFORM" as const,
      year: 2024,
      summary: "A campus career-services portal connecting students with job postings and application tracking.",
      description:
        "CareerCenter+ is a portal built to connect students with job and internship postings, with role-based access for students, employers, and career-center staff, plus application-status tracking end to end. The project focuses on multi-role authentication and a relational schema linking students, postings, employers, and applications.",
      metrics: [
        { label: "Roles", value: "3 user types" },
        { label: "Focus", value: "Full-stack" },
      ],
      stack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript", "Tailwind CSS"],
      demoUrl: null,
      repoUrl: null,
      isFlagship: false,
      accentColor: "#7A8B99",
      sortOrder: 3,
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
