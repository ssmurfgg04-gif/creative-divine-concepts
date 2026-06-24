"use client";

import { useState } from "react";
import { Wand2, Sparkles, Download, Loader2, RefreshCw, Image as ImageIcon, Lightbulb } from "lucide-react";
import * as Icons from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { downloadDataURL } from "@/lib/canvas-utils";

interface AIDesignGenProps {
  onBack: () => void;
}

const SIZES = [
  { label: "Square 1024×1024", value: "1024x1024" },
  { label: "Portrait 768×1344", value: "768x1344" },
  { label: "Portrait 864×1152", value: "864x1152" },
  { label: "Landscape 1344×768", value: "1344x768" },
  { label: "Landscape 1152×864", value: "1152x864" },
  { label: "Wide 1440×720", value: "1440x720" },
  { label: "Tall 720×1440", value: "720x1440" },
];

const STYLES = [
  "Bold graffiti streetwear",
  "Minimal line art, single color",
  "Vintage distressed",
  "Retro 80s neon synthwave",
  "Watercolor illustration",
  "Mandala / sacred geometry",
  "Tribal pattern",
  "Anime / manga style",
  "Vintage typography poster",
  "Nature / botanical illustration",
  "Skull and roses tattoo flash",
  "Geometric low-poly",
  "Kawaii cute cartoon",
  "Cyberpunk futuristic",
  "Hand-drawn sketch",
  "Pop art comic",
  "Saint paint religious icon",
  "African wax print (Ankara)",
  "Maasai beadwork pattern",
  "Retro 70s disco",
  "Steampunk mechanical",
  "Vintage sports mascot",
  "Stained glass religious",
  "Embroidery patch",
];

const PROMPT_IDEAS = [
  "Lion head emblem with crown, gold and black",
  "Mountain range sunset with eagle silhouette",
  "Retro basketball player dunking, 90s style",
  "Cosmic galaxy cat with stars",
  "Skull with roses, traditional tattoo style",
  "Coffee cup with steam, minimalist line art",
  "African savanna sunset with acacia tree",
  "Cyberpunk city neon skyline",
  "Proud Kenyan flag colors emblem",
  "Vintage motorcycle with wings",
  "Eagle with spread wings, patriotic",
  "Pizza slice character, kawaii",
  "80s retro fitness gym logo",
  "Mystic wolf howling at moon",
  "Safari jeep silhouette in savanna",
  "Coffee bean with heartbeat line",
  "Mountain bike in motion",
  "DJ turntable with music notes",
  "Phoenix rising from flames",
  "Vintage camera with film strip",
];

export function AIDesignGen({ onBack }: AIDesignGenProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [size, setSize] = useState(SIZES[0].value);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    setSelected(null);
    try {
      const fullPrompt = style ? `${prompt}. Style: ${style}` : prompt;
      const res = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, size }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const data = await res.json();
      setResults((prev) => [data.image, ...prev].slice(0, 8));
      setSelected(data.image);
      toast.success("Design generated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const download = (url: string) => {
    downloadDataURL(url, `cdc-ai-design-${Date.now()}.png`);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="AI Design Gen"
      tagline="Generate T-shirt designs from text — free AI"
      icon={<Wand2 className="h-5 w-5" />}
      badge="ai"
      onBack={onBack}
      headerActions={
        selected && (
          <Button
            onClick={() => download(selected)}
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        )
      }
      sidebar={
        <>
          <ToolSection title="Prompt">
            <div className="space-y-3">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the design you want to create…"
                className="min-h-[100px] resize-none"
              />
              <div>
                <Label className="text-xs">Style preset (optional)</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Output size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating…" : "Generate Design"}
              </Button>
            </div>
          </ToolSection>

          <ToolSection title="Prompt Ideas" defaultOpen={false}>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  const randomPrompt = PROMPT_IDEAS[Math.floor(Math.random() * PROMPT_IDEAS.length)];
                  const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
                  setPrompt(randomPrompt);
                  setStyle(randomStyle);
                  toast.info("Random prompt + style applied!");
                }}
                className="flex w-full items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-2 text-left text-xs font-semibold text-primary hover:bg-primary/20 transition mb-2"
              >
                <Icons.Shuffle className="h-3.5 w-3.5 shrink-0" />
                <span>Surprise Me! (Random prompt + style)</span>
              </button>
              {PROMPT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  className="flex w-full items-start gap-2 rounded-md border border-border/50 bg-background/30 px-2.5 py-1.5 text-left text-xs hover:border-primary/40 hover:bg-primary/5"
                >
                  <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <span>{idea}</span>
                </button>
              ))}
            </div>
          </ToolSection>

          <ToolSection title="About" defaultOpen={false}>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Uses free z-ai-web-dev-sdk image generation. No API keys, no per-image fees.
              </p>
              <p>
                Generated images are <span className="text-foreground">starting points</span> —
                use Canvas Designer or Effects Studio to refine for print.
              </p>
              <p className="text-primary">
                For color-accurate prints, combine with hand-picked color palettes.
              </p>
            </div>
          </ToolSection>
        </>
      }
    >
      {!selected && results.length === 0 ? (
        <EmptyState
          icon={<Wand2 className="h-8 w-8" />}
          title="Generate T-shirt designs from text"
          description="Type what you want, pick a style, and let free AI generate print-ready artwork. Perfect for non-designers who need a quick starting point. Combine with Canvas Designer for final layouts."
          action={
            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating…" : "Generate"}
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full flex-col">
          {/* Main preview */}
          <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
            {loading && !selected ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating design… (~10-20s)</p>
              </div>
            ) : selected ? (
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected}
                  alt="Generated design"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1.5"
                    onClick={generate}
                    disabled={loading}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          {/* History strip */}
          {results.length > 0 && (
            <div className="h-28 shrink-0 border-t border-border bg-card/30 p-2">
              <div className="flex h-full gap-2 overflow-x-auto scrollbar-thin">
                {results.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(url)}
                    className={`relative h-full aspect-square shrink-0 overflow-hidden rounded-md border-2 transition ${
                      selected === url ? "border-primary box-glow" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Result ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
