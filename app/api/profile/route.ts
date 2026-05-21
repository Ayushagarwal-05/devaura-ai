import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.daily.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_DEV_API_KEY}`,
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              queryType {
                fields {
                  name
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}