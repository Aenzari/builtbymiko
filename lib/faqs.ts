export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "What do you build?",
    answer:
      "Database-backed web apps: the relational schema, the server logic, and the interface on top. My projects are listed on the Projects page.",
  },
  {
    question: "Are you available for work?",
    answer:
      "I'm open to internships and freelance projects alongside my studies. Tell me about the project and the timeline and I'll say honestly whether it fits.",
  },
  {
    question: "What is your stack?",
    answer:
      "Mostly Next.js, TypeScript, PostgreSQL and Prisma, with Tailwind CSS and Framer Motion for the interface. The Stack page has the details.",
  },
  {
    question: "What should I put in my message?",
    answer:
      "What you're building, who it's for, and any deadline. A rough scope is enough; we can work out the rest by email.",
  },
  {
    question: "What happens after I write?",
    answer:
      "Your message is saved and I reply by email. There is no newsletter and no automated follow-up.",
  },
];
