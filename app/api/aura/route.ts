import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);

    const username =
      searchParams.get("username") || "ayu_buildss";

    const response = await fetch(
      `http://localhost:3000/api/profile?username=${username}`
    );

    const profile = await response.json();

    const prompt = `
You are an AI that predicts developer archetypes.

Analyze this developer profile:

Name: ${profile.name}
Bio: ${profile.bio}
README: ${profile.readmeHtml}

Return ONLY valid JSON.

IMPORTANT:
- auraScore MUST be an integer from 70 to 99
- The score represents an elite AI-generated developer potential score
- Beginner profiles should still receive 70+
- Strong builders/open-source developers should receive 85+
- Exceptional profiles can receive 95+
- Never return single digit or low scores
- Scores should feel premium, believable, and cinematic

Format:
{
  "archetype": "",
  "summary": "",
  "strengths": ["", "", ""],
  "futurePrediction": "",
  "auraScore": 0,
  "vibe": ""
}
`;

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const raw =
      completion.choices[0].message.content || "";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const auraData = JSON.parse(cleaned);

    return NextResponse.json({
      profile,
      aura: auraData,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}