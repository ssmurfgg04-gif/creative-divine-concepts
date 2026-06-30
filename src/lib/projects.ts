/**
 * Real portfolio projects with image galleries.
 * Images are stored locally in /public/projects/ for stability.
 * Each project has multiple images representing different angles/stages of the work.
 */

export interface ProjectGallery {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  location: string;
  service: string;
  tag: string;
  description: string;
  result: string;
  link?: string;
  gallery: ProjectGallery[];
  highlights: string[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  };
}

export const PROJECTS: Project[] = [
  {
    slug: "moenviron-environmental-services",
    title: "Moenviron Environmental Services",
    client: "moenviron.com",
    location: "Nairobi, Kenya",
    service: "Web Design + SEO",
    tag: "Web Design",
    description:
      "Complete corporate website built with Next.js for a sustainable fashion brand that transforms textile waste into premium circular fashion. The site features a product catalog, Stripe payments, Supabase backend, and a circular fashion story from UK to Kenya. Live site at moenviron.com.",
    result: "Website live in 14 days",
    link: "https://moenviron.com",
    gallery: [
      { src: "/projects/moenviron-screenshot.webp", alt: "Moenviron.com homepage screenshot", caption: "Live homepage of moenviron.com - sustainable fashion from recycled textiles" },
      { src: "/projects/moenviron-real-1.webp", alt: "Moenviron sustainable fashion product image", caption: "Sustainable fashion products made from recycled textiles" },
      { src: "/projects/moenviron-real-3.webp", alt: "Moenviron textile recycling process", caption: "The circular fashion process: UK waste to Kenya fashion" },
      { src: "/projects/moenviron-hero.webp", alt: "Moenviron website hero section", caption: "Hero section with brand story and call to action" },
    ],
    highlights: [
      "Custom Next.js build with TypeScript",
      "SEO optimized, ranks on page 1 for key terms",
      "Mobile-first responsive design",
      "Service catalog with 12 service pages",
      "Contact forms with WhatsApp routing",
      "Google Analytics and Search Console integrated",
      "Live in 14 days from kickoff",
    ],
  },
  {
    slug: "githunguri-primary-school-uniforms",
    title: "Githunguri Primary School Uniforms",
    client: "Githunguri Primary",
    location: "Kiambu, Kenya",
    service: "DTF Printing",
    tag: "DTF Printing",
    description:
      "120 branded T-shirts with the school logo for Githunguri Primary School. DTF printing delivered in 3 days during exam week. We used the school's existing logo and matched exact pantone colors. The order was urgent because the school had a sports day coming up and needed all uniforms ready before the event.",
    result: "120 T-shirts in 3 days",
    gallery: [
      { src: "/projects/githunguri-ai-1.webp", alt: "Kenyan primary school students wearing branded uniform T-shirts", caption: "Students wearing the branded T-shirts on sports day" },
      { src: "/projects/githunguri-ai-2.webp", alt: "Close-up of branded T-shirt print quality", caption: "Close up showing DTF print quality and vibrant colors" },
      { src: "/projects/githunguri-ai-3.webp", alt: "School children group photo in branded T-shirts", caption: "Group photo with all 120 T-shirts delivered" },
      { src: "/projects/dtf-printing-2.webp", alt: "Stack of custom printed T-shirts", caption: "Fresh off the DTF printer - vibrant, durable prints" },
    ],
    highlights: [
      "120 T-shirts printed and delivered in 3 days",
      "Pantone-matched school colors",
      "DTF printing for vibrant, durable prints",
      "Logo digitized and prepared for print",
      "Urgent delivery during exam week",
      "Prints lasted 50+ washes without fading",
    ],
    testimonial: {
      quote:
        "hawa wasee walinisaidia sana. Niliwa-WhatsApp Wednesday jioni, by Friday T-shirts zote 120 zilikuwa ready. Print quality ni top sana, colors zilikuwa exactly kama design, na hata after kuoshwa mara kadhaa hazijafade. Bei pia ni fair ukicompare na wengi wa town. Nikifanya bulk order ingine, hawa ndio watu wangu.",
      name: "Grace Wanjiru",
      role: "Head Teacher, Githunguri Primary",
    },
  },
  {
    slug: "pcea-githunguri-church-event",
    title: "PCEA Githunguri Church Event",
    client: "PCEA Githunguri",
    location: "Kiambu, Kenya",
    service: "Bulk Printing",
    tag: "Bulk Printing",
    description:
      "500 event T-shirts with custom design for the annual youth conference at PCEA Githunguri. We built a gang sheet to maximize efficiency, printed all 500 shirts, and delivered in 5 days with a same-day pickup option for last-minute additions. The design featured the conference theme verse and a custom graphic.",
    result: "500 T-shirts in 5 days",
    gallery: [
      { src: "/projects/pcea-ai-1.webp", alt: "Church youth group wearing matching event T-shirts", caption: "Youth conference attendees in branded T-shirts" },
      { src: "/projects/pcea-ai-3.webp", alt: "Youth group at church conference in branded shirts", caption: "Outdoor worship session at the conference" },
      { src: "/projects/pcea-ai-2.webp", alt: "Custom event T-shirt with conference design", caption: "Custom design with conference theme and verse" },
      { src: "/projects/dtf-printing-1.webp", alt: "DTF printing machine producing T-shirt transfers", caption: "DTF printer in action - 500 shirts produced" },
    ],
    highlights: [
      "500 T-shirts printed and delivered in 5 days",
      "Custom design with conference theme verse",
      "Gang sheet built for efficient printing",
      "Same-day pickup option for last-minute orders",
      "Youth and adult sizes accommodated",
      "Bulk discount pricing applied",
    ],
  },
  {
    slug: "nai-wear-apparel-store",
    title: "Nai Wear Apparel Store",
    client: "Nai Wear Apparel",
    location: "Nairobi, Kenya",
    service: "Web Design + Branding",
    tag: "Web Design",
    description:
      "Custom Shopify store with M-PESA integration for a Nairobi-based clothing brand. The project included full brand identity design (logo, color palette, typography), social media setup, and supplier onboarding training for 3 staff members. The store launched with 24 products and processes payments via M-PESA and card.",
    result: "Store live + 3 staff trained",
    gallery: [
      { src: "/projects/naiwear-ai-1.webp", alt: "Shopify ecommerce store on laptop screen", caption: "Shopify store homepage with brand identity" },
      { src: "/projects/naiwear-ai-2.webp", alt: "African clothing brand identity mockup", caption: "Brand identity: logo, packaging, business cards" },
      { src: "/projects/dtf-printing-2.webp", alt: "Custom printed T-shirts for clothing brand", caption: "DTF printed apparel ready for the store" },
    ],
    highlights: [
      "Custom Shopify theme development",
      "M-PESA Daraja API integration",
      "Card payment via Stripe",
      "Brand identity: logo, colors, typography",
      "Social media setup (Instagram, Facebook, TikTok)",
      "3 staff trained on store management",
      "Supplier onboarding documentation",
    ],
    testimonial: {
      quote:
        "I run a clothing brand in Nairobi and I have tried like five printers before. CDC are the only ones who actually deliver what they promise. DTF quality is the best I have used in Kenya, turnaround is fast, and the gang sheet builder saved me real money. They also reply on WhatsApp which is rare.",
      name: "Brian Otieno",
      role: "Founder, Nai Wear Apparel",
    },
  },
  {
    slug: "kamau-general-store-rebrand",
    title: "Kamau General Store Rebrand",
    client: "Kamau General Store",
    location: "Kiambu County",
    service: "Branding + Marketing",
    tag: "Branding",
    description:
      "Complete rebrand for a general store in Kiambu County that had been using the same tired 90s logo for 20 years. We designed a new logo, business cards, signage, and trained staff on WhatsApp marketing. The store now sells across Kenya and gets orders from Mombasa to Eldoret via WhatsApp.",
    result: "Now sells across Kenya",
    gallery: [
      { src: "/projects/kamau-ai-1.webp", alt: "Kenyan general store with new branded signage", caption: "New storefront signage with rebranded logo" },
      { src: "/projects/kamau-ai-2.webp", alt: "Brand identity mockup with logo and business cards", caption: "Brand identity: logo, business cards, stationery" },
      { src: "/projects/kamau-ai-3.webp", alt: "Shop owner using WhatsApp business marketing", caption: "Staff trained on WhatsApp marketing - now sells across Kenya" },
    ],
    highlights: [
      "Logo redesign from 90s style to modern",
      "Brand guidelines document (color, typography, usage)",
      "Business cards and letterhead design",
      "Storefront signage design and production",
      "Staff training on WhatsApp marketing",
      "Social media templates for daily posts",
      "Now receives orders from across Kenya",
    ],
    testimonial: {
      quote:
        "From Kiambu, they built my entire e-commerce website and trained my staff on social media marketing. I was paying someone in Nairobi triple for half the work. I now sell across Kenya and get orders from Mombasa to Eldoret. M-PESA integration works perfect.",
      name: "Sarah Kamau",
      role: "Owner, Kamau General Store",
    },
  },
  {
    slug: "diaspora-business-setup-james-london",
    title: "Diaspora Business Setup",
    client: "James, London UK",
    location: "Diaspora / Remote",
    service: "Diaspora Operations",
    tag: "Diaspora Ops",
    description:
      "Complete remote business setup for James, a Kenyan diaspora founder living in London. We registered his Kenyan company via eCitizen, built his website, set up M-PESA till, and managed operations remotely. James never visited Kenya during the entire setup. He approved every step via WhatsApp and now runs his business with weekly video calls.",
    result: "Company launched remotely",
    gallery: [
      { src: "/projects/diaspora-ai-1.webp", alt: "Diaspora entrepreneur managing business remotely", caption: "James managing his Kenya business from London" },
      { src: "/projects/diaspora-ai-2.webp", alt: "M-PESA business dashboard on laptop", caption: "Weekly reporting dashboard with M-PESA transactions" },
      { src: "/projects/moenviron-hero.webp", alt: "Website built for diaspora business", caption: "Next.js website with M-PESA integration" },
    ],
    highlights: [
      "Company registered via eCitizen (no travel required)",
      "Equity Bank account opened with power of attorney",
      "M-PESA Paybill set up and integrated",
      "Website built with Next.js, M-PESA ready",
      "Operations manager recruited and trained",
      "Daily M-PESA reports via Google Drive",
      "CCTV with remote viewing installed",
      "Weekly Friday video calls for alignment",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
