import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/ai-design
 * Body: { prompt: string, size?: "1024x1024" | "768x1344" | "864x1152" | "1344x768" | "1152x864" | "1440x720" | "720x1440" }
 * Returns: { image: string (data URL), created: number }
 *
 * Generates a design image from a text prompt using the free z-ai-web-dev-sdk.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();
    const size = (body?.size as any) || "1024x1024";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Enhance prompt for print-ready T-shirt design
    const enhancedPrompt = `${prompt}. Clean, high-contrast, suitable for T-shirt printing, isolated on plain background, professional graphic design, vector-style, bold colors`;

    const zai = await ZAI.create();
    const result = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size,
    });

    if (!result?.data?.[0]?.base64) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    const dataUrl = `data:image/png;base64,${result.data[0].base64}`;
    return NextResponse.json({ image: dataUrl, created: result.created });
  } catch (err: any) {
    console.error("[/api/ai-design] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
