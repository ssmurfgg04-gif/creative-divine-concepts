import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://creativedivineconcepts.com";
  const lastModified = new Date();

  const staticPages = [
    {
      url: "/",
      priority: 1.0,
      changeFrequency: "daily" as const,
    },
    {
      url: "/#tools",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/#services",
      priority: 0.9,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/#academy",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/#pricing",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/#about",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/#contact",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
  ];

  // Tool pages (high priority for SEO - each is a unique landing page)
  const toolPages = [
    "canvas-designer",
    "effects-studio",
    "ai-design-gen",
    "color-knockout",
    "vectorizer",
    "mockup-generator",
    "screenshot-fx",
    "image-upscaler",
    "sticker-gen",
    "image-clipper",
    "vat-calculator",
    "image-resizer",
    "color-palette",
    "caption-gen",
  ].map((tool) => ({
    url: `/#tool/${tool}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  return [...staticPages, ...toolPages].map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
