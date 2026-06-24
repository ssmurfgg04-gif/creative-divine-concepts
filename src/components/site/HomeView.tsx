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
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-accent/15 text-accent border-accent/30 hover:bg-accent/20">
              <Icons.Sparkles className="mr-1.5 h-3 w-3" />
              14 Free Browser-Based Tools
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Design, Build &amp; Scale
              <br />
              <span className="text-accent text-glow">From Anywhere.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              We help startups, SMEs, and diaspora founders launch and manage successful businesses in Kenya through design, technology, sales, and operations. Now with <span className="text-foreground font-semibold">14 free creative design tools</span> built for printers, designers, and non-designers alike.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => onNavigate("tools")}
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 box-glow text-base h-12 px-8"
              >
                <Icons.Wrench className="mr-2 h-5 w-5" />
                Explore Tools
              </Button>
              <Button
                onClick={() => onNavigate("contact")}
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 border-accent/40 hover:bg-accent/10"
              >
                Start a Project
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Projects Delivered", value: "200+" },
              { label: "Active Clients", value: "50+" },
              { label: "Client Retention", value: "98%" },
              { label: "Free Tools", value: "14" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6 text-center"
              >
                <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Hub Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/30">MODULE-05</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Creative Tools Hub
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Free, browser-based creative and business tools. Built for founders, designers, and T-shirt printers. No sign-up required.
            </p>
          </div>

          {/* Tool grid by category */}
          {TOOL_CATEGORIES.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="mb-10">
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
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
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        whileHover={{ y: -3 }}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 text-left transition hover:border-accent/50 hover:bg-card/60"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-white transition">
                            <Icon className="h-5 w-5" />
                          </div>
                          {tool.badge && (
                            <Badge className="ml-auto bg-accent/10 text-accent border-accent/30 text-[10px] uppercase">
                              {tool.badge === "ai" && <Icons.Sparkles className="mr-1 h-3 w-3" />}
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-display font-bold mb-1">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{tool.tagline}</p>
                        <p className="text-xs text-muted-foreground/70 line-clamp-2">{tool.description}</p>
                        <div className="mt-3 flex items-center text-xs text-accent font-semibold opacity-0 group-hover:opacity-100 transition">
                          Open tool <Icons.ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 px-6 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/30">MODULE-03</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your One-Stop Business Engine
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              From concept to scale: business architecture, branding, technology, marketing, and operations.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "Building2", title: "Business Architecture", desc: "Business setup, market positioning, customer journey design, systems & workflows." },
              { icon: "Palette", title: "Creative & Branding", desc: "Graphic design, brand identity, T-shirt printing & packaging, visual storytelling." },
              { icon: "Code2", title: "Web & Technology", desc: "Website design & development, eCommerce stores, custom dashboards, AI tools." },
              { icon: "TrendingUp", title: "Sales & Marketing", desc: "Digital marketing, funnels & lead generation, social media, customer care systems." },
              { icon: "Globe", title: "Diaspora Operations", desc: "Local business management, customer service handling, sales monitoring, reporting." },
              { icon: "Shirt", title: "DTF / DTG Printing", desc: "Direct-to-film & direct-to-garment printing, gang sheet building, mockup previews." },
            ].map((item) => {
              const Icon = (Icons as any)[item.icon] || Icons.Wrench;
              return (
                <div key={item.title} className="rounded-xl border border-border bg-background/40 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Build a Business That Runs Even When You&apos;re Abroad?
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-6">
              Join founders across Kenya and the diaspora who trust Creative Divine Concepts to bring their vision to life.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => onNavigate("contact")} size="lg" className="bg-accent text-white hover:bg-accent/90 box-glow">
                Start a Project
              </Button>
              <Button onClick={() => onNavigate("tools")} size="lg" variant="outline">
                Try Free Tools
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
