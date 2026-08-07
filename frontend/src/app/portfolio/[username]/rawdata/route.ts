import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await params;
    const { username } = resolvedParams;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const res = await fetch(`${backendUrl}/profiles/${username}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Portfolio raw data not found for @${username}` },
        { status: 404 }
      );
    }

    const data = await res.json();

    // Return clean JSON schema optimized for AI web fetching
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch raw portfolio data" },
      { status: 500 }
    );
  }
}
