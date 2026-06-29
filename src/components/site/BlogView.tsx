"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-posts";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

interface BlogViewProps {
  onNavigate: (view: any) => void;
}

export function BlogView({ onNavigate }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return <BlogArticle post={selectedPost} onBack={() => setSelectedPost(null)} onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <Breadcrumbs items={[{ label: "Blog" }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">
            <Icons.BookOpen className="mr-1.5 h-3 w-3" />
            CDC Blog
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Insights &amp; <span className="text-gradient-cyan">Guides</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Expert tips on T-shirt printing, DTF/DTG, design preparation, and building a profitable printing business in Kenya.
          </p>
        </div>

        <div className="grid gap-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="nura-card p-6 cursor-pointer group hover:border-primary/40 transition"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
                <span className="text-xs text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{post.description}</p>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                Read more <Icons.ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============== Blog Article View ==============

function BlogArticle({ post, onBack, onNavigate }: { post: BlogPost; onBack: () => void; onNavigate: (view: any) => void }) {
  // BlogArticle schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Creative Divine Concepts",
      logo: { "@type": "ImageObject", url: "https://creativedivineconcepts.com/logo.jpeg" },
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Breadcrumbs items={[{ label: "Blog", view: "blog" }, { label: post.title }]} onNavigate={onNavigate} />
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition"
        >
          <Icons.ArrowLeft className="h-4 w-4" /> Back to Blog
        </button>

        <article>
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{post.description}</p>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
              CDC
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{post.author}</div>
              <div className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {post.content.map((block, i) => {
              if (block.type === "heading") {
                const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
                return <Tag key={i} className="font-display font-bold text-foreground mt-8 mb-3 text-xl md:text-2xl">{block.text}</Tag>;
              }
              if (block.type === "paragraph") {
                return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{block.text}</p>;
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="space-y-2 mb-4">
                    {block.items?.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <Icons.ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "table" && block.headers && block.rows) {
                return (
                  <div key={i} className="overflow-x-auto mb-4">
                    <table className="w-full border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-primary/10">
                          {block.headers.map((h, j) => (
                            <th key={j} className="text-left p-3 text-xs font-display font-bold text-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, j) => (
                          <tr key={j} className="border-t border-border">
                            {row.map((cell, k) => (
                              <td key={k} className="p-3 text-xs text-muted-foreground">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (block.type === "cta") {
                return (
                  <div key={i} className="my-6">
                    <button
                      onClick={() => {
                        if (block.ctaLink?.startsWith("tool/")) {
                          window.location.hash = block.ctaLink;
                        } else if (block.ctaLink) {
                          onNavigate(block.ctaLink);
                        }
                      }}
                      className="cyber-btn-filled h-12 px-8"
                    >
                      {block.ctaText} <Icons.ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">#{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 nura-card p-6 text-center">
            <h3 className="font-display font-bold text-lg mb-2 text-foreground">Need Help with Your Project?</h3>
            <p className="text-sm text-muted-foreground mb-4">Contact Creative Divine Concepts for T-shirt printing, web design, and branding in Kenya.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => onNavigate("contact")} className="cyber-btn-filled h-10 px-6">Get a Quote</button>
              <a href="https://wa.me/+254711669113" target="_blank" rel="noopener noreferrer" className="cyber-btn h-10 px-6">WhatsApp Us</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
