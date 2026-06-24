"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TOOLS, TOOL_CATEGORIES, ToolId } from "@/lib/tools";

interface HomeViewProps {
  onNavigate: (view: any) => void;
  onOpenTool: (id: ToolId) => void;
}

export function HomeView({ onNavigate, onOpenTool }: HomeViewProps) {
  return (
    <div className="min-h-screen">
      {/* === HERO SECTION === */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 px-6">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        {/* Decorative glow orbs (matches original) */}
        <div className="glow-orb bg-primary/20" style={{ width: 500, height: 500, top: "-10%", right: "-10%" }} />
        <div className="glow-orb bg-accent/15" style={{ width: 400, height: 400, bottom: "-5%", left: "-5%" }} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              We Design, Build<br />
              &amp; Scale Businesses<br />
              <span className="text-primary">From Anywhere.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              We help startups, SMEs, and diaspora founders launch and manage successful businesses in Kenya through design, technology, sales, and operations.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => onNavigate("contact")}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow text-base h-12 px-8"
              >
                Start Your Business
              </Button>
              <Button
                onClick={() => onNavigate("tools")}
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 border-primary/40 hover:bg-primary/10"
              >
                View Tools
              </Button>
            </div>
          </motion.div>

          {/* How It Works hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-muted-foreground">
              LIVE_SYSTEM_FEED
            </span>
          </motion.div>

          {/* Stats — STAT-01, STAT-02, STAT-03 (exact from original) */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { label: "STAT-01", value: "200+", desc: "Projects Delivered" },
              { label: "STAT-02", value: "50+", desc: "Active Clients" },
              { label: "STAT-03", value: "98%", desc: "Client Retention" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 text-center"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                <div className="font-display text-4xl font-bold text-primary mt-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === WHO WE SERVE === */}
      <section className="py-12 md:py-16 bg-background relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">MODULE-02</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 mt-2">Built for Ambitious Founders</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Whether you&apos;re on the ground or abroad, we become your local execution team.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "NODE-01", title: "Small business", desc: "Streamline operations and build a brand that stands out in the market." },
              { label: "NODE-02", title: "Start ups", desc: "Launch with the right foundation: registration, branding, digital, and sales." },
              { label: "NODE-03", title: "Mid stage", desc: "Rebrand, digitize, and scale with professional systems and strategy." },
              { label: "NODE-04", title: "Diaspora", desc: "Build and run your Kenya business remotely. We execute while you&apos;re abroad." },
            ].map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-card-hover transition"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">{n.label}</div>
                <h3 className="font-display text-lg font-bold mb-2">{n.title}</h3>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: n.desc }} />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1">
              REMOTE-OPS ENABLED
            </span>
          </div>
        </div>
      </section>

      {/* === WHAT WE DO === */}
      <section className="py-12 md:py-16 relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">MODULE-03</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 mt-2">Your One-Stop Business Engine</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              From concept to scale: business architecture, branding, technology, marketing, and operations.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "PIL-01", title: "Business Architecture", subtitle: "Foundation Layer", items: ["Business setup & structure", "Market positioning", "Customer journey design", "Systems & workflows"], icon: "Building2" },
              { label: "PIL-02", title: "Creative & Branding", subtitle: "Visual Systems", items: ["Graphic design", "Brand identity", "Printing & packaging", "Visual storytelling"], icon: "Palette" },
              { label: "PIL-03", title: "Web & Technology", subtitle: "Digital Infrastructure", items: ["Website design & development", "eCommerce stores", "Custom dashboards", "AI-assisted tools"], icon: "Code2" },
              { label: "PIL-04", title: "Sales & Marketing", subtitle: "Growth Engine", items: ["Digital marketing", "Funnels & lead generation", "Social media management", "Customer care systems"], icon: "TrendingUp" },
              { label: "PIL-05", title: "Operations for Diaspora", subtitle: "Remote Ops Framework", items: ["Local business management", "Customer service handling", "Sales monitoring", "Reporting & tracking"], icon: "Globe" },
              { label: "PIL-06", title: "DTF / DTG Printing", subtitle: "Print Production", items: ["Direct-to-film transfers", "Direct-to-garment printing", "Gang sheet building", "Mockup previews"], icon: "Shirt" },
            ].map((p, i) => {
              const Icon = (Icons as any)[p.icon] || Icons.Wrench;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-card-hover transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{p.label}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold">{p.title}</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">{p.subtitle}</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Icons.ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button onClick={() => onNavigate("services")} variant="outline" className="border-primary/40 hover:bg-primary/10">
              View All Services <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* === PROCESS === */}
      <section className="py-12 md:py-16 bg-background relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">MODULE-04</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 mt-2">Five Steps to Growth</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Transparent reporting. Real-time communication. Local execution.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { label: "PHASE-01", num: "01", title: "Tell Us the Idea", desc: "Share your vision, market, and goals with our team." },
              { label: "PHASE-02", num: "02", title: "Business Architecture", desc: "We design the structure, positioning, and systems." },
              { label: "PHASE-03", num: "03", title: "Build Brand & Systems", desc: "We create the brand, website, and operational tools." },
              { label: "PHASE-04", num: "04", title: "Launch & Manage", desc: "We launch, handle operations, and drive customers." },
              { label: "PHASE-05", num: "05", title: "Track Remotely", desc: "Real-time reporting. Transparent communication. Full control." },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 relative"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{p.label}</div>
                <div className="font-display text-3xl font-bold text-primary/30 mt-1">{p.num}</div>
                <h3 className="font-display font-bold text-sm mt-2 mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
                {i < 4 && (
                  <Icons.ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CREATIVE TOOLS HUB (the new section we added) === */}
      <section className="py-12 md:py-16 relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">MODULE-05</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 mt-2">Creative Tools Hub</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Built for Founders &amp; Creatives. Free, browser-based creative and business tools.
              Use free tools, upgrade for full business support.
            </p>
          </div>

          {/* Tool grid by category */}
          {TOOL_CATEGORIES.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="mb-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {tools.length} TOOL{tools.length !== 1 ? "S" : ""}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool, i) => {
                    const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                    return (
                      <motion.button
                        key={tool.id}
                        onClick={() => onOpenTool(tool.id)}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        whileHover={{ y: -3 }}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 text-left transition hover:border-primary/50 hover:bg-card/60 hover:shadow-card-hover"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                            <Icon className="h-5 w-5" />
                          </div>
                          {tool.badge && (
                            <Badge className="ml-auto bg-primary/10 text-primary border-primary/30 text-[10px] uppercase">
                              {tool.badge === "ai" && <Icons.Sparkles className="mr-1 h-3 w-3" />}
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-display font-bold mb-1">{tool.name}</h4>
                        <p className="text-xs text-primary mb-2">{tool.tagline}</p>
                        <p className="text-xs text-muted-foreground/70 line-clamp-2">{tool.description}</p>
                        <div className="mt-3 flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition">
                          Open tool <Icons.ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="mt-8 text-center">
            <Button onClick={() => onNavigate("tools")} variant="outline" className="border-primary/40 hover:bg-primary/10">
              Access All Tools <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* === TRUST & PROOF === */}
      <section className="py-12 md:py-16 bg-background relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">MODULE-06</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 mt-2">Built in Kenya. Serving the World.</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Trusted by founders and businesses across East Africa and the diaspora.
            </p>
          </div>

          {/* Trusted by logos (text logos) */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 opacity-50">
            {["Safaricom", "Jumia Kenya", "KCB Group", "KPMG East Africa", "Nairobi Garage"].map((logo) => (
              <span key={logo} className="font-display font-bold text-lg">{logo}</span>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "REV-01", quote: "They built our entire brand and digital presence while we were in London. Felt like having a team on the ground.", name: "James O.", role: "Diaspora Founder, UK" },
              { label: "REV-02", quote: "From business registration to a full website and marketing system, all delivered in 6 weeks.", name: "Amina W.", role: "CEO, Nairobi Startup" },
              { label: "REV-03", quote: "The transparency and reporting made managing remotely feel effortless. Highly recommend.", name: "David K.", role: "Investor, USA" },
            ].map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">{r.label}</div>
                <p className="text-sm italic text-muted-foreground mb-4">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-primary">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-12 md:py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-10 text-center relative overflow-hidden">
            <div className="glow-orb bg-primary/20" style={{ width: 300, height: 300, top: "-50%", right: "-10%" }} />
            <div className="relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">COMMAND: INITIATE</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 mt-2">
                Ready to Build a Business That Runs Even When You&apos;re Abroad?
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-6">
                Join founders across Kenya and the diaspora who trust Creative Divine Concepts to bring their vision to life.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => onNavigate("contact")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow">
                  Start a Project
                </Button>
                <Button onClick={() => onNavigate("contact")} size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                  Strategy Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
