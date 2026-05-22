import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username =
      req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://app.daily.dev/${username}`
    );

    const html = await response.text();

    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
    );

    if (!match) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const json = JSON.parse(match[1]);

    const profile =
      json.props.pageProps.user;

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}