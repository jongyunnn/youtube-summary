import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";

export async function POST(request: Request) {
  try {
    const { videoId, lang } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }
    const transcripts = await getSubtitles({
      videoID: videoId,
      lang,
    });

    return NextResponse.json({ transcripts });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
