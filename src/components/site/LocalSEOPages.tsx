"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocalPageProps {
  onNavigate: (view: any) => void;
  pageId: string;
}

const LOCAL_PAGES: Record<string, {
  h1: string;
  metaTitle: string;
  metaDesc: string;
  city: string;
  coordinates: { lat: number; lng: number };
  content: { heading: string; text: string }[];
  faqs: { q: string; a: string }[];
  cta: string;
}> = {
  "dtf-printing-nairobi": {
    h1: "DTF Printing Services in Nairobi | Same-Day Turnaround",
    metaTitle: "DTF Printing Nairobi | Same-Day DTF Transfers Kenya",
    metaDesc: "Professional DTF printing in Nairobi. Custom T-shirt transfers, gang sheets, and bulk orders. Serving CBD, Westlands, Kilimani. From KES 500 per print.",
    city: "Nairobi",
    coordinates: { lat: -1.2864, lng: 36.8172 },
    content: [
      { heading: "DTF Printing in Nairobi", text: "Creative Divine Concepts offers professional DTF (Direct-to-Film) printing services in Nairobi, Kenya. Whether you need a single custom T-shirt or 500 pieces for an event, we deliver high-quality prints with fast turnaround. Our DTF printing produces vibrant, durable prints that last 50+ washes and work on any fabric color." },
      { heading: "Areas We Serve in Nairobi", text: "We serve all Nairobi areas including CBD, Westlands, Kilimani, Lavington, Karen, Ngong Road, Thika Road, Ruaka, and Eastlands. We also offer delivery across Nairobi via Sendy, G4S, and Easy Coach. Walk-in orders welcome at our partner locations." },
      { heading: "Why Choose DTF Printing?", text: "DTF printing is the modern alternative to screen printing and DTG. It works on cotton, polyester, blends, and even nylon. No pre-treatment needed. Colors are vibrant and durable. Perfect for custom T-shirts, hoodies, tote bags, uniforms, and promotional items." },
      { heading: "Pricing for Nairobi Clients", text: "DTF transfers start from KES 500 per print for small orders. Bulk discounts apply: 20+ pieces get 10% off, 50+ pieces get 15% off, 100+ pieces get 25% off. Gang sheet building is free using our online Canvas Designer tool. Delivery within Nairobi costs KES 200-500 depending on location." },
    ],
    faqs: [
      { q: "How long does DTF printing take in Nairobi?", a: "Small orders (1-10 pieces) can be ready same day if delivered before 12pm. Bulk orders (50+) take 2-5 days. Rush orders available." },
      { q: "Do you deliver in Nairobi?", a: "Yes! We deliver across Nairobi via Sendy, G4S, or our own riders. Delivery costs KES 200-500 depending on your location." },
      { q: "What areas in Nairobi do you serve?", a: "We serve all Nairobi areas: CBD, Westlands, Kilimani, Lavington, Karen, Ngong Road, Thika Road, Ruaka, Eastlands, and more." },
      { q: "Can I walk in for DTF printing?", a: "Our main studio is in Githunguri Ndumberi, Kiambu (30 minutes from Nairobi CBD). We also have partner drop-off points in Nairobi. Contact us on WhatsApp for the nearest location." },
    ],
    cta: "Order DTF Printing in Nairobi",
  },
  "dtf-printing-kiambu": {
    h1: "DTF Printing in Kiambu | Githunguri & Ndumberi Studio",
    metaTitle: "DTF Printing Kiambu | Githunguri Ndumberi Print Studio",
    metaDesc: "Local DTF printing studio in Kiambu, Kenya. Walk-in service in Githunguri Ndumberi. Custom T-shirts, gang sheets, and bulk printing. From KES 500 per print.",
    city: "Kiambu",
    coordinates: { lat: -1.0444, lng: 36.6667 },
    content: [
      { heading: "Local DTF Printing in Kiambu", text: "Creative Divine Concepts is based in Githunguri Ndumberi, Kiambu County. We are the only studio in Kiambu offering professional DTF printing with same-day service for small orders. Our walk-in studio is open Monday to Saturday." },
      { heading: "Walk-In Service", text: "Visit our studio at Githunguri Ndumberi, along Githunguri-Ndumberi Road. Bring your own T-shirts or buy from us. We print while you wait for small orders. No appointment needed, but WhatsApp us first for bulk orders." },
      { heading: "Serving All of Kiambu County", text: "We serve Githunguri, Kiambu Town, Ruiru, Juja, Thika, Limuru, Kikuyu, Karuri, and all surrounding areas. Local delivery is free for orders above KES 5,000 within Githunguri." },
      { heading: "Why Choose a Local Printer?", text: "Choosing a local DTF printer in Kiambu means faster turnaround, lower delivery costs, face-to-face consultations, and supporting the local economy. No need to travel to Nairobi for quality printing." },
    ],
    faqs: [
      { q: "Where is your studio in Kiambu?", a: "We are located in Githunguri Ndumberi, along the Githunguri-Ndumberi Road, Kiambu County. Open Mon-Fri 8am-6pm, Sat 9am-4pm." },
      { q: "Do you offer walk-in printing?", a: "Yes! Walk in with your design and T-shirts. Small orders (1-10) can be printed while you wait. For bulk orders, please WhatsApp us first." },
      { q: "Is delivery free in Kiambu?", a: "Local delivery within Githunguri is free for orders above KES 5,000. Delivery to other Kiambu areas (Ruiru, Thika, Kikuyu) costs KES 200-400." },
      { q: "Can I buy T-shirts from you?", a: "Yes, we stock plain T-shirts in various colors and sizes (S-XXL). Prices start from KES 400 per T-shirt. We also supply hoodies, polos, and tote bags." },
    ],
    cta: "Visit Our Kiambu Studio",
  },
  "web-design-nairobi": {
    h1: "Web Design Services in Nairobi | Kenyan Businesses",
    metaTitle: "Web Design Nairobi | Professional Website Design Kenya",
    metaDesc: "Professional web design in Nairobi. Business websites, e-commerce stores, M-PESA integration. Starting from KES 45,000. Serving Nairobi businesses.",
    city: "Nairobi",
    coordinates: { lat: -1.2864, lng: 36.8172 },
    content: [
      { heading: "Web Design in Nairobi", text: "Creative Divine Concepts builds professional websites for Nairobi businesses. From small business websites to full e-commerce stores with M-PESA integration, we deliver modern, fast, SEO-optimized websites that convert visitors into customers." },
      { heading: "Websites Built for Nairobi Market", text: "Our websites are optimized for the Kenyan market: M-PESA payment integration, mobile-first design (80% of Kenyans browse on mobile), fast loading on Safaricom/Airtel networks, local SEO for Nairobi searches, and WhatsApp integration for customer service." },
      { heading: "Pricing for Nairobi Web Design", text: "Business websites start from KES 45,000 (5-10 pages). E-commerce stores from KES 80,000. Custom web applications from KES 150,000. All websites include SSL, mobile responsiveness, and basic SEO. Monthly maintenance from KES 5,000." },
      { heading: "Why Choose Us for Nairobi Web Design?", text: "We are a Nairobi-based team that understands the local market. We build with modern technology (Next.js, React), not outdated WordPress templates. Every website includes 1 month free support, SEO optimization, and training on how to update content." },
    ],
    faqs: [
      { q: "How much does a website cost in Nairobi?", a: "Business websites start from KES 45,000 for 5-10 pages. E-commerce stores from KES 80,000. The final price depends on features, pages, and design complexity." },
      { q: "Do you integrate M-PESA?", a: "Yes! We integrate Daraja API (M-PESA STK push, C2B, B2C) for KES 10,000 additional. This lets customers pay directly on your website." },
      { q: "How long does web design take?", a: "A standard business website takes 3-6 weeks. E-commerce stores take 6-12 weeks. Rush delivery available for urgent projects." },
      { q: "Do you offer website maintenance in Nairobi?", a: "Yes, monthly maintenance plans start from KES 5,000/month. Includes updates, backups, security monitoring, and content changes." },
    ],
    cta: "Get a Nairobi Website Quote",
  },
  "web-design-kiambu": {
    h1: "Web Design in Kiambu | Affordable & Professional",
    metaTitle: "Web Design Kiambu | Affordable Website Design Kenya",
    metaDesc: "Affordable web design in Kiambu, Kenya. Business websites, e-commerce, and branding for Kiambu businesses. Starting from KES 45,000. Local studio.",
    city: "Kiambu",
    coordinates: { lat: -1.0444, lng: 36.6667 },
    content: [
      { heading: "Affordable Web Design in Kiambu", text: "Creative Divine Concepts offers professional web design services from our Kiambu studio. We help small businesses, schools, churches, and startups in Kiambu County build their online presence without the Nairobi price tag." },
      { heading: "Built for Kiambu Businesses", text: "Whether you run a shop in Githunguri, a school in Ruiru, a hotel in Thika, or a farm in Limuru, we build websites that attract local customers. Our websites are optimized for local SEO so people searching for your services in Kiambu find you first." },
      { heading: "Special Kiambu Pricing", text: "We offer special pricing for Kiambu County businesses: 10% discount on all web design packages for businesses registered in Kiambu. We also offer payment plans (Lipa Pole Pole) for startups and small businesses." },
    ],
    faqs: [
      { q: "Do you offer web design in Kiambu?", a: "Yes! Our studio is in Githunguri Ndumberi, Kiambu. We serve all of Kiambu County including Ruiru, Thika, Juja, Limuru, and Kikuyu." },
      { q: "Is web design cheaper in Kiambu vs Nairobi?", a: "We offer 10% discount for Kiambu-registered businesses. Same quality, lower price, and you get face-to-face consultations at our studio." },
      { q: "Do you offer payment plans?", a: "Yes, we offer Lipa Pole Pole (installment) plans. Pay 50% to start, 30% at design approval, 20% on launch. No interest." },
    ],
    cta: "Start Your Kiambu Website",
  },
  "branding-kenya": {
    h1: "Branding Agency in Kenya | Logo, Identity & Packaging",
    metaTitle: "Branding Agency Kenya | Logo Design & Brand Identity",
    metaDesc: "Creative Divine Concepts is a branding agency in Kenya. Logo design, brand identity, packaging, and visual systems for Kenyan businesses and diaspora founders.",
    city: "Kenya",
    coordinates: { lat: -1.0444, lng: 36.6667 },
    content: [
      { heading: "Branding Agency Serving All of Kenya", text: "Creative Divine Concepts provides professional branding services across Kenya. From logo design to complete brand identity systems, we help businesses stand out in the Kenyan market. We serve Nairobi, Kiambu, Mombasa, Kisumu, Nakuru, Eldoret, and diaspora clients worldwide." },
      { heading: "Our Branding Process", text: "1. Discovery: We learn about your business, audience, and competitors. 2. Concepts: We create 3 unique logo concepts. 3. Refinement: We refine your chosen concept with unlimited revisions. 4. Delivery: You receive all files (SVG, PNG, JPG, PDF) plus brand guidelines." },
      { heading: "Branding Packages", text: "Logo Only (KES 15,000): 3 concepts + final files. Logo + Identity (KES 35,000): Logo + colors + fonts + business card. Full Branding (KES 75,000): Logo + identity + guidelines + social media kit + stationery." },
      { heading: "Branding for Diaspora Founders", text: "Building a brand for your Kenya business while abroad? We handle everything remotely: brand strategy, logo design, business registration support, website, and social media setup. You see everything via video calls and digital proofs." },
    ],
    faqs: [
      { q: "How much does branding cost in Kenya?", a: "Logo design starts from KES 15,000. Full branding packages from KES 75,000. We also offer payment plans for startups." },
      { q: "Do you work with diaspora clients?", a: "Yes! We work with diaspora founders in UK, USA, Canada, Australia, and more. Everything is done remotely via video calls and digital proofs." },
      { q: "How long does branding take?", a: "Logo design takes 1-2 weeks. Full branding packages take 3-4 weeks. Rush delivery available." },
    ],
    cta: "Book a Branding Strategy Call",
  },
  "t-shirt-printing-nairobi": {
    h1: "Custom T-Shirt Printing in Nairobi | DTF & DTG",
    metaTitle: "T-Shirt Printing Nairobi | Custom DTF & DTG Printing Kenya",
    metaDesc: "Custom T-shirt printing in Nairobi. DTF and DTG printing, bulk orders, event T-shirts, corporate branding. From KES 1,000 per shirt. Delivery across Nairobi.",
    city: "Nairobi",
    coordinates: { lat: -1.2864, lng: 36.8172 },
    content: [
      { heading: "Custom T-Shirt Printing in Nairobi", text: "Creative Divine Concepts offers custom T-shirt printing in Nairobi using DTF (Direct-to-Film) and DTG (Direct-to-Garment) technology. Whether you need 1 custom T-shirt or 1,000 for an event, we deliver quality prints at competitive prices." },
      { heading: "What We Print On", text: "T-shirts, hoodies, polo shirts, tote bags, caps, uniforms, jerseys, aprons, and more. We supply blank garments or you can bring your own. We stock popular brands and colors in all sizes (S-XXL)." },
      { heading: "Nairobi T-Shirt Printing Pricing", text: "1 T-shirt (custom design): KES 1,000-1,500. 10 T-shirts: KES 800/piece. 50 T-shirts: KES 600/piece. 100+ T-shirts: KES 500/piece. Design service: KES 500-2,000 (or use our free online tools)." },
      { heading: "Event & Corporate T-Shirts", text: "We specialize in bulk T-shirt printing for events, corporate branding, school uniforms, church functions, sports teams, and political campaigns. Gang sheet building is free, and we offer significant discounts for orders above 50 pieces." },
    ],
    faqs: [
      { q: "How much does T-shirt printing cost in Nairobi?", a: "Custom T-shirts start from KES 1,000 (design + print). Bulk orders: 50+ pieces at KES 600/piece, 100+ at KES 500/piece. Price depends on design complexity and garment type." },
      { q: "How long does T-shirt printing take?", a: "1-10 pieces: same day if ordered before 12pm. 50+ pieces: 2-5 days. 500+ pieces: 1-2 weeks. Rush orders available with surcharge." },
      { q: "Do you deliver T-shirts in Nairobi?", a: "Yes! We deliver across Nairobi via Sendy, G4S, or our riders. Delivery costs KES 200-500. Free delivery for orders above KES 10,000." },
      { q: "Can I bring my own T-shirts?", a: "Yes, you can bring your own blank T-shirts. We charge only for the printing. However, we cannot guarantee print quality on garments we did not supply." },
    ],
    cta: "Order Custom T-Shirts in Nairobi",
  },
};

