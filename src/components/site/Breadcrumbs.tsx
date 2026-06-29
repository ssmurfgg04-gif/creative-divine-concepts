"use client";

import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; view?: string }[];
  onNavigate: (view: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="container mx-auto max-w-6xl px-4 pt-24 pb-2">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
        <li>
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-primary transition flex items-center gap-1"
          >
            <Home className="h-3 w-3" /> Home
          </button>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            {item.view ? (
              <button
                onClick={() => onNavigate(item.view!)}
                className="hover:text-primary transition"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-foreground font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
