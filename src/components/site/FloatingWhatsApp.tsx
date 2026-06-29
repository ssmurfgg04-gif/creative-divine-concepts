"use client";

import { useState, useEffect } from "react";
import { X, Phone, Mail, MapPin } from "lucide-react";

// Custom WhatsApp icon (stroke/outline style, warm orange)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* WhatsApp speech bubble with phone handset */}
      <path d="M3 21l1.65-3.8a9 9 0 1 1 2.85 2.85L3 21" />
      <path d="M9 10a.5.5 0 1 0 1 0V9a.5.5 0 1 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      <path d="M9.5 9a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Expanded contact card */}
      {expanded && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="Creative Divine Concepts" className="h-10 w-10 rounded-lg object-cover" />
              <div>
                <div className="font-display font-bold text-primary-foreground text-sm">Creative Divine Concepts</div>
                <div className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Online now
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Hi! Need help with T-shirt printing, web design, or branding? We typically reply within minutes!
            </p>
            <a
              href="https://wa.me/+254711669113?text=Hello%20Creative%20Divine%20Concepts,%20I%20would%20like%20to%20know%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-primary/5 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#E8820C" }}>
                <WhatsAppIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">WhatsApp Us</div>
                <div className="text-xs text-muted-foreground">+254 711 669 113</div>
              </div>
            </a>
            <a
              href="tel:+254711669113"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-primary/5 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Call Us</div>
                <div className="text-xs text-muted-foreground">+254 711 669 113</div>
              </div>
            </a>
            <a
              href="mailto:info@creativedivineconcepts.com"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-primary/5 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Email Us</div>
                <div className="text-xs text-muted-foreground">info@creativedivineconcepts.com</div>
              </div>
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Visit Us</div>
                <div className="text-xs text-muted-foreground">Githunguri Ndumberi, Kiambu</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp button - exact spec:
          - Perfect circle ~64px
          - Soft white/light grey background (#f5f5f5)
          - Subtle drop shadow
          - WhatsApp icon in outline style, warm orange (#E8820C)
          - Notification badge: solid orange dot, no number, white ring
      */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full transition-all hover:scale-110"
        style={{
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(232, 130, 12, 0.08)",
        }}
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {expanded ? (
          <X className="h-6 w-6" style={{ color: "#E8820C" }} />
        ) : (
          <span style={{ color: "#E8820C" }}>
            <WhatsAppIcon className="h-9 w-9" />
          </span>
        )}
        <span
          className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full"
          style={{
            backgroundColor: "#E8820C",
            border: "2px solid #f5f5f5",
          }}
        />
      </button>
    </>
  );
}