export function LocalSEOPage({ onNavigate, pageId }: LocalPageProps) {
  const page = LOCAL_PAGES[pageId];
  if (!page) return null;

  const waUrl = `https://wa.me/+254711669113?text=Hello!%20I%20found%20you%20online%20and%20I'm%20interested%20in%20your%20services%20for%20${page.city}.`;

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  // LocalBusiness schema
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Creative Divine Concepts",
    address: {
      "@type": "PostalAddress",
      addressLocality: page.city,
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: page.coordinates.lat,
      longitude: page.coordinates.lng,
    },
    telephone: "+254711669113",
    url: "https://creativedivineconcepts.com",
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />

      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">{page.city}</Badge>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
            {page.h1}
          </h1>
        </div>

        {/* Content sections */}
        <div className="space-y-6 mb-10">
          {page.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="nura-card p-6 mb-10 text-center">
          <h3 className="font-display text-xl font-bold mb-3 text-foreground">Ready to Get Started?</h3>
          <p className="text-sm text-muted-foreground mb-4">Contact us on WhatsApp for a free consultation and quote.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="cyber-btn-filled h-12 px-8 inline-flex">
              {page.cta}
            </a>
            <button onClick={() => onNavigate("contact")} className="cyber-btn h-12 px-8">
              Contact Form
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-border mb-10">
          <iframe
            src={`https://maps.google.com/maps?q=${page.coordinates.lat},${page.coordinates.lng}&z=12&output=embed`}
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title={`Creative Divine Concepts serving ${page.city}`}
          />
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {page.faqs.map((faq, i) => (
              <details key={i} className="nura-card p-4 group">
                <summary className="cursor-pointer font-semibold text-sm text-foreground flex items-center justify-between">
                  {faq.q}
                  <Icons.ChevronDown className="h-4 w-4 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => onNavigate("tools")} className="text-xs text-primary hover:underline">Free Design Tools</button>
          <button onClick={() => onNavigate("services")} className="text-xs text-primary hover:underline">All Services</button>
          <button onClick={() => onNavigate("pricing")} className="text-xs text-primary hover:underline">Pricing</button>
          <button onClick={() => onNavigate("blog")} className="text-xs text-primary hover:underline">Blog</button>
        </div>
      </div>
    </div>
  );
}
