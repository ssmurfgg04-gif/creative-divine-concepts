"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sticker, Upload, Download, Loader2, Scissors } from "lucide-react";
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
  downloadDataURL,
} from "@/lib/canvas-utils";

interface StickerGenProps {
  onBack: () => void;
}

export function StickerGen({ onBack }: StickerGenProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bleed, setBleed] = useState(8); // px
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [showCutLine, setShowCutLine] = useState(true);
  const [cutColor, setCutColor] = useState("#ff0000");
  const [hasTransparency, setHasTransparency] = useState(false);
  const [cutSvg, setCutSvg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a PNG with transparent background");
      return;
    }
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    imageRef.current = img;
    setImageUrl(url);
    setCutSvg(null);
  }, []);

  // Generate sticker with bleed and cut contour
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const maxDim = 800;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const baseW = Math.round(img.naturalWidth * scale);
    const baseH = Math.round(img.naturalHeight * scale);
    const totalBleed = bleed + strokeWidth + 4;
    canvas.width = baseW + totalBleed * 2;
    canvas.height = baseH + totalBleed * 2;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image at offset
    ctx.drawImage(img, totalBleed, totalBleed, baseW, baseH);

    // Get alpha channel
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width, h = canvas.height;

    // Check if image has transparency
    let transCount = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) transCount++;
    }
    setHasTransparency(transCount > 10);

    // Build alpha mask (1 = inside artwork, 0 = outside)
    const mask = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      mask[j] = data[i + 3] > 30 ? 1 : 0;
    }

    // Dilate the mask by `bleed` pixels (multi-pass for circular expansion)
    let current = mask;
    const dilatePass = (src: Uint8Array, radius: number) => {
      // Use a simple separable dilation
      const dst = new Uint8Array(w * h);
      const r = Math.max(1, radius);
      // Horizontal pass
      const tmp = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let found = 0;
          for (let dx = -r; dx <= r && !found; dx++) {
            const nx = x + dx;
            if (nx >= 0 && nx < w && src[y * w + nx]) found = 1;
          }
          tmp[y * w + x] = found;
        }
      }
      // Vertical pass
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let found = 0;
          for (let dy = -r; dy <= r && !found; dy++) {
            const ny = y + dy;
            if (ny >= 0 && ny < h && tmp[ny * w + x]) found = 1;
          }
          dst[y * w + x] = found;
        }
      }
      return dst;
    };

    const dilated = dilatePass(current, bleed);

    // Now paint the sticker:
    // 1. White bleed border where dilated=1 but original mask=0
    // 2. Outer stroke (cut line) at the edge of dilated
    // 3. Original image where mask=1

    ctx.clearRect(0, 0, w, h);

    // White bleed fill
    const bleedImg = ctx.createImageData(w, h);
    for (let j = 0; j < dilated.length; j++) {
      const i = j * 4;
      if (dilated[j]) {
        bleedImg.data[i] = 255;
        bleedImg.data[i + 1] = 255;
        bleedImg.data[i + 2] = 255;
        bleedImg.data[i + 3] = 255;
      }
    }
    ctx.putImageData(bleedImg, 0, 0);

    // Stroke (outline of dilated mask)
    if (strokeWidth > 0) {
      const strokeMask = new Uint8Array(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const j = y * w + x;
          if (dilated[j]) {
            // Edge if any neighbor is 0
            if (!dilated[j - 1] || !dilated[j + 1] || !dilated[j - w] || !dilated[j + w]) {
              strokeMask[j] = 1;
            }
          }
        }
      }
      // Expand stroke inward by strokeWidth
      const strokeExpanded = dilatePass(strokeMask, strokeWidth);
      const strokeImg = ctx.getImageData(0, 0, w, h);
      const [sr, sg, sb] = hexToRgb(strokeColor);
      for (let j = 0; j < strokeExpanded.length; j++) {
        if (strokeExpanded[j] && dilated[j]) {
          const i = j * 4;
          strokeImg.data[i] = sr;
          strokeImg.data[i + 1] = sg;
          strokeImg.data[i + 2] = sb;
          strokeImg.data[i + 3] = 255;
        }
      }
      ctx.putImageData(strokeImg, 0, 0);
    }

    // Draw original image on top
    ctx.drawImage(img, totalBleed, totalBleed, baseW, baseH);

    // Draw cut contour line (red, dashed) for visualization
    if (showCutLine) {
      ctx.strokeStyle = cutColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      // Trace contour: walk the outer edge of dilated mask
      // For simplicity, draw a series of arcs along the boundary
      // Better: use marching squares, but for now use a simpler approach:
      // draw the boundary as connected line segments by sampling the edge
      const boundary: [number, number][] = [];
      const visited = new Uint8Array(w * h);
      // Find first boundary pixel
      let start = -1;
      for (let y = 1; y < h - 1 && start === -1; y++) {
        for (let x = 1; x < w - 1 && start === -1; x++) {
          const j = y * w + x;
          if (dilated[j] && (!dilated[j - 1] || !dilated[j + 1] || !dilated[j - w] || !dilated[j + w])) {
            start = j;
          }
        }
      }
      // Simple boundary trace via neighbor scanning (Moore neighborhood)
      if (start !== -1) {
        let cur = start;
        let dir = 0;
        const dx = [1, 1, 0, -1, -1, -1, 0, 1];
        const dy = [0, 1, 1, 1, 0, -1, -1, -1];
        const maxSteps = w * h;
        for (let step = 0; step < maxSteps; step++) {
          const cx = cur % w;
          const cy = Math.floor(cur / w);
          if (visited[cur] && cur === start) break;
          visited[cur] = 1;
          boundary.push([cx, cy]);
          let found = false;
          for (let d = 0; d < 8; d++) {
            const nd = (dir + d + 6) % 8;
            const nx = cx + dx[nd];
            const ny = cy + dy[nd];
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const nj = ny * w + nx;
            if (dilated[nj] && (!dilated[nj - 1] || !dilated[nj + 1] || !dilated[nj - w] || !dilated[nj + w])) {
              cur = nj;
              dir = nd;
              found = true;
              break;
            }
          }
          if (!found) break;
        }
      }

      if (boundary.length > 2) {
        ctx.beginPath();
        ctx.moveTo(boundary[0][0], boundary[0][1]);
        // Simplify by skipping every Nth point
        const skip = Math.max(1, Math.floor(boundary.length / 500));
        for (let i = skip; i < boundary.length; i += skip) {
          ctx.lineTo(boundary[i][0], boundary[i][1]);
        }
        ctx.closePath();
        ctx.stroke();

        // Build SVG cut path
        let svgPath = `M ${boundary[0][0]} ${boundary[0][1]} `;
        for (let i = skip; i < boundary.length; i += skip) {
          svgPath += `L ${boundary[i][0]} ${boundary[i][1]} `;
        }
        svgPath += "Z";
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <path d="${svgPath}" fill="none" stroke="#ff0000" stroke-width="0.5"/>
</svg>`;
        setCutSvg(svg);
      }
      ctx.setLineDash([]);
    } else {
      setCutSvg(null);
    }
  }, [imageUrl, bleed, strokeWidth, strokeColor, showCutLine, cutColor]);

  const handleDownloadPng = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `cdc-sticker-${Date.now()}.png`);
    toast.success("Print file downloaded!");
  };

  const handleDownloadSvg = () => {
    if (!cutSvg) {
      toast.error("No cut path generated. Enable cut line and use a transparent PNG.");
      return;
    }
    const blob = new Blob([cutSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    downloadDataURL(url, `cdc-sticker-cut-${Date.now()}.svg`);
    toast.success("Cut file downloaded!");
  };

  return (
    <ToolLayout
      title="Sticker Gen"
      tagline="Die-cut sticker generator with cut contour"
      icon={<Sticker className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <>
          <Button variant="outline" onClick={handleDownloadSvg} disabled={!cutSvg} className="gap-2">
            <Scissors className="h-4 w-4" /> Cut SVG
          </Button>
          <Button
            onClick={handleDownloadPng}
            disabled={!imageUrl}
            className="gap-2 bg-accent text-white hover:bg-accent/90"
          >
            <Download className="h-4 w-4" /> Print PNG
          </Button>
        </>
      }
      sidebar={
        <>
          <ToolSection title="Upload Artwork">
            <Button
              variant="outline"
              className="w-full gap-2 border-accent/40 hover:bg-accent/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose PNG
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Use a <span className="text-accent">transparent PNG</span> for best results.
              Run your image through <span className="text-foreground">Image Clipper</span> first if needed.
            </p>
            {imageUrl && !hasTransparency && (
              <p className="mt-2 rounded-md bg-yellow-500/10 p-2 text-xs text-yellow-500">
                ⚠ This image has no transparency. The contour will follow the image edges.
              </p>
            )}
          </ToolSection>

          {imageUrl && (
            <>
              <ToolSection title="Sticker Style">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Bleed (white border)</Label>
                      <span className="text-xs text-muted-foreground">{bleed}px</span>
                    </div>
                    <Slider
                      value={[bleed]}
                      min={0}
                      max={30}
                      onValueChange={(v) => setBleed(v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Border stroke width</Label>
                      <span className="text-xs text-muted-foreground">{strokeWidth}px</span>
                    </div>
                    <Slider
                      value={[strokeWidth]}
                      min={0}
                      max={10}
                      onValueChange={(v) => setStrokeWidth(v[0])}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Border color</Label>
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent"
                    />
                  </div>
                </div>
              </ToolSection>

              <ToolSection title="Cut Contour">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show cut line (red)</Label>
                    <Switch checked={showCutLine} onCheckedChange={setShowCutLine} />
                  </div>
                  {showCutLine && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Cut line color</Label>
                      <input
                        type="color"
                        value={cutColor}
                        onChange={(e) => setCutColor(e.target.value)}
                        className="h-7 w-10 cursor-pointer rounded border border-border bg-transparent"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    The cut contour is auto-generated around your artwork. Export as SVG for plotters (Cricut, Silhouette, etc.).
                  </p>
                </div>
              </ToolSection>
            </>
          )}

          <ToolSection title="Workflow" defaultOpen={false}>
            <ol className="space-y-1.5 text-xs text-muted-foreground">
              <li>1. Remove background using <span className="text-foreground">Image Clipper</span></li>
              <li>2. Upload transparent PNG here</li>
              <li>3. Adjust bleed & stroke</li>
              <li>4. Download Print PNG (with bleed)</li>
              <li>5. Download Cut SVG (for plotter)</li>
            </ol>
          </ToolSection>
        </>
      }
    >
      {!imageUrl ? (
        <EmptyState
          icon={<Sticker className="h-8 w-8" />}
          title="Create die-cut stickers"
          description="Upload a transparent PNG to automatically generate a die-cut sticker with white bleed border and cutting contour. Export print-ready PNG + SVG cut path for Cricut/Silhouette."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-accent text-white hover:bg-accent/90"
            >
              <Upload className="h-4 w-4" /> Upload Transparent PNG
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="flex flex-col items-center">
            <div className="checker-bg overflow-hidden rounded-lg border border-border shadow-2xl">
              <canvas ref={canvasRef} className="max-h-[75vh] max-w-full" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              White bleed: {bleed}px • Border: {strokeWidth}px • {showCutLine ? "Cut line shown" : "No cut line"}
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return [0, 0, 0];
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
}
