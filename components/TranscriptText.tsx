import { decodeHtml } from "@/lib/utils";
import { Button } from "./ui/button";

interface Transcript {
  text: string;
  duration: number;
  offset: number;
}

interface TranscriptTextProps {
  transcripts: Transcript[];
  translations: string[];
  summary: string;
  onTranslate: () => Promise<void>;
  translating: boolean;
  isKorean?: boolean;
}

export default function TranscriptText({
  transcripts,
  translations,
  summary,
  onTranslate,
  translating,
  isKorean,
}: TranscriptTextProps) {
  if (!transcripts || transcripts.length === 0) {
    return null;
  }

  const combinedText = transcripts.map((t) => decodeHtml(t.text)).join(" ");
  const combinedTranslation = translations
    ?.map((text) => decodeHtml(text))
    .join(" ");

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-gray-100">전체 텍스트</h2>
        {!isKorean && (
          <Button
            onClick={onTranslate}
            disabled={translating || !!combinedTranslation}
          >
            {combinedTranslation
              ? "번역됨"
              : translating
              ? "번역중..."
              : "한국어로 번역"}
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {(combinedTranslation || translating) && !isKorean && (
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
            {combinedTranslation && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                  한국어 번역
                </h3>
                <p className="text-blue-600 dark:text-blue-400 whitespace-pre-wrap leading-relaxed">
                  {combinedTranslation}
                </p>
              </div>
            )}
            {translating && (
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
          <p
            className={`dark:text-gray-200 leading-relaxed ${
              combinedTranslation ? "text-gray-600 dark:text-gray-400" : ""
            }`}
          >
            {combinedText}
          </p>
        </div>
      </div>
    </div>
  );
}
