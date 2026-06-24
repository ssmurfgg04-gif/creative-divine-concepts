"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface TeachingPortalProps {
  onNavigate: (view: any) => void;
}

const COURSES = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    instructor: "Jack Blessed",
    icon: "Code2",
    duration: "12 weeks",
    level: "Beginner to Pro",
    description: "Learn to build modern web applications from scratch using Next.js, React, TypeScript, and Prisma. Taught remotely by Jack Blessed while Creative supervises students on-site in Kiambu.",
    modules: [
      "HTML, CSS & JavaScript Fundamentals",
      "React & Modern Frontend Development",
      "Next.js 16 with App Router",
      "TypeScript for Type-Safe Code",
      "Database Design with Prisma & PostgreSQL",
      "API Development & REST/GraphQL",
      "Authentication & Security",
      "Deployment & DevOps Basics",
      "Real-World Project: Build a SaaS App",
      "Portfolio Development & Job Prep",
    ],
    outcomes: [
      "Build production-ready web applications",
      "Understand full-stack architecture",
      "Deploy apps to production",
      "Freelance or get hired as a developer",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "text-blue-500",
  },
  {
    id: "design",
    title: "Graphic Design & Print",
    instructor: "Creative Divine Team",
    icon: "Palette",
    duration: "8 weeks",
    level: "Beginner Friendly",
    description: "Master T-shirt design, DTF/DTG printing preparation, brand identity, and Adobe Photoshop/After Effects. Learn the exact workflows used in our print shop.",
    modules: [
      "Design Fundamentals & Color Theory",
      "Adobe Photoshop for Print",
      "T-Shirt Artwork Preparation",
      "DTF & DTG Printing Workflow",
      "Gang Sheet Building & Nesting",
      "Color Separation & Knockout",
      "Vector Graphics & Logo Design",
      "Mockup Creation for Clients",
      "After Effects for Motion Graphics",
      "Building a Design Portfolio",
    ],
    outcomes: [
      "Create print-ready T-shirt artwork",
      "Prepare DTF/DTG files correctly",
      "Design professional brand identities",
      "Start a print design business",
    ],
    color: "from-primary/20 to-orange-500/20",
    accent: "text-primary",
  },
  {
    id: "marketing",
    title: "Digital Marketing & Sales",
    instructor: "Creative Divine Team",
    icon: "TrendingUp",
    duration: "6 weeks",
    level: "All Levels",
    description: "Learn digital marketing, social media strategy, lead generation, and customer care systems specifically for the Kenyan and East African market.",
    modules: [
      "Digital Marketing Foundations",
      "Social Media Strategy (Instagram, TikTok, Facebook)",
      "Content Creation & Copywriting",
      "Lead Generation & Sales Funnels",
      "Customer Care Systems",
      "WhatsApp Business Marketing",
      "Google Ads & Facebook Ads Basics",
      "Email Marketing for Kenyan Market",
      "Analytics & Reporting",
      "Building a Marketing Agency",
    ],
    outcomes: [
      "Run effective social media campaigns",
      "Generate leads and convert customers",
      "Set up marketing automation",
      "Offer marketing services to clients",
    ],
    color: "from-green-500/20 to-emerald-500/20",
    accent: "text-green-500",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "KES 5,000",
    period: "per module",
    desc: "Perfect for trying out a single module",
    features: [
      "1 course module",
      "Pre-recorded video lessons",
      "Downloadable resources",
      "Community forum access",
      "Certificate of completion",
      "Email support",
    ],
    highlight: false,
    cta: "Enroll in a Module",
  },
  {
    name: "Professional",
    price: "KES 15,000",
    period: "per month",
    desc: "Best value for serious learners",
    features: [
      "Full course (all modules)",
      "Live online sessions with instructor",
      "On-site supervision at Creative (Kiambu)",
      "1-on-1 mentorship calls",
      "Real project assignments",
      "Job placement assistance",
      "Lifetime access to materials",
      "WhatsApp support group",
      "Verified certificate",
    ],
    highlight: true,
    cta: "Enroll Now",
  },
  {
    name: "Business / Team",
    price: "KES 50,000",
    period: "per month",
    desc: "For teams and organizations",
    features: [
      "Up to 5 team members",
      "All 3 courses included",
      "Custom training schedule",
      "Dedicated instructor",
      "On-site training available",
      "Team project reviews",
      "Custom curriculum options",
      "Priority support",
      "Team certificates",
      "3-month commitment",
    ],
    highlight: false,
    cta: "Contact for Teams",
  },
];

const STATS = [
  { label: "STUDENTS_TAUGHT", value: "120+", desc: "Active Learners" },
  { label: "COMPLETION_RATE", value: "87%", desc: "Course Completion" },
  { label: "JOB_PLACEMENT", value: "73%", desc: "Hired within 6 months" },
  { label: "INSTRUCTORS", value: "3", desc: "Expert Teachers" },
];

