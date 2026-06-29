"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolId } from "@/lib/tools";

interface NavbarProps {
  onNavigate: (view: string) => void;
  onOpenTool: (id: ToolId) => void;
  currentView: string;
}

// Phase 11: Simplified nav. Removed Tools and Academy (moved to footer). Added Work.
const NAV_ITEMS = [
  { label: "Home", view: "home" },
  { label: "Services", view: "services", dropdown: "services" },
  { label: "Work", view: "work" },
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
    return null;
  };

  return (
    <nav className="fixed top-4 inset-x-4 md:max-w-6xl md:mx-auto z-40 bg-background/60 backdrop-blur-xl border border-border/30 rounded-3xl shadow-lg overflow-visible transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 shrink-0" aria-label="Creative Divine Concepts home">
          <img src="/logo.webp" alt="Creative Divine Concepts" className="h-10 w-auto object-contain rounded-2xl" width="40" height="40" />
        </button>

        {/* Desktop nav - single container for consistent spacing */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.view;
            return (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.dropdown)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick(item.view, item.dropdown)}
                  className={`relative flex items-center gap-1 px-3 lg:px-4 py-2 text-sm font-display font-bold tracking-widest transition-all duration-300 whitespace-nowrap ${
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
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent" />
                  )}
                  {/* Hover underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
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
          {NAV_ITEMS.map((item) => (
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
                  {SERVICES_DROPDOWN.map((s) => (
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
                  ))}
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
