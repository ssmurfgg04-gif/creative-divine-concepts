"use client";

import { useCallback, useRef, useState } from "react";
import { ZoomIn, Upload, Download, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  fileToDataURL,
  loadImage,
  canvasToBlob,
  downloadBlob,
} from "@/lib/canvas-utils";

interface ImageUpscalerProps {
  onBack: () => void;
}

export function ImageUpscaler({ onBack }: ImageUpscalerProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [sharpen, setSharpen] = useState(40);
  const [denoise, setDenoise] = useState(false);
  const [aiEnhance, setAiEnhance] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [resultDims, setResultDims] = useState({ w: 0, h: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    imageRef.current = img;
    setOriginalUrl(url);
    setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    setResultUrl(null);
    setResultDims({ w: 0, h: 0 });
  }, []);

  const applyUpscale = useCallback(async () => {
    if (!imageRef.current) return;
    setProcessing(true);
    try {
      // Yield to UI
      await new Promise((r) => setTimeout(r, 50));
      const img = imageRef.current;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;

      // Step 1: high-quality bicubic-ish upscale
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      // Step 2: optional denoise (slight blur)
      if (denoise) {
        const tmp = document.createElement("canvas");
        tmp.width = w;
        tmp.height = h;
        const tctx = tmp.getContext("2d")!;
        tctx.filter = "blur(0.5px)";
        tctx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(tmp, 0, 0);
      }

      // Step 3: unsharp mask for sharpening
      if (sharpen > 0) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        // Build a blurred copy using simple 3x3 box blur
        const blurred = new Uint8ClampedArray(data);
        const r = 1; // radius
        for (let y = r; y < h - r; y++) {
          for (let x = r; x < w - r; x++) {
            const i = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
              let sum = 0;
              let count = 0;
              for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                  sum += data[((y + dy) * w + (x + dx)) * 4 + c];
                  count++;
                }
              }
              blurred[i + c] = sum / count;
            }
          }
        }
        // Unsharp: out = orig + amount * (orig - blurred)
        const amount = sharpen / 100;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const orig = data[i + c];
            const blur = blurred[i + c];
            data[i + c] = Math.max(0, Math.min(255, orig + amount * (orig - blur)));
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      // Step 4: optional AI enhancement (uses z-ai-web-dev-sdk via /api/ai-edit)
      let finalUrl: string;
      if (aiEnhance) {
        const dataUrl = canvas.toDataURL("image/png");
        const res = await fetch("/api/ai-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "Enhance and sharpen this image for high-quality print. Preserve colors and details. Remove any artifacts.",
            image: dataUrl,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "AI enhancement failed");
        }
        const result = await res.json();
        finalUrl = result.image;
        // Get AI result dimensions
        const aiImg = await loadImage(finalUrl);
        setResultDims({ w: aiImg.naturalWidth, h: aiImg.naturalHeight });
      } else {
        finalUrl = canvas.toDataURL("image/png");
        setResultDims({ w, h });
      }

      setResultUrl(finalUrl);
      toast.success(`Upscaled ${scale}× → ${resultDims.w || w}×${resultDims.h || h}px`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upscaling failed");
    } finally {
      setProcessing(false);
    }
  }, [scale, sharpen, denoise, aiEnhance]);

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      // For data URLs, fetch works
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      downloadBlob(blob, `cdc-upscaled-${Date.now()}.png`);
      toast.success("Downloaded!");
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
    }
  };

  return (
    <ToolLayout
      title="Image Upscaler"
      tagline="Enlarge artwork to print-ready resolution"
      icon={<ZoomIn className="h-5 w-5" />}
      badge="ai"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleDownload}
          disabled={!resultUrl}
          className="gap-2 bg-primary text-white hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Download
        </Button>
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
            {originalUrl && (
              <p className="mt-2 text-xs text-muted-foreground">
                Source: {originalDims.w}×{originalDims.h}px
              </p>
            )}
          </ToolSection>

          {originalUrl && (
            <>
              <ToolSection title="Upscale Settings">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Scale factor</Label>
                      <span className="text-xs text-primary font-semibold">{scale}×</span>
                    </div>
                    <Slider
                      value={[scale]}
                      min={1.5}
                      max={4}
                      step={0.5}
                      onValueChange={(v) => setScale(v[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Output: {Math.round(originalDims.w * scale)}×{Math.round(originalDims.h * scale)}px
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Sharpening (unsharp mask)</Label>
                      <span className="text-xs text-muted-foreground">{sharpen}%</span>
                    </div>
                    <Slider
                      value={[sharpen]}
                      min={0}
                      max={100}
                      onValueChange={(v) => setSharpen(v[0])}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Denoise (light blur)</Label>
                    <Switch checked={denoise} onCheckedChange={setDenoise} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" /> AI Enhance
                    </Label>
                    <Switch checked={aiEnhance} onCheckedChange={setAiEnhance} />
                  </div>
                  {aiEnhance && (
                    <p className="rounded-md bg-primary/10 p-2 text-xs text-primary">
                      AI enhancement uses free z-ai-web-dev-sdk. Slower but smarter detail recovery.
                    </p>
                  )}
                </div>
              </ToolSection>

              <Button
                onClick={applyUpscale}
                disabled={processing}
                className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {processing ? "Processing…" : `Upscale ${scale}×`}
              </Button>

              <ToolSection title="Tips" defaultOpen={false}>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li>• 2× is good for most cases</li>
                  <li>• Use sharpening to recover edges</li>
                  <li>• Denoise helps JPEG artifacts</li>
                  <li>• AI Enhance is best for photos, slower</li>
                  <li>• For graphics/logos, use Vectorizer instead</li>
                </ul>
              </ToolSection>
            </>
          )}
        </>
      }
    >
      {!originalUrl ? (
        <EmptyState
          icon={<ZoomIn className="h-8 w-8" />}
          title="Enlarge images for print"
          description="Upscale low-resolution artwork up to 4× with smart sharpening. Optional AI enhancement restores detail. Perfect for making web images print-ready."
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
          <div className="grid h-full max-h-full w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original
                </span>
                <span className="text-xs text-muted-foreground">
                  {originalDims.w}×{originalDims.h}px
                </span>
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="absolute inset-0 h-full w-full object-contain p-2" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Upscaled
                </span>
                {resultDims.w > 0 && (
                  <span className="text-xs text-primary">
                    {resultDims.w}×{resultDims.h}px
                  </span>
                )}
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {aiEnhance ? "AI enhancing…" : "Upscaling…"}
                    </p>
                  </div>
                )}
                {resultUrl && !processing && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={resultUrl} alt="Upscaled" className="absolute inset-0 h-full w-full object-contain p-2" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
