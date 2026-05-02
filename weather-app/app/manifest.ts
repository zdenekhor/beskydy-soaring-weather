import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Počasí LKFR",
    short_name: "LKFR",
    description: "Predpoved pocasi pro LKFR a hodnoceni podminek pro plachtare SPL.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071a34",
    theme_color: "#071a34",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
