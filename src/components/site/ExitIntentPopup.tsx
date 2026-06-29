"use client";

import { useEffect, useState } from "react";
import { X, Gift, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    if (sessionStorage.getItem("exitPopupShown")) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem("exitPopupShown", "true");
        setVisible(true);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    // Mobile: trigger on rapid scroll up
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScroll - 200 && current < 500) {
        sessionStorage.setItem("exitPopupShown", "true");
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
      lastScroll = current;
    };

    // Show after 30 seconds if no exit intent
    timeoutId = setTimeout(() => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        sessionStorage.setItem("exitPopupShown", "true");
        setVisible(true);
      }
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="nura-card max-w-md w-full p-8 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary mx-auto mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-center mb-2 text-foreground">
              Free Business Starter Checklist
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Get our 10-point checklist for starting a business in Kenya. Covers registration, branding, KRA, and more.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                Send Me the Checklist
              </Button>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                No thanks, I already have a plan
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/15 text-green-500 mx-auto mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-foreground">Check Your Email!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ve sent the checklist to your inbox. Also check spam folder.
            </p>
            <Button onClick={() => setVisible(false)} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
