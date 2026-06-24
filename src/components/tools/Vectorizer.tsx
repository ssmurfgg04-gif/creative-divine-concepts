"use client";

import { useCallback, useRef, useState } from "react";
import { PenTool, Upload, Download, Loader2, Settings2 } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fileToDataURL, loadImage, downloadDataURL } from "@/lib/canvas-utils";

interface VectorizerProps {
  onBack: () => void;
}

interface TraceSettings {
  ltres: number;
  qtres: number;
  pathomit: number;
  colorsampling: 0 | 1;
  numberofcolors: number;
  mincolorratio: number;
  colorquantcycles: number;
  blurradius: number;
  blurdelta: number;
}

const PRESETS: Record<string, Partial<TraceSettings>> = {
  logo: { ltres: 1, qtres: 1, pathomit: 8, numberofcolors: 8, blurradius: 0, blurdelta: 20 },
  photo: { ltres: 0.5, qtres: 0.5, pathomit: 4, numberofcolors: 16, blurradius: 1, blurdelta: 24 },
  sketch: { ltres: 2, qtres: 2, pathomit: 12, numberofcolors: 4, blurradius: 0, blurdelta: 16 },
  stencil: { ltres: 3, qtres: 3, pathomit: 16, numberofcolors: 2, blurradius: 2, blurdelta: 32 },
  lineart: { ltres: 0.5, qtres: 0.5, pathomit: 2, numberofcolors: 2, blurradius: 0, blurdelta: 16 },
  blueprint: { ltres: 1.5, qtres: 1.5, pathomit: 6, numberofcolors: 3, blurradius: 1, blurdelta: 18 },
  clipart: { ltres: 1, qtres: 1, pathomit: 6, numberofcolors: 12, blurradius: 0, blurdelta: 18 },
  tattoo: { ltres: 1.5, qtres: 1.5, pathomit: 4, numberofcolors: 6, blurradius: 0, blurdelta: 16 },
};

