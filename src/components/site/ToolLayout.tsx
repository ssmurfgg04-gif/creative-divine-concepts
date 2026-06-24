"use client";

import { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ToolLayoutProps {
  title: string;
  tagline: string;
  icon?: ReactNode;
  badge?: string;
  onBack: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarWidth?: string;
}

export function ToolLayout({
  title,
  tagline,
  icon,
  badge,
  onBack,
  headerActions,
  children,
  sidebar,
  sidebarWidth = "w-80",
}: ToolLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 hover:bg-primary/20"
            aria-label="Back to tools"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold leading-none">{title}</h1>
                {badge && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary border-primary/30 text-[10px] uppercase tracking-wider"
                  >
                    {badge === "ai" && <Sparkles className="mr-1 h-3 w-3" />}
                    {badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-tight">{tagline}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">{headerActions}</div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Canvas area */}
        <main className="relative min-w-0 flex-1 overflow-auto bg-grid">
          <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
          <div className="relative h-full w-full">{children}</div>
        </main>

        {/* Sidebar */}
        {sidebar && (
          <aside
            className={`${sidebarWidth} shrink-0 overflow-y-auto border-l border-border bg-card/40 backdrop-blur-xl scrollbar-thin`}
          >
            <div className="space-y-4 p-4">{sidebar}</div>
          </aside>
        )}
      </div>
    </div>
  );
}

export function ToolSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <section className="rounded-lg border border-border bg-background/40">
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
          {title}
          <span className="text-primary transition-transform group-open:rotate-90">›</span>
        </summary>
        <div className="border-t border-border p-3">{children}</div>
      </details>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 font-display text-xl font-bold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
