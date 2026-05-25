// PWA manifest — gives Android and modern browsers the right name,
// theme color, and standalone display mode when added to the home screen.
// iOS reads name + theme via apple-mobile-web-app-* meta tags (set in
// layout.tsx). Both pull their icons from the icon/apple-icon routes.

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sophia — A Daily Philosophy Quiz",
    short_name: "Sophia",
    description:
      "Learn the canon of Western philosophy one thinker at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#2c241b",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
