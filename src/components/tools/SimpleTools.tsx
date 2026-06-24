"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator, Maximize2, Palette, MessageSquare, Upload, Download, RefreshCw, Copy, Loader2 } from "lucide-react";
import { ToolLayout, ToolSection } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fileToDataURL, loadImage, canvasToBlob, downloadBlob, rgbToHex, hexToRgb, hslToRgb, rgbToHsl } from "@/lib/canvas-utils";

/* ============== VAT Calculator ============== */

interface VATCalculatorProps {
  onBack: () => void;
}

export function VATCalculator({ onBack }: VATCalculatorProps) {
  const [amount, setAmount] = useState(1000);
  const [vatRate, setVatRate] = useState(16);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const vatAmount = mode === "add"
    ? amount * (vatRate / 100)
    : amount - amount / (1 + vatRate / 100);
  const total = mode === "add" ? amount + vatAmount : amount;
  const net = mode === "add" ? amount : amount - vatAmount;

  return (
    <ToolLayout
      title="VAT Calculator"
      tagline="Kenya 16% VAT — add or remove instantly"
      icon={<Calculator className="h-5 w-5" />}
      onBack={onBack}
      sidebar={
        <>
          <ToolSection title="Calculation">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Amount (KES)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">VAT Rate (%)</Label>
                <Input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={mode === "add" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setMode("add")}
                >
                  Add VAT
                </Button>
                <Button
                  variant={mode === "remove" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setMode("remove")}
                >
                  Remove VAT
                </Button>
              </div>
            </div>
          </ToolSection>
          <ToolSection title="About Kenya VAT" defaultOpen={false}>
            <p className="text-xs text-muted-foreground">
              The standard VAT rate in Kenya is 16% (reduced from 14% in 2020). Some goods are zero-rated or exempt. Always confirm current rates with KRA.
            </p>
          </ToolSection>
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {mode === "add" ? "Net Amount" : "Gross Amount (incl. VAT)"}
              </p>
              <p className="font-display text-3xl font-bold text-accent">
                KES {amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT ({vatRate}%)</span>
                <span className="font-semibold">
                  KES {vatAmount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {mode === "add" ? "Total (incl. VAT)" : "Net (excl. VAT)"}
                </span>
                <span className="font-semibold text-accent">
                  KES {(mode === "add" ? total : net).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              navigator.clipboard.writeText(`${vatAmount.toFixed(2)}`);
              toast.success("VAT amount copied");
            }}
          >
            <Copy className="h-4 w-4" /> Copy VAT Amount
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}

/* ============== Image Resizer ============== */

interface ImageResizerProps {
  onBack: () => void;
}

const RESIZE_PRESETS = [
  { label: "Instagram Square", w: 1080, h: 1080 },
  { label: "Instagram Portrait", w: 1080, h: 1350 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Facebook Cover", w: 1640, h: 624 },
  { label: "Facebook Post", w: 1200, h: 630 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "Twitter Post", w: 1200, h: 675 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "T-shirt Print (14×16 @300)", w: 4200, h: 4800 },
  { label: "DTF Sheet (22×12 @300)", w: 6600, h: 3600 },
  { label: "A4 Print", w: 2480, h: 3508 },
  { label: "Business Card", w: 1050, h: 600 },
];

export function ImageResizer({ onBack }: ImageResizerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [targetW, setTargetW] = useState(1080);
  const [targetH, setTargetH] = useState(1080);
  const [keepAspect, setKeepAspect] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    imageRef.current = img;
    setImageUrl(url);
    setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    setResultUrl(null);
  };

  const resize = async () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    let w = targetW;
    let h = targetH;
    if (keepAspect) {
      const ar = img.naturalWidth / img.naturalHeight;
      if (targetW / targetH > ar) {
        w = Math.round(targetH * ar);
      } else {
        h = Math.round(targetW / ar);
      }
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await canvasToBlob(canvas, "image/png");
    const url = URL.createObjectURL(blob);
    setResultUrl(url);
    toast.success(`Resized to ${w}×${h}px`);
  };

  const download = async () => {
    if (!resultUrl) return;
    const res = await fetch(resultUrl);
    const blob = await res.blob();
    downloadBlob(blob, `cdc-resized-${targetW}x${targetH}.png`);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Image Resizer"
      tagline="Resize for any platform or print spec"
      icon={<Maximize2 className="h-5 w-5" />}
      onBack={onBack}
      headerActions={
        <Button onClick={download} disabled={!resultUrl} className="gap-2 bg-accent text-white hover:bg-accent/90">
          <Download className="h-4 w-4" /> Download
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Upload Image">
            <Button
              variant="outline"
              className="w-full gap-2 border-accent/40 hover:bg-accent/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            {imageUrl && (
              <p className="mt-2 text-xs text-muted-foreground">
                Source: {originalDims.w}×{originalDims.h}px
              </p>
            )}
          </ToolSection>

          {imageUrl && (
            <>
              <ToolSection title="Target Size">
                <div className="space-y-3">
                  <Select
                    onValueChange={(v) => {
                      const p = RESIZE_PRESETS.find((p) => p.label === v);
                      if (p) {
                        setTargetW(p.w);
                        setTargetH(p.h);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESIZE_PRESETS.map((p) => (
                        <SelectItem key={p.label} value={p.label}>
                          {p.label} ({p.w}×{p.h})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Width (px)</Label>
                      <Input type="number" value={targetW} onChange={(e) => setTargetW(Number(e.target.value))} />
                    </div>
                    <div>
                      <Label className="text-xs">Height (px)</Label>
                      <Input type="number" value={targetH} onChange={(e) => setTargetH(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Keep aspect ratio</Label>
                    <button
                      onClick={() => setKeepAspect(!keepAspect)}
                      className={`relative h-5 w-10 rounded-full transition ${keepAspect ? "bg-accent" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${keepAspect ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                  <Button onClick={resize} className="w-full bg-accent text-white hover:bg-accent/90">
                    Resize
                  </Button>
                </div>
              </ToolSection>
            </>
          )}
        </>
      }
    >
      {!imageUrl ? (
        <div className="flex h-full items-center justify-center p-8 text-center">
          <div>
            <Maximize2 className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h3 className="mb-2 font-display text-xl font-bold">Resize images for any platform</h3>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              Instagram, Facebook, Twitter, YouTube, print specs — pick a preset or enter custom dimensions.
            </p>
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2 bg-accent text-white hover:bg-accent/90">
              <Upload className="h-4 w-4" /> Upload Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="grid h-full max-h-full w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Original ({originalDims.w}×{originalDims.h})
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt="Original" className="absolute inset-0 h-full w-full object-contain p-2" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resized ({targetW}×{targetH})
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {resultUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={resultUrl} alt="Resized" className="absolute inset-0 h-full w-full object-contain p-2" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

/* ============== Color Palette Generator ============== */

interface ColorPaletteProps {
  onBack: () => void;
}

const HARMONIES = [
  { id: "complementary", name: "Complementary" },
  { id: "analogous", name: "Analogous" },
  { id: "triadic", name: "Triadic" },
  { id: "tetradic", name: "Tetradic" },
  { id: "monochromatic", name: "Monochromatic" },
  { id: "split-complementary", name: "Split Complementary" },
];

export function ColorPalette({ onBack }: ColorPaletteProps) {
  const [baseHue, setBaseHue] = useState(20);
  const [harmony, setHarmony] = useState("complementary");
  const [palette, setPalette] = useState<string[]>([]);

  const generate = () => {
    const [r, g, b] = hslToRgb(baseHue, 70, 50);
    const base = rgbToHex(r, g, b);
    const colors: string[] = [base];
    const offsets: Record<string, number[]> = {
      complementary: [180],
      analogous: [-30, 30],
      triadic: [120, 240],
      tetradic: [90, 180, 270],
      monochromatic: [],
      "split-complementary": [150, 210],
    };
    const offs = offsets[harmony] || [];
    offs.forEach((off) => {
      const h = (baseHue + off + 360) % 360;
      const [r2, g2, b2] = hslToRgb(h, 70, 50);
      colors.push(rgbToHex(r2, g2, b2));
    });
    if (harmony === "monochromatic") {
      [20, 35, 65, 80].forEach((l) => {
        const [r2, g2, b2] = hslToRgb(baseHue, 70, l);
        colors.push(rgbToHex(r2, g2, b2));
      });
    } else {
      // Add light/dark variants
      colors.forEach((c) => {
        const [hr, hg, hb] = hexToRgb(c);
        const [h, s, l] = rgbToHsl(hr, hg, hb);
        const [lr, lg, lb] = hslToRgb(h, s, Math.min(95, l + 30));
        colors.push(rgbToHex(lr, lg, lb));
      });
    }
    setPalette(colors.slice(0, 6));
  };

  // Generate on mount and when inputs change
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseHue, harmony]);

  return (
    <ToolLayout
      title="Color Palette"
      tagline="Generate harmonious brand color schemes"
      icon={<Palette className="h-5 w-5" />}
      onBack={onBack}
      sidebar={
        <>
          <ToolSection title="Base Color">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Hue</Label>
                  <span className="text-xs text-muted-foreground">{baseHue}°</span>
                </div>
                <Slider value={[baseHue]} min={0} max={360} onValueChange={(v) => setBaseHue(v[0])} />
              </div>
              <div
                className="h-12 w-full rounded-md border border-border"
                style={{ backgroundColor: rgbToHex(...hslToRgb(baseHue, 70, 50)) }}
              />
            </div>
          </ToolSection>
          <ToolSection title="Harmony Rule">
            <Select value={harmony} onValueChange={setHarmony}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HARMONIES.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ToolSection>
          <Button onClick={generate} className="w-full gap-2 bg-accent text-white hover:bg-accent/90">
            <RefreshCw className="h-4 w-4" /> Generate Palette
          </Button>
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {palette.map((color, i) => {
              const [r, g, b] = hexToRgb(color);
              const [h, s, l] = rgbToHsl(r, g, b);
              return (
                <button
                  key={i}
                  onClick={() => {
                    navigator.clipboard.writeText(color);
                    toast.success(`Copied ${color}`);
                  }}
                  className="group overflow-hidden rounded-lg border border-border transition hover:border-accent"
                >
                  <div className="h-32 w-full" style={{ backgroundColor: color }} />
                  <div className="bg-card p-2 text-left">
                    <p className="font-mono text-xs font-semibold uppercase">{color}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      HSL {Math.round(h)}° {Math.round(s)}% {Math.round(l)}%
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Click any color to copy its hex code
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}

/* ============== Caption Generator ============== */

interface CaptionGenProps {
  onBack: () => void;
}

const PLATFORMS = [
  { id: "instagram", name: "Instagram" },
  { id: "twitter", name: "Twitter/X" },
  { id: "facebook", name: "Facebook" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "tiktok", name: "TikTok" },
];

export function CaptionGen({ onBack }: CaptionGenProps) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("engaging");
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setLoading(true);
    setCaptions([]);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const data = await res.json();
      setCaptions(data.captions);
      toast.success("Captions generated!");
    } catch (err: any) {
      toast.error(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Caption Gen"
      tagline="AI social media caption writer"
      icon={<MessageSquare className="h-5 w-5" />}
      badge="ai"
      onBack={onBack}
      sidebar={
        <>
          <ToolSection title="Topic">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What's your post about? E.g. New T-shirt drop, customer success story, behind-the-scenes..."
              className="min-h-[100px] resize-none"
            />
          </ToolSection>
          <ToolSection title="Platform">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ToolSection>
          <ToolSection title="Tone">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="salesy">Sales-driven</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </ToolSection>
          <Button
            onClick={generate}
            disabled={loading || !topic.trim()}
            className="w-full gap-2 bg-accent text-white hover:bg-accent/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate Captions"}
          </Button>
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-4">
          {captions.length === 0 ? (
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 font-display text-xl font-bold">Generate social captions</h3>
              <p className="text-sm text-muted-foreground">
                Describe your post, pick a platform and tone, and get 3 ready-to-post caption options powered by free AI.
              </p>
            </div>
          ) : (
            captions.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Option {i + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(c);
                      toast.success("Copied!");
                    }}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm">{c}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
