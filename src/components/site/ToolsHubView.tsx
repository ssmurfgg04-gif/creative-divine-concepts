"use client";

import * as Icons from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TOOLS, TOOL_CATEGORIES, ToolId } from "@/lib/tools";

interface ToolsHubViewProps {
  onOpenTool: (id: ToolId) => void;
}

export function ToolsHubView({ onOpenTool }: ToolsHubViewProps) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = TOOLS.filter((t) => {
    const matchCat = activeCat === "all" || t.category === activeCat;
    const matchQuery =
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tagline.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">
            <Icons.Wrench className="mr-1.5 h-3 w-3" />
            {TOOLS.length} Tools Available
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Creative <span className="text-primary">Tools Hub</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Free, browser-based design tools for T-shirt printers, designers, and non-designers. All tools work 100% in your browser. No sign-up, no API keys.
          </p>
          {/* Trust badges - per Reddit research, "no signup" is #1 differentiator */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {[
              "No signup",
              "No watermark",
              "No credits",
              "No download",
              "100% private",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 text-xs text-accent bg-accent/5 border border-accent/20 rounded-full px-3 py-1.5 font-semibold"
              >
                <Icons.Check className="h-3 w-3" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Search + filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="pl-10 h-11 bg-card/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin">
            <Button
              variant={activeCat === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCat("all")}
              className={activeCat === "all" ? "bg-primary text-primary-foreground" : ""}
            >
              All ({TOOLS.length})
            </Button>
            {TOOL_CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <Button
                  key={cat.id}
                  variant={activeCat === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCat(cat.id)}
                  className={activeCat === cat.id ? "bg-primary text-primary-foreground whitespace-nowrap" : "whitespace-nowrap"}
                >
                  {cat.label} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tool grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => {
            const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
            return (
              <motion.button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 text-left transition hover:border-accent/50 hover:bg-card/60"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent group-hover:bg-accent group-hover:text-white transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  {tool.badge && (
                    <Badge className="ml-auto bg-accent/10 text-accent border-accent/30 text-[10px] uppercase">
                      {tool.badge === "ai" && <Icons.Sparkles className="mr-1 h-3 w-3" />}
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-display font-bold mb-1">{tool.name}</h3>
                <p className="text-sm text-primary mb-2">{tool.tagline}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">{tool.description}</p>
                <div className="mt-4 flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition">
                  Open tool <Icons.ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Icons.SearchX className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No tools match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
