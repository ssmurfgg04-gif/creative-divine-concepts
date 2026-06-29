/**
 * CDC Design Tools - Shared types and registry
 */

export type ToolId =
  | "canvas-designer"
  | "effects-studio"
  | "ai-design-gen"
  | "color-knockout"
  | "vectorizer"
  | "mockup-generator"
  | "screenshot-fx"
  | "image-upscaler"
  | "sticker-gen"
  | "image-clipper"
  // Existing simple tools from original site
  | "vat-calculator"
  | "image-resizer"
  | "color-palette"
  | "caption-gen"
  | "file-share"
  | "print-converter"
  | "color-separation"
  | "typography-studio";

export interface ToolMeta {
  id: ToolId;
  name: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name
  category: "design" | "print" | "ai" | "utility";
  badge?: "new" | "pro" | "free" | "ai";
  accent?: string;
}

export const TOOLS: ToolMeta[] = [
  {
    id: "canvas-designer",
    name: "Canvas Designer",
    tagline: "Build gang sheets for DTF & DTG printing",
    description:
      "Drag, drop, rotate, and arrange designs on print-ready canvases. Built for 22×12 inch DTF/DTG sheets with auto-arrange and 300 DPI export.",
    icon: "LayoutGrid",
    category: "print",
    badge: "new",
  },
  {
    id: "effects-studio",
    name: "Effects Studio",
    tagline: "Embroidery, glitter, neon, halftone & more",
    description:
      "Apply realistic print effects — embroidery, glitter, halftone, neon, vintage — with live preview. Optimized for T-shirt artwork preview.",
    icon: "Sparkles",
    category: "design",
    badge: "new",
  },
  {
    id: "ai-design-gen",
    name: "AI Design Gen",
    tagline: "Text-to-image design generation",
    description:
      "Generate design artwork from text prompts. Free AI generation tuned for T-shirt graphics, logos, and printable illustrations.",
    icon: "Wand2",
    category: "ai",
    badge: "ai",
  },
  {
    id: "color-knockout",
    name: "Color Knockout",
    tagline: "Remove colors for DTF / DTG prep",
    description:
      "Knockout specific colors from artwork so the garment color shows through. Includes underbase generation and color separation preview.",
    icon: "Droplet",
    category: "print",
    badge: "new",
  },
  {
    id: "vectorizer",
    name: "Vectorizer",
    tagline: "Raster to vector (SVG) with color",
    description:
      "Convert PNG/JPG artwork into clean, scalable SVG vectors with full color support. Perfect for logos, die-cut lines, and screen printing.",
    icon: "PenTool",
    category: "design",
    badge: "new",
  },
  {
    id: "mockup-generator",
    name: "Mockup Generator",
    tagline: "3D rotatable T-shirt mockups",
    description:
      "Place your design on a 3D rotatable T-shirt. Adjust fabric color, lighting, and rotation. Export realistic client previews.",
    icon: "Shirt",
    category: "design",
    badge: "new",
  },
  {
    id: "screenshot-fx",
    name: "ScreenshotFX",
    tagline: "Annotate & enhance screenshots",
    description:
      "Add arrows, highlights, text, and blur to screenshots. Export polished images for tutorials, marketing, and client presentations.",
    icon: "Camera",
    category: "utility",
    badge: "new",
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    tagline: "AI-powered 2x / 4x upscaling",
    description:
      "Upscale low-resolution artwork to print-ready sizes. AI enhancement + sharpening preserves detail for crisp prints.",
    icon: "ZoomIn",
    category: "ai",
    badge: "ai",
  },
  {
    id: "sticker-gen",
    name: "Sticker Gen",
    tagline: "Die-cut sticker sheets with contour",
    description:
      "Upload artwork and auto-generate kiss-cut / die-cut contours with bleed. Export print files and cut paths (SVG, DXF).",
    icon: "Sticker",
    category: "print",
    badge: "new",
  },
  {
    id: "image-clipper",
    name: "Image Clipper",
    tagline: "One-click background removal",
    description:
      "Remove backgrounds instantly with on-device AI. No upload, no API key. Edge refinement for hair, fur, and complex shapes.",
    icon: "Scissors",
    category: "ai",
    badge: "ai",
  },
  // Existing simple tools (icons match original site)
  {
    id: "vat-calculator",
    name: "VAT Calculator",
    tagline: "Finance Engine — Kenya 16% VAT",
    description: "Calculate Kenya VAT instantly. Add or remove 16% VAT from any amount.",
    icon: "Calculator",
    category: "utility",
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    tagline: "Canvas API Engine — Resize for any platform",
    description: "Resize images for any social platform or print spec instantly.",
    icon: "Wrench",
    category: "utility",
  },
  {
    id: "color-palette",
    name: "Color Palette",
    tagline: "HSL Generator Module — Brand colors",
    description: "Generate beautiful brand color palettes using HSL harmony rules.",
    icon: "Sparkles",
    category: "utility",
  },
  {
    id: "caption-gen",
    name: "Caption Gen",
    tagline: "Template Parser v2 — Social captions",
    description: "Create engaging social media captions for any post or platform.",
    icon: "CheckCircle2",
    category: "ai",
  },
  {
    id: "file-share",
    name: "Secure File Share",
    tagline: "Upload & share files securely with expiry",
    description: "Upload documents, images, or designs. Set passwords, download limits, and expiry. Perfect for printing services.",
    icon: "Shield",
    category: "utility",
    badge: "new",
  },
  {
    id: "print-converter",
    name: "AI Print Converter",
    tagline: "Convert AI images to print-ready files (300 DPI)",
    description: "Upload AI-generated images and auto-fix: upscale to 300 DPI, remove backgrounds, denoise, sharpen, add bleed. Perfect for DTF/DTG.",
    icon: "Wand2",
    category: "print",
    badge: "new",
  },
  {
    id: "color-separation",
    name: "Color Separation",
    tagline: "Split designs into individual color plates",
    description: "Automatically separate multi-color designs into individual print plates for screen printing, vinyl cutting, and DTF layer prep.",
    icon: "Layers",
    category: "print",
    badge: "new",
  },
  {
    id: "typography-studio",
    name: "Typography Studio",
    tagline: "Design T-shirt text graphics with effects",
    description: "Create bold T-shirt text designs with curated font pairings, letter spacing, and effects (outline, shadow, gradient, distressed, neon).",
    icon: "Type",
    category: "design",
    badge: "new",
  },
];

