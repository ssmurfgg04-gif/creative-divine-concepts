"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Upload, Download, Loader2, RotateCcw } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  fileToDataURL,
  loadImage,
  canvasToBlob,
  downloadBlob,
} from "@/lib/canvas-utils";

interface EffectsStudioProps {
  onBack: () => void;
}

type EffectId =
  | "embroidery"
  | "glitter"
  | "halftone"
  | "neon"
  | "vintage"
  | "grayscale"
  | "sepia"
  | "pencil"
  | "oil"
  | "watercolor"
  | "duotone"
  | "posterize"
  | "threshold"
  | "outline";

const EFFECTS: { id: EffectId; name: string; description: string }[] = [
  { id: "embroidery", name: "Embroidery", description: "Stitched thread look" },
  { id: "glitter", name: "Glitter", description: "Sparkly texture" },
  { id: "halftone", name: "Halftone", description: "Print dot pattern" },
  { id: "neon", name: "Neon Glow", description: "Glowing outline" },
  { id: "vintage", name: "Vintage", description: "Faded retro" },
  { id: "grayscale", name: "Grayscale", description: "Black & white" },
  { id: "sepia", name: "Sepia", description: "Warm brown tone" },
  { id: "pencil", name: "Pencil Sketch", description: "Hand-drawn" },
  { id: "oil", name: "Oil Paint", description: "Painterly strokes" },
  { id: "watercolor", name: "Watercolor", description: "Soft wash" },
  { id: "duotone", name: "Duotone", description: "2-color posterize" },
  { id: "posterize", name: "Posterize", description: "Limited colors" },
  { id: "threshold", name: "Threshold", description: "B&W only" },
  { id: "outline", name: "Outline", description: "Edge detection" },
];

