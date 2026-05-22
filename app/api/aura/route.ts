import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/profile"
    );

    const profile = await response.json();

    const prompt = `
You are an AI that predicts developer archetypes.

Analyze this developer profile:

Name: ${profile.name}
Bio: ${profile.bio}
README: ${profile.readme}

Return:
1. Archetype title
2. Personality summary
3. Key strengths
4. Future prediction
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

    return NextResponse.json({
      profile,
      aura:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}