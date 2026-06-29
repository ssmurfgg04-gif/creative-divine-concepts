"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wand2, Upload, Download, Loader2, Settings2, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  fileToDataURL,
  loadImage,
  canvasToBlob,
  downloadBlob,
} from "@/lib/canvas-utils";

interface PrintConverterProps {
  onBack: () => void;
}

interface PrintSpec {
  name: string;
  widthIn: number;
  heightIn: number;
  dpi: number;
}

const PRINT_SIZES: PrintSpec[] = [
  { name: "DTF Gang Sheet 22×12", widthIn: 22, heightIn: 12, dpi: 300 },
  { name: "T-Shirt Front 14×16", widthIn: 14, heightIn: 16, dpi: 300 },
  { name: "T-Shirt Back 14×18", widthIn: 14, heightIn: 18, dpi: 300 },
  { name: "A4 Print (8.27×11.69)", widthIn: 8.27, heightIn: 11.69, dpi: 300 },
  { name: "A3 Print (11.69×16.54)", widthIn: 11.69, heightIn: 16.54, dpi: 300 },
  { name: "Pocket Logo 4×4", widthIn: 4, heightIn: 4, dpi: 300 },
  { name: "Sleeve 3×11", widthIn: 3, heightIn: 11, dpi: 300 },
  { name: "Custom", widthIn: 10, heightIn: 10, dpi: 300 },
];

