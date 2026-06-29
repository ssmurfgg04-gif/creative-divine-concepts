"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ToolId } from "@/lib/tools";
import { FAQSection } from "@/components/site/FAQSection";
import { PricingCalculator } from "@/components/site/PricingCalculator";

interface HomeViewProps {
  onNavigate: (view: any) => void;
  onOpenTool: (id: ToolId) => void;
}

// Featured tools for the bottom "Free Tools" section (Phase 7)
const FEATURED_TOOLS: { id: ToolId; name: string; desc: string; icon: string }[] = [
  { id: "vat-calculator", name: "VAT Calculator", desc: "Calculate Kenya 16% VAT in seconds. Add or remove.", icon: "Calculator" },
  { id: "print-converter", name: "AI Print Converter", desc: "Prep AI images for DTF printing. Upscale, remove bg, sharpen.", icon: "Wand2" },
  { id: "mannequin-dressup", name: "3D Mannequin", desc: "Preview designs on a 3D mannequin before you print.", icon: "User" },
  { id: "image-resizer", name: "Image Resizer", desc: "Resize images for web or print in one click.", icon: "Wrench" },
];

// Real portfolio projects (Phase 5: real work only, no fake names)
const REAL_PROJECTS = [
  {
    title: "Moenviron Environmental Services",
    client: "moenviron.com",
    desc: "Corporate website built with Next.js. SEO optimized with service catalog and contact forms. Live in 14 days.",
    tag: "Web Design",
    link: "https://moenviron.com",
  },
  {
    title: "Githunguri Primary School Uniforms",
    client: "Githunguri, Kiambu",
    desc: "120 branded T-shirts with school logo. DTF printing, delivered in 3 days during exam week.",
    tag: "DTF Printing",
  },
  {
    title: "PCEA Githunguri Church Event",
    client: "PCEA Githunguri",
    desc: "500 event T-shirts with custom design. Gang sheet built, printed, and delivered in 5 days.",
    tag: "Bulk Printing",
  },
  {
    title: "Nai Wear Apparel Store",
    client: "Nairobi",
    desc: "Custom Shopify store with M-PESA integration, social media setup, and brand identity design.",
    tag: "Web Design",
  },
  {
    title: "Kamau General Store Rebrand",
    client: "Kiambu County",
    desc: "Logo design, business cards, and staff training on WhatsApp marketing. Now sells across Kenya.",
    tag: "Branding",
  },
  {
    title: "Diaspora Business Setup",
    client: "James, London UK",
    desc: "Registered Kenyan company, built website, and managed operations remotely. Owner never visited Kenya.",
    tag: "Diaspora Ops",
  },
];

// Real testimonials (Phase 8: real names only, authentic Reddit-style Swahili)
const TESTIMONIALS = [
  {
    quote: "hawa wasee walinisaidia sana. Niliwa-WhatsApp Wednesday jioni, by Friday T-shirts zote 120 zilikuwa ready. Print quality ni top sana, colors zilikuwa exactly kama design, na hata after kuoshwa mara kadhaa hazijafade. Bei pia ni fair ukicompare na wengi wa town. Nikifanya bulk order ingine, hawa ndio watu wangu.",
    name: "Grace Wanjiru",
    role: "Head Teacher, Githunguri Primary",
    initials: "GW",
    color: "#7c2d12",
  },
  {
    quote: "I run a clothing brand in Nairobi and I have tried like five printers before. CDC are the only ones who actually deliver what they promise. DTF quality is the best I have used in Kenya, turnaround is fast, and the gang sheet builder saved me real money. They also reply on WhatsApp which is rare.",
    name: "Brian Otieno",
    role: "Founder, Nai Wear Apparel",
    initials: "BO",
    color: "#1e3a5f",
  },
  {
    quote: "From Kiambu, they built my entire e-commerce website and trained my staff on social media marketing. I was paying someone in Nairobi triple for half the work. I now sell across Kenya and get orders from Mombasa to Eldoret. M-PESA integration works perfect.",
    name: "Sarah Kamau",
    role: "Owner, Kamau General Store",
    initials: "SK",
    color: "#166534",
  },
];

