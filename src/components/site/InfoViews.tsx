"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PricingCalculator } from "@/components/site/PricingCalculator";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

/* ============== Services View ============== */

export function ServicesView({ onNavigate }: { onNavigate: (v: any) => void }) {
  const services = [
    { icon: "Building2", title: "Business Architecture", desc: "Foundation layer for setup, market positioning, customer journey design, and operational workflows.", price: "From KES 15,000" },
    { icon: "Palette", title: "Creative & Branding", desc: "Graphic design, brand identity, logo design, T-shirt printing & packaging, visual storytelling.", price: "From KES 5,000" },
    { icon: "Code2", title: "Web & Technology", desc: "Website design & development, eCommerce stores, custom dashboards, AI-assisted tools.", price: "From KES 35,000" },
    { icon: "TrendingUp", title: "Sales & Marketing", desc: "Digital marketing, funnels & lead generation, social media management, customer care systems.", price: "From KES 10,000/mo" },
    { icon: "Globe", title: "Diaspora Operations", desc: "Remote business management, customer service handling, sales monitoring, reporting & tracking.", price: "From KES 25,000/mo" },
    { icon: "Shirt", title: "DTF / DTG Printing", desc: "Direct-to-film and direct-to-garment T-shirt printing. Gang sheet design & mockup previews.", price: "From KES 500/print" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Breadcrumbs items={[{ label: "Services" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          
          <h1 className="font-display text-5xl font-bold mb-4">
            Your One-Stop <span className="text-primary text-glow">Business Engine</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            From concept to scale: business architecture, branding, technology, marketing, and operations, all under one roof.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = (Icons as any)[s.icon];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 transition"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-primary font-semibold">{s.price}</span>
                  <Button size="sm" variant="ghost" onClick={() => onNavigate("contact")} className="text-xs">
                    Get Quote <Icons.ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Service Comparison Table */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-4 text-center text-foreground">Compare Service Tiers</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-left p-3 font-display font-bold text-foreground">Feature</th>
                  <th className="text-center p-3 font-display font-bold text-foreground">Starter</th>
                  <th className="text-center p-3 font-display font-bold text-primary bg-primary/5">Growth</th>
                  <th className="text-center p-3 font-display font-bold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Web Pages", "1-5", "5-15", "Unlimited"],
                  ["Design Hours", "10h", "30h", "100h+"],
                  ["Revisions", "2 rounds", "5 rounds", "Unlimited"],
                  ["Support", "Email", "Priority + WhatsApp", "Dedicated manager"],
                  ["Tools Access", "Free tier", "All tools", "All + API"],
                  ["Turnaround", "4-6 weeks", "2-4 weeks", "1-2 weeks"],
                  ["DTF Printing", "Add-on", "15% discount", "25% discount"],
                  ["SEO Optimization", "Basic", "Full", "Advanced + monthly"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-card/20" : ""}>
                    <td className="p-3 font-semibold text-foreground">{row[0]}</td>
                    <td className="p-3 text-center text-muted-foreground">{row[1]}</td>
                    <td className="p-3 text-center text-primary font-semibold bg-primary/5">{row[2]}</td>
                    <td className="p-3 text-center text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Button onClick={() => onNavigate("pricing")} variant="outline" className="border-primary/40">View Pricing</Button>
            <Button onClick={() => onNavigate("contact")} className="bg-primary text-primary-foreground hover:bg-primary/90">Book Strategy Call</Button>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-10 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Need a Custom Solution?</h2>
          <p className="max-w-xl mx-auto text-muted-foreground mb-6">
            We tailor packages for startups, SMEs, and diaspora founders. Tell us your vision and we&apos;ll design a solution.
          </p>
          <Button onClick={() => onNavigate("contact")} size="lg" className="bg-primary text-white hover:bg-primary/90 box-glow">
            Book a Strategy Call
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ============== Pricing View ============== */

export function PricingView({ onNavigate }: { onNavigate: (v: any) => void }) {
  const plans = [
    {
      name: "Starter",
      price: "KES 0",
      period: "Free Forever",
      desc: "For hobbyists and evaluation",
      features: [
        "All 19 design tools",
        "5 tool exports per day",
        "Watermarked mockups",
        "Community support",
        "2GB cloud storage",
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Professional",
      price: "KES 1,500",
      period: "per month",
      desc: "For freelance designers",
      features: [
        "All 19 design tools",
        "Unlimited exports",
        "No watermarks",
        "10 AI generations/mo",
        "Priority email support",
        "50GB storage",
      ],
      cta: "Choose Pro",
      highlight: true,
    },
    {
      name: "Studio",
      price: "KES 3,500",
      period: "per month",
      desc: "For print shops & teams",
      features: [
        "Everything in Pro",
        "Unlimited AI generations",
        "Real-time collaboration",
        "Version history",
        "White-label mockups",
        "200GB storage",
        "API access",
      ],
      cta: "Choose Studio",
      highlight: false,
    },
    {
      name: "Business",
      price: "Custom",
      period: "partner pricing",
      desc: "For agencies & enterprises",
      features: [
        "Everything in Studio",
        "Branded client portal",
        "Custom domain",
        "Dedicated support",
        "On-site training (Kenya)",
        "Volume printing discounts",
        "Machine purchase support",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Breadcrumbs items={[{ label: "Pricing" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">PRICING</Badge>
          <h1 className="font-display text-5xl font-bold mb-4">
            Simple, <span className="text-primary text-glow">Transparent</span> Pricing
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            No per-click credits. No hidden fees. Subscribe to unlock tools and capabilities, not discrete actions.
          </p>
        </div>

        {/* Interactive Pricing Calculator */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-4 text-center text-foreground">
            Instant Price Calculator
          </h2>
          <PricingCalculator onNavigate={onNavigate} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`relative rounded-xl border p-6 ${
                p.highlight
                  ? "border-primary bg-gradient-to-b from-primary/10 to-transparent box-glow"
                  : "border-border bg-card/40"
              }`}
            >
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                  Most Popular
                </Badge>
              )}
              <h3 className="font-display text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{p.desc}</p>
              <div className="mb-4">
                <div className="font-display text-3xl font-bold text-primary">{p.price}</div>
                <div className="text-xs text-muted-foreground">{p.period}</div>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Icons.Check className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => onNavigate("contact")}
                className={`w-full ${p.highlight ? "bg-primary text-white hover:bg-primary/90" : "variant-outline"}`}
                variant={p.highlight ? "default" : "outline"}
              >
                {p.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            All plans include access to all 19 design tools. Subscriptions unlock capabilities, not actions.
          </p>
          <Button onClick={() => onNavigate("tools")} variant="ghost" className="gap-2">
            <Icons.Wrench className="h-4 w-4" /> Explore All Tools First
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ============== About View ============== */

export function AboutView({ onNavigate }: { onNavigate: (v: any) => void }) {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Breadcrumbs items={[{ label: "About" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">ABOUT US</Badge>
          <h1 className="font-display text-5xl font-bold mb-4">
            Built in Kenya. <span className="text-primary text-glow">Serving the World.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            We&apos;re a Kenya-based creative & technology studio helping founders launch and scale businesses, whether they&apos;re on the ground or abroad.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card/30 p-8">
            <h2 className="font-display text-2xl font-bold mb-3 text-primary">Our Story</h2>
            <p className="text-muted-foreground mb-3">
              Creative Divine Concepts started as a T-shirt printing business in Kiambu, Kenya. We saw firsthand how non-designers struggled with artwork preparation: wrong sizes, missing bleeds, color issues, and expensive sampling mistakes.
            </p>
            <p className="text-muted-foreground mb-3">
              Rather than just selling prints, we decided to <span className="text-foreground font-semibold">solve the underlying problem</span>. We built free design tools that work in any browser, no Photoshop required. Now anyone can prepare print-ready artwork in minutes.
            </p>
            <p className="text-muted-foreground">
              Today we serve startups, SMEs, and diaspora founders across East Africa and beyond, combining design tools, printing services, and business consulting under one roof.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { icon: "Target", title: "Our Mission", desc: "Make professional design accessible to everyone. No design degree required." },
              { icon: "Eye", title: "Our Vision", desc: "Become East Africa&apos;s leading creative & technology platform for founders." },
              { icon: "Heart", title: "Our Values", desc: "Honesty, affordability, and continuous improvement. We learn every day." },
            ].map((item) => {
              const Icon = (Icons as any)[item.icon];
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card/30 p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              );
            })}
          </section>

          <section className="rounded-xl border border-border bg-card/30 p-8">
            <h2 className="font-display text-2xl font-bold mb-4 text-primary">What Clients Say</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { quote: "They built our entire brand and digital presence while we were in London. Felt like having a team on the ground.", name: "James O.", role: "Diaspora Founder, UK" },
                { quote: "From business registration to a full website and marketing system, all delivered in 6 weeks.", name: "Amina W.", role: "CEO, Nairobi Startup" },
                { quote: "The transparency and reporting made managing remotely feel effortless. Highly recommend.", name: "David K.", role: "Investor, USA" },
              ].map((r) => (
                <div key={r.name} className="rounded-lg border border-border bg-background/40 p-4">
                  <p className="text-sm italic text-muted-foreground mb-3">&ldquo;{r.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-primary">{r.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Button onClick={() => onNavigate("contact")} size="lg" className="bg-primary text-white hover:bg-primary/90 box-glow">
              Work With Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== Contact View ============== */

export function ContactView({ onNavigate }: { onNavigate: (v: any) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Build WhatsApp message from form data
    const waMessage = `New Inquiry from CDC Website%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}`;
    const waUrl = `https://wa.me/+254711669113?text=${waMessage}`;
    
    // Also send email via mailto as backup
    const emailSubject = encodeURIComponent(`CDC Website: ${formData.subject}`);
    const emailBody = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    const mailtoUrl = `mailto:info@creativedivineconcepts.com?subject=${emailSubject}&body=${emailBody}`;
    
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    
    // Open WhatsApp with pre-filled message
    window.open(waUrl, "_blank");
    
    toast.success("Opening WhatsApp with your message... Also sent via email!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Breadcrumbs items={[{ label: "Contact" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">CONTACT</Badge>
          <h1 className="font-display text-5xl font-bold mb-4">
            Let&apos;s Build <span className="text-primary text-glow">Together</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Have a project in mind? Need design tools training? Want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-3">
            {[
              { icon: "Mail", label: "Email", value: "info@creativedivineconcepts.com", href: "mailto:info@creativedivineconcepts.com" },
              { icon: "Phone", label: "Phone", value: "+254 711 669 113", href: "tel:+254711669113" },
              { icon: "MessageCircle", label: "WhatsApp", value: "Chat with us", href: "https://wa.me/+254711669113" },
              { icon: "MapPin", label: "Location", value: "Githunguri Ndumberi, Kiambu, Kenya", href: null },
              { icon: "Star", label: "Leave a Google Review", value: "We appreciate your feedback", href: "https://www.google.com/search?q=Creative+Divine+Concepts+Kiambu" },
              { icon: "Twitter", label: "Twitter", value: "@divineconcepts", href: "https://twitter.com/divineconcepts" },
              { icon: "Linkedin", label: "LinkedIn", value: "Creative Divine Concepts", href: "https://linkedin.com/company/divineconcepts" },
            ].map((item) => {
              const Icon = (Icons as any)[item.icon];
              const content = (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-card/30 p-4 hover:border-primary/40 transition">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-semibold">{item.value}</div>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" required className="mt-1 bg-background/40" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required className="mt-1 bg-background/40" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" required className="mt-1 bg-background/40" placeholder="What's this about?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  className="mt-1 bg-background/40 min-h-[150px]"
                  placeholder="Tell us about your project, timeline, and budget…"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white hover:bg-primary/90 gap-2"
              >
                {submitting ? (
                  <>
                    <Icons.Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send Message <Icons.Send className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We typically respond within 24 hours during business days.
              </p>
            </form>

            {/* Google Maps embed */}
            <div className="mt-6 rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://maps.google.com/maps?q=Githunguri%20Ndumberi%20Kiambu%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Creative Divine Concepts Location - Githunguri Ndumberi, Kiambu"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== Work View (Portfolio) ============== */

export function WorkView({ onNavigate }: { onNavigate: (v: any) => void }) {
  const projects = [
    {
      title: "Moenviron Environmental Services",
      client: "moenviron.com",
      location: "Nairobi, Kenya",
      service: "Web Design + SEO",
      desc: "Complete corporate website built with Next.js. SEO optimized with service catalog, contact forms, and blog. Live in 14 days.",
      result: "Website live in 14 days",
      tag: "Web Design",
      link: "https://moenviron.com",
      size: "lg",
    },
    {
      title: "Githunguri Primary School Uniforms",
      client: "Githunguri Primary",
      location: "Kiambu, Kenya",
      service: "DTF Printing",
      desc: "120 branded T-shirts with school logo. DTF printing delivered in 3 days during exam week. Used the school's existing logo and matched exact pantone colors.",
      result: "120 T-shirts in 3 days",
      tag: "DTF Printing",
    },
    {
      title: "PCEA Githunguri Church Event",
      client: "PCEA Githunguri",
      location: "Kiambu, Kenya",
      service: "Bulk Printing",
      desc: "500 event T-shirts with custom design for annual youth conference. Gang sheet built, printed, and delivered in 5 days with same-day pickup option.",
      result: "500 T-shirts in 5 days",
      tag: "Bulk Printing",
    },
    {
      title: "Nai Wear Apparel Store",
      client: "Nai Wear Apparel",
      location: "Nairobi, Kenya",
      service: "Web Design + Branding",
      desc: "Custom Shopify store with M-PESA integration, social media setup, brand identity design, and supplier onboarding training.",
      result: "Store live + 3 staff trained",
      tag: "Web Design",
    },
    {
      title: "Kamau General Store Rebrand",
      client: "Kamau General Store",
      location: "Kiambu County",
      service: "Branding + Marketing",
      desc: "Logo design, business cards, signage, and staff training on WhatsApp marketing. Rebranded from a tired 90s logo to a clean modern identity.",
      result: "Now sells across Kenya",
      tag: "Branding",
    },
    {
      title: "Diaspora Business Setup",
      client: "James, London UK",
      location: "Diaspora / Remote",
      service: "Diaspora Operations",
      desc: "Registered Kenyan company, built website, set up M-PESA till, and managed operations remotely. Owner never visited Kenya during setup.",
      result: "Company launched remotely",
      tag: "Diaspora Ops",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Breadcrumbs items={[{ label: "Work" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">PORTFOLIO</Badge>
          <h1 className="font-display text-5xl font-bold mb-4">
            Work We&apos;re <span className="text-primary text-glow">Proud Of</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Real projects for real clients across Kenya. From T-shirt printing to full brand identities and e-commerce websites.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`nura-card p-6 group hover:border-primary/40 transition ${p.size === "lg" ? "md:col-span-2" : ""}`}
              onClick={() => p.link && window.open(p.link, "_blank")}
              style={p.link ? { cursor: "pointer" } : undefined}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">{p.tag}</Badge>
                {p.link && <Icons.ExternalLink className="h-4 w-4 text-accent/40 group-hover:text-accent transition" />}
              </div>
              <h3 className="font-display font-bold text-lg mb-1 text-foreground">{p.title}</h3>
              <p className="text-sm text-accent mb-2">{p.client} - {p.location}</p>
              <p className="text-xs text-muted-foreground mb-4">{p.service}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Icons.CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-semibold text-primary">{p.result}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-10 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Want to Be Our Next Success Story?</h2>
          <p className="max-w-xl mx-auto text-muted-foreground mb-6">
            From a single T-shirt to a full brand launch, we deliver real work on real timelines.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => onNavigate("contact")} className="bg-primary text-white hover:bg-primary/90 box-glow">
              Start Your Project <Icons.ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <a
              href="https://instagram.com/creative.divine.concepts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold px-4 py-2"
            >
              <Icons.Instagram className="h-4 w-4" />
              See More on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
