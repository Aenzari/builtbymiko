import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Generated favicon: initials on a sage tile. No image asset to forget to
 * add — replace with a real photo-based icon later by adding a static
 * app/icon.png (or .svg), which Next will prefer automatically over this
 * file.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8A9A82",
          borderRadius: 14,
          fontSize: 30,
          fontWeight: 700,
          color: "#FAFAFA",
          fontFamily: "sans-serif",
          letterSpacing: -1,
        }}
      >
        MQ
      </div>
    ),
    { ...size }
  );
}
