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
      url: "/#work",
      priority: 0.95,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/#services",
      priority: 0.9,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/#blog",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/#tools",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/#pricing",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/#academy",
      priority: 0.7,
      changeFrequency: "weekly" as const,
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

  // Local SEO pages (high priority for local search)
  const localSeoPages = [
    "dtf-printing-nairobi",
    "dtf-printing-kiambu",
    "web-design-nairobi",
    "web-design-kiambu",
    "branding-kenya",
    "t-shirt-printing-nairobi",
  ].map((slug) => ({
    url: `/#local/${slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  }));

  // Blog post pages (keyword-rich content)
  const blogSlugs = [
    "how-to-prepare-dtf-artwork-for-printing-in-kenya",
    "dtf-vs-dtg-printing-which-is-better",
    "how-to-start-a-tshirt-printing-business-in-kenya",
    "best-gang-sheet-sizes-for-dtf-printing",
    "web-design-prices-in-kenya-2026",
    "branding-for-diaspora-founders",
    "ai-tools-for-t-shirt-designers",
    "how-to-remove-background-from-image-for-dtf-printing",
    "best-free-design-tools-for-t-shirt-printers-2026",
    "how-to-build-diaspora-business-in-kenya-remotely",
    "web-design-cost-in-kenya-2026-complete-pricing-guide",
    "kenya-vat-registration-guide-for-small-businesses",
    "logo-design-cost-kenya-complete-branding-guide",
  ];
  const blogPages = blogSlugs.map((slug) => ({
    url: `/#blog/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  // Tool pages (each is a unique landing page)
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
    "file-share",
    "print-converter",
    "color-separation",
    "typography-studio",
    "mannequin-dressup",
  ].map((tool) => ({
    url: `/#tool/${tool}`,
    priority: 0.75,
    changeFrequency: "weekly" as const,
  }));

  return [...staticPages, ...localSeoPages, ...blogPages, ...toolPages].map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
