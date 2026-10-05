import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Static routes only. If project case studies ever get their own URLs
 * (e.g. /projects/[slug]), generate those entries here too by reading
 * getPublicProjects() — the plumbing already exists in lib/projects-data.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/projects", "/stack", "/about", "/contact"];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
