import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/caption
 * Body: { topic: string, platform?, tone? }
 * Returns: { captions: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = String(body?.topic || "").trim();
    const platform = String(body?.platform || "instagram").trim();
    const tone = String(body?.tone || "engaging").trim();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const platformGuide: Record<string, string> = {
      instagram: "Instagram: 1-2 short paragraphs, 5-10 relevant hashtags, visual-first hook.",
      twitter: "Twitter/X: max 280 characters, punchy, 1-2 hashtags.",
      facebook: "Facebook: 1-3 sentences, conversational, 0-2 hashtags.",
      linkedin: "LinkedIn: professional tone, 2-4 sentences, value-driven, max 3 hashtags.",
      tiktok: "TikTok: short, trendy, hook in first 5 words, 3-5 trending hashtags.",
    };

    const systemPrompt = `You are a social media copywriter for Creative Divine Concepts, a Kenya-based design and printing studio.
Generate 3 distinct, ready-to-post captions for the given topic.
${platformGuide[platform] || platformGuide.instagram}
Tone: ${tone}.
Output ONLY the captions, separated by "---" on its own line. No numbering, no preamble.`;

    const zai = await ZAI.create();
    const result = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` },
      ],
    });

    const text: string = result?.choices?.[0]?.message?.content || "";
    const captions = text
      .split(/\n*---\n*/)
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (captions.length === 0) {
      return NextResponse.json({ error: "No captions generated" }, { status: 500 });
    }

    return NextResponse.json({ captions });
  } catch (err: any) {
    console.error("[/api/caption] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate captions" },
      { status: 500 },
    );
  }
}
