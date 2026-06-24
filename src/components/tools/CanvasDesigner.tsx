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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Bold,
  Italic,
  Ruler,
  Save,
  FolderOpen,
  FlipHorizontal2,
  FlipVertical2,
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
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [ready, setReady] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [showSafeMargin, setShowSafeMargin] = useState(false);

  // Preview scale (canvas displayed smaller than actual print resolution)
  const previewScale = 0.25; // shows ~75 dpi preview for 300 dpi output

  // Initialize fabric canvas
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fabricModule = await import("fabric");
        const fabric = (fabricModule as any).default || fabricModule;
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
      } catch (err: any) {
        console.error("Fabric init error:", err);
        toast.error(`Canvas init failed: ${err?.message || "unknown error"}`);
      }
    })();
    return () => {
      cancelled = true;
      if (fabricRef.current?.canvas) {
        try {
          fabricRef.current.canvas.dispose();
        } catch (e) {
          console.warn("Fabric dispose error:", e);
        }
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

    // SVG support — fabric can load SVG via loadSVGFromString
    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      try {
        const svgText = await file.text();
        const result = await fabric.loadSVGFromString(svgText);
        const obj = fabric.util.groupSVGElements(result.objects, result.options);
        const maxW = canvas.getWidth() * 0.5;
        const maxH = canvas.getHeight() * 0.5;
        const scale = Math.min(maxW / (obj.width || 100), maxH / (obj.height || 100), 1);
        obj.scale(scale);
        obj.set({
          left: canvas.getWidth() / 2 - ((obj.width || 100) * scale) / 2,
          top: canvas.getHeight() / 2 - ((obj.height || 100) * scale) / 2,
          cornerColor: "#f36a21",
          cornerStrokeColor: "#f36a21",
          borderColor: "#f36a21",
          transparentCorners: false,
          cornerSize: 10,
        });
        (obj as any).cdcId = `svg-${Date.now()}`;
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        syncLayers();
        toast.success("SVG added (vector preserved)");
        return;
      } catch (err: any) {
        toast.error(`SVG load failed: ${err.message}`);
        return;
      }
    }

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
      fontFamily: fontFamily,
      fontSize: fontSize * previewScale,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      textAlign: textAlign,
      fill: textColor,
      cornerColor: "#f36a21",
      cornerStrokeColor: "#f36a21",
      borderColor: "#f36a21",
      transparentCorners: false,
      cornerSize: 10,
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
      setFontFamily(selected.fontFamily || "Inter");
      setFontWeight(selected.fontWeight || "normal");
      setFontStyle(selected.fontStyle || "normal");
      setTextAlign((selected.textAlign || "left") as any);
    }
  }, [selected]);

  // Sync font family / weight / style / align back to selected text
  useEffect(() => {
    if (!selected || !fabricRef.current) return;
    if (selected.text !== undefined) {
      selected.set({ fontFamily, fontWeight, fontStyle, textAlign });
      fabricRef.current.canvas.renderAll();
    }
  }, [fontFamily, fontWeight, fontStyle, textAlign]);

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

  const flipSelected = (axis: "x" | "y") => {
    if (!fabricRef.current || !selected) return;
    if (axis === "x") selected.set("flipX", !selected.flipX);
    else selected.set("flipY", !selected.flipY);
    fabricRef.current.canvas.renderAll();
  };

  // Alignment tools — align selected object on the canvas
  const alignSelected = (type: "left" | "centerH" | "right" | "top" | "centerV" | "bottom") => {
    if (!fabricRef.current || !selected) return;
    const { canvas } = fabricRef.current;
    const w = canvas.getWidth();
    const h = canvas.getHeight();
    const bound = selected.getBoundingRect();
    switch (type) {
      case "left":
        selected.set({ left: (selected.left || 0) - bound.left });
        break;
      case "centerH":
        selected.set({ left: w / 2 - bound.width / 2 - bound.left + (selected.left || 0) });
        break;
      case "right":
        selected.set({ left: w - bound.width - bound.left + (selected.left || 0) });
        break;
      case "top":
        selected.set({ top: (selected.top || 0) - bound.top });
        break;
      case "centerV":
        selected.set({ top: h / 2 - bound.height / 2 - bound.top + (selected.top || 0) });
        break;
      case "bottom":
        selected.set({ top: h - bound.height - bound.top + (selected.top || 0) });
        break;
    }
    selected.setCoords();
    canvas.renderAll();
  };

  // Save / Load project as JSON
  const saveProject = () => {
    if (!fabricRef.current) return;
    const { canvas } = fabricRef.current;
    const data = JSON.stringify({
      version: 1,
      width: widthIn,
      height: heightIn,
      dpi,
      bgColor: transparent ? "transparent" : bgColor,
      objects: canvas.toJSON(["cdcId", "isGridLine"]).objects.filter((o: any) => !o.isGridLine),
    });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cdc-canvas-project-${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Project saved");
  };

  const loadProject = async (file: File) => {
    if (!fabricRef.current) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { fabric, canvas } = fabricRef.current;
      // Clear existing
      canvas.getObjects().forEach((o: any) => canvas.remove(o));
      setWidthIn(data.width || 22);
      setHeightIn(data.height || 12);
      setDpi(data.dpi || 300);
      setTransparent(data.bgColor === "transparent");
      if (data.bgColor !== "transparent") setBgColor(data.bgColor || "#ffffff");
      canvas.loadFromJSON({ objects: data.objects, background: data.bgColor === "transparent" ? "" : data.bgColor }, () => {
        canvas.renderAll();
        syncLayers();
        toast.success("Project loaded");
      });
    } catch (err: any) {
      toast.error(`Load failed: ${err.message}`);
    }
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

  const handleExport = async (format: "png" | "svg" = "png") => {
    if (!fabricRef.current) return;
    const { canvas } = fabricRef.current;
    // Hide grid for export
    const gridLines = canvas.getObjects().filter((o: any) => o.isGridLine);
    gridLines.forEach((o: any) => (o.visible = false));
    canvas.discardActiveObject();
    canvas.renderAll();

    if (format === "svg") {
      // Export as SVG (vector)
      const svg = canvas.toSVG();
      // Restore grid visibility
      gridLines.forEach((o: any) => (o.visible = true));
      canvas.renderAll();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cdc-canvas-${widthIn}x${heightIn}.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Exported SVG (${widthIn}×${heightIn}")`);
      return;
    }

    // PNG export at full DPI
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
          <Button variant="outline" size="sm" onClick={() => handleExport("svg")} className="gap-2">
            <Download className="h-4 w-4" /> SVG
          </Button>
          <Button onClick={() => handleExport("png")} className="gap-2 bg-primary text-white hover:bg-primary/90">
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
                className="w-full gap-2 border-primary/40 hover:bg-primary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Add Image / SVG
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,image/svg+xml"
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
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={saveProject}>
                  <Save className="h-3.5 w-3.5" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-xs"
                  onClick={() => document.getElementById("load-project-input")?.click()}
                >
                  <FolderOpen className="h-3.5 w-3.5" /> Load
                </Button>
                <input
                  id="load-project-input"
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) loadProject(f);
                    e.target.value = "";
                  }}
                />
              </div>
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
                    <div>
                      <Label className="text-xs">Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter (Body)</SelectItem>
                          <SelectItem value="League Spartan">League Spartan (Display)</SelectItem>
                          <SelectItem value="DM Sans">DM Sans</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Impact">Impact</SelectItem>
                          <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                          <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={fontWeight === "bold" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant={fontStyle === "italic" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
                      >
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant={textAlign === "left" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTextAlign("left")}
                      >
                        <AlignLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant={textAlign === "center" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTextAlign("center")}
                      >
                        <AlignCenter className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant={textAlign === "right" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTextAlign("right")}
                      >
                        <AlignRight className="h-3.5 w-3.5" />
                      </Button>
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
                {/* Alignment tools */}
                <div>
                  <Label className="text-xs mb-1 block">Align on Canvas</Label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("left")} title="Align left">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("centerH")} title="Center horizontally">
                      <AlignCenter className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("right")} title="Align right">
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("top")} title="Align top">
                      <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("centerV")} title="Center vertically">
                      <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => alignSelected("bottom")} title="Align bottom">
                      <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => rotateSelected(-90)}>
                    <RotateCw className="h-3.5 w-3.5 -scale-x-100" /> -90°
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => rotateSelected(90)}>
                    <RotateCw className="h-3.5 w-3.5" /> +90°
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => flipSelected("x")}>
                    <FlipHorizontal2 className="h-3.5 w-3.5" /> Flip H
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => flipSelected("y")}>
                    <FlipVertical2 className="h-3.5 w-3.5" /> Flip V
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
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Type className="h-3.5 w-3.5 text-primary" />
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
            <span className="text-primary">•</span>
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
