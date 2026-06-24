"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Shirt, Upload, Download, RotateCw, Sun, Palette, Coffee, ShoppingBag, HardHat } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fileToDataURL, loadImage, canvasToBlob, downloadBlob } from "@/lib/canvas-utils";
import { PRODUCT_TEMPLATES, PRODUCT_LIST } from "./ProductTemplates";

interface MockupGeneratorProps {
  onBack: () => void;
}

const PRODUCT_COLORS = [
  { name: "White", hex: "#f5f5f5" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Heather Gray", hex: "#9ca3af" },
  { name: "Navy", hex: "#1e293b" },
  { name: "Royal Blue", hex: "#1d4ed8" },
  { name: "Red", hex: "#dc2626" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#f36a21" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Sand", hex: "#e2c9a0" },
  { name: "Teal", hex: "#0d9488" },
];

const PRODUCT_ICONS: Record<string, any> = {
  tshirt: Shirt,
  hoodie: Shirt,
  mug: Coffee,
  tote: ShoppingBag,
  cap: HardHat,
};

const BG_PRESETS = [
  { name: "Studio", hex: "#f0ede8" },
  { name: "Dark", hex: "#1a1a2e" },
  { name: "Gradient", hex: "gradient" },
  { name: "Transparent", hex: "transparent" },
];

export function MockupGenerator({ onBack }: MockupGeneratorProps) {
  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>("tshirt");
  const [productColor, setProductColor] = useState("#f5f5f5");
  const [designScale, setDesignScale] = useState(0.8);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0);
  const [rotation, setRotation] = useState(0); // CSS 3D rotation Y
  const [bgColor, setBgColor] = useState("#f0ede8");
  const [exporting, setExporting] = useState(false);
  const [renderMode, setRenderMode] = useState<"svg" | "canvas">("canvas");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const designImageRef = useRef<HTMLImageElement | null>(null);

  const product = PRODUCT_TEMPLATES[productId];
  const ProductIcon = PRODUCT_ICONS[productId] || Shirt;

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = await fileToDataURL(file);
    const img = await loadImage(url);
    designImageRef.current = img;
    setDesignUrl(url);
  }, []);

  // Render to canvas with compositing
  const renderToCanvas = useCallback(async () => {
    if (!canvasRef.current || !svgWrapperRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 1200;
    canvas.height = 1200;

    // Background
    if (bgColor === "transparent") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (bgColor === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#f5f0e8");
      grad.addColorStop(1, "#e8dfd0");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render the SVG product to an image
    const svgEl = svgWrapperRef.current.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const svgImg = new Image();
    svgImg.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {
      svgImg.onload = () => resolve();
      svgImg.onerror = (e) => reject(e);
      svgImg.src = svgUrl;
    });

    // Draw product SVG
    const productW = 900;
    const productH = 900;
    const productX = (canvas.width - productW) / 2;
    const productY = (canvas.height - productH) / 2;
    ctx.drawImage(svgImg, productX, productY, productW, productH);
    URL.revokeObjectURL(svgUrl);

    // Composite design onto product
    if (designImageRef.current) {
      const area = product.designArea;
      // Scale design area from SVG coords (600x600) to canvas coords (900x900)
      const scale = productW / 600;
      const areaX = productX + area.x * scale;
      const areaY = productY + area.y * scale;
      const areaW = area.width * scale;
      const areaH = area.height * scale;

      const img = designImageRef.current;
      const ar = img.naturalWidth / img.naturalHeight;
      let dw, dh;
      // Fit design within the area, scaled by designScale
      if (ar > 1) {
        dw = areaW * designScale;
        dh = dw / ar;
      } else {
        dh = areaH * designScale;
        dw = dh * ar;
      }
      const dx = areaX + (areaW - dw) / 2 + designX * areaW * 0.3;
      const dy = areaY + (areaH - dh) / 2 - designY * areaH * 0.3;

      // Use multiply blend mode for dark fabrics, normal for light
      const isDark = isColorDark(productColor);
      ctx.save();
      // Clip to design area so design doesn't overflow product edges
      ctx.beginPath();
      ctx.rect(areaX, areaY, areaW, areaH);
      ctx.clip();

      if (isDark) {
        // For dark fabrics: use "screen" or "lighter" blend so design shows
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // For light fabrics: use "multiply" so fabric folds show through
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(img, dx, dy, dw, dh);
      }
      ctx.restore();

      // Add subtle shadow under design for depth
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.1;
      ctx.drawImage(img, dx + 2, dy + 2, dw, dh);
      ctx.restore();
    }
  }, [productId, productColor, designUrl, designScale, designX, designY, bgColor, product]);

  // Re-render when anything changes
  useEffect(() => {
    if (renderMode === "canvas") {
      renderToCanvas().catch((err) => {
        console.error("Render error:", err);
      });
    }
  }, [renderToCanvas, renderMode]);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      // Ensure latest render
      await renderToCanvas();
      const blob = await canvasToBlob(canvasRef.current, "image/png");
      downloadBlob(blob, `cdc-mockup-${productId}-${Date.now()}.png`);
      toast.success("Mockup exported!");
    } catch (err: any) {
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const isColorDark = (hex: string) => {
    const m = hex.replace("#", "").match(/.{2}/g);
    if (!m) return false;
    const r = parseInt(m[0], 16);
    const g = parseInt(m[1], 16);
    const b = parseInt(m[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };

  return (
    <ToolLayout
      title="Mockup Generator"
      tagline="Photorealistic product mockups for client proofs"
      icon={<Shirt className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <Button onClick={handleExport} disabled={exporting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4" /> Export PNG
        </Button>
      }
      sidebar={
        <>
          <ToolSection title="Upload Design">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/40 hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Choose Design
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
              Upload a PNG (ideally transparent). Run through <span className="text-foreground">Image Clipper</span> first for best results.
            </p>
          </ToolSection>

          <ToolSection title="Product Type">
            <div className="grid grid-cols-3 gap-2">
              {PRODUCT_LIST.map((p) => {
                const Icon = PRODUCT_ICONS[p.id] || Shirt;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProductId(p.id)}
                    className={`flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs transition ${
                      productId === p.id
                        ? "border-primary bg-primary/10 text-primary box-glow"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </ToolSection>

          <ToolSection title="Product Color">
            <div className="grid grid-cols-7 gap-1.5">
              {PRODUCT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setProductColor(c.hex)}
                  title={c.name}
                  className={`aspect-square rounded-md border-2 transition ${
                    productColor === c.hex ? "border-primary box-glow scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
              />
              <Input value={productColor} onChange={(e) => setProductColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
            </div>
          </ToolSection>

          {designUrl && (
            <ToolSection title="Design Placement">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Scale</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(designScale * 100)}%</span>
                  </div>
                  <Slider value={[designScale]} min={0.2} max={1.5} step={0.05} onValueChange={(v) => setDesignScale(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Horizontal</Label>
                    <span className="text-xs text-muted-foreground">{designX.toFixed(2)}</span>
                  </div>
                  <Slider value={[designX]} min={-1} max={1} step={0.05} onValueChange={(v) => setDesignX(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Vertical</Label>
                    <span className="text-xs text-muted-foreground">{designY.toFixed(2)}</span>
                  </div>
                  <Slider value={[designY]} min={-1} max={1.5} step={0.05} onValueChange={(v) => setDesignY(v[0])} />
                </div>
              </div>
            </ToolSection>
          )}

          <ToolSection title="Background">
            <div className="grid grid-cols-2 gap-2">
              {BG_PRESETS.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setBgColor(bg.hex)}
                  className={`text-xs rounded-md border px-3 py-2 transition ${
                    bgColor === bg.hex ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  {bg.name}
                </button>
              ))}
            </div>
            {bgColor !== "transparent" && bgColor !== "gradient" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
              </div>
            )}
          </ToolSection>

          <ToolSection title="Tips" defaultOpen={false}>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Use transparent PNGs for best placement</li>
              <li>• Light fabrics use multiply blend (realistic)</li>
              <li>• Dark fabrics use normal blend</li>
              <li>• Adjust scale & position in real-time</li>
              <li>• Export high-res 1200×1200 PNG</li>
              <li>• No expensive physical samples needed!</li>
            </ul>
          </ToolSection>
        </>
      }
    >
      <div className="relative h-full w-full overflow-hidden" style={{ backgroundColor: bgColor === "transparent" ? "#1a1a2e" : bgColor === "gradient" ? "#f0ede8" : bgColor }}>
        {/* Off-screen SVG wrapper for rendering to canvas (must be rendered, not display:none) */}
        <div ref={svgWrapperRef} style={{ position: "absolute", left: "-9999px", top: 0, width: 600, height: 600, pointerEvents: "none" }} aria-hidden="true">
          <svg
            viewBox={product.viewBox}
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="600"
          >
            {product.render(productColor)}
          </svg>
        </div>

        {/* Live preview canvas */}
        <div className="flex h-full w-full items-center justify-center p-6">
          <div
            className="relative"
            style={{
              transform: `perspective(1500px) rotateY(${rotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        {/* Rotation control */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-background/80 px-4 py-2 backdrop-blur">
          <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="range"
            min={-30}
            max={30}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-32 accent-primary"
          />
          <button
            onClick={() => setRotation(0)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Reset
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
