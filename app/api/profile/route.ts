import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.daily.dev/public/v1/profile",
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_DEV_API_KEY}`,
        },
      }
    );

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