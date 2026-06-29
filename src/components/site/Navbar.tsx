"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, ToolId } from "@/lib/tools";
import { ThemeToggle } from "@/components/site/ThemeToggle";

interface NavbarProps {
  onNavigate: (view: string) => void;
  onOpenTool: (id: ToolId) => void;
  currentView: string;
}

// Navbar order per spec: Services first, Work second, Free Tools third, Pricing fourth, Blog fifth, About/Contact last
const NAV_ITEMS = [
  { label: "Home", view: "home" },
  { label: "Services", view: "services", dropdown: "services" },
  { label: "Work", view: "work" },
  { label: "Free Tools", view: "tools", dropdown: "tools" },
  { label: "Pricing", view: "pricing" },
  { label: "Blog", view: "blog" },
  { label: "About", view: "about" },
  { label: "Contact", view: "contact" },
];

const SERVICES_DROPDOWN = [
  { label: "Web Design", view: "services" },
  { label: "Branding", view: "services" },
  { label: "DTF / DTG Printing", view: "services" },
  { label: "Diaspora Operations", view: "services" },
  { label: "Digital Marketing", view: "services" },
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

  // Close mobile menu on Escape
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (view: string, dropdown?: string) => {
    if (dropdown) {
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
    if (dropdown === "tools") {
      // Show 8 most popular tools + View All link
      const popularTools = TOOLS.slice(0, 8);
      return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] max-w-[95vw] bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl p-4 z-50">
          <div className="mb-3 pb-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm">Free Tools</h3>
              <p className="text-xs text-muted-foreground">{TOOLS.length} free browser-based tools, no signup</p>
            </div>
            <button
              onClick={() => {
                onNavigate("tools");
                setOpenDropdown(null);
              }}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
            {popularTools.map((tool) => {
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
    <nav className="fixed top-3 inset-x-3 md:top-4 md:inset-x-4 md:max-w-6xl md:mx-auto z-40 bg-background/70 backdrop-blur-xl border border-border/30 rounded-2xl md:rounded-3xl shadow-lg overflow-visible transition-all duration-300">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 shrink-0"
          aria-label="Creative Divine Concepts home"
        >
          <img
            src="/logo.webp"
            alt="Creative Divine Concepts"
            className="h-9 md:h-10 w-auto object-contain rounded-xl md:rounded-2xl"
            width="40"
            height="40"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === "tools" && currentView === "tool");
            return (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.dropdown)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick(item.view, item.dropdown)}
                  className={`relative flex items-center gap-1 px-2.5 xl:px-3.5 py-2 text-[13px] font-display font-bold tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
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
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-accent" />
                  )}
                  {/* Hover underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-accent origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </button>
                {item.dropdown && openDropdown === item.dropdown && renderDropdown(item.dropdown)}
              </div>
            );
          })}
          <ThemeToggle />
          <Button
            onClick={() => onNavigate("contact")}
            size="sm"
            className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 box-glow font-display font-bold tracking-wider"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile/Tablet right side: Theme toggle + Hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-foreground hover:bg-accent/10 rounded-lg transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu - slide-down panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[68px] bg-background/40 backdrop-blur-sm z-30"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl p-3 space-y-1 max-h-[80vh] overflow-y-auto scrollbar-thin rounded-b-2xl md:rounded-b-3xl shadow-2xl">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => handleNavClick(item.view, item.dropdown)}
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-display font-bold tracking-wider transition ${
                    currentView === item.view ||
                    (item.view === "tools" && currentView === "tool")
                      ? "text-accent bg-accent/10"
                      : "text-foreground hover:bg-muted/50 active:bg-muted"
                  }`}
                >
                  <span>{item.label}</span>
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
                      <>
                        {TOOLS.slice(0, 6).map((tool) => {
                          const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
                          return (
                            <button
                              key={tool.id}
                              onClick={() => {
                                onOpenTool(tool.id);
                                setMobileOpen(false);
                              }}
                              className="flex items-center gap-2 w-full px-2 py-2.5 rounded-md text-sm text-left text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                            >
                              <Icon className="h-4 w-4 text-primary shrink-0" />
                              <span className="truncate">{tool.name}</span>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => {
                            onNavigate("tools");
                            setMobileOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-2.5 rounded-md text-sm text-left text-primary font-semibold hover:bg-primary/10 transition"
                        >
                          View all {TOOLS.length} tools <ArrowRight className="h-3 w-3" />
                        </button>
                      </>
                    ) : item.dropdown === "services" ? (
                      SERVICES_DROPDOWN.map((s) => (
                        <button
                          key={s.label}
                          onClick={() => {
                            onNavigate(s.view);
                            setMobileOpen(false);
                          }}
                          className="block w-full px-2 py-2.5 rounded-md text-sm text-left text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                        >
                          {s.label}
                        </button>
                      ))
                    ) : null}
                  </div>
                )}
              </div>
            ))}
            <Button
              onClick={() => {
                onNavigate("contact");
                setMobileOpen(false);
              }}
              className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 box-glow font-display font-bold h-12"
            >
              Get Started
            </Button>
          </div>
        </>
      )}
    </nav>
  );
}
