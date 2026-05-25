// Favicon — small version of the apple-touch-icon.

import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#2c241b",
          color: "#f6f1e8",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: 52,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        σ
      </div>
    ),
    size
  );
}
