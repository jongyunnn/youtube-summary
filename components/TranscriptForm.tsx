"use client";

import { useState } from "react";
import TranscriptResult from "./TranscriptResult";
import TranscriptText from "./TranscriptText";
import { extractVideoId } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Transcript {
  text: string;
  duration: number;
  offset: number;
}

type ViewMode = "timeline" | "text";

export default function TranscriptForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  
  // Timeline mode states
  const [timelineTranslations, setTimelineTranslations] = useState<string[]>([]);
  const [timelineSummary, setTimelineSummary] = useState<string>("");
  const [timelineTranslating, setTimelineTranslating] = useState(false);
  
  // Text mode states
  const [textTranslation, setTextTranslation] = useState<string>("");
  const [textSummary, setTextSummary] = useState<string>("");
  const [textTranslating, setTextTranslating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const videoId = extractVideoId(url);

      if (!videoId) {
        throw new Error("올바른 YouTube URL을 입력해주세요.");
      }

      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error("자막을 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setTranscripts(data.transcripts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold dark:text-gray-100">
            YouTube 자막 추출기
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <div className="w-full grid grid-cols-[1fr_108.555px] gap-3">
                <Input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <Button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full"
                >
                  {loading ? "처리중..." : "자막 가져오기"}
                </Button>
              </div>
            </div>
          </form>
          {error && (
            <div className="p-4 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {transcripts.length > 0 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setViewMode("text")}
                variant={viewMode === "text" ? "default" : "ghost"}
              >
                텍스트
              </Button>
              <Button
                size="sm"
                onClick={() => setViewMode("timeline")}
                variant={viewMode === "timeline" ? "default" : "ghost"}
              >
                타임라인
              </Button>
            </div>

            {viewMode === "timeline" ? (
              <TranscriptResult
                transcripts={transcripts}
                translations={timelineTranslations}
                summary={timelineSummary}
                onTranslate={async () => {
                  setTimelineTranslating(true);
                  try {
                    const response = await fetch("/api/translate", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        transcripts,
                        mode: "timeline",
                      }),
                    });

                    if (!response.ok) throw new Error("Translation failed");

                    const data = await response.json();
                    setTimelineTranslations(data.translations);
                    setTimelineSummary(data.summary);
                  } catch (error) {
                    console.error("Translation error:", error);
                  } finally {
                    setTimelineTranslating(false);
                  }
                }}
                translating={timelineTranslating}
              />
            ) : (
              <TranscriptText
                transcripts={transcripts}
                translation={textTranslation}
                summary={textSummary}
                onTranslate={async () => {
                  setTextTranslating(true);
                  try {
                    const response = await fetch("/api/translate", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        transcripts,
                        mode: "text",
                      }),
                    });

                    if (!response.ok) throw new Error("Translation failed");

                    const data = await response.json();
                    setTextTranslation(data.translations[0]);
                    setTextSummary(data.summary);
                  } catch (error) {
                    console.error("Translation error:", error);
                  } finally {
                    setTextTranslating(false);
                  }
                }}
                translating={textTranslating}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
