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

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(
      `https://app.daily.dev/${username}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      }
    );

    clearTimeout(timeout);

    const html = await response.text();

    if (!response.ok || !html) {
      return NextResponse.json(
        { error: "Failed to fetch daily.dev profile" },
        { status: 500 }
      );
    }

    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
    );

    if (!match) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    let json;

    try {
      json = JSON.parse(match[1]);
    } catch {
      return NextResponse.json(
        { error: "Invalid daily.dev response" },
        { status: 500 }
      );
    }

    const profile = json?.props?.pageProps?.user;

    if (!profile) {
      return NextResponse.json(
        { error: "Profile data missing" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}