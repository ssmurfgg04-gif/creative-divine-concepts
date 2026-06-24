"use client";

import { Mail, Phone, MapPin, Twitter, Linkedin, MessageCircle } from "lucide-react";

interface FooterProps {
  onNavigate: (view: any) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="Creative Divine Concepts" className="h-12 w-auto rounded-2xl" />
            <p className="text-sm text-muted-foreground">
              Design, Build &amp; Scale Businesses From Anywhere. Your partner in business architecture &amp; growth.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Branding</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Web Design</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">T-Shirt Printing</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">DTF / DTG Printing</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Marketing</button></li>
              <li><button onClick={() => onNavigate("academy")} className="hover:text-foreground text-primary font-semibold">Creative Academy</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">All Tools</button></li>
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">Canvas Designer</button></li>
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">Image Clipper</button></li>
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">Mockup Generator</button></li>
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">Effects Studio</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@creativedivineconcepts.com" className="hover:text-foreground">info@creativedivineconcepts.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+254711669113" className="hover:text-foreground">+254 711 669 113</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/254711669113" target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp Support</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Githunguri Ndumberi, Kiambu, Kenya</span>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a href="https://twitter.com/divineconcepts" target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/divineconcepts" target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Creative Divine Concepts Ltd. All rights reserved.</p>
          <p>Built in Kenya. Serving the World.</p>
        </div>
      </div>
    </footer>
  );
}
