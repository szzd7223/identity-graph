import { NextResponse } from "next/server";

function sanitizeRawData(data: any) {
  if (!data || typeof data !== "object") return data;

  const { id, profileId, createdAt, updatedAt, ...cleanProfile } = data;

  return {
    ...cleanProfile,
    experiences: (cleanProfile.experiences || []).map(({ id, profileId, createdAt, updatedAt, ...rest }: any) => rest),
    education: (cleanProfile.education || []).map(({ id, profileId, createdAt, updatedAt, ...rest }: any) => rest),
    projects: (cleanProfile.projects || []).map(({ id, profileId, createdAt, updatedAt, ...rest }: any) => rest),
    skills: (cleanProfile.skills || []).map(({ id, profileId, createdAt, updatedAt, ...rest }: any) => rest),
  };
}

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

    const rawData = await res.json();
    const cleanData = sanitizeRawData(rawData);

    // Return clean JSON schema optimized for AI web fetching (without internal IDs)
    return NextResponse.json(cleanData, {
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
