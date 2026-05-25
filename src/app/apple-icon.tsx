// iOS home-screen icon. Generated at build/request time by next/og.
// Apple touch icons must be PNG; iOS will round the corners automatically
// when added to the home screen, so we render a full square here.

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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c241b",
          color: "#f6f1e8",
          position: "relative",
        }}
      >
        {/* Subtle rubric accent line near the top */}
        <div
          style={{
            position: "absolute",
            top: 28,
            width: 36,
            height: 3,
            background: "#6a4a1a",
          }}
        />
        {/* The sigma — for Sophia (σοφία). */}
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 140,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginTop: 14,
            color: "#f6f1e8",
          }}
        >
          σ
        </div>
      </div>
    ),
    size
  );
}
