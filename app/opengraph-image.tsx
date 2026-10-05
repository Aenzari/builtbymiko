import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated share-card: no static asset required, so there is nothing to
 * forget to add before launch. To use a real photo instead, add a static
 * app/opengraph-image.png (or .jpg) — Next prefers a static file over this
 * function automatically, and this file can then be deleted.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FAFAFA",
          backgroundImage:
            "radial-gradient(circle at 78% 22%, rgba(138,154,130,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5F6B58",
          }}
        >
          Database &amp; Full-Stack Developer
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            color: "#2B2B26",
            maxWidth: 980,
          }}
        >
          Schema first. Interface always.
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#5A5A50" }}>
          {siteConfig.author.name}
        </div>
      </div>
    ),
    { ...size }
  );
}
