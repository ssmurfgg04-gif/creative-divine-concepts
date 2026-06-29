import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { ExitIntentPopup } from "@/components/site/ExitIntentPopup";
import { SocialProofNotifications } from "@/components/site/SocialProofNotifications";

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
    default: "Creative Divine Concepts | T-Shirt Printing, DTF/DTG & Web Design in Kenya",
    template: "%s | Creative Divine Concepts",
  },
  description:
    "Kenya's creative studio for T-shirt printing (DTF/DTG), custom apparel design, web development & branding. 15 free online design tools. Based in Kiambu, serving East Africa & diaspora. Get a quote today!",
  keywords: [
    "t-shirt printing Kenya",
    "DTF printing Kenya",
    "DTG printing Nairobi",
    "custom apparel Kenya",
    "gang sheet builder",
    "T-shirt design tools",
    "background remover online",
    "vectorizer online free",
    "mockup generator 3D",
    "web design Kenya",
    "branding Kenya",
    "Creative Divine Concepts",
    "Kiambu printing",
    "Nairobi design studio",
    "diaspora business Kenya",
    "startup launch Kenya",
    "digital marketing Kenya",
    "DTF transfers Kenya",
    "custom printed t-shirts Nairobi",
    "embroidery Kenya",
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
    title: "Creative Divine Concepts | T-Shirt Printing, DTF/DTG & Web Design Kenya",
    description:
      "Kenya's #1 creative studio for T-shirt printing, DTF/DTG, web design & branding. 14 free online design tools. Based in Kiambu, serving East Africa & diaspora.",
    url: SITE_URL,
    siteName: "Creative Divine Concepts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Creative Divine Concepts - T-Shirt Printing, DTF/DTG & Web Design in Kenya",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Divine Concepts | T-Shirt Printing & Web Design Kenya",
    description:
      "Kenya's #1 creative studio for T-shirt printing (DTF/DTG), web design & branding. 14 free online design tools.",
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
    "Kenya's #1 creative studio for T-shirt printing (DTF/DTG), custom apparel design, web development & branding. 14 free online design tools.",
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
  description: "T-Shirt Printing, DTF/DTG, Web Design & Branding in Kenya",
  publisher: { "@id": `${SITE_URL}/#business` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/#tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// Breadcrumb schema
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
        {/* Skip to content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        {children}
        <FloatingWhatsApp />
        <ExitIntentPopup />
        <SocialProofNotifications />
        <Toaster />
        <SonnerToaster richColors position="top-right" />
        {/* SEO: Noscript fallback for crawlers that don't execute JavaScript */}
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Creative Divine Concepts</h1>
            <p>
              Kenya&apos;s #1 creative studio for T-shirt printing (DTF/DTG), custom apparel design,
              web development &amp; branding. Based in Kiambu, serving East Africa &amp; the diaspora.
            </p>
            <p>
              Contact us: +254 711 669 113 | info@creativedivineconcepts.com | Githunguri Ndumberi, Kiambu, Kenya
            </p>
            <p>
              Services: T-Shirt Printing, DTF Printing, DTG Printing, Web Design, Branding,
              Digital Marketing, Gang Sheet Building, Embroidery, Screen Printing.
            </p>
            <p>
              Free online tools: Canvas Designer, Effects Studio, AI Design Gen, Color Knockout,
              Vectorizer, Mockup Generator, ScreenshotFX, Image Upscaler, Sticker Gen, Image Clipper,
              VAT Calculator, Image Resizer, Color Palette, Caption Gen.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
