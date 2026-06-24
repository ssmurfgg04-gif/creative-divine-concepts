"use client";

import { useCallback, useRef, useState } from "react";
import { Scissors, Upload, Download, Loader2, Image as ImageIcon, RefreshCw, Wand2 } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  fileToDataURL,
  loadImage,
  canvasToBlob,
  downloadBlob,
} from "@/lib/canvas-utils";

interface ImageClipperProps {
  onBack: () => void;
}

export function ImageClipper({ onBack }: ImageClipperProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [feather, setFeather] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showBg, setShowBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }
    setLoading(true);
    setStage("Loading image…");
    try {
      const url = await fileToDataURL(file);
      setOriginalUrl(url);
      setResultUrl(null);

      setStage("Loading AI model (first run downloads ~80MB)…");
      // Dynamic import so the heavy model only loads when needed
      const { removeBackground } = await import("@imgly/background-removal");
      setStage("Removing background…");
      const blob = await removeBackground(url, {
        output: { format: "image/png", quality: 0.95 },
        progress: (key, current, total) => {
          setStage(`${key}: ${Math.round((current / total) * 100)}%`);
        },
      });
      const result = URL.createObjectURL(blob);
      setResultUrl(result);
      toast.success("Background removed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to remove background");
    } finally {
      setLoading(false);
      setStage("");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const img = await loadImage(resultUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (showBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      // Optional feather: simple alpha blur via offscreen + filter
      if (feather > 0) {
        ctx.filter = `blur(${feather * 0.4}px)`;
      }
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `cdc-clip-${Date.now()}.png`);
      toast.success("Downloaded!");
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
    }
  };

  return (
    <ToolLayout
      title="Image Clipper"
      tagline="One-click AI background removal — runs in your browser"
      icon={<Scissors className="h-5 w-5" />}
      badge="ai"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleDownload}
          disabled={!resultUrl}
          className="gap-2 bg-accent text-white hover:bg-accent/90"
        >
          <Download className="h-4 w-4" /> Download PNG
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Upload Image">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2 border-accent/40 hover:bg-accent/10"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                <Upload className="h-4 w-4" /> Choose Image
              </Button>
              <Input
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
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP. Max ~10MB. Image is processed locally — never uploaded.
              </p>
            </div>
          </ToolSection>

          {originalUrl && (
            <ToolSection title="Result Options">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Edge Feather</Label>
                    <span className="text-xs text-muted-foreground">{feather}px</span>
                  </div>
                  <Slider
                    value={[feather]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(v) => setFeather(v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Background Fill (optional)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showBg}
                      onChange={(e) => setShowBg(e.target.checked)}
                      className="h-4 w-4 rounded accent-accent"
                    />
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 flex-1 font-mono text-xs"
                    />
                  </div>
                </div>

                {originalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      setOriginalUrl(null);
                      setResultUrl(null);
                    }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Start Over
                  </Button>
                )}
              </div>
            </ToolSection>
          )}

          <ToolSection title="How It Works" defaultOpen={false}>
            <ol className="space-y-2 text-xs text-muted-foreground">
              <li>1. Upload any image with a subject.</li>
              <li>2. The AI model runs entirely in your browser (no upload).</li>
              <li>3. Adjust feather / background if needed.</li>
              <li>4. Download as transparent PNG.</li>
              <li className="pt-2 text-accent">
                First run downloads the model (~80MB, cached afterwards).
              </li>
            </ol>
          </ToolSection>
        </>
      }
    >
      {!originalUrl ? (
        <EmptyState
          icon={<Scissors className="h-8 w-8" />}
          title="Drop an image to clip"
          description="One-click AI background removal. Perfect for product photos, T-shirt artwork, and logos. 100% in your browser — no upload, no API key."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-accent text-white hover:bg-accent/90"
            >
              <Wand2 className="h-4 w-4" /> Choose Image
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="grid h-full max-h-full w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" /> Original
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Scissors className="h-3.5 w-3.5" /> Clipped
              </div>
              <div className="checker-bg relative flex-1 overflow-hidden rounded-lg border border-border">
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="text-sm text-muted-foreground">{stage}</p>
                  </div>
                )}
                {resultUrl && !loading && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resultUrl}
                    alt="Clipped"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="pointer-events-none absolute inset-0"
      />
    </ToolLayout>
  );
}
