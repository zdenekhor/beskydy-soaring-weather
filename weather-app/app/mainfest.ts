import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SPL Weather – Beskydy",
    short_name: "SPL Weather",
    description: "Gliding weather briefing for Beskydy",
    start_url: "/",
    display: "standalone",
    background_color: "#071a34",
    theme_color: "#071a34",
    orientation: "portrait",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}