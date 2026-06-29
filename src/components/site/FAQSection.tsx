"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is DTF printing and how does it differ from DTG?",
    a: "DTF (Direct-to-Film) printing involves printing your design onto a special film, then transferring it to the garment using heat and pressure. DTG (Direct-to-Garment) prints directly onto the fabric. DTF is better for vibrant colors, works on any fabric color, and is more durable. DTG is ideal for cotton garments with soft-hand feel. We offer both services at Creative Divine Concepts in Kenya.",
  },
  {
    q: "How much does T-shirt printing cost in Kenya?",
    a: "T-shirt printing costs in Kenya vary based on quantity, design complexity, and printing method. DTF transfers start from KES 500 per print, while full custom T-shirts (design + print) range from KES 1,000-1,500. Bulk orders get significant discounts. Contact us at +254 711 669 113 for a custom quote tailored to your project.",
  },
  {
    q: "Do you offer custom gang sheet building for DTF printing?",
    a: "Yes! Our free online Canvas Designer tool lets you build gang sheets up to 22×120 inches. You can drag, drop, rotate, and arrange multiple designs on a single sheet for efficient printing. Export at 300 DPI for print-ready files. This is perfect for T-shirt printing businesses looking to minimize waste.",
  },
  {
    q: "Can I use your design tools for free?",
    a: "Absolutely! All 19 of our browser-based design tools are free to use. No sign-up required. This includes Canvas Designer, Image Clipper (background removal), Vectorizer, Mockup Generator, Effects Studio, AI Design Gen, 3D Mannequin Dress-Up, and more. Tools run 100% in your browser, so your images are never uploaded to a server.",
  },
  {
    q: "Do you serve clients outside Kenya?",
    a: "Yes! While we're based in Githunguri Ndumberi, Kiambu, Kenya, we serve clients across East Africa and the diaspora. We help diaspora founders build and manage their Kenya business remotely, from branding and web design to T-shirt printing and marketing. We execute locally while you manage remotely.",
  },
  {
    q: "What file formats do you accept for T-shirt printing?",
    a: "We accept PNG (with transparency), JPG, SVG, and PDF formats. For best results, use PNG with transparent background at 300 DPI. If your image has a background, use our free Image Clipper tool to remove it instantly. For vector designs, SVG is preferred as it scales without quality loss.",
  },
  {
    q: "How long does it take to complete a project?",
    a: "Timeline depends on the project scope: T-shirt printing (1-3 days for small orders, 1-2 weeks for bulk), Web design (4-8 weeks), Branding (2-4 weeks). We provide transparent reporting and real-time communication throughout. Rush orders are available for urgent projects.",
  },
  {
    q: "Do you offer web design and development services?",
    a: "Yes! We build professional websites, eCommerce stores, and custom web applications using modern technologies like Next.js, React, and TypeScript. Our web design services include SEO optimization, mobile responsiveness, and fast loading speeds. We also build AI-assisted tools for businesses.",
  },
  {
    q: "Can you help me start a T-shirt printing business in Kenya?",
    a: "Yes! We sell printing machines and provide ongoing support as your partner. We also offer training through Creative Academy. Learn full-stack development, graphic design, and digital marketing. Our team helps with business setup, branding, equipment selection, and operational workflows.",
  },
  {
    q: "What areas in Kenya do you serve?",
    a: "We're based in Kiambu County and serve clients in Nairobi, Kiambu, Thika, Ruiru, and throughout Kenya. We also work with diaspora clients remotely. Our studio is open Monday-Friday 8am-6pm and Saturday 9am-4pm. Visit us at Githunguri Ndumberi or contact us via WhatsApp at +254 711 669 113.",
  },
];

// FAQ structured data for Google rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16 bg-background relative px-4" aria-label="Frequently Asked Questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary">FAQ</p>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2 text-foreground">
            Frequently Asked <span className="text-gradient-cyan">Questions</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Everything you need to know about T-shirt printing, DTF/DTG, web design, and our services in Kenya.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="nura-card overflow-hidden"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-display font-semibold text-sm text-foreground" itemProp="name">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div
                  className="px-4 pb-4 text-sm text-muted-foreground"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="https://wa.me/+254711669113"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-btn-filled h-12 px-8 inline-flex"
          >
            Chat on WhatsApp <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
          </a>
        </div>
      </div>
    </section>
  );
}
