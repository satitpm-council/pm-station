import { submitSongRequest } from "@/features/songrequests";
import { getTrack } from "@/music-engine/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { sucess: false, error: "No ID provided" },
      { status: 400 }
    );
  }
  const track = await getTrack(id);
  try {
    await submitSongRequest(track);
    return NextResponse.json({ track });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { sucess: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
