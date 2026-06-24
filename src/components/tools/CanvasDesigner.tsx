"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  Upload,
  Download,
  Type,
  Trash2,
  Layers,
  RotateCw,
  Copy,
  BringToFront,
  SendToBack,
  Grid3x3,
  Wand2,
  Image as ImageIcon,
} from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PRINT_SIZES } from "@/lib/tools";
import { fileToDataURL, loadImage, canvasToBlob, downloadBlob } from "@/lib/canvas-utils";

interface CanvasDesignerProps {
  onBack: () => void;
}

interface LayerInfo {
  id: string;
  type: "image" | "text";
  name: string;
}

export function CanvasDesigner({ onBack }: CanvasDesignerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sizeLabel, setSizeLabel] = useState(PRINT_SIZES[0].label);
  const [widthIn, setWidthIn] = useState(PRINT_SIZES[0].w);
  const [heightIn, setHeightIn] = useState(PRINT_SIZES[0].h);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(0.5); // inches
  const [dpi, setDpi] = useState(300);
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [text, setText] = useState("Your Text");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [ready, setReady] = useState(false);

  // Preview scale (canvas displayed smaller than actual print resolution)
  const previewScale = 0.25; // shows ~75 dpi preview for 300 dpi output

  // Initialize fabric canvas
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fabric = (await import("fabric")).default;
      if (cancelled || !canvasElRef.current) return;
      const w = widthIn * dpi * previewScale;
      const h = heightIn * dpi * previewScale;
      const canvas = new fabric.Canvas(canvasElRef.current, {
        backgroundColor: transparent ? "transparent" : bgColor,
        selection: true,
        preserveObjectStacking: true,
      });
      canvas.setDimensions({ width: w, height: h });
      fabricRef.current = { fabric, canvas };

      // Selection events
      canvas.on("selection:created", (e: any) => setSelected(e.selected?.[0] || null));
      canvas.on("selection:updated", (e: any) => setSelected(e.selected?.[0] || null));
      canvas.on("selection:cleared", () => setSelected(null));
      canvas.on("object:modified", () => syncLayers());

      drawGridOverlay();
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (fabricRef.current?.canvas) {
        fabricRef.current.canvas.dispose();
        fabricRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when size/dpi changes
  useEffect(() => {
    if (!fabricRef.current) return;
    const { canvas } = fabricRef.current;
    const w = widthIn * dpi * previewScale;
    const h = heightIn * dpi * previewScale;
    canvas.setDimensions({ width: w, height: h });
    drawGridOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthIn, heightIn, dpi]);

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.canvas.backgroundColor = transparent ? "transparent" : bgColor;
    fabricRef.current.canvas.renderAll();
  }, [bgColor, transparent]);

  const drawGridOverlay = useCallback(() => {
    if (!fabricRef.current || !showGrid) return;
    const { fabric, canvas } = fabricRef.current;
    // Remove old grid lines
    canvas.getObjects().filter((o: any) => o.isGridLine).forEach((o: any) => canvas.remove(o));
    const gridPx = gridSize * dpi * previewScale;
    const w = canvas.getWidth();
    const h = canvas.getHeight();
    for (let x = gridPx; x < w; x += gridPx) {
      const line = new fabric.Line([x, 0, x, h], {
        stroke: "rgba(243, 106, 33, 0.15)",
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as any).isGridLine = true;
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    for (let y = gridPx; y < h; y += gridPx) {
      const line = new fabric.Line([0, y, w, y], {
        stroke: "rgba(243, 106, 33, 0.15)",
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      (line as any).isGridLine = true;
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    canvas.renderAll();
  }, [showGrid, gridSize, dpi, previewScale]);

  useEffect(() => {
    drawGridOverlay();
  }, [drawGridOverlay]);

  const syncLayers = useCallback(() => {
    if (!fabricRef.current) return;
    const objs = fabricRef.current.canvas.getObjects().filter((o: any) => !o.isGridLine);
    setLayers(
      objs.map((o: any, i: number) => ({
        id: (o as any).cdcId || `obj-${i}`,
        type: o.text ? "text" : "image",
        name: o.text ? `"${o.text.slice(0, 20)}"` : `Image ${i + 1}`,
      })),
    );
  }, []);

  const applySizePreset = (label: string) => {
    const preset = PRINT_SIZES.find((p) => p.label === label);
    if (!preset) return;
    setSizeLabel(label);
    if (preset.label === "Custom") {
      // keep current custom dims
      return;
    }
    setWidthIn(preset.w);
    setHeightIn(preset.h);
  };

  const handleAddImage = async (file: File) => {
    if (!fabricRef.current) return;
    const { fabric, canvas } = fabricRef.current;
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    const fImg = new fabric.Image(img);
    // Scale to fit nicely
    const maxW = canvas.getWidth() * 0.5;
    const maxH = canvas.getHeight() * 0.5;
    const scale = Math.min(maxW / fImg.width!, maxH / fImg.height!, 1);
    fImg.scale(scale);
    fImg.set({
      left: canvas.getWidth() / 2 - (fImg.width! * scale) / 2,
      top: canvas.getHeight() / 2 - (fImg.height! * scale) / 2,
      cornerColor: "#f36a21",
      cornerStrokeColor: "#f36a21",
      borderColor: "#f36a21",
      transparentCorners: false,
      cornerSize: 10,
    });
    (fImg as any).cdcId = `img-${Date.now()}`;
    canvas.add(fImg);
    canvas.setActiveObject(fImg);
    canvas.renderAll();
    syncLayers();
    toast.success("Image added");
  };

  const handleAddText = () => {
    if (!fabricRef.current) return;
    const { fabric, canvas } = fabricRef.current;
    const t = new fabric.IText(text || "Your Text", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      fontFamily: "Inter, sans-serif",
      fontSize: fontSize * previewScale,
      fill: textColor,
      cornerColor: "#f36a21",
      cornerStrokeColor: "#f36a21",
      borderColor: "#f36a21",
      transparentCorners: false,
    });
    (t as any).cdcId = `txt-${Date.now()}`;
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.renderAll();
    syncLayers();
    toast.success("Text added — double-click to edit");
  };

  // Sync selected object props back to canvas
  useEffect(() => {
    if (!selected || !fabricRef.current) return;
    if (selected.text !== undefined) {
      selected.set("text", text);
      fabricRef.current.canvas.renderAll();
    }
  }, [text]);

  useEffect(() => {
    if (!selected || !fabricRef.current) return;
    if (selected.text !== undefined) {
      selected.set("fontSize", fontSize * previewScale);
      fabricRef.current.canvas.renderAll();
    }
  }, [fontSize]);

  useEffect(() => {
    if (!selected || !fabricRef.current) return;
    if (selected.text !== undefined) {
      selected.set("fill", textColor);
      fabricRef.current.canvas.renderAll();
    }
  }, [textColor]);

  // When selection changes, pull values from object
  useEffect(() => {
    if (!selected) return;
    if (selected.text !== undefined) {
      setText(selected.text);
      setFontSize((selected.fontSize || 48) / previewScale);
      setTextColor(typeof selected.fill === "string" ? selected.fill : "#000000");
    }
  }, [selected]);

  const deleteSelected = () => {
    if (!fabricRef.current || !selected) return;
    fabricRef.current.canvas.remove(selected);
    fabricRef.current.canvas.discardActiveObject();
    setSelected(null);
    syncLayers();
  };

  const duplicateSelected = () => {
    if (!fabricRef.current || !selected) return;
    const { canvas } = fabricRef.current;
    selected.clone((cloned: any) => {
      cloned.set({ left: (selected.left || 0) + 20, top: (selected.top || 0) + 20 });
      (cloned as any).cdcId = `copy-${Date.now()}`;
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncLayers();
    });
  };

  const bringToFront = () => {
    if (!fabricRef.current || !selected) return;
    fabricRef.current.canvas.bringObjectToFront(selected);
    fabricRef.current.canvas.renderAll();
    syncLayers();
  };

  const sendToBack = () => {
    if (!fabricRef.current || !selected) return;
    fabricRef.current.canvas.sendObjectToBack(selected);
    // Re-send grid to back too
    drawGridOverlay();
    syncLayers();
  };

  const rotateSelected = (deg: number) => {
    if (!fabricRef.current || !selected) return;
    selected.rotate(((selected.angle || 0) + deg) % 360);
    fabricRef.current.canvas.renderAll();
  };

  const autoArrange = () => {
    if (!fabricRef.current) return;
    const { canvas } = fabricRef.current;
    const objs = canvas.getObjects().filter((o: any) => !o.isGridLine);
    if (objs.length === 0) return;
    // Simple bin-packing: stack items left-to-right, wrap when exceeding width
    const canvasW = canvas.getWidth();
    const margin = 10;
    let x = margin;
    let y = margin;
    let rowMaxH = 0;
    objs.forEach((o: any) => {
      const bound = o.getBoundingRect();
      if (x + bound.width + margin > canvasW) {
        x = margin;
        y += rowMaxH + margin;
        rowMaxH = 0;
      }
      o.set({ left: x - bound.left + o.left, top: y - bound.top + o.top });
      o.setCoords();
      x += bound.width + margin;
      rowMaxH = Math.max(rowMaxH, bound.height);
    });
    canvas.renderAll();
    toast.success("Auto-arranged (bin-packed)");
  };

  const handleExport = async () => {
    if (!fabricRef.current) return;
    const { canvas } = fabricRef.current;
    // Hide grid for export
    const gridLines = canvas.getObjects().filter((o: any) => o.isGridLine);
    gridLines.forEach((o: any) => (o.visible = false));
    canvas.discardActiveObject();
    canvas.renderAll();

    // Render at full DPI: create a high-res clone
    const exportW = widthIn * dpi;
    const exportH = heightIn * dpi;
    const scaleFactor = dpi * previewScale; // we rendered preview at previewScale of dpi

    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: scaleFactor, // scale up to full DPI
      quality: 1.0,
      left: 0,
      top: 0,
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    });

    // Restore grid visibility
    gridLines.forEach((o: any) => (o.visible = true));
    canvas.renderAll();

    // Fetch as blob and download
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, `cdc-canvas-${widthIn}x${heightIn}-${dpi}dpi.png`);
    toast.success(`Exported ${widthIn}×${heightIn}" @ ${dpi} DPI (${exportW}×${exportH}px)`);
  };

  return (
    <ToolLayout
      title="Canvas Designer"
      tagline={`Gang sheet builder for DTF/DTG — ${widthIn}×${heightIn}" @ ${dpi} DPI`}
      icon={<LayoutGrid className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <>
          <Button variant="outline" size="sm" onClick={autoArrange} className="gap-2">
            <Wand2 className="h-4 w-4" /> Auto-Arrange
          </Button>
          <Button onClick={handleExport} className="gap-2 bg-accent text-white hover:bg-accent/90">
            <Download className="h-4 w-4" /> Export PNG
          </Button>
        </>
      }
      sidebar={
        <>
          <ToolSection title="Canvas Size">
            <div className="space-y-3">
              <Select value={sizeLabel} onValueChange={applySizePreset}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRINT_SIZES.map((p) => (
                    <SelectItem key={p.label} value={p.label}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sizeLabel === "Custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Width (in)</Label>
                    <Input
                      type="number"
                      value={widthIn}
                      step="0.25"
                      onChange={(e) => setWidthIn(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height (in)</Label>
                    <Input
                      type="number"
                      value={heightIn}
                      step="0.25"
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs">Export DPI</Label>
                <Select value={String(dpi)} onValueChange={(v) => setDpi(Number(v))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150 DPI (draft)</SelectItem>
                    <SelectItem value="300">300 DPI (standard)</SelectItem>
                    <SelectItem value="600">600 DPI (high)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ToolSection>

          <ToolSection title="Background">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Transparent</Label>
                <Switch checked={transparent} onCheckedChange={setTransparent} />
              </div>
              {!transparent && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
                </div>
              )}
            </div>
          </ToolSection>

          <ToolSection title="Add Content">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2 border-accent/40 hover:bg-accent/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Add Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAddImage(f);
                  e.target.value = "";
                }}
              />
              <Button variant="outline" className="w-full gap-2" onClick={handleAddText}>
                <Type className="h-4 w-4" /> Add Text
              </Button>
            </div>
          </ToolSection>

          {selected && (
            <ToolSection title="Selected Object">
              <div className="space-y-3">
                {selected.text !== undefined && (
                  <>
                    <div>
                      <Label className="text-xs">Text Content</Label>
                      <Input value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs">Font Size</Label>
                        <span className="text-xs text-muted-foreground">{fontSize}px</span>
                      </div>
                      <Slider
                        value={[fontSize]}
                        min={8}
                        max={300}
                        onValueChange={(v) => setFontSize(v[0])}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                        />
                        <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
                      </div>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => rotateSelected(-90)}>
                    <RotateCw className="h-3.5 w-3.5 -scale-x-100" /> -90°
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => rotateSelected(90)}>
                    <RotateCw className="h-3.5 w-3.5" /> +90°
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={duplicateSelected}>
                    <Copy className="h-3.5 w-3.5" /> Duplicate
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={bringToFront}>
                    <BringToFront className="h-3.5 w-3.5" /> Front
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={sendToBack}>
                    <SendToBack className="h-3.5 w-3.5" /> Back
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={deleteSelected}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </ToolSection>
          )}

          <ToolSection title="Grid & Snapping">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show grid</Label>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Grid size (inches)</Label>
                  <span className="text-xs text-muted-foreground">{gridSize}"</span>
                </div>
                <Slider
                  value={[gridSize]}
                  min={0.25}
                  max={4}
                  step={0.25}
                  onValueChange={(v) => setGridSize(v[0])}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Snap to grid</Label>
                <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
              </div>
            </div>
          </ToolSection>

          {layers.length > 0 && (
            <ToolSection title={`Layers (${layers.length})`}>
              <div className="space-y-1">
                {[...layers].reverse().map((l, i) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-2 rounded-md border border-border/50 bg-background/30 px-2 py-1.5 text-xs"
                  >
                    {l.type === "image" ? (
                      <ImageIcon className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Type className="h-3.5 w-3.5 text-accent" />
                    )}
                    <span className="flex-1 truncate">{l.name}</span>
                    <Layers className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{layers.length - i}</span>
                  </div>
                ))}
              </div>
            </ToolSection>
          )}
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center overflow-auto p-6">
        <div className="relative">
          <div className="absolute -top-7 left-0 flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {widthIn}×{heightIn}" ({Math.round(widthIn * dpi)}×{Math.round(heightIn * dpi)}px @ {dpi} DPI)
            </span>
            <span className="text-accent">•</span>
            <span>Preview @ 25% scale</span>
          </div>
          <div
            className={`shadow-2xl ${transparent ? "checker-bg" : ""}`}
            style={{ border: "1px solid var(--border)" }}
            ref={containerRef}
          >
            {!ready && (
              <div className="flex h-64 w-96 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading canvas…</p>
              </div>
            )}
            <canvas ref={canvasElRef} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Grid3x3 className="h-3.5 w-3.5" />
            <span>Drag to move • Corner handles to resize • Top handle to rotate</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
