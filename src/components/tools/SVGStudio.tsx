"use client";

import { useCallback, useRef, useState } from "react";
import {
  PenTool,
  Upload,
  Download,
  Loader2,
  Eye,
  Code2,
  Palette,
  FileImage,
  FileCode,
  Layers,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  GitCompare,
  Trash2,
  Wand2,
} from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fileToDataURL, loadImage, downloadDataURL } from "@/lib/canvas-utils";

interface SVGStudioProps {
  onBack: () => void;
}

type Mode = "vectorize" | "viewer" | "color" | "convert";

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

const PRESETS: Record<string, { label: string; settings: Partial<TraceSettings>; desc: string }> = {
  logo: {
    label: "Logo",
    settings: { ltres: 1, qtres: 1, pathomit: 8, numberofcolors: 8, blurradius: 0, blurdelta: 20 },
    desc: "Clean logos with few colors",
  },
  photo: {
    label: "Photo",
    settings: { ltres: 0.5, qtres: 0.5, pathomit: 4, numberofcolors: 16, blurradius: 1, blurdelta: 24 },
    desc: "Detailed photos with many colors",
  },
  sketch: {
    label: "Sketch",
    settings: { ltres: 2, qtres: 2, pathomit: 12, numberofcolors: 4, blurradius: 0, blurdelta: 16 },
    desc: "Hand-drawn sketches",
  },
  stencil: {
    label: "Stencil",
    settings: { ltres: 3, qtres: 3, pathomit: 16, numberofcolors: 2, blurradius: 2, blurdelta: 32 },
    desc: "Cut-ready stencils (2 colors)",
  },
  lineart: {
    label: "Line Art",
    settings: { ltres: 0.5, qtres: 0.5, pathomit: 2, numberofcolors: 2, blurradius: 0, blurdelta: 16 },
    desc: "Pure black and white line art",
  },
  tattoo: {
    label: "Tattoo",
    settings: { ltres: 1.5, qtres: 1.5, pathomit: 4, numberofcolors: 6, blurradius: 0, blurdelta: 16 },
    desc: "Bold tattoo flash designs",
  },
};

// Sample SVGs for instant trial (no upload required)
const SAMPLE_SVGS: { name: string; svg: string }[] = [
  {
    name: "Logo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><circle cx="50" cy="50" r="45" fill="#f36a21"/><path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    name: "Icon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path d="M12 2 L2 22 L22 22 Z" fill="#7a1f2a" stroke="#f36a21" stroke-width="2"/><circle cx="12" cy="15" r="3" fill="#f5e9d7"/></svg>`,
  },
  {
    name: "Badge",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="#f36a21" stroke="#7a1f2a" stroke-width="3"/><text x="50" y="55" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">CDC</text></svg>`,
  },
  {
    name: "Shape",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48"><rect x="10" y="10" width="35" height="35" fill="#f36a21" rx="5"/><circle cx="70" cy="30" r="20" fill="#7a1f2a"/><polygon points="30,90 50,55 70,90" fill="#f5e9d7" stroke="#f36a21" stroke-width="2"/></svg>`,
  },
];

