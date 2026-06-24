"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, ToolId } from "@/lib/tools";

interface NavbarProps {
  onNavigate: (view: "home" | "tools" | "services" | "contact" | "about" | "pricing") => void;
  onOpenTool: (id: ToolId) => void;
  currentView: string;
}

export function Navbar({ onNavigate, onOpenTool, currentView }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const navItem = (label: string, view: any) => (
    <button
      onClick={() => {
        onNavigate(view);
        setMobileOpen(false);
      }}
      className={`px-4 py-2 rounded-sm text-sm font-display font-bold tracking-widest transition-all duration-300 ${
        currentView === view
          ? "text-accent bg-accent/10 border border-accent/30 box-glow"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="fixed top-4 inset-x-4 md:max-w-6xl md:mx-auto z-40 bg-background/60 backdrop-blur-xl border border-border/30 rounded-3xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="Creative Divine Concepts" className="h-10 w-auto object-contain rounded-2xl" />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navItem("Home", "home")}
          {navItem("Services", "services")}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              onClick={() => onNavigate("tools")}
              className={`flex items-center gap-1 px-4 py-2 rounded-sm text-sm font-display font-bold tracking-widest transition-all duration-300 ${
                currentView === "tools" || currentView === "tool"
                  ? "text-accent bg-accent/10 border border-accent/30 box-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Tools
              <ChevronDown className="h-3 w-3 transition-transform duration-300" />
            </button>
            {toolsOpen && (
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 grid grid-cols-3 gap-2">
                {TOOLS.map((tool) => {
                  const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onOpenTool(tool.id);
                        setToolsOpen(false);
                      }}
                      className="flex items-start gap-2 rounded-md p-2 text-left hover:bg-primary/10 transition"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{tool.name}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">{tool.tagline}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {navItem("Pricing", "pricing")}
          {navItem("Contact", "contact")}
          {navItem("About", "about")}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-1 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {navItem("Home", "home")}
          {navItem("Services", "services")}
          {navItem("Tools Hub", "tools")}
          {navItem("Pricing", "pricing")}
          {navItem("About", "about")}
          {navItem("Contact", "contact")}
          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">All Tools</p>
            <div className="grid grid-cols-1 gap-1">
              {TOOLS.map((tool) => {
                const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onOpenTool(tool.id);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md p-2 text-left hover:bg-primary/10"
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
