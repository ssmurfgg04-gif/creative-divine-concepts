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
      "Complete corporate website built with Next.js for an environmental services company in Nairobi. The project included full SEO optimization with service catalog, contact forms, and a blog. The site loads in under 1 second and ranks on page 1 for several environmental service keywords in Kenya.",
    result: "Website live in 14 days",
    link: "https://moenviron.com",
    gallery: [
      { src: "/projects/moenviron-0.webp", alt: "Moenviron homepage hero section", caption: "Homepage with hero section and service overview" },
      { src: "/projects/moenviron-1.webp", alt: "Website design mockup on laptop", caption: "Modern responsive design on desktop" },
      { src: "/projects/moenviron-2.webp", alt: "Website design mockup showcase", caption: "Service catalog and contact forms" },
      { src: "/projects/moenviron-3.webp", alt: "Next.js website on screen", caption: "Built with Next.js for fast loading and SEO" },
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
      { src: "/projects/githunguri-1.webp", alt: "Kenyan primary school students wearing branded uniform T-shirts", caption: "Students wearing the branded T-shirts on sports day" },
      { src: "/projects/githunguri-2.webp", alt: "School children in matching branded uniforms outdoor", caption: "Group photo with all 120 T-shirts delivered" },
      { src: "/projects/githunguri-3.webp", alt: "Students in branded school T-shirts group photo", caption: "Group shot showing the full uniform set" },
      { src: "/projects/githunguri-4.webp", alt: "Close up of branded T-shirt print quality", caption: "Close up of the print quality and color matching" },
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
      { src: "/projects/pcea-1.webp", alt: "Church youth group wearing matching event T-shirts", caption: "Youth conference attendees in branded T-shirts" },
      { src: "/projects/pcea-2.webp", alt: "Large group photo with event T-shirts Kenya", caption: "500 event shirts delivered for the conference" },
      { src: "/projects/pcea-3.webp", alt: "Youth group outdoor in branded event shirts", caption: "Outdoor group shot at the conference venue" },
      { src: "/projects/pcea-4.webp", alt: "Custom event T-shirt design close up", caption: "Custom design with conference theme and graphics" },
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
      { src: "/projects/naiwear-1.webp", alt: "Shopify ecommerce store homepage", caption: "Shopify store homepage with brand identity" },
      { src: "/projects/naiwear-2.webp", alt: "Product catalog page", caption: "Product catalog with 24 products at launch" },
      { src: "/projects/naiwear-3.webp", alt: "Clothing brand apparel mockup", caption: "Brand identity applied to product photography" },
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
      { src: "/projects/kamau-1.webp", alt: "Kenyan general shop store front with new signage", caption: "New storefront signage with rebranded logo" },
      { src: "/projects/kamau-2.webp", alt: "Small business shop front branding Kenya", caption: "Store front after rebrand with modern identity" },
      { src: "/projects/kamau-3.webp", alt: "Kenyan shop interior with branded materials", caption: "Shop interior with branded signage and materials" },
      { src: "/projects/kamau-4.webp", alt: "Local business store exterior branding Kiambu", caption: "Store exterior showing the new brand identity" },
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
      { src: "/projects/diaspora-1.webp", alt: "Remote business management dashboard", caption: "Weekly reporting dashboard accessible from anywhere" },
      { src: "/projects/diaspora-2.webp", alt: "Diaspora entrepreneur working remotely", caption: "James managing his Kenya business from London" },
      { src: "/projects/diaspora-3.webp", alt: "Video call with operations team", caption: "Weekly Friday video call with the local team" },
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
