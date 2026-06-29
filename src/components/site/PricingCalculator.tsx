"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PricingCalculatorProps {
  onNavigate: (view: any) => void;
}

export function PricingCalculator({ onNavigate }: PricingCalculatorProps) {
  const [activeTab, setActiveTab] = useState<"tshirt" | "web" | "branding">("tshirt");

  // T-Shirt state
  const [quantity, setQuantity] = useState(50);
  const [complexity, setComplexity] = useState<"simple" | "standard" | "complex">("standard");
  const [garment, setGarment] = useState<"tshirt" | "hoodie" | "polo" | "tote">("tshirt");
  const [printLocation, setPrintLocation] = useState<"front" | "frontback" | "sleeve">("front");

  // Web design state
  const [pages, setPages] = useState(5);
  const [ecommerce, setEcommerce] = useState(false);
  const [mpesa, setMpesa] = useState(false);
  const [blog, setBlog] = useState(false);
  const [seo, setSeo] = useState(true);
  const [designLevel, setDesignLevel] = useState<"template" | "custom" | "premium">("custom");

  // Branding state
  const [brandPackage, setBrandPackage] = useState<"logo" | "identity" | "full">("identity");

  // T-Shirt pricing calculation
  const tshirtBasePrice = {
    tshirt: 500,
    hoodie: 800,
    polo: 650,
    tote: 400,
  };
  const complexityMultiplier = { simple: 1, standard: 1.3, complex: 1.6 };
  const locationMultiplier = { front: 1, frontback: 1.5, sleeve: 1.2 };
  const volumeDiscount = quantity >= 100 ? 0.75 : quantity >= 50 ? 0.85 : quantity >= 20 ? 0.9 : 1;

  const tshirtUnitPrice = Math.round(
    tshirtBasePrice[garment] * complexityMultiplier[complexity] * locationMultiplier[printLocation] * volumeDiscount
  );
  const tshirtTotal = tshirtUnitPrice * quantity;

  // Web design pricing
  const webBasePrice = { template: 25000, custom: 45000, premium: 80000 };
  const featurePrices = { ecommerce: 30000, mpesa: 10000, blog: 8000, seo: 15000 };
  const webTotal = webBasePrice[designLevel] +
    (ecommerce ? featurePrices.ecommerce : 0) +
    (mpesa ? featurePrices.mpesa : 0) +
    (blog ? featurePrices.blog : 0) +
    (seo ? featurePrices.seo : 0) +
    (pages > 5 ? (pages - 5) * 3000 : 0);

  // Branding pricing
  const brandingPrices = {
    logo: 15000,
    identity: 35000,
    full: 75000,
  };
  const brandingTotal = brandingPrices[brandPackage];

  const formatKES = (amount: number) => `KES ${amount.toLocaleString("en-KE")}`;

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className="flex gap-2 p-1 rounded-lg border border-border bg-card/30">
        {[
          { id: "tshirt" as const, label: "T-Shirt Printing", icon: "Shirt" },
          { id: "web" as const, label: "Web Design", icon: "Code2" },
          { id: "branding" as const, label: "Branding", icon: "Palette" },
        ].map((tab) => {
          const Icon = (Icons as any)[tab.icon];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* T-Shirt Calculator */}
      {activeTab === "tshirt" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Quantity</Label>
                <span className="text-xs text-primary font-semibold">{quantity} pieces</span>
              </div>
              <Slider value={[quantity]} min={1} max={500} onValueChange={(v) => setQuantity(v[0])} />
              {quantity >= 50 && (
                <p className="text-[10px] text-green-500 font-semibold">
                  {quantity >= 100 ? "25% bulk discount applied!" : "15% bulk discount applied!"}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Garment Type</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "tshirt" as const, label: "T-Shirt" },
                  { id: "hoodie" as const, label: "Hoodie" },
                  { id: "polo" as const, label: "Polo" },
                  { id: "tote" as const, label: "Tote" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGarment(g.id)}
                    className={`text-xs py-2 rounded-md border transition ${
                      garment === g.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Design Complexity</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "simple" as const, label: "Simple (1 color)" },
                  { id: "standard" as const, label: "Standard (2-4)" },
                  { id: "complex" as const, label: "Complex (5+)" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setComplexity(c.id)}
                    className={`text-xs py-2 rounded-md border transition ${
                      complexity === c.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Print Location</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "front" as const, label: "Front Only" },
                  { id: "frontback" as const, label: "Front + Back" },
                  { id: "sleeve" as const, label: "Sleeve" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPrintLocation(p.id)}
                    className={`text-xs py-2 rounded-md border transition ${
                      printLocation === p.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="nura-card p-6 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Estimated Price</p>
            <div className="font-display text-4xl font-bold text-primary mb-1">
              {formatKES(tshirtUnitPrice)}
              <span className="text-sm text-muted-foreground font-normal"> /unit</span>
            </div>
            <div className="text-lg font-semibold text-foreground mb-4">
              Total: {formatKES(tshirtTotal)}
            </div>
            <a
              href={`https://wa.me/+254711669113?text=Hi!%20I%20want%20to%20order%20${quantity}%20${garment}%20with%20${complexity}%20design,%20${printLocation}%20print.%20Estimated:%20${tshirtTotal}%20KES`}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-filled h-12 px-6 text-center"
            >
              Get Exact Quote on WhatsApp
            </a>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Final price may vary based on artwork and fabric
            </p>
          </div>
        </div>
      )}

      {/* Web Design Calculator */}
      {activeTab === "web" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Number of Pages</Label>
                <span className="text-xs text-primary font-semibold">{pages} pages</span>
              </div>
              <Slider value={[pages]} min={1} max={30} onValueChange={(v) => setPages(v[0])} />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Design Level</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "template" as const, label: "Template", price: "KES 25K+" },
                  { id: "custom" as const, label: "Custom", price: "KES 45K+" },
                  { id: "premium" as const, label: "Premium", price: "KES 80K+" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDesignLevel(d.id)}
                    className={`text-xs py-2 rounded-md border transition ${
                      designLevel === d.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {d.label}<br/><span className="text-[10px] text-muted-foreground">{d.price}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "E-Commerce / Online Store", state: ecommerce, set: setEcommerce, price: "+30K" },
                { label: "M-PESA Payment Integration", state: mpesa, set: setMpesa, price: "+10K" },
                { label: "Blog / News Section", state: blog, set: setBlog, price: "+8K" },
                { label: "SEO Optimization", state: seo, set: setSeo, price: "+15K" },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center justify-between py-1">
                  <Label className="text-xs">{feat.label} <span className="text-muted-foreground">({feat.price})</span></Label>
                  <Switch checked={feat.state} onCheckedChange={feat.set} />
                </div>
              ))}
            </div>
          </div>
          <div className="nura-card p-6 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Estimated Price</p>
            <div className="font-display text-4xl font-bold text-primary mb-4">
              {formatKES(webTotal)}
            </div>
            <Button
              onClick={() => onNavigate("contact")}
              className="cyber-btn-filled h-12"
            >
              Book Free Strategy Call
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Includes hosting setup, SSL, and 1 month free support
            </p>
          </div>
        </div>
      )}

      {/* Branding Calculator */}
      {activeTab === "branding" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-xs mb-1.5 block">Branding Package</Label>
              <div className="space-y-2">
                {[
                  { id: "logo" as const, label: "Logo Only", desc: "3 concepts + final files", price: "KES 15,000" },
                  { id: "identity" as const, label: "Logo + Brand Identity", desc: "Logo + colors + fonts + business card", price: "KES 35,000" },
                  { id: "full" as const, label: "Full Branding Package", desc: "Logo + identity + guidelines + social media kit + stationery", price: "KES 75,000" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setBrandPackage(p.id)}
                    className={`w-full text-left p-3 rounded-md border transition ${
                      brandPackage === p.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{p.label}</div>
                        <div className="text-xs text-muted-foreground">{p.desc}</div>
                      </div>
                      <div className="text-sm font-bold text-primary">{p.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="nura-card p-6 flex flex-col justify-center">
            <p className="text-xs text-muted-foreground mb-1">Estimated Price</p>
            <div className="font-display text-4xl font-bold text-primary mb-4">
              {formatKES(brandingTotal)}
            </div>
            <Button
              onClick={() => onNavigate("contact")}
              className="cyber-btn-filled h-12"
            >
              Start Branding Project
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              2-3 week turnaround, unlimited revisions on chosen concept
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
