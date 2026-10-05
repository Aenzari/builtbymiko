import type { PortfolioProject } from "@/types/portfolio";

/** Legacy alias kept while existing public components migrate to PortfolioProject. */
export type Project = PortfolioProject & {
  /** Existing flagship presentation flag. */
  isFlagship?: boolean;
};

export type {
  CaseStudyBlock,
  ProjectCategory,
  ProjectLinks,
  ProjectMetric,
} from "@/types/portfolio";