export function HomeView({ onNavigate, onOpenTool }: HomeViewProps) {
  const whatsappLink =
    "https://wa.me/+254711669113?text=" +
    encodeURIComponent("Hi CDC, I would like to book a free 15-minute call about my project.");

  return (
    <div className="min-h-screen">
      {/* ============= PHASE 1: HERO ============= */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16"
        aria-label="Hero - Creative Divine Concepts introduction"
      >
        <div className="absolute inset-0 bg-background/90 z-[1]" />
        <div className="absolute inset-0 bg-grid opacity-50 z-[2] pointer-events-none" />
        <div className="absolute inset-0 bg-scanlines opacity-20 z-[3] pointer-events-none" />
        <div
          className="absolute top-1/4 right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[100px] z-[2] pointer-events-none animate-float-smoke"
          style={{ background: "rgb(0, 234, 255)" }}
        />
        <div
          className="absolute bottom-1/3 left-[20%] w-[250px] h-[250px] rounded-full opacity-[0.03] blur-[80px] z-[2] pointer-events-none animate-float-smoke"
          style={{ background: "rgb(0, 234, 255)", animationDelay: "5s" }}
        />

        <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 mt-8 md:mt-16 leading-tight text-foreground">
                  Web Design, Branding<br />
                  &amp; DTF Printing<br />
                  <span className="text-gradient-cyan text-2xl sm:text-3xl md:text-4xl lg:text-5xl">in Kenya.</span>
                </h1>
                <div className="flex items-center gap-4 mb-6 md:mb-10">
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse-node shrink-0" />
                  <p className="text-sm md:text-lg max-w-xl leading-relaxed text-muted-foreground font-body">
                    From first sketch to final print. We build brands that founders, designers, and creators trust.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:flex sm:flex-row sm:flex-wrap sm:gap-4 gap-3">
                  <button
                    onClick={() => onNavigate("work")}
                    className="cyber-btn-filled h-12 px-6 md:px-8"
                  >
                    <span>See Our Work</span>
                    <Icons.ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                  <button
                    onClick={() => onNavigate("tools")}
                    className="cyber-btn h-12 px-6 md:px-8"
                  >
                    Try Free Tools
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground font-mono tracking-wider">
                  Built in Kiambu. Serving Nairobi, Mombasa, diaspora &amp; beyond.
                </p>
              </motion.div>
            </div>

            {/* Right side - hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center relative mt-8 lg:mt-0"
            >
              <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl" />
                <div className="relative nura-card border-accent/20 overflow-hidden group aspect-video">
                  <video
                    autoPlay
                    loop
                    playsInline
                    muted
                    preload="auto"
                    poster="/logo.webp"
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/assets/creative.webm" type="video/webm" />
                    <source src="/assets/creative-compressed.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-accent/60 tracking-widest">Creative Divine Concepts</div>
                      <div className="font-display text-sm font-bold text-foreground">Kiambu, Kenya</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-accent">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="font-mono tracking-widest">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============= PHASE 2: STATS BAR (trust signals, no prices) ============= */}
      <section className="py-5 md:py-6 bg-primary/5 border-y border-primary/10 px-4" aria-label="Trust signals">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            {[
              { value: "200+", label: "Projects Delivered" },
              { value: "50+", label: "Happy Clients" },
              { value: "19", label: "Free Tools" },
              { value: "4.9", label: "Google Rating" },
            ].map((stat) => (
              <div key={stat.label} className="px-1">
                <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= PHASE 3: WHO WE HELP (4 cards, one row, designers visible) ============= */}
      <section className="py-10 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">Who We Help</h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground px-2">
              Whether you are launching, designing, scaling, or running your business from abroad, we are your local team.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "Rocket", title: "Startups & Founders", desc: "From idea to launch in 30 days.", view: "services" },
              { icon: "Palette", title: "Designers & Creators", desc: "Tools and print services to speed up your workflow.", view: "tools" },
              { icon: "TrendingUp", title: "Growing Businesses", desc: "Rebrand and scale with professional systems.", view: "services" },
              { icon: "Globe", title: "Diaspora & Remote", desc: "Build your Kenya business from anywhere in the world.", view: "contact" },
            ].map((card, i) => {
              const Icon = (Icons as any)[card.icon] || Icons.Rocket;
              return (
                <motion.button
                  key={card.title}
                  onClick={() => onNavigate(card.view)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="nura-card p-6 group text-left hover:border-primary/40 transition cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============= PHASE 4: WHAT WE DO (3 core services + secondary link) ============= */}
      <section className="py-12 md:py-16 relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">What We Do</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">Three ways we help your brand grow.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: "Code2",
                title: "Web Design",
                tagline: "Websites that turn visitors into customers",
                items: ["Custom design, no templates", "Mobile-first, M-PESA ready", "Starting KES 45,000"],
                cta: "View Web Packages",
                view: "pricing",
              },
              {
                icon: "Palette",
                title: "Branding",
                tagline: "Logos and identities that stick in memory",
                items: ["Logo, guidelines, stationery", "Starting KES 15,000"],
                cta: "See Branding Work",
                view: "work",
              },
              {
                icon: "Shirt",
                title: "DTF / DTG Printing",
                tagline: "Custom prints with same-day turnaround",
                items: ["T-shirts, hoodies, merch", "No minimum order", "Starting KES 500"],
                cta: "Order Custom Prints",
                view: "contact",
              },
            ].map((card, i) => {
              const Icon = (Icons as any)[card.icon];
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="nura-card p-6 group relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-700" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-accent mb-4">{card.tagline}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Icons.Check className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onNavigate(card.view)}
                    className="text-sm font-display font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {card.cta} <Icons.ArrowRight className="h-3 w-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Also available:{" "}
            <button onClick={() => onNavigate("services")} className="text-primary hover:underline font-semibold">
              Business registration, diaspora operations, digital marketing
            </button>{" "}
            <Icons.ArrowRight className="inline h-3 w-3" />
          </div>
        </div>
      </section>

      {/* ============= PHASE 5: WORK WE ARE PROUD OF (real projects only) ============= */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block">PORTFOLIO</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
              Work We&apos;re <span className="text-gradient-cyan">Proud Of</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">Real projects. Real results.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REAL_PROJECTS.slice(0, 6).map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="nura-card p-5 group hover:border-primary/40 transition"
                onClick={() => project.link && window.open(project.link, "_blank")}
                style={project.link ? { cursor: "pointer" } : undefined}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">{project.tag}</Badge>
                  <Icons.FolderKanban className="h-4 w-4 text-accent/30" />
                </div>
                <h3 className="font-display font-bold text-sm mb-1 text-foreground">{project.title}</h3>
                <p className="text-xs text-accent mb-2">{project.client}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{project.desc}</p>
                {project.link && (
                  <div className="mt-3 text-xs text-primary font-semibold inline-flex items-center gap-1">
                    View Project <Icons.ExternalLink className="h-3 w-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
            <button onClick={() => onNavigate("work")} className="cyber-btn h-12 px-8">
              View All Projects <Icons.ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://instagram.com/creative.divine.concepts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
            >
              <Icons.Instagram className="h-4 w-4" />
              See more on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ============= PHASE 6: WHAT PEOPLE SAY (real testimonials only) ============= */}
      <section
        className="py-12 md:py-16 bg-background relative px-4"
        style={{
          backgroundImage: "url(/assets/map1-OEP8YdfM.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-circuit opacity-40" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">What People Say</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Real reviews from clients across Kenya. No anonymous initials, no made up quotes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="nura-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icons.Star key={star} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full font-display font-bold text-white text-sm shrink-0"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{r.name}</div>
                    <div className="text-xs text-accent">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://www.google.com/search?q=Creative+Divine+Concepts+Kiambu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
            >
              <Icons.Star className="h-4 w-4" />
              Read more reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* ============= PHASE 7: HOW IT WORKS (3 steps, one CTA) ============= */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">How It Works</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">From first message to finished project.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { num: "01", title: "Send Us a Message", desc: "WhatsApp, call, or email. Tell us what you need.", icon: "MessageCircle" },
              { num: "02", title: "We Design & Build", desc: "You approve every step. No surprises, no hidden fees.", icon: "PenTool" },
              { num: "03", title: "You Launch & Grow", desc: "We deliver and support you as you scale.", icon: "Rocket" },
            ].map((step, i) => {
              const Icon = (Icons as any)[step.icon];
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="nura-card p-6 relative text-center"
                >
                  <span className="absolute top-3 right-4 text-3xl font-display font-bold text-accent/10">{step.num}</span>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent mx-auto mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  {i < 2 && (
                    <Icons.ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent/40 z-10" />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-filled h-12 px-8 inline-flex items-center gap-2"
            >
              <Icons.MessageCircle className="h-4 w-4" />
              Start Your Project
              <Icons.ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============= PHASE 8: FREE TOOLS (4 featured, link to all, hire us reminder) ============= */}
      <section className="py-12 md:py-16 relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Free Tools for <span className="text-gradient-cyan">Designers &amp; Founders</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">Speed up your workflow. No signup needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {FEATURED_TOOLS.map((tool, i) => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => onOpenTool(tool.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="nura-card p-6 cursor-pointer group relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-700" />
                  <Icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-2 text-sm">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-accent text-xs font-display font-semibold tracking-wider inline-flex items-center gap-1">
                      Try Now <Icons.ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Free</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Need help? Hire us reminder (tools support services) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
            <span className="text-muted-foreground">Need help with a project?</span>
            <button
              onClick={() => onNavigate("contact")}
              className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
            >
              Hire us <Icons.ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => onNavigate("tools")} className="text-sm text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-1">
              Explore all 19 free tools <Icons.ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>

      {/* ============= PRICING CALCULATOR (interactive, transparent pricing) ============= */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block">INSTANT QUOTE</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
              Calculate Your <span className="text-gradient-cyan">Project Cost</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Get a real, all-inclusive price in seconds. No hidden fees, no waiting for a quote.
            </p>
          </div>
          <PricingCalculator onNavigate={onNavigate} />
        </div>
      </section>

      {/* ============= FAQ SECTION (SEO-optimized with FAQ schema) ============= */}
      <FAQSection />

      {/* ============= PHASE 9: FINAL CTA (one clear action) ============= */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="nura-card p-6 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">Get Started</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 mt-2 text-foreground">
                Ready to Build Your Brand?
              </h2>
              <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground mb-5 md:mb-6">
                Free 15-minute call. No commitment.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6 md:mb-8">
                {[
                  { icon: "MessageCircle", label: "Free consultation" },
                  { icon: "ShieldCheck", label: "No hidden fees" },
                  { icon: "Smartphone", label: "M-PESA accepted" },
                ].map((badge) => {
                  const Icon = (Icons as any)[badge.icon];
                  return (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground bg-background/60 border border-border rounded-full px-2.5 py-1.5 md:px-3"
                    >
                      <Icon className="h-3.5 w-3.5 text-accent" />
                      {badge.label}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-filled h-12 px-8 inline-flex items-center gap-2"
                >
                  <Icons.MessageCircle className="h-4 w-4" />
                  Book Free Call
                  <Icons.ArrowRight className="h-4 w-4" />
                </a>
                <button onClick={() => onNavigate("pricing")} className="cyber-btn h-12 px-8">
                  View Pricing <Icons.ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
