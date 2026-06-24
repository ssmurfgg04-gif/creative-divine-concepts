import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Creative Divine Concepts - T-Shirt Printing & Web Design Kenya",
    short_name: "Creative Divine",
    description:
      "Kenya's #1 creative studio for T-shirt printing (DTF/DTG), web design & branding. 14 free online design tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#f36a21",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["business", "design", "shopping", "productivity"],
    lang: "en",
    dir: "ltr",
  };
}
