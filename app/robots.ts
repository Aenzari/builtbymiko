import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin dashboard is already behind a login and middleware; it
        // is also excluded here so it never shows up in search results.
        disallow: ["/admin"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
