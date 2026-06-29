"use client";

import { Mail, Phone, MapPin, Twitter, Linkedin, MessageCircle, Facebook, Instagram, ArrowRight, Star } from "lucide-react";

interface FooterProps {
  onNavigate: (view: any) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Column 1: Services */}
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Web Design</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Branding</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">DTF / DTG Printing</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Diaspora Operations</button></li>
              <li><button onClick={() => onNavigate("services")} className="hover:text-foreground">Digital Marketing</button></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate("tools")} className="hover:text-foreground">Free Tools</button></li>
              <li><button onClick={() => onNavigate("academy")} className="hover:text-foreground">CDC Academy</button></li>
              <li><button onClick={() => onNavigate("blog")} className="hover:text-foreground">Blog</button></li>
              <li><button onClick={() => onNavigate("pricing")} className="hover:text-foreground">Pricing</button></li>
              <li><button onClick={() => onNavigate("work")} className="hover:text-foreground">Portfolio</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => onNavigate("about")} className="hover:text-foreground">About</button></li>
              <li><button onClick={() => onNavigate("work")} className="hover:text-foreground">Portfolio</button></li>
              <li><button onClick={() => onNavigate("contact")} className="hover:text-foreground">Contact</button></li>
              <li><button onClick={() => onNavigate("about")} className="hover:text-foreground">Careers</button></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@creativedivineconcepts.com" className="hover:text-foreground break-all">info@creativedivineconcepts.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+254711669113" className="hover:text-foreground">+254 711 669 113</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary shrink-0" />
                <a href="https://wa.me/+254711669113" target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp Support</a>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary shrink-0" />
                <a href="https://www.google.com/search?q=Creative+Divine+Concepts+Kiambu" target="_blank" rel="noreferrer" className="hover:text-foreground">Leave a Google Review</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Githunguri Ndumberi, Kiambu, Kenya</span>
              </li>
              <li className="flex items-center gap-3 pt-3">
                <a href="https://wa.me/+254711669113" target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="https://facebook.com/creativedivineconcepts" target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://instagram.com/creative.divine.concepts" target="_blank" rel="noreferrer" className="hover:text-primary" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
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

        {/* Google Map */}
        <div className="mt-8 rounded-xl overflow-hidden border border-border max-w-md mx-auto">
          <iframe
            src="https://maps.google.com/maps?q=Githunguri%20Ndumberi%20Kiambu%20Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Creative Divine Concepts Location"
          />
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Creative Divine Concepts Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built in Kiambu, Kenya
            <ArrowRight className="h-3 w-3" />
            Serving the World
          </p>
        </div>
      </div>
    </footer>
  );
}
