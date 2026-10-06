export type SocialKind = "github" | "linkedin" | "fb" | "email" | "website";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
}

export interface PortfolioProfile {
  id: string;
  displayName: string;
  fullName: string;
  headline: string;
  roles: string[];
  bio: string;
  location: string;
  timezone: string;
  availability: string;
  availabilityState: "available" | "limited" | "unavailable";
  email: string;
  avatarUrl?: string;
  socials: SocialLink[];
  updatedAt: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startedAt: string;
  endedAt?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  sortOrder: number;
  isCurrent: boolean;
}

export type SkillCategory =
  | "engineering"
  | "data"
  | "design"
  | "workflow"
  | "other";

export interface SkillEntry {
  id: string;
  name: string;
  category: SkillCategory;
  level?: string;
  proof?: string;
  sortOrder: number;
}

export interface CaseStudyBlock {
  id: string;
  type: "text" | "quote" | "image" | "code" | "metric" | "architecture";
  eyebrow?: string;
  title?: string;
  body?: string;
  code?: string;
  language?: string;
  src?: string;
  alt?: string;
  label?: string;
  value?: string;
  items?: string[];
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLinks {
  demo?: string;
  repo?: string;
}

export type ProjectCategory =
  | "Product Design"
  | "Web Platform"
  | "Design Engineering"
  | "Database Systems"
  | "Experiment"
  | "Open Source";

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  client?: string;
  role?: string;
  deployment?: string;
  summary: string;
  description: string;
  metrics: ProjectMetric[];
  stack: string[];
  links: ProjectLinks;
  caseStudy: CaseStudyBlock[];
  mediaAssets: string[];
  isFeatured: boolean;
  featuredPriority: number;
  isArchived: boolean;
  accentColor: string;
}