export function TeachingPortal({ onNavigate }: TeachingPortalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleEnroll = (plan: string) => {
    toast.success(`Enrollment interest noted for ${plan}! Our team will contact you within 24 hours.`);
    onNavigate("contact");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">
            <Icons.GraduationCap className="mr-1.5 h-3 w-3" />
            MAFUNZO YA UCHAPISHAJI
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Creative <span className="text-gradient-cyan">Academy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-6">
            Learn full-stack development, graphic design, and digital marketing from industry experts.
            Taught online with on-site supervision in Kiambu, Kenya.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow">
              <Icons.BookOpen className="mr-2 h-5 w-5" /> View Courses
            </Button>
            <Button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
              <Icons.DollarSign className="mr-2 h-5 w-5" /> See Pricing
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="nura-card px-6 py-4 text-center"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary/30">{stat.label}</div>
              <div className="font-display text-3xl font-bold text-primary mt-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50">MODULE-01</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">How It Works</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Online learning with on-site supervision. The best of both worlds for serious learners.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { num: "01", icon: "Laptop", title: "Learn Online", desc: "Attend live sessions or watch recordings from anywhere. Jack teaches development remotely." },
              { num: "02", icon: "MapPin", title: "On-Site Support", desc: "Come to Creative in Githunguri, Kiambu for supervised practice sessions and hands-on help." },
              { num: "03", icon: "FolderKanban", title: "Real Projects", desc: "Work on actual client projects and build a portfolio that gets you hired." },
              { num: "04", icon: "Award", title: "Get Certified", desc: "Earn a verified certificate and get job placement assistance." },
            ].map((step, i) => {
              const Icon = (Icons as any)[step.icon];
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="nura-card p-5 relative"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-primary/30">PHASE-{step.num}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mt-2 mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm mb-1 text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50">MODULE-02</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Our Courses</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Three specialized tracks taught by industry professionals. Choose one or combine them for a complete skill set.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {COURSES.map((course, i) => {
              const Icon = (Icons as any)[course.icon];
              const isExpanded = selectedCourse === course.id;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`nura-card p-6 cursor-pointer relative overflow-hidden ${isExpanded ? "md:col-span-3" : ""}`}
                  onClick={() => setSelectedCourse(isExpanded ? null : course.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-50 pointer-events-none`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-background/60 ${course.accent}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge className="bg-background/60 text-foreground border-border">{course.duration}</Badge>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1 text-foreground">{course.title}</h3>
                    <p className={`text-xs font-mono uppercase tracking-wider mb-3 ${course.accent}`}>
                      Instructor: {course.instructor} • {course.level}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                    {isExpanded && (
                      <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
                        <div>
                          <h4 className="font-display font-bold text-sm mb-3 text-foreground">Course Modules</h4>
                          <ul className="space-y-2">
                            {course.modules.map((mod, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="font-mono text-primary/50 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                                <span>{mod}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm mb-3 text-foreground">What You&apos;ll Achieve</h4>
                          <ul className="space-y-2">
                            {course.outcomes.map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Icons.CheckCircle2 className={`h-4 w-4 shrink-0 ${course.accent}`} />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll(course.title);
                            }}
                            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Enroll in This Course <Icons.ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isExpanded && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-semibold">
                          {course.modules.length} modules
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Click to expand <Icons.ChevronDown className="inline h-3 w-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary/50">MODULE-03</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">Pricing Plans</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Affordable for startups, with options for serious learners and teams. Knowledge that pays for itself.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`relative rounded-xl border p-6 ${
                  plan.highlight
                    ? "border-primary bg-gradient-to-b from-primary/10 to-transparent box-glow"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.desc}</p>
                <div className="mb-4">
                  <div className="font-display text-3xl font-bold text-primary">{plan.price}</div>
                  <div className="text-xs text-muted-foreground">{plan.period}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Icons.Check className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleEnroll(plan.name)}
                  className={`w-full ${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              As one client said: &ldquo;If you&apos;re going to make 100,000 KES, paying 10,000 for knowledge is nothing.
              You can make that 100,000 again and again.&rdquo;
            </p>
            <Button onClick={() => onNavigate("contact")} variant="ghost" className="gap-2">
              <Icons.MessageCircle className="h-4 w-4" /> Talk to Us First
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <div className="nura-card p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="relative">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">COMMAND: ENROLL</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 mt-2 text-foreground">
                Ready to Invest in Your Future?
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-6">
                Join 120+ students who have transformed their careers through Creative Academy.
                Whether you&apos;re starting from zero or leveling up, we have a path for you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => onNavigate("contact")} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow">
                  Start Learning Today <Icons.ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={() => onNavigate("contact")} size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10">
                  Book a Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
