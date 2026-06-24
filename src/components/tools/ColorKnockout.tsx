"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Droplet, Upload, Download, Eye, RotateCcw, Pipette, Plus, X, Layers } from "lucide-react";
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
  hexToRgb,
  rgbToHex,
} from "@/lib/canvas-utils";

interface ColorKnockoutProps {
  onBack: () => void;
}

export function ColorKnockout({ onBack }: ColorKnockoutProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [knockColors, setKnockColors] = useState<string[]>(["#ffffff"]);
  const [tolerance, setTolerance] = useState(40);
  const [feather, setFeather] = useState(1);
  const [invert, setInvert] = useState(false);
  const [showUnderbase, setShowUnderbase] = useState(false);
  const [showChecker, setShowChecker] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<number | "new" | null>(null);
  const [viewMode, setViewMode] = useState<"result" | "separation" | "halftone">("result");
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

  // Re-render canvas whenever inputs change
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    // Limit canvas size for preview performance
    const maxDim = 1200;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (viewMode === "halftone") {
      // Convert to halftone preview
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const lum = new Float32Array(canvas.width * canvas.height);
      for (let i = 0, j = 0; i < data.data.length; i += 4, j++) {
        lum[j] = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / (3 * 255);
      }
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      const cellSize = Math.max(4, Math.round(tolerance / 6));
      for (let y = 0; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
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
      return;
    }

    if (viewMode === "separation") {
      // Show color separation: posterize to identify distinct colors
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const levels = 4;
      const step = 255 / (levels - 1);
      // Quantize
      for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = Math.round(data.data[i] / step) * step;
        data.data[i + 1] = Math.round(data.data[i + 1] / step) * step;
        data.data[i + 2] = Math.round(data.data[i + 2] / step) * step;
      }
      ctx.putImageData(data, 0, 0);
      return;
    }

    // Default: result mode (knockout)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const tol = tolerance * 3; // 0-255*3 range

    // Pre-compute knockout colors as RGB tuples
    const knockRGBs = knockColors.map(hexToRgb);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Check if matches any of the knockout colors
      let matches = false;
      for (const [tr, tg, tb] of knockRGBs) {
        const dist = Math.abs(r - tr) + Math.abs(g - tg) + Math.abs(b - tb);
        if (dist <= tol) {
          matches = true;
          break;
        }
      }
      if (invert) matches = !matches;

      if (matches) {
        if (showUnderbase) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          data[i + 3] = 0;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Optional feather pass
    if (feather > 0 && !showUnderbase) {
      const tmp = document.createElement("canvas");
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const tctx = tmp.getContext("2d")!;
      tctx.drawImage(canvas, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(${feather}px)`;
      ctx.drawImage(tmp, 0, 0);
      ctx.filter = "none";
    }
  }, [imageUrl, knockColors, tolerance, feather, invert, showUnderbase, viewMode]);

  const pickColor = (target: number | "new") => {
    setPickingTarget(target);
    setIsPicking(true);
    toast.info("Click on the image to pick a color");
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPicking || !canvasRef.current || pickingTarget === null) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    // Re-draw original first to get the actual pixel color
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const picked = rgbToHex(pixel[0], pixel[1], pixel[2]);
    if (pickingTarget === "new") {
      setKnockColors((prev) => [...prev, picked]);
    } else {
      setKnockColors((prev) => prev.map((c, i) => (i === pickingTarget ? picked : c)));
    }
    setIsPicking(false);
    setPickingTarget(null);
    toast.success(`Picked: ${picked}`);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `cdc-knockout-${Date.now()}.png`);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Color Knockout"
      tagline="Remove colors for DTF/DTG — show garment through design"
      icon={<Droplet className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <Button
          onClick={handleDownload}
          disabled={!imageUrl}
          className="gap-2 bg-primary text-white hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Download PNG
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
              <ToolSection title="View Mode">
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    size="sm"
                    variant={viewMode === "result" ? "default" : "outline"}
                    className="text-xs"
                    onClick={() => setViewMode("result")}
                  >
                    Result
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "separation" ? "default" : "outline"}
                    className="text-xs gap-1"
                    onClick={() => setViewMode("separation")}
                  >
                    <Layers className="h-3 w-3" /> Separation
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "halftone" ? "default" : "outline"}
                    className="text-xs"
                    onClick={() => setViewMode("halftone")}
                  >
                    Halftone
                  </Button>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {viewMode === "result" && "Standard knockout view"}
                  {viewMode === "separation" && "Color separation preview (4 levels)"}
                  {viewMode === "halftone" && "Halftone dot pattern (use Tolerance slider for cell size)"}
                </p>
              </ToolSection>

              <ToolSection title={`Knockout Colors (${knockColors.length})`}>
                <div className="space-y-2">
                  {knockColors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) =>
                          setKnockColors((prev) => prev.map((c, i) => (i === idx ? e.target.value : c)))
                        }
                        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) =>
                          setKnockColors((prev) => prev.map((c, i) => (i === idx ? e.target.value : c)))
                        }
                        className="h-8 flex-1 rounded border border-border bg-background px-2 font-mono text-xs"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => pickColor(idx)}
                        className="h-8 w-8 shrink-0"
                        title="Pick from image"
                      >
                        <Pipette className="h-3.5 w-3.5" />
                      </Button>
                      {knockColors.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setKnockColors((prev) => prev.filter((_, i) => i !== idx))}
                          className="h-8 w-8 shrink-0 text-destructive"
                          title="Remove color"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 mt-2"
                    onClick={() => pickColor("new")}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Another Color
                  </Button>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Tolerance</Label>
                      <span className="text-xs text-muted-foreground">{tolerance}</span>
                    </div>
                    <Slider
                      value={[tolerance]}
                      min={1}
                      max={100}
                      onValueChange={(v) => setTolerance(v[0])}
                    />
                  </div>
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
                </div>
              </ToolSection>

              <ToolSection title="DTF/DTG Options">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Invert (knockout everything EXCEPT color)</Label>
                    <Switch checked={invert} onCheckedChange={setInvert} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show as white underbase</Label>
                    <Switch checked={showUnderbase} onCheckedChange={setShowUnderbase} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show transparency grid</Label>
                    <Switch checked={showChecker} onCheckedChange={setShowChecker} />
                  </div>
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

          <ToolSection title="Use Cases" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• <span className="text-foreground">DTF transfers:</span> Remove white backgrounds</li>
              <li>• <span className="text-foreground">DTG dark garments:</span> Generate white underbase</li>
              <li>• <span className="text-foreground">Apparel:</span> Knockout shirt color to show through</li>
              <li>• <span className="text-foreground">Screen print:</span> Color separation prep</li>
            </ul>
          </ToolSection>
        </>
      }
    >
      {!imageUrl ? (
        <EmptyState
          icon={<Droplet className="h-8 w-8" />}
          title="Remove any color from your artwork"
          description="Click on a color in your image to make it transparent — perfect for letting garment color show through your DTF/DTG prints. Includes white underbase generation for dark garments."
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
          <div className="flex max-h-full max-w-full flex-col items-center">
            <div
              className={`overflow-hidden rounded-lg border border-border shadow-2xl ${
                showChecker ? "checker-bg" : "bg-white"
              }`}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-h-[70vh] max-w-full cursor-crosshair"
                style={{ cursor: isPicking ? "crosshair" : "default" }}
              />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Live preview — adjust tolerance & feather in the sidebar
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
