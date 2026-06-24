"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, Download, Type, ArrowRight, Square, Highlighter, MousePointer2, Trash2, Undo2 } from "lucide-react";
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

interface ScreenshotFXProps {
  onBack: () => void;
}

type Tool = "select" | "arrow" | "rect" | "text" | "highlight" | "blur";

interface Annotation {
  type: Tool;
  x: number;
  y: number;
  w?: number;
  h?: number;
  text?: string;
  color: string;
  size: number;
}

export function ScreenshotFX({ onBack }: ScreenshotFXProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("arrow");
  const [color, setColor] = useState("#f36a21");
  const [size, setSize] = useState(4);
  const [fontSize, setFontSize] = useState(28);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [textDraft, setTextDraft] = useState("");
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
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
    setAnnotations([]);
  }, []);

  // Setup main canvas with image + filter
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || !overlayRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const maxDim = 1400;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";
    drawAnnotations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, brightness, contrast, saturation]);

  const drawAnnotations = useCallback(() => {
    if (!overlayRef.current) return;
    const overlay = overlayRef.current;
    const ctx = overlay.getContext("2d")!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    annotations.forEach((a) => drawSingle(ctx, a));
  }, [annotations]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  const drawSingle = (ctx: CanvasRenderingContext2D, a: Annotation) => {
    ctx.strokeStyle = a.color;
    ctx.fillStyle = a.color;
    ctx.lineWidth = a.size;
    ctx.font = `${a.size * 6}px Inter, sans-serif`;
    ctx.textBaseline = "top";

    if (a.type === "arrow" && a.w !== undefined && a.h !== undefined) {
      const headLen = 15 + a.size * 2;
      const angle = Math.atan2(a.h, a.w);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + a.w, a.y + a.h);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(a.x + a.w, a.y + a.h);
      ctx.lineTo(
        a.x + a.w - headLen * Math.cos(angle - Math.PI / 6),
        a.y + a.h - headLen * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        a.x + a.w - headLen * Math.cos(angle + Math.PI / 6),
        a.y + a.h - headLen * Math.sin(angle + Math.PI / 6),
      );
      ctx.closePath();
      ctx.fill();
    } else if (a.type === "rect" && a.w !== undefined && a.h !== undefined) {
      ctx.strokeRect(a.x, a.y, a.w, a.h);
    } else if (a.type === "text" && a.text) {
      // Background pill
      const metrics = ctx.measureText(a.text);
      const padding = a.size * 2;
      const tw = metrics.width + padding * 2;
      const th = a.size * 6 + padding;
      ctx.fillStyle = a.color;
      ctx.beginPath();
      const r = 6;
      ctx.roundRect(a.x - padding, a.y - padding / 2, tw, th, r);
      ctx.fill();
      ctx.fillStyle = getContrastColor(a.color);
      ctx.fillText(a.text, a.x + padding - padding, a.y - padding / 2 + padding / 2);
    } else if (a.type === "highlight" && a.w !== undefined && a.h !== undefined) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = a.color;
      ctx.fillRect(a.x, a.y, a.w, a.h);
      ctx.restore();
    } else if (a.type === "blur" && a.w !== undefined && a.h !== undefined) {
      // Pixelate region
      const imgCanvas = canvasRef.current;
      if (!imgCanvas) return;
      const ctxImg = imgCanvas.getContext("2d")!;
      const block = Math.max(4, Math.floor(Math.min(Math.abs(a.w), Math.abs(a.h)) / 12));
      const x = Math.min(a.x, a.x + a.w);
      const y = Math.min(a.y, a.y + a.h);
      const w = Math.abs(a.w);
      const h = Math.abs(a.h);
      const tmp = document.createElement("canvas");
      tmp.width = Math.max(1, Math.ceil(w / block));
      tmp.height = Math.max(1, Math.ceil(h / block));
      const tctx = tmp.getContext("2d")!;
      tctx.imageSmoothingEnabled = false;
      tctx.drawImage(imgCanvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
      ctx.imageSmoothingEnabled = true;
    }
  };

  const getContrastColor = (hex: string) => {
    const m = hex.replace("#", "").match(/.{2}/g);
    if (!m) return "#fff";
    const r = parseInt(m[0], 16);
    const g = parseInt(m[1], 16);
    const b = parseInt(m[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? "#000" : "#fff";
  };

  const getCanvasPos = (e: React.MouseEvent) => {
    const overlay = overlayRef.current!;
    const rect = overlay.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * overlay.width;
    const y = ((e.clientY - rect.top) / rect.height) * overlay.height;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    if (tool === "text") {
      setTextPos(pos);
      setTextDraft("");
      return;
    }
    setDrawing(true);
    setStart(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !start) return;
    const pos = getCanvasPos(e);
    // Preview annotation
    const overlay = overlayRef.current!;
    const ctx = overlay.getContext("2d")!;
    drawAnnotations();
    drawSingle(ctx, {
      type: tool,
      x: start.x,
      y: start.y,
      w: pos.x - start.x,
      h: pos.y - start.y,
      color,
      size: tool === "text" ? fontSize / 6 : size,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawing || !start) return;
    const pos = getCanvasPos(e);
    setAnnotations((prev) => [
      ...prev,
      {
        type: tool,
        x: start.x,
        y: start.y,
        w: pos.x - start.x,
        h: pos.y - start.y,
        color,
        size: tool === "text" ? fontSize / 6 : size,
      },
    ]);
    setDrawing(false);
    setStart(null);
  };

  const handleTextSubmit = () => {
    if (!textPos || !textDraft.trim()) {
      setTextPos(null);
      return;
    }
    setAnnotations((prev) => [
      ...prev,
      {
        type: "text",
        x: textPos.x,
        y: textPos.y,
        text: textDraft,
        color,
        size: fontSize / 6,
      },
    ]);
    setTextDraft("");
    setTextPos(null);
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !overlayRef.current) return;
    // Composite both canvases
    const out = document.createElement("canvas");
    out.width = canvasRef.current.width;
    out.height = canvasRef.current.height;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(canvasRef.current, 0, 0);
    ctx.drawImage(overlayRef.current, 0, 0);
    const blob = await canvasToBlob(out, "image/png");
    downloadBlob(blob, `cdc-screenshot-${Date.now()}.png`);
    toast.success("Downloaded!");
  };

  const TOOLS: { id: Tool; name: string; icon: any }[] = [
    { id: "arrow", name: "Arrow", icon: ArrowRight },
    { id: "rect", name: "Rectangle", icon: Square },
    { id: "text", name: "Text", icon: Type },
    { id: "highlight", name: "Highlight", icon: Highlighter },
    { id: "blur", name: "Pixelate", icon: MousePointer2 },
  ];

  return (
    <ToolLayout
      title="ScreenshotFX"
      tagline="Annotate & enhance screenshots for tutorials and client proofs"
      icon={<Camera className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setAnnotations((prev) => prev.slice(0, -1))}
            disabled={annotations.length === 0}
          >
            <Undo2 className="h-4 w-4" /> Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setAnnotations([])}
            disabled={annotations.length === 0}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!imageUrl}
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        </>
      }
      sidebar={
        <>
          <ToolSection title="Upload Screenshot">
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
              <ToolSection title="Annotation Tools">
                <div className="grid grid-cols-3 gap-1.5">
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition ${
                        tool === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <t.icon className="h-4 w-4" />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </ToolSection>

              <ToolSection title="Style">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                      />
                      <Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
                    </div>
                  </div>
                  {tool === "text" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Font size</Label>
                        <span className="text-xs text-muted-foreground">{fontSize}px</span>
                      </div>
                      <Slider value={[fontSize]} min={12} max={80} onValueChange={(v) => setFontSize(v[0])} />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Stroke width</Label>
                        <span className="text-xs text-muted-foreground">{size}px</span>
                      </div>
                      <Slider value={[size]} min={1} max={20} onValueChange={(v) => setSize(v[0])} />
                    </div>
                  )}
                </div>
              </ToolSection>

              <ToolSection title="Image Enhancement">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Brightness</Label>
                      <span className="text-xs text-muted-foreground">{brightness}%</span>
                    </div>
                    <Slider value={[brightness]} min={50} max={150} onValueChange={(v) => setBrightness(v[0])} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Contrast</Label>
                      <span className="text-xs text-muted-foreground">{contrast}%</span>
                    </div>
                    <Slider value={[contrast]} min={50} max={150} onValueChange={(v) => setContrast(v[0])} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Saturation</Label>
                      <span className="text-xs text-muted-foreground">{saturation}%</span>
                    </div>
                    <Slider value={[saturation]} min={0} max={200} onValueChange={(v) => setSaturation(v[0])} />
                  </div>
                </div>
              </ToolSection>

              <p className="text-xs text-muted-foreground">
                Annotations: <span className="text-primary font-semibold">{annotations.length}</span>
              </p>
            </>
          )}
        </>
      }
    >
      {!imageUrl ? (
        <EmptyState
          icon={<Camera className="h-8 w-8" />}
          title="Polish your screenshots"
          description="Add arrows, text, highlights, and pixelation to screenshots. Adjust brightness/contrast/saturation. Perfect for tutorials, client proofs, and marketing materials."
          action={
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" /> Upload Screenshot
            </Button>
          }
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-6">
          <div ref={containerRef} className="relative max-h-full max-w-full overflow-auto">
            <div className="relative inline-block">
              <canvas ref={canvasRef} className="block max-h-[80vh] max-w-full" />
              <canvas
                ref={overlayRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="absolute inset-0 cursor-crosshair"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Tool: <span className="text-primary font-semibold capitalize">{tool}</span> • Click & drag to draw
          </p>

          {textPos && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card p-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTextSubmit();
                    if (e.key === "Escape") setTextPos(null);
                  }}
                  placeholder="Enter text…"
                  className="h-8 w-64"
                />
                <Button size="sm" onClick={handleTextSubmit} className="bg-primary text-white hover:bg-primary/90">
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setTextPos(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
