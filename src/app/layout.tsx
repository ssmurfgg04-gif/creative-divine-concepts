import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { ExitIntentPopup } from "@/components/site/ExitIntentPopup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const league = League_Spartan({
  variable: "--font-league",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_URL = "https://creativedivineconcepts.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Creative Divine Concepts | Web Design, Branding & DTF Printing in Kenya",
    template: "%s | Creative Divine Concepts",
  },
  description:
    "Web design, branding and DTF/DTG printing in Kenya. From first sketch to final print, we build brands that founders, designers, and creators trust. Based in Kiambu, serving Nairobi, Mombasa, diaspora & beyond.",
  keywords: [
    "web design Kenya",
    "DTF printing Kenya",
    "DTG printing Nairobi",
    "branding Kenya",
    "T-shirt printing Kenya",
    "custom apparel Kenya",
    "gang sheet builder",
    "T-shirt design tools",
    "background remover online",
    "vectorizer online free",
    "mockup generator 3D",
    "Creative Divine Concepts",
    "Kiambu printing",
    "Nairobi design studio",
    "diaspora business Kenya",
    "startup launch Kenya",
    "digital marketing Kenya",
    "DTF transfers Kenya",
    "custom printed t-shirts Nairobi",
    "logo design Kenya",
  ],
  authors: [{ name: "Creative Divine Concepts Ltd" }],
  creator: "Creative Divine Concepts Ltd",
  publisher: "Creative Divine Concepts Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Creative Divine Concepts | Web Design, Branding & DTF Printing in Kenya",
    description:
      "Web design, branding and DTF/DTG printing in Kenya. From first sketch to final print. 19 free online design tools. Based in Kiambu, serving Nairobi, Mombasa, diaspora & beyond.",
    url: SITE_URL,
    siteName: "Creative Divine Concepts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Creative Divine Concepts - Web Design, Branding & DTF Printing in Kenya",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Divine Concepts | Web Design, Branding & DTF Printing Kenya",
    description:
      "Web design, branding and DTF/DTG printing in Kenya. 19 free online design tools. Built in Kiambu, serving East Africa & diaspora.",
    images: ["/og-image.png"],
  },
  category: "Business & Industrial",
  other: {
    "geo.region": "KE-14",
    "geo.placename": "Kiambu",
    "geo.position": "-1.0444;36.6667",
    "ICBM": "-1.0444, 36.6667",
    "theme-color": "#f36a21",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f36a21",
};

// Structured Data for LocalBusiness (critical for local SEO)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: "Creative Divine Concepts Ltd",
  alternateName: "Creative Divine Concepts",
  description:
    "Web design, branding and DTF/DTG printing in Kenya. From first sketch to final print, we build brands that founders, designers, and creators trust.",
  url: SITE_URL,
  telephone: "+254711669113",
  email: "info@creativedivineconcepts.com",
  image: `${SITE_URL}/og-image.png`,
  logo: `${SITE_URL}/logo.jpeg`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Githunguri Ndumberi",
    addressLocality: "Kiambu",
    addressRegion: "Kiambu County",
    postalCode: "00220",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.0444,
    longitude: 36.6667,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "16:00",
    },
  ],
  sameAs: [
    "https://twitter.com/divineconcepts",
    "https://linkedin.com/company/divineconcepts",
    "https://wa.me/+254711669113",
    "https://facebook.com/creativedivineconcepts",
    "https://instagram.com/creative.divine.concepts",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
  areaServed: [
    { "@type": "Country", name: "Kenya" },
    { "@type": "City", name: "Nairobi" },
    { "@type": "City", name: "Kiambu" },
    { "@type": "Place", name: "East Africa" },
  ],
  knowsAbout: [
    "T-Shirt Printing",
    "DTF Printing",
    "DTG Printing",
    "Custom Apparel",
    "Web Design",
    "Web Development",
    "Branding",
    "Graphic Design",
    "Digital Marketing",
    "Gang Sheet Building",
    "Embroidery",
    "Screen Printing",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Creative & Business Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "T-Shirt Printing (DTF/DTG)",
          description: "Direct-to-film and direct-to-garment T-shirt printing with custom designs.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Design & Development",
          description: "Professional website design, eCommerce stores, and custom web applications.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Branding & Graphic Design",
          description: "Brand identity, logo design, and visual storytelling for businesses.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Digital Marketing",
          description: "Social media management, lead generation, and customer care systems.",
        },
      },
    ],
  },
};

// Website schema with search action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Creative Divine Concepts",
  description: "Web Design, Branding & DTF Printing in Kenya",
  publisher: { "@id": `${SITE_URL}/#business` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/#tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// Breadcrumb schema with full nav structure
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: `${SITE_URL}/#services`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Work",
      item: `${SITE_URL}/#work`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Pricing",
      item: `${SITE_URL}/#pricing`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Blog",
      item: `${SITE_URL}/#blog`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "About",
      item: `${SITE_URL}/#about`,
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Contact",
      item: `${SITE_URL}/#contact`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance: preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Performance: preload critical hero image (not video, to save bandwidth) */}
        <link rel="preload" as="image" href="/logo.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${league.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* Skip to content for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
            Skip to content
          </a>
          {children}
          <FloatingWhatsApp />
          <ExitIntentPopup />
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
        {/* SEO: Noscript fallback for crawlers that don't execute JavaScript */}
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Creative Divine Concepts</h1>
            <p>
              Web design, branding and DTF/DTG printing in Kenya. From first sketch to final print,
              we build brands that founders, designers, and creators trust. Based in Kiambu, serving
              Nairobi, Mombasa, diaspora &amp; beyond.
            </p>
            <p>
              Contact: +254 711 669 113 | info@creativedivineconcepts.com | Githunguri Ndumberi, Kiambu, Kenya
            </p>
            <p>
              Services: Web Design, Branding, DTF / DTG Printing, Diaspora Operations, Digital Marketing.
            </p>
            <p>
              19 free online tools: Canvas Designer, Effects Studio, AI Design Gen, Color Knockout,
              Vectorizer, Mockup Generator, ScreenshotFX, Image Upscaler, Sticker Gen, Image Clipper,
              VAT Calculator, Image Resizer, Color Palette, Caption Gen, File Share, AI Print Converter,
              Color Separation, Typography Studio, 3D Mannequin Dress-Up.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