export function EffectsStudio({ onBack }: EffectsStudioProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeEffect, setActiveEffect] = useState<EffectId>("embroidery");
  const [intensity, setIntensity] = useState(60);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  }, []);

  const applyEffect = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 30));
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const maxDim = 1000;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const amt = intensity / 100;

      switch (activeEffect) {
        case "grayscale":
          ctx.filter = "grayscale(1)";
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          break;
        case "sepia":
          ctx.filter = `sepia(${0.5 + amt * 0.5})`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          break;
        case "vintage":
          ctx.filter = `sepia(0.6) contrast(1.1) brightness(0.95) saturate(0.8)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          // Add vignette
          const grad = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
            canvas.width / 2, canvas.height / 2, canvas.height * 0.7,
          );
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(1, `rgba(40,20,0,${amt * 0.6})`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case "posterize": {
          const levels = Math.max(2, Math.round(8 - amt * 6));
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const step = 255 / (levels - 1);
          for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = Math.round(data.data[i] / step) * step;
            data.data[i + 1] = Math.round(data.data[i + 1] / step) * step;
            data.data[i + 2] = Math.round(data.data[i + 2] / step) * step;
          }
          ctx.putImageData(data, 0, 0);
          break;
        }
        case "threshold": {
          const t = 128 - amt * 80;
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < data.data.length; i += 4) {
            const lum = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
            const v = lum > t ? 255 : 0;
            data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
          }
          ctx.putImageData(data, 0, 0);
          break;
        }
        case "duotone": {
          // Map lum to gradient between two colors
          const c1 = [243, 106, 33]; // accent orange
          const c2 = [15, 23, 42]; // slate
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < data.data.length; i += 4) {
            const lum = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / (3 * 255);
            data.data[i] = c2[0] + (c1[0] - c2[0]) * lum;
            data.data[i + 1] = c2[1] + (c1[1] - c2[1]) * lum;
            data.data[i + 2] = c2[2] + (c1[2] - c2[2]) * lum;
          }
          ctx.putImageData(data, 0, 0);
          break;
        }
        case "halftone": {
          // Dot-pattern halftone
          const cellSize = Math.max(4, Math.round(12 - amt * 8));
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // Build a luminance map
          const lum = new Float32Array(canvas.width * canvas.height);
          for (let i = 0, j = 0; i < data.data.length; i += 4, j++) {
            lum[j] = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / (3 * 255);
          }
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000";
          for (let y = 0; y < canvas.height; y += cellSize) {
            for (let x = 0; x < canvas.width; x += cellSize) {
              // Average lum in cell
              let sum = 0, count = 0;
              for (let dy = 0; dy < cellSize && y + dy < canvas.height; dy++) {
                for (let dx = 0; dx < cellSize && x + dx < canvas.width; dx++) {
                  sum += lum[(y + dy) * canvas.width + (x + dx)];
                  count++;
                }
              }
              const avg = sum / count;
              const radius = (1 - avg) * cellSize / 2;
              if (radius > 0.5) {
                ctx.beginPath();
                ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          break;
        }
        case "embroidery": {
          // Satin-stitch simulation: cross-hatch overlay + slight color quantize
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // Quantize colors
          const levels = 6;
          const step = 255 / (levels - 1);
          for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = Math.round(data.data[i] / step) * step;
            data.data[i + 1] = Math.round(data.data[i + 1] / step) * step;
            data.data[i + 2] = Math.round(data.data[i + 2] / step) * step;
          }
          ctx.putImageData(data, 0, 0);
          // Add diagonal stitch lines
          ctx.globalAlpha = 0.25 * amt;
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          const stitchLen = 6;
          for (let y = 0; y < canvas.height; y += stitchLen) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y + canvas.width);
            ctx.stroke();
          }
          ctx.globalAlpha = 0.15 * amt;
          ctx.strokeStyle = "#fff";
          for (let y = -canvas.width; y < canvas.height; y += stitchLen) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y - canvas.width);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          break;
        }
        case "glitter": {
          // Sparkle texture via random bright pixels
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const sparkleCount = Math.floor(canvas.width * canvas.height * 0.02 * amt);
          for (let s = 0; s < sparkleCount; s++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const i = (y * canvas.width + x) * 4;
            // Brighten by random amount
            const b = 100 + Math.random() * 155;
            data.data[i] = Math.min(255, data.data[i] + b);
            data.data[i + 1] = Math.min(255, data.data[i + 1] + b);
            data.data[i + 2] = Math.min(255, data.data[i + 2] + b);
          }
          ctx.putImageData(data, 0, 0);
          // Add slight contrast boost
          ctx.filter = `contrast(1.1) brightness(1.05) saturate(1.2)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          break;
        }
        case "neon": {
          // Edge detection + glow
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const out = ctx.createImageData(canvas.width, canvas.height);
          const w = canvas.width, h = canvas.height;
          const src = data.data;
          const dst = out.data;
          // Simple Sobel on luminance
          const lum = new Float32Array(w * h);
          for (let i = 0, j = 0; i < src.length; i += 4, j++) {
            lum[j] = (src[i] + src[i + 1] + src[i + 2]) / 3;
          }
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const gx =
                -lum[(y - 1) * w + (x - 1)] - 2 * lum[y * w + (x - 1)] - lum[(y + 1) * w + (x - 1)] +
                lum[(y - 1) * w + (x + 1)] + 2 * lum[y * w + (x + 1)] + lum[(y + 1) * w + (x + 1)];
              const gy =
                -lum[(y - 1) * w + (x - 1)] - 2 * lum[(y - 1) * w + x] - lum[(y - 1) * w + (x + 1)] +
                lum[(y + 1) * w + (x - 1)] + 2 * lum[(y + 1) * w + x] + lum[(y + 1) * w + (x + 1)];
              const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
              const i = (y * w + x) * 4;
              // Neon orange
              dst[i] = mag * (243 / 255);
              dst[i + 1] = mag * (106 / 255);
              dst[i + 2] = mag * (33 / 255);
              dst[i + 3] = mag > 30 ? 255 : 0;
            }
          }
          ctx.putImageData(out, 0, 0);
          // Add bloom
          ctx.filter = `blur(${4 * amt}px)`;
          ctx.globalCompositeOperation = "lighter";
          ctx.drawImage(canvas, 0, 0);
          ctx.globalCompositeOperation = "source-over";
          ctx.filter = "none";
          break;
        }
        case "pencil": {
          // Grayscale + invert + blur + dodge = sketch effect
          ctx.filter = "grayscale(1) invert(1) blur(2px)";
          const tmp = document.createElement("canvas");
          tmp.width = canvas.width;
          tmp.height = canvas.height;
          tmp.getContext("2d")!.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          ctx.filter = "grayscale(1)";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.filter = "none";
          ctx.globalCompositeOperation = "color-dodge";
          ctx.drawImage(tmp, 0, 0);
          ctx.globalCompositeOperation = "source-over";
          // Reduce opacity with intensity
          if (amt < 1) {
            ctx.fillStyle = `rgba(255,255,255,${1 - amt})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          break;
        }
        case "oil": {
          // Simple oil paint = Kuwahara-ish via posterize + soft blur + sharpen
          ctx.filter = `saturate(1.4) contrast(1.15)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          const levels = Math.max(3, Math.round(10 - amt * 6));
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const step = 255 / (levels - 1);
          for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = Math.round(data.data[i] / step) * step;
            data.data[i + 1] = Math.round(data.data[i + 1] / step) * step;
            data.data[i + 2] = Math.round(data.data[i + 2] / step) * step;
          }
          ctx.putImageData(data, 0, 0);
          // Slight smoothing
          ctx.filter = "blur(0.6px)";
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          break;
        }
        case "watercolor": {
          // Soft blur + saturation + edge softening
          ctx.filter = `blur(${1 + amt * 2}px) saturate(1.3) brightness(1.05) contrast(0.95)`;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
          // Add paper texture (subtle noise)
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < data.data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 15 * amt;
            data.data[i] = Math.max(0, Math.min(255, data.data[i] + noise));
            data.data[i + 1] = Math.max(0, Math.min(255, data.data[i + 1] + noise));
            data.data[i + 2] = Math.max(0, Math.min(255, data.data[i + 2] + noise));
          }
          ctx.putImageData(data, 0, 0);
          break;
        }
        case "outline": {
          // Edge detection only
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const out = ctx.createImageData(canvas.width, canvas.height);
          const w = canvas.width, h = canvas.height;
          const src = data.data;
          const dst = out.data;
          const lum = new Float32Array(w * h);
          for (let i = 0, j = 0; i < src.length; i += 4, j++) {
            lum[j] = (src[i] + src[i + 1] + src[i + 2]) / 3;
          }
          const threshold = 80 - amt * 60;
          for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
              const gx =
                -lum[(y - 1) * w + (x - 1)] - 2 * lum[y * w + (x - 1)] - lum[(y + 1) * w + (x - 1)] +
                lum[(y - 1) * w + (x + 1)] + 2 * lum[y * w + (x + 1)] + lum[(y + 1) * w + (x + 1)];
              const gy =
                -lum[(y - 1) * w + (x - 1)] - 2 * lum[(y - 1) * w + x] - lum[(y - 1) * w + (x + 1)] +
                lum[(y + 1) * w + (x - 1)] + 2 * lum[(y + 1) * w + x] + lum[(y + 1) * w + (x + 1)];
              const mag = Math.sqrt(gx * gx + gy * gy);
              const i = (y * w + x) * 4;
              const v = mag > threshold ? 0 : 255;
              dst[i] = dst[i + 1] = dst[i + 2] = v;
              dst[i + 3] = 255;
            }
          }
          ctx.putImageData(out, 0, 0);
          break;
        }
      }
    } finally {
      setProcessing(false);
    }
  }, [activeEffect, intensity]);

  // Re-apply when effect or intensity changes (debounced)
  useEffect(() => {
    if (!imageUrl) return;
    const t = setTimeout(() => applyEffect(), 100);
    return () => clearTimeout(t);
  }, [imageUrl, activeEffect, intensity, applyEffect]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `cdc-effect-${activeEffect}-${Date.now()}.png`);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Effects Studio"
      tagline="Apply print effects — embroidery, glitter, halftone, neon & more"
      icon={<Sparkles className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleDownload}
          disabled={!imageUrl}
          className="gap-2 bg-primary text-white hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Download
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Upload Artwork">
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
          </ToolSection>

          {imageUrl && (
            <>
              <ToolSection title="Effects">
                <div className="grid grid-cols-2 gap-1.5">
                  {EFFECTS.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setActiveEffect(e.id)}
                      className={`flex flex-col items-start gap-0.5 rounded-md border px-2 py-1.5 text-left transition ${
                        activeEffect === e.id
                          ? "border-primary bg-primary/10 box-glow"
                          : "border-border bg-background/30 hover:border-primary/40"
                      }`}
                    >
                      <span className="text-xs font-semibold">{e.name}</span>
                      <span className="text-[10px] text-muted-foreground">{e.description}</span>
                    </button>
                  ))}
                </div>
              </ToolSection>

              <ToolSection title="Intensity">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Strength</Label>
                    <span className="text-xs text-muted-foreground">{intensity}%</span>
                  </div>
                  <Slider
                    value={[intensity]}
                    min={10}
                    max={100}
                    onValueChange={(v) => setIntensity(v[0])}
                  />
                </div>
              </ToolSection>

              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2"
                onClick={() => {
                  imageRef.current = null;
                  setImageUrl(null);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start Over
              </Button>
            </>
          )}

          <ToolSection title="For DTF / DTG" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <span className="text-foreground">Embroidery:</span> Show stitch preview to clients</li>
              <li>• <span className="text-foreground">Halftone:</span> Prep for screen printing</li>
              <li>• <span className="text-foreground">Duotone:</span> Brand-color designs</li>
              <li>• <span className="text-foreground">Threshold:</span> Vinyl cut prep</li>
              <li>• <span className="text-foreground">Outline:</span> Coloring book style</li>
            </ul>
          </ToolSection>
        </>
      }
    >
      {!imageUrl ? (
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="Apply creative effects to your artwork"
          description="14 print-ready effects including embroidery simulation, glitter, halftone dots, neon glow, vintage, and more. All processed locally in your browser. Adjust intensity live."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" /> Upload Artwork
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <div className="checker-bg overflow-hidden rounded-lg border border-border shadow-2xl">
              {processing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <canvas ref={canvasRef} className="max-h-[75vh] max-w-full" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Effect: <span className="text-primary font-semibold">
                {EFFECTS.find((e) => e.id === activeEffect)?.name}
              </span> • {intensity}% intensity
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
