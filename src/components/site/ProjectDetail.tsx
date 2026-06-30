"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getProjectBySlug, PROJECTS } from "@/lib/projects";

interface ProjectDetailProps {
  slug: string;
  onNavigate: (view: any) => void;
  onBack: () => void;
}

export function ProjectDetail({ slug, onNavigate, onBack }: ProjectDetailProps) {
  const project = getProjectBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4 text-foreground">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you are looking for does not exist.</p>
          <Button onClick={() => onNavigate("work")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Work
          </Button>
        </div>
      </div>
    );
  }

  // Related projects (same tag, exclude current)
  const relatedProjects = PROJECTS.filter(
    (p) => p.slug !== project.slug && (p.tag === project.tag || p.service === project.service)
  ).slice(0, 3);
  // Fallback if not enough related
  const fallbackRelated = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);
  const finalRelated = relatedProjects.length >= 2 ? relatedProjects : fallbackRelated;

  const whatsappLink =
    "https://wa.me/+254711669113?text=" +
    encodeURIComponent(
      `Hi CDC, I saw your ${project.title} project and I would like to discuss a similar project.`
    );

  // CreativeWork schema for SEO
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Organization",
      name: "Creative Divine Concepts Ltd",
      url: "https://creativedivineconcepts.com",
    },
    about: project.service,
    keywords: [project.tag, project.service, "Kenya", "Creative Divine Concepts"].join(", "),
    image: project.gallery.map((g) => `https://creativedivineconcepts.com${g.src}`),
    datePublished: "2026-06-01",
    inLanguage: "en",
    spatialCoverage: {
      "@type": "Place",
      name: project.location,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Businesses in Kenya",
    },
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Work", view: "work" },
          { label: project.title },
        ]}
        onNavigate={onNavigate}
      />

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">
              {project.tag}
            </Badge>
            <span className="text-xs text-muted-foreground">{project.service}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3 text-foreground">
            {project.title}
          </h1>
          <p className="text-sm md:text-base text-accent mb-2">
            {project.client} - {project.location}
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Icons.CheckCircle2 className="h-4 w-4" />
            {project.result}
          </div>
        </div>

        {/* Main image gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* Main image */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3] group"
            >
              <img
                src={project.gallery[activeImage].src}
                alt={project.gallery[activeImage].alt}
                width={800}
                height={600}
                className="absolute inset-0 w-full h-full object-cover"
                fetchPriority="high"
              />
              {project.gallery[activeImage].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4">
                  <p className="text-sm text-foreground font-medium">
                    {project.gallery[activeImage].caption}
                  </p>
                </div>
              )}
              {project.link && activeImage === 0 && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 transition"
                >
                  <Icons.ExternalLink className="h-3 w-3" />
                  Visit Live Site
                </a>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            {project.gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      activeImage === i
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={activeImage === i}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      width={120}
                      height={120}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: project info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="nura-card p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">Project Overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="nura-card p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">What We Did</h2>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Icons.Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nura-card p-6 bg-primary/5 border-primary/30">
              <h2 className="font-display text-lg font-bold mb-2 text-foreground">Want a Similar Project?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Get a free quote. We typically reply within minutes on WhatsApp.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-filled h-11 px-6 inline-flex items-center justify-center gap-2 text-sm"
                >
                  <Icons.MessageCircle className="h-4 w-4" />
                  Get a Quote
                </a>
                <Button
                  onClick={() => onNavigate("pricing")}
                  variant="outline"
                  className="h-11 text-sm"
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial (if exists) */}
        {project.testimonial && (
          <div className="nura-card p-6 md:p-10 mb-12 max-w-4xl mx-auto">
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icons.Star key={star} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-display text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold">
                {project.testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-foreground">{project.testimonial.name}</div>
                <div className="text-sm text-accent">{project.testimonial.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Image grid - all images */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Project Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveImage(i)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative rounded-xl overflow-hidden border-2 transition group text-left aspect-[4/3] ${
                  activeImage === i
                    ? "border-primary"
                    : "border-border hover:border-primary/40"
                }`}
                aria-label={`View image ${i + 1}: ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-xs text-foreground font-medium">{img.caption}</p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Related Projects */}
        {finalRelated.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalRelated.map((p, i) => (
                <motion.button
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => {
                    setActiveImage(0);
                    onNavigate(`project/${p.slug}`);
                  }}
                  className="nura-card p-0 group hover:border-primary/40 transition text-left overflow-hidden flex flex-col cursor-pointer"
                  aria-label={`View project: ${p.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={p.gallery[0].src}
                      alt={p.gallery[0].alt}
                      width={400}
                      height={300}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/90 text-primary border-primary/30 text-[10px] backdrop-blur-sm">
                        {p.tag}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-sm mb-1 text-foreground line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-accent mb-2">{p.client}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-1 pt-3 mt-3 border-t border-border text-xs text-primary font-semibold">
                      View Project <Icons.ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8 md:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-foreground">
            Ready to Start Your Project?
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground mb-6">
            From a single T-shirt to a full brand launch, we deliver real work on real timelines.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-filled h-12 px-6 md:px-8 inline-flex items-center gap-2"
            >
              <Icons.MessageCircle className="h-4 w-4" />
              Start Your Project
              <Icons.ArrowRight className="h-4 w-4" />
            </a>
            <Button
              onClick={() => onNavigate("work")}
              variant="outline"
              className="h-12"
            >
              Back to All Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
