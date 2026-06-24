"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, ToolId } from "@/lib/tools";

interface NavbarProps {
  onNavigate: (view: string) => void;
  onOpenTool: (id: ToolId) => void;
  currentView: string;
}

// Original site nav structure (from creativedivineconcepts.com)
const NAV_ITEMS = [
  { label: "Home", view: "home" },
  { label: "Services", view: "services", dropdown: "services" },
  { label: "Tools", view: "tools", dropdown: "tools" },
  { label: "Academy", view: "academy" },
  { label: "Pricing", view: "pricing" },
  { label: "About", view: "about", dropdown: "company" },
  { label: "Contact", view: "contact" },
];

const SERVICES_DROPDOWN = [
  { label: "Branding", view: "services" },
  { label: "Web Development", view: "services" },
  { label: "Digital Marketing", view: "services" },
  { label: "Startup Launch", view: "services" },
];

const COMPANY_DROPDOWN = [
  { label: "About", view: "about" },
  { label: "Contact", view: "contact" },
  { label: "Blog", view: "about" },
  { label: "Careers", view: "about" },
];

export function Navbar({ onNavigate, onOpenTool, currentView }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdown: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleNavClick = (view: string, dropdown?: string) => {
    if (dropdown) {
      // Toggle dropdown on click for mobile / tap devices
      setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    } else {
      setOpenDropdown(null);
      onNavigate(view);
      setMobileOpen(false);
    }
  };

  const renderDropdown = (dropdown: string) => {
    if (dropdown === "services") {
      return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-2 z-50">
          {SERVICES_DROPDOWN.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setOpenDropdown(null);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 w-full rounded-md p-2.5 text-left text-sm hover:bg-primary/10 hover:text-primary transition"
            >
              <Icons.ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </div>
      );
    }
    if (dropdown === "company") {
      return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-2 z-50">
          {COMPANY_DROPDOWN.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setOpenDropdown(null);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 w-full rounded-md p-2.5 text-left text-sm hover:bg-primary/10 hover:text-primary transition"
            >
              <Icons.ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </div>
      );
    }
    if (dropdown === "tools") {
      return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] max-w-[95vw] bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 z-50">
          <div className="mb-3 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm">All Creative Tools</h3>
                <p className="text-xs text-muted-foreground">{TOOLS.length} free browser-based tools</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  onNavigate("tools");
                  setOpenDropdown(null);
                }}
              >
                View Hub <Icons.ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
            {TOOLS.map((tool) => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onOpenTool(tool.id);
                    setOpenDropdown(null);
                    setMobileOpen(false);
                  }}
                  className="flex items-start gap-2.5 rounded-md p-2.5 text-left hover:bg-primary/10 transition group"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold truncate">{tool.name}</span>
                      {tool.badge && (
                        <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-primary/15 text-primary">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{tool.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="fixed top-4 inset-x-4 md:max-w-6xl md:mx-auto z-40 bg-background/60 backdrop-blur-xl border border-border/30 rounded-3xl shadow-lg overflow-visible transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 shrink-0 mr-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="Creative Divine Concepts" className="h-10 w-auto object-contain rounded-2xl" />
          </button>
          {/* Home button right next to logo (matches original site) */}
          <button
            onClick={() => onNavigate("home")}
            className={`px-3 py-2 rounded-sm text-sm font-display font-bold tracking-widest transition-all duration-300 whitespace-nowrap ${
              currentView === "home"
                ? "text-accent bg-accent/10 border border-accent/30 box-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Home
          </button>
        </div>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.filter((item) => item.label !== "Home").map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === "tools" && currentView === "tool");
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.dropdown)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick(item.view, item.dropdown)}
                  className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-sm text-sm font-display font-bold tracking-widest transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-accent bg-accent/10 border border-accent/30 box-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${
                        openDropdown === item.dropdown ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {item.dropdown && openDropdown === item.dropdown && renderDropdown(item.dropdown)}
              </div>
            );
          })}
          <Button
            onClick={() => onNavigate("contact")}
            size="sm"
            className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 box-glow font-display font-bold tracking-wider"
          >
            Get Started
          </Button>
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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl p-4 space-y-1 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.filter((item) => item.label !== "Home").map((item) => (
            <div key={item.label}>
              <button
                onClick={() => handleNavClick(item.view, item.dropdown)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-display font-bold tracking-wider ${
                  currentView === item.view
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === item.dropdown ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {item.dropdown && openDropdown === item.dropdown && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                  {item.dropdown === "tools" ? (
                    TOOLS.map((tool) => {
                      const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onOpenTool(tool.id);
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm text-left hover:bg-primary/10"
                        >
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span>{tool.name}</span>
                        </button>
                      );
                    })
                  ) : item.dropdown === "services" ? (
                    SERVICES_DROPDOWN.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          onNavigate(s.view);
                          setMobileOpen(false);
                        }}
                        className="block w-full px-2 py-2 rounded-md text-sm text-left text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        {s.label}
                      </button>
                    ))
                  ) : (
                    COMPANY_DROPDOWN.map((c) => (
                      <button
                        key={c.label}
                        onClick={() => {
                          onNavigate(c.view);
                          setMobileOpen(false);
                        }}
                        className="block w-full px-2 py-2 rounded-md text-sm text-left text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        {c.label}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={() => {
              onNavigate("contact");
              setMobileOpen(false);
            }}
            className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90 box-glow font-display font-bold"
          >
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
}