export function SVGStudio({ onBack }: SVGStudioProps) {
  const [mode, setMode] = useState<Mode>("vectorize");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"side" | "svg" | "compare">("side");
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  // Vectorizer settings
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

  // SVG code editor (for viewer mode)
  const [codeInput, setCodeInput] = useState<string>("");

  // Color editor
  const [svgColors, setSvgColors] = useState<string[]>([]);
  const [colorEdits, setColorEdits] = useState<Record<string, string>>({});

  // Convert settings
  const [pngScale, setPngScale] = useState(2);
  const [jsxComponentName, setJsxComponentName] = useState("MyIcon");

  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgPreviewRef = useRef<HTMLDivElement>(null);

  // ===== File handling =====
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      // SVG file - load as text
      const text = await file.text();
      setSvgContent(text);
      setCodeInput(text);
      setImageUrl(null);
      extractColors(text);
      setMode("viewer");
      toast.success("SVG loaded!");
    } else {
      // Raster image - load for vectorization
      const url = await fileToDataURL(file);
      const img = await loadImage(url);
      imageRef.current = img;
      setImageUrl(url);
      setSvgContent(null);
      setCodeInput("");
      setMode("vectorize");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ===== Load sample SVG =====
  const loadSample = (sample: { name: string; svg: string }) => {
    setSvgContent(sample.svg);
    setCodeInput(sample.svg);
    setImageUrl(null);
    extractColors(sample.svg);
    setMode("viewer");
    toast.success(`Loaded sample: ${sample.name}`);
  };

  // ===== Vectorization =====
  const trace = useCallback(async () => {
    if (!imageRef.current) return;
    setLoading(true);
    try {
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

      setSvgContent(svg);
      setCodeInput(svg);
      extractColors(svg);
      setMode("viewer");
      toast.success(`Vectorized! ${w}x${h}px to ${settings.numberofcolors} colors`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Vectorization failed");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const applyPreset = (name: string) => {
    setPreset(name);
    const p = PRESETS[name]?.settings;
    if (p) {
      setSettings((s) => ({ ...s, ...p } as TraceSettings));
      toast.info(`Applied "${name}" preset`);
    }
  };

  const update = (key: keyof TraceSettings, value: number) =>
    setSettings((s) => ({ ...s, [key]: value }));

  // ===== SVG color extraction =====
  const extractColors = (svg: string) => {
    const colorSet = new Set<string>();
    // Match fill="..." and stroke="..." with both single and double quotes
    const colorRegex = /(?:fill|stroke)=(["'])([^"']+)\1/g;
    let match;
    while ((match = colorRegex.exec(svg)) !== null) {
      const color = match[2];
      if (color && color !== "none" && color !== "transparent" && !color.startsWith("url(")) {
        colorSet.add(color);
      }
    }
    setSvgColors(Array.from(colorSet));
    setColorEdits({});
  };

  // ===== Color editing =====
  const applyColorEdit = (oldColor: string, newColor: string) => {
    if (!svgContent) return;
    const escaped = oldColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const updated = svgContent
      .replace(new RegExp(`fill="${escaped}"`, "g"), `fill="${newColor}"`)
      .replace(new RegExp(`fill='${escaped}'`, "g"), `fill='${newColor}'`)
      .replace(new RegExp(`stroke="${escaped}"`, "g"), `stroke="${newColor}"`)
      .replace(new RegExp(`stroke='${escaped}'`, "g"), `stroke='${newColor}'`);
    setSvgContent(updated);
    setCodeInput(updated);
    setColorEdits((prev) => ({ ...prev, [oldColor]: newColor }));
    extractColors(updated);
    toast.success("Color updated!");
  };

  // ===== SVG optimization (safe) =====
  const optimizeSvg = () => {
    if (!svgContent) return;
    let optimized = svgContent;
    const originalSize = new Blob([optimized]).size;

    // Remove XML comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");

    // Remove XML declaration (not needed for inline SVG)
    optimized = optimized.replace(/<\?xml[^>]*\?>/g, "");

    // Remove editor metadata (Inkscape, Illustrator, Sketch)
    optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/g, "");
    optimized = optimized.replace(/<sodipodi[\s\S]*?<\/sodipodi[^>]*>/g, "");
    optimized = optimized.replace(/<inkscape[\s\S]*?<\/inkscape[^>]*>/g, "");
    optimized = optimized.replace(/\s(?:sodipodi|inkscape):[^=]+="[^"]*"/g, "");

    // Collapse whitespace between tags (safe - doesn't affect attribute values)
    optimized = optimized.replace(/>\s+</g, "><");

    // Trim leading/trailing whitespace
    optimized = optimized.trim();

    // Remove empty groups
    optimized = optimized.replace(/<g>\s*<\/g>/g, "");

    const newSize = new Blob([optimized]).size;
    const savings = Math.round((1 - newSize / originalSize) * 100);

    setSvgContent(optimized);
    setCodeInput(optimized);
    extractColors(optimized);
    toast.success(`Optimized! ${savings}% smaller (${(originalSize / 1024).toFixed(1)} KB to ${(newSize / 1024).toFixed(1)} KB)`);
  };

  // ===== Downloads =====
  const downloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    downloadDataURL(url, `cdc-svg-${Date.now()}.svg`);
    toast.success("Downloaded SVG!");
  };

  const downloadPng = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      // Fallback to viewBox dimensions if width/height not set
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (!w || !h) {
        const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
        if (viewBoxMatch) {
          const [, , vbW, vbH] = viewBoxMatch[1].split(/\s+/).map(Number);
          w = vbW || 500;
          h = vbH || 500;
        } else {
          w = 500;
          h = 500;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w * pngScale;
      canvas.height = h * pngScale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          downloadDataURL(pngUrl, `cdc-svg-${Date.now()}.png`);
          toast.success(`Downloaded PNG (${canvas.width}x${canvas.height})!`);
        }
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadJsx = () => {
    if (!svgContent) return;
    // Convert SVG to JSX React component
    let jsx = svgContent;
    // Convert attributes to camelCase
    jsx = jsx.replace(/\bclass=/g, "className=");
    jsx = jsx.replace(/\bstroke-width=/g, "strokeWidth=");
    jsx = jsx.replace(/\bstroke-linecap=/g, "strokeLinecap=");
    jsx = jsx.replace(/\bstroke-linejoin=/g, "strokeLinejoin=");
    jsx = jsx.replace(/\bfill-opacity=/g, "fillOpacity=");
    jsx = jsx.replace(/\bstroke-opacity=/g, "strokeOpacity=");
    jsx = jsx.replace(/\bclip-path=/g, "clipPath=");
    jsx = jsx.replace(/\bfill-rule=/g, "fillRule=");
    jsx = jsx.replace(/\bclip-rule=/g, "clipRule=");

    const componentName =
      jsxComponentName.replace(/[^a-zA-Z0-9]/g, "") || "MyIcon";
    const capitalized =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);

    const component = `import * as React from "react";

interface ${capitalized}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ${capitalized} = React.forwardRef<SVGSVGElement, ${capitalized}Props>(
  ({ size = 24, ...props }, ref) => {
    return (
${jsx
  .split("\n")
  .map((line) => "      " + line)
  .join("\n")}
    );
  }
);

${capitalized}.displayName = "${capitalized}";
`;

    const blob = new Blob([component], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    downloadDataURL(url, `${capitalized}.tsx`);
    toast.success(`Downloaded ${capitalized}.tsx!`);
  };

  const copyCode = async () => {
    if (!svgContent) return;
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopied(true);
      toast.success("SVG code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // ===== Code editor -> preview sync =====
  const applyCodeToPreview = () => {
    if (!codeInput.trim()) {
      toast.error("SVG code is empty");
      return;
    }
    setSvgContent(codeInput);
    extractColors(codeInput);
    toast.success("Preview updated!");
  };

  const reset = () => {
    setImageUrl(null);
    setSvgContent(null);
    setCodeInput("");
    setSvgColors([]);
    setColorEdits({});
    setMode("vectorize");
  };

  // Calculate SVG file size
  const svgSize = svgContent ? new Blob([svgContent]).size : 0;
  const svgSizeKb = (svgSize / 1024).toFixed(2);
  const originalSize = imageRef.current
    ? `${imageRef.current.naturalWidth}x${imageRef.current.naturalHeight}px`
    : null;

  return (
    <ToolLayout
      title="SVG Studio Pro"
      tagline="Vectorize, edit, recolor and convert SVGs - all in one browser tool"
      icon={<PenTool className="h-5 w-5" />}
      badge="pro"
      onBack={onBack}
      headerActions={
        <>
          {svgContent && (
            <>
              <span className="hidden md:inline text-xs text-muted-foreground">
                {svgSizeKb} KB
              </span>
              <Button onClick={copyCode} variant="ghost" size="sm" className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button onClick={downloadSvg} className="gap-2 bg-primary text-white hover:bg-primary/90" size="sm">
                <Download className="h-4 w-4" /> SVG
              </Button>
            </>
          )}
        </>
      }
      sidebar={
        <>
          {/* Mode tabs */}
          <ToolSection title="Mode">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "vectorize" as Mode, label: "Vectorize", icon: Wand2 },
                { id: "viewer" as Mode, label: "View / Code", icon: Eye },
                { id: "color" as Mode, label: "Recolor", icon: Palette },
                { id: "convert" as Mode, label: "Convert", icon: FileCode },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs transition ${
                      mode === m.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-primary/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </ToolSection>

          {/* Upload */}
          <ToolSection title="Upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose File
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Supports PNG, JPG, WEBP, SVG. Drag and drop also works.
            </p>
            {(imageUrl || svgContent) && (
              <Button onClick={reset} variant="ghost" size="sm" className="w-full mt-2 gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Reset
              </Button>
            )}
          </ToolSection>

          {/* Mode-specific sidebar */}
          {mode === "vectorize" && (
            <>
              <ToolSection title="Presets">
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`rounded-md p-2 text-xs text-left transition ${
                        preset === key
                          ? "bg-primary/15 border border-primary text-primary"
                          : "border border-border hover:bg-primary/10"
                      }`}
                      title={p.desc}
                    >
                      <div className="font-semibold">{p.label}</div>
                    </button>
                  ))}
                </div>
              </ToolSection>

              <ToolSection title="Quality Settings">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Colors</Label>
                      <span className="text-xs text-primary font-semibold">{settings.numberofcolors}</span>
                    </div>
                    <Slider
                      value={[settings.numberofcolors]}
                      min={2}
                      max={32}
                      onValueChange={(v) => update("numberofcolors", v[0])}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Line Threshold</Label>
                      <span className="text-xs text-primary font-semibold">{settings.ltres.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[settings.ltres]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => update("ltres", v[0])}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Curve Threshold</Label>
                      <span className="text-xs text-primary font-semibold">{settings.qtres.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[settings.qtres]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => update("qtres", v[0])}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Path Omit</Label>
                      <span className="text-xs text-primary font-semibold">{settings.pathomit}</span>
                    </div>
                    <Slider
                      value={[settings.pathomit]}
                      min={0}
                      max={20}
                      onValueChange={(v) => update("pathomit", v[0])}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Blur Radius</Label>
                      <span className="text-xs text-primary font-semibold">{settings.blurradius}</span>
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

              <ToolSection title="Actions">
                <Button
                  onClick={trace}
                  disabled={!imageUrl || loading}
                  className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {loading ? "Vectorizing..." : "Vectorize Image"}
                </Button>
                {originalSize && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Source: {originalSize}
                  </p>
                )}
              </ToolSection>
            </>
          )}

          {mode === "viewer" && svgContent && (
            <>
              <ToolSection title="View Options">
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    {(["side", "svg", "compare"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`text-xs py-2 rounded-md border transition ${
                          view === v
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border"
                        }`}
                      >
                        {v === "side" ? "Side" : v === "svg" ? "SVG" : "Compare"}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground w-12 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoom(1)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </ToolSection>

              <ToolSection title="Code Editor">
                <p className="text-[11px] text-muted-foreground mb-2">
                  Edit the SVG code below. Click Apply to update the preview.
                </p>
                <Textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="font-mono text-xs min-h-[200px] resize-y"
                  placeholder="<svg>...</svg>"
                />
                <Button onClick={applyCodeToPreview} size="sm" className="w-full mt-2 gap-2">
                  <Check className="h-3.5 w-3.5" /> Apply to Preview
                </Button>
              </ToolSection>

              <ToolSection title="Optimize">
                <Button onClick={optimizeSvg} variant="outline" size="sm" className="w-full gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Optimize SVG
                </Button>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Removes comments, whitespace, and empty groups to reduce file size.
                </p>
              </ToolSection>
            </>
          )}

          {mode === "color" && svgContent && (
            <ToolSection title="Color Editor">
              {svgColors.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No fill or stroke colors found in this SVG.
                </p>
              ) : (
                <>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    {svgColors.length} unique color{svgColors.length !== 1 ? "s" : ""} found.
                    Click a swatch to recolor.
                  </p>
                  <div className="space-y-2">
                    {svgColors.map((color) => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        editedColor={colorEdits[color]}
                        onApply={applyColorEdit}
                      />
                    ))}
                  </div>
                </>
              )}
            </ToolSection>
          )}

          {mode === "convert" && svgContent && (
            <>
              <ToolSection title="Export to PNG">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-xs">Scale</Label>
                      <span className="text-xs text-primary font-semibold">{pngScale}x</span>
                    </div>
                    <Slider
                      value={[pngScale]}
                      min={1}
                      max={8}
                      onValueChange={(v) => setPngScale(v[0])}
                    />
                  </div>
                  <Button onClick={downloadPng} variant="outline" size="sm" className="w-full gap-2">
                    <FileImage className="h-3.5 w-3.5" /> Download PNG
                  </Button>
                </div>
              </ToolSection>

              <ToolSection title="Export to JSX">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs mb-1 block">Component Name</Label>
                    <Input
                      value={jsxComponentName}
                      onChange={(e) => setJsxComponentName(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="MyIcon"
                    />
                  </div>
                  <Button onClick={downloadJsx} variant="outline" size="sm" className="w-full gap-2">
                    <FileCode className="h-3.5 w-3.5" /> Download JSX
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Outputs a React component with proper TypeScript types and forwardRef.
                  </p>
                </div>
              </ToolSection>

              <ToolSection title="Export to SVG">
                <Button onClick={downloadSvg} size="sm" className="w-full gap-2 bg-primary text-white hover:bg-primary/90">
                  <Download className="h-3.5 w-3.5" /> Download SVG
                </Button>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  File size: {svgSizeKb} KB
                </p>
              </ToolSection>
            </>
          )}
        </>
      }
    >
      {/* Main canvas area */}
      {!imageUrl && !svgContent ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="h-full"
        >
          <EmptyState
            icon={<PenTool className="h-8 w-8" />}
            title="SVG Studio Pro"
            description="Upload a raster image to vectorize, or load an SVG to edit, recolor, optimize, and convert to PNG or JSX."
            action={
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 bg-primary text-white hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" /> Upload Image or SVG
                </Button>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-3">Or try a sample SVG:</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {SAMPLE_SVGS.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => loadSample(sample)}
                        className="group flex flex-col items-center gap-1 rounded-lg border border-border p-2 hover:border-primary/40 hover:bg-primary/5 transition"
                        title={sample.name}
                      >
                        <div
                          className="h-12 w-12 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: sample.svg }}
                        />
                        <span className="text-[10px] text-muted-foreground group-hover:text-primary transition">
                          {sample.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
        </div>
      ) : mode === "vectorize" && imageUrl ? (
        <div className="h-full flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <img
              src={imageUrl}
              alt="Source"
              className="w-full h-auto rounded-lg border border-border bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]"
            />
            <div className="mt-3 text-center text-sm text-muted-foreground">
              Click <strong className="text-foreground">Vectorize Image</strong> in the sidebar to convert this to SVG.
            </div>
          </div>
        </div>
      ) : mode === "viewer" && svgContent ? (
        <div className="h-full flex flex-col">
          {/* View toggle for desktop */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-card/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>{svgSizeKb} KB</span>
              <span className="text-border">|</span>
              <span>{svgColors.length} colors</span>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-card/40 p-1">
              <Button
                size="sm"
                variant={view === "side" ? "secondary" : "ghost"}
                onClick={() => setView("side")}
                className="h-7 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" /> Split
              </Button>
              <Button
                size="sm"
                variant={view === "svg" ? "secondary" : "ghost"}
                onClick={() => setView("svg")}
                className="h-7 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" /> Preview
              </Button>
              <Button
                size="sm"
                variant={view === "compare" ? "secondary" : "ghost"}
                onClick={() => setView("compare")}
                className="h-7 text-xs"
              >
                <GitCompare className="h-3 w-3 mr-1" /> Compare
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {view === "side" && (
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="border-r border-border p-4 flex items-center justify-center bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]">
                  <div
                    ref={svgPreviewRef}
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                    className="max-w-full max-h-full"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </div>
                <div className="p-4 bg-card/20">
                  <pre className="text-[10px] font-mono whitespace-pre-wrap break-all text-muted-foreground overflow-auto max-h-full">
                    {svgContent}
                  </pre>
                </div>
              </div>
            )}

            {view === "svg" && (
              <div className="h-full flex items-center justify-center p-8 bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]">
                <div
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            )}

            {view === "compare" && imageUrl && (
              <div className="grid grid-cols-2 h-full">
                <div className="border-r border-border p-4 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground mb-2">Original (raster)</span>
                  <img src={imageUrl} alt="Original" className="max-w-full max-h-[calc(100%-2rem)] object-contain" />
                </div>
                <div className="p-4 flex flex-col items-center justify-center bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]">
                  <span className="text-xs text-muted-foreground mb-2">Vectorized (SVG)</span>
                  <div
                    className="max-w-full max-h-[calc(100%-2rem)]"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : mode === "color" && svgContent ? (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]">
          <div
            className="max-w-full max-h-[80%]"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {svgColors.length > 0
              ? "Use the Color Editor in the sidebar to recolor."
              : "No editable colors found in this SVG."}
          </div>
        </div>
      ) : mode === "convert" && svgContent ? (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[conic-gradient(at_top_left,_var(--background)_0%,_hsl(0_0%_90%)_25%,_var(--background)_50%,_hsl(0_0%_90%)_75%,_var(--background)_100%)] bg-[length:20px_20px]">
          <div
            className="max-w-full max-h-[80%]"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Use the export options in the sidebar to download as PNG, JSX, or SVG.
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Eye className="h-8 w-8" />}
          title="No SVG Yet"
          description="Vectorize an image or load an SVG file to start editing."
        />
      )}
    </ToolLayout>
  );
}

// ===== Color Swatch Component =====
function ColorSwatch({
  color,
  editedColor,
  onApply,
}: {
  color: string;
  editedColor?: string;
  onApply: (old: string, newColor: string) => void;
}) {
  const [newColor, setNewColor] = useState(editedColor || color);

  return (
    <div className="flex items-center gap-2 rounded-md border border-border p-2">
      <div
        className="h-8 w-8 shrink-0 rounded border border-border"
        style={{ backgroundColor: color }}
        title={`Original: ${color}`}
      />
      <input
        type="color"
        value={newColor.startsWith("#") ? newColor : "#000000"}
        onChange={(e) => setNewColor(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0"
        aria-label="Pick new color"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground truncate">{color}</div>
        <div className="text-xs font-mono text-foreground truncate">{newColor}</div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0 hover:bg-primary/10 hover:text-primary"
        onClick={() => onApply(color, newColor)}
        disabled={newColor === color && !editedColor}
        aria-label="Apply color"
      >
        <Check className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
