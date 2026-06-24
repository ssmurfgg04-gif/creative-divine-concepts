import type { Metadata } from "next";
import { Inter, League_Spartan, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const league = League_Spartan({
  variable: "--font-league",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Creative Divine Concepts | Design, Build & Scale Businesses in Kenya",
  description:
    "Creative Divine Concepts offers professional design tools, web development, and printing solutions. Free browser-based creative tools for T-shirt printing, DTF/DTG artwork, and brand design.",
  keywords: [
    "Creative Divine Concepts",
    "Kenya design",
    "DTF printing",
    "DTG printing",
    "T-shirt design",
    "gang sheet builder",
    "design tools",
    "background remover",
    "vectorizer",
    "mockup generator",
  ],
  authors: [{ name: "Creative Divine Concepts" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Creative Divine Concepts | Design, Build & Scale Businesses",
    description:
      "Free browser-based creative design tools for T-shirt printing, DTF/DTG artwork, and brand design. Built for designers and non-designers alike.",
    url: "https://creativedivineconcepts.com/",
    siteName: "Creative Divine Concepts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Divine Concepts",
    description: "Free browser-based creative design tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${league.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