export function Vectorizer({ onBack }: VectorizerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<TraceSettings>({
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 0,
    numberofcolors: 8,
    mincolorratio: 0,
    colorquantcycles: 3,
    blurradius: 0,
    blurdelta: 20,
  });
  const [preset, setPreset] = useState<string>("logo");
  const [view, setView] = useState<"side" | "svg">("side");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    imageRef.current = img;
    setImageUrl(url);
    setSvgUrl(null);
  }, []);

  const trace = useCallback(async () => {
    if (!imageRef.current) return;
    setLoading(true);
    try {
      // Use setTimeout to let UI update before heavy sync work
      await new Promise((r) => setTimeout(r, 50));
      const ImageTracer = (await import("imagetracerjs")).default;
      const img = imageRef.current;

      // Downscale very large images for performance
      const maxDim = 1000;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);

      const svg = ImageTracer.imagedataToSVG(imageData, {
        ...settings,
        linefilter: { threshold: 0.01, repeat: 1 },
        scale: 1,
        roundcoords: 1,
        viewbox: true,
      });

      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      setSvgUrl(url);
      toast.success(`Vectorized! ${w}×${h}px → ${settings.numberofcolors} colors`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Vectorization failed");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const applyPreset = (name: string) => {
    setPreset(name);
    const p = PRESETS[name];
    if (p) {
      setSettings((s) => ({ ...s, ...p } as TraceSettings));
      toast.info(`Applied "${name}" preset`);
    }
  };

  const downloadSvg = () => {
    if (!svgUrl) return;
    fetch(svgUrl)
      .then((r) => r.blob())
      .then((b) => {
        const url = URL.createObjectURL(b);
        downloadDataURL(url, `cdc-vector-${Date.now()}.svg`);
      });
    toast.success("Downloaded SVG!");
  };

  const update = (key: keyof TraceSettings, value: number) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <ToolLayout
      title="Vectorizer"
      tagline="Convert raster images to scalable SVG vectors"
      icon={<PenTool className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <>
          {svgUrl && (
            <div className="flex items-center gap-1 rounded-md border border-border bg-card/40 p-1">
              <Button
                size="sm"
                variant={view === "side" ? "secondary" : "ghost"}
                onClick={() => setView("side")}
              >
                Side-by-side
              </Button>
              <Button
                size="sm"
                variant={view === "svg" ? "secondary" : "ghost"}
                onClick={() => setView("svg")}
              >
                SVG only
              </Button>
            </div>
          )}
          <Button
            onClick={downloadSvg}
            disabled={!svgUrl}
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> SVG
          </Button>
        </>
      }
      sidebar={
        <>
          <ToolSection title="Upload Image">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
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
            <p className="mt-2 text-xs text-muted-foreground">
              PNG, JPG, WebP → SVG. Great for logos, die-cuts, and screen print separations.
            </p>
          </ToolSection>

          {imageUrl && (
            <>
              <ToolSection title="Preset">
                <Select value={preset} onValueChange={applyPreset}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">Logo (clean, 8 colors)</SelectItem>
                    <SelectItem value="photo">Photo (detailed, 16 colors)</SelectItem>
                    <SelectItem value="sketch">Sketch (4 colors)</SelectItem>
                    <SelectItem value="stencil">Stencil (2 colors)</SelectItem>
                    <SelectItem value="lineart">Line Art (technical drawing)</SelectItem>
                    <SelectItem value="blueprint">Blueprint (3 colors)</SelectItem>
                    <SelectItem value="clipart">Clipart (12 colors)</SelectItem>
                    <SelectItem value="tattoo">Tattoo Flash (6 colors)</SelectItem>
                  </SelectContent>
                </Select>
              </ToolSection>

              <ToolSection title="Trace Settings">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Colors</Label>
                      <span className="text-xs text-muted-foreground">{settings.numberofcolors}</span>
                    </div>
                    <Slider
                      value={[settings.numberofcolors]}
                      min={2}
                      max={32}
                      onValueChange={(v) => update("numberofcolors", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Path detail (curve)</Label>
                      <span className="text-xs text-muted-foreground">{settings.qtres}</span>
                    </div>
                    <Slider
                      value={[settings.qtres]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => update("qtres", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Path detail (line)</Label>
                      <span className="text-xs text-muted-foreground">{settings.ltres}</span>
                    </div>
                    <Slider
                      value={[settings.ltres]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => update("ltres", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Noise reduction</Label>
                      <span className="text-xs text-muted-foreground">{settings.pathomit}</span>
                    </div>
                    <Slider
                      value={[settings.pathomit]}
                      min={0}
                      max={20}
                      onValueChange={(v) => update("pathomit", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Blur (smooth)</Label>
                      <span className="text-xs text-muted-foreground">{settings.blurradius}</span>
                    </div>
                    <Slider
                      value={[settings.blurradius]}
                      min={0}
                      max={5}
                      onValueChange={(v) => update("blurradius", v[0])}
                    />
                  </div>
                </div>
              </ToolSection>

              <Button
                onClick={trace}
                disabled={loading}
                className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
                {loading ? "Tracing…" : "Trace to Vector"}
              </Button>
            </>
          )}

          <ToolSection title="Tips" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Fewer colors = cleaner SVG, smaller file</li>
              <li>• Higher detail = more curves, larger file</li>
              <li>• Use Blur to smooth noisy/jpg images</li>
              <li>• Best results: clean PNG logos on white</li>
            </ul>
          </ToolSection>
        </>
      }
    >
      {!imageUrl ? (
        <EmptyState
          icon={<PenTool className="h-8 w-8" />}
          title="Raster → Vector"
          description="Convert PNG/JPG artwork into scalable SVG with full color support. Perfect for logos, die-cut contours, and screen print separations. Adjust detail and color count for clean output."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" /> Upload Image
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className={`grid h-full max-h-full w-full max-w-6xl gap-4 ${view === "side" ? "md:grid-cols-2" : "grid-cols-1"}`}>
            {view === "side" && (
              <div className="flex flex-col">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original
                </div>
                <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                  {imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imageUrl} alt="Original" className="absolute inset-0 h-full w-full object-contain p-2" />
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vector (SVG)
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {svgUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={svgUrl} alt="Vector" className="absolute inset-0 h-full w-full object-contain p-2" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    {loading ? (
                      <>
                        <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm">Tracing paths…</p>
                      </>
                    ) : (
                      <p className="text-sm">Click “Trace to Vector” to generate SVG</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
