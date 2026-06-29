"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { ToolId } from "@/lib/tools";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HomeView } from "@/components/site/HomeView";
import { ToolsHubView } from "@/components/site/ToolsHubView";
import { ServicesView, PricingView, AboutView, ContactView, WorkView } from "@/components/site/InfoViews";
import { TeachingPortal } from "@/components/site/TeachingPortal";
import { BlogView } from "@/components/site/BlogView";
import { LocalSEOPage } from "@/components/site/LocalSEOPages";
import {
  VATCalculator,
  ImageResizer,
  ColorPalette,
  CaptionGen,
} from "@/components/tools/SimpleTools";

// Lazy-load heavy tool components so they only load when needed
const CanvasDesigner = lazy(() => import("@/components/tools/CanvasDesigner").then((m) => ({ default: m.CanvasDesigner })));
const EffectsStudio = lazy(() => import("@/components/tools/EffectsStudio").then((m) => ({ default: m.EffectsStudio })));
const AIDesignGen = lazy(() => import("@/components/tools/AIDesignGen").then((m) => ({ default: m.AIDesignGen })));
const ColorKnockout = lazy(() => import("@/components/tools/ColorKnockout").then((m) => ({ default: m.ColorKnockout })));
const Vectorizer = lazy(() => import("@/components/tools/Vectorizer").then((m) => ({ default: m.Vectorizer })));
const MockupGenerator = lazy(() => import("@/components/tools/MockupGenerator").then((m) => ({ default: m.MockupGenerator })));
const ScreenshotFX = lazy(() => import("@/components/tools/ScreenshotFX").then((m) => ({ default: m.ScreenshotFX })));
const ImageUpscaler = lazy(() => import("@/components/tools/ImageUpscaler").then((m) => ({ default: m.ImageUpscaler })));
const StickerGen = lazy(() => import("@/components/tools/StickerGen").then((m) => ({ default: m.StickerGen })));
const ImageClipper = lazy(() => import("@/components/tools/ImageClipper").then((m) => ({ default: m.ImageClipper })));
const FileShare = lazy(() => import("@/components/tools/FileShare").then((m) => ({ default: m.FileShare })));
const PrintConverter = lazy(() => import("@/components/tools/PrintConverter").then((m) => ({ default: m.PrintConverter })));
const ColorSeparation = lazy(() => import("@/components/tools/ColorSeparation").then((m) => ({ default: m.ColorSeparation })));
const TypographyStudio = lazy(() => import("@/components/tools/TypographyStudio").then((m) => ({ default: m.TypographyStudio })));
const MannequinDressUp = lazy(() => import("@/components/tools/MannequinDressUp").then((m) => ({ default: m.MannequinDressUp })));

type View = "home" | "tools" | "services" | "pricing" | "about" | "contact" | "academy" | "blog" | "work" | "tool" | "local";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [localPageId, setLocalPageId] = useState<string>("");

  // Sync with URL hash
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("tool/")) {
        const toolId = hash.replace("tool/", "") as ToolId;
        setActiveTool(toolId);
        setView("tool");
      } else if (hash.startsWith("local/")) {
        const pageId = hash.replace("local/", "");
        setLocalPageId(pageId);
        setView("local");
      } else if (["home", "tools", "services", "pricing", "about", "contact", "academy", "blog", "work"].includes(hash)) {
        setActiveTool(null);
        setView(hash as View);
      } else {
        setView("home");
        setActiveTool(null);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const navigate = (v: any) => {
    setView(v);
    setActiveTool(null);
    if (v === "home") {
      history.replaceState(null, "", "#home");
    } else {
      history.replaceState(null, "", `#${v}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openTool = (id: ToolId) => {
    setActiveTool(id);
    setView("tool");
    history.replaceState(null, "", `#tool/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToTools = () => {
    navigate("tools");
  };

  // Render active tool
  const renderTool = () => {
    if (!activeTool) return null;
    const props = { onBack: backToTools };
    const toolMap: Record<ToolId, JSX.Element> = {
      "canvas-designer": <CanvasDesigner {...props} />,
      "effects-studio": <EffectsStudio {...props} />,
      "ai-design-gen": <AIDesignGen {...props} />,
      "color-knockout": <ColorKnockout {...props} />,
      "vectorizer": <Vectorizer {...props} />,
      "mockup-generator": <MockupGenerator {...props} />,
      "screenshot-fx": <ScreenshotFX {...props} />,
      "image-upscaler": <ImageUpscaler {...props} />,
      "sticker-gen": <StickerGen {...props} />,
      "image-clipper": <ImageClipper {...props} />,
      "vat-calculator": <VATCalculator {...props} />,
      "image-resizer": <ImageResizer {...props} />,
      "color-palette": <ColorPalette {...props} />,
      "caption-gen": <CaptionGen {...props} />,
      "file-share": <FileShare {...props} />,
      "print-converter": <PrintConverter {...props} />,
      "color-separation": <ColorSeparation {...props} />,
      "typography-studio": <TypographyStudio {...props} />,
      "mannequin-dressup": <MannequinDressUp {...props} />,
    };
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading tool…</p>
            </div>
          </div>
        }
      >
        {toolMap[activeTool]}
      </Suspense>
    );
  };

  // Full-screen tool view
  if (view === "tool" && activeTool) {
    return renderTool()!;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onNavigate={navigate} onOpenTool={openTool} currentView={view} />
      <main className="flex-1" id="main-content">
        {view === "home" && <HomeView onNavigate={navigate} onOpenTool={openTool} />}
        {view === "tools" && <ToolsHubView onOpenTool={openTool} />}
        {view === "work" && <WorkView onNavigate={navigate} />}
        {view === "services" && <ServicesView onNavigate={navigate} />}
        {view === "pricing" && <PricingView onNavigate={navigate} />}
        {view === "about" && <AboutView onNavigate={navigate} />}
        {view === "academy" && <TeachingPortal onNavigate={navigate} />}
        {view === "blog" && <BlogView onNavigate={navigate} />}
        {view === "local" && <LocalSEOPage onNavigate={navigate} pageId={localPageId} />}
        {view === "contact" && <ContactView onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
