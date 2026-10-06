import { siteConfig } from "@/lib/site-config";

/**
 * Renders a Person JSON-LD block. Server component with no interactivity —
 * safe to render in the root layout without affecting hydration.
 */
export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
    jobTitle: "Creative Technologist",
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
