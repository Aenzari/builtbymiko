import Link from "next/link";

/**
 * Root-level fallback for a URL that doesn't match any layout at all (an
 * unknown top-level segment). The one inside app/(site)/ handles the
 * common case — a mistyped path under the real site — with the full shell;
 * this one intentionally stays dependency-free.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ background: "#FAFAFA", color: "#2B2B26", fontFamily: "sans-serif" }}>
        <main
          style={{
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          <p style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#8A9A82" }}>
            404
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Nothing at this address.</h1>
          <Link href="/" style={{ color: "#5F6B58", textDecoration: "underline" }}>
            Back home
          </Link>
        </main>
      </body>
    </html>
  );
}
