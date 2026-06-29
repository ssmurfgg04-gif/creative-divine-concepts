import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Creative Divine Concepts - T-Shirt Printing & Web Design Kenya",
    short_name: "Creative Divine",
    description:
      "Kenya's creative studio for T-shirt printing (DTF/DTG), web design & branding. 19 free online design tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5e9d7",
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
