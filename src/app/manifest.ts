import type { MetadataRoute } from "next";

// eslint-disable-next-line import/no-default-export
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personly",
    short_name: "Personly",
    description: "Personal CRM for your friends and family",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
