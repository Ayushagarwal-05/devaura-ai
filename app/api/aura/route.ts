import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // ── Fetch developer profile ─────────────────────────────
    const profileRes = await fetch(
      `${new URL(request.url).origin}/api/profile?username=${encodeURIComponent(username)}`
    );

    if (!profileRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch developer profile" },
        { status: 502 }
      );
    }

    const profile = await profileRes.json();

    // ── Build AI prompt ─────────────────────────────────────
    const prompt = `
You are DevAura AI — an elite developer identity intelligence system.

Your task is to generate a cinematic, technically accurate developer identity profile.

Analyze the developer deeply based on:
- Bio and README content
- Interests and technology patterns
- Engineering focus and stack preferences
- Learning direction and builder behavior

Developer Profile:
Name: ${profile.name ?? "Unknown"}
Bio: ${profile.bio ?? "No bio provided"}
README: ${profile.readmeHtml ?? "No README provided"}
Topics: ${profile.topics?.join(", ") ?? "None"}
Tech Stack: ${profile.techStack?.join(", ") ?? "None"}
Recent Interests: ${profile.interests?.join(", ") ?? "None"}

IMPORTANT RULES:
- Strengths MUST feel personalized and technically believable
- Avoid generic motivational wording
- Archetypes should sound premium and futuristic
- Predictions should feel realistic but cinematic
- Output should feel like an elite developer scouting system
- Strengths should directly reflect the user's stack and interests
- The "vibe" field should be 2-4 words capturing the developer's energy

SCORING RULES:
- auraScore must be an integer between 70 and 99
- Beginner but active users: 70–82
- Intermediate builders: 83–89
- Strong technical creators: 90–95
- Exceptional engineering profiles: 96–99

Return ONLY valid JSON with no markdown, no backticks, no explanation.

Format:
{
  "archetype": "string — cinematic title for the developer type",
  "summary": "string — 2-3 sentence personality analysis",
  "strengths": ["string", "string", "string"],
  "futurePrediction": "string — 1-2 sentence cinematic career trajectory prediction",
  "auraScore": 0,
  "vibe": "string — 2-4 word energy descriptor"
}
`.trim();

    // ── Call OpenRouter ─────────────────────────────────────
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // ── Clean and parse JSON ────────────────────────────────
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const auraData = JSON.parse(cleaned);

    // ── Validate required fields ────────────────────────────
    const required = ["archetype", "summary", "strengths", "futurePrediction", "auraScore", "vibe"];
    for (const field of required) {
      if (!(field in auraData)) {
        throw new Error(`Missing required field in AI response: ${field}`);
      }
    }

    return NextResponse.json({ profile, aura: auraData });

  } catch (error) {
    console.error("[aura/route] Error:", error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}