export function PrintConverter({ onBack }: PrintConverterProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [printSpec, setPrintSpec] = useState<PrintSpec>(PRINT_SIZES[0]);
  const [customW, setCustomW] = useState(10);
  const [customH, setCustomH] = useState(10);
  const [targetDpi, setTargetDpi] = useState(300);
  const [removeBg, setRemoveBg] = useState(true);
  const [sharpen, setSharpen] = useState(true);
  const [sharpenAmount, setSharpenAmount] = useState(40);
  const [denoise, setDenoise] = useState(true);
  const [addBleed, setAddBleed] = useState(false);
  const [originalInfo, setOriginalInfo] = useState({ w: 0, h: 0, size: "" });
  const [resultInfo, setResultInfo] = useState({ w: 0, h: 0, dpi: 0 });
  const [issues, setIssues] = useState<string[]>([]);
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setLoading(true);
    try {
      const url = await fileToDataURL(file);
      const img = await loadImage(url);
      imageRef.current = img;
      setOriginalUrl(url);
      setOriginalInfo({
        w: img.naturalWidth,
        h: img.naturalHeight,
        size: formatBytes(file.size),
      });
      setResultUrl(null);
      setIssues([]);
      setFixedIssues([]);

      // Analyze image for print issues
      const detectedIssues: string[] = [];
      const targetW = (printSpec.name === "Custom" ? customW : printSpec.widthIn) * targetDpi;
      const targetH = (printSpec.name === "Custom" ? customH : printSpec.heightIn) * targetDpi;

      if (img.naturalWidth < targetW || img.naturalHeight < targetH) {
        detectedIssues.push(
          `Low resolution: ${img.naturalWidth}×${img.naturalHeight}px (need ${targetW}×${targetH}px at ${targetDpi} DPI)`,
        );
      }
      if (file.type === "image/jpeg") {
        detectedIssues.push("JPEG format: No transparency support (use PNG for DTF/DTG)");
      }
      // Check if image likely has a background (non-transparent)
      if (file.type !== "image/png") {
        detectedIssues.push("No transparency: Background needs removal for DTF printing");
      }
      // Check current DPI estimate
      const currentDpi = Math.min(img.naturalWidth / (printSpec.widthIn || 10), img.naturalHeight / (printSpec.heightIn || 10));
      if (currentDpi < 300) {
        detectedIssues.push(`Estimated DPI: ${Math.round(currentDpi)} (need ${targetDpi} DPI for print quality)`);
      }

      setIssues(detectedIssues);
      if (detectedIssues.length === 0) {
        toast.success("Image is already print-ready!");
      } else {
        toast.info(`Found ${detectedIssues.length} issue(s) to fix`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load image");
    } finally {
      setLoading(false);
    }
  }, [printSpec, customW, customH, targetDpi]);

  const processImage = useCallback(async () => {
    if (!imageRef.current) return;
    setProcessing(true);
    setFixedIssues([]);

    try {
      await new Promise((r) => setTimeout(r, 50));
      const img = imageRef.current;
      const spec = printSpec.name === "Custom" ? { widthIn: customW, heightIn: customH, dpi: targetDpi } : { ...printSpec, dpi: targetDpi };

      const targetW = Math.round(spec.widthIn * spec.dpi);
      const targetH = Math.round(spec.heightIn * spec.dpi);

      // Step 1: Upscale to target resolution
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Calculate fit (contain within target, centered)
      const imgAr = img.naturalWidth / img.naturalHeight;
      const targetAr = targetW / targetH;
      let drawW, drawH, drawX, drawY;
      if (imgAr > targetAr) {
        drawW = targetW;
        drawH = targetW / imgAr;
        drawX = 0;
        drawY = (targetH - drawH) / 2;
      } else {
        drawH = targetH;
        drawW = targetH * imgAr;
        drawX = (targetW - drawW) / 2;
        drawY = 0;
      }

      // Fill with white if no transparency needed
      if (!removeBg) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const fixed: string[] = [];

      // Step 2: Remove background (if enabled)
      if (removeBg) {
        try {
          const { removeBackground } = await import("@imgly/background-removal");
          const dataUrl = canvas.toDataURL("image/png");
          const blob = await removeBackground(dataUrl, {
            output: { format: "image/png", quality: 0.95 },
          });
          const resultUrl = URL.createObjectURL(blob);
          const bgRemovedImg = await loadImage(resultUrl);
          ctx.clearRect(0, 0, targetW, targetH);
          ctx.drawImage(bgRemovedImg, drawX, drawY, drawW, drawH);
          fixed.push("Background removed (AI-powered)");
        } catch (err) {
          // Fallback: simple white/light background removal
          const imageData = ctx.getImageData(0, 0, targetW, targetH);
          const data = imageData.data;
          // Remove near-white pixels
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          fixed.push("Background removed (threshold-based)");
        }
      }

      // Step 3: Denoise (if enabled) - simple median-ish filter
      if (denoise) {
        const imageData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imageData.data;
        // Simple noise reduction: blend each pixel slightly with neighbors
        const tmp = new Uint8ClampedArray(data);
        for (let y = 1; y < targetH - 1; y += 2) {
          for (let x = 1; x < targetW - 1; x += 2) {
            const i = (y * targetW + x) * 4;
            for (let c = 0; c < 3; c++) {
              const avg = (tmp[i + c] + tmp[i + 4 + c] + tmp[i - 4 + c] + tmp[i + targetW * 4 + c] + tmp[i - targetW * 4 + c]) / 5;
              data[i + c] = Math.round(avg);
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        fixed.push("Noise reduced");
      }

      // Step 4: Sharpen (unsharp mask)
      if (sharpen && sharpenAmount > 0) {
        const imageData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imageData.data;
        const blurred = new Uint8ClampedArray(data);
        const r = 1;
        for (let y = r; y < targetH - r; y++) {
          for (let x = r; x < targetW - r; x++) {
            const i = (y * targetW + x) * 4;
            for (let c = 0; c < 3; c++) {
              let sum = 0, count = 0;
              for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                  sum += data[((y + dy) * targetW + (x + dx)) * 4 + c];
                  count++;
                }
              }
              blurred[i + c] = sum / count;
            }
          }
        }
        const amount = sharpenAmount / 100;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            const orig = data[i + c];
            const blur = blurred[i + c];
            data[i + c] = Math.max(0, Math.min(255, orig + amount * (orig - blur)));
          }
        }
        ctx.putImageData(imageData, 0, 0);
        fixed.push(`Sharpened (${sharpenAmount}% unsharp mask)`);
      }

      // Step 5: Add bleed (if enabled)
      if (addBleed) {
        // Extend edges by 3px
        const bleedCanvas = document.createElement("canvas");
        const bleedPx = Math.round(3 * (spec.dpi / 300));
        bleedCanvas.width = targetW + bleedPx * 2;
        bleedCanvas.height = targetH + bleedPx * 2;
        const bctx = bleedCanvas.getContext("2d")!;
        // Draw original centered
        bctx.drawImage(canvas, bleedPx, bleedPx);
        // Extend edges
        // Top
        bctx.drawImage(canvas, 0, 0, targetW, bleedPx, bleedPx, 0, targetW, bleedPx);
        // Bottom
        bctx.drawImage(canvas, 0, targetH - bleedPx, targetW, bleedPx, bleedPx, targetH + bleedPx, targetW, bleedPx);
        // Left
        bctx.drawImage(canvas, 0, 0, bleedPx, targetH, 0, bleedPx, bleedPx, targetH);
        // Right
        bctx.drawImage(canvas, targetW - bleedPx, 0, bleedPx, targetH, targetW + bleedPx, bleedPx, bleedPx, targetH);
        canvas.width = bleedCanvas.width;
        canvas.height = bleedCanvas.height;
        ctx.drawImage(bleedCanvas, 0, 0);
        fixed.push(`Bleed added (${bleedPx}px safety margin)`);
      }

      // Step 6: Export as PNG (print-ready format)
      const blob = await canvasToBlob(canvas, "image/png", 1.0);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultInfo({
        w: canvas.width,
        h: canvas.height,
        dpi: spec.dpi,
      });
      setFixedIssues(fixed);
      toast.success(`Print-ready! ${canvas.width}×${canvas.height}px at ${spec.dpi} DPI`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  }, [printSpec, customW, customH, targetDpi, removeBg, sharpen, sharpenAmount, denoise, addBleed]);

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const spec = printSpec.name === "Custom" ? { widthIn: customW, heightIn: customH } : printSpec;
      downloadBlob(blob, `cdc-print-ready-${spec.widthIn}x${spec.heightIn}-${targetDpi}dpi.png`);
      toast.success("Downloaded print-ready file!");
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
    }
  };

  const currentSpec = printSpec.name === "Custom" ? { widthIn: customW, heightIn: customH, dpi: targetDpi } : { ...printSpec, dpi: targetDpi };
  const targetPixels = {
    w: Math.round(currentSpec.widthIn * currentSpec.dpi),
    h: Math.round(currentSpec.heightIn * currentSpec.dpi),
  };

  return (
    <ToolLayout
      title="AI Image to Print-Ready Converter"
      tagline="Convert AI-generated images to print-ready files for DTF/DTG printing"
      icon={<Wand2 className="h-5 w-5" />}
      badge="ai"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleDownload}
          disabled={!resultUrl}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Upload AI Image">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Choose Image
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
              Upload any AI-generated image (Midjourney, DALL-E, Stable Diffusion, etc.). We will analyze it and fix all print issues.
            </p>
          </ToolSection>

          {originalUrl && (
            <>
              <ToolSection title="Print Size">
                <Select
                  value={printSpec.name}
                  onValueChange={(v) => {
                    const spec = PRINT_SIZES.find((s) => s.name === v);
                    if (spec) {
                      setPrintSpec(spec);
                      setTargetDpi(spec.dpi);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRINT_SIZES.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name} ({s.widthIn}×{s.heightIn}" @ {s.dpi} DPI)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {printSpec.name === "Custom" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-xs">Width (in)</Label>
                      <Input type="number" value={customW} step="0.25" onChange={(e) => setCustomW(Number(e.target.value))} className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Height (in)</Label>
                      <Input type="number" value={customH} step="0.25" onChange={(e) => setCustomH(Number(e.target.value))} className="h-8" />
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <Label className="text-xs">Target DPI</Label>
                  <Select value={String(targetDpi)} onValueChange={(v) => setTargetDpi(Number(v))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150">150 DPI (draft)</SelectItem>
                      <SelectItem value="300">300 DPI (standard print)</SelectItem>
                      <SelectItem value="600">600 DPI (high quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-2 text-xs text-accent font-semibold">
                  Target: {targetPixels.w}×{targetPixels.h}px
                </p>
              </ToolSection>

              <ToolSection title="Conversion Options">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Remove background (AI)</Label>
                    <Switch checked={removeBg} onCheckedChange={setRemoveBg} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Denoise</Label>
                    <Switch checked={denoise} onCheckedChange={setDenoise} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Sharpen (unsharp mask)</Label>
                    <Switch checked={sharpen} onCheckedChange={setSharpen} />
                  </div>
                  {sharpen && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Sharpen amount</Label>
                        <span className="text-xs text-muted-foreground">{sharpenAmount}%</span>
                      </div>
                      <Slider value={[sharpenAmount]} min={10} max={100} onValueChange={(v) => setSharpenAmount(v[0])} />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Add bleed (3px safety)</Label>
                    <Switch checked={addBleed} onCheckedChange={setAddBleed} />
                  </div>
                </div>
              </ToolSection>

              <Button
                onClick={processImage}
                disabled={processing}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
                {processing ? "Converting…" : "Convert to Print-Ready"}
              </Button>
            </>
          )}

          <ToolSection title="Common AI Image Issues" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                Low resolution (under 300 DPI)
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                JPEG format (no transparency)
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                White/solid backgrounds
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                Noise/artifacts from generation
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                Soft/blurry edges
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                No bleed margin for cutting
              </li>
            </ul>
          </ToolSection>
        </>
      }
    >
      {!originalUrl ? (
        <EmptyState
          icon={<Wand2 className="h-8 w-8" />}
          title="AI Image to Print-Ready Converter"
          description="Upload any AI-generated image and we will analyze it for print issues, then fix them all: upscale to 300+ DPI, remove backgrounds, denoise, sharpen, and add bleed. Perfect for DTF/DTG printing."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" /> Upload AI Image
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="grid h-full max-h-full w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {/* Original */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original
                </span>
                <span className="text-xs text-muted-foreground">
                  {originalInfo.w}×{originalInfo.h}px | {originalInfo.size}
                </span>
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="absolute inset-0 h-full w-full object-contain p-2" />
              </div>
              {/* Issues detected */}
              {issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Result */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Print-Ready
                </span>
                {resultInfo.w > 0 && (
                  <span className="text-xs text-primary font-semibold">
                    {resultInfo.w}×{resultInfo.h}px @ {resultInfo.dpi} DPI
                  </span>
                )}
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Converting to print-ready…</p>
                  </div>
                )}
                {resultUrl && !processing && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={resultUrl} alt="Print-ready" className="absolute inset-0 h-full w-full object-contain p-2" />
                )}
                {!resultUrl && !processing && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">Click "Convert to Print-Ready" to process</p>
                  </div>
                )}
              </div>
              {/* Fixed issues */}
              {fixedIssues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {fixedIssues.map((fix, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                      <span>{fix}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
