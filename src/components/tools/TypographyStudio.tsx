"use client";

import { useCallback, useRef, useState } from "react";
import { Type, Download, Plus, Trash2, Eye, Shuffle } from "lucide-react";
import { ToolLayout, ToolSection, EmptyState } from "@/components/site/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { canvasToBlob, downloadBlob } from "@/lib/canvas-utils";

interface TypographyStudioProps {
  onBack: () => void;
}

const FONT_PAIRINGS = [
  { display: "Impact", body: "Arial", name: "Bold Statement" },
  { display: "Georgia", body: "Helvetica", name: "Classic Editorial" },
  { display: "Courier New", body: "Verdana", name: "Tech Retro" },
  { display: "Comic Sans MS", body: "Trebuchet MS", name: "Playful Casual" },
  { display: "Times New Roman", body: "Arial", name: "Traditional" },
  { display: "Trebuchet MS", body: "Georgia", name: "Modern Clean" },
  { display: "Verdana", body: "Times New Roman", name: "Corporate" },
  { display: "Arial Black", body: "Arial", name: "Heavy Impact" },
];

const TEXT_EFFECTS = [
  { id: "none", name: "None" },
  { id: "outline", name: "Outline Only" },
  { id: "shadow", name: "Drop Shadow" },
  { id: "gradient", name: "Gradient Fill" },
  { id: "distress", name: "Distressed" },
  { id: "neon", name: "Neon Glow" },
];

export function TypographyStudio({ onBack }: TypographyStudioProps) {
  const [text, setText] = useState("YOUR TEXT HERE");
  const [subtext, setSubtext] = useState("Subtitle or tagline");
  const [fontPairing, setFontPairing] = useState(0);
  const [fontSize, setFontSize] = useState(72);
  const [subFontSize, setSubFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#f36a21");
  const [subColor, setSubColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [effect, setEffect] = useState("none");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    const pairing = FONT_PAIRINGS[fontPairing];

    // Main text
    ctx.font = `bold ${fontSize}px ${pairing.display}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Apply letter spacing
    const drawTextWithSpacing = (txt: string, x: number, y: number, font: string, size: number, color: string) => {
      ctx.font = `bold ${size}px ${font}, sans-serif`;
      ctx.fillStyle = color;
      const chars = txt.split("");
      const widths = chars.map((c) => ctx.measureText(c).width);
      const totalWidth = widths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);
      let curX = x - totalWidth / 2;
      chars.forEach((c, i) => {
        if (effect === "outline") {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeText(c, curX + widths[i] / 2, y);
        } else if (effect === "shadow") {
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillText(c, curX + widths[i] / 2 + 4, y + 4);
          ctx.fillStyle = color;
          ctx.fillText(c, curX + widths[i] / 2, y);
        } else if (effect === "gradient") {
          const grad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
          grad.addColorStop(0, color);
          grad.addColorStop(1, bgColor);
          ctx.fillStyle = grad;
          ctx.fillText(c, curX + widths[i] / 2, y);
        } else if (effect === "distress") {
          ctx.fillStyle = color;
          ctx.fillText(c, curX + widths[i] / 2, y);
          // Add random holes
          ctx.fillStyle = bgColor;
          for (let j = 0; j < 10; j++) {
            const rx = curX + Math.random() * widths[i];
            const ry = y + (Math.random() - 0.5) * size;
            ctx.beginPath();
            ctx.arc(rx, ry, Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (effect === "neon") {
          ctx.shadowColor = color;
          ctx.shadowBlur = 20;
          ctx.fillStyle = color;
          ctx.fillText(c, curX + widths[i] / 2, y);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(c, curX + widths[i] / 2, y);
        } else {
          ctx.fillStyle = color;
          ctx.fillText(c, curX + widths[i] / 2, y);
        }
        curX += widths[i] + letterSpacing;
      });
    };

    drawTextWithSpacing(text.toUpperCase(), w / 2, h / 2 - 20, pairing.display, fontSize, textColor);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.font = `${subFontSize}px ${pairing.body}, sans-serif`;
    ctx.fillStyle = subColor;
    ctx.fillText(subtext, w / 2, h / 2 + fontSize / 2 + 10);
  }, [text, subtext, fontPairing, fontSize, subFontSize, textColor, subColor, bgColor, effect, letterSpacing]);

  // Render on any change
  useState(() => {
    render();
  });

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    render();
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, `cdc-typography-${Date.now()}.png`);
    toast.success("Downloaded typography design!");
  };

  const shuffle = () => {
    setFontPairing(Math.floor(Math.random() * FONT_PAIRINGS.length));
    setEffect(TEXT_EFFECTS[Math.floor(Math.random() * (TEXT_EFFECTS.length - 1)) + 1].id);
    const colors = ["#f36a21", "#dc2626", "#1e293b", "#7c3aed", "#166534", "#0d9488"];
    setTextColor(colors[Math.floor(Math.random() * colors.length)]);
    toast.info("Shuffled design!");
  };

  return (
    <ToolLayout
      title="Typography Studio"
      tagline="Design T-shirt text graphics with font pairings and effects"
      icon={<Type className="h-5 w-5" />}
      badge="new"
      onBack={onBack}
      headerActions={
        <>
          <Button variant="outline" size="sm" onClick={shuffle} className="gap-2">
            <Shuffle className="h-4 w-4" /> Shuffle
          </Button>
          <Button onClick={handleDownload} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" /> Download PNG
          </Button>
        </>
      }
      sidebar={
        <>
          <ToolSection title="Text Content">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Main Text</Label>
                <Input value={text} onChange={(e) => setText(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Subtitle</Label>
                <Input value={subtext} onChange={(e) => setSubtext(e.target.value)} className="mt-1" />
              </div>
            </div>
          </ToolSection>

          <ToolSection title="Font Pairing">
            <Select value={String(fontPairing)} onValueChange={(v) => setFontPairing(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_PAIRINGS.map((p, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {p.name} ({p.display})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ToolSection>

          <ToolSection title="Text Effect">
            <Select value={effect} onValueChange={setEffect}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEXT_EFFECTS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ToolSection>

          <ToolSection title="Size & Spacing">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Main Size</Label>
                  <span className="text-xs text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider value={[fontSize]} min={24} max={150} onValueChange={(v) => setFontSize(v[0])} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Subtitle Size</Label>
                  <span className="text-xs text-muted-foreground">{subFontSize}px</span>
                </div>
                <Slider value={[subFontSize]} min={12} max={60} onValueChange={(v) => setSubFontSize(v[0])} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Letter Spacing</Label>
                  <span className="text-xs text-muted-foreground">{letterSpacing}px</span>
                </div>
                <Slider value={[letterSpacing]} min={-5} max={30} onValueChange={(v) => setLetterSpacing(v[0])} />
              </div>
            </div>
          </ToolSection>

          <ToolSection title="Colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs w-16">Text</Label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-border" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-16">Subtitle</Label>
                <input type="color" value={subColor} onChange={(e) => setSubColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-border" />
                <Input value={subColor} onChange={(e) => setSubColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs w-16">Background</Label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-border" />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 flex-1 font-mono text-xs" />
              </div>
            </div>
          </ToolSection>
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="relative">
          <canvas ref={canvasRef} className="max-h-[75vh] max-w-full rounded-lg shadow-2xl border border-border" />
        </div>
      </div>
    </ToolLayout>
  );
}
