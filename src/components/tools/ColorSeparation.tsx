"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Layers, Upload, Download, Loader2, Eye, Plus, Trash2, Settings2 } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fileToDataURL, loadImage, canvasToBlob, downloadBlob } from "@/lib/canvas-utils";

interface ColorSeparationProps {
  onBack: () => void;
}

interface Separation {
  id: string;
  color: string;
  name: string;
  count: number;
  preview: string | null;
}

export function ColorSeparation({ onBack }: ColorSeparationProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [separations, setSeparations] = useState<Separation[]>([]);
  const [loading, setLoading] = useState(false);
  const [colorCount, setColorCount] = useState(6);
  const [selectedSep, setSelectedSep] = useState<string | null>(null);
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
    setOriginalUrl(url);
    setSeparations([]);
  }, []);

  const separateColors = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const maxDim = 600;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Quantize colors using k-means-like approach
      const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
      const step = 32; // quantization step
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // skip transparent
        const qr = Math.floor(data[i] / step) * step;
        const qg = Math.floor(data[i + 1] / step) * step;
        const qb = Math.floor(data[i + 2] / step) * step;
        const key = `${qr},${qg},${qb}`;
        if (!colorMap.has(key)) {
          colorMap.set(key, { r: qr, g: qg, b: qb, count: 0 });
        }
        colorMap.get(key)!.count++;
      }

      // Sort by count, take top N
      const sorted = Array.from(colorMap.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, colorCount);

      // Generate separation previews
      const seps: Separation[] = [];
      for (const [key, color] of sorted) {
        const sepCanvas = document.createElement("canvas");
        sepCanvas.width = canvas.width;
        sepCanvas.height = canvas.height;
        const sepCtx = sepCanvas.getContext("2d")!;
        const sepData = sepCtx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < data.length; i += 4) {
          const qr = Math.floor(data[i] / step) * step;
          const qg = Math.floor(data[i + 1] / step) * step;
          const qb = Math.floor(data[i + 2] / step) * step;
          if (`${qr},${qg},${qb}` === key) {
            // Keep original color
            sepData.data[i] = data[i];
            sepData.data[i + 1] = data[i + 1];
            sepData.data[i + 2] = data[i + 2];
            sepData.data[i + 3] = 255;
          } else {
            sepData.data[i + 3] = 0;
          }
        }
        sepCtx.putImageData(sepData, 0, 0);
        const hex = `#${[color.r, color.g, color.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
        seps.push({
          id: `sep-${Date.now()}-${seps.length}`,
          color: hex,
          name: `Color ${seps.length + 1}`,
          count: color.count,
          preview: sepCanvas.toDataURL("image/png"),
        });
      }
      setSeparations(seps);
      toast.success(`Separated into ${seps.length} color plates`);
    } catch (err: any) {
      toast.error(err?.message || "Separation failed");
    } finally {
      setLoading(false);
    }
  }, [colorCount]);

  const downloadSeparation = async (sep: Separation) => {
    if (!sep.preview) return;
    const res = await fetch(sep.preview);
    const blob = await res.blob();
    downloadBlob(blob, `cdc-color-separation-${sep.name}-${Date.now()}.png`);
    toast.success(`Downloaded ${sep.name}`);
  };

  const downloadAll = async () => {
    for (const sep of separations) {
      await downloadSeparation(sep);
      await new Promise((r) => setTimeout(r, 300));
    }
    toast.success("Downloaded all separations");
  };

  return (
    <ToolLayout
      title="Color Separation Studio"
      tagline="Split multi-color designs into individual print plates for screen printing"
      icon={<Layers className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        separations.length > 0 && (
          <Button onClick={downloadAll} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" /> Download All
          </Button>
        )
      }
      sidebar={
        <>
          <ToolSection title="Upload Design">
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
              Upload a multi-color design. We will analyze it and split each color into a separate print plate.
            </p>
          </ToolSection>

          {originalUrl && (
            <>
              <ToolSection title="Settings">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Number of colors</Label>
                    <span className="text-xs text-muted-foreground">{colorCount}</span>
                  </div>
                  <Slider value={[colorCount]} min={2} max={12} onValueChange={(v) => setColorCount(v[0])} />
                </div>
              </ToolSection>

              <Button
                onClick={separateColors}
                disabled={loading}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
                {loading ? "Separating…" : "Separate Colors"}
              </Button>
            </>
          )}

          <ToolSection title="What is Color Separation?" defaultOpen={false}>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Color separation splits a multi-color design into individual plates, one per color. Each plate is printed separately then registered (aligned) on press. This is essential for screen printing, where each color requires a separate screen.
            </p>
          </ToolSection>
        </>
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      {!originalUrl ? (
        <EmptyState
          icon={<Layers className="h-8 w-8" />}
          title="Color Separation Studio"
          description="Upload a multi-color design and automatically split it into individual print plates. Each color becomes a separate PNG you can use for screen printing, vinyl cutting, or DTF layer preparation. No Photoshop required."
          action={
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4" /> Upload Design
            </Button>
          }
        />
      ) : separations.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="text-center">
            <div className="checker-bg inline-block rounded-lg border border-border p-4 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="max-h-[60vh] max-w-full object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">Click "Separate Colors" to split this design</p>
          </div>
        </div>
      ) : (
        <div className="h-full w-full overflow-auto p-6 scrollbar-thin">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="font-display font-bold text-sm mb-3 text-foreground">Original Design</h3>
              <div className="checker-bg inline-block rounded-lg border border-border p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Original" className="max-h-40 object-contain" />
              </div>
            </div>
            <h3 className="font-display font-bold text-sm mb-3 text-foreground">Color Plates ({separations.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {separations.map((sep) => (
                <div
                  key={sep.id}
                  className="nura-card p-3 cursor-pointer hover:border-primary/40 transition"
                  onClick={() => setSelectedSep(selectedSep === sep.id ? null : sep.id)}
                >
                  <div className="checker-bg rounded-md overflow-hidden mb-2 border border-border">
                    {sep.preview && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={sep.preview} alt={sep.name} className="w-full h-32 object-contain" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border border-border shrink-0" style={{ backgroundColor: sep.color }} />
                    <span className="text-xs font-semibold text-foreground">{sep.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground font-mono">{sep.color}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSeparation(sep);
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