export const TOOL_CATEGORIES: { id: ToolMeta["category"]; label: string; description: string }[] = [
  { id: "print", label: "Print & DTF/DTG", description: "Tools built for T-shirt printers" },
  { id: "design", label: "Design", description: "Creative design power tools" },
  { id: "ai", label: "AI-Powered", description: "Free AI features for non-designers" },
  { id: "utility", label: "Utilities", description: "Quick everyday helpers" },
];

// Print sizes commonly used by CDC for DTF/DTG (in inches at 300 DPI)
export const PRINT_SIZES = [
  // DTF Gang Sheets (most common)
  { label: "DTF Gang Sheet 22×12", w: 22, h: 12, type: "DTF" },
  { label: "DTF Gang Sheet 22×19", w: 22, h: 19, type: "DTF" },
  { label: "DTF Gang Sheet 22×24", w: 22, h: 24, type: "DTF" },
  { label: "DTF Gang Sheet 22×48", w: 22, h: 48, type: "DTF" },
  { label: "DTF Gang Sheet 22×60", w: 22, h: 60, type: "DTF" },
  { label: "DTF Gang Sheet 22×120", w: 22, h: 120, type: "DTF" },
  // DTG
  { label: "DTG A4 (8.27×11.69)", w: 8.27, h: 11.69, type: "DTG" },
  { label: "DTG Letter (8.5×11)", w: 8.5, h: 11, type: "DTG" },
  { label: "DTG A3 (11.69×16.54)", w: 11.69, h: 16.54, type: "DTG" },
  // Apparel placements
  { label: "T-shirt Front (14×16)", w: 14, h: 16, type: "Apparel" },
  { label: "T-shirt Back (14×18)", w: 14, h: 18, type: "Apparel" },
  { label: "T-shirt Full Front (16×20)", w: 16, h: 20, type: "Apparel" },
  { label: "T-shirt Youth (10×12)", w: 10, h: 12, type: "Apparel" },
  { label: "Pocket (4×4)", w: 4, h: 4, type: "Apparel" },
  { label: "Sleeve (3×11)", w: 3, h: 11, type: "Apparel" },
  { label: "Hoodie Front (16×20)", w: 16, h: 20, type: "Apparel" },
  { label: "Hoodie Pocket (6×6)", w: 6, h: 6, type: "Apparel" },
  // Caps & accessories
  { label: "Cap Front (5×2.5)", w: 5, h: 2.5, type: "Cap" },
  { label: "Cap Side (2.5×2.5)", w: 2.5, h: 2.5, type: "Cap" },
  { label: "Cap Back (5×3)", w: 5, h: 3, type: "Cap" },
  // Bags & other
  { label: "Tote Bag (14×16)", w: 14, h: 16, type: "Bag" },
  { label: "Mug Wrap (8×3.5)", w: 8, h: 3.5, type: "Mug" },
  { label: "Banner (36×96)", w: 36, h: 96, type: "Banner" },
  // Custom
  { label: "Custom", w: 0, h: 0, type: "Custom" },
];
