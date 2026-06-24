import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/ai-edit
 * Body: { prompt: string, image: string (data URL), size? }
 * Returns: { image: string (data URL) }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body?.prompt || "").trim();
    const image = String(body?.image || "").trim();
    const size = (body?.size as any) || "1024x1024";

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Prompt and image are required" },
        { status: 400 },
      );
    }

    const base64Match = image.match(/^data:image\/\w+;base64,(.+)$/);
    const base64 = base64Match ? base64Match[1] : image;

    const zai = await ZAI.create();
    const result = await zai.images.generations.edit({
      prompt,
      image: base64,
      size,
    });

    if (!result?.data?.[0]?.base64) {
      return NextResponse.json({ error: "Image edit failed" }, { status: 500 });
    }

    const dataUrl = `data:image/png;base64,${result.data[0].base64}`;
    return NextResponse.json({ image: dataUrl });
  } catch (err: any) {
    console.error("[/api/ai-edit] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to edit image" },
      { status: 500 },
    );
  }
}
