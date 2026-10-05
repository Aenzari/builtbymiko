import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 84,
          fontWeight: 700,
          color: "#FAFAFA",
          fontFamily: "sans-serif",
          letterSpacing: -2,
        }}
      >
        MQ
      </div>
    ),
    { ...size }
  );
}
