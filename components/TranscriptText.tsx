import { useState } from "react";
import { decodeHtml } from "@/lib/utils";
import { Button } from "./ui/button";

interface Transcript {
  text: string;
  duration: number;
  offset: number;
}

interface TranscriptTextProps {
  transcripts: Transcript[];
  isKorean?: boolean;
}

export default function TranscriptText({
  transcripts,
  isKorean,
}: TranscriptTextProps) {
  const [translation, setTranslation] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!transcripts || transcripts.length === 0) {
    return null;
  }

  const handleTranslate = async () => {
    setLoading(true);
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
      setTranslation(data.translations[0]);
      setSummary(data.summary);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const combinedText = transcripts.map((t) => decodeHtml(t.text)).join(" ");

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-100">전체 텍스트</h2>
        {!isKorean && (
          <Button onClick={handleTranslate} disabled={loading || !!translation}>
            {translation ? "번역됨" : loading ? "번역중..." : "한국어로 번역"}
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {(translation || loading) && !isKorean && (
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50">
            {summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                  주요 내용 요약
                </h3>
                <div className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {decodeHtml(summary)}
                </div>
              </div>
            )}
            {translation && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                  한국어 번역
                </h3>
                <p className="text-blue-600 dark:text-blue-400 whitespace-pre-wrap leading-relaxed">
                  {decodeHtml(translation)}
                </p>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-blue-600 dark:text-blue-400">
                  번역 및 요약 중...
                </div>
              </div>
            )}
          </div>
        )}
        <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
            {isKorean ? "한글 자막" : "원문"}
          </h3>
          <p className="dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {combinedText}
          </p>
        </div>
      </div>
    </div>
  );
}
