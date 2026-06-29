"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { TOOLS, TOOL_CATEGORIES, ToolId } from "@/lib/tools";
import { FAQSection } from "@/components/site/FAQSection";

interface HomeViewProps {
  onNavigate: (view: any) => void;
  onOpenTool: (id: ToolId) => void;
}

// The 4 original tools shown in the main "Creative Tools Hub" section (matching original site)
const ORIGINAL_TOOLS: { id: ToolId; label: string; icon: string; subtitle: string; desc: string }[] = [
  { id: "vat-calculator", label: "TOOL-00", icon: "Calculator", subtitle: "Finance Engine", desc: "Calculate Kenya VAT instantly. Add or remove 16% VAT." },
  { id: "image-resizer", label: "TOOL-01", icon: "Wrench", subtitle: "Canvas API Engine", desc: "Resize images for any platform instantly." },
  { id: "color-palette", label: "TOOL-02", icon: "Sparkles", subtitle: "HSL Generator Module", desc: "Generate beautiful brand color palettes." },
  { id: "caption-gen", label: "TOOL-03", icon: "CheckCircle2", subtitle: "Template Parser v2", desc: "Create engaging social media captions." },
];

export function HomeView({ onNavigate, onOpenTool }: HomeViewProps) {
  // The 10 new GangFX-style tools (categorized)
  const newToolsByCategory = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: TOOLS.filter((t) => t.category === cat.id && !ORIGINAL_TOOLS.some((o) => o.id === t.id)),
  })).filter((c) => c.tools.length > 0);

  return (
    <div className="min-h-screen">
      {/* === HERO SECTION (matches original) === */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
        aria-label="Hero - Creative Divine Concepts introduction"
        aria-describedby="hero-description"
      >
        <div className="absolute inset-0 bg-background/90 z-[1]" />
        <div className="absolute inset-0 bg-grid opacity-50 z-[2] pointer-events-none" />
        {/* Scanlines overlay (matches original) */}
        <div className="absolute inset-0 bg-scanlines opacity-20 z-[3] pointer-events-none" />
        {/* Decorative glow orbs - reduced size so they don't dominate */}
        <div
          className="absolute top-1/4 right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[100px] z-[2] pointer-events-none animate-float-smoke"
          style={{ background: "rgb(0, 234, 255)" }}
        />
        <div
          className="absolute bottom-1/3 left-[20%] w-[250px] h-[250px] rounded-full opacity-[0.03] blur-[80px] z-[2] pointer-events-none animate-float-smoke"
          style={{ background: "rgb(0, 234, 255)", animationDelay: "5s" }}
        />

        <div className="container mx-auto px-4 relative z-10 pt-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-16 leading-tight text-foreground">
                  We Design, Build<br />
                  &amp; Scale Businesses<br />
                  <span className="text-gradient-cyan text-3xl md:text-4xl lg:text-5xl">From Anywhere.</span>
                </h1>
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse-node shrink-0" />
                  <p className="text-base md:text-lg max-w-xl leading-relaxed text-muted-foreground font-body">
                    We help startups, SMEs, and diaspora founders launch and manage successful businesses in Kenya through design, technology, sales, and operations.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
                  <button
                    onClick={() => onNavigate("contact")}
                    className="cyber-btn-filled h-12 px-8 col-span-2 sm:w-auto"
                  >
                    <span>Start Your Business</span>
                    <Icons.ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                  <button
                    onClick={() => onNavigate("tools")}
                    className="cyber-btn col-span-1 px-8 h-12"
                  >
                    View Tools
                  </button>
                  <button
                    onClick={() => onNavigate("tools")}
                    className="cyber-btn col-span-1 px-8 h-12"
                  >
                    How It Works
                  </button>
                </div>
              </motion.div>

              {/* Stats — STAT-01, STAT-02, STAT-03 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16 flex flex-wrap gap-6 border-t border-border/30 pt-8"
              >
                {[
                  { label: "STAT-01", value: "200+", desc: "Projects Delivered" },
                  { label: "STAT-02", value: "50+", desc: "Active Clients" },
                  { label: "STAT-03", value: "98%", desc: "Client Retention" },
                ].map((stat) => (
                  <div key={stat.label} className="nura-card px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-accent/30 tracking-widest">{stat.label}</span>
                      <Icons.Activity className="h-3 w-3 text-accent/30" />
                    </div>
                    <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right side - decorative visual */}
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
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/assets/creative-CPuRkwzY.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-accent/60 tracking-widest">LIVE_SYSTEM_FEED</div>
                      <div className="font-display text-sm font-bold text-foreground">Creative Divine Concepts</div>
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

      {/* === STARTING PRICES STRIP (Conversion booster — Reddit recommended) === */}
      <section className="py-6 bg-primary/5 border-y border-primary/10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { service: "DTF Printing", price: "KES 500", unit: "per print" },
              { service: "Custom T-Shirts", price: "KES 1,000", unit: "design + print" },
              { service: "Websites", price: "KES 45,000", unit: "starting from" },
              { service: "Branding", price: "KES 15,000", unit: "logo + identity" },
            ].map((item) => (
              <div key={item.service}>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.service}</div>
                <div className="font-display text-lg md:text-xl font-bold text-primary">{item.price}</div>
                <div className="text-[10px] text-muted-foreground">{item.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === WHO WE SERVE (MODULE-02) === */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Who We Serve</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-02</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Built for Ambitious Founders</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Whether you&apos;re on the ground or abroad, we become your local execution team.
            </p>
          </div>
        </div>

        {/* Scrolling marquee of "Who We Serve" cards with original section 2 images */}
        <div className="flex overflow-hidden group">
          <div className="flex space-x-4 animate-scroll-left group-hover:[animation-play-state:paused] w-max">
            {[
              { label: "NODE-01", title: "Small business", desc: "Streamline operations and build a brand that stands out in the market.", img: "/assets/section 2-01-CAuFk977.png" },
              { label: "NODE-02", title: "Start ups", desc: "Launch with the right foundation: registration, branding, digital, and sales.", img: "/assets/section 2-02-V2FBqkfR.png" },
              { label: "NODE-03", title: "Mid stage", desc: "Rebrand, digitize, and scale with professional systems and strategy.", img: "/assets/section 2-03-Dm-ZLFhS.png" },
              { label: "NODE-04", title: "Diaspora", desc: "Build and run your Kenya business remotely. We execute while you're abroad.", img: "/assets/section 2-04-BVvqs6is.png" },
              // Duplicate for seamless loop
              { label: "NODE-01", title: "Small business", desc: "Streamline operations and build a brand that stands out in the market.", img: "/assets/section 2-01-CAuFk977.png" },
              { label: "NODE-02", title: "Start ups", desc: "Launch with the right foundation: registration, branding, digital, and sales.", img: "/assets/section 2-02-V2FBqkfR.png" },
              { label: "NODE-03", title: "Mid stage", desc: "Rebrand, digitize, and scale with professional systems and strategy.", img: "/assets/section 2-03-Dm-ZLFhS.png" },
              { label: "NODE-04", title: "Diaspora", desc: "Build and run your Kenya business remotely. We execute while you're abroad.", img: "/assets/section 2-04-BVvqs6is.png" },
            ].map((n, i) => (
              <div
                key={i}
                className="w-[280px] md:w-[350px] aspect-square shrink-0 rounded-xl border border-accent/10 relative group/card overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={n.img}
                  alt={n.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[10px] font-mono text-accent/50 tracking-widest block mb-2">{n.label}</span>
                  <h3 className="font-display font-semibold text-foreground mb-1 text-sm tracking-wider">{n.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto max-w-6xl mt-6 text-center">
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1">
            REMOTE-OPS ENABLED
          </span>
        </div>
      </section>

      {/* === WHAT WE DO (MODULE-03) === */}
      <section className="py-12 md:py-16 relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">What We Do</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-03</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Your One-Stop Business Engine</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              From concept to scale: business architecture, branding, technology, marketing, and operations.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "PIL-01", title: "Business Architecture", subtitle: "Foundation Layer", items: ["Business setup & structure", "Market positioning", "Customer journey design", "Systems & workflows"], icon: "Building2", bg: "/assets/section 3-01-BKNVmHdt.png" },
              { label: "PIL-02", title: "Creative & Branding", subtitle: "Visual Systems", items: ["Graphic design", "Brand identity", "Printing & packaging", "Visual storytelling"], icon: "Palette", bg: "/assets/section 3-02-D_fVE2lh.png" },
              { label: "PIL-03", title: "Web & Technology", subtitle: "Digital Infrastructure", items: ["Website design & development", "eCommerce stores", "Custom dashboards", "AI-assisted tools"], icon: "Code2", bg: "/assets/section 3-03-CNZ6Cz5E.png" },
              { label: "PIL-04", title: "Sales & Marketing", subtitle: "Growth Engine", items: ["Digital marketing", "Funnels & lead generation", "Social media management", "Customer care systems"], icon: "TrendingUp", bg: "/assets/section 3-04-DbZzLVQp.png" },
              { label: "PIL-05", title: "Operations for Diaspora", subtitle: "Remote Ops Framework", items: ["Local business management", "Customer service handling", "Sales monitoring", "Reporting & tracking"], icon: "Globe", bg: "/assets/section 3-05-BMxOJZgu.png" },
              { label: "PIL-06", title: "DTF / DTG Printing", subtitle: "Print Production", items: ["Direct-to-film transfers", "Direct-to-garment printing", "Gang sheet building", "Mockup previews"], icon: "Shirt", bg: null },
            ].map((p, i) => {
              const Icon = (Icons as any)[p.icon] || Icons.Wrench;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="nura-card p-6 group relative overflow-hidden"
                  style={p.bg ? { backgroundImage: `url(${p.bg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  {p.bg && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-700" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-accent/30">{p.label}</span>
                    </div>
                    <h3 className="font-display font-bold text-foreground">{p.title}</h3>
                    <p className="text-xs font-mono text-accent/50 tracking-widest uppercase mb-3 mt-1">{p.subtitle}</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Icons.ChevronRight className="h-3 w-3 mt-0.5 text-accent shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => onNavigate("services")} className="cyber-btn h-12 px-8">
              View All Services <Icons.ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* === PROCESS (MODULE-04) === */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Process</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-04</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Five Steps to Growth</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Transparent reporting. Real-time communication. Local execution.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { label: "PHASE-01", num: "01", title: "Tell Us the Idea", desc: "Share your vision, market, and goals with our team.", icon: "/assets/icons 1 no bg-01-C51PbdB8.png" },
              { label: "PHASE-02", num: "02", title: "Business Architecture", desc: "We design the structure, positioning, and systems.", icon: "/assets/icons 1 no bg-02-DcKtXQKH.png" },
              { label: "PHASE-03", num: "03", title: "Build Brand & Systems", desc: "We create the brand, website, and operational tools.", icon: "/assets/icons 1 no bg-03-kYhvdX97.png" },
              { label: "PHASE-04", num: "04", title: "Launch & Manage", desc: "We launch, handle operations, and drive customers.", icon: "/assets/icons 1 no bg-04-owx734fi.png" },
              { label: "PHASE-05", num: "05", title: "Track Remotely", desc: "Real-time reporting. Transparent communication. Full control.", icon: "/assets/icons 1 no bg-05-CpNQZ_TO.png" },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="nura-card p-5 relative text-center"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-accent/30 absolute top-3 right-3">{p.label}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt={p.title} className="w-16 h-16 object-contain mx-auto mb-3" />
                <h3 className="font-display font-bold text-sm mt-2 mb-1 text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
                {i < 4 && (
                  <Icons.ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/40 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === BUILT FOR FOUNDERS (MODULE-05) — Business & Management Tools === */}
      <section className="py-12 md:py-16 relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Business Tools</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-05</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
              Built for <span className="text-gradient-cyan">Founders</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Free business and management tools for entrepreneurs in Kenya. Calculate VAT, manage sales, resize images, and generate captions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { id: "vat-calculator", label: "TOOL-00", icon: "Calculator", name: "VAT Calculator", subtitle: "Finance Engine", desc: "Calculate Kenya VAT instantly. Add or remove 16% VAT." },
              { id: "pos-system", label: "TOOL-01", icon: "ShoppingCart", name: "POS System", subtitle: "Sales Manager", desc: "Simple point-of-sale for any business. Track products and sales." },
              { id: "image-resizer", label: "TOOL-02", icon: "Wrench", name: "Image Resizer", subtitle: "Canvas API Engine", desc: "Resize images for any platform instantly." },
              { id: "caption-gen", label: "TOOL-03", icon: "CheckCircle2", name: "Caption Gen", subtitle: "Template Parser v2", desc: "Create engaging social media captions." },
            ].map((tool, i) => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => tool.id === "pos-system" ? onNavigate("tools") : onOpenTool(tool.id as any)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="nura-card p-6 cursor-pointer group relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-700" />
                  <span className="absolute top-3 right-3 text-[10px] font-mono text-accent/25 tracking-widest">{tool.label}</span>
                  <Icon className="h-8 w-8 text-accent mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-1 text-sm tracking-wider">{tool.name}</h3>
                  <span className="inline-block text-xs font-mono text-accent/50 tracking-widest uppercase mb-3">{tool.subtitle}</span>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-accent text-xs font-display font-semibold tracking-wider">
                    Try Now <Icons.ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* === CREATIVE & PRINT TOOLS (MODULE-05B) — Design + DTF/DTG Tools === */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Creative &amp; Print Tools</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-05B</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
              Built for <span className="text-gradient-cyan">Creatives</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              DTF/DTG printing tools, design effects, AI generation, and 3D mockups. All tools work 100% in your browser. No sign-up, no API keys.
            </p>
          </div>

          {/* Tool grid by category */}
          {newToolsByCategory.map((cat) => (
            <div key={cat.id} className="mb-10">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/30">
                  {cat.tools.length} TOOL{cat.tools.length !== 1 ? "S" : ""}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.tools.map((tool, i) => {
                  const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => onOpenTool(tool.id)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="nura-card p-5 cursor-pointer group relative overflow-hidden text-left"
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-700" />
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition">
                          <Icon className="h-5 w-5" />
                        </div>
                        {tool.badge && (
                          <span className="ml-auto text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                            {tool.badge === "ai" && <Icons.Sparkles className="inline mr-0.5 h-2.5 w-2.5" />}
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-foreground mb-1">{tool.name}</h4>
                      <p className="text-xs text-accent mb-2">{tool.tagline}</p>
                      <p className="text-xs text-muted-foreground/70 line-clamp-2">{tool.description}</p>
                      <div className="mt-3 flex items-center text-xs text-accent font-display font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition">
                        Open tool <Icons.ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === CREATIVE ACADEMY (NEW SECTION) === */}
      <section className="py-12 md:py-16 bg-background relative px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">LEARN • BUILD • GROW</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50 block mt-1">MODULE-05C</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
              Creative <span className="text-gradient-cyan">Academy</span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Learn full-stack development, graphic design, and digital marketing. Online teaching with on-site supervision in Kiambu.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[
              { icon: "Code2", title: "Full-Stack Development", desc: "Next.js, React, TypeScript, Prisma. 12 weeks. Taught by Jack Blessed.", color: "text-blue-500" },
              { icon: "Palette", title: "Graphic Design & Print", desc: "Photoshop, DTF/DTG prep, brand identity. 8 weeks. Print shop workflows.", color: "text-primary" },
              { icon: "TrendingUp", title: "Digital Marketing", desc: "Social media, lead gen, WhatsApp marketing. 6 weeks. Kenya-focused.", color: "text-green-500" },
            ].map((course, i) => {
              const Icon = (Icons as any)[course.icon];
              return (
                <div key={course.title} className="nura-card p-6 group cursor-pointer hover:border-primary/40 transition" onClick={() => onNavigate("academy")}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-background/60 mb-4 ${course.color} group-hover:scale-110 transition`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold mb-2 text-foreground">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <button onClick={() => onNavigate("academy")} className="cyber-btn-filled h-12 px-8">
              <span>Explore Academy</span> <Icons.ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* === TRUST & PROOF (MODULE-06) — with map background === */}
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
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Trust &amp; Proof</p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent/50 block mt-1">MODULE-06</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Built in Kenya. Serving the World.</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Trusted by founders and businesses across East Africa and the diaspora.
            </p>
          </div>

          {/* Stats instead of fake logos (safe, honest, still impressive) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
            {[
              { value: "200+", label: "Projects Completed" },
              { value: "50+", label: "Active Clients" },
              { value: "98%", label: "Client Retention" },
              { value: "14", label: "Free Tools" },
            ].map((stat) => (
              <div key={stat.label} className="nura-card px-4 py-6 text-center">
                <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials with photos */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "REV-01", quote: "They built our entire brand and digital presence while we were in London. Felt like having a team on the ground.", name: "James O.", role: "Diaspora Founder, UK", initials: "JO", color: "#1e3a5f" },
              { label: "REV-02", quote: "From business registration to a full website and marketing system, all delivered in 6 weeks.", name: "Amina W.", role: "CEO, Nairobi Startup", initials: "AW", color: "#7c2d12" },
              { label: "REV-03", quote: "The transparency and reporting made managing remotely feel effortless. Highly recommend.", name: "David K.", role: "Investor, USA", initials: "DK", color: "#166534" },
            ].map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="nura-card p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent/30">{r.label}</div>
                  {/* Star rating */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icons.Star key={star} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {/* Avatar with initials and background color (simulating photo) */}
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
        </div>
      </section>

      {/* === FAQ SECTION (SEO-optimized with FAQ schema) === */}
      <FAQSection />

      {/* === CTA === */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="nura-card p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">COMMAND: INITIATE</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 mt-2 text-foreground">
                Ready to Build a Business That Runs<br />Even When You&apos;re Abroad?
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-6">
                Join founders across Kenya and the diaspora who trust Creative Divine Concepts to bring their vision to life.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => onNavigate("contact")} className="cyber-btn-filled h-12 px-8">
                  Start a Project <Icons.ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onNavigate("contact")} className="cyber-btn h-12 px-8">
                  Strategy Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